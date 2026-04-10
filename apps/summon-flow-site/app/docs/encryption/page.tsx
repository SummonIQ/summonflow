import { Lock, Shield, Key } from "lucide-react";

export default function EncryptionDoc() {
  return (
    <article className="prose prose-invert max-w-none">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-heading)]">End-to-end Encryption</h1>
        <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
          Private encrypted channels keep payload access inside the clients that should actually see it.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">How It Works</h2>
        <p className="text-zinc-400">
          Encrypted channels use the <code className="text-teal-400">private-encrypted-</code> prefix. When a client subscribes, your auth endpoint returns a <code className="text-teal-400">sharedSecret</code> in addition to the subscription token. This secret is used for AES-256-GCM encryption on the client side.
        </p>
        <p className="text-zinc-400">
          The socket server never sees plaintext payloads. It relays the encrypted envelope between clients. Only clients with the shared secret can decrypt the data.
        </p>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Auth Response</h2>
        <p className="text-zinc-400">Your auth endpoint must return the shared secret for encrypted channels:</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">{"{"}</div>
          <div className="px-4 text-zinc-300">&quot;token&quot;: <span className="text-teal-400">&quot;app-key:signature&quot;</span>,</div>
          <div className="px-4 text-zinc-300">&quot;sharedSecret&quot;: <span className="text-teal-400">&quot;base64-encoded-channel-secret&quot;</span></div>
          <div className="text-zinc-300">{"}"}</div>
        </div>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Encrypted Payload Format</h2>
        <p className="text-zinc-400">Events on encrypted channels are transmitted as an AES-GCM envelope:</p>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 font-mono text-[11px] leading-relaxed">
          <div className="text-zinc-300">{"{"}</div>
          <div className="px-4 text-zinc-300">&quot;ciphertext&quot;: <span className="text-teal-400">&quot;&lt;base64&gt;&quot;</span>,</div>
          <div className="px-4 text-zinc-300">&quot;nonce&quot;: <span className="text-teal-400">&quot;&lt;base64&gt;&quot;</span></div>
          <div className="text-zinc-300">{"}"}</div>
        </div>
        <p className="text-zinc-400">
          Encryption and decryption happen entirely on the client using the Web Crypto API. The nonce is unique per message.
        </p>
      </section>

      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-2">Key Management</h2>
        <p className="text-zinc-400">
          Shared secrets are per-channel and derived by your auth backend. You control the key generation and distribution. The SummonFlow server and platform never have access to the plaintext secret or payload.
        </p>
      </section>
    </article>
  );
}
