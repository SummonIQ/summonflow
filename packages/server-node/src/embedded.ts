import { createSummonStreamNodeServer, type SummonStreamServerOptions } from "./index";

export interface EmbeddedSummonFlowOptions extends SummonStreamServerOptions {
  host?: string;
  port?: number;
}

export async function createEmbeddedSummonFlowServer(
  options: EmbeddedSummonFlowOptions,
): Promise<{
  host: string;
  port: number;
  wsUrl: string;
  authUrl: string;
  publishUrl: string;
  close(): Promise<void>;
}> {
  const host = options.host ?? "127.0.0.1";
  const attached = await createSummonStreamNodeServer(options);

  await new Promise<void>((resolve) => attached.server.listen(options.port ?? 0, host, resolve));
  const address = attached.server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to resolve embedded server address");
  }

  const wsPath = normalizePath(options.path ?? "/app");
  const authPath = normalizePath(options.authPath ?? "/realtime/auth");
  const publishPath = normalizePath(options.publishPath ?? `/apps/${options.app.key}/events`);
  const origin = `http://${host}:${address.port}`;

  return {
    host,
    port: address.port,
    wsUrl: `ws://${host}:${address.port}${wsPath}/${options.app.key}`,
    authUrl: `${origin}${authPath}`,
    publishUrl: `${origin}${publishPath}`,
    close: attached.close,
  };
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path.replace(/\/$/, "") : `/${path.replace(/\/$/, "")}`;
}
