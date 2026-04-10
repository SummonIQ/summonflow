"use client";

import { motion } from "framer-motion";
import { Layers, Rocket, Sparkles, Plus, CheckCircle2, Clock } from "lucide-react";
import { integrationCards } from "@/lib/mock-data";

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

export default function IntegrationsPage() {
  return (
    <main className="space-y-10">
      {/* Header section */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Integrations</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Connect SummonStream to your deployment targets and external services. 
            Manage infrastructure runtimes and upcoming lifecycle features.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Request Integration
        </button>
      </header>

      {/* Integrations Grid */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-2"
      >
        {integrationCards.map((card) => (
          <motion.div 
            key={card.name} 
            variants={item}
            className="group relative rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 transition-all duration-200 hover:border-zinc-700/50 hover:bg-zinc-800/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-teal-500 group-hover:bg-teal-500/10 transition-colors">
                  {card.status === "shipping" ? <Rocket className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    card.status === "shipping"
                      ? "bg-teal-500/10 text-teal-500"
                      : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {card.status === "shipping" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {card.status}
                </span>
              </div>
              
              <h2 className="mt-6 text-xl font-semibold text-white group-hover:text-teal-500 transition-colors">
                {card.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {card.summary}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-zinc-800/50">
              <button className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                Configuration
              </button>
              <button className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                Documentation
              </button>
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
          </motion.div>
        ))}
      </motion.section>

      {/* Surface Area Note */}
      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-500" />
              Service Surface Area
            </h3>
            <p className="text-sm text-zinc-400 max-w-2xl">
              The current runtime spans multiple deployment targets. Future development focuses on 
              enterprise features like billing cycles, team RBAC, and granular audit trails.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors">
            View Roadmap
          </button>
        </div>
      </section>
    </main>
  );
}
