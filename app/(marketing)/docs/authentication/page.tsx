import { Shield, Lock, Key, Users, Code2 } from "lucide-react";

export default function AuthenticationDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Authentication</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Secure your private and presence channels using signed subscriptions.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">The Auth Flow</h2>
        <p className="text-zinc-400">
          SummonFlow uses a **stateless auth flow**. When a client attempts to subscribe to a `private-` or `presence-` channel, it must provide a signature from your backend.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 text-xs font-mono">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-teal-500/10 p-3 text-teal-500"><Code2 className="h-6 w-6"/></div>
              <span>Client SDK</span>
            </div>
            <div className="h-px w-20 bg-zinc-800 relative">
              <div className="absolute right-0 -top-1">→</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-500"><Shield className="h-6 w-6"/></div>
              <span>Your Auth API</span>
            </div>
            <div className="h-px w-20 bg-zinc-800 relative">
              <div className="absolute right-0 -top-1">→</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg bg-zinc-800 p-3 text-zinc-400"><Lock className="h-6 w-6"/></div>
              <span>Socket Server</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Vercel Auth Route</h2>
        <p className="text-zinc-400">If you're using Next.js on Vercel, use our stateless signing helper.</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-500 italic">// app/api/realtime/auth/route.ts</div>
          <div className="text-blue-400">import <span className="text-zinc-300">{"{ signSubscription }"}</span> from <span className="text-teal-400">'@summoniq/summon-flow-server'</span>;</div>
          <br/>
          <div className="text-zinc-300">export async function <span className="text-blue-400">POST</span>(<span className="text-blue-400">req</span>: Request) {"{"}</div>
          <div className="px-4 text-zinc-300">const <span className="text-blue-400">session</span> = await <span className="text-teal-400">getSession</span>(<span className="text-blue-400">req</span>);</div>
          <div className="px-4 text-zinc-300">if (!<span className="text-blue-400">session</span>) return new <span className="text-blue-400">Response</span>(<span className="text-teal-400">'Unauthorized'</span>, {"{"} status: <span className="text-teal-400">401</span> {"}"});</div>
          <br/>
          <div className="px-4 text-zinc-300">const <span className="text-blue-400">body</span> = await <span className="text-blue-400">req</span>.<span className="text-teal-400">json</span>();</div>
          <div className="px-4 text-zinc-300">const <span className="text-blue-400">signature</span> = <span className="text-teal-400">signSubscription</span>({"{"}</div>
          <div className="px-8 text-zinc-300">socketId: <span className="text-blue-400">body</span>.socketId,</div>
          <div className="px-8 text-zinc-300">channel: <span className="text-blue-400">body</span>.channelName,</div>
          <div className="px-8 text-zinc-300">secret: process.env.<span className="text-teal-400">SUMMON_STREAM_AUTH_SECRET</span>,</div>
          <div className="px-8 text-zinc-300">userData: {"{"} id: <span className="text-blue-400">session</span>.user.id {"}"}</div>
          <div className="px-4 text-zinc-300">{"});"}</div>
          <br/>
          <div className="px-4 text-zinc-300">return <span className="text-blue-400">Response</span>.<span className="text-teal-400">json</span>(<span className="text-blue-400">signature</span>);</div>
          <div className="text-zinc-300">{"}"}</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Client Configuration</h2>
        <p className="text-zinc-400">Tell the client where your auth route is located.</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">const <span className="text-blue-400">realtime</span> = new <span className="text-blue-400">SummonFlow</span>(<span className="text-teal-400">'your-app-key'</span>, {"{"}</div>
          <div className="px-4 text-teal-400">authEndpoint: <span className="text-teal-400">'/api/realtime/auth'</span>,</div>
          <div className="px-4 text-zinc-300">wsHost: <span className="text-teal-400">'your-server.railway.app'</span>,</div>
          <div className="text-zinc-300">{"});"}</div>
        </div>
      </section>
    </article>
  );
}
