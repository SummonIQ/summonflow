import { afterEach, beforeEach, vi } from "vitest";

type MockContext = {
  user: { id: string };
  organization: { id: string };
};

export const ensureOrganizationContextMock = vi.fn<() => Promise<MockContext | null>>();
export const appCountMock = vi.fn();
export const appCreateMock = vi.fn();
export const subscriptionFindUniqueMock = vi.fn();
export const appFindManyMock = vi.fn();

export async function loadAppsRoute() {
  vi.resetModules();
  vi.doMock("@/lib/organization", () => ({
    ensureOrganizationContext: ensureOrganizationContextMock,
  }));
  vi.doMock("@/lib/usage", () => ({
    getAppUsageSummary: vi.fn(),
  }));
  vi.doMock("@/lib/db/client", () => ({
    db: {
      app: {
        count: appCountMock,
        create: appCreateMock,
        findMany: appFindManyMock,
      },
      subscription: {
        findUnique: subscriptionFindUniqueMock,
      },
    },
  }));
  return import("@/app/api/apps/route");
}

export function makeAppCreateRequest(name = "Production") {
  return new Request("http://localhost:30220/api/apps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

beforeEach(() => {
  ensureOrganizationContextMock.mockResolvedValue({
    user: { id: "user-1" },
    organization: { id: "org-1" },
  });
  appCountMock.mockResolvedValue(0);
  appCreateMock.mockResolvedValue({
    id: "app-1",
    name: "Production",
    userId: "user-1",
    organizationId: "org-1",
  });
  subscriptionFindUniqueMock.mockResolvedValue(null);
  appFindManyMock.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});
