// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import AppsPage from "@/app/(dashboard)/apps/page";

const trackProductEventMock = vi.fn();

vi.mock("@/lib/analytics/client", () => ({
  useProductAnalytics: () => ({ trackProductEvent: trackProductEventMock }),
}));

describe("AppsPage", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    trackProductEventMock.mockClear();
  });

  it("disables application creation after Basic reaches one app", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/api/apps") {
        return Response.json([
          {
            id: "app-1",
            name: "Production",
            key: "key-1",
            secret: "secret-1",
            createdAt: "2026-04-26T10:00:00.000Z",
            channelPolicies: [],
          },
        ]);
      }
      if (url === "/api/billing") {
        return Response.json({ subscription: null });
      }
      return Response.json({}, { status: 404 });
    }));

    render(<AppsPage />);

    expect(await screen.findByText("Basic plan is limited to 1 application. Upgrade to Pro to create more applications.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /new application/i })).toBeDisabled();
  });

  it("keeps application creation enabled for active Pro organizations", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/api/apps") {
        return Response.json([
          {
            id: "app-1",
            name: "Production",
            key: "key-1",
            secret: "secret-1",
            createdAt: "2026-04-26T10:00:00.000Z",
            channelPolicies: [],
          },
        ]);
      }
      if (url === "/api/billing") {
        return Response.json({ subscription: { status: "active", plan: "pro" } });
      }
      return Response.json({}, { status: 404 });
    }));

    render(<AppsPage />);

    await waitFor(() => expect(screen.getByText("Production")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /new application/i })).not.toBeDisabled();
    expect(screen.queryByText(/Basic plan is limited/)).not.toBeInTheDocument();
  });
});
