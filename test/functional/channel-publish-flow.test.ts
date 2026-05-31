import { describe, expect, it } from "vitest";
import {
  appFindFirstMock,
  fetchMock,
  loadPublishRoute,
  makePublishRequest,
} from "../helpers/channel-publish-route";

describe("manual channel event publish flow", () => {
  it("publishes the dashboard event to the realtime server for the selected app and channel", async () => {
    const { POST } = await loadPublishRoute();

    const res = await POST(makePublishRequest({
      appId: "app-1",
      eventName: "manual-event",
      payload: { text: "Manual event from test", count: 1 },
    }) as never, {
      params: Promise.resolve({ channelName: "presence-sample-room" }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(appFindFirstMock).toHaveBeenCalledWith({
      where: { id: "app-1", organizationId: "org-1" },
      select: { key: true },
    });
    expect(fetchMock).toHaveBeenCalledWith("http://127.0.0.1:6001/apps/test-app-key/events", {
      method: "POST",
      headers: {
        Authorization: "Bearer local-publish-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "presence-sample-room",
        event: "manual-event",
        data: { text: "Manual event from test", count: 1 },
      }),
    });
  });

  it("surfaces realtime publish failures", async () => {
    fetchMock.mockResolvedValue(new Response("publish failed", { status: 500 }));
    const { POST } = await loadPublishRoute();

    const res = await POST(makePublishRequest({
      appId: "app-1",
      eventName: "manual-event",
      payload: {},
    }) as never, {
      params: Promise.resolve({ channelName: "presence-sample-room" }),
    });

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "publish failed" });
  });
});
