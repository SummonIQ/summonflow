import { createAuthHandler } from "@summoniq/summonflow-server-sdk";

export async function POST(request: Request): Promise<Response> {
  const handler = createAuthHandler({
    appKey: required("NEXT_PUBLIC_SUMMONFLOW_APP_KEY"),
    secret: required("SUMMONFLOW_APP_SECRET"),
    authorize: async (_request, context) => {
      if (context.channelName.startsWith("presence-")) {
        return {
          ok: true,
          userData: {
            memberId: "demo-user",
            memberInfo: {
              name: "Demo User",
            },
          },
        };
      }

      return { ok: true };
    },
  });

  return handler(request);
}

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key}`);
  }
  return value;
}
