"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Users, Radio, Plus, Activity } from "lucide-react";
import { channelPolicies } from "@/lib/mock-data";

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

export default function ChannelPoliciesPage() {
  return (
    <main className="space-y-10">
      {/* Header section */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Channel Policies</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Define global rules for how different channel types behave. 
            Configure mandatory encryption, member-bound authorization, and restricted event sets.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Create New Policy
        </button>
      </header>

      {/* Policies Grid */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {channelPolicies.map((policy) => (
          <motion.div 
            key={policy.name} 
            variants={item}
            className="group relative rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-200 hover:border-zinc-700/50 hover:bg-zinc-800/20"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                      {policy.name}
                    </span>
                    {policy.encryption === "required" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-500">
                        <Lock className="h-3 w-3" />
                        Encrypted
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{policy.purpose}</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {policy.events.map((event) => (
                    <span
                      key={event}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/40 px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors group-hover:border-zinc-700 group-hover:text-zinc-300"
                    >
                      <Activity className="h-3 w-3 text-zinc-600" />
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end lg:text-right">
                <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/30 px-4 py-3 min-w-[180px]">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest sm:justify-end">
                    <Users className="h-3 w-3" />
                    Authorization
                  </div>
                  <div className="mt-1 text-sm font-medium text-zinc-200">{policy.auth}</div>
                </div>

                <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/30 px-4 py-3 min-w-[180px]">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest sm:justify-end">
                    <ShieldCheck className="h-3 w-3" />
                    Encryption
                  </div>
                  <div className="mt-1 text-sm font-medium text-zinc-200">{policy.encryption}</div>
                </div>
              </div>
            </div>

            {/* Subtle indicator decoration */}
            <div className="absolute left-0 top-6 h-8 w-1 rounded-r-full bg-teal-500/20 transition-all group-hover:bg-teal-500" />
          </motion.div>
        ))}
      </motion.section>

      {/* Footer helper */}
      <footer className="rounded-xl border border-zinc-800/50 bg-teal-500/5 p-6 border-dashed">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-teal-500/10 p-2 text-teal-500">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Global Policy Application</h3>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              These policies are enforced at the websocket edge on Railway and Cloudflare runtimes. 
              Subscribers are automatically verified against the auth requirements defined here.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
