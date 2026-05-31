"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Radio, Users, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { readCookie, ACTIVE_APP_COOKIE } from "@/components/app-switcher";
import { useProductAnalytics } from "@/lib/analytics/client";

interface Channel {
  name: string;
  appName: string;
  appId: string;
  subscriptionCount: number;
  occupied: boolean;
  firstSeenAt?: string | null;
  lastSeenAt?: string | null;
}

export default function ActiveChannelsPage() {
  const { trackProductEvent } = useProductAnalytics();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchChannels() {
    const appId = readCookie(ACTIVE_APP_COOKIE);
    setSelectedAppId(appId);
    if (!appId) {
      setChannels([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const res = await fetch(`/api/channels?appId=${encodeURIComponent(appId)}`);
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels ?? []);
      }
    } catch {
      // silent
    }
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    fetchChannels();
    const interval = setInterval(fetchChannels, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="space-y-5">
      <header className="flex flex-col gap-3 px-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Active Channels</h1>
          <p className="mt-px text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Live and previously seen channels for the selected application.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            trackProductEvent("channels_refreshed", {
              appId: selectedAppId,
              channelCount: channels.length,
            });
            fetchChannels();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {!selectedAppId ? (
        <SelectApplicationState />
      ) : loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : channels.length === 0 ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center space-y-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20"
        >
          <div className="rounded-full bg-zinc-900 p-4 text-zinc-600">
            <Activity className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">No active channels</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
              Channels will appear here after clients connect to this application.
            </p>
          </div>
        </motion.section>
      ) : (
        <div className="grid gap-3">
          {channels.map((ch) => (
            <motion.div
              key={`${ch.appId}-${ch.name}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 transition hover:border-zinc-700 hover:bg-zinc-900/50"
            >
              <Link
                href={`/channels/${encodeURIComponent(ch.name)}`}
                onClick={() => trackProductEvent("channel_opened", {
                  appId: ch.appId,
                  channelName: ch.name,
                  occupied: ch.occupied,
                  subscriptionCount: ch.subscriptionCount,
                })}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${ch.occupied ? "bg-teal-500/10 text-teal-500" : "bg-zinc-800 text-zinc-600"}`}>
                    <Radio className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-mono text-sm text-white">{ch.name}</div>
                    <div className="text-xs text-zinc-500">{ch.appName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    ch.occupied ? "bg-teal-500/10 text-teal-400" : "bg-zinc-800 text-zinc-500"
                  }`}>
                    {ch.occupied ? "Live" : "Inactive"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Users className="h-3.5 w-3.5" />
                    {ch.subscriptionCount} subscriber{ch.subscriptionCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

function SelectApplicationState() {
  return (
    <section className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-6 py-16 text-center">
      <h2 className="text-sm font-semibold text-zinc-200">Select an application</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
        Choose an application from the sidebar selector to view active channels.
      </p>
    </section>
  );
}
