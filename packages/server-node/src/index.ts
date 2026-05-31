import { createCipheriv, createHmac, randomBytes, randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type Server as HttpServer, type ServerResponse } from "node:http";
import type { Socket } from "node:net";
import { WebSocketServer, type WebSocket } from "ws";
import type {
  AttachedServer,
  AuthorizeSubscriptionParams,
  ConnectionContext,
  NodeAuthHandler,
  PresenceUserData,
  PubSubEnvelope,
  PublishRequestBody,
  PublishOptions,
  ChannelListItem,
  SubscribeRequestData,
  SubscriptionAuthorizationResult,
  SummonStreamServerOptions,
  SummonStreamPubSubAdapter,
} from "./types";

export class SummonStreamServer {
  private readonly wsServer = new WebSocketServer({ noServer: true });
  private readonly options: Required<Pick<SummonStreamServerOptions, "activityTimeoutSeconds" | "path">> &
    Omit<SummonStreamServerOptions, "activityTimeoutSeconds" | "path">;
  private readonly connections = new Map<string, ConnectionContext>();
  private readonly channels = new Map<string, Set<string>>();
  private readonly serverId = randomUUID();
  private readonly pubSubAdapter: SummonStreamPubSubAdapter;
  private pubSubUnsubscribe: (() => void) | null = null;

  constructor(options: SummonStreamServerOptions) {
    this.options = {
      ...options,
      activityTimeoutSeconds: options.activityTimeoutSeconds ?? 120,
      authPath: normalizePath(options.authPath ?? "/realtime/auth"),
      path: normalizePath(options.path ?? "/app"),
      publishPath: normalizePath(options.publishPath ?? `/apps/${options.app.key}/events`),
    };
    this.pubSubAdapter = options.pubSub ?? createNoopPubSubAdapter();

    this.wsServer.on("connection", (socket, req) => {
      this.handleConnection(socket, req);
    });

    const maybeUnsubscribe = this.pubSubAdapter.subscribe((envelope) => {
      if (envelope.type !== "publish" || envelope.originServerId === this.serverId) {
        return;
      }

      this.publishLocally(envelope.channelName, envelope.eventName, envelope.data, {
        ...(envelope.options ?? {}),
        skipPubSub: true,
      });
    });

    if (typeof (maybeUnsubscribe as Promise<() => void>)?.then === "function") {
      void (maybeUnsubscribe as Promise<() => void>).then((unsubscribe) => {
        this.pubSubUnsubscribe = unsubscribe;
      });
    } else {
      this.pubSubUnsubscribe = maybeUnsubscribe as () => void;
    }
  }

  attach(server: HttpServer): void {
    server.on("upgrade", (req, socket, head) => {
      if (!this.matchesUpgrade(req)) {
        socket.destroy();
        return;
      }

      this.wsServer.handleUpgrade(req, socket, head, (websocket) => {
        this.wsServer.emit("connection", websocket, req);
      });
    });
  }

