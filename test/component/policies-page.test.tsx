// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import PoliciesPage from "@/app/(dashboard)/policies/page";

const trackProductEventMock = vi.fn();
const readCookieMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics/client", () => ({
  useProductAnalytics: () => ({ trackProductEvent: trackProductEventMock }),
}));

vi.mock("@/components/app-switcher", () => ({
  ACTIVE_APP_COOKIE: "summonflow_active_app",
  readCookie: readCookieMock,
}));

describe("PoliciesPage", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    readCookieMock.mockReset();
    trackProductEventMock.mockClear();
  });

  it("asks for an active application before showing policy content", async () => {
    readCookieMock.mockReturnValue(null);
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
      if (String(input) === "/api/apps") return Response.json([]);
      return Response.json([], { status: 404 });
    }));

    render(<PoliciesPage />);

    expect(await screen.findByText("Select an application")).toBeInTheDocument();
    expect(screen.getByText("Choose an application from the sidebar selector to view channel policies.")).toBeInTheDocument();
  });

  it("submits trimmed global policy input from the create panel", async () => {
    readCookieMock.mockReturnValue("app-1");
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.startsWith("/api/policies?")) return Response.json([]);
      if (url === "/api/apps") return Response.json([{ id: "app-1", name: "Production" }]);
      if (url === "/api/policies" && init?.method === "POST") {
        return Response.json({ id: "policy-1", pattern: "private-*", type: "PRIVATE" }, { status: 201 });
      }
      return Response.json({}, { status: 404 });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<PoliciesPage />);

    await screen.findByText("No policies defined");
    fireEvent.click(screen.getByRole("button", { name: /create policy/i }));
    fireEvent.change(screen.getByPlaceholderText("Name (optional)"), {
      target: { value: "  Private channels  " },
    });
    fireEvent.change(screen.getByPlaceholderText("Pattern (e.g. private-*)"), {
      target: { value: "  private-*  " },
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "PRIVATE" } });
    fireEvent.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/policies", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          pattern: "private-*",
          type: "PRIVATE",
          name: "Private channels",
          appId: null,
        }),
      }));
    });
  });
});
