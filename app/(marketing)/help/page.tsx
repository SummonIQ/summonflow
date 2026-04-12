import type { Metadata } from "next";
import { BookOpen, MessageCircle, Mail, FileText, Zap, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Help",
  description: "Get help with SummonFlow — documentation, community, and support.",
};

const resources = [
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Quickstart guides, API reference, deployment docs, and architecture overview.",
    href: "/docs",
    cta: "Browse docs",
  },
  {
    icon: Zap,
    title: "Quickstart",
    description: "Get your first app running in under 5 minutes with the managed platform or self-hosted.",
    href: "/docs/quickstart",
    cta: "Follow quickstart",
  },
  {
    icon: FileText,
    title: "Changelog",
    description: "See what shipped recently — new features, improvements, and fixes.",
    href: "/changelog",
    cta: "View changelog",
  },
  {
    icon: MessageCircle,
    title: "Managed Support",
    description: "Questions about the hosted console, billing, or your managed workspace.",
    href: "mailto:support@summonflow.com",
    cta: "Email support",
    external: true,
  },
  {
    icon: Code2,
    title: "Client SDK Reference",
    description: "Read the public SDK docs without exposing the hosted app repository surface.",
    href: "/docs/client-sdk",
    cta: "Open SDK docs",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Pro and Enterprise customers get priority email support. Hobby tier gets community support.",
    href: "mailto:support@summonflow.com",
    cta: "Contact support",
    external: true,
  },
];

const faqs = [
  {
    q: "What's the difference between self-hosted and managed?",
    a: "Self-hosted means you deploy and operate the WebSocket server yourself (Railway, Cloudflare, or your own infra). Managed means we run it for you — just create an app in the console and connect your client SDK.",
  },
  {
    q: "Is the client SDK free?",
    a: "Yes. The @summoniq/summon-flow client SDK is MIT licensed and free to use regardless of whether you self-host or use the managed platform.",
  },
  {
    q: "How do I upgrade from Hobby to Pro?",
    a: "Go to Settings → Billing in the console and click \"Upgrade to Pro\". You'll be redirected to Stripe Checkout. Your subscription is active immediately.",
  },
  {
    q: "Can I switch from managed to self-hosted later?",
    a: "Yes. The same client SDK works with both. Point your wsHost at your own server instead of the managed endpoint, set up your auth route, and you're done.",
  },
  {
    q: "What happens if I hit the 10 app limit on Pro?",
    a: "You'll need to delete an existing app or contact us about an Enterprise plan for higher limits.",
  },
  {
    q: "Do you store message payloads?",
    a: "No. SummonFlow relays messages in real time. We don't persist event payloads. For encrypted channels, we never see the plaintext at all.",
  },
];

export default function HelpPage() {
  return (
    <main className="page-shell min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            Help
          </div>
          <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
            Find answers in the docs, ask the community, or reach out directly.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <a
              key={r.title}
              href={r.href}
              target={r.external ? "_blank" : undefined}
              rel={r.external ? "noopener noreferrer" : undefined}
              className="group mesh-card flex flex-col justify-between rounded-[1.75rem] border border-[var(--line)] p-6 transition hover:border-[var(--line-strong)]"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(15,76,83,0.08)] text-[var(--teal)]">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{r.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{r.description}</p>
              </div>
              <div className="mt-4 text-sm font-semibold text-[var(--teal)] group-hover:underline">{r.cta} &rarr;</div>
            </a>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="font-[var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="mesh-card rounded-[1.75rem] border border-[var(--line)] p-6">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{faq.q}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
