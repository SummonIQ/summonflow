import { Zap } from "lucide-react";

export default function CloudflareDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Cloudflare Deployment</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Run SummonFlow on the edge with Cloudflare Workers and Durable Objects.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Why Cloudflare</h2>
        <p className="text-zinc-400">
          Cloudflare Workers with Durable Objects provide globally distributed WebSocket handling. Each Durable Object maintains state for a set of channels, giving you edge-native routing without managing servers.
        </p>
        <p className="text-zinc-400">
          This is the best option if you need connections handled as close to your users as possible with minimal latency.
        </p>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Architecture</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <Zap className="h-6 w-6 text-teal-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">Worker</h3>
            <p className="mt-2 text-sm text-zinc-400">Handles incoming WebSocket upgrades, routes connections to the correct Durable Object based on app key.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <Zap className="h-6 w-6 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">Durable Object</h3>
            <p className="mt-2 text-sm text-zinc-400">Manages channel state, subscriber lists, and message broadcasting for a set of channels. State persists across requests.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Configuration</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-500 italic"># wrangler.toml</div>
          <div className="text-zinc-300">name = <span className="text-teal-400">&quot;summon-flow&quot;</span></div>
          <div className="text-zinc-300">main = <span className="text-teal-400">&quot;src/index.ts&quot;</span></div>
          <br/>
          <div className="text-zinc-300">[[durable_objects.bindings]]</div>
          <div className="text-zinc-300">name = <span className="text-teal-400">&quot;CHANNEL_MANAGER&quot;</span></div>
          <div className="text-zinc-300">class_name = <span className="text-teal-400">&quot;ChannelManager&quot;</span></div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Trade-offs</h2>
        <ul className="list-disc pl-6 space-y-3 text-zinc-400">
          <li>Lower latency for globally distributed users.</li>
          <li>No Redis needed for fanout — Durable Objects handle state.</li>
          <li>More complex deployment than Railway.</li>
          <li>Durable Object limits apply (128 MB memory, 30s CPU per request).</li>
        </ul>
      </section>
    </article>
  );
}
