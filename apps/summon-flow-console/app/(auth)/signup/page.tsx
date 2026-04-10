"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth/client";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 py-12 text-zinc-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">
            SummonFlow
          </span>
        </div>

        <div className="relative rounded-2xl border border-zinc-800/50 bg-zinc-950/50 p-10 shadow-2xl shadow-teal-500/5">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-500 opacity-5 blur-3xl" />

          <div className="relative space-y-8">
            <header>
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="mt-2 text-sm text-zinc-500">
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
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Jane"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3.5 text-sm font-bold text-zinc-950 transition-all hover:bg-teal-400 active:scale-[0.98] disabled:opacity-60"
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

            <footer className="pt-2 text-center">
              <span className="text-sm text-zinc-500">Already have an account? </span>
              <Link href="/login" className="text-sm font-semibold text-teal-500 hover:underline">
                Sign in
              </Link>
            </footer>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
