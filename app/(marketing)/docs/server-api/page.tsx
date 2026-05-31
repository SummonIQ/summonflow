import { Terminal } from "lucide-react";

export default function ServerApiDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Server-side API</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          HTTP API for publishing events, querying channels, and managing connections from your backend.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Base URL</h2>
        <p className="text-zinc-400">
          Managed platform: <code className="text-teal-400">https://realtime.summonflow.com</code>
        </p>
        <p className="text-zinc-400">
          Self-hosted: your socket server URL.
        </p>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Authentication</h2>
        <p className="text-zinc-400">All server API requests require a publish token in the Authorization header:</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs">
          <div className="text-zinc-300">Authorization: Bearer <span className="text-teal-400">{"<publish_token>"}</span></div>
        </div>
      </section>

      <section className="space-y-8 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Endpoints</h2>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Publish Event</h3>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
            <div className="text-blue-400">POST <span className="text-zinc-300">/apps/:key/events</span></div>
            <br/>
            <div className="text-zinc-500 italic">// Body</div>
            <div className="text-zinc-300">{"{"}</div>
            <div className="px-4 text-zinc-300">&quot;channel&quot;: <span className="text-teal-400">&quot;public-notifications&quot;</span>,</div>
            <div className="px-4 text-zinc-300">&quot;event&quot;: <span className="text-teal-400">&quot;new-alert&quot;</span>,</div>
            <div className="px-4 text-zinc-300">&quot;data&quot;: {"{"} ... {"}"},</div>
            <div className="px-4 text-zinc-300">&quot;socketId&quot;: <span className="text-teal-400">&quot;optional-exclude-sender&quot;</span></div>
            <div className="text-zinc-300">{"}"}</div>
          </div>
          <p className="text-sm text-zinc-400">Broadcasts the event to all subscribers on the channel. Pass <code className="text-zinc-300">socketId</code> to exclude the sender.</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">List Channels</h3>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
            <div className="text-blue-400">GET <span className="text-zinc-300">/apps/:key/channels</span></div>
            <br/>
            <div className="text-zinc-500 italic">// Response</div>
            <div className="text-zinc-300">{"{"}</div>
            <div className="px-4 text-zinc-300">&quot;channels&quot;: [</div>
            <div className="px-8 text-zinc-300">{"{"} &quot;name&quot;: &quot;public-lobby&quot;, &quot;subscription_count&quot;: 42, &quot;occupied&quot;: true {"}"},</div>
            <div className="px-4 text-zinc-300">]</div>
            <div className="text-zinc-300">{"}"}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Channel Info</h3>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
            <div className="text-blue-400">GET <span className="text-zinc-300">/apps/:key/channels/:channelName</span></div>
            <br/>
            <div className="text-zinc-500 italic">// Response</div>
            <div className="text-zinc-300">{"{"}</div>
            <div className="px-4 text-zinc-300">&quot;name&quot;: <span className="text-teal-400">&quot;presence-room-1&quot;</span>,</div>
            <div className="px-4 text-zinc-300">&quot;subscription_count&quot;: 7,</div>
            <div className="px-4 text-zinc-300">&quot;occupied&quot;: true,</div>
            <div className="px-4 text-zinc-300">&quot;user_count&quot;: 7</div>
            <div className="text-zinc-300">{"}"}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Presence Users</h3>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
            <div className="text-blue-400">GET <span className="text-zinc-300">/apps/:key/channels/:channelName/users</span></div>
            <br/>
            <div className="text-zinc-500 italic">// Response</div>
            <div className="text-zinc-300">{"{"}</div>
            <div className="px-4 text-zinc-300">&quot;users&quot;: [</div>
            <div className="px-8 text-zinc-300">{"{"} &quot;id&quot;: &quot;user-1&quot;, &quot;info&quot;: {"{"} &quot;name&quot;: &quot;Alice&quot; {"}"} {"}"},</div>
            <div className="px-4 text-zinc-300">]</div>
            <div className="text-zinc-300">{"}"}</div>
          </div>
          <p className="text-sm text-zinc-400">Only available for presence channels.</p>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Error Responses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="pb-2 pr-4">Status</th><th className="pb-2">Meaning</th>
            </tr></thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs">401</td><td className="py-2">Missing or invalid publish token</td></tr>
              <tr className="border-b border-zinc-800/50"><td className="py-2 pr-4 font-mono text-xs">404</td><td className="py-2">App key not found or channel does not exist</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">400</td><td className="py-2">Invalid request body</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
