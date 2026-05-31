type PresenceUserData = {
  memberId: string;
  memberInfo?: unknown;
};

type AuthResult = { ok: boolean; userData?: PresenceUserData };

interface CloudflareWebSocket extends WebSocket {
  accept(): void;
}

declare const WebSocketPair: {
  new (): {
    0: CloudflareWebSocket;
    1: CloudflareWebSocket;
  };
};

interface CloudflareResponseInit extends ResponseInit {
  webSocket?: CloudflareWebSocket;
}

export interface CloudflareWorkerOptions {
  appKey: string;
  secret: string;
  encryptionMasterKeyBase64?: string;
  publishToken?: string;
  authPath?: string;
  publishPath?: string;
  wsPath?: string;
  activityTimeoutSeconds?: number;
  authorize?: (request: Request, context: {
    socketId: string;
    channelName: string;
    body: URLSearchParams;
    env: unknown;
  }) => Promise<AuthResult> | AuthResult;
}

interface DurableObjectStateLike {
  getWebSockets?(): CloudflareWebSocket[];
  acceptWebSocket?(socket: CloudflareWebSocket): void;
}

interface DurableObjectStubLike {
  fetch(request: Request): Promise<Response>;
}

interface DurableObjectNamespaceLike {
  idFromName(name: string): unknown;
  get(id: unknown): DurableObjectStubLike;
}

export interface SummonStreamCloudflareEnv {
  SUMMON_STREAM_HUB: DurableObjectNamespaceLike;
}

