"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Activity, Terminal, ArrowRight, Loader2, Fingerprint, Github } from "lucide-react";
import { Card } from "@/components/card";
import { signIn, authClient } from "@/lib/auth/client";
import { useProductAnalytics } from "@/lib/analytics/client";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3, delay: 0.2 } },
};

const inputClass =
  "w-full rounded-lg border border-[var(--line-strong)] bg-[var(--panel)]/88 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[color:color-mix(in_srgb,var(--muted)_78%,transparent)] outline-none transition-all focus:border-[color:color-mix(in_srgb,var(--accent)_50%,white_12%)] focus:ring-1 focus:ring-[color:color-mix(in_srgb,var(--accent)_30%,transparent)]";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <LoginView />
    </Suspense>
  );
}

function LoginView() {
  const router = useRouter();
  const { trackProductEvent } = useProductAnalytics();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  async function handlePasskeySignIn() {
    setError(null);
    setPasskeyLoading(true);
    trackProductEvent("login_attempted", { method: "passkey" });
    try {
      const result = await authClient.signIn.passkey();
      if (result?.error) {
        setError(result.error.message ?? "Passkey sign-in failed.");
        trackProductEvent("login_failed", { method: "passkey", reason: result.error.message ?? "passkey_error" });
        setPasskeyLoading(false);
        return;
      }
      trackProductEvent("login_succeeded", { method: "passkey" });
      router.push("/apps");
    } catch {
      setError("Passkey sign-in failed. Make sure you have a registered passkey.");
      trackProductEvent("login_failed", { method: "passkey", reason: "exception" });
      setPasskeyLoading(false);
    }
  }

  async function handleGithubSignIn() {
    setError(null);
    setGithubLoading(true);
    trackProductEvent("login_attempted", { method: "github" });
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/apps",
      });
      trackProductEvent("login_redirect_started", { method: "github" });
    } catch {
      setError("GitHub sign-in failed. Check your provider configuration.");
      trackProductEvent("login_failed", { method: "github", reason: "exception" });
      setGithubLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    trackProductEvent("login_attempted", { method: "email", emailDomain: email.split("@")[1] ?? null });

    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Invalid credentials.");
        trackProductEvent("login_failed", { method: "email", reason: result.error.message ?? "invalid_credentials" });
        setLoading(false);
        return;
      }
      trackProductEvent("login_succeeded", { method: "email", emailDomain: email.split("@")[1] ?? null });
      router.push("/apps");
    } catch {
      setError("Something went wrong. Please try again.");
      trackProductEvent("login_failed", { method: "email", reason: "exception" });
      setLoading(false);
    }
  }

  return (
    <main className="page-shell relative flex min-h-[calc(100vh-11rem)] items-center justify-center overflow-hidden px-6 py-12 text-[var(--foreground)] sm:px-10">
      <div className="grid-lines absolute inset-0 opacity-30" />
      <div className="grid w-full max-w-[76rem] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-start space-y-10"
        >
          <motion.div variants={item} className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              Welcome back
            </span>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-6xl">
              Operator <br />
              <span className="text-[var(--accent)]">Control Plane</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-[var(--muted)]">
              The professional layer between raw websocket infrastructure and the
              realtime service you actually want to operate.
            </p>
          </motion.div>

          <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "App-level keys", copy: "Scoped publish tokens and signed subscription auth for every app." },
              { icon: Activity, title: "Edge runtimes", copy: "Deploy to Railway, Cloudflare, or your own infrastructure." },
              { icon: Terminal, title: "Channel policies", copy: "Deterministic auth rules and pattern-based access control." },
            ].map((card) => (
              <Card key={card.title}>
                <card.icon className="h-5 w-5 text-[var(--teal)]" />
                <h3 className="mt-4 text-base font-semibold text-[var(--foreground)]">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{card.copy}</p>
              </Card>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mesh-card relative max-w-[504px] w-[504px] justify-self-end rounded-2xl border border-[var(--line)] p-10 shadow-2xl shadow-[rgba(15,76,83,0.08)]"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--teal)] opacity-8 blur-3xl" />

          <div className="relative space-y-8">
            <header>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">Sign In</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Access the SummonFlow operator console.
              </p>
            </header>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Email
                </label>
                <input
                  id="login-email"
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
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  autoComplete="current-password"
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
                    Access Console
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
              onClick={handleGithubSignIn}
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

            <button
              onClick={handlePasskeySignIn}
              disabled={passkeyLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--line-strong)] px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--surface)] hover:border-[var(--line-strong)] active:scale-[0.98] disabled:opacity-60"
            >
              {passkeyLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Fingerprint className="h-4 w-4" />
                  Sign in with Passkey
                </>
              )}
            </button>

            <footer className="pt-0 text-center">
              <span className="text-sm text-[var(--muted)]">Don&apos;t have an account? </span>
              <Link href="/signup" className="text-sm font-semibold text-[var(--accent)] hover:underline">
                Create one
              </Link>
            </footer>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
