import { afterEach, beforeEach, vi } from "vitest";

type MockContext = {
  organization: { id: string };
};

export const ensureOrganizationContextMock = vi.fn<() => Promise<MockContext | null>>();
export const appFindFirstMock = vi.fn();
export const fetchMock = vi.fn<typeof fetch>();

export async function loadPublishRoute() {
  vi.resetModules();
  vi.doMock("@/lib/organization", () => ({
    ensureOrganizationContext: ensureOrganizationContextMock,
  }));
  vi.doMock("@/lib/db/client", () => ({
    db: {
      app: {
        findFirst: appFindFirstMock,
      },
    },
  }));
  return import("@/app/api/channels/[channelName]/publish/route");
}

export function makePublishRequest(body: unknown) {
  return new Request("http://localhost:30220/api/channels/presence-sample-room/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  process.env.SUMMONFLOW_SERVER_URL = "http://127.0.0.1:6001";
  process.env.SUMMONFLOW_SERVER_TOKEN = "local-publish-token";
  ensureOrganizationContextMock.mockResolvedValue({ organization: { id: "org-1" } });
  appFindFirstMock.mockResolvedValue({ key: "test-app-key" });
  fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  delete process.env.SUMMONFLOW_SERVER_URL;
  delete process.env.SUMMONFLOW_SERVER_TOKEN;
});
