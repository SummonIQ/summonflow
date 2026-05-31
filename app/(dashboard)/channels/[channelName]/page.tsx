"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Radio, Send, Users } from "lucide-react";
import { ACTIVE_APP_COOKIE, readCookie } from "@/components/app-switcher";
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

interface ChannelEvent {
  id: string;
  eventName: string;
  payload: unknown;
  userId?: string | null;
  createdAt: string;
}

function formatDate(value?: string | null): string {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString();
}

export default function ChannelDetailPage() {
  const params = useParams<{ channelName: string }>();
  const router = useRouter();
  const { trackProductEvent } = useProductAnalytics();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [events, setEvents] = useState<ChannelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("manual-event");
  const [eventPayload, setEventPayload] = useState('{\n  "text": "Manual event from SummonFlow",\n  "source": "dashboard"\n}');
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const channelName = decodeURIComponent(params.channelName);

  useEffect(() => {
    const appId = readCookie(ACTIVE_APP_COOKIE);
    if (!appId) {
      setLoading(false);
      return;
    }

    const selectedAppId = appId;
    setSelectedAppId(selectedAppId);
    let cancelled = false;

    async function refresh() {
      const [channelData, eventData] = await Promise.all([
        fetch(`/api/channels?appId=${encodeURIComponent(selectedAppId)}`, { cache: "no-store" }).then((res) =>
          res.ok ? res.json() : null,
        ),
        fetch(`/api/channels/${encodeURIComponent(channelName)}/events?appId=${encodeURIComponent(selectedAppId)}`, {
          cache: "no-store",
        }).then((res) => (res.ok ? res.json() : null)),
      ]);

      if (cancelled) return;

      const match = (channelData?.channels ?? []).find((item: Channel) => item.name === channelName) ?? null;
      setChannel(match);
      setEvents(eventData?.events ?? []);
      setLastUpdatedAt(new Date());
      setLoading(false);
    }

    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [channelName]);

  async function sendManualEvent() {
    if (!selectedAppId || !eventName.trim()) return;

    let payload: unknown;
    try {
      payload = eventPayload.trim() ? JSON.parse(eventPayload) : {};
    } catch {
      setSendError("Payload must be valid JSON.");
      trackProductEvent("manual_channel_event_failed", {
        appId: selectedAppId,
        channelName,
        eventName: eventName.trim(),
        reason: "invalid_json",
      });
      return;
    }

    setSending(true);
    setSendError(null);
    trackProductEvent("manual_channel_event_send_clicked", {
      appId: selectedAppId,
      channelName,
      eventName: eventName.trim(),
    });
    const res = await fetch(`/api/channels/${encodeURIComponent(channelName)}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appId: selectedAppId,
        eventName: eventName.trim(),
        payload,
      }),
    });
    const data = await res.json().catch(() => null);
    setSending(false);

    if (!res.ok) {
      setSendError(data?.error ?? "Unable to send event.");
      trackProductEvent("manual_channel_event_failed", {
        appId: selectedAppId,
        channelName,
        eventName: eventName.trim(),
        reason: data?.error ?? "request_failed",
      });
    } else {
      trackProductEvent("manual_channel_event_sent", {
        appId: selectedAppId,
        channelName,
        eventName: eventName.trim(),
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!channel) {
    return (
      <main className="space-y-5">
        <button
          onClick={() => router.push("/channels")}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to channels
        </button>
        <section className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-6 py-16 text-center">
          <h1 className="text-sm font-semibold text-zinc-200">Channel not found</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
            Select an application from the sidebar and open a known channel.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-5">
      <Link href="/channels" className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to channels
      </Link>

      <header className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2 ${channel.occupied ? "bg-teal-500/10 text-teal-500" : "bg-zinc-800 text-zinc-600"}`}>
                <Radio className="h-4 w-4" />
              </div>
              <h1 className="font-mono text-xl font-semibold text-white">{channel.name}</h1>
            </div>
            <p className="mt-2 text-sm text-zinc-500">{channel.appName}</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            channel.occupied ? "bg-teal-500/10 text-teal-400" : "bg-zinc-800 text-zinc-500"
          }`}>
            {channel.occupied ? "Live" : "Inactive"}
          </span>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Metric label="Subscribers" value={String(channel.subscriptionCount)} icon={<Users className="h-4 w-4" />} />
        <Metric label="First seen" value={formatDate(channel.firstSeenAt)} />
        <Metric label="Last seen" value={formatDate(channel.lastSeenAt)} />
      </section>

      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-white">Send event</h2>
          <button
            type="button"
            onClick={sendManualEvent}
            disabled={sending || !selectedAppId || !eventName.trim()}
            className="button-default inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(180px,260px)_1fr]">
          <label className="space-y-2">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Event name</span>
            <input
              value={eventName}
              onChange={(event) => setEventName(event.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
            />
          </label>
          <label className="space-y-2">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payload</span>
            <textarea
              value={eventPayload}
              onChange={(event) => setEventPayload(event.target.value)}
              rows={5}
              spellCheck={false}
              className="min-h-32 w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 font-mono text-xs leading-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
            />
          </label>
        </div>
        {sendError ? <p className="mt-3 text-sm text-red-400">{sendError}</p> : null}
      </section>

      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Events</h2>
            <p className="mt-1 text-xs text-zinc-500">Most recent published messages on this channel.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-400">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Live updating{lastUpdatedAt ? ` · ${lastUpdatedAt.toLocaleTimeString()}` : ""}
          </div>
        </div>
        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/20 px-4 py-10 text-center text-sm text-zinc-500">
            No events have been recorded for this channel yet.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm font-semibold text-white">{event.eventName}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {formatDate(event.createdAt)}
                      {event.userId ? ` · user ${event.userId}` : ""}
                    </div>
                  </div>
                </div>
                <pre className="mt-3 max-h-64 overflow-auto rounded-md bg-black/40 p-3 text-xs leading-5 text-zinc-300">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