  createNodeAuthHandler(): NodeAuthHandler {
    return async (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return;
      }

      try {
        const body = await readBody(req);
        const params = new URLSearchParams(body);
        const socketId = params.get("socketId");
        const channelName = params.get("channelName");

        if (!socketId || !channelName) {
          writeJson(res, 400, { error: "socketId and channelName are required" });
          return;
        }

        let userData: PresenceUserData | undefined;
        if (this.options.authorize) {
          const result = await this.options.authorize({
            req,
            socketId,
            channelName,
            app: this.options.app,
            body: params,
          });

          if (!result.ok) {
            writeJson(res, 403, { error: "Forbidden" });
            return;
          }

          userData = result.userData ? normalizePresenceUserData(result.userData) : undefined;
        }

        const response = authorizeSubscription({
          appKey: this.options.app.key,
          secret: this.options.app.secret,
          socketId,
          channelName,
          userData,
          sharedSecret:
            channelName.startsWith("private-encrypted-") && this.options.app.encryptionMasterKeyBase64
              ? deriveSharedSecret(this.options.app.encryptionMasterKeyBase64, channelName)
              : undefined,
        });

        writeJson(res, 200, response);
      } catch (error) {
        writeJson(res, 500, { error: error instanceof Error ? error.message : "Internal error" });
      }
    };
  }

  createNodePublishHandler(): NodeAuthHandler {
    return async (req, res) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end("Method Not Allowed");
        return;
      }

      if (this.options.publishToken) {
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (token !== this.options.publishToken) {
          writeJson(res, 401, { error: "Unauthorized" });
          return;
        }
      }

      try {
        const rawBody = await readBody(req);
        const body = JSON.parse(rawBody) as PublishRequestBody;
        if (!body.channel || !body.event) {
          writeJson(res, 400, { error: "channel and event are required" });
          return;
        }

        this.publish(body.channel, body.event, body.data, {
          socketId: body.socketId,
          userId: body.userId,
        });

        writeJson(res, 202, { accepted: true });
      } catch (error) {
        writeJson(res, 500, { error: error instanceof Error ? error.message : "Internal error" });
      }
    };
  }

  async close(): Promise<void> {
    for (const context of this.connections.values()) {
      context.socket.close();
    }

    this.wsServer.clients.forEach((client) => client.close());
    await new Promise<void>((resolve) => this.wsServer.close(() => resolve()));
    this.pubSubUnsubscribe?.();
    await this.pubSubAdapter.close?.();
    this.connections.clear();
    this.channels.clear();
  }

  publish(channelName: string, eventName: string, data: unknown, options: PublishOptions = {}): void {
    this.publishLocally(channelName, eventName, data, options);
    this.reportUsage({
      metric: "messagesPublished",
      delta: 1,
      channelName,
      eventName,
      eventData: data,
      userId: options.userId,
    });

    if (!options.skipPubSub) {
      void this.pubSubAdapter.publish({
        type: "publish",
        originServerId: this.serverId,
        channelName,
        eventName,
        data,
        options: {
          socketId: options.socketId,
          userId: options.userId,
        },
      } satisfies PubSubEnvelope);
    }
  }

  publishLocally(channelName: string, eventName: string, data: unknown, options: PublishOptions = {}): void {
    const subscribers = this.channels.get(channelName);
    if (!subscribers) {
      return;
    }

    let delivered = 0;
    for (const socketId of subscribers) {
      if (options.socketId && socketId === options.socketId) {
        continue;
      }

      const connection = this.connections.get(socketId);
      if (!connection) {
        continue;
      }

      send(connection.socket, {
        event: eventName,
        channel: channelName,
        data: maybeEncryptChannelPayload(this.options.app, channelName, eventName, data),
        userId: options.userId,
      });
      delivered += 1;
    }

    if (delivered > 0) {
      this.reportUsage({
        metric: "messagesDelivered",
        delta: delivered,
        channelName,
      });
    }
  }

  trigger(channelName: string, eventName: string, data: unknown, options: PublishOptions = {}): void {
    this.publish(channelName, eventName, data, options);
  }

  listChannels(): ChannelListItem[] {
    return [...this.channels.entries()].map(([name, subscribers]) => ({
      name,
      occupied: subscribers.size > 0,
      subscription_count: subscribers.size,
    }));
  }

  private matchesUpgrade(req: IncomingMessage): boolean {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;
    return path.startsWith(`${this.options.path}/`);
  }

  private handleConnection(socket: WebSocket, req: IncomingMessage): void {
    const appKey = extractAppKey(req, this.options.path);
    if (appKey !== this.options.app.key) {
      socket.close(4001, "Invalid app key");
      return;
    }

    const socketId = generateSocketId();
    const connection: ConnectionContext = {
      socketId,
      appKey,
      socket,
      subscriptions: new Set(),
      userDataByChannel: new Map(),
    };

    this.connections.set(socketId, connection);
    this.reportUsage({
      metric: "connections",
      delta: 1,
      peakConnections: this.connections.size,
    });

    send(socket, {
      event: "summon:connection_established",
      data: {
        socketId,
        activityTimeout: this.options.activityTimeoutSeconds,
      },
    });

    socket.on("message", async (message) => {
      try {
        await this.handleSocketMessage(connection, message.toString());
      } catch (error) {
        send(socket, {
          event: "summon:error",
          data: {
            code: 4301,
            message: error instanceof Error ? error.message : "Unhandled socket error",
          },
        });
      }
    });

    socket.on("close", () => {
      this.removeConnection(connection);
    });
  }

  private async handleSocketMessage(connection: ConnectionContext, raw: string): Promise<void> {
    const payload = JSON.parse(raw) as {
      event: string;
      channel?: string;
      data?: unknown;
    };

    if (payload.event === "summon:ping") {
      send(connection.socket, { event: "summon:pong", data: {} });
      return;
    }

    if (payload.event === "summon:subscribe") {
      await this.handleSubscribe(connection, payload.data as SubscribeRequestData);
      return;
    }

    if (payload.event === "summon:unsubscribe") {
      const data = payload.data as { channel?: string } | undefined;
      if (data?.channel) {
        this.unsubscribe(connection, data.channel);
      }
      return;
    }

    if (payload.channel && payload.event.startsWith("client-")) {
      this.handleClientEvent(connection, payload.channel, payload.event, payload.data);
    }
  }

  private async handleSubscribe(connection: ConnectionContext, data: SubscribeRequestData): Promise<void> {
    const channelName = data.channel;
    if (!channelName) {
      throw new Error("Missing channel name");
    }

    let userData: PresenceUserData | undefined;
    if (isPrivateLikeChannel(channelName)) {
      verifyChannelAuthorization({
        appKey: this.options.app.key,
        secret: this.options.app.secret,
        socketId: connection.socketId,
        channelName,
        token: data.token,
        member: data.member,
      });

      if (channelName.startsWith("presence-")) {
        const member = data.member;
        if (!member) {
          throw new Error("Presence channels require member");
        }
        userData = normalizePresenceUserData(JSON.parse(member) as PresenceUserData);
        if (!userData.memberId) {
          throw new Error("Presence member requires memberId");
        }
      }
    }

    connection.subscriptions.add(channelName);
    if (userData) {
      connection.userDataByChannel.set(channelName, userData);
    }

    const subscribers = this.channels.get(channelName) ?? new Set<string>();
    const wasEmpty = subscribers.size === 0;
    this.channels.set(channelName, subscribers);
    const existingPresence = getPresenceState(channelName, subscribers, this.connections);
    subscribers.add(connection.socketId);
    if (wasEmpty) {
      this.reportUsage({
        metric: "channelsActive",
        delta: 1,
        channelName,
        occupied: true,
        subscriptionCount: subscribers.size,
      });
    }

    send(connection.socket, {
      event: "summon_internal:subscription_succeeded",
      channel: channelName,
      data: channelName.startsWith("presence-")
        ? {
            presence: {
              ids: existingPresence.ids,
              hash: existingPresence.hash,
              count: existingPresence.ids.length,
            },
          }
        : {},
    });

    if (userData && channelName.startsWith("presence-")) {
      this.publish(channelName, "summon_internal:member_added", userData, {
        socketId: connection.socketId,
      });
    }
  }

  private unsubscribe(connection: ConnectionContext, channelName: string): void {
    if (!connection.subscriptions.has(channelName)) {
      return;
    }

    const existingUser = connection.userDataByChannel.get(channelName);
    connection.subscriptions.delete(channelName);
    connection.userDataByChannel.delete(channelName);

    const subscribers = this.channels.get(channelName);
    if (subscribers) {
      subscribers.delete(connection.socketId);
      if (subscribers.size === 0) {
        this.channels.delete(channelName);
        this.reportUsage({
          metric: "channelsActive",
          delta: 0,
          channelName,
          occupied: false,
          subscriptionCount: 0,
        });
      }
    }

    if (existingUser && channelName.startsWith("presence-")) {
      this.publish(channelName, "summon_internal:member_removed", {
        memberId: existingUser.memberId,
      });
    }
  }

  private handleClientEvent(
    connection: ConnectionContext,
    channelName: string,
    eventName: string,
    data: unknown,
  ): void {
    if (!connection.subscriptions.has(channelName)) {
      throw new Error("Cannot trigger client event for unsubscribed channel");
    }

    if (!isPrivateLikeChannel(channelName)) {
      throw new Error("Client events require private or presence channels");
    }

    if (channelName.startsWith("private-encrypted-")) {
      throw new Error("Client events are not supported on private-encrypted channels");
    }

    const userId = connection.userDataByChannel.get(channelName)?.memberId;
    this.publish(channelName, eventName, data, {
      socketId: connection.socketId,
      userId,
    });
  }

  private removeConnection(connection: ConnectionContext): void {
    for (const channelName of [...connection.subscriptions]) {
      this.unsubscribe(connection, channelName);
    }
    this.connections.delete(connection.socketId);
  }

  private reportUsage(event: Parameters<NonNullable<SummonStreamServerOptions["usage"]>>[0]): void {
    if (!this.options.usage) {
      return;
    }

    void Promise.resolve(this.options.usage(event)).catch(() => {});
  }
}

