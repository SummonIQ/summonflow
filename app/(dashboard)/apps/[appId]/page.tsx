"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Trash2, Loader2, Plus, Code2, Shield, ChevronRight, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { clientSnippet, serverSnippet, publishSnippet } from "@/lib/snippets";
import { useFullBleedPage } from "@/components/app-shell";
import { useProductAnalytics } from "@/lib/analytics/client";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50";

interface Policy {
  id: string;
  appId: string | null;
  name: string | null;
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
  usage: {
    connections: number;
    peakConnections: number;
    messagesPublished: number;
    messagesDelivered: number;
  };
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function AppDetailPage() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const { trackProductEvent } = useProductAnalytics();
  const [app, setApp] = useState<App | null>(null);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<"client" | "server" | "publish">("client");
  const [activeTab, setActiveTab] = useState<string>("Overview");

  useFullBleedPage();

  // Policy form
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyPattern, setPolicyPattern] = useState("");
  const [policyType, setPolicyType] = useState<string>("PUBLIC");
  const [policyScope, setPolicyScope] = useState<"global" | "app">("app");
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

  async function fetchPolicies() {
    const res = await fetch(`/api/policies?appId=${params.appId}&scope=effective`);
    if (res.ok) setPolicies(await res.json());
  }

  useEffect(() => {
    Promise.all([fetchApp(), fetchWebhooks(), fetchPolicies()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (activeTab === "Overview" || activeTab === "Setup") {
      setActiveTab(policies.length > 0 ? "Overview" : "Setup");
    }
  }, [loading, policies.length]);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    trackProductEvent("application_credential_copied", {
      appId: params.appId,
      credential: id,
      activeTab,
    });
    setTimeout(() => setCopied(null), 1500);
  }

  async function handleDeleteApp() {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    const res = await fetch(`/api/apps/${params.appId}`, { method: "DELETE" });
    if (res.ok) {
      trackProductEvent("application_deleted", { appId: params.appId, appName: app?.name, source: "app_detail" });
      router.push("/apps");
    } else {
      const body = await res.json().catch(() => null);
      trackProductEvent("application_delete_failed", { appId: params.appId, appName: app?.name, reason: body?.error ?? "request_failed" });
    }
  }

  async function handleCreatePolicy(e: React.FormEvent) {
    e.preventDefault();
    if (!policyPattern.trim()) return;
    setCreatingPolicy(true);
    const res = await fetch(`/api/policies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pattern: policyPattern.trim(),
        type: policyType,
        appId: policyScope === "app" ? params.appId : null,
      }),
    });
    if (res.ok) {
      trackProductEvent("policy_created", {
        appId: params.appId,
        source: "app_detail",
        scope: policyScope,
        type: policyType,
        pattern: policyPattern.trim(),
      });
      setPolicyPattern("");
      setShowPolicyForm(false);
      await Promise.all([fetchApp(), fetchPolicies()]);
    } else {
      const body = await res.json().catch(() => null);
      trackProductEvent("policy_create_failed", {
        appId: params.appId,
        source: "app_detail",
        scope: policyScope,
        type: policyType,
        reason: body?.error ?? "request_failed",
      });
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
      trackProductEvent("webhook_created", {
        appId: params.appId,
        eventCount: webhookEvents_.length,
      });
      setWebhookUrl("");
      setWebhookEvents_([]);
      setShowWebhookForm(false);
      await fetchWebhooks();
    } else {
      const body = await res.json().catch(() => null);
      trackProductEvent("webhook_create_failed", {
        appId: params.appId,
        reason: body?.error ?? "request_failed",
      });
    }
    setCreatingWebhook(false);
  }

  async function handleDeleteWebhook(id: string) {
    const res = await fetch(`/api/apps/${params.appId}/webhooks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      trackProductEvent("webhook_deleted", { appId: params.appId, webhookId: id });
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
    } else {
      const body = await res.json().catch(() => null);
      trackProductEvent("webhook_delete_failed", { appId: params.appId, webhookId: id, reason: body?.error ?? "request_failed" });
    }
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

  const isSetup = policies.length > 0;
  const overviewLabel = isSetup ? "Overview" : "Setup";
  const tabs = [overviewLabel, "Policies", "Webhooks", "Keys", "Settings"] as const;

  return (
    <main>
      <div className="mx-auto max-w-7xl px-8 pt-8 pb-6">
        <div className="flex items-start gap-3">
          <Link
            href="/apps"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-[var(--foreground)]"
            aria-label="Back to applications"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold leading-7 tracking-tight text-[var(--foreground)]">{app.name}</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Created {new Date(app.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl gap-1 px-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                trackProductEvent("application_detail_tab_clicked", {
                  appId: params.appId,
                  tab: t,
                  previousTab: activeTab,
                });
              }}
              className={`relative px-4 py-2 text-sm font-medium transition ${
                activeTab === t
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t}
              {activeTab === t && (
                <motion.div
                  layoutId="app-detail-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--accent)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-6 space-y-6">
      {activeTab === overviewLabel && (
        <div className="space-y-6">
          {!isSetup ? (
            <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Code2 className="h-5 w-5 text-teal-500" />
                <h2 className="text-base font-semibold text-white">Code Snippets</h2>
              </div>
              <div className="flex gap-1 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-1 w-fit">
                {(["client", "server", "publish"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveSnippet(t);
                      trackProductEvent("application_snippet_tab_clicked", {
                        appId: params.appId,
                        snippet: t,
                        previousSnippet: activeSnippet,
                      });
                    }}
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
          ) : (
            <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-white">Usage</h2>
                <p className="mt-1 text-xs text-zinc-500">Last 30 days</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <UsageTile label="Connections" value={formatNumber(app.usage.connections)} />
                <UsageTile label="Peak concurrent" value={formatNumber(app.usage.peakConnections)} />
                <UsageTile label="Published" value={formatNumber(app.usage.messagesPublished)} />
                <UsageTile label="Delivered" value={formatNumber(app.usage.messagesDelivered)} />
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === "Policies" && (
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-teal-500" />
              <h2 className="text-base font-semibold text-white">Policies</h2>
            </div>
            <button onClick={() => {
              setShowPolicyForm(true);
              trackProductEvent("policy_create_panel_opened", { appId: params.appId, source: "app_detail" });
            }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-500 hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {showPolicyForm && (
            <form onSubmit={handleCreatePolicy} className="space-y-3">
              <div className="flex gap-1 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-1 w-fit">
                {([
                  { value: "app", label: "This app only" },
                  { value: "global", label: "All applications" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPolicyScope(opt.value);
                      trackProductEvent("policy_create_scope_changed", {
                        appId: params.appId,
                        source: "app_detail",
                        scope: opt.value,
                      });
                    }}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      policyScope === opt.value ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input value={policyPattern} onChange={(e) => setPolicyPattern(e.target.value)} placeholder="e.g. private-*" className={`${inputClass} flex-1`} />
                <select value={policyType} onChange={(e) => setPolicyType(e.target.value)} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-3 text-sm text-white outline-none">
                  {channelTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button type="submit" disabled={creatingPolicy} className="button-default rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-50">
                  {creatingPolicy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                </button>
                <button type="button" onClick={() => {
                  setShowPolicyForm(false);
                  trackProductEvent("policy_create_panel_closed", { appId: params.appId, source: "app_detail" });
                }} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
              </div>
            </form>
          )}

          {policies.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4">No policies apply to this app.</p>
          ) : (
            <div className="space-y-2">
              {policies.map((p) => {
                const isGlobal = p.appId === null;
                return (
                  <Link
                    key={p.id}
                    href={`/policies/${p.id}`}
                    onClick={() => trackProductEvent("policy_opened", {
                      appId: params.appId,
                      policyId: p.id,
                      type: p.type,
                      scope: isGlobal ? "global" : "app",
                      source: "app_detail",
                    })}
                    className="group flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 transition hover:border-zinc-700 hover:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-3">
                      {isGlobal ? (
                        <Globe className="h-3.5 w-3.5 text-zinc-500" aria-label="Global policy" />
                      ) : (
                        <Shield className="h-3.5 w-3.5 text-zinc-500" aria-label="App-specific policy" />
                      )}
                      <code className="text-xs text-zinc-300">{p.pattern}</code>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${typeColors[p.type] ?? "text-zinc-400 bg-zinc-800"}`}>{p.type}</span>
                      {isGlobal ? (
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">Global</span>
                      ) : null}
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-700 transition group-hover:text-teal-500" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === "Webhooks" && (
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Webhooks</h2>
            <button onClick={() => {
              setShowWebhookForm(true);
              trackProductEvent("webhook_create_panel_opened", { appId: params.appId });
            }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-500 hover:underline">
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
                      onChange={(e) => {
                        setWebhookEvents_(e.target.checked ? [...webhookEvents_, ev] : webhookEvents_.filter((x) => x !== ev));
                        trackProductEvent("webhook_event_toggled", {
                          appId: params.appId,
                          event: ev,
                          enabled: e.target.checked,
                        });
                      }}
                      className="rounded border-zinc-700"
                    />
                    {ev}
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creatingWebhook || !webhookUrl.trim() || webhookEvents_.length === 0} className="button-default rounded-lg px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50">
                  {creatingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </button>
                <button type="button" onClick={() => {
                  setShowWebhookForm(false);
                  trackProductEvent("webhook_create_panel_closed", { appId: params.appId });
                }} className="text-sm text-zinc-500 hover:text-white">Cancel</button>
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
      )}

      {activeTab === "Keys" && (
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Credentials</h2>
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
      )}

      {activeTab === "Settings" && (
        <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Danger zone</h2>
          <p className="text-xs text-zinc-500">Deleting this application is permanent and cannot be undone.</p>
          <button
            onClick={handleDeleteApp}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/5"
          >
            <Trash2 className="h-4 w-4" /> Delete App
          </button>
        </section>
      )}
      </div>
    </main>
  );
}

function UsageTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
