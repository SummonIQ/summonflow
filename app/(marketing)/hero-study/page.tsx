import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { MarketingHeroBackground } from "@/components/marketing-hero-background";
import { MarketingHeroVisual } from "@/components/marketing-hero-visual";

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]";

export default function HeroStudyPage() {
  return (
    <main className="page-shell min-h-screen">
      <div className="grid-lines absolute inset-0 opacity-40" />

      <section className="relative isolate overflow-visible pb-12 pt-16 lg:min-h-[calc(100svh-5.5rem)] lg:pb-20 lg:pt-20">
        <div className="absolute -bottom-10 left-1/2 top-0 w-screen -translate-x-1/2 overflow-visible">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_10%,transparent)_0%,color-mix(in_srgb,#071014_52%,transparent)_14%,#071014_44%,#061014_100%)]" />
          <MarketingHeroBackground />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid items-center gap-14 overflow-visible lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1fr)]">
            <div className="fade-up relative max-w-3xl py-6">
              <div className={badgeClass}>Open Source · MIT Licensed</div>

              <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Realtime infrastructure
              </div>
              <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--foreground)] sm:text-6xl lg:text-[5.3rem]">
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
                <span className="inline-flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5" /> @summoniq/summon-flow
                </span>
                <span className="text-[var(--line)]">|</span>
                <span>TypeScript-first</span>
                <span className="text-[var(--line)]">|</span>
                <span>WebSocket-native</span>
              </div>
            </div>

            <div className="fade-up-delay relative overflow-visible lg:-mr-24 lg:justify-self-end xl:-mr-32">
              <MarketingHeroVisual />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
