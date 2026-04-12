import { Terminal } from "lucide-react";

export default function VercelDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Vercel Integration</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Use Vercel for auth routes, publish endpoints, and the control plane.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Auth Route</h2>
        <p className="text-zinc-400">
          When a client subscribes to a private or presence channel, it sends a request to your auth endpoint. In a Next.js app on Vercel, this is a standard API route.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-500 italic">// app/api/realtime/auth/route.ts</div>
          <div className="text-blue-400">import <span className="text-zinc-300">{"{ signSubscription }"}</span> from <span className="text-teal-400">&apos;summon-flow-server-vercel&apos;</span>;</div>
          <br/>
          <div className="text-zinc-300">export async function <span className="text-blue-400">POST</span>(req: Request) {"{"}</div>
          <div className="px-4 text-zinc-300">const session = await getSession(req);</div>
          <div className="px-4 text-zinc-300">if (!session) return new Response(&apos;Unauthorized&apos;, {"{"} status: 401 {"}"});</div>
          <br/>
          <div className="px-4 text-zinc-300">const body = await req.json();</div>
          <div className="px-4 text-zinc-300">const signature = signSubscription({"{"}</div>
          <div className="px-8 text-zinc-300">socketId: body.socketId,</div>
          <div className="px-8 text-zinc-300">channel: body.channelName,</div>
          <div className="px-8 text-zinc-300">secret: process.env.SUMMON_STREAM_APP_SECRET!,</div>
          <div className="px-4 text-zinc-300">{"});"}</div>
          <br/>
          <div className="px-4 text-zinc-300">return Response.json(signature);</div>
          <div className="text-zinc-300">{"}"}</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Publish Endpoint</h2>
        <p className="text-zinc-400">
          To publish events from your Vercel backend, send a POST request to the socket server&apos;s publish endpoint with your publish token.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">await fetch(&apos;https://realtime.summonflow.com/apps/YOUR_KEY/events&apos;, {"{"}</div>
          <div className="px-4 text-zinc-300">method: &apos;POST&apos;,</div>
          <div className="px-4 text-zinc-300">headers: {"{"} Authorization: `Bearer ${"{"}<span className="text-teal-400">token</span>{"}"}` {"}"},</div>
          <div className="px-4 text-zinc-300">body: JSON.stringify({"{"} channel, event, data {"}"}),</div>
          <div className="text-zinc-300">{"});"}</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Environment Variables</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-xs space-y-1">
          <div className="text-zinc-300">SUMMON_STREAM_APP_KEY=<span className="text-teal-400">your-app-key</span></div>
          <div className="text-zinc-300">SUMMON_STREAM_APP_SECRET=<span className="text-teal-400">your-app-secret</span></div>
          <div className="text-zinc-300">SUMMON_STREAM_PUBLISH_TOKEN=<span className="text-teal-400">your-publish-token</span></div>
        </div>
      </section>
    </article>
  );
}
