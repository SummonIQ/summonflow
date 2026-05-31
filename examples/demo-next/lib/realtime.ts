"use client";

import SummonFlow from "@summoniq/summonflow-client-sdk";
import { getMissingPublicEnvKeys, getPublicEnv } from "./env";

let instance: SummonFlow | null = null;

export function getRealtimeClient(): SummonFlow {
  if (!instance) {
    const env = getPublicEnv();
    const missingKeys = getMissingPublicEnvKeys(env);

    if (missingKeys.length > 0) {
      throw new Error(`Missing ${missingKeys.join(", ")}`);
    }

    const { appKey, wsHost } = env;

    instance = new SummonFlow(appKey as string, {
      wsHost: wsHost as string,
      wsPort: env.wsPort,
      wssPort: env.wssPort,
      wsPath: env.wsPath,
      forceTLS: env.forceTls,
      channelAuthorization: {
        endpoint: env.authPath,
      },
    });
  }

  return instance;
}