export function createSummonStreamCloudflare(options: CloudflareWorkerOptions) {
  const authPath = normalizePath(options.authPath ?? "/realtime/auth");
  const publishPath = normalizePath(options.publishPath ?? `/apps/${options.appKey}/events`);
  const wsPath = normalizePath(options.wsPath ?? "/app");
  const defaultPublishPath = normalizePath(`/apps/${options.appKey}/events`);
  const internalPublishPath = "/__summon_stream_publish";

  class SummonStreamHub {
    readonly sockets = new Map<CloudflareWebSocket, { socketId: string; channels: Set<string>; users: Map<string, PresenceUserData> }>();
    readonly channels = new Map<string, Set<CloudflareWebSocket>>();

    constructor(readonly state: DurableObjectStateLike) {}

    async fetch(request: Request): Promise<Response> {
      const url = new URL(request.url);
      if (request.headers.get("Upgrade") === "websocket") {
        const pair = new WebSocketPair();
        const client = pair[0];
        const server = pair[1];
        const socketId = generateSocketId();

        server.accept();
        this.state.acceptWebSocket?.(server);
        this.sockets.set(server, { socketId, channels: new Set(), users: new Map() });
        this.send(server, {
          event: "summon:connection_established",
          data: {
            socketId,
            activityTimeout: options.activityTimeoutSeconds ?? 120,
          },
        });

        server.addEventListener("message", (event: MessageEvent) => {
          void this.onMessage(server, typeof event.data === "string" ? event.data : String(event.data));
        });

        server.addEventListener("close", () => {
          this.onClose(server);
        });

        return new Response(null, { status: 101, webSocket: client } as CloudflareResponseInit);
      }

      if (url.pathname === internalPublishPath) {
        if (options.publishToken) {
          const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
          if (token !== options.publishToken) {
            return json({ error: "Unauthorized" }, 401);
          }
        }

        const body = (await request.json()) as {
          channel: string;
          event: string;
          data: unknown;
          socketId?: string;
          userId?: string;
        };
        await this.publish(
          body.channel,
          body.event,
          body.data,
          body.socketId,
          body.userId,
        );
        return json({ accepted: true }, 202);
      }

      return new Response("Not Found", { status: 404 });
    }

    async onMessage(socket: CloudflareWebSocket, raw: string): Promise<void> {
      const payload = JSON.parse(raw) as { event: string; channel?: string; data?: unknown };
      const connection = this.sockets.get(socket);
      if (!connection) {
        return;
      }

      if (payload.event === "summon:ping") {
        this.send(socket, { event: "summon:pong", data: {} });
        return;
      }

      if (payload.event === "summon:unsubscribe") {
        const data = payload.data as { channel?: string } | undefined;
        if (data?.channel) {
          this.unsubscribe(socket, data.channel);
        }
        return;
      }

      if (payload.event === "summon:subscribe") {
        const data = payload.data as { channel: string; token?: string; member?: string };
        if (!data?.channel) {
          return;
        }

        if (isPrivateLikeChannel(data.channel)) {
          const connectionInfo = this.sockets.get(socket);
          if (!connectionInfo) {
            return;
          }

          await verifyAuthorization({
            appKey: options.appKey,
            secret: options.secret,
            socketId: connectionInfo.socketId,
            channelName: data.channel,
            token: data.token,
            member: data.member,
          });
        }

        const subscribers = this.channels.get(data.channel) ?? new Set<CloudflareWebSocket>();
        const existingPresence = this.getPresence(data.channel);
        this.channels.set(data.channel, subscribers);
        subscribers.add(socket);
        connection.channels.add(data.channel);

        const member = data.member;
        if (data.channel.startsWith("presence-") && member) {
          const userData = normalizePresenceUserData(JSON.parse(member) as PresenceUserData);
          connection.users.set(data.channel, userData);
        }

        this.send(socket, {
          event: "summon_internal:subscription_succeeded",
          channel: data.channel,
          data: data.channel.startsWith("presence-")
            ? { presence: { ids: existingPresence.ids, hash: existingPresence.hash, count: existingPresence.ids.length } }
            : {},
        });

        const userData = connection.users.get(data.channel);
        if (userData && data.channel.startsWith("presence-")) {
          await this.publish(data.channel, "summon_internal:member_added", userData, connection.socketId);
        }
        return;
      }

      if (payload.channel && payload.event.startsWith("client-")) {
        const userData = connection.users.get(payload.channel);
        await this.publish(payload.channel, payload.event, payload.data, connection.socketId, userData?.memberId);
      }
    }

    onClose(socket: CloudflareWebSocket): void {
      for (const channelName of this.sockets.get(socket)?.channels ?? []) {
        this.unsubscribe(socket, channelName);
      }
      this.sockets.delete(socket);
    }

    unsubscribe(socket: CloudflareWebSocket, channelName: string): void {
      const connection = this.sockets.get(socket);
      const subscribers = this.channels.get(channelName);
      const user = connection?.users.get(channelName);

      subscribers?.delete(socket);
      if (subscribers && subscribers.size === 0) {
        this.channels.delete(channelName);
      }

      connection?.channels.delete(channelName);
      connection?.users.delete(channelName);

      if (user && channelName.startsWith("presence-")) {
        void this.publish(channelName, "summon_internal:member_removed", { memberId: user.memberId });
      }
    }

    async publish(channelName: string, event: string, data: unknown, socketId?: string, userId?: string): Promise<void> {
      const payload = await maybeEncryptChannelPayload(options, channelName, event, data);
      for (const socket of this.channels.get(channelName) ?? []) {
        const connection = this.sockets.get(socket);
        if (socketId && connection?.socketId === socketId) {
          continue;
        }
        this.send(socket, { event, channel: channelName, data: payload, userId });
      }
    }

    getPresence(channelName: string): { ids: string[]; hash: Record<string, unknown> } {
      const ids: string[] = [];
      const hash: Record<string, unknown> = {};

      for (const socket of this.channels.get(channelName) ?? []) {
        const connection = this.sockets.get(socket);
        const user = connection?.users.get(channelName);
        if (!user) {
          continue;
        }

        ids.push(user.memberId);
        hash[user.memberId] = user.memberInfo ?? {};
      }

      return { ids, hash };
    }

    send(socket: CloudflareWebSocket, payload: Record<string, unknown>): void {
      socket.send(
        JSON.stringify({
          ...payload,
          data:
            payload.data === undefined
              ? "{}"
              : typeof payload.data === "string"
                ? payload.data
                : JSON.stringify(payload.data),
        }),
      );
    }
  }

  const fetchHandler = async (request: Request, env: SummonStreamCloudflareEnv): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === authPath) {
      if (request.method !== "POST") {
        return json({ error: "Method Not Allowed" }, 405);
      }

      const body = new URLSearchParams(await request.text());
      const socketId = body.get("socketId");
      const channelName = body.get("channelName");
      if (!socketId || !channelName) {
        return json({ error: "socketId and channelName are required" }, 400);
      }

      let userData: PresenceUserData | undefined;
      if (options.authorize) {
        const result = await options.authorize(request, { socketId, channelName, body, env });
        if (!result.ok) {
          return json({ error: "Forbidden" }, 403);
        }
        userData = result.userData ? normalizePresenceUserData(result.userData) : undefined;
      }

      return json(
        await authorizeSubscription({
          appKey: options.appKey,
          secret: options.secret,
          socketId,
          channelName,
          userData,
          sharedSecret:
            channelName.startsWith("private-encrypted-") && options.encryptionMasterKeyBase64
              ? await deriveSharedSecret(options.encryptionMasterKeyBase64, channelName)
              : undefined,
        }),
        200,
      );
    }

    if (
      url.pathname === `${wsPath}/${options.appKey}` ||
      matchesPublishPath(url.pathname, publishPath, defaultPublishPath)
    ) {
      const stub = env.SUMMON_STREAM_HUB.get(env.SUMMON_STREAM_HUB.idFromName(options.appKey));
      if (matchesPublishPath(url.pathname, publishPath, defaultPublishPath)) {
        return stub.fetch(
          new Request(new URL(internalPublishPath, request.url), {
            method: request.method,
            headers: request.headers,
            body: request.body,
          }),
        );
      }
      return stub.fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  };

  return {
    SummonStreamHub,
    fetch: fetchHandler,
  };
}

