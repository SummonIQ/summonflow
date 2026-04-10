import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import changelog from "@/data/changelog.json";
import { getEntryCategory, isMinorEntry, isBugEntry, type ChangelogEntry } from "@/lib/changelog-categories";

export const metadata: Metadata = {
  title: "Changelog",
  description: "New features, improvements, and fixes for SummonFlow.",
};

type ChangelogDay = { date: string; entries: ChangelogEntry[] };

function EntryIllustration({ Icon, iconClass }: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;
  iconClass: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      <div className="absolute inset-0 rounded-[inherit] bg-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]" />
      <Icon aria-hidden strokeWidth={1.95} className={`absolute left-1/2 top-1/2 h-[0.9rem] w-[0.9rem] -translate-x-1/2 -translate-y-1/2 ${iconClass}`} />
    </div>
  );
}

function MajorEntry({ entry, isFirst }: { entry: ChangelogEntry; isFirst: boolean }) {
  const category = getEntryCategory(entry);
  return (
    <div className={isFirst ? "relative overflow-hidden px-5 py-4" : "relative overflow-hidden border-t border-[var(--line)] px-5 py-4"}>
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-28 w-48" style={{ background: `radial-gradient(ellipse at top left, ${category.glow} 0%, transparent 78%)` }} />
      <div className="relative flex items-start gap-3.5">
        <div className={`relative mt-0.5 flex h-[2.3rem] w-[2.3rem] shrink-0 items-center justify-center overflow-hidden rounded-[0.72rem] border ${category.iconTileClass}`}>
          <EntryIllustration Icon={category.icon} iconClass={category.iconClass} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="pt-0.5 text-[0.96rem] font-semibold text-[var(--foreground)]">{entry.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{entry.description}</p>
          <div className="mt-2">
            <span className={`inline-flex rounded-full border px-2 py-[0.22rem] text-[8px] font-semibold uppercase tracking-[0.17em] ${category.badgeClass}`}>
              {category.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactSection({ title, entries, hasContentAbove }: { title: string; entries: ChangelogEntry[]; hasContentAbove: boolean }) {
  if (entries.length === 0) return null;
  return (
    <div className={hasContentAbove ? "border-t border-[var(--line)] bg-[var(--surface)] px-5 py-3" : "bg-[var(--surface)] px-5 py-3"}>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{title}</div>
      <ul className="space-y-1.5">
        {entries.map((entry, i) => {
          const category = getEntryCategory(entry);
          return (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${category.iconClass.replace("text-", "bg-").replace("/86", "/70").replace("/84", "/70").replace("/90", "/70")}`} aria-hidden />
              <div className="flex-1 leading-snug">
                <span className="font-medium text-[var(--foreground)]">{entry.title}</span>
                <span className="text-[var(--muted)]"> — {entry.description}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
  const days = changelog as ChangelogDay[];

  return (
    <main className="page-shell min-h-screen px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">&larr; Back to home</Link>

        <h1 className="mt-8 font-[var(--font-heading)] text-4xl font-bold tracking-tight sm:text-5xl">Changelog</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">New features, improvements, and fixes.</p>

        <div className="mt-12 space-y-12">
          {days.map((day) => {
            const major = day.entries.filter((e) => !isMinorEntry(e));
            const minor = day.entries.filter((e) => isMinorEntry(e));
            const fixes = minor.filter(isBugEntry);
            const other = minor.filter((e) => !isBugEntry(e));

            return (
              <div key={day.date}>
                <time className="mb-5 block text-lg font-semibold tracking-tight text-[var(--muted)]">
                  {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(15,76,83,0.4)_0%,rgba(194,81,47,0.35)_50%,rgba(232,176,77,0.3)_100%)] p-px">
                  <div className="overflow-hidden rounded-[calc(1rem-1px)] bg-[var(--surface-strong)] backdrop-blur-sm">
                    {major.map((entry, i) => (
                      <MajorEntry key={`major-${i}`} entry={entry} isFirst={i === 0} />
                    ))}
                    <CompactSection title="Fixes" entries={fixes} hasContentAbove={major.length > 0} />
                    <CompactSection title="Other" entries={other} hasContentAbove={major.length > 0 || fixes.length > 0} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
