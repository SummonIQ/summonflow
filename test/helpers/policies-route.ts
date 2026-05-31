import { afterEach, beforeEach, vi } from "vitest";

type MockContext = {
  organization: { id: string };
};

export const ensureOrganizationContextMock = vi.fn<() => Promise<MockContext | null>>();
export const appFindFirstMock = vi.fn();
export const channelPolicyCreateMock = vi.fn();
export const channelPolicyFindManyMock = vi.fn();

export async function loadPoliciesRoute() {
  vi.resetModules();
  vi.doMock("@/lib/organization", () => ({
    ensureOrganizationContext: ensureOrganizationContextMock,
  }));
  vi.doMock("@/lib/db/client", () => ({
    db: {
      app: {
        findFirst: appFindFirstMock,
      },
      channelPolicy: {
        create: channelPolicyCreateMock,
        findMany: channelPolicyFindManyMock,
      },
    },
  }));
  return import("@/app/api/policies/route");
}

export function makePolicyCreateRequest(body: unknown) {
  return new Request("http://localhost:30220/api/policies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  ensureOrganizationContextMock.mockResolvedValue({ organization: { id: "org-1" } });
  appFindFirstMock.mockResolvedValue({ id: "app-1", organizationId: "org-1" });
  channelPolicyCreateMock.mockResolvedValue({
    id: "policy-1",
    organizationId: "org-1",
    appId: null,
    pattern: "private-*",
    type: "PRIVATE",
    name: null,
    app: null,
  });
  channelPolicyFindManyMock.mockResolvedValue([]);
});

afterEach(() => {
  vi.clearAllMocks();
});
