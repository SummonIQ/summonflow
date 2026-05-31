import {
  createInMemoryPubSubAdapter,
  createSummonStreamNodeServer,
} from "@summoniq/summonflow-server-node";

async function main(): Promise<void> {
  const pubSub = process.env.REDIS_URL
    ? await createRedisPubSubAdapter(process.env.REDIS_URL)
    : createInMemoryPubSubAdapter();

  const attached = await createSummonStreamNodeServer({
    app: {
      key: required("SUMMONFLOW_APP_KEY"),
      secret: required("SUMMONFLOW_APP_SECRET"),
      encryptionMasterKeyBase64: process.env.SUMMONFLOW_ENCRYPTION_MASTER_KEY_BASE64,
    },
    path: process.env.SUMMONFLOW_WS_PATH ?? "/app",
    authPath: process.env.SUMMONFLOW_AUTH_PATH ?? "/realtime/auth",
    publishPath:
      process.env.SUMMONFLOW_PUBLISH_PATH ?? `/apps/${required("SUMMONFLOW_APP_KEY")}/events`,
    publishToken: process.env.SUMMONFLOW_PUBLISH_TOKEN,
    activityTimeoutSeconds: optionalNumber("SUMMONFLOW_ACTIVITY_TIMEOUT_SECONDS") ?? 120,
    pubSub,
    authorize: ({ channelName }) => {
      if (channelName.startsWith("presence-")) {
        return {
          ok: true,
          userData: {
            memberId: "node-service",
            memberInfo: { role: "server" },
          },
        };
      }

      return { ok: true };
    },
  });

  const port = optionalNumber("PORT") ?? 8080;
  await new Promise<void>((resolve) => attached.server.listen(port, "0.0.0.0", resolve));
  console.log(
    `SummonFlow node demo listening on :${port} using ${process.env.REDIS_URL ? "redis" : "in-memory"} pubsub`,
  );
}

void main();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key}`);
  }
  return value;
}

function optionalNumber(key: string): number | undefined {
  const value = process.env[key];
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function createRedisPubSubAdapter(redisUrl: string) {
  const redisModule = await import("@summoniq/summonflow-server-redis");
  return redisModule.createRedisPubSubAdapter({ redisUrl });
}
