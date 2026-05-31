export type ConnectionState =
  | "initialized"
  | "connecting"
  | "connected"
  | "unavailable"
  | "failed"
  | "disconnected";

export type EventHandler<TData = unknown, TMeta = unknown> = (
  data: TData,
  metadata?: TMeta,
) => void;

export type GlobalHandler = (eventName: string, data: unknown) => void;

export interface AuthorizerRequest {
  channelName: string;
  socketId: string;
}

export interface AuthorizerResponse {
  token: string;
  member?: string;
  sharedSecret?: string;
}

export interface ChannelAuthorizationOptions {
  endpoint?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  credentials?: RequestCredentials;
  transport?: "ajax";
  customHandler?: (
    request: AuthorizerRequest,
  ) => Promise<AuthorizerResponse> | AuthorizerResponse;
}

export interface EncryptedChannelPayload {
  ciphertext: string;
  nonce: string;
}

export interface ConnectionStateChange {
  previous: ConnectionState;
  current: ConnectionState;
}

export interface ConnectionErrorData {
  code?: number;
  message?: string;
}

export interface ChannelEventEnvelope {
  event: string;
  channel?: string;
  data?: unknown;
  userId?: string;
}

export interface PresenceChannelMemberInfo {
  memberId: string;
  memberInfo?: unknown;
}

export interface PresenceChannelData {
  presence?: {
    count?: number;
    hash?: Record<string, unknown>;
    ids?: string[];
  };
}

export interface ChannelTriggerMetadata {
  userId?: string;
}

export interface ConnectionOptions {
  cluster?: string;
  wsHost?: string;
  wsPort?: number;
  wssPort?: number;
  wsPath?: string;
  forceTLS?: boolean;
  enabledTransports?: Array<"ws" | "wss">;
  activityTimeout?: number;
  pongTimeout?: number;
  channelAuthorization?: ChannelAuthorizationOptions;
  authEndpoint?: string;
  auth?: {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
  };
  fetch?: typeof fetch;
  WebSocket?: typeof WebSocket;
  authorizer?: (
    request: AuthorizerRequest,
  ) => Promise<AuthorizerResponse> | AuthorizerResponse;
  reconnectMinDelay?: number;
  reconnectMaxDelay?: number;
  version?: string;
}

export interface ConnectionConfig {
  key: string;
  options: ConnectionOptions;
}