export async function authorizeSubscription(input: {
  appKey: string;
  secret: string;
  socketId: string;
  channelName: string;
  userData?: PresenceUserData;
  sharedSecret?: string;
}): Promise<{ token: string; member?: string; sharedSecret?: string }> {
  const channelData = input.userData ? JSON.stringify(input.userData) : undefined;
  const stringToSign = channelData
    ? `${input.socketId}:${input.channelName}:${channelData}`
    : `${input.socketId}:${input.channelName}`;
  return {
    token: `${input.appKey}:${await hmacSha256Hex(input.secret, stringToSign)}`,
    ...(channelData ? { member: channelData } : {}),
    ...(input.sharedSecret ? { sharedSecret: input.sharedSecret } : {}),
  };
}


function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function generateSocketId(): string {
  const left = Math.floor(Math.random() * 1_000_000_000);
  const right = Math.floor(Math.random() * 1_000_000_000);
  return `${left}.${right}`;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path.replace(/\/$/, "")}`;
}

function matchesPublishPath(pathname: string, configuredPath: string, defaultPath: string): boolean {
  const normalizedPath = normalizePath(pathname);
  return normalizedPath === configuredPath || normalizedPath === defaultPath;
}

async function deriveSharedSecret(masterKeyBase64: string, channelName: string): Promise<string> {
  return hmacSha256Base64(masterKeyBase64, channelName);
}

async function maybeEncryptChannelPayload(
  options: CloudflareWorkerOptions,
  channelName: string,
  eventName: string,
  data: unknown,
): Promise<unknown> {
  if (!channelName.startsWith("private-encrypted-") || eventName.startsWith("summon_")) {
    return data;
  }

  if (!options.encryptionMasterKeyBase64) {
    throw new Error(`Missing encryptionMasterKeyBase64 for encrypted channel ${channelName}.`);
  }

  const sharedSecret = await deriveSharedSecret(options.encryptionMasterKeyBase64, channelName);
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(decodeBase64(sharedSecret)),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, plaintext);

  return {
    ciphertext: encodeBase64(new Uint8Array(ciphertext)),
    nonce: encodeBase64(nonce),
  };
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Base64(secretBase64OrUtf8: string, message: string): Promise<string> {
  const secretBytes = looksLikeBase64(secretBase64OrUtf8)
    ? decodeBase64(secretBase64OrUtf8)
    : new TextEncoder().encode(secretBase64OrUtf8);
  const messageData = new TextEncoder().encode(message);
  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(secretBytes),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, messageData);
  return encodeBase64(new Uint8Array(signature));
}

async function verifyAuthorization(input: {
  appKey: string;
  secret: string;
  socketId: string;
  channelName: string;
  token?: string;
  member?: string;
}): Promise<void> {
  if (!input.token) {
    throw new Error("Missing subscription token");
  }

  const expectedString = input.member
    ? `${input.socketId}:${input.channelName}:${input.member}`
    : `${input.socketId}:${input.channelName}`;
  const [appKey, signature] = input.token.split(":");
  const expectedSignature = await hmacSha256Hex(input.secret, expectedString);

  if (appKey !== input.appKey || signature !== expectedSignature) {
    throw new Error("Invalid subscription token");
  }
}

function isPrivateLikeChannel(channelName: string): boolean {
  return (
    channelName.startsWith("private-") ||
    channelName.startsWith("presence-") ||
    channelName.startsWith("private-encrypted-")
  );
}

function decodeBase64(value: string): Uint8Array {
  const decoded = atob(value);
  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function encodeBase64(value: Uint8Array): string {
  return btoa(String.fromCharCode(...value));
}

function looksLikeBase64(value: string): boolean {
  return /^[A-Za-z0-9+/=]+$/.test(value) && value.length % 4 === 0;
}

function normalizePresenceUserData(userData: PresenceUserData): PresenceUserData {
  return {
    memberId: userData.memberId,
    memberInfo: userData.memberInfo,
  };
}
