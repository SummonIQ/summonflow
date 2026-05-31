import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <BrandWordmark />
          <div className="mt-1 text-sm text-[var(--muted)]">Open source realtime infrastructure.</div>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]">
          <Link href="/features" className="transition hover:text-[var(--foreground)]">Features</Link>
          <Link href="/pricing" className="transition hover:text-[var(--foreground)]">Pricing</Link>
          <Link href="/docs" className="transition hover:text-[var(--foreground)]">Docs</Link>
          <Link href="/changelog" className="transition hover:text-[var(--foreground)]">Changelog</Link>
          <Link href="/help" className="transition hover:text-[var(--foreground)]">Help</Link>
        </div>
      </div>
    </footer>
  );
}
