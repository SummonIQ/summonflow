"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Github } from "lucide-react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/lib/auth/client";

type HeaderVariant = "default" | "minimal" | "framed" | "accent";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/docs", label: "Docs" },
  { href: "/help", label: "Help" },
];

const publicRepoUrl = "https://github.com/SummonIQ/summonflow";

export function MarketingHeader() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVariant, setHeaderVariant] = useState<HeaderVariant>("default");

  useEffect(() => {
    const onScroll = () => {
      const next = Math.min(window.scrollY / 180, 1);
      setScrollProgress(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const readVariant = () => {
      const raw = document.documentElement.dataset.marketingHeaderVariant;
      if (
        raw === "minimal" ||
        raw === "framed" ||
        raw === "accent" ||
        raw === "default"
      ) {
        setHeaderVariant(raw);
        return;
      }

      setHeaderVariant("default");
    };

    const onVariantChange = (event: Event) => {
      const next = (event as CustomEvent<{ variant?: HeaderVariant }>).detail?.variant;
      if (
        next === "minimal" ||
        next === "framed" ||
        next === "accent" ||
        next === "default"
      ) {
        setHeaderVariant(next);
      } else {
        readVariant();
      }
    };

    readVariant();
    window.addEventListener("marketing-header-variant-change", onVariantChange);
    return () =>
      window.removeEventListener("marketing-header-variant-change", onVariantChange);
  }, []);

  const headerStyle = useMemo(
    () => ({
      background: `linear-gradient(to bottom, color-mix(in srgb, var(--background) ${78 + scrollProgress * 18}%, transparent) 0%, color-mix(in srgb, var(--background) ${18 + scrollProgress * 16}%, transparent) 100%)`,
      backdropFilter: `blur(${8 + scrollProgress * 18}px) saturate(${100 + scrollProgress * 50}%) brightness(${100 + scrollProgress * 8}%)`,
      WebkitBackdropFilter: `blur(${8 + scrollProgress * 18}px) saturate(${100 + scrollProgress * 50}%) brightness(${100 + scrollProgress * 8}%)`,
      boxShadow: `inset 0 -1px 0 color-mix(in srgb, var(--foreground) ${5 + scrollProgress * 7}%, transparent)`,
    }),
    [scrollProgress]
  );

  const topEdgeStyle = useMemo(
    () => ({
      opacity: scrollProgress * (headerVariant === "accent" ? 0.22 : 0.28),
      backdropFilter: `blur(${6 + scrollProgress * 7}px) saturate(${140 + scrollProgress * 42}%) brightness(${102 + scrollProgress * 12}%) contrast(105%)`,
      WebkitBackdropFilter: `blur(${6 + scrollProgress * 7}px) saturate(${140 + scrollProgress * 42}%) brightness(${102 + scrollProgress * 12}%) contrast(105%)`,
    }),
    [headerVariant, scrollProgress]
  );

  const bottomEdgeStyle = useMemo(
    () => ({
      opacity: scrollProgress * 0.22,
      background: "color-mix(in srgb, var(--foreground) 18%, transparent)",
      backdropFilter: `blur(${7 + scrollProgress * 6}px) saturate(${145 + scrollProgress * 40}%) brightness(${103 + scrollProgress * 12}%)`,
      WebkitBackdropFilter: `blur(${7 + scrollProgress * 6}px) saturate(${145 + scrollProgress * 40}%) brightness(${103 + scrollProgress * 12}%)`,
    }),
    [scrollProgress]
  );

  const headerFrameClass =
    headerVariant === "minimal"
      ? "border-b border-transparent"
      : headerVariant === "framed"
        ? "border-b border-[color:color-mix(in_srgb,var(--foreground)_7%,transparent)]"
        : headerVariant === "accent"
          ? "border-b border-[color:color-mix(in_srgb,var(--teal)_14%,transparent)]"
          : "border-b border-transparent";

  const innerShellClass =
    headerVariant === "minimal"
      ? "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3 sm:px-10"
      : headerVariant === "framed"
        ? "mx-auto mt-3 flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-[color:color-mix(in_srgb,var(--foreground)_8%,transparent)] bg-[color:color-mix(in_srgb,var(--panel)_60%,transparent)] px-6 py-3 shadow-[0_12px_50px_-32px_rgba(0,0,0,0.28)] sm:px-8"
        : headerVariant === "accent"
          ? "mx-auto mt-3 flex w-full max-w-7xl items-center justify-between gap-4 rounded-full border border-[color:color-mix(in_srgb,var(--teal)_16%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel)_74%,transparent),color-mix(in_srgb,var(--panel)_56%,transparent))] px-6 py-3 shadow-[0_18px_64px_-36px_rgba(7,54,58,0.34)] sm:px-8"
          : "mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 pt-3 pb-1.5 sm:px-10";

  if (pathname.startsWith("/docs")) {
    return null;
  }

  const primaryHref = session ? "/apps" : "/signup";
  const primaryLabel = session ? "Go to Console" : "Get Started";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[200%]"
          style={{
            ...headerStyle,
            maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10 w-full border-b border-transparent">
          <div className={innerShellClass}>
            <Link href="/" className="text-[var(--foreground)]">
              <BrandWordmark />
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-[color:color-mix(in_srgb,var(--muted)_78%,var(--foreground)_22%)] md:flex">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <a
                  href={publicRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the public SummonFlow repository on GitHub"
                  className="inline-flex h-10 w-10 appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-none text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
              <span aria-hidden className="hidden h-5 w-px bg-[var(--line)] sm:block" />
              {!session && !isPending ? (
                <Link
                  href="/login"
                  className="hidden text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] sm:inline-flex"
                >
                  Sign in
                </Link>
              ) : null}
              <Link
                href={primaryHref}
                className="button-default inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
              >
                {primaryLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className={`pointer-events-none absolute inset-x-0 top-0 z-10 ${headerFrameClass}`} />

        <div
          className="pointer-events-none absolute -top-px inset-x-0 z-20 h-px"
          style={{
            ...topEdgeStyle,
            maskImage: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.35) 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.35) 60%, transparent 100%)",
            filter: "blur(0.25px)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-full z-30 h-px -translate-y-px"
          style={{
            ...bottomEdgeStyle,
            maskImage: "linear-gradient(to bottom, black 0%, rgba(255,255,255,0.5) 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, rgba(255,255,255,0.5) 60%, transparent 100%)",
          }}
        />
      </div>
    </header>
  );
}
