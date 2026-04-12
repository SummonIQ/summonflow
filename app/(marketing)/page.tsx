import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Lock,
  Radio,
  Server,
  Users,
  Zap,
  Shield,
  Code2,
  Activity,
} from "lucide-react";
import { MarketingHeroVisual } from "@/components/marketing-hero-visual";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]";

export default function MarketingHome() {
  return (
    <main className="page-shell min-h-screen">
      <div className="grid-lines absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-24 sm:px-10">
        {/* Hero */}
        <section className="relative pb-8 pt-0 lg:min-h-[calc(100svh-5.5rem)] lg:pb-12 lg:pt-0">
          <div className="relative z-10 grid items-start gap-14 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(25rem,0.88fr)]">
            <div className="fade-up relative max-w-3xl pt-0 pb-1">
              <div className={badgeClass}>
                Open Source · MIT Licensed
              </div>

              <h1 className="mt-2 font-[var(--font-heading)] text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--foreground)] sm:text-6xl lg:text-[5.3rem]">
                Realtime infrastructure
                <br />
                <span className="text-[var(--teal)]">you actually control.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                Channels, presence, encrypted events, and a control plane that makes the whole system legible.
                Self-host it or let us run it. Same SDK, same API, your choice.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="button-default inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition"
                >
                  Start Building Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  Quickstart guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
                <span className="inline-flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> @summoniq/summon-flow</span>
                <span className="text-[var(--line)]">|</span>
                <span>TypeScript-first</span>
                <span className="text-[var(--line)]">|</span>
                <span>WebSocket-native</span>
              </div>
            </div>

            <div className="fade-up-delay relative overflow-visible lg:justify-self-end">
              <MarketingHeroVisual />
            </div>
          </div>
        </section>
        <section className="relative">
          <div className="relative z-10 mt-32 lg:mt-36">
            <div className="mx-auto max-w-2xl text-center">
              <div className={badgeClass}>SDK preview</div>
              <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                A clean client API, without hidden magic.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">
                Connect, subscribe, and react to live events with a small TypeScript surface that stays readable under production load.
              </p>
            </div>

            <div className="fade-up-delay relative mx-auto mt-10 max-w-3xl">
              <div className="mesh-card rounded-[1.5rem] border border-[var(--line)] p-1 shadow-[0_32px_80px_-40px_rgba(19,15,10,0.35)]">
                <div className="rounded-[1.25rem] border border-[rgba(15,76,83,0.14)] bg-[linear-gradient(180deg,#17151b,#111015)] p-0 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff6d7a]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffcf66]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#6ee7b7]" />
                    </div>
                    <div className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-white/45">
                      live-client.ts
                    </div>
                  </div>
                  <div className="grid gap-2 px-5 py-5 font-[var(--font-mono)] text-[12px] leading-7 sm:grid-cols-[auto_1fr]">
                    {[
                      <><span className="text-[#c792ea]">import</span> {`{ `}<span className="text-[#82aaff]">SummonFlow</span>{` } `}<span className="text-[#c792ea]">from</span> <span className="text-[#c3e88d]">&quot;@summoniq/summon-flow&quot;</span></>,
                      <><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">client</span> = <span className="text-[#c792ea]">new</span> <span className="text-[#ffcb6b]">SummonFlow</span>({`{ `}<span className="text-[#f78c6c]">key</span>: <span className="text-[#c3e88d]">&quot;your-app-key&quot;</span>{` }`})</>,
                      <><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">presence</span> = <span className="text-[#82aaff]">client</span>.<span className="text-[#82aaff]">subscribe</span>(<span className="text-[#c3e88d]">&quot;presence:launch-room&quot;</span>)</>,
                      <><span className="text-[#82aaff]">presence</span>.<span className="text-[#82aaff]">bind</span>(<span className="text-[#c3e88d]">&quot;deployment.updated&quot;</span>, ({`{ `}<span className="text-[#f78c6c]">status</span>{` }`}) =&gt; <span className="text-[#82aaff]">console</span>.<span className="text-[#82aaff]">log</span>(<span className="text-[#c3e88d]">&quot;deploy:&quot;</span>, <span className="text-[#f78c6c]">status</span>))</>,
                    ].map((line, index) => (
                      <div key={index} className="contents">
                        <div className="select-none pr-5 text-right text-white/24">{index + 1}</div>
                        <div className="overflow-x-auto whitespace-nowrap">{line}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="relative mt-6 grid gap-3 py-10 sm:grid-cols-2 xl:grid-cols-4">
          <div className="pointer-events-none absolute -left-16 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-[rgba(232,176,77,0.16)] blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-2 h-36 w-36 rounded-full bg-[rgba(15,76,83,0.14)] blur-3xl" />
          {[
            { icon: Radio, label: "4 channel types", detail: "Public, private, presence, encrypted" },
            { icon: Shield, label: "Signed auth", detail: "Stateless subscription verification" },
            { icon: Zap, label: "Redis fanout", detail: "Horizontal scale without code changes" },
            { icon: Activity, label: "Live monitoring", detail: "See every channel from the console" },
          ].map((stat) => (
            <div key={stat.label} className="mesh-card rounded-2xl border border-[var(--line)] px-5 py-4">
              <div className="flex items-center gap-3">
                <stat.icon className="h-4 w-4 text-[var(--teal)]" />
                <div className="text-sm font-semibold text-[var(--foreground)]">{stat.label}</div>
              </div>
              <div className="mt-1 text-xs text-[var(--muted)]">{stat.detail}</div>
            </div>
          ))}
        </section>

        {/* Open Source vs Managed */}
        <section className="relative pt-20 pb-16">
          <div className="pointer-events-none absolute left-[-4rem] top-10 h-56 w-56 rounded-full bg-[rgba(15,76,83,0.12)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-8 right-[-5rem] h-64 w-64 rounded-full bg-[rgba(194,81,47,0.12)] blur-3xl" />
          <div className={badgeClass}>Choose your path</div>
          <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Open Source or Managed — same SDK.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Self-host on your own infra for free, or let us handle the servers. Switch anytime without changing your client code.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="mesh-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--line)] p-8">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--teal)] opacity-5 blur-3xl" />
              <div>
                <Server className="h-7 w-7 text-[var(--teal)]" />
                <h3 className="mt-5 text-2xl font-semibold text-[var(--foreground)]">Self-Hosted</h3>
                <p className="mt-3 text-[var(--muted)] leading-7">
                  Deploy the full stack on Railway, Cloudflare, or your own metal. MIT licensed, no license keys, no call-home.
                </p>
                <ul className="mt-6 space-y-3">
                  {["MIT Licensed", "Docker & Kubernetes", "Direct Redis access", "Unlimited everything"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--teal)]" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex items-center justify-between gap-6">
                <span className="font-[var(--font-mono)] text-sm font-semibold">Free forever</span>
                <span className="text-right text-sm font-semibold text-[var(--teal)]">OSS packages available separately</span>
              </div>
            </div>

            <div className="mesh-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--line)] p-8 ring-1 ring-[var(--accent)] ring-offset-4 ring-offset-[var(--background)]">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />
              <div>
                <Cloud className="h-7 w-7 text-[var(--accent)]" />
                <h3 className="mt-5 text-2xl font-semibold text-[var(--foreground)]">Managed Platform</h3>
                <p className="mt-3 text-[var(--muted)] leading-7">
                  We run the servers, Redis, TLS, and upgrades. You get an app key and start building.
                </p>
                <ul className="mt-6 space-y-3">
                  {["99.99% Uptime SLA", "Global edge network", "Automatic scaling", "Priority support"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex items-center justify-between gap-6">
                <span className="font-[var(--font-mono)] text-sm font-semibold">From $0/mo</span>
                <Link href="/signup" className="button-default inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="relative border-t border-[var(--line)] py-16">
          <div className="pointer-events-none absolute left-10 top-8 h-52 w-52 rounded-full bg-[rgba(232,176,77,0.12)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-4 h-60 w-60 rounded-full bg-[rgba(15,76,83,0.12)] blur-3xl" />
          <div className={badgeClass}>Capabilities</div>
          <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Built for teams that ship realtime.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Radio, title: "Channel Types", copy: "Public, private, presence, and encrypted — each with clear semantics and auth rules." },
              { icon: Lock, title: "E2E Encryption", copy: "AES-256-GCM with per-channel secrets. The server never sees plaintext." },
              { icon: Users, title: "Presence", copy: "Track who's online with member rosters, join/leave events, and custom user info." },
              { icon: Code2, title: "TypeScript SDK", copy: "Clean API. Works in browser and Node. Reconnects with backoff. Zero bloat." },
              { icon: Shield, title: "Signed Auth", copy: "Stateless subscription signing. No shared sessions, no race conditions." },
              { icon: Zap, title: "Redis Fanout", copy: "Scale horizontally with Redis pub/sub. Every client gets the event." },
            ].map((card) => (
              <div key={card.title} className="mesh-card rounded-[1.75rem] border border-[var(--line)] p-6">
                <card.icon className="h-6 w-6 text-[var(--teal)]" />
                <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{card.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/features" className="text-sm font-semibold text-[var(--accent)] hover:underline">
              See all features <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--line)] py-16">
          <div className="mesh-card cta-mesh-card rounded-[2rem] border border-[var(--line)] px-8 py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">
                  Ship realtime features today.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                  Create your first app in under a minute. Free tier included.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/signup" className="button-default inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/docs/quickstart" className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold">
                  Read the docs
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
