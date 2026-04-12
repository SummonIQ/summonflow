import Link from "next/link";
import { ArrowRight, CheckCircle2, Server, Cloud, Building2 } from "lucide-react";

const plans = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    description: "Self-host or use the managed free tier. Perfect for side projects, prototypes, and learning the stack.",
    icon: Server,
    color: "teal",
    features: ["1 Application", "Public channels", "Presence & encrypted channels", "Community support", "OSS package access"],
    cta: { label: "Start Free", href: "/signup" },
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
    cta: { label: "Upgrade to Pro", href: "/signup" },
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
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Pricing
          </div>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Free to self-host. Managed when you need it.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            SummonFlow ships open-source client and server packages for self-hosting, plus a managed platform when you want the hosted control plane without running the infrastructure.
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
                      ? "button-default"
                      : "border border-[var(--line)] text-[var(--foreground)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  {plan.cta.label}
                </a>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8">
          <h2 className="font-[var(--font-heading)] text-2xl font-semibold tracking-[-0.04em]">
            Open-source packages, private managed app
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            The self-hosted client and server packages are the public open-source surface. The hosted
            console, billing, and managed control plane stay private so the managed platform can ship independently.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold">
              Public surface: OSS client/server packages
            </span>
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
