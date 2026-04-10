import { ArrowRight, BookOpen, Code2, Github, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function DocsIntroduction() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm font-semibold text-teal-500 uppercase tracking-widest mb-4">
          <BookOpen className="h-4 w-4" />
          Documentation
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Introduction</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          SummonFlow is a self-hosted realtime infrastructure designed for teams that want full control over their channel layer without sacrificing the operator experience.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <Zap className="h-6 w-6 text-teal-500 mb-4" />
          <h3 className="text-lg font-semibold text-white">Fast & Scalable</h3>
          <p className="mt-2 text-sm text-zinc-400">Built on persistent WebSockets with Redis-backed fanout for horizontal scaling.</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <ShieldCheck className="h-6 w-6 text-amber-500 mb-4" />
          <h3 className="text-lg font-semibold text-white">Secure by Default</h3>
          <p className="mt-2 text-sm text-zinc-400">Mandatory subscription signing and optional AES-256-GCM end-to-end encryption.</p>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Why SummonFlow?</h2>
        <p className="text-zinc-400">
          Most realtime providers treat the channel layer as a black box. You pay for &ldquo;connections&rdquo; and &ldquo;messages&rdquo; without visibility into how the orchestration actually works. SummonFlow flips this model.
        </p>
        <ul className="list-disc pl-6 space-y-4 text-zinc-400">
          <li><strong className="text-zinc-200">Explicit Infrastructure:</strong> Deploy to Railway, Cloudflare, or your own metal. You own every layer.</li>
          <li><strong className="text-zinc-200">Zero Lock-in:</strong> MIT licensed core runtime and client SDKs. No vendor dependency.</li>
          <li><strong className="text-zinc-200">Control Plane:</strong> A professional console to manage keys, environments, and channel policies.</li>
          <li><strong className="text-zinc-200">Or Just Use Managed:</strong> Don&apos;t want to operate servers? The managed service gives you all of this without the DevOps.</li>
        </ul>
      </section>

      <section className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h2 className="text-lg font-bold text-white mb-4">Open Source Repositories</h2>
        <div className="space-y-3">
          <a
            href="https://github.com/SummonIQ/summonflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition group"
          >
            <Github className="h-5 w-5 text-zinc-400 group-hover:text-white transition" />
            <div>
              <div className="text-sm font-semibold text-white">SummonIQ/summonflow</div>
              <div className="text-xs text-zinc-500">Monorepo: server runtime, console, marketing site, and deployment configs.</div>
            </div>
          </a>
          <a
            href="https://github.com/SummonIQ/summonflow/tree/main/packages/summon-flow-client"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition group"
          >
            <Code2 className="h-5 w-5 text-zinc-400 group-hover:text-white transition" />
            <div>
              <div className="text-sm font-semibold text-white">@summoniq/summon-flow</div>
              <div className="text-xs text-zinc-500">Client SDK: channels, presence, encryption, reconnection. TypeScript, works in browser & Node.</div>
            </div>
          </a>
        </div>
      </section>

      <section className="mt-12 p-8 rounded-2xl border border-teal-500/20 bg-teal-500/5">
        <h2 className="text-xl font-bold text-white mb-4">Ready to start?</h2>
        <p className="text-zinc-400 mb-6 text-sm">
          Get SummonFlow running in under 5 minutes &mdash; self-hosted or managed.
        </p>
        <Link
          href="/docs/quickstart"
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-teal-400 transition-colors"
        >
          Follow the Quickstart
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
