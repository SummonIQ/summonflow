import { describe, expect, it } from "vitest";
import {
  appCountMock,
  appCreateMock,
  ensureOrganizationContextMock,
  loadAppsRoute,
  makeAppCreateRequest,
  subscriptionFindUniqueMock,
} from "../helpers/apps-route";

describe("apps route application limits", () => {
  it("rejects unauthenticated app creation", async () => {
    ensureOrganizationContextMock.mockResolvedValue(null);
    const { POST } = await loadAppsRoute();

    const res = await POST(makeAppCreateRequest() as never);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
    expect(appCreateMock).not.toHaveBeenCalled();
  });

  it("rejects basic organizations after one application", async () => {
    appCountMock.mockResolvedValue(1);
    subscriptionFindUniqueMock.mockResolvedValue(null);
    const { POST } = await loadAppsRoute();

    const res = await POST(makeAppCreateRequest("Second app") as never);

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: "Basic plan is limited to 1 application. Upgrade to Pro to create more applications.",
      code: "APPLICATION_LIMIT_REACHED",
      limit: 1,
    });
    expect(appCreateMock).not.toHaveBeenCalled();
  });

  it("allows active pro organizations to create additional applications", async () => {
    appCountMock.mockResolvedValue(1);
    subscriptionFindUniqueMock.mockResolvedValue({ status: "active", plan: "pro" });
    const { POST } = await loadAppsRoute();

    const res = await POST(makeAppCreateRequest("Second app") as never);

    expect(res.status).toBe(201);
    expect(appCreateMock).toHaveBeenCalledWith({
      data: {
        name: "Second app",
        userId: "user-1",
        organizationId: "org-1",
      },
    });
  });
});
