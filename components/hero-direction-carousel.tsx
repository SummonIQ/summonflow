"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  BellRing,
  CheckCircle2,
  Code2,
  Globe,
  Layers3,
  Radio,
  Shield,
  Sparkles,
} from "lucide-react";
import { MarketingSessionCta } from "@/components/marketing-session-cta";

type HeaderVariant = "default" | "minimal" | "framed" | "accent";

type HeroOption = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  headerVariant?: HeaderVariant;
  render: () => React.ReactNode;
};

function ProductSurfaceOption() {
  return (
    <div className="relative h-[29rem] overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_86%,transparent),color-mix(in_srgb,var(--panel)_54%,transparent))] shadow-[0_36px_120px_-64px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-16 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--panel)_88%,transparent)]" />
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff7b72]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#f6c768]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#59d4a8]" />
      </div>
      <div className="absolute left-6 top-24 w-[28%] space-y-3">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Radio className="h-4 w-4 text-[var(--teal)]" /> Channels</div>
          <div className="mt-3 space-y-2">
            <div className="h-9 rounded-xl bg-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)]" />
            <div className="h-9 rounded-xl bg-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)]" />
            <div className="h-9 rounded-xl bg-[color:color-mix(in_srgb,var(--accent)_16%,transparent)]" />
          </div>
        </div>
      </div>
      <div className="absolute right-6 top-24 w-[58%] rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_86%,transparent),transparent)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Realtime Activity</div>
            <div className="mt-2 text-2xl font-semibold">launch-room</div>
          </div>
          <div className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--teal)]">live</div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="text-xs text-[var(--muted)]">Members</div>
            <div className="mt-2 text-3xl font-semibold">128</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="text-xs text-[var(--muted)]">Events</div>
            <div className="mt-2 text-3xl font-semibold">4.2k</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="text-xs text-[var(--muted)]">Latency</div>
            <div className="mt-2 text-3xl font-semibold">38ms</div>
          </div>
        </div>
        <div className="mt-5 h-28 rounded-[1.5rem] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--foreground)_5%,transparent),transparent)] p-4">
          <div className="flex h-full items-end gap-3">
            <div className="h-[35%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--gold)_44%,transparent)]" />
            <div className="h-[58%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--foreground)_14%,transparent)]" />
            <div className="h-[72%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--teal)_42%,transparent)]" />
            <div className="h-[54%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--foreground)_12%,transparent)]" />
            <div className="h-[84%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--teal)_52%,transparent)]" />
            <div className="h-[66%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--gold)_36%,transparent)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographyOption() {
  return (
    <div className="relative flex h-[29rem] items-end overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--panel)_82%,transparent),transparent),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--teal)_20%,transparent),transparent_42%)] px-8 py-10 shadow-[0_36px_120px_-64px_rgba(0,0,0,0.28)]">
      <div className="absolute left-8 top-8 text-[10rem] font-semibold leading-none tracking-[-0.1em] text-[color:color-mix(in_srgb,var(--foreground)_6%,transparent)]">
        LIVE
      </div>
      <div className="relative z-10 max-w-[26rem]">
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Typography-led</div>
        <div className="mt-4 text-5xl font-semibold leading-[0.88] tracking-[-0.08em]">
          Signal.
          <br />
          Presence.
          <br />
          Control.
        </div>
      </div>
      <div className="absolute right-10 top-10 grid gap-3">
        <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm">encrypted</div>
        <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm">fanout</div>
        <div className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm">presence</div>
      </div>
    </div>
  );
}

