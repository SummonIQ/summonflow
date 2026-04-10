import { Channel, EncryptedChannel, PresenceChannel } from "./channel";
import { Connection } from "./connection";
import { EventDispatcher } from "./emitter";
import type {
  AuthorizerRequest,
  AuthorizerResponse,
  ChannelAuthorizationOptions,
  ChannelEventEnvelope,
  ChannelTriggerMetadata,
  ConnectionConfig,
  ConnectionErrorData,
  ConnectionOptions,
} from "./types";

const DEFAULT_ACTIVITY_TIMEOUT_MS = 120_000;
const DEFAULT_PONG_TIMEOUT_MS = 30_000;
const DEFAULT_RECONNECT_MIN_MS = 1_000;
const DEFAULT_RECONNECT_MAX_MS = 10_000;
const LIBRARY_VERSION = "0.1.0";

export class SummonFlow extends EventDispatcher {
  readonly connection = new Connection();
  userId: string | null = null;

  private readonly channels = new Map<string, Channel>();
  private readonly key: string;
  private readonly options: ConnectionOptions;
  private readonly fetchImpl: typeof fetch;
  private readonly WebSocketImpl: typeof WebSocket;
  private socket: WebSocket | null = null;
  private activityTimeoutMs = DEFAULT_ACTIVITY_TIMEOUT_MS;
  private pingTimer: ReturnType<typeof setTimeout> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private manuallyDisconnected = false;

  constructor(key: string, options: ConnectionOptions = {}) {
    super();
    this.key = key;
    this.options = options;
    this.fetchImpl = resolveFetch(options);
    this.WebSocketImpl = resolveWebSocket(options);
    this.connect();
  }

  static fromConfig(config: ConnectionConfig): SummonFlow {
    return new SummonFlow(config.key, config.options);
  }

  connect(): void {
    this.manuallyDisconnected = false;
    this.clearReconnectTimer();

    if (this.socket && isOpenOrConnecting(this.socket)) {
      return;
    }

    this.connection.setState("connecting");

    const socket = new this.WebSocketImpl(buildConnectionUrl(this.key, this.options));
    this.socket = socket;

    socket.addEventListener("open", () => {
      this.reconnectAttempts = 0;
    });

    socket.addEventListener("message", (event) => {
      const payload = typeof event.data === "string" ? event.data : event.data.toString();
      void this.handleMessage(payload);
    });

    socket.addEventListener("close", () => {
      this.clearHeartbeatTimers();
      this.connection.socketId = null;
      this.connection.setState(this.manuallyDisconnected ? "disconnected" : "unavailable");
      this.socket = null;
      if (!this.manuallyDisconnected) {
        this.scheduleReconnect();
      }
    });

    socket.addEventListener("error", () => {
      this.connection.dispatch("error", {
        message: "WebSocket connection error",
      } satisfies ConnectionErrorData);
    });
  }

  disconnect(): void {
    this.manuallyDisconnected = true;
    this.clearReconnectTimer();
    this.clearHeartbeatTimers();
    this.socket?.close();
    this.socket = null;
    this.connection.socketId = null;
    this.connection.setState("disconnected");
  }

  subscribe(name: string): Channel {
    const existing = this.channels.get(name);
    if (existing) {
      return existing;
    }

    const channel = createChannel(name, this);
    this.channels.set(name, channel);
    void channel.subscribe();
    return channel;
  }

  unsubscribe(name: string): void {
    const channel = this.channels.get(name);
    if (!channel) {
      return;
    }

    this.channels.delete(name);
    channel.unsubscribe();
    this.sendEvent({
      event: "summon:unsubscribe",
      data: { channel: name },
    });
  }

  channel(name: string): Channel | undefined {
    return this.channels.get(name);
  }

  allChannels(): Channel[] {
    return [...this.channels.values()];
  }

  sendEvent(envelope: ChannelEventEnvelope): void {
    if (!this.socket || this.socket.readyState !== this.WebSocketImpl.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify(envelope));
  }

  emitGlobal(eventName: string, data: unknown): void {
    this.emit(eventName, data);
  }

  async subscribeChannel(channel: Channel): Promise<void> {
    if (!this.connection.socketId) {
      return;
    }

    const data: Record<string, unknown> = { channel: channel.name };
    if (channel.isPrivate()) {
      const authorization = await this.authorizeSubscription({
        channelName: channel.name,
        socketId: this.connection.socketId,
      });
      data.token = authorization.token;
      const member = authorization.member;
      if (member) {
        data.member = member;
        this.captureUserId(member);
      }
      const sharedSecret = authorization.sharedSecret;
      if (sharedSecret) {
        data.sharedSecret = sharedSecret;
        if (channel instanceof EncryptedChannel) {
          channel.setSharedSecret(sharedSecret);
        }
      }
    }

    this.sendEvent({
      event: "summon:subscribe",
      data,
    });
  }

