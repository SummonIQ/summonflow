import { Terminal } from "lucide-react";
import Link from "next/link";

export default function RailwayDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Railway Deployment</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Deploy the SummonFlow socket server on Railway for persistent WebSocket connections.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Why Railway</h2>
        <p className="text-zinc-400">
          Railway provides always-on compute with persistent processes — exactly what WebSocket servers need. Unlike serverless platforms, Railway keeps your process running so connections stay alive.
        </p>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Quick Deploy</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="flex items-center gap-2 mb-4 text-zinc-500">
            <Terminal className="h-4 w-4" />
            Terminal
          </div>
          <div className="text-zinc-500 italic"># Clone and deploy</div>
          <div className="text-teal-400">git clone https://github.com/SummonIQ/summonflow.git</div>
          <div className="text-teal-400">cd summon-flow</div>
          <div className="text-teal-400">railway up</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Environment Variables</h2>
        <p className="text-zinc-400">Set the following in your Railway service:</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs space-y-1">
          <div className="text-zinc-300">SUMMON_STREAM_APP_KEY=<span className="text-teal-400">your-app-key</span></div>
          <div className="text-zinc-300">SUMMON_STREAM_APP_SECRET=<span className="text-teal-400">your-app-secret</span></div>
          <div className="text-zinc-300">REDIS_URL=<span className="text-teal-400">redis://...</span> <span className="text-zinc-500"># optional, for horizontal scaling</span></div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Or Use Managed</h2>
        <p className="text-zinc-400">
          Don&apos;t want to manage Railway yourself? The <Link href="https://console.summonflow.com" className="text-teal-500 hover:underline">managed platform</Link> handles all of this for you — just create an app in the console and start connecting.
        </p>
      </section>
    </article>
  );
}
