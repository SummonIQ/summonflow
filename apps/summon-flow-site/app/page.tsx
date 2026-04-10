import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Github,
  Lock,
  Package,
  Server,
  Sparkles,
} from "lucide-react";
import {
  capabilityRows,
  deploymentCards,
  featureCards,
  productNarrative,
  stats,
  useCases,
} from "@/lib/site-data";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]";

export default function MarketingHome() {
  return (
    <main className="page-shell min-h-screen">
      <div className="grid-lines absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-6 sm:px-10">
        <header className="fade-up flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div>
            <div className="font-[var(--font-mono)] text-xs uppercase tracking-[0.34em] text-[var(--teal)]">
              SummonFlow
            </div>
            <div className="mt-1 text-sm text-[var(--muted)]">
              Self-hosted realtime infrastructure with a real control plane.
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
            <Link href="#capabilities">Capabilities</Link>
            <Link href="#deploy">Deploy</Link>
            <Link href="#use-cases">Use cases</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
            <a
              href="https://github.com/SummonIQ/summon-flow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              href="https://console.summonflow.com"
              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[var(--foreground)]"
            >
              Open Console
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="fade-up">
            <span className={badgeClass}>
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              Realtime without provider lock-in
            </span>

            <h1 className="mt-6 max-w-4xl font-[var(--font-heading)] text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              Own the channel layer. Keep the operator experience.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              SummonFlow gives your team a deployable realtime stack with channels,
              presence, encrypted events, publish relays, and a control plane that makes
              the whole system legible.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="https://console.summonflow.com"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/SummonIQ/summon-flow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white/5"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </div>

            <div className="mt-4 flex items-center gap-6 text-xs text-[var(--muted)]">
              <a
                href="https://github.com/SummonIQ/summon-flow/tree/main/packages/summon-flow-client"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition"
              >
                <Package className="h-3.5 w-3.5" />
                @summoniq/summon-flow
              </a>
              <span className="text-[var(--line)]">|</span>
              <span>MIT Licensed</span>
              <span className="text-[var(--line)]">|</span>
              <span>TypeScript-first</span>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="mesh-card rounded-3xl border border-[var(--line)] px-5 py-4"
                >
                  <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-base font-semibold text-[var(--foreground)]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up-delay">
            <div className="mesh-card rounded-[2rem] border border-[var(--line)] p-5 shadow-[0_32px_80px_-40px_rgba(19,15,10,0.45)]">
              <div className="rounded-[1.5rem] border border-[rgba(15,76,83,0.16)] bg-[#18161a] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-white/55">
                      Live topology
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      Vercel + Railway + Redis
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                    Production-ready
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      icon: Cloud,
                      title: "Auth and publish",
                      copy: "Next.js routes sign subscriptions and relay publish events from stateless functions.",
                    },
                    {
                      icon: Server,
                      title: "Socket orchestration",
                      copy: "Railway runs the always-on websocket runtime with app keys, publish tokens, and channel policy.",
                    },
                    {
                      icon: Lock,
                      title: "Encrypted paths",
                      copy: "Private encrypted channels derive secrets per room and decrypt only at the client edge.",
                    },
                  ].map((row) => (
                    <div
                      key={row.title}
                      className="rounded-2xl border border-white/10 bg-white/4 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <row.icon className="h-5 w-5 text-[#f5be56]" />
                        <div className="text-sm font-semibold">{row.title}</div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/68">{row.copy}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 font-[var(--font-mono)] text-xs leading-6 text-white/72">
                  <div>token: app_key:signature</div>
                  <div>member: {"{"}"memberId":"ops-17"{"}"}</div>
                  <div>path: /realtime/auth</div>
                  <div>publish: /apps/:key/events</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-t border-[var(--line)] py-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className={badgeClass}>Why it exists</div>
            <h2 className="mt-5 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Realtime should be explicit infrastructure, not a black box.
            </h2>
          </div>
          <div className="grid gap-5 text-base leading-8 text-[var(--muted)]">
            {productNarrative.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--line)] py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className={badgeClass}>Choose your path</div>
              <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Open Source or Managed
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
              Whether you want full control of the infrastructure or a turnkey solution, SummonFlow scales with you.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="mesh-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--teal)] opacity-5 blur-3xl" />
              <div>
                <div className="inline-flex rounded-xl bg-white/5 p-3 text-[var(--teal)]">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-[var(--foreground)]">Self-Hosted (OSS)</h3>
                <p className="mt-4 text-[var(--muted)] leading-7">
                  Deploy the full SummonFlow stack on your own infrastructure. Ideal for teams with strict compliance needs or those who want zero lock-in.
                </p>
                <ul className="mt-8 space-y-4">
                  {["MIT Licensed", "Docker & Kubernetes support", "Direct Redis access", "Unlimited apps and keys"].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--teal)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 pt-8 border-t border-[var(--line)]">
                <div className="flex items-center justify-between">
                  <div className="font-[var(--font-mono)] text-sm font-semibold text-[var(--foreground)]">Free</div>
                  <a
                    href="https://github.com/SummonIQ/summon-flow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal)] hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mesh-card relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 ring-1 ring-[var(--accent)] ring-offset-4 ring-offset-[var(--background)]">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />
              <div>
                <div className="inline-flex rounded-xl bg-[rgba(194,81,47,0.12)] p-3 text-[var(--accent)]">
                  <Cloud className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-[var(--foreground)]">SummonFlow Managed</h3>
                <p className="mt-4 text-[var(--muted)] leading-7">
                  Let us handle the global orchestration, horizontal scaling, and upgrades. The turnkey solution for production-grade realtime.
                </p>
                <ul className="mt-8 space-y-4">
                  {["99.99% Uptime SLA", "Global Edge Network", "Dedicated Support", "Managed Redis & Encryption"].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 pt-8 border-t border-[var(--line)]">
                <div className="flex items-center justify-between">
                  <div className="font-[var(--font-mono)] text-sm font-semibold text-[var(--foreground)]">Starting at $29/mo</div>
                  <Link
                    href="https://console.summonflow.com"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="border-t border-[var(--line)] py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className={badgeClass}>Capabilities</div>
              <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                The pieces teams actually need
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
              The package family already covers the runtime surface. The console app turns
              that into an operator-facing product instead of a pile of env vars.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="mesh-card rounded-[1.75rem] border border-[var(--line)] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(194,81,47,0.12)] text-[var(--accent)]">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
                  {card.copy}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)]">
            {capabilityRows.map((row) => (
              <div
                key={row.label}
                className="grid gap-3 border-b border-[var(--line)] px-6 py-5 last:border-b-0 md:grid-cols-[1fr_auto_1.3fr] md:items-center"
              >
                <div className="text-base font-semibold">{row.label}</div>
                <div
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] ${
                    row.status === "shipping"
                      ? "bg-[rgba(15,76,83,0.11)] text-[var(--teal)]"
                      : "bg-[rgba(232,176,77,0.18)] text-[var(--accent-strong)]"
                  }`}
                >
                  {row.status}
                </div>
                <div className="text-sm leading-7 text-[var(--muted)]">{row.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="deploy" className="border-t border-[var(--line)] py-14">
          <div className={badgeClass}>Deploy</div>
          <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Choose the infrastructure shape that matches the job
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {deploymentCards.map((card) => (
              <div
                key={card.name}
                className="mesh-card rounded-[1.75rem] border border-[var(--line)] p-6"
              >
                <card.icon className="h-6 w-6 text-[var(--teal)]" />
                <h3 className="mt-4 text-xl font-semibold">{card.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{card.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="use-cases" className="border-t border-[var(--line)] py-14">
          <div className={badgeClass}>Use cases</div>
          <div className="mt-4 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Build the thing on top, not around a provider dashboard.
              </h2>
            </div>
            <div className="grid gap-5">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="mesh-card rounded-[1.75rem] border border-[var(--line)] px-5 py-4"
                >
                  <div className="flex items-center gap-3 text-[var(--accent)]">
                    <item.icon className="h-5 w-5" />
                    <div className="text-base font-semibold text-[var(--foreground)]">
                      {item.title}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--line)] py-16">
          <div className="mesh-card rounded-[2rem] border border-[var(--line)] px-8 py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className={badgeClass}>Get started in minutes</div>
                <h2 className="mt-4 font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Ship realtime features today, not next quarter.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                  Self-host for free with our open source stack, or start a managed plan to skip the
                  infrastructure setup entirely. Either way, you get channels, presence, encryption,
                  and a control plane that your team can actually operate.
                </p>
              </div>

              <div className="grid gap-3">
                <Link
                  href="https://console.summonflow.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/SummonIQ/summon-flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold"
                >
                  <Github className="h-4 w-4" />
                  Clone the repo
                </a>
                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition"
                >
                  Read the quickstart guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[var(--line)] py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-[var(--font-mono)] text-xs uppercase tracking-[0.34em] text-[var(--teal)]">
                SummonFlow
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">
                Open source realtime infrastructure by SummonIQ.
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
              <a href="https://github.com/SummonIQ/summon-flow" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition">GitHub</a>
              <Link href="/docs" className="hover:text-[var(--foreground)] transition">Docs</Link>
              <Link href="/pricing" className="hover:text-[var(--foreground)] transition">Pricing</Link>
              <a href="https://github.com/SummonIQ/summon-flow/tree/main/packages/summon-flow-client" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition">Client SDK</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
