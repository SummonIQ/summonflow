"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Radio, Users, RefreshCw, Loader2 } from "lucide-react";

interface Channel {
  name: string;
  appName: string;
  appId: string;
  subscriptionCount: number;
  occupied: boolean;
}

export default function ActiveChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchChannels() {
    try {
      const res = await fetch("/api/channels");
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
    <main className="space-y-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Active Channels</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Real-time monitor of live channel traffic across your applications.
          </p>
        </div>
        <button
          onClick={() => { setRefreshing(true); fetchChannels(); }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {loading ? (
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
              Channels will appear here as clients connect to your applications.
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
              className="flex items-center justify-between rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-4"
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
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Users className="h-3.5 w-3.5" />
                {ch.subscriptionCount} subscriber{ch.subscriptionCount !== 1 ? "s" : ""}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
