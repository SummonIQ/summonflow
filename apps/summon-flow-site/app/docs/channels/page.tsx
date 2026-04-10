import { Activity, Users, Lock, Radio, ShieldCheck } from "lucide-react";

export default function ChannelsDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Channels & Presence</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Understand the different channel types and how to use presence to track users.
        </p>
      </header>

      <section className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <Radio className="h-6 w-6 text-teal-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">Public Channels</h3>
            <p className="mt-2 text-sm text-zinc-400">Open to anyone. Ideal for global notifications or status boards. No signing required.</p>
            <div className="mt-4 font-mono text-[10px] text-zinc-500 italic">name: "any-string"</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <ShieldCheck className="h-6 w-6 text-indigo-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">Private Channels</h3>
            <p className="mt-2 text-sm text-zinc-400">Requires a signed subscription from your backend. Secure for 1-to-1 data.</p>
            <div className="mt-4 font-mono text-[10px] text-zinc-500 italic">name: "private-channel-name"</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <Users className="h-6 w-6 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">Presence Channels</h3>
            <p className="mt-2 text-sm text-zinc-400">Private channels that also track a roster of active members. Perfect for collab tools.</p>
            <div className="mt-4 font-mono text-[10px] text-zinc-500 italic">name: "presence-channel-name"</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <Lock className="h-6 w-6 text-pink-500 mb-4" />
            <h3 className="text-lg font-semibold text-white">Encrypted Channels</h3>
            <p className="mt-2 text-sm text-zinc-400">End-to-end encrypted private channels. Payload is decrypted only at the edge client.</p>
            <div className="mt-4 font-mono text-[10px] text-zinc-500 italic">name: "private-encrypted-channel-name"</div>
          </div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Presence Events</h2>
        <p className="text-zinc-400">When using a presence channel, you can listen for member lifecycle events.</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">const <span className="text-blue-400">channel</span> = <span className="text-blue-400">realtime</span>.<span className="text-teal-400">subscribe</span>(<span className="text-teal-400">'presence-project-123'</span>);</div>
          <br/>
          <div className="text-zinc-500 italic">// Successful subscription</div>
          <div className="text-zinc-300"><span className="text-blue-400">channel</span>.<span className="text-teal-400">bind</span>(<span className="text-teal-400">'summon:subscription_succeeded'</span>, (<span className="text-blue-400">members</span>) ={">"} {"{"}</div>
          <div className="px-4 text-zinc-300">console.<span className="text-teal-400">log</span>(<span className="text-teal-400">'Active members:'</span>, <span className="text-blue-400">members</span>.<span className="text-teal-400">count</span>);</div>
          <div className="text-zinc-300">{"});"}</div>
          <br/>
          <div className="text-zinc-500 italic">// Member joins</div>
          <div className="text-zinc-300"><span className="text-blue-400">channel</span>.<span className="text-teal-400">bind</span>(<span className="text-teal-400">'summon:member_added'</span>, (<span className="text-blue-400">member</span>) ={">"} {"{"}</div>
          <div className="px-4 text-zinc-300">console.<span className="text-teal-400">log</span>(<span className="text-blue-400">member</span>.<span className="text-blue-400">info</span>.name + <span className="text-teal-400">' joined'</span>);</div>
          <div className="text-zinc-300">{"});"}</div>
        </div>
      </section>
    </article>
  );
}
