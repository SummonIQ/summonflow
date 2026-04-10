import { Code2, Terminal } from "lucide-react";

export default function ClientSdkDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Client SDK API</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Reference for the <code className="text-teal-400">@summoniq/summon-flow</code> client library.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Installation</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="text-teal-400">bun add @summoniq/summon-flow</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Constructor</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">new <span className="text-blue-400">SummonFlow</span>(<span className="text-teal-400">appKey</span>: string, <span className="text-teal-400">options</span>?: ConnectionOptions)</div>
        </div>
        <h3 className="text-lg font-semibold text-white mt-6">Options</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="pb-2 pr-4">Option</th><th className="pb-2 pr-4">Type</th><th className="pb-2 pr-4">Default</th><th className="pb-2">Description</th>
            </tr></thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs text-teal-400">wsHost</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">realtime.summonflow.com</td><td className="py-2">WebSocket server hostname</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs text-teal-400">wsPort</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">443</td><td className="py-2">WebSocket port</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs text-teal-400">forceTLS</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Force TLS connection</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs text-teal-400">channelAuthorization</td><td className="py-2 pr-4">object</td><td className="py-2 pr-4">—</td><td className="py-2">Auth endpoint config</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs text-teal-400">authorizer</td><td className="py-2 pr-4">function</td><td className="py-2 pr-4">—</td><td className="py-2">Custom auth function</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs text-teal-400">activityTimeout</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">120</td><td className="py-2">Seconds before ping</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Methods</h2>
        <div className="space-y-6">
          {[
            { name: "subscribe(name)", desc: "Subscribe to a channel. Returns the Channel instance." },
            { name: "unsubscribe(name)", desc: "Unsubscribe from a channel." },
            { name: "channel(name)", desc: "Get an existing channel by name. Returns undefined if not subscribed." },
            { name: "allChannels()", desc: "Returns an object of all subscribed channels." },
            { name: "connect()", desc: "Manually open the WebSocket connection." },
            { name: "disconnect()", desc: "Close the WebSocket connection." },
          ].map((m) => (
            <div key={m.name} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <code className="text-sm text-teal-400">{m.name}</code>
              <p className="mt-1 text-sm text-zinc-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Channel Methods</h2>
        <div className="space-y-6">
          {[
            { name: "bind(event, handler)", desc: "Listen for an event on this channel." },
            { name: "unbind(event, handler?)", desc: "Remove an event listener." },
            { name: "trigger(event, data)", desc: "Send a client event (private/presence channels only)." },
          ].map((m) => (
            <div key={m.name} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <code className="text-sm text-teal-400">{m.name}</code>
              <p className="mt-1 text-sm text-zinc-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Connection Events</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">stream.connection.<span className="text-teal-400">bind</span>(<span className="text-teal-400">&apos;connected&apos;</span>, () =&gt; {"{"}</div>
          <div className="px-4 text-zinc-300">console.log(stream.connection.socketId);</div>
          <div className="text-zinc-300">{"});"}</div>
        </div>
        <p className="text-zinc-400">States: <code className="text-zinc-300">initialized</code>, <code className="text-zinc-300">connecting</code>, <code className="text-zinc-300">connected</code>, <code className="text-zinc-300">unavailable</code>, <code className="text-zinc-300">failed</code>, <code className="text-zinc-300">disconnected</code>.</p>
      </section>

      <section className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <p className="text-sm text-zinc-400">
          Full source: <a href="https://github.com/SummonIQ/summon-flow/tree/main/packages/summon-flow-client" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">github.com/SummonIQ/summon-flow/packages/summon-flow-client</a>
        </p>
      </section>
    </article>
  );
}
