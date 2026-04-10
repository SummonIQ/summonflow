"use client";

import { motion } from "framer-motion";
import { CreditCard, Check, Shield, Zap, Building2, ExternalLink } from "lucide-react";

const plans = [
  {
    name: "Hobby",
    price: "$0",
    description: "For personal projects and exploration.",
    features: ["1 Application", "Public Channels", "Community Support", "Basic Analytics"],
    button: "Current Plan",
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Production-grade infrastructure.",
    features: [
      "Unlimited Applications",
      "Presence & Encrypted Channels",
      "Redis-backed Fanout",
      "Priority Email Support",
      "Custom Auth Endpoints",
    ],
    button: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams with high-scale needs.",
    features: [
      "SLA Guarantees",
      "Dedicated WebSocket Nodes",
      "Full Audit Trails",
      "White-glove Onboarding",
      "24/7 Phone Support",
    ],
    button: "Contact Sales",
  },
];

export default function BillingPage() {
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Plans</h1>
        <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
          Manage your subscription and usage. Choose the plan that best fits your scale.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col justify-between rounded-xl border p-8 transition-all ${
              plan.highlight
                ? "border-teal-500/50 bg-teal-500/5 ring-1 ring-teal-500/50"
                : "border-zinc-800/50 bg-zinc-900/30"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-950">
                Recommended
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-zinc-500">{plan.period}</span>}
              </div>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{plan.description}</p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-xs text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={plan.current}
              className={`mt-10 w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                plan.current
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : plan.highlight
                  ? "bg-teal-500 text-zinc-950 hover:bg-teal-400"
                  : "border border-zinc-700 text-zinc-300 hover:bg-white/5"
              }`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-zinc-800 p-3 text-zinc-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Payment Method</h3>
              <p className="text-sm text-zinc-400">No payment method on file.</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors">
            Add Payment Method
          </button>
        </div>
      </section>

      {/* Invoices helper */}
      <footer className="flex items-center justify-between rounded-xl border border-dashed border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <ExternalLink className="h-4 w-4 text-zinc-500" />
          <span className="text-xs text-zinc-500">Need to view past invoices? Visit the Stripe Customer Portal.</span>
        </div>
        <button className="text-[10px] font-bold text-teal-500 uppercase tracking-widest hover:underline">
          Open Portal
        </button>
      </footer>
    </main>
  );
}
