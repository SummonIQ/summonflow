"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, LockKeyhole, Orbit, RadioTower, Plus } from "lucide-react";
import { streamApps, supportedFeatures } from "@/lib/mock-data";

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

export default function AppsPage() {
  return (
    <main className="space-y-10">
      {/* Header section */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Applications</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Manage your realtime estate across different environments. Configure app keys,
            deployment targets, and security policies for each environment.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Create New App
        </button>
      </header>

      {/* Grid section */}
      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {streamApps.map((app) => (
            <motion.div key={app.id} variants={item}>
              <Link
                href={`/apps/${app.id}`}
                className="group block rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 transition-all duration-200 hover:border-zinc-700/50 hover:bg-zinc-800/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-zinc-100">{app.name}</h2>
                      <span className="inline-flex items-center rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                        {app.environment}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500">
                      {app.appKey} • {app.host}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    {app.mode}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/20 px-3 py-2">
                    <RadioTower className="h-3.5 w-3.5 text-teal-500" />
                    <span className="text-xs text-zinc-400 truncate">{app.deployment.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/20 px-3 py-2">
                    <LockKeyhole className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs text-zinc-400">
                      {app.features.encryptedChannels ? "Encrypted" : "Token Auth"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-950/20 px-3 py-2">
                    <Orbit className="h-3.5 w-3.5 text-indigo-500" />
                    <span className="text-xs text-zinc-400">
                      {app.features.redisFanout ? "Redis-backed" : "In-memory"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs text-zinc-500 line-clamp-1 italic">
                    {app.notes}
                  </p>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-400" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Sidebar/Feature list */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">System Capabilities</h3>
            <div className="mt-6 space-y-8">
              {supportedFeatures.map((group) => (
                <div key={group.title}>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{group.title}</h4>
                  <ul className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-3 text-xs leading-relaxed text-zinc-400">
                        <Check className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
