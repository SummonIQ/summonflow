"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ShieldPlus, Loader2, Globe, ChevronRight } from "lucide-react";
import { readCookie, ACTIVE_APP_COOKIE } from "@/components/app-switcher";
import { useProductAnalytics } from "@/lib/analytics/client";

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
  app: { id: string; name: string } | null;
}

const channelTypes = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"] as const;

const typeColors: Record<string, string> = {
  PUBLIC: "text-teal-400 bg-teal-500/10",
  PRIVATE: "text-indigo-400 bg-indigo-500/10",
  PRESENCE: "text-amber-400 bg-amber-500/10",
  ENCRYPTED: "text-pink-400 bg-pink-500/10",
};

export default function PoliciesPage() {
  const { trackProductEvent } = useProductAnalytics();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newScope, setNewScope] = useState<"global" | "app">("global");
  const [newAppId, setNewAppId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPattern, setNewPattern] = useState("");
  const [newType, setNewType] = useState<string>("PUBLIC");
  const [err, setErr] = useState<string | null>(null);

  async function fetchAll() {
    const activeAppId = readCookie(ACTIVE_APP_COOKIE);
    setSelectedAppId(activeAppId);
    const [polRes, appsRes] = await Promise.all([
      activeAppId
        ? fetch(`/api/policies?appId=${encodeURIComponent(activeAppId)}&scope=effective`)
        : Promise.resolve(null),
      fetch("/api/apps"),
    ]);
    if (polRes?.ok) setPolicies(await polRes.json());
    if (appsRes.ok) setApps(await appsRes.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newPattern.trim()) return;
    if (newScope === "app" && !(newAppId || selectedAppId)) {
      setErr("Select an app for this scope.");
      trackProductEvent("policy_create_failed", { reason: "missing_app", scope: newScope });
      return;
    }
    setCreating(true);
    setErr(null);
    const res = await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pattern: newPattern.trim(),
        type: newType,
        name: newName.trim() || null,
        appId: newScope === "app" ? (newAppId || selectedAppId) : null,
      }),
    });
    setCreating(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Failed to create policy");
      trackProductEvent("policy_create_failed", {
        reason: j.error ?? "request_failed",
        scope: newScope,
        type: newType,
      });
      return;
    }
    trackProductEvent("policy_created", {
      scope: newScope,
      type: newType,
      hasName: Boolean(newName.trim()),
      pattern: newPattern.trim(),
      appId: newScope === "app" ? (newAppId || selectedAppId) : null,
    });
    setNewName("");
    setNewPattern("");
    setNewType("PUBLIC");
    setNewAppId("");
    setNewScope("global");
    setShowCreate(false);
    await fetchAll();
  }

  return (
    <main className="space-y-5">
      <header className="flex flex-col gap-3 px-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Policies</h1>
          <p className="mt-px text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Rules for how channel patterns behave. Global policies apply across every app; app-scoped policies only apply to one application.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreate((v) => {
              const next = !v;
              trackProductEvent(next ? "policy_create_panel_opened" : "policy_create_panel_closed", {
                selectedAppId,
                policyCount: policies.length,
              });
              return next;
            });
          }}
          className="button-default inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 transition active:scale-[0.98]"
        >
          <ShieldPlus className="h-4 w-4" />
          Create Policy
        </button>
      </header>

      {!selectedAppId ? (
        <section className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 px-6 py-16 text-center">
          <h2 className="text-sm font-semibold text-zinc-200">Select an application</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
            Choose an application from the sidebar selector to view channel policies.
          </p>
        </section>
      ) : showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-4">
          <div className="flex gap-1 rounded-lg border border-zinc-800/50 bg-zinc-950/50 p-1 w-fit">
            {([
              { value: "global", label: "All applications" },
              { value: "app", label: "Specific app" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setNewScope(opt.value);
                  trackProductEvent("policy_create_scope_changed", { scope: opt.value });
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  newScope === opt.value ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {newScope === "app" ? (
              <select
                value={newAppId || selectedAppId}
                onChange={(e) => setNewAppId(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
              >
                <option value="">Select app...</option>
                {apps.map((app) => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
            ) : null}
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name (optional)"
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-teal-500/50"
            />
            <input
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              placeholder="Pattern (e.g. private-*)"
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 font-mono text-sm text-white placeholder:text-zinc-600 outline-none focus:border-teal-500/50"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
            >
              {channelTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {err ? (
            <div className="rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-300 ring-1 ring-rose-400/30">
              {err}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating || !newPattern.trim() || (newScope === "app" && !(newAppId || selectedAppId))}
              className="button-default rounded-lg px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedAppId && loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : selectedAppId && policies.length === 0 ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center space-y-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20"
        >
          <div className="rounded-full bg-zinc-900 p-4 text-zinc-600">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">No policies defined</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
              Establish authorization and encryption rules for your channels.
            </p>
          </div>
        </motion.section>
      ) : selectedAppId ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800/50">
          {policies.map((policy, i) => (
            <Link
              key={policy.id}
              href={`/policies/${policy.id}`}
              onClick={() => trackProductEvent("policy_opened", {
                policyId: policy.id,
                type: policy.type,
                scope: policy.app ? "app" : "global",
              })}
              className={`group flex items-center justify-between px-5 py-4 transition hover:bg-zinc-900/40 ${i !== 0 ? "border-t border-zinc-800/30" : ""}`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-zinc-500 group-hover:text-teal-500 transition">
                  {policy.app ? <Shield className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <code className="text-sm text-white">{policy.pattern}</code>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${typeColors[policy.type] ?? "text-zinc-400 bg-zinc-800"}`}>
                      {policy.type}
                    </span>
                  </div>
                  <div className="mt-px flex items-center gap-2 text-[11px] text-zinc-500">
                    {policy.name ? <span>{policy.name} ·</span> : null}
                    <span>{policy.app ? `App: ${policy.app.name}` : "All applications"}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-700 transition group-hover:text-teal-500" />
            </Link>
          ))}
        </div>
      ) : null}
    </main>
  );
}
