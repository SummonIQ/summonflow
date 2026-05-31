import {
  createSummonStreamCloudflare,
  type SummonStreamCloudflareEnv,
} from "./src/index";

interface WorkerEnv extends SummonStreamCloudflareEnv {
  SUMMON_STREAM_APP_KEY: string;
  SUMMON_STREAM_APP_SECRET: string;
  SUMMON_STREAM_AUTH_PATH?: string;
  SUMMON_STREAM_PUBLISH_PATH?: string;
  SUMMON_STREAM_WS_PATH?: string;
  SUMMON_STREAM_PUBLISH_TOKEN?: string;
  SUMMON_STREAM_ENCRYPTION_MASTER_KEY_BASE64?: string;
  SUMMON_STREAM_ACTIVITY_TIMEOUT_SECONDS?: string;
}

const runtime = createSummonStreamCloudflare({
  appKey: "placeholder",
  secret: "placeholder",
  authorize: (request, context) => {
    if (context.channelName.startsWith("presence-")) {
      return {
        ok: true,
        userData: {
          memberId: request.headers.get("x-user-id") ?? "cloudflare-user",
          memberInfo: {
            source: "cloudflare-worker",
          },
        },
      };
    }

    return { ok: true };
  },
});

export class SummonStreamHub extends runtime.SummonStreamHub {}

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const app = createSummonStreamCloudflare({
      appKey: env.SUMMON_STREAM_APP_KEY,
      secret: env.SUMMON_STREAM_APP_SECRET,
      publishToken: env.SUMMON_STREAM_PUBLISH_TOKEN,
      encryptionMasterKeyBase64: env.SUMMON_STREAM_ENCRYPTION_MASTER_KEY_BASE64,
      authPath: env.SUMMON_STREAM_AUTH_PATH,
      publishPath: env.SUMMON_STREAM_PUBLISH_PATH,
      wsPath: env.SUMMON_STREAM_WS_PATH,
      activityTimeoutSeconds: env.SUMMON_STREAM_ACTIVITY_TIMEOUT_SECONDS
        ? Number(env.SUMMON_STREAM_ACTIVITY_TIMEOUT_SECONDS)
        : undefined,
      authorize: (authRequest, context) => {
        if (context.channelName.startsWith("presence-")) {
          return {
            ok: true,
            userData: {
              memberId: authRequest.headers.get("x-user-id") ?? "cloudflare-user",
              memberInfo: {
                source: "cloudflare-worker",
              },
            },
          };
        }

        return { ok: true };
      },
    });

    return app.fetch(request, env);
  },
};
