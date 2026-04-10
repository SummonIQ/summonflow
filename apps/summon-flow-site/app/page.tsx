import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Github,
  Lock,
  Package,
  Radio,
  Server,
  Sparkles,
  Users,
  Zap,
  Shield,
  Code2,
  Activity,
} from "lucide-react";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]";

export default function MarketingHome() {
  return (
    <main className="page-shell min-h-screen">
      <div className="grid-lines absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-6 sm:px-10">
        {/* Nav */}
        <header className="fade-up flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div>
            <div className="font-[var(--font-mono)] text-xs uppercase tracking-[0.34em] text-[var(--teal)]">
              SummonFlow
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/changelog">Changelog</Link>
            <Link href="/help">Help</Link>
            <a href="https://github.com/SummonIQ/summonflow" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              <Github className="h-4 w-4" />
            </a>
            <Link href="https://console.summonflow.com" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative py-20 lg:py-28">
          <div className="fade-up max-w-4xl">
            <span className={badgeClass}>
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              Open source &middot; MIT Licensed
            </span>

            <h1 className="mt-6 font-[var(--font-heading)] text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-[4.5rem]">
              Realtime infrastructure<br />
              <span className="text-[var(--teal)]">you actually control.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              Channels, presence, encrypted events, and a control plane that makes the
              whole system legible. Self-host it or let us run it — same SDK, same API,
              your choice.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="https://console.summonflow.com" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                Start Building Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://github.com/SummonIQ/summonflow" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-strong)]">
                <Github className="h-4 w-4" />
                View Source
              </a>
              <Link href="/docs/quickstart" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition">
                Quickstart guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-6 text-xs text-[var(--muted)]">
              <a href="https://github.com/SummonIQ/summonflow/tree/main/packages/summon-flow-client" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition">
                <Package className="h-3.5 w-3.5" />
                @summoniq/summon-flow
              </a>
              <span className="text-[var(--line)]">|</span>
              <span>TypeScript-first</span>
              <span className="text-[var(--line)]">|</span>
              <span>WebSocket-native</span>
            </div>
          </div>

          {/* Terminal preview */}
          <div className="fade-up-delay mt-14 max-w-3xl">
            <div className="mesh-card rounded-[1.5rem] border border-[var(--line)] p-1 shadow-[0_32px_80px_-40px_rgba(19,15,10,0.35)]">
              <div className="rounded-[1.25rem] border border-[rgba(15,76,83,0.12)] bg-[#18161a] p-6 text-white font-[var(--font-mono)] text-xs leading-7">
                <div className="text-white/40">// Connect in 4 lines</div>
                <div><span className="text-[#c792ea]">import</span> SummonFlow <span className="text-[#c792ea]">from</span> <span className="text-[#c3e88d]">&apos;@summoniq/summon-flow&apos;</span>;</div>
                <br/>
                <div><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">realtime</span> = <span className="text-[#c792ea]">new</span> <span className="text-[#ffcb6b]">SummonFlow</span>(<span className="text-[#c3e88d]">&apos;your-app-key&apos;</span>);</div>
                <div><span className="text-[#c792ea]">const</span> <span className="text-[#82aaff]">channel</span> = <span className="text-[#82aaff]">realtime</span>.<span className="text-[#82aaff]">subscribe</span>(<span className="text-[#c3e88d]">&apos;presence-room&apos;</span>);</div>
                <div><span className="text-[#82aaff]">channel</span>.<span className="text-[#82aaff]">bind</span>(<span className="text-[#c3e88d]">&apos;message&apos;</span>, (<span className="text-[#f78c6c]">data</span>) =&gt; <span className="text-[#82aaff]">console</span>.<span className="text-[#82aaff]">log</span>(<span className="text-[#f78c6c]">data</span>));</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="grid gap-3 border-t border-[var(--line)] py-10 sm:grid-cols-2 xl:grid-cols-4">
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
        <section className="border-t border-[var(--line)] py-16">
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
              <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center justify-between">
                <span className="font-[var(--font-mono)] text-sm font-semibold">Free forever</span>
                <a href="https://github.com/SummonIQ/summonflow" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal)] hover:underline">
                  <Github className="h-4 w-4" /> Clone repo
                </a>
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
              <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center justify-between">
                <span className="font-[var(--font-mono)] text-sm font-semibold">From $0/mo</span>
                <Link href="https://console.summonflow.com" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="border-t border-[var(--line)] py-16">
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
          <div className="mesh-card rounded-[2rem] border border-[var(--line)] px-8 py-10">
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
                <Link href="https://console.summonflow.com" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/docs/quickstart" className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold">
                  Read the docs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--line)] py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-[var(--font-mono)] text-xs uppercase tracking-[0.34em] text-[var(--teal)]">SummonFlow</div>
              <div className="mt-1 text-sm text-[var(--muted)]">Open source realtime infrastructure.</div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]">
              <Link href="/features" className="hover:text-[var(--foreground)] transition">Features</Link>
              <Link href="/pricing" className="hover:text-[var(--foreground)] transition">Pricing</Link>
              <Link href="/docs" className="hover:text-[var(--foreground)] transition">Docs</Link>
              <Link href="/changelog" className="hover:text-[var(--foreground)] transition">Changelog</Link>
              <Link href="/help" className="hover:text-[var(--foreground)] transition">Help</Link>
              <a href="https://github.com/SummonIQ/summonflow" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
