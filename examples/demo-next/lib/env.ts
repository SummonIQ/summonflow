export interface PublicEnv {
  appKey?: string;
  wsHost?: string;
  wsPort?: number;
  wssPort?: number;
  forceTls: boolean;
  wsPath: string;
  authPath: string;
  defaultChannel: string;
}

export function getPublicEnv(): PublicEnv {
  return {
    appKey: optionalString("NEXT_PUBLIC_SUMMONFLOW_APP_KEY"),
    wsHost: optionalString("NEXT_PUBLIC_SUMMONFLOW_WS_HOST"),
    wsPort: optionalNumber("NEXT_PUBLIC_SUMMONFLOW_WS_PORT"),
    wssPort: optionalNumber("NEXT_PUBLIC_SUMMONFLOW_WSS_PORT"),
    forceTls: optionalBoolean("NEXT_PUBLIC_SUMMONFLOW_FORCE_TLS", true),
    wsPath: process.env.NEXT_PUBLIC_SUMMONFLOW_WS_PATH ?? "/app",
    authPath: process.env.NEXT_PUBLIC_SUMMONFLOW_AUTH_PATH ?? "/api/realtime/auth",
    defaultChannel: process.env.NEXT_PUBLIC_SUMMONFLOW_DEFAULT_CHANNEL ?? "presence-demo-room",
  };
}

export function getMissingPublicEnvKeys(env: PublicEnv): string[] {
  return ["appKey", "wsHost"].filter((key) => !env[key as keyof PublicEnv]) as string[];
}

function optionalString(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

function optionalNumber(key: string): number | undefined {
  const value = process.env[key];
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
