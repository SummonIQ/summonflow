import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Radio, Lock, Users, Zap, Shield, Globe, Code2, Activity, Server, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything SummonFlow gives you — channels, presence, encryption, webhooks, and a real control plane.",
};

const features = [
  {
    icon: Radio,
    title: "Public, Private & Presence Channels",
    description: "Subscribe to public channels instantly. Use signed subscriptions for private data. Track who's online with presence channels and member rosters.",
    color: "teal",
  },
  {
    icon: Lock,
    title: "End-to-end Encryption",
    description: "Private encrypted channels use AES-256-GCM with per-channel secrets. The server never sees plaintext — only clients with the key can decrypt.",
    color: "pink",
  },
  {
    icon: Users,
    title: "Presence & Member Tracking",
    description: "Know who's connected in real time. Get member_added and member_removed events with custom user info for collaborative UIs.",
    color: "amber",
  },
  {
    icon: Zap,
    title: "Redis-backed Fanout",
    description: "Horizontally scale socket servers with Redis pub/sub. Every connected client gets the event regardless of which server they're on.",
    color: "emerald",
  },
  {
    icon: Shield,
    title: "Signed Subscription Auth",
    description: "Stateless auth flow — your backend signs subscription requests with your app secret. No sessions, no shared state, no race conditions.",
    color: "indigo",
  },
  {
    icon: Globe,
    title: "Deploy Anywhere",
    description: "Railway for persistent servers, Cloudflare Workers for edge routing, Vercel for auth and publish. Or use our managed platform and skip all of it.",
    color: "sky",
  },
  {
    icon: Code2,
    title: "TypeScript Client SDK",
    description: "Clean API for subscribe, bind, trigger, and presence. Works in browser and Node.js. Reconnects with exponential backoff. Zero dependencies beyond WebSocket.",
    color: "violet",
  },
  {
    icon: Activity,
    title: "Live Channel Monitor",
    description: "See active channels, subscriber counts, and connection state in real time from the console. No log spelunking.",
    color: "orange",
  },
  {
    icon: Layers,
    title: "Channel Policies",
    description: "Define pattern-based rules per app — which channels are public, which require auth, which use encryption. Visible and auditable from the console.",
    color: "lime",
  },
  {
    icon: Server,
    title: "Webhooks",
    description: "Get notified when channels become occupied or vacated, members join or leave, and clients trigger events. Configure per application.",
    color: "rose",
  },
];

const colorMap: Record<string, { icon: string; bg: string; glow: string }> = {
  teal: { icon: "text-[var(--teal)]", bg: "bg-[rgba(15,76,83,0.08)]", glow: "rgba(15,76,83,0.15)" },
  pink: { icon: "text-pink-500", bg: "bg-pink-500/8", glow: "rgba(244,114,182,0.12)" },
  amber: { icon: "text-[var(--gold)]", bg: "bg-[rgba(232,176,77,0.1)]", glow: "rgba(232,176,77,0.12)" },
  emerald: { icon: "text-emerald-500", bg: "bg-emerald-500/8", glow: "rgba(34,197,94,0.12)" },
  indigo: { icon: "text-indigo-500", bg: "bg-indigo-500/8", glow: "rgba(129,140,248,0.12)" },
  sky: { icon: "text-sky-500", bg: "bg-sky-500/8", glow: "rgba(56,189,248,0.12)" },
  violet: { icon: "text-violet-500", bg: "bg-violet-500/8", glow: "rgba(167,139,250,0.12)" },
  orange: { icon: "text-orange-500", bg: "bg-orange-500/8", glow: "rgba(249,115,22,0.12)" },
  lime: { icon: "text-lime-500", bg: "bg-lime-500/8", glow: "rgba(132,204,22,0.12)" },
  rose: { icon: "text-rose-500", bg: "bg-rose-500/8", glow: "rgba(244,63,94,0.12)" },
};

export default function FeaturesPage() {
  return (
    <main className="page-shell min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">&larr; Back to home</Link>

        <div className="mt-8 max-w-3xl">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Features
          </div>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Everything you need for production realtime.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Channels, presence, encryption, webhooks, and a control plane that makes the whole
            system legible. Self-host it or let us run it.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const colors = colorMap[feature.color];
            return (
              <div key={feature.title} className="group relative mesh-card rounded-[1.75rem] border border-[var(--line)] p-6 transition hover:border-[var(--line-strong)]">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100" style={{ background: colors.glow }} />
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.bg}`}>
                  <feature.icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <section className="mt-20 mesh-card rounded-[2rem] border border-[var(--line)] px-8 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">Ready to build?</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
                Start free on the managed platform, or clone the repo and self-host.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="https://console.summonflow.com" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs/quickstart" className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--surface-strong)]">
                Quickstart
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
