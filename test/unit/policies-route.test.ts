import { describe, expect, it } from "vitest";
import {
  appFindFirstMock,
  channelPolicyCreateMock,
  ensureOrganizationContextMock,
  loadPoliciesRoute,
  makePolicyCreateRequest,
} from "../helpers/policies-route";

describe("policies route validation", () => {
  it("rejects unauthenticated policy creation", async () => {
    ensureOrganizationContextMock.mockResolvedValue(null);
    const { POST } = await loadPoliciesRoute();

    const res = await POST(makePolicyCreateRequest({ pattern: "private-*", type: "PRIVATE" }) as never);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(channelPolicyCreateMock).not.toHaveBeenCalled();
  });

  it("rejects empty patterns before checking app ownership", async () => {
    const { POST } = await loadPoliciesRoute();

    const res = await POST(makePolicyCreateRequest({ pattern: "   ", type: "PRIVATE", appId: "app-1" }) as never);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Pattern is required" });
    expect(appFindFirstMock).not.toHaveBeenCalled();
    expect(channelPolicyCreateMock).not.toHaveBeenCalled();
  });

  it("rejects invalid channel policy types", async () => {
    const { POST } = await loadPoliciesRoute();

    const res = await POST(makePolicyCreateRequest({ pattern: "presence-*", type: "SECRET" }) as never);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid channel type" });
    expect(channelPolicyCreateMock).not.toHaveBeenCalled();
  });

  it("rejects app-scoped policies outside the active organization", async () => {
    appFindFirstMock.mockResolvedValue(null);
    const { POST } = await loadPoliciesRoute();

    const res = await POST(makePolicyCreateRequest({ pattern: "private-*", type: "PRIVATE", appId: "app-2" }) as never);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "App not found" });
    expect(channelPolicyCreateMock).not.toHaveBeenCalled();
  });

  it("trims policy input before creating global policies", async () => {
    const { POST } = await loadPoliciesRoute();

    const res = await POST(makePolicyCreateRequest({
      pattern: "  private-*  ",
      type: "PRIVATE",
      name: "  Private channels  ",
      appId: null,
    }) as never);

    expect(res.status).toBe(201);
    expect(channelPolicyCreateMock).toHaveBeenCalledWith({
      data: {
        organizationId: "org-1",
        appId: null,
        pattern: "private-*",
        type: "PRIVATE",
        name: "Private channels",
      },
      include: { app: { select: { id: true, name: true } } },
    });
  });
});