function StackOption() {
  return (
    <div className="relative flex h-[29rem] items-center justify-center overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_82%,transparent),transparent)] shadow-[0_36px_120px_-64px_rgba(0,0,0,0.35)]">
      <motion.div className="absolute h-[15rem] w-[24rem] rounded-[2.2rem] border border-[var(--line)] bg-[var(--surface)]" animate={{ rotate: [-12, -10, -12], y: [14, 6, 14] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute h-[18rem] w-[28rem] rounded-[2.4rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_84%,transparent),transparent)]" animate={{ rotate: [8, 10, 8], y: [0, -8, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute h-[21rem] w-[32rem] rounded-[2.6rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_90%,transparent),transparent)] px-8 py-7" animate={{ y: [0, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Operator Console</div>
          <div className="rounded-full bg-[color:color-mix(in_srgb,var(--teal)_16%,transparent)] px-3 py-1 text-xs text-[var(--teal)]">ready</div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-28 rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)]" />
          <div className="h-28 rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--gold)_16%,transparent)]" />
          <div className="h-20 rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--foreground)_6%,transparent)]" />
          <div className="h-20 rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--teal)_18%,transparent)]" />
        </div>
      </motion.div>
    </div>
  );
}

function EditorOption() {
  return (
    <div className="relative h-[29rem] overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[#111015] text-white shadow-[0_36px_120px_-64px_rgba(0,0,0,0.44)]">
      <div className="flex items-center justify-between border-b border-white/6 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff7b72]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f6c768]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#59d4a8]" />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">presence.ts</div>
      </div>
      <div className="grid h-[calc(100%-4.25rem)] grid-cols-[13rem_1fr]">
        <div className="border-r border-white/6 bg-white/[0.02] p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-white/35">Files</div>
          <div className="mt-4 space-y-2">
            <div className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm">client.ts</div>
            <div className="rounded-xl px-3 py-2 text-sm text-white/45">auth.ts</div>
            <div className="rounded-xl px-3 py-2 text-sm text-white/45">channels.ts</div>
            <div className="rounded-xl px-3 py-2 text-sm text-white/45">presence.ts</div>
          </div>
        </div>
        <div className="p-6 font-mono text-[13px] leading-8">
          <div><span className="text-[#c792ea]">import</span> {"{"} <span className="text-[#82aaff]">SummonFlow</span> {"}"} <span className="text-[#c792ea]">from</span> <span className="text-[#c3e88d]">"@summoniq/summon-flow"</span></div>
          <div className="mt-2"><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">client</span> = <span className="text-[#c792ea]">new</span> <span className="text-[#ffcb6b]">SummonFlow</span>({"{"}<span className="text-[#f78c6c]">key</span>: <span className="text-[#c3e88d]">process.env.NEXT_PUBLIC_APP_KEY</span>{"}"})</div>
          <div className="mt-2"><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">room</span> = <span className="text-[#82aaff]">client</span>.<span className="text-[#82aaff]">subscribe</span>(<span className="text-[#c3e88d]">"presence:launch-room"</span>)</div>
          <div className="mt-2"><span className="text-[#82aaff]">room</span>.<span className="text-[#82aaff]">bind</span>(<span className="text-[#c3e88d]">"member.joined"</span>, ({`{`} <span className="text-[#f78c6c]">user</span> {`}`}) =&gt; <span className="text-[#82aaff]">console</span>.<span className="text-[#82aaff]">log</span>(<span className="text-[#c3e88d]">"joined"</span>, <span className="text-[#f78c6c]">user</span>))</div>
          <div className="mt-2"><span className="text-[#82aaff]">room</span>.<span className="text-[#82aaff]">bind</span>(<span className="text-[#c3e88d]">"deployment.updated"</span>, ({`{`} <span className="text-[#f78c6c]">status</span> {`}`}) =&gt; <span className="text-[#82aaff]">setStatus</span>(<span className="text-[#f78c6c]">status</span>))</div>
        </div>
      </div>
    </div>
  );
}

function WindowOption() {
  return (
    <div className="relative flex h-[29rem] items-center justify-center overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_82%,transparent),transparent)] shadow-[0_36px_120px_-64px_rgba(0,0,0,0.32)]">
      <motion.div className="absolute left-[12%] top-[18%] h-[12rem] w-[18rem] rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5" animate={{ y: [0, -8, 0], rotate: [-4, -2, -4] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Status</div>
        <div className="mt-5 text-4xl font-semibold">Online</div>
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--teal)]"><CheckCircle2 className="h-4 w-4" /> all regions healthy</div>
      </motion.div>
      <motion.div className="absolute right-[14%] top-[16%] h-[14rem] w-[20rem] rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5" animate={{ y: [0, 10, 0], rotate: [5, 3, 5] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Regions</div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)] p-3">iad1</div>
          <div className="rounded-xl bg-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)] p-3">fra1</div>
          <div className="rounded-xl bg-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)] p-3">syd1</div>
          <div className="rounded-xl bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] p-3">sin1</div>
        </div>
      </motion.div>
      <motion.div className="absolute bottom-[12%] left-[24%] h-[10rem] w-[24rem] rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5" animate={{ y: [0, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
        <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Events</div>
        <div className="mt-4 space-y-3">
          <div className="h-3 rounded-full bg-[color:color-mix(in_srgb,var(--teal)_28%,transparent)]" />
          <div className="h-3 w-[72%] rounded-full bg-[color:color-mix(in_srgb,var(--foreground)_10%,transparent)]" />
          <div className="h-3 w-[52%] rounded-full bg-[color:color-mix(in_srgb,var(--gold)_24%,transparent)]" />
        </div>
      </motion.div>
    </div>
  );
}

function MapOption() {
  return (
    <div className="relative h-[29rem] overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_82%,transparent),transparent)] shadow-[0_36px_120px_-64px_rgba(0,0,0,0.32)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--gold)_10%,transparent),transparent_32%),radial-gradient(circle_at_78%_26%,color-mix(in_srgb,var(--teal)_12%,transparent),transparent_36%)]" />
      <div className="absolute left-[18%] top-[26%] h-3 w-3 rounded-full bg-[var(--gold)] shadow-[0_0_0_8px_color-mix(in_srgb,var(--gold)_12%,transparent)]" />
      <div className="absolute left-[46%] top-[34%] h-3 w-3 rounded-full bg-[var(--foreground)] shadow-[0_0_0_8px_color-mix(in_srgb,var(--foreground)_8%,transparent)]" />
      <div className="absolute left-[70%] top-[22%] h-3 w-3 rounded-full bg-[var(--teal)] shadow-[0_0_0_8px_color-mix(in_srgb,var(--teal)_12%,transparent)]" />
      <div className="absolute left-[58%] top-[62%] h-3 w-3 rounded-full bg-[var(--teal)] shadow-[0_0_0_8px_color-mix(in_srgb,var(--teal)_12%,transparent)]" />
      <svg className="absolute inset-0 h-full w-full">
        <path d="M 170 120 C 260 130, 340 150, 430 160" stroke="currentColor" className="text-[color:color-mix(in_srgb,var(--gold)_36%,transparent)]" strokeWidth="1.5" fill="none" />
        <path d="M 430 160 C 520 150, 590 120, 650 105" stroke="currentColor" className="text-[color:color-mix(in_srgb,var(--teal)_34%,transparent)]" strokeWidth="1.5" fill="none" />
        <path d="M 430 160 C 520 190, 560 240, 600 282" stroke="currentColor" className="text-[color:color-mix(in_srgb,var(--foreground)_22%,transparent)]" strokeWidth="1.5" fill="none" />
      </svg>
      <div className="absolute left-8 top-8 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm">Global fanout</div>
    </div>
  );
}

function BroadcastOption() {
  return (
    <div className="relative h-[29rem] overflow-hidden rounded-[2.8rem] border border-[var(--line)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--panel)_90%,transparent),color-mix(in_srgb,var(--panel)_58%,transparent))] shadow-[0_36px_120px_-64px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--gold)_12%,transparent),transparent_30%),radial-gradient(circle_at_78%_18%,color-mix(in_srgb,var(--teal)_14%,transparent),transparent_34%)]" />
      <div className="absolute left-7 right-7 top-7 flex items-center justify-between rounded-full border border-[var(--line)] bg-[color:color-mix(in_srgb,var(--panel)_84%,transparent)] px-5 py-3 backdrop-blur-xl">
        <div className="text-sm font-semibold">SummonFlow Broadcast</div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] px-3 py-1">Status</span>
          <span className="rounded-full border border-[var(--line)] px-3 py-1">Pricing</span>
          <span className="rounded-full border border-[var(--line)] px-3 py-1">Docs</span>
        </div>
      </div>
      <div className="absolute inset-x-10 bottom-10 top-24 grid grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="rounded-[2.2rem] border border-[var(--line)] bg-[color:color-mix(in_srgb,var(--panel)_74%,transparent)] p-7">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Managed edge</div>
          <div className="mt-4 max-w-[16rem] text-4xl font-semibold leading-[0.92] tracking-[-0.06em]">
            Fanout with operator visibility.
          </div>
          <div className="mt-6 flex gap-3">
            <div className="rounded-full bg-[color:color-mix(in_srgb,var(--teal)_14%,transparent)] px-4 py-2 text-sm font-medium text-[var(--teal)]">Global delivery</div>
            <div className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">MIT core</div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Subscribers</div>
            <div className="mt-3 text-4xl font-semibold">84k</div>
          </div>
          <div className="rounded-[1.7rem] border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Throughput</div>
            <div className="mt-3 flex h-16 items-end gap-2">
              <div className="h-[48%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--gold)_34%,transparent)]" />
              <div className="h-[64%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--foreground)_14%,transparent)]" />
              <div className="h-[80%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--teal)_44%,transparent)]" />
              <div className="h-[62%] w-full rounded-t-full bg-[color:color-mix(in_srgb,var(--foreground)_12%,transparent)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManifestOption() {
  return (
    <div className="relative h-[29rem] overflow-hidden rounded-[2.8rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_84%,transparent),transparent)] shadow-[0_36px_120px_-64px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-x-10 top-10 flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.26em] text-[var(--muted)]">Manifest</div>
          <div className="mt-3 text-5xl font-semibold leading-[0.88] tracking-[-0.08em]">Infrastructure with rules.</div>
        </div>
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">Header stripped back</div>
      </div>
      <div className="absolute inset-x-10 bottom-10 top-36 grid grid-cols-[0.9fr_1.1fr] gap-5">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Principles</div>
          <div className="mt-5 space-y-3">
            {["Readable API", "Observable system", "Self-host first", "Managed when needed"].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--line)] px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_88%,transparent),transparent)] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Realtime stack</div>
          <div className="mt-6 grid gap-4">
            {[
              "Browser + Node SDK",
              "Signed subscription auth",
              "Redis fanout + presence",
              "Operator console + billing",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] text-sm font-semibold text-[var(--foreground)]">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const heroOptions: HeroOption[] = [
  {
    id: "surface",
    label: "Product",
    eyebrow: "Option 1",
    title: "Product surface",
    accent: "Software you can actually read.",
    description: "A concrete console-style hero with channels, activity, and metrics.",
    headerVariant: "default",
    render: () => <ProductSurfaceOption />,
  },
  {
    id: "type",
    label: "Typography",
    eyebrow: "Option 2",
    title: "Typography-led",
    accent: "Brand first, object second.",
    description: "A stark poster hero with almost no interface object at all.",
    headerVariant: "minimal",
    render: () => <TypographyOption />,
  },
  {
    id: "stack",
    label: "Stack",
    eyebrow: "Option 3",
    title: "Layered stack",
    accent: "A clear software object without fake complexity.",
    description: "Floating application layers that read like a realtime workspace.",
    headerVariant: "framed",
    render: () => <StackOption />,
  },
  {
    id: "editor",
    label: "Editor",
    eyebrow: "Option 4",
    title: "Code/editor",
    accent: "Implementation as the hero.",
    description: "An editor-led composition for a more technical first impression.",
    headerVariant: "minimal",
    render: () => <EditorOption />,
  },
  {
    id: "window",
    label: "Windows",
    eyebrow: "Option 5",
    title: "Window cluster",
    accent: "A softer operational collage.",
    description: "A stack of product windows with clearer product affordances.",
    headerVariant: "framed",
    render: () => <WindowOption />,
  },
  {
    id: "map",
    label: "Network",
    eyebrow: "Option 6",
    title: "Network map",
    accent: "A systems view instead of a dashboard.",
    description: "A spatial fanout concept for the infrastructure angle.",
    headerVariant: "accent",
    render: () => <MapOption />,
  },
  {
    id: "broadcast",
    label: "Broadcast",
    eyebrow: "Option 7",
    title: "Broadcast surface",
    accent: "A full-width software stage.",
    description: "A broader landing treatment where the concept also changes the header styling.",
    headerVariant: "accent",
    render: () => <BroadcastOption />,
  },
  {
    id: "manifest",
    label: "Manifest",
    eyebrow: "Option 8",
    title: "Manifest system",
    accent: "Less dashboard, more product thesis.",
    description: "A more editorial direction with a reduced header and a stronger information hierarchy.",
    headerVariant: "minimal",
    render: () => <ManifestOption />,
  },
];

export function HeroDirectionCarousel() {
  const [index, setIndex] = useState(0);
  const option = heroOptions[index];

  const optionCountLabel = useMemo(
    () => `${index + 1} / ${heroOptions.length}`,
    [index]
  );

  useEffect(() => {
    const variant = option.headerVariant ?? "default";
    document.documentElement.dataset.marketingHeaderVariant = variant;
    window.dispatchEvent(
      new CustomEvent("marketing-header-variant-change", {
        detail: { variant },
      })
    );

    return () => {
      delete document.documentElement.dataset.marketingHeaderVariant;
      window.dispatchEvent(
        new CustomEvent("marketing-header-variant-change", {
          detail: { variant: "default" },
        })
      );
    };
  }, [option.headerVariant]);

  return (
    <section className="relative -mx-6 overflow-visible px-6 py-16 sm:-mx-10 sm:px-10 lg:min-h-[calc(100svh-5.5rem)] lg:px-12 lg:py-18">
      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--gold)_10%,transparent),transparent_34%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--teal)_12%,transparent),transparent_40%)]" />
      <div className="relative z-10 grid gap-10 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[minmax(0,0.76fr)_minmax(28rem,1.24fr)] lg:items-center">
        <div className="fade-up max-w-3xl py-10 lg:py-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Open source · MIT Licensed
          </div>

          <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Hero directions
          </div>
          <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--foreground)] sm:text-6xl lg:text-[4.9rem]">
            {option.title}
            <br />
            <span className="text-[var(--teal)]">{option.accent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            {option.description} Use the arrows to move through all eight directions and decide which one should become the real homepage hero.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MarketingSessionCta
              signupLabel="Start Building Free"
              className="button-default inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition"
            />
            <Link href="/docs/quickstart" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]">
              Quickstart guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> Eight concrete directions</span>
            <span className="text-[var(--line)]">|</span>
            <span className="inline-flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5" /> No more blind guessing</span>
            <span className="text-[var(--line)]">|</span>
            <span className="inline-flex items-center gap-1.5"><BellRing className="h-3.5 w-3.5" /> Pick one to finalize</span>
          </div>
        </div>

        <div className="relative lg:-mr-20 xl:-mr-28">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-[var(--muted)]">{option.eyebrow} · {optionCountLabel}</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIndex((current) => (current - 1 + heroOptions.length) % heroOptions.length)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
                aria-label="Previous hero direction"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIndex((current) => (current + 1) % heroOptions.length)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
                aria-label="Next hero direction"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.985 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {option.render()}
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex flex-wrap gap-2 pr-4 lg:pr-16">
            {heroOptions.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(itemIndex)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  itemIndex === index
                    ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--foreground)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
