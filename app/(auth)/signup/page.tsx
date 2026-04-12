"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Loader2, Github, Sparkles, ShieldCheck, Radio } from "lucide-react";
import { BrandWordmark } from "@/components/brand-wordmark";
import { signUp, authClient } from "@/lib/auth/client";

const inputClass =
  "w-full rounded-lg border border-[var(--line-strong)] bg-[var(--panel)]/88 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[color:color-mix(in_srgb,var(--muted)_78%,transparent)] outline-none transition-all focus:border-[color:color-mix(in_srgb,var(--accent)_50%,white_12%)] focus:ring-1 focus:ring-[color:color-mix(in_srgb,var(--accent)_30%,transparent)]";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!firstName || !lastName) {
      setError("First and last name are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
      });
      if (result.error) {
        setError(result.error.message ?? "Sign up failed.");
        setLoading(false);
        return;
      }
      router.push("/apps");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGithubSignUp() {
    setError(null);
    setGithubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/apps",
      });
    } catch {
      setError("GitHub sign-up failed. Check your provider configuration.");
      setGithubLoading(false);
    }
  }

  return (
    <main className="page-shell relative flex min-h-[calc(100vh-11rem)] items-center justify-center overflow-hidden px-6 py-12 text-[var(--foreground)] sm:px-10">
      <div className="grid-lines absolute inset-0 opacity-30" />
      <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center space-y-8"
        >
          <BrandWordmark />

          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              Build in minutes
            </span>
            <h1 className="max-w-xl text-5xl font-bold leading-[1.02] tracking-tight text-[var(--foreground)] sm:text-6xl">
              Spin up your realtime control plane without the usual setup drag.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[var(--muted)]">
              Create an app, issue keys, wire channel auth, and move from prototype to production with the same client SDK.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Secure by default", copy: "Signed subscriptions, private channels, and encrypted events from day one." },
              { icon: Radio, title: "Live channel visibility", copy: "Watch active channels, presence, and policies from one operator surface." },
              { icon: Activity, title: "Managed or self-hosted", copy: "Start on the hosted platform and keep the same SDK if you self-host later." },
            ].map((item) => (
              <div key={item.title} className="mesh-card rounded-[1.5rem] border border-[var(--line)] p-5">
                <item.icon className="h-5 w-5 text-[var(--teal)]" />
                <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md justify-self-end"
        >
        <div className="mesh-card relative rounded-2xl border border-[var(--line)] p-10 shadow-2xl shadow-[rgba(15,76,83,0.08)]">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-500 opacity-5 blur-3xl" />

          <div className="relative space-y-8">
            <header>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Create Account</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Get started with SummonFlow. Free to use.
              </p>
            </header>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    First Name
                  </label>
                  <input
                    id="signup-first-name"
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    Last Name
                  </label>
                  <input
                    id="signup-last-name"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="button-default group relative flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[var(--line)]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-[var(--panel)] px-2 text-[var(--muted)]">or</span>
              </div>
            </div>

            <button
              onClick={handleGithubSignUp}
              disabled={githubLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--line-strong)] px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--surface)] hover:border-[var(--line-strong)] active:scale-[0.98] disabled:opacity-60"
            >
              {githubLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  Continue with GitHub
                </>
              )}
            </button>

            <footer className="pt-0 text-center">
              <span className="text-sm text-[var(--muted)]">Already have an account? </span>
              <Link href="/login" className="text-sm font-semibold text-[var(--accent)] hover:underline">
                Sign in
              </Link>
            </footer>
          </div>
        </div>
        </motion.div>
      </div>
    </main>
  );
}
