import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCipheriv, createHmac, randomBytes } from "node:crypto";
import { WebSocket, WebSocketServer } from "ws";
import SummonFlow from "../src/index";
import { PresenceChannel } from "../src/channel";

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

describe("SummonFlow", () => {
  let port = 0;
  let server: WebSocketServer;
  let sockets: WebSocket[] = [];

  beforeEach(async () => {
    server = new WebSocketServer({ port: 0 });
    await new Promise<void>((resolve) => server.once("listening", () => resolve()));
    port = (server.address() as { port: number }).port;

    server.on("connection", (socket: import("ws").WebSocket) => {
      sockets.push(socket as unknown as WebSocket);
      socket.send(
        JSON.stringify({
          event: "summon:connection_established",
          data: JSON.stringify({
            socketId: "123.456",
            activityTimeout: 120,
          }),
        }),
      );

      socket.on("message", (message: import("ws").RawData) => {
        const payload = JSON.parse(message.toString());
        if (payload.event === "summon:subscribe" && payload.data.channel === "public-room") {
          socket.send(
            JSON.stringify({
              event: "summon_internal:subscription_succeeded",
              channel: "public-room",
              data: "{}",
            }),
          );
          socket.send(
            JSON.stringify({
              event: "new-message",
              channel: "public-room",
              data: JSON.stringify({ text: "hello" }),
            }),
          );
        }

        if (payload.event === "summon:subscribe" && payload.data.channel === "presence-room") {
          socket.send(
            JSON.stringify({
              event: "summon_internal:subscription_succeeded",
              channel: "presence-room",
              data: JSON.stringify({
                presence: {
                  ids: ["user-1"],
                  hash: { "user-1": { name: "Ada" } },
                  count: 1,
                },
              }),
            }),
          );
          socket.send(
            JSON.stringify({
              event: "summon_internal:member_added",
              channel: "presence-room",
              data: JSON.stringify({
                memberId: "user-2",
                memberInfo: { name: "Grace" },
              }),
            }),
          );
        }

        if (payload.event === "summon:subscribe" && payload.data.channel === "private-encrypted-room") {
          const masterKey = Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");
          const sharedSecret = createHmac("sha256", Buffer.from(masterKey, "base64"))
            .update("private-encrypted-room")
            .digest("base64");
          const iv = randomBytes(12);
          const cipher = createCipheriv("aes-256-gcm", Buffer.from(sharedSecret, "base64"), iv);
          const plaintext = Buffer.from(JSON.stringify({ text: "secret hello" }), "utf8");
          const ciphertext = Buffer.concat([
            cipher.update(plaintext),
            cipher.final(),
            cipher.getAuthTag(),
          ]);

          socket.send(
            JSON.stringify({
              event: "summon_internal:subscription_succeeded",
              channel: "private-encrypted-room",
              data: "{}",
            }),
          );
          socket.send(
            JSON.stringify({
              event: "new-message",
              channel: "private-encrypted-room",
              data: JSON.stringify({
                ciphertext: ciphertext.toString("base64"),
                nonce: iv.toString("base64"),
              }),
            }),
          );
        }
      });
    });
  });

  afterEach(async () => {
    for (const socket of sockets) {
      socket.close();
    }
    sockets = [];
    await new Promise<void>((resolve, reject) =>
      server.close((error?: Error) => (error ? reject(error) : resolve())),
    );
  });

  it("subscribes to a public channel and receives events", async () => {
    const client = new SummonFlow("app-key", {
      wsHost: "127.0.0.1",
      wsPort: port,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch: fetch,
    });

    const channel = client.subscribe("public-room");
    const received: Array<{ text: string }> = [];

    channel.bind("new-message", (payload) => {
      received.push(payload as { text: string });
    });

    await waitFor(() => (channel.subscribed ? true : undefined));
    await waitFor(() => (received[0] ? received[0] : undefined));

    expect(received[0]).toEqual({ text: "hello" });
    client.disconnect();
  });

  it("authorizes and tracks presence members", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          token: "test-signature",
          member: JSON.stringify({
            memberId: "user-1",
            memberInfo: { name: "Ada" },
          }),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    });

    const client = new SummonFlow("app-key", {
      wsHost: "127.0.0.1",
      wsPort: port,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch: fetchMock as typeof fetch,
      channelAuthorization: {
        endpoint: "http://127.0.0.1/auth",
      },
    });

    const channel = client.subscribe("presence-room");

    await waitFor(() => (channel.subscribed ? true : undefined));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect("members" in channel).toBe(true);
    const presenceChannel = channel as PresenceChannel;
    expect(presenceChannel.members.count).toBe(2);
    expect(presenceChannel.members.get("user-2")).toEqual({
      id: "user-2",
      info: { name: "Grace" },
    });
    client.disconnect();
  });

  it("decrypts events on private-encrypted channels", async () => {
    const masterKey = Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");
    const sharedSecret = createHmac("sha256", Buffer.from(masterKey, "base64"))
      .update("private-encrypted-room")
      .digest("base64");

    const fetchMock = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          token: "test-signature",
          sharedSecret,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    });

    const client = new SummonFlow("app-key", {
      wsHost: "127.0.0.1",
      wsPort: port,
      WebSocket: WebSocket as unknown as typeof globalThis.WebSocket,
      fetch: fetchMock as typeof fetch,
      channelAuthorization: {
        endpoint: "http://127.0.0.1/auth",
      },
    });

    const channel = client.subscribe("private-encrypted-room");
    const received: Array<{ text: string }> = [];
    channel.bind("new-message", (payload) => {
      received.push(payload as { text: string });
    });

    await waitFor(() => (received[0] ? received[0] : undefined));
    expect(received[0]).toEqual({ text: "secret hello" });
    client.disconnect();
  });
});
