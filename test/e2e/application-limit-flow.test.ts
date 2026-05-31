import { describe, expect, it } from "vitest";
import {
  appCountMock,
  appCreateMock,
  loadAppsRoute,
  makeAppCreateRequest,
  subscriptionFindUniqueMock,
} from "../helpers/apps-route";

describe("application limit e2e flow", () => {
  it("allows the first Basic app, blocks the second, then allows creation after Pro upgrade", async () => {
    const { POST } = await loadAppsRoute();

    appCountMock.mockResolvedValueOnce(0);
    appCreateMock.mockResolvedValueOnce({ id: "app-1", name: "First app" });
    let res = await POST(makeAppCreateRequest("First app") as never);
    expect(res.status).toBe(201);

    appCountMock.mockResolvedValueOnce(1);
    subscriptionFindUniqueMock.mockResolvedValueOnce(null);
    res = await POST(makeAppCreateRequest("Second app") as never);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({
      code: "APPLICATION_LIMIT_REACHED",
      limit: 1,
    });

    appCountMock.mockResolvedValueOnce(1);
    subscriptionFindUniqueMock.mockResolvedValueOnce({ status: "active", plan: "pro" });
    appCreateMock.mockResolvedValueOnce({ id: "app-2", name: "Second app" });
    res = await POST(makeAppCreateRequest("Second app") as never);
    expect(res.status).toBe(201);
    expect(appCreateMock).toHaveBeenLastCalledWith({
      data: {
        name: "Second app",
        userId: "user-1",
        organizationId: "org-1",
      },
    });
  });
});
