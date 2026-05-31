"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Trash2, Shield, Globe } from "lucide-react";
import { useProductAnalytics } from "@/lib/analytics/client";

const channelTypes = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"] as const;
const typeColors: Record<string, string> = {
  PUBLIC: "text-teal-400 bg-teal-500/10",
  PRIVATE: "text-indigo-400 bg-indigo-500/10",
  PRESENCE: "text-amber-400 bg-amber-500/10",
  ENCRYPTED: "text-pink-400 bg-pink-500/10",
};
const typeDescriptions: Record<string, string> = {
  PUBLIC: "Anyone can subscribe. No auth required.",
  PRIVATE: "Requires server-side auth signing on subscribe.",
  PRESENCE: "Private + tracks connected members with user info.",
  ENCRYPTED: "Private + end-to-end encrypted payloads.",
};

interface AppSummary {
  id: string;
  name: string;
}

interface Policy {
  id: string;
  appId: string | null;
  name: string | null;
  pattern: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  app: AppSummary | null;
}

export default function PolicyDetailPage() {
  const params = useParams<{ policyId: string }>();
  const router = useRouter();
  const { trackProductEvent } = useProductAnalytics();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [type, setType] = useState<string>("PUBLIC");
  const [scope, setScope] = useState<"global" | "app">("global");
  const [selectedAppId, setSelectedAppId] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [polRes, appsRes] = await Promise.all([
        fetch(`/api/policies/${params.policyId}`),
        fetch("/api/apps"),
      ]);
      if (!polRes.ok) {
        router.push("/policies");
        return;
      }
      const data: Policy = await polRes.json();
      setPolicy(data);
      setName(data.name ?? "");
      setPattern(data.pattern);
      setType(data.type);
      setScope(data.appId ? "app" : "global");
      setSelectedAppId(data.appId ?? "");
      if (appsRes.ok) setApps(await appsRes.json());
      setLoading(false);
    }
    load();
  }, [params.policyId, router]);

  const dirty =
    policy !== null &&
    (pattern.trim() !== policy.pattern ||
      type !== policy.type ||
      (name.trim() || null) !== (policy.name ?? null) ||
      (scope === "app" ? selectedAppId : null) !== policy.appId);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty || !pattern.trim()) return;
    if (scope === "app" && !selectedAppId) {
      setErr("Select an app for this scope.");
      trackProductEvent("policy_save_failed", { policyId: params.policyId, reason: "missing_app" });
      return;
    }
    setSaving(true);
    setErr(null);
    setSaved(false);
    const res = await fetch(`/api/policies/${params.policyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pattern: pattern.trim(),
        type,
        name: name.trim() || null,
        appId: scope === "app" ? selectedAppId : null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Save failed");
      trackProductEvent("policy_save_failed", {
        policyId: params.policyId,
        reason: j.error ?? "request_failed",
      });
      return;
    }
    const updated: Policy = await res.json();
    setPolicy(updated);
    trackProductEvent("policy_saved", {
      policyId: params.policyId,
      type,
      scope,
      appId: scope === "app" ? selectedAppId : null,
      changedPattern: pattern.trim() !== policy?.pattern,
      changedType: type !== policy?.type,
      changedScope: (scope === "app" ? selectedAppId : null) !== policy?.appId,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!confirm("Delete this policy? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/policies/${params.policyId}`, { method: "DELETE" });
    if (res.ok) {
      trackProductEvent("policy_deleted", { policyId: params.policyId, type: policy?.type });
      router.push("/policies");
    } else {
      const body = await res.json().catch(() => null);
      trackProductEvent("policy_delete_failed", { policyId: params.policyId, reason: body?.error ?? "request_failed" });
      setDeleting(false);
    }
  }

  if (loading || !policy) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-start gap-3">
        <Link
          href="/policies"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-[var(--foreground)]"
          aria-label="Back to policies"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {policy.app ? <Shield className="h-4 w-4 text-teal-500" /> : <Globe className="h-4 w-4 text-teal-500" />}
            <h1 className="text-xl font-semibold leading-7 tracking-tight text-[var(--foreground)]">
              {policy.name ?? policy.pattern}
            </h1>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${typeColors[policy.type] ?? "text-zinc-400 bg-zinc-800"}`}>
              {policy.type}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {policy.app ? `Scoped to ${policy.app.name}` : "Applies to all applications"} · Updated {new Date(policy.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scope</label>
          <div className="flex gap-1 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-1 w-fit">
            {([
              { value: "global", label: "All applications" },
              { value: "app", label: "Specific app" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setScope(opt.value);
                  trackProductEvent("policy_scope_changed", {
                    policyId: params.policyId,
                    scope: opt.value,
                  });
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  scope === opt.value ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {scope === "app" ? (
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
            >
              <option value="">Select app...</option>
              {apps.map((app) => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name <span className="text-zinc-600">(optional)</span></label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Internal chat channels"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pattern</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. private-*"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
          />
          <p className="text-[11px] text-zinc-500">Use <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">*</code> as a wildcard. Matching channel names use this policy&apos;s type.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {channelTypes.map((t) => {
              const isSelected = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    trackProductEvent("policy_type_selected", {
                      policyId: params.policyId,
                      type: t,
                    });
                  }}
                  className={`flex flex-col items-start gap-1 rounded-lg border px-3 py-3 text-left transition ${
                    isSelected
                      ? "border-teal-500/40 bg-teal-500/5"
                      : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                  }`}
                >
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${typeColors[t]}`}>{t}</span>
                  <p className="text-[11px] text-zinc-500">{typeDescriptions[t]}</p>
                </button>
              );
            })}
          </div>
        </div>

        {err ? (
          <div className="rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-300 ring-1 ring-rose-400/30">
            {err}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-2">
          {saved ? <span className="text-xs text-emerald-400">Saved</span> : null}
          <button
            type="submit"
            disabled={saving || !dirty || !pattern.trim()}
            className="button-default inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-950 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </form>

      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Danger zone</h2>
        <p className="text-xs text-zinc-500">Deleting this policy is permanent and cannot be undone.</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/5 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete policy
        </button>
      </section>
    </main>
  );
}
