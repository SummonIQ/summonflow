import { describe, expect, it } from "vitest";
import {
  appFindFirstMock,
  ensureOrganizationContextMock,
  loadPublishRoute,
  makePublishRequest,
} from "../helpers/channel-publish-route";

describe("channel publish route unit behavior", () => {
  it("rejects unauthenticated requests", async () => {
    ensureOrganizationContextMock.mockResolvedValue(null);
    const { POST } = await loadPublishRoute();

    const res = await POST(makePublishRequest({
      appId: "app-1",
      eventName: "manual-event",
      payload: { text: "hello" },
    }) as never, {
      params: Promise.resolve({ channelName: "presence-sample-room" }),
    });

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("rejects requests without an app or event name", async () => {
    const { POST } = await loadPublishRoute();

    const res = await POST(makePublishRequest({ appId: "app-1", eventName: "  " }) as never, {
      params: Promise.resolve({ channelName: "presence-sample-room" }),
    });

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Application and event name are required." });
  });

  it("rejects apps outside the active organization", async () => {
    appFindFirstMock.mockResolvedValue(null);
    const { POST } = await loadPublishRoute();

    const res = await POST(makePublishRequest({
      appId: "app-1",
      eventName: "manual-event",
      payload: {},
    }) as never, {
      params: Promise.resolve({ channelName: "presence-sample-room" }),
    });

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Application not found." });
  });
});
