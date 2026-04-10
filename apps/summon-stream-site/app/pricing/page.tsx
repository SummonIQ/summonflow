import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Self-hosted",
    detail:
      "Run Railway or Cloudflare with the existing packages. Best for internal tools, product notifications, and smaller collaborative surfaces.",
    bullets: [
      "Single app key",
      "Realtime auth and publish routes",
      "Presence and encrypted channels",
      "Basic operator console",
    ],
  },
  {
    name: "Scale",
    price: "Redis-backed",
    detail:
      "Add Redis fanout, multiple apps, environment isolation, and the richer control-plane features the console is already designed to expose.",
    bullets: [
      "Multiple apps and environments",
      "Redis fanout adapter",
      "Publish tokens and audit posture",
      "Deployment-specific configuration",
    ],
  },
  {
    name: "Platform",
    price: "Productized",
    detail:
      "Layer in billing, metrics, webhooks, admin APIs, and team management. This is the path from a stack to a real service business.",
    bullets: [
      "Teams and access control",
      "Usage metering",
      "Operational alerts and webhooks",
      "Support for managed plans",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="page-shell min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-[var(--muted)]">
          ← Back to home
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Product model
          </div>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Cost structure is a deployment decision first, a billing product second.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            SummonStream starts as a self-hosted stack. The service business grows when you
            add operator workflows, billing, metrics, environments, and team controls on
            top of that runtime.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.name}
              className="mesh-card rounded-[2rem] border border-[var(--line)] p-6"
            >
              <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                {plan.name}
              </div>
              <div className="mt-3 text-3xl font-semibold">{plan.price}</div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{plan.detail}</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--foreground)]">
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
