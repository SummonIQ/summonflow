import { Globe, Server, Cloud, Lock, ArrowRight } from "lucide-react";

export default function ArchitectureDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">Architecture</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          How the pieces fit together — from client to socket server to control plane.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">System Overview</h2>
        <p className="text-zinc-400">
          SummonFlow is split into three layers that communicate over standard HTTP and WebSocket protocols.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Globe, title: "Client SDK", desc: "Runs in the browser or Node.js. Manages WebSocket connections, channel subscriptions, presence, and encrypted payloads." },
            { icon: Server, title: "Socket Server", desc: "Persistent process that handles WebSocket connections, message routing, and channel state. Deployed on Railway, Cloudflare, or your own infra." },
            { icon: Cloud, title: "Control Plane", desc: "The console app. Manages apps, keys, channel policies, webhooks, and billing. Hosted on Vercel." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
              <item.icon className="h-6 w-6 text-teal-500 mb-4" />
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Connection Flow</h2>
        <ol className="list-decimal pl-6 space-y-4 text-zinc-400">
          <li>Client initializes <code className="text-teal-400">SummonFlow</code> with an app key.</li>
          <li>WebSocket connection opens to the socket server.</li>
          <li>Server assigns a <code className="text-teal-400">socketId</code> and sends a connection event.</li>
          <li>Client subscribes to channels. Public channels connect immediately.</li>
          <li>Private/presence channels trigger an auth request to your backend, which signs the subscription.</li>
          <li>Server validates the signature and grants access to the channel.</li>
        </ol>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Publish Flow</h2>
        <p className="text-zinc-400">
          Server-side publishing is done via HTTP. Your backend sends a POST to the socket server with a publish token. The server broadcasts the event to all subscribers on the specified channel.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-500 italic">// Your backend publishes an event</div>
          <div className="text-zinc-300">POST /apps/:key/events</div>
          <div className="text-zinc-300">Authorization: Bearer {"<publish_token>"}</div>
          <div className="text-zinc-300">{"{ channel, event, data }"}</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Scaling</h2>
        <p className="text-zinc-400">
          For horizontal scaling, connect multiple socket server instances to a shared Redis instance. The Redis adapter handles message fanout so all connected clients receive events regardless of which server they&apos;re connected to.
        </p>
      </section>
    </article>
  );
}
