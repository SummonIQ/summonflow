import { createClient, type RedisClientType } from "redis";
import type { PubSubEnvelope, SummonStreamPubSubAdapter } from "@summoniq/summonflow-server-node";

export interface RedisPubSubAdapterOptions {
  channel?: string;
  redisUrl: string;
}

export async function createRedisPubSubAdapter(
  options: RedisPubSubAdapterOptions,
): Promise<SummonStreamPubSubAdapter> {
  const channel = options.channel ?? "summonflow:events";
  const publisher = createClient({ url: options.redisUrl });
  const subscriber = createClient({ url: options.redisUrl });

  await Promise.all([publisher.connect(), subscriber.connect()]);

  return {
    publish: async (envelope) => {
      await publisher.publish(channel, JSON.stringify(envelope));
    },
    subscribe: async (handler) => {
      await subscriber.subscribe(channel, async (message) => {
        await handler(JSON.parse(message) as PubSubEnvelope);
      });

      return async () => {
        await subscriber.unsubscribe(channel);
      };
    },
    close: async () => {
      await Promise.allSettled([publisher.quit(), subscriber.quit()]);
    },
  };
}

export function createRedisClientFromEnv(envVar = "REDIS_URL"): RedisClientType {
  const redisUrl = process.env[envVar];
  if (!redisUrl) {
    throw new Error(`Missing ${envVar}`);
  }

  return createClient({ url: redisUrl });
}
