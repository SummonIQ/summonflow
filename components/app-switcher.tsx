"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { ChevronsUpDown, Check, Loader2, Activity, MessageSquare, CirclePlus } from "lucide-react";
import { useProductAnalytics } from "@/lib/analytics/client";

export const ACTIVE_APP_COOKIE = "sf_active_app";

interface AppOption {
  id: string;
  name: string;
  _count: { channelPolicies: number; webhooks: number };
  usage?: {
    connections: number;
    peakConnections: number;
    messagesPublished: number;
    messagesDelivered: number;
  };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function AppSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ appId?: string }>();
  const { trackProductEvent } = useProductAnalytics();
  const [apps, setApps] = useState<AppOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [cookieAppId, setCookieAppId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCookieAppId(readCookie(ACTIVE_APP_COOKIE));
    fetch("/api/apps")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: AppOption[]) => setApps(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const activeId =
    (typeof params?.appId === "string" ? params.appId : null) ??
    cookieAppId ??
    null;
  const active = apps.find((a) => a.id === activeId) ?? null;

  async function handleSelect(id: string) {
    if (id === activeId) {
      setOpen(false);
      return;
    }
    const selectedApp = apps.find((app) => app.id === id);
    trackProductEvent("application_switched", {
      appId: id,
      appName: selectedApp?.name,
      previousAppId: activeId,
      source: "app_switcher",
    });
    setSwitchingId(id);
    document.cookie = `${ACTIVE_APP_COOKIE}=${encodeURIComponent(id)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setCookieAppId(id);
    setOpen(false);
    setSwitchingId(null);
    if (pathname.startsWith("/apps/")) {
      router.push(`/apps/${id}`);
    } else {
      window.location.reload();
    }
  }

  const triggerLabel = loading
    ? "Loading…"
    : active
      ? active.name
      : apps.length === 0
        ? "No applications"
        : "Select application";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          trackProductEvent(nextOpen ? "application_switcher_opened" : "application_switcher_closed", {
            appId: activeId,
            appCount: apps.length,
          });
        }}
        disabled={loading}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-left transition hover:bg-[var(--line)]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Application
          </div>
          <div className="truncate text-sm font-medium text-[var(--foreground)]">
            {triggerLabel}
          </div>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--muted)]" />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-[var(--line-strong)] bg-[var(--panel)] p-1 shadow-xl"
        >
          {apps.length === 0 ? (
            <div className="px-3 py-3 text-xs text-[var(--muted)]">
              No applications yet
            </div>
          ) : (
            apps.map((app) => {
              const isActive = app.id === activeId;
              const isSwitching = switchingId === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(app.id)}
                  disabled={isSwitching}
                  className={`flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-[var(--line)] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--accent)]/15 font-mono text-[10px] font-semibold uppercase text-[var(--accent)]">
                    {app.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{app.name}</div>
                    <div className="mt-0.5 flex items-center gap-3 text-[10px] text-[var(--muted)]">
                      <span className="flex items-center gap-1" title="Peak concurrent connections (30d)">
                        <Activity className="h-2.5 w-2.5" />
                        {formatCount(app.usage?.peakConnections ?? 0)}
                      </span>
                      <span className="flex items-center gap-1" title="Messages published (30d)">
                        <MessageSquare className="h-2.5 w-2.5" />
                        {formatCount(app.usage?.messagesPublished ?? 0)}
                      </span>
                    </div>
                  </div>
                  {isSwitching ? (
                    <Loader2 className="mt-1 h-3.5 w-3.5 shrink-0 animate-spin text-[var(--muted)]" />
                  ) : isActive ? (
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                  ) : null}
                </button>
              );
            })
          )}
          <div className="border-t border-[var(--line)] p-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                trackProductEvent("manage_applications_clicked", { source: "app_switcher", appId: activeId });
                router.push("/apps");
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-[var(--foreground)]"
            >
              <CirclePlus className="h-3.5 w-3.5" />
              Manage applications
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
