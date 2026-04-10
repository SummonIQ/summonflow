import Link from "next/link";
import { ArrowRight, CheckCircle2, Github, Server, Cloud, Building2 } from "lucide-react";

const plans = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    description: "Self-host or use the managed free tier. Perfect for side projects, prototypes, and learning the stack.",
    icon: Server,
    color: "teal",
    features: [
      "1 Application",
      "Public channels",
      "Presence & encrypted channels",
      "Community support",
      "Full source access (MIT)",
    ],
    cta: { label: "Start Free", href: "https://console.summonflow.com" },
    secondaryCta: { label: "Self-host from GitHub", href: "https://github.com/SummonIQ/summon-flow" },
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Production-grade managed infrastructure. Skip the DevOps and ship realtime features today.",
    icon: Cloud,
    color: "accent",
    highlight: true,
    features: [
      "Up to 10 Applications",
      "Presence & encrypted channels",
      "Redis-backed fanout",
      "Priority email support",
      "Custom auth endpoints",
      "Managed upgrades & monitoring",
    ],
    cta: { label: "Upgrade to Pro", href: "https://console.summonflow.com" },
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams that need SLAs, dedicated infrastructure, and white-glove onboarding.",
    icon: Building2,
    color: "foreground",
    features: [
      "SLA guarantees (99.99%)",
      "Dedicated WebSocket nodes",
      "Full audit trails",
      "White-glove onboarding",
      "24/7 phone support",
      "Custom integrations",
    ],
    cta: { label: "Contact Sales", href: "mailto:sales@summonflow.com" },
  },
];

export default function PricingPage() {
  return (
    <main className="page-shell min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
          &larr; Back to home
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Pricing
          </div>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Free to self-host. Managed when you need it.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            SummonFlow is open source and MIT licensed. Run it yourself for free, or let
            us handle the infrastructure so you can focus on building your product.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.name}
              className={`mesh-card relative flex flex-col justify-between rounded-[2rem] border p-8 ${
                plan.highlight
                  ? "border-[var(--accent)] ring-1 ring-[var(--accent)] ring-offset-4 ring-offset-[var(--background)]"
                  : "border-[var(--line)]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Most Popular
                </div>
              )}

              <div>
                <div className={`inline-flex rounded-xl p-3 ${
                  plan.highlight ? "bg-[rgba(194,81,47,0.12)] text-[var(--accent)]" : "bg-[rgba(15,76,83,0.08)] text-[var(--teal)]"
                }`}>
                  <plan.icon className="h-6 w-6" />
                </div>

                <div className="mt-5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                  {plan.name}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">{plan.price}</span>
                  {plan.period && <span className="text-[var(--muted)]">{plan.period}</span>}
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{plan.description}</p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${
                        plan.highlight ? "text-[var(--accent)]" : "text-[var(--teal)]"
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 space-y-3">
                <a
                  href={plan.cta.href}
                  className={`block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                      : "border border-[var(--line)] text-[var(--foreground)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  {plan.cta.label}
                </a>
                {plan.secondaryCta && (
                  <a
                    href={plan.secondaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
                  >
                    <Github className="h-3.5 w-3.5" />
                    {plan.secondaryCta.label}
                  </a>
                )}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold tracking-[-0.04em]">
            Open source at the core
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            The SummonFlow runtime, client SDK, and server libraries are all MIT licensed and available
            on GitHub. The managed service adds hosted infrastructure, automatic upgrades, and support
            so your team can focus on building instead of operating WebSocket servers.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/SummonIQ/summon-flow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--surface-strong)] transition"
            >
              <Github className="h-4 w-4" />
              SummonIQ/summon-flow
            </a>
            <a
              href="https://github.com/SummonIQ/summon-flow/tree/main/packages/summon-flow-client"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
            >
              Client SDK &rarr;
            </a>
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
            >
              Quickstart guide &rarr;
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
