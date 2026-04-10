import { ArrowRight, Terminal, Globe, Shield, Code2 } from "lucide-react";

export default function QuickstartDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Quickstart</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Get your first SummonStream app running in minutes.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">1. Deploy the Socket Server</h2>
        <p className="text-zinc-400">
          We recommend starting with **Railway**. It provides the persistent infrastructure needed for long-lived WebSocket connections.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="flex items-center gap-2 mb-4 text-zinc-500">
            <Terminal className="h-4 w-4" />
            Terminal
          </div>
          <div className="text-zinc-300"># Deploy the server using our Railway template</div>
          <div className="text-teal-400">railway run --template summoniq/summon-stream-server</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">2. Install the Client SDK</h2>
        <p className="text-zinc-400">Add the SummonStream client to your frontend project.</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="text-teal-400">bun add @summoniq/summon-stream</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">3. Initialize the Client</h2>
        <p className="text-zinc-400">Use your server's host and the default app key to connect.</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-500 italic">// Initialize client</div>
          <div className="text-blue-400">import <span className="text-zinc-300">{"{ SummonStream }"}</span> from <span className="text-teal-400">'@summoniq/summon-stream'</span>;</div>
          <br/>
          <div className="text-zinc-300">const <span className="text-blue-400">realtime</span> = new <span className="text-blue-400">SummonStream</span>(<span className="text-teal-400">'your-app-key'</span>, {"{"}</div>
          <div className="px-4 text-zinc-300 text-teal-400">wsHost: <span className="text-teal-400">'your-server.railway.app'</span>,</div>
          <div className="px-4 text-zinc-300">forceTLS: <span className="text-blue-400">true</span></div>
          <div className="text-zinc-300">{"});"}</div>
          <br/>
          <div className="text-zinc-500 italic">// Subscribe to a channel</div>
          <div className="text-zinc-300">const <span className="text-blue-400">channel</span> = <span className="text-blue-400">realtime</span>.<span className="text-teal-400">subscribe</span>(<span className="text-teal-400">'public-status-board'</span>);</div>
          <div className="text-zinc-300"><span className="text-blue-400">channel</span>.<span className="text-teal-400">bind</span>(<span className="text-teal-400">'new-event'</span>, (<span className="text-blue-400">data</span>) ={">"} console.<span className="text-teal-400">log</span>(<span className="text-blue-400">data</span>));</div>
        </div>
      </section>

      <section className="mt-12 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30">
        <h3 className="text-xl font-bold text-white mb-4 italic">What's Next?</h3>
        <p className="text-zinc-400 mb-6 text-sm">
          Now that you have basic connectivity, set up **Subscription Signing** to secure your private channels.
        </p>
        <div className="flex gap-4">
          <Link href="/docs/authentication" className="text-teal-500 font-bold text-sm uppercase tracking-widest hover:underline">
            Go to Authentication →
          </Link>
        </div>
      </section>
    </article>
  );
}