  private async handleMessage(rawPayload: string): Promise<void> {
    this.bumpActivity();

    const payload = JSON.parse(rawPayload) as ChannelEventEnvelope;
    const data = normalizeData(payload.data);

    switch (payload.event) {
      case "summon:connection_established": {
        const established = data as { socketId: string; activityTimeout?: number };
        this.connection.socketId = established.socketId;
        this.activityTimeoutMs = (established.activityTimeout ?? 120) * 1000;
        this.connection.setState("connected");
        for (const channel of this.channels.values()) {
          if (channel.subscriptionPending || !channel.subscribed) {
            void this.subscribeChannel(channel);
          }
        }
        return;
      }
      case "summon:error":
        this.connection.dispatch("error", data as ConnectionErrorData);
        return;
      case "summon:ping":
        this.sendEvent({ event: "summon:pong" });
        return;
      case "summon:pong":
        if (this.pongTimer) {
          clearTimeout(this.pongTimer);
          this.pongTimer = null;
        }
        return;
      default:
        break;
    }

    if (!payload.channel) {
      this.connection.dispatch(payload.event, data);
      return;
    }

    const channel = this.channels.get(payload.channel);
    if (!channel) {
      return;
    }

    const metadata: ChannelTriggerMetadata | undefined = payload.userId
      ? {
          userId: payload.userId,
        }
      : undefined;

    if (payload.event === "summon_internal:subscription_succeeded") {
      channel.handleSubscriptionSucceeded(data);
      return;
    }

    if (payload.event === "summon_internal:member_added") {
      await channel.handleEvent("summon:member_added", data, metadata);
      return;
    }

    if (payload.event === "summon_internal:member_removed") {
      await channel.handleEvent("summon:member_removed", data, metadata);
      return;
    }

    await channel.handleEvent(payload.event, data, metadata);
  }

  private async authorizeSubscription(request: AuthorizerRequest): Promise<AuthorizerResponse> {
    if (this.options.authorizer) {
      return this.options.authorizer(request);
    }

    const config = buildAuthorizationConfig(this.options);
    if (config.customHandler) {
      return config.customHandler(request);
    }

    const body = new URLSearchParams({
      socketId: request.socketId,
      channelName: request.channelName,
    });

    for (const [key, value] of Object.entries(config.params ?? {})) {
      body.set(key, String(value));
    }

    const response = await this.fetchImpl(config.endpoint ?? "/realtime/auth", {
      method: "POST",
      credentials: config.credentials ?? "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(config.headers ?? {}),
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Authorization failed for ${request.channelName}: ${response.status}`);
    }

    return (await response.json()) as AuthorizerResponse;
  }

  private captureUserId(channelData: string): void {
    try {
      const parsed = JSON.parse(channelData) as { memberId?: string };
      const userId = parsed.memberId;
      if (userId) {
        this.userId = userId;
      }
    } catch {
      // Ignore malformed channel data from custom authorizers.
    }
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer();
    this.reconnectAttempts += 1;
    const min = this.options.reconnectMinDelay ?? DEFAULT_RECONNECT_MIN_MS;
    const max = this.options.reconnectMaxDelay ?? DEFAULT_RECONNECT_MAX_MS;
    const delay = Math.min(min * 2 ** (this.reconnectAttempts - 1), max);
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private bumpActivity(): void {
    this.clearHeartbeatTimers();
    this.pingTimer = setTimeout(() => {
      this.sendEvent({ event: "summon:ping" });
      this.pongTimer = setTimeout(() => {
        this.socket?.close();
      }, this.options.pongTimeout ?? DEFAULT_PONG_TIMEOUT_MS);
    }, this.options.activityTimeout ?? this.activityTimeoutMs);
  }

  private clearHeartbeatTimers(): void {
    if (this.pingTimer) {
      clearTimeout(this.pingTimer);
      this.pingTimer = null;
    }

    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }
}

export default SummonFlow;
export { Channel, PresenceChannel, Connection };
export * from "./types";
export * from "./members";

function resolveFetch(options: ConnectionOptions): typeof fetch {
  if (options.fetch) {
    return options.fetch;
  }

  if (typeof fetch !== "undefined") {
    return fetch;
  }

  throw new Error("No fetch implementation available. Pass options.fetch in Node.");
}

function resolveWebSocket(options: ConnectionOptions): typeof WebSocket {
  if (options.WebSocket) {
    return options.WebSocket;
  }

  if (typeof WebSocket !== "undefined") {
    return WebSocket;
  }

  throw new Error("No WebSocket implementation available. Pass options.WebSocket in Node.");
}

function createChannel(name: string, client: SummonFlow): Channel {
  if (name.startsWith("private-encrypted-")) {
    return new EncryptedChannel(name, client);
  }

  if (name.startsWith("presence-")) {
    return new PresenceChannel(name, client);
  }

  return new Channel(name, client);
}

function normalizeData(data: unknown): unknown {
  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function buildAuthorizationConfig(options: ConnectionOptions): ChannelAuthorizationOptions {
  return {
    endpoint: options.channelAuthorization?.endpoint ?? options.authEndpoint,
    headers: {
      ...(options.auth?.headers ?? {}),
      ...(options.channelAuthorization?.headers ?? {}),
    },
    params: {
      ...(options.auth?.params ?? {}),
      ...(options.channelAuthorization?.params ?? {}),
    },
    credentials: options.channelAuthorization?.credentials,
    transport: options.channelAuthorization?.transport ?? "ajax",
    customHandler: options.channelAuthorization?.customHandler,
  };
}

function buildConnectionUrl(key: string, options: ConnectionOptions): string {
  const forceTLS = options.forceTLS ?? false;
  const host = options.wsHost ?? (options.cluster ? `ws-${options.cluster}.summon-flow.local` : "127.0.0.1");
  const scheme = forceTLS ? "wss" : "ws";
  const port = forceTLS ? options.wssPort : options.wsPort;
  const wsPath = (options.wsPath ?? "/app").replace(/\/$/, "");
  const url = new URL(`${scheme}://${host}${wsPath}/${key}`);

  if (port) {
    url.port = String(port);
  }

  const enabled = options.enabledTransports;
  if (enabled && !enabled.includes(scheme as "ws" | "wss")) {
    throw new Error(`Transport ${scheme} is not enabled.`);
  }

  url.searchParams.set("protocol", "7");
  url.searchParams.set("client", "summon-flow");
  url.searchParams.set("version", options.version ?? LIBRARY_VERSION);
  url.searchParams.set("flash", "false");
  return url.toString();
}

function isOpenOrConnecting(socket: WebSocket): boolean {
  return socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING;
}
