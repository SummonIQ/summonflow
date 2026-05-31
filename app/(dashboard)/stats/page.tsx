"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Loader2, MessageSquare, Send, TrendingUp } from "lucide-react";
import { readCookie, ACTIVE_APP_COOKIE } from "@/components/app-switcher";

interface AppOption {
  id: string;
  name: string;
}

interface UsageSummary {
  connections: number;
  peakConnections: number;
  messagesPublished: number;
  messagesDelivered: number;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function StatsPage() {
  const [apps, setApps] = useState<AppOption[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    fetch("/api/apps")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: AppOption[]) => {
        const nextApps = Array.isArray(data) ? data : [];
        const cookieAppId = readCookie(ACTIVE_APP_COOKIE);
        const resolvedAppId = nextApps.find((app) => app.id === cookieAppId)?.id ?? null;

        setApps(nextApps);
        setSelectedAppId(resolvedAppId);
      })
      .catch(() => {
        setApps([]);
        setSelectedAppId(null);
      })
      .finally(() => setLoadingApps(false));
  }, []);

  useEffect(() => {
    if (!selectedAppId) {
      setUsage(null);
      return;
    }

    setLoadingUsage(true);
    fetch(`/api/apps/${selectedAppId}/usage`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: UsageSummary | null) => {
        setUsage(data);
      })
      .catch(() => setUsage(null))
      .finally(() => setLoadingUsage(false));
  }, [selectedAppId]);

  const selectedApp = useMemo(
    () => apps.find((app) => app.id === selectedAppId) ?? null,
    [apps, selectedAppId],
  );

  const statCards = [
    {
      label: "Connections",
      value: usage?.connections ?? 0,
      detail: "Total connection opens in the last 30 days",
      icon: Activity,
    },
    {
      label: "Peak Concurrent",
      value: usage?.peakConnections ?? 0,
      detail: "Highest simultaneous connections recorded",
      icon: TrendingUp,
    },
    {
      label: "Messages Published",
      value: usage?.messagesPublished ?? 0,
      detail: "Events sent into the realtime system",
      icon: Send,
    },
    {
      label: "Messages Delivered",
      value: usage?.messagesDelivered ?? 0,
      detail: "Fan-out deliveries completed in the last 30 days",
      icon: MessageSquare,
    },
  ] as const;

  return (
    <main className="space-y-4">
      <header className="flex flex-col gap-2 px-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Statistics</h1>
          <p className="mt-px max-w-2xl text-sm leading-relaxed text-zinc-400">
            Review 30-day usage for your selected application.
          </p>
        </div>

      </header>

      {loadingApps ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-sm font-semibold text-zinc-200">No application statistics yet</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Create an application first, then usage totals will appear here.
          </p>
        </div>
      ) : !selectedAppId ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-6 py-16 text-center">
          <h2 className="text-sm font-semibold text-zinc-200">Select an application</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
            Choose an application from the sidebar selector to view usage statistics.
          </p>
        </div>
      ) : loadingUsage || !usage ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    {card.label}
                  </span>
                  <card.icon className="h-4 w-4 text-teal-500" />
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {formatCount(card.value)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{card.detail}</p>
              </div>
            ))}
          </section>

          <section className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedApp?.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Usage summary aggregated from `usageStat` for the last 30 days.
                </p>
              </div>
              <div className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
                30 Day Window
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
