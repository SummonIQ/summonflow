import Link from "next/link";
import { ArrowRight, Terminal, Github, Cloud, Code2 } from "lucide-react";

export default function QuickstartDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Quickstart</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Get your first SummonFlow app running in minutes. Choose the path that fits your team.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-6">
          <Github className="h-6 w-6 text-teal-500 mb-3" />
          <h3 className="text-lg font-semibold text-white">Self-Hosted (OSS)</h3>
          <p className="mt-2 text-sm text-zinc-400">Clone the repo, deploy to Railway or your own infra. Full control, zero cost.</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <Cloud className="h-6 w-6 text-amber-500 mb-3" />
          <h3 className="text-lg font-semibold text-white">Managed</h3>
          <p className="mt-2 text-sm text-zinc-400">Sign up at the console. We handle the servers, you build the features.</p>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Option A: Self-Hosted Setup</h2>

        <h3 className="text-lg font-semibold text-white mt-8">1. Clone the monorepo</h3>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="flex items-center gap-2 mb-4 text-zinc-500">
            <Terminal className="h-4 w-4" />
            Terminal
          </div>
          <div className="text-teal-400">git clone https://github.com/SummonIQ/summon-flow.git</div>
          <div className="text-teal-400">cd summon-flow</div>
          <div className="text-teal-400">bun install</div>
        </div>

        <h3 className="text-lg font-semibold text-white mt-8">2. Deploy the Socket Server</h3>
        <p className="text-zinc-400">
          The WebSocket server needs a persistent process. Railway is the recommended option for most teams.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="text-zinc-500 italic"># Deploy via Railway template (one-click)</div>
          <div className="text-teal-400">railway run --template summoniq/summon-flow-server</div>
          <br/>
          <div className="text-zinc-500 italic"># Or run locally for development</div>
          <div className="text-teal-400">bun run dev</div>
        </div>

        <h3 className="text-lg font-semibold text-white mt-8">3. Install the Client SDK</h3>
        <p className="text-zinc-400">Add the SummonFlow client to your frontend project.</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="text-teal-400">bun add @summoniq/summon-flow</div>
          <div className="mt-2 text-zinc-500 italic"># or: npm install @summoniq/summon-flow</div>
        </div>
        <p className="text-zinc-500 text-xs">
          Source: <a href="https://github.com/SummonIQ/summon-flow/tree/main/packages/summon-flow-client" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">packages/summon-flow-client</a>
        </p>

        <h3 className="text-lg font-semibold text-white mt-8">4. Connect from your app</h3>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-500 italic">// Initialize the client</div>
          <div className="text-blue-400">import <span className="text-zinc-300">{"{ SummonFlow }"}</span> from <span className="text-teal-400">&apos;@summoniq/summon-flow&apos;</span>;</div>
          <br/>
          <div className="text-zinc-300">const <span className="text-blue-400">realtime</span> = new <span className="text-blue-400">SummonFlow</span>(<span className="text-teal-400">&apos;your-app-key&apos;</span>, {"{"}</div>
          <div className="px-4 text-zinc-300">wsHost: <span className="text-teal-400">&apos;your-server.railway.app&apos;</span>,</div>
          <div className="px-4 text-zinc-300">forceTLS: <span className="text-blue-400">true</span>,</div>
          <div className="px-4 text-zinc-300">channelAuthorization: {"{"}</div>
          <div className="px-8 text-zinc-300">endpoint: <span className="text-teal-400">&apos;/api/realtime/auth&apos;</span>,</div>
          <div className="px-4 text-zinc-300">{"}"},</div>
          <div className="text-zinc-300">{"});"}</div>
          <br/>
          <div className="text-zinc-500 italic">// Subscribe to a public channel</div>
          <div className="text-zinc-300">const <span className="text-blue-400">channel</span> = <span className="text-blue-400">realtime</span>.<span className="text-teal-400">subscribe</span>(<span className="text-teal-400">&apos;public-status-board&apos;</span>);</div>
          <div className="text-zinc-300"><span className="text-blue-400">channel</span>.<span className="text-teal-400">bind</span>(<span className="text-teal-400">&apos;new-event&apos;</span>, (<span className="text-blue-400">data</span>) ={">"} console.<span className="text-teal-400">log</span>(<span className="text-blue-400">data</span>));</div>
          <br/>
          <div className="text-zinc-500 italic">// Subscribe to a presence channel (requires auth endpoint)</div>
          <div className="text-zinc-300">const <span className="text-blue-400">room</span> = <span className="text-blue-400">realtime</span>.<span className="text-teal-400">subscribe</span>(<span className="text-teal-400">&apos;presence-project-123&apos;</span>);</div>
          <div className="text-zinc-300"><span className="text-blue-400">room</span>.<span className="text-teal-400">bind</span>(<span className="text-teal-400">&apos;summon:member_added&apos;</span>, (<span className="text-blue-400">member</span>) ={">"} {"{"}</div>
          <div className="px-4 text-zinc-300">console.<span className="text-teal-400">log</span>(<span className="text-blue-400">member</span>.<span className="text-blue-400">info</span>.name + <span className="text-teal-400">&apos; joined&apos;</span>);</div>
          <div className="text-zinc-300">{"});"}</div>
        </div>
      </section>

      <section className="space-y-6 mt-16">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Option B: Managed Setup</h2>
        <p className="text-zinc-400">
          If you want to skip server management entirely, the managed service handles everything.
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <ol className="space-y-6 text-sm text-zinc-400">
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-xs font-bold text-teal-500">1</span>
              <div>
                <div className="font-semibold text-white">Create an account</div>
                <div className="mt-1">Sign up at <a href="https://console.summonflow.com" className="text-teal-500 hover:underline">console.summonflow.com</a> &mdash; the Hobby tier is free.</div>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-xs font-bold text-teal-500">2</span>
              <div>
                <div className="font-semibold text-white">Create an app</div>
                <div className="mt-1">The console gives you an app key and configures your auth endpoint, channel policies, and deployment targets.</div>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-xs font-bold text-teal-500">3</span>
              <div>
                <div className="font-semibold text-white">Install the client SDK</div>
                <div className="mt-1">
                  <code className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono text-teal-400">bun add @summoniq/summon-flow</code>
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-xs font-bold text-teal-500">4</span>
              <div>
                <div className="font-semibold text-white">Connect with your app key</div>
                <div className="mt-1">Use the app key from the console. The managed service handles the WebSocket server, Redis, and TLS for you.</div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="mt-12 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30">
        <h3 className="text-xl font-bold text-white mb-4">What&apos;s Next?</h3>
        <p className="text-zinc-400 mb-6 text-sm">
          Now that you have basic connectivity, set up subscription signing to secure your private and presence channels.
        </p>
        <div className="flex flex-wrap gap-6">
          <Link href="/docs/authentication" className="text-teal-500 font-bold text-sm uppercase tracking-widest hover:underline">
            Authentication &rarr;
          </Link>
          <Link href="/docs/channels" className="text-teal-500 font-bold text-sm uppercase tracking-widest hover:underline">
            Channels & Presence &rarr;
          </Link>
          <a href="https://github.com/SummonIQ/summon-flow/tree/main/packages/summon-flow-client#readme" target="_blank" rel="noopener noreferrer" className="text-teal-500 font-bold text-sm uppercase tracking-widest hover:underline">
            Client SDK Reference &rarr;
          </a>
        </div>
      </section>
    </article>
  );
}
