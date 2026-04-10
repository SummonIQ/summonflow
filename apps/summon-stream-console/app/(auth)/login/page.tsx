"use client";

import { use, Suspense } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, RadioTower, ShieldCheck, Activity, Terminal, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const paramsPromise = searchParams ?? Promise.resolve({});

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b]" />}>
      <LoginView paramsPromise={paramsPromise} />
    </Suspense>
  );
}

function LoginView({
  paramsPromise,
}: {
  paramsPromise: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = use(paramsPromise);
  const hasError = params.error === "invalid";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 py-12 text-zinc-100">
      <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side: Brand & Value */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center space-y-10"
        >
          <motion.div variants={item} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">
              SummonStream
            </span>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Operator <br /> 
              <span className="text-teal-500">Control Plane</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-zinc-400">
              The professional layer between raw websocket infrastructure and the 
              realtime service you actually want to operate.
            </p>
          </motion.div>

          <motion.div variants={item} className="grid gap-4">
            {[
              { text: "App-level keys & publish tokens", icon: ShieldCheck },
              { text: "Railway & Cloudflare edge runtimes", icon: Activity },
              { text: "Deterministic auth & channel policy", icon: Terminal },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-4 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700/50"
              >
                <feature.icon className="h-5 w-5 text-teal-500" />
                <span className="text-sm font-medium text-zinc-300">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* Right Side: Login Form */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-2xl border border-zinc-800/50 bg-zinc-950/50 p-10 shadow-2xl shadow-teal-500/5"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-500 opacity-5 blur-3xl" />
          
          <div className="relative space-y-8">
            <header>
              <h2 className="text-2xl font-bold text-white">Sign In</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Access the SummonStream operator console.
              </p>
            </header>

            {hasError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-400">
                Invalid credentials. Please check your email and password.
              </div>
            )}

            <form action={signIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Operator Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue="ops@summonstream.dev"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Access Key
                </label>
                <input
                  name="password"
                  type="password"
                  defaultValue="summonstream-demo"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
                />
              </div>

              <button className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3.5 text-sm font-bold text-zinc-950 transition-all hover:bg-teal-400 active:scale-[0.98]">
                Access Console
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <footer className="space-y-4 pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-zinc-800/50"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-[#09090b] px-2 text-zinc-600">Demo Credentials</span>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 font-mono text-[11px] text-zinc-500 space-y-1">
                <div className="flex justify-between">
                  <span>email:</span>
                  <span className="text-zinc-300">ops@summonstream.dev</span>
                </div>
                <div className="flex justify-between">
                  <span>key:</span>
                  <span className="text-zinc-300">summonstream-demo</span>
                </div>
              </div>
            </footer>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