export async function createSummonStreamNodeServer(
  options: SummonStreamServerOptions,
): Promise<AttachedServer> {
  const realtime = new SummonStreamServer(options);
  const authHandler = realtime.createNodeAuthHandler();
  const publishHandler = realtime.createNodePublishHandler();

  const server = createServer(async (req, res) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;

    if (pathname === normalizePath(options.authPath ?? "/realtime/auth")) {
      await authHandler(req, res);
      return;
    }

    if (pathname === normalizePath(options.publishPath ?? `/apps/${options.app.key}/events`)) {
      await publishHandler(req, res);
      return;
    }

    if (pathname === normalizePath(`/apps/${options.app.key}/channels`)) {
      writeJson(res, 200, { channels: realtime.listChannels() });
      return;
    }

    res.statusCode = 404;
    res.end("Not Found");
  });

  realtime.attach(server);

  return {
    server,
    realtime,
    close: async () => {
      await realtime.close();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}

export function authorizeSubscription(params: AuthorizeSubscriptionParams): SubscriptionAuthorizationResult {
  const channelData = params.userData ? JSON.stringify(params.userData) : undefined;
  const stringToSign = channelData
    ? `${params.socketId}:${params.channelName}:${channelData}`
    : `${params.socketId}:${params.channelName}`;
  const signature = createHmac("sha256", params.secret).update(stringToSign).digest("hex");

  return {
    token: `${params.appKey}:${signature}`,
    ...(channelData ? { member: channelData } : {}),
    ...(params.sharedSecret ? { sharedSecret: params.sharedSecret } : {}),
  };
}


export function createInMemoryPubSubAdapter(): SummonStreamPubSubAdapter {
  const listeners = new Set<(envelope: PubSubEnvelope) => void | Promise<void>>();
  return {
    publish: async (envelope) => {
      for (const listener of listeners) {
        await listener(envelope);
      }
    },
    subscribe: (handler) => {
      listeners.add(handler);
      return () => {
        listeners.delete(handler);
      };
    },
  };
}

export * from "./types";

function send(socket: WebSocket, payload: Record<string, unknown>): void {
  const message = {
    ...payload,
    data:
      payload.data === undefined
        ? {}
        : typeof payload.data === "string"
          ? payload.data
          : JSON.stringify(payload.data),
  };
  socket.send(JSON.stringify(message));
}

function verifyChannelAuthorization(input: {
  appKey: string;
  secret: string;
  socketId: string;
  channelName: string;
  token?: string;
  member?: string;
}): void {
  if (!input.token) {
    throw new Error("Missing subscription token");
  }

  const stringToSign = input.member
    ? `${input.socketId}:${input.channelName}:${input.member}`
    : `${input.socketId}:${input.channelName}`;
  const expected = createHmac("sha256", input.secret).update(stringToSign).digest("hex");
  const [appKey, signature] = input.token.split(":");
  if (appKey !== input.appKey || signature !== expected) {
    throw new Error("Invalid subscription token");
  }
}

function getPresenceState(
  channelName: string,
  subscribers: Set<string>,
  connections: Map<string, ConnectionContext>,
): {
  ids: string[];
  hash: Record<string, unknown>;
} {
  const ids: string[] = [];
  const hash: Record<string, unknown> = {};

  for (const socketId of subscribers) {
    const connection = connections.get(socketId);
    const user = connection?.userDataByChannel.get(channelName);
    if (!user) {
      continue;
    }

    ids.push(user.memberId);
    hash[user.memberId] = user.memberInfo ?? {};
  }

  return { ids, hash };
}

function extractAppKey(req: IncomingMessage, pathPrefix: string): string | null {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  const match = pathname.match(new RegExp(`^${escapeRegExp(pathPrefix)}/([^/]+)$`));
  return match?.[1] ?? null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateSocketId(): string {
  const [left, right] = randomUUID().replace(/-/g, "").slice(0, 16).match(/.{1,8}/g) ?? [];
  return `${parseInt(left ?? "0", 16)}.${parseInt(right ?? "0", 16)}`;
}

function isPrivateLikeChannel(channelName: string): boolean {
  return (
    channelName.startsWith("private-") ||
    channelName.startsWith("presence-") ||
    channelName.startsWith("private-encrypted-")
  );
}

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) {
    return `/${trimmed.replace(/\/$/, "")}`;
  }
  return trimmed.replace(/\/$/, "");
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function writeJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function maybeEncryptChannelPayload(
  app: SummonStreamServerOptions["app"],
  channelName: string,
  eventName: string,
  data: unknown,
): unknown {
  if (!channelName.startsWith("private-encrypted-") || eventName.startsWith("summon_")) {
    return data;
  }

  if (!app.encryptionMasterKeyBase64) {
    throw new Error(
      `Missing encryptionMasterKeyBase64 for encrypted channel ${channelName}.`,
    );
  }

  const sharedSecret = deriveSharedSecret(app.encryptionMasterKeyBase64, channelName);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(sharedSecret, "base64"), iv);
  const plaintext = Buffer.from(JSON.stringify(data), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);

  return {
    ciphertext: ciphertext.toString("base64"),
    nonce: iv.toString("base64"),
  };
}

function deriveSharedSecret(masterKeyBase64: string, channelName: string): string {
  const masterKey = Buffer.from(masterKeyBase64, "base64");
  if (masterKey.length === 0) {
    throw new Error("Invalid encryption master key");
  }

  return createHmac("sha256", masterKey).update(channelName).digest("base64");
}

function createNoopPubSubAdapter(): SummonStreamPubSubAdapter {
  return {
    publish: () => undefined,
    subscribe: () => () => undefined,
  };
}

function normalizePresenceUserData(userData: PresenceUserData): PresenceUserData {
  return {
    memberId: userData.memberId,
    memberInfo: userData.memberInfo,
  };
}
