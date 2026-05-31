import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import SummonStream from "../../summon-stream/src/index";
import {
  authorizeSubscription,
  createSummonStreamNodeServer,
} from "../src/index";
import type { PubSubEnvelope, SummonStreamPubSubAdapter } from "../src/types";

const waitFor = async <T>(callback: () => T | undefined, timeoutMs = 2_000): Promise<T> => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = callback();
    if (result !== undefined) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error("Timed out waiting for condition.");
};

describe("summon-stream client/server integration", () => {
  let port = 0;
  let realtime: Awaited<ReturnType<typeof createSummonStreamNodeServer>>["realtime"];
  let closeServer: (() => Promise<void>) | null = null;

  beforeEach(async () => {
    const attached = await createSummonStreamNodeServer({
      app: {
        key: "local-app-key",
        secret: "local-app-secret",
      },
      authorize: ({ channelName }) => {
        if (channelName.startsWith("presence-")) {
          return {
            ok: true,
            userData: {
              memberId: "user-1",
              memberInfo: { name: "Ada" },
            },
          };
        }

        return { ok: true };
      },
    });

    await new Promise<void>((resolve) => attached.server.listen(0, resolve));
    port = (attached.server.address() as { port: number }).port;
    realtime = attached.realtime;
    closeServer = attached.close;
  });

  afterEach(async () => {
    if (closeServer) {
      await closeServer();
    }
  });

  it("connects, authorizes a presence channel, and receives server events", async () => {
    const client = new SummonStream("local-app-key", {
      wsHost: "127.0.0.1",
      wsPort: port,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch,
      wsPath: "/app",
      channelAuthorization: {
        endpoint: `http://127.0.0.1:${port}/realtime/auth`,
      },
    });

    const channel = client.subscribe("presence-room");
    const events: Array<{ text: string }> = [];
    const secondClient = new SummonStream("local-app-key", {
      wsHost: "127.0.0.1",
      wsPort: port,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch,
      wsPath: "/app",
      channelAuthorization: {
        endpoint: `http://127.0.0.1:${port}/realtime/auth`,
      },
    });
    const secondChannel = secondClient.subscribe("presence-room");
    const clientEvents: Array<{ active: boolean; sender?: string }> = [];

    channel.bind("message-created", (payload) => {
      events.push(payload as { text: string });
    });
    secondChannel.bind("client-typing", (payload, metadata) => {
      clientEvents.push({
        ...(payload as { active: boolean }),
        sender: (metadata as { userId?: string } | undefined)?.userId,
      });
    });

    await waitFor(() => (channel.subscribed ? true : undefined));
    await waitFor(() => (secondChannel.subscribed ? true : undefined));

    realtime.publish("presence-room", "message-created", { text: "hello from server" });
    await waitFor(() => (events[0] ? events[0] : undefined));

    const auth = authorizeSubscription({
      appKey: "local-app-key",
      secret: "local-app-secret",
      socketId: "123.456",
      channelName: "presence-room",
      userData: { memberId: "user-1", memberInfo: { name: "Ada" } },
    });

    expect(auth.token.startsWith("local-app-key:")).toBe(true);
    expect(client.userId).toBe("user-1");
    expect(events[0]).toEqual({ text: "hello from server" });

    channel.trigger("client-typing", { active: true });
    await waitFor(() => (clientEvents[0] ? clientEvents[0] : undefined));
    expect(clientEvents[0]).toEqual({ active: true, sender: "user-1" });

    client.disconnect();
    secondClient.disconnect();
  });

  it("supports encrypted channels", async () => {
    await closeServer?.();

    const masterKey = Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");
    const attached = await createSummonStreamNodeServer({
      app: {
        key: "local-app-key",
        secret: "local-app-secret",
        encryptionMasterKeyBase64: masterKey,
      },
      authorize: () => ({ ok: true }),
    });
    await new Promise<void>((resolve) => attached.server.listen(0, resolve));
    port = (attached.server.address() as { port: number }).port;
    realtime = attached.realtime;
    closeServer = attached.close;

    const client = new SummonStream("local-app-key", {
      wsHost: "127.0.0.1",
      wsPort: port,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch,
      wsPath: "/app",
      channelAuthorization: {
        endpoint: `http://127.0.0.1:${port}/realtime/auth`,
      },
    });

    const channel = client.subscribe("private-encrypted-room");
    const events: Array<{ text: string }> = [];
    channel.bind("secret-message", (payload) => {
      events.push(payload as { text: string });
    });

    await waitFor(() => (channel.subscribed ? true : undefined));
    realtime.publish("private-encrypted-room", "secret-message", { text: "encrypted hello" });
    await waitFor(() => (events[0] ? events[0] : undefined));

    expect(events[0]).toEqual({ text: "encrypted hello" });
    client.disconnect();
  });

  it("can fan out across instances through a pubsub adapter", async () => {
    await closeServer?.();

    const handlers = new Set<(envelope: PubSubEnvelope) => void | Promise<void>>();
    const adapter: SummonStreamPubSubAdapter = {
      publish: async (envelope) => {
        for (const handler of handlers) {
          await handler(envelope);
        }
      },
      subscribe: (handler) => {
        handlers.add(handler);
        return () => {
          handlers.delete(handler);
        };
      },
    };

    const attachedA = await createSummonStreamNodeServer({
      app: {
        key: "local-app-key",
        secret: "local-app-secret",
      },
      pubSub: adapter,
    });
    const attachedB = await createSummonStreamNodeServer({
      app: {
        key: "local-app-key",
        secret: "local-app-secret",
      },
      pubSub: adapter,
    });

    await new Promise<void>((resolve) => attachedA.server.listen(0, resolve));
    await new Promise<void>((resolve) => attachedB.server.listen(0, resolve));
    const portA = (attachedA.server.address() as { port: number }).port;
    const portB = (attachedB.server.address() as { port: number }).port;
    closeServer = async () => {
      await attachedA.close();
      await attachedB.close();
    };

    const client = new SummonStream("local-app-key", {
      wsHost: "127.0.0.1",
      wsPort: portB,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch,
      wsPath: "/app",
    });

    const channel = client.subscribe("public-room");
    const events: Array<{ text: string }> = [];
    channel.bind("cross-instance", (payload) => {
      events.push(payload as { text: string });
    });

    await waitFor(() => (channel.subscribed ? true : undefined));
    attachedA.realtime.publish("public-room", "cross-instance", { text: `from-${portA}` });
    await waitFor(() => (events[0] ? events[0] : undefined));

    expect(events[0]).toEqual({ text: `from-${portA}` });
    client.disconnect();
  });
});
