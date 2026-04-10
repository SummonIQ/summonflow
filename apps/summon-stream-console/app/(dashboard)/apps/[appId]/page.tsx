"use client";

import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Code2, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  Copy, 
  ExternalLink,
  Terminal,
  Cpu,
  Globe
} from "lucide-react";
import Link from "next/link";
import { clientSnippet, publishSnippet, serverSnippet } from "@/lib/snippets";
import { getApp } from "@/lib/mock-data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

function CodeBlock({ code, title }: { code: string; title: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/50 px-4 py-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <Terminal className="h-3 w-3" />
          {title}
        </div>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <Copy className="h-3 w-3" />
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-400">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function AppDetailPage() {
  const params = useParams();
  const appId = params.appId as string;
  const app = getApp(appId);

  if (!app) {
    notFound();
  }

  return (
    <main className="space-y-10">
      {/* Breadcrumbs & Actions */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <Link 
            href="/apps" 
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-teal-500 transition-colors"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to Applications
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white">{app.name}</h1>
            <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-500 uppercase tracking-widest">
              {app.environment}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors">
            Rotate Keys
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-teal-400 transition-colors">
            Configure App
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <motion.aside 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={item} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Overview</h3>
            <div className="mt-6 space-y-6">
              {[
                { label: "App Key", value: app.appKey, icon: KeyRound },
                { label: "WebSocket Host", value: app.host, icon: Globe },
                { label: "Auth Path", value: app.authPath, icon: ShieldCheck },
                { label: "Environment", value: app.mode, icon: Cpu },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400 mb-1.5">
                    <stat.icon className="h-3.5 w-3.5 text-zinc-600" />
                    {stat.label}
                  </div>
                  <div className="font-mono text-xs text-zinc-200 break-all">{stat.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Security & Runtime</h3>
            <div className="mt-6 space-y-4">
              {[
                ["Presence", app.features.presence],
                ["Encrypted Channels", app.features.encryptedChannels],
                ["Redis Fanout", app.features.redisFanout],
                ["Client Events", app.features.clientEvents],
              ].map(([label, active]) => (
                <div key={label as string} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{label as string}</span>
                  <span className={active ? "text-teal-500 font-medium" : "text-zinc-600"}>
                    {active ? "Active" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.aside>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={item} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-8">
            <h2 className="text-xl font-semibold text-white mb-2 italic text-zinc-500 font-normal">
              Implementation Strategy
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              Use these snippets to wire {app.name} into your application. These templates follow 
              our recommended patterns for stateless auth and persistent edge connections.
            </p>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-500">1</div>
                  Client SDK Setup
                </div>
                <CodeBlock title="client-sdk.ts" code={clientSnippet(app)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-500">2</div>
                  Auth Route Handler
                </div>
                <CodeBlock title="api/auth.ts" code={serverSnippet(app)} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 text-teal-500">3</div>
                  Publish Relay
                </div>
                <CodeBlock title="api/publish.ts" code={publishSnippet(app)} />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="flex items-center justify-between rounded-xl border border-zinc-800/50 bg-teal-500/5 p-6 border-dashed">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-teal-500/10 p-2 text-teal-500">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-white block">Production Monitoring</span>
                <span className="text-zinc-400">View real-time connection logs for this app on Railway.</span>
              </div>
            </div>
            <button className="text-xs font-bold text-teal-500 uppercase tracking-widest hover:underline">
              Open Dashboard
            </button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
