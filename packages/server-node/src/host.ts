import { createSummonStreamNodeServer, type SummonStreamServerOptions } from "./index";

export interface NodeHostBootstrapOptions {
  authorize?: SummonStreamServerOptions["authorize"];
  port?: number;
}

export async function startSummonFlowNodeServer(
  options: NodeHostBootstrapOptions = {},
): Promise<{
  port: number;
  close(): Promise<void>;
}> {
  const attached = await createSummonStreamNodeServer({
    app: {
      key: requiredEnv("SUMMONFLOW_APP_KEY"),
      secret: requiredEnv("SUMMONFLOW_APP_SECRET"),
    },
    authorize: options.authorize,
    path: process.env.SUMMONFLOW_WS_PATH,
    authPath: process.env.SUMMONFLOW_AUTH_PATH,
    publishPath: process.env.SUMMONFLOW_PUBLISH_PATH,
    publishToken: process.env.SUMMONFLOW_PUBLISH_TOKEN,
    activityTimeoutSeconds: readOptionalNumber("SUMMONFLOW_ACTIVITY_TIMEOUT_SECONDS"),
  });

  const port = options.port ?? readOptionalNumber("PORT") ?? 8080;
  await new Promise<void>((resolve) => attached.server.listen(port, resolve));

  return {
    port,
    close: attached.close,
  };
}

export default startSummonFlowNodeServer;

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var ${key}`);
  }
  return value;
}

function readOptionalNumber(key: string): number | undefined {
  const value = process.env[key];
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
