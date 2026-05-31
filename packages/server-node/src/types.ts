import type { IncomingMessage, Server as HttpServer, ServerResponse } from "node:http";
import type { Socket } from "node:net";
import type { WebSocket } from "ws";

export interface SummonStreamApp {
  key: string;
  secret: string;
  encryptionMasterKeyBase64?: string;
}

export interface PresenceUserData {
  memberId: string;
  memberInfo?: unknown;
}

export interface AuthorizeSubscriptionParams {
  appKey: string;
  secret: string;
  socketId: string;
  channelName: string;
  userData?: PresenceUserData;
  sharedSecret?: string;
}

export interface SubscriptionAuthorizationResult {
  token: string;
  member?: string;
  sharedSecret?: string;
}

export type AuthorizeChannelParams = AuthorizeSubscriptionParams;
export type AuthorizeChannelResult = SubscriptionAuthorizationResult;

export interface AuthRequestContext {
  req: IncomingMessage;
  socketId: string;
  channelName: string;
  app: SummonStreamApp;
  body: URLSearchParams;
}

export interface AuthHandlerResult {
  ok: boolean;
  userData?: PresenceUserData;
}

export interface SummonStreamServerOptions {
  app: SummonStreamApp;
  path?: string;
  authPath?: string;
  publishPath?: string;
  activityTimeoutSeconds?: number;
  publishToken?: string;
  pubSub?: SummonStreamPubSubAdapter;
  authorize?: (context: AuthRequestContext) => Promise<AuthHandlerResult> | AuthHandlerResult;
  usage?: SummonStreamUsageReporter;
}

export interface SummonStreamUsageEvent {
  metric: "connections" | "messagesPublished" | "messagesDelivered" | "channelsActive";
  delta: number;
  peakConnections?: number;
  channelName?: string;
  occupied?: boolean;
  subscriptionCount?: number;
  eventName?: string;
  eventData?: unknown;
  userId?: string;
}

export type SummonStreamUsageReporter = (event: SummonStreamUsageEvent) => Promise<void> | void;

export interface ChannelListItem {
  name: string;
  occupied: boolean;
  subscription_count: number;
}

export interface PublishOptions {
  socketId?: string;
  userId?: string;
  skipPubSub?: boolean;
}

export interface PubSubEnvelope {
  type: "publish";
  originServerId: string;
  channelName: string;
  eventName: string;
  data: unknown;
  options?: PublishOptions;
}

export interface SummonStreamPubSubAdapter {
  publish(envelope: PubSubEnvelope): Promise<void> | void;
  subscribe(handler: (envelope: PubSubEnvelope) => void | Promise<void>): Promise<() => void> | (() => void);
  close?(): Promise<void> | void;
}

export interface ConnectionContext {
  socketId: string;
  appKey: string;
  socket: WebSocket;
  subscriptions: Set<string>;
  userDataByChannel: Map<string, PresenceUserData>;
}

export interface UpgradeContext {
  req: IncomingMessage;
  socket: Socket;
  head: Buffer;
}

export interface AttachedServer {
  server: HttpServer;
  realtime: {
    publish(channelName: string, eventName: string, data: unknown, options?: PublishOptions): void;
    trigger(channelName: string, eventName: string, data: unknown, options?: PublishOptions): void;
    listChannels(): ChannelListItem[];
    close(): Promise<void>;
  };
  close(): Promise<void>;
}

export interface SubscribeRequestData {
  channel: string;
  token?: string;
  member?: string;
}

export interface PublishRequestBody {
  channel: string;
  event: string;
  data: unknown;
  socketId?: string;
  userId?: string;
}

export type NodeAuthHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;
