"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Trash2, Loader2, Plus, Code2, Shield } from "lucide-react";
import Link from "next/link";
import { clientSnippet, serverSnippet, publishSnippet } from "@/lib/snippets";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50";

interface Policy {
  id: string;
  pattern: string;
  type: string;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  secret: string;
  createdAt: string;
}

interface App {
  id: string;
  name: string;
  key: string;
  secret: string;
  createdAt: string;
  channelPolicies: Policy[];
}

const channelTypes = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"] as const;
const typeColors: Record<string, string> = {
  PUBLIC: "text-teal-400 bg-teal-500/10",
  PRIVATE: "text-indigo-400 bg-indigo-500/10",
  PRESENCE: "text-amber-400 bg-amber-500/10",
  ENCRYPTED: "text-pink-400 bg-pink-500/10",
};

const webhookEvents = [
  "channel:occupied",
  "channel:vacated",
  "member:added",
  "member:removed",
  "client:event",
];

export default function AppDetailPage() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const [app, setApp] = useState<App | null>(null);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<"client" | "server" | "publish">("client");

  // Policy form
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyPattern, setPolicyPattern] = useState("");
  const [policyType, setPolicyType] = useState<string>("PUBLIC");
  const [creatingPolicy, setCreatingPolicy] = useState(false);

  // Webhook form
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents_, setWebhookEvents_] = useState<string[]>([]);
  const [creatingWebhook, setCreatingWebhook] = useState(false);

  async function fetchApp() {
    const res = await fetch(`/api/apps/${params.appId}`);
    if (!res.ok) { router.push("/apps"); return; }
    setApp(await res.json());
  }

  async function fetchWebhooks() {
    const res = await fetch(`/api/apps/${params.appId}/webhooks`);
    if (res.ok) setWebhooks(await res.json());
  }

  useEffect(() => {
    Promise.all([fetchApp(), fetchWebhooks()]).then(() => setLoading(false));
  }, []);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  async function handleDeleteApp() {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    await fetch(`/api/apps/${params.appId}`, { method: "DELETE" });
    router.push("/apps");
  }

  async function handleCreatePolicy(e: React.FormEvent) {
    e.preventDefault();
    if (!policyPattern.trim()) return;
    setCreatingPolicy(true);
    const res = await fetch(`/api/apps/${params.appId}/policies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pattern: policyPattern.trim(), type: policyType }),
    });
    if (res.ok) {
      setPolicyPattern("");
      setShowPolicyForm(false);
      await fetchApp();
    }
    setCreatingPolicy(false);
  }

  async function handleCreateWebhook(e: React.FormEvent) {
    e.preventDefault();
    if (!webhookUrl.trim() || webhookEvents_.length === 0) return;
    setCreatingWebhook(true);
    const res = await fetch(`/api/apps/${params.appId}/webhooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl.trim(), events: webhookEvents_ }),
    });
    if (res.ok) {
      setWebhookUrl("");
      setWebhookEvents_([]);
      setShowWebhookForm(false);
      await fetchWebhooks();
    }
    setCreatingWebhook(false);
  }

  async function handleDeleteWebhook(id: string) {
    await fetch(`/api/apps/${params.appId}/webhooks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  }

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-zinc-500" /></div>;
  }

  if (!app) return null;

  const snippets = {
    client: clientSnippet(app),
    server: serverSnippet(app),
    publish: publishSnippet(app),
  };

  return (
    <main className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/apps" className="rounded-lg p-2 text-zinc-500 hover:text-white hover:bg-white/5 transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">{app.name}</h1>
          <p className="mt-1 text-xs text-zinc-500">Created {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={handleDeleteApp} className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/5 transition">
          <Trash2 className="h-4 w-4 inline mr-2" />Delete App
        </button>
      </div>

      {/* Credentials */}
      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Credentials</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "App Key", value: app.key, id: "key" },
            { label: "App Secret", value: app.secret, id: "secret" },
          ].map((cred) => (
            <div key={cred.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{cred.label}</span>
                <button onClick={() => copy(cred.value, cred.id)} className="text-zinc-600 hover:text-teal-500 transition">
                  {copied === cred.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="mt-2 font-mono text-xs text-zinc-300 break-all">{cred.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Snippets */}
      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-teal-500" />
          <h2 className="text-lg font-semibold text-white">Code Snippets</h2>
        </div>
        <div className="flex gap-1 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-1 w-fit">
          {(["client", "server", "publish"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveSnippet(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${activeSnippet === t ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {t === "client" ? "Client SDK" : t === "server" ? "Auth Route" : "Publish"}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-x-auto">{snippets[activeSnippet]}</pre>
          <button
            onClick={() => copy(snippets[activeSnippet], `snippet-${activeSnippet}`)}
            className="absolute top-3 right-3 rounded-md bg-zinc-800 p-1.5 text-zinc-500 hover:text-white transition"
          >
            {copied === `snippet-${activeSnippet}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </section>

      {/* Channel Policies */}
      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-teal-500" />
            <h2 className="text-lg font-semibold text-white">Channel Policies</h2>
          </div>
          <button onClick={() => setShowPolicyForm(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-500 hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        {showPolicyForm && (
          <form onSubmit={handleCreatePolicy} className="flex items-center gap-3">
            <input value={policyPattern} onChange={(e) => setPolicyPattern(e.target.value)} placeholder="e.g. private-*" className={`${inputClass} flex-1`} />
            <select value={policyType} onChange={(e) => setPolicyType(e.target.value)} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-3 text-sm text-white outline-none">
              {channelTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="submit" disabled={creatingPolicy} className="rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-50">
              {creatingPolicy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </button>
            <button type="button" onClick={() => setShowPolicyForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
          </form>
        )}

        {app.channelPolicies.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4">No policies defined for this app.</p>
        ) : (
          <div className="space-y-2">
            {app.channelPolicies.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <code className="text-xs text-zinc-300">{p.pattern}</code>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${typeColors[p.type] ?? "text-zinc-400 bg-zinc-800"}`}>{p.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Webhooks */}
      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Webhooks</h2>
          <button onClick={() => setShowWebhookForm(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-500 hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        {showWebhookForm && (
          <form onSubmit={handleCreateWebhook} className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-server.com/webhook" className={inputClass} />
            <div className="flex flex-wrap gap-2">
              {webhookEvents.map((ev) => (
                <label key={ev} className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={webhookEvents_.includes(ev)}
                    onChange={(e) => setWebhookEvents_(e.target.checked ? [...webhookEvents_, ev] : webhookEvents_.filter((x) => x !== ev))}
                    className="rounded border-zinc-700"
                  />
                  {ev}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={creatingWebhook || !webhookUrl.trim() || webhookEvents_.length === 0} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50">
                {creatingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </button>
              <button type="button" onClick={() => setShowWebhookForm(false)} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
            </div>
          </form>
        )}

        {webhooks.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4">No webhooks configured. Add one to receive event notifications.</p>
        ) : (
          <div className="space-y-2">
            {webhooks.map((wh) => (
              <div key={wh.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                <div>
                  <div className="text-sm text-white font-mono">{wh.url}</div>
                  <div className="mt-1 flex gap-1.5">
                    {wh.events.map((ev) => (
                      <span key={ev} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{ev}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleDeleteWebhook(wh.id)} className="rounded-lg p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
