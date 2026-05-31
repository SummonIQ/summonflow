import { createHmac } from "node:crypto";
import { Redis } from "@upstash/redis";

export interface PresenceUserData {
  memberId: string;
  memberInfo?: unknown;
}

export interface PubSubEnvelope {
  type: "publish";
  originServerId: string;
  channelName: string;
  eventName: string;
  data: unknown;
  options?: {
    socketId?: string;
    userId?: string;
  };
}

export interface AuthOptions {
  appKey: string;
  secret: string;
  authorize?: (request: Request, context: {
    socketId: string;
    channelName: string;
    body: URLSearchParams;
  }) => Promise<{ ok: boolean; userData?: PresenceUserData }> | { ok: boolean; userData?: PresenceUserData };
}

export type VercelAuthOptions = AuthOptions;

export interface PublishToRealtimeOptions {
  baseUrl: string;
  appKey: string;
  publishToken?: string;
  channel: string;
  event: string;
  data: unknown;
  socketId?: string;
  userId?: string;
  fetchImpl?: typeof fetch;
}

export interface PublishViaVercelRedisOptions {
  channel: string;
  event: string;
  data: unknown;
  socketId?: string;
  userId?: string;
  redisChannel?: string;
  redis?: Redis;
  originServerId?: string;
}

export function createAuthHandler(options: AuthOptions) {
  return async function handleAuth(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return json({ error: "Method Not Allowed" }, 405);
    }

    const bodyText = await request.text();
    const body = new URLSearchParams(bodyText);
    const socketId = body.get("socketId");
    const channelName = body.get("channelName");

    if (!socketId || !channelName) {
      return json({ error: "socketId and channelName are required" }, 400);
    }

    let userData: PresenceUserData | undefined;
    if (options.authorize) {
      const result = await options.authorize(request, { socketId, channelName, body });
      if (!result.ok) {
        return json({ error: "Forbidden" }, 403);
      }
      userData = result.userData ? normalizePresenceUserData(result.userData) : undefined;
    }

    return json(
      signSubscription({
        appKey: options.appKey,
        secret: options.secret,
        socketId,
        channelName,
        userData,
      }),
      200,
    );
  };
}

export const createVercelAuthHandler = createAuthHandler;

export function signSubscription(input: {
  appKey: string;
  secret: string;
  socketId: string;
  channelName: string;
  userData?: PresenceUserData;
  sharedSecret?: string;
}): { token: string; member?: string; sharedSecret?: string } {
  const channelData = input.userData ? JSON.stringify(input.userData) : undefined;
  const stringToSign = channelData
    ? `${input.socketId}:${input.channelName}:${channelData}`
    : `${input.socketId}:${input.channelName}`;
  const signature = hmacSha256Hex(input.secret, stringToSign);

  return {
    token: `${input.appKey}:${signature}`,
    ...(channelData ? { member: channelData } : {}),
    ...(input.sharedSecret ? { sharedSecret: input.sharedSecret } : {}),
  };
}

export const authorizeSubscription = signSubscription;

export async function publishToSummonFlow(options: PublishToRealtimeOptions): Promise<Response> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const endpoint = new URL(`/apps/${options.appKey}/events`, options.baseUrl);
  return fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.publishToken ? { Authorization: `Bearer ${options.publishToken}` } : {}),
    },
    body: JSON.stringify({
      channel: options.channel,
      event: options.event,
      data: options.data,
      socketId: options.socketId,
      userId: options.userId,
    }),
  });
}

export const publishToSummonStream = publishToSummonFlow;

export async function publishToSummonFlowViaRedis(
  options: PublishViaVercelRedisOptions,
): Promise<void> {
  const redis = options.redis ?? Redis.fromEnv();
  const redisChannel = options.redisChannel ?? "summonflow:events";
  const envelope: PubSubEnvelope = {
    type: "publish",
    originServerId: options.originServerId ?? "vercel",
    channelName: options.channel,
    eventName: options.event,
    data: options.data,
    options: {
      socketId: options.socketId,
      userId: options.userId,
    },
  };

  await redis.publish(redisChannel, JSON.stringify(envelope));
}

export const publishToSummonStreamViaVercelRedis = publishToSummonFlowViaRedis;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function hmacSha256Hex(secret: string, message: string): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

function normalizePresenceUserData(userData: PresenceUserData): PresenceUserData {
  return {
    memberId: userData.memberId,
    memberInfo: userData.memberInfo,
  };
}
