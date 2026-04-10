"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Plus, Loader2, Trash2 } from "lucide-react";

interface App {
  id: string;
  name: string;
  channelPolicies: Policy[];
}

interface Policy {
  id: string;
  appId: string;
  pattern: string;
  type: string;
  createdAt: string;
}

const channelTypes = ["PUBLIC", "PRIVATE", "PRESENCE", "ENCRYPTED"] as const;

const typeColors: Record<string, string> = {
  PUBLIC: "text-teal-400 bg-teal-500/10",
  PRIVATE: "text-indigo-400 bg-indigo-500/10",
  PRESENCE: "text-amber-400 bg-amber-500/10",
  ENCRYPTED: "text-pink-400 bg-pink-500/10",
};

export default function ChannelPoliciesPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [pattern, setPattern] = useState("");
  const [type, setType] = useState<string>("PUBLIC");

  async function fetchApps() {
    const res = await fetch("/api/apps");
    if (res.ok) setApps(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchApps(); }, []);

  const allPolicies = apps.flatMap((app) =>
    app.channelPolicies.map((p) => ({ ...p, appName: app.name }))
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAppId || !pattern.trim()) return;
    setCreating(true);
    const res = await fetch(`/api/apps/${selectedAppId}/policies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pattern: pattern.trim(), type }),
    });
    if (res.ok) {
      setPattern("");
      setShowCreate(false);
      await fetchApps();
    }
    setCreating(false);
  }

  return (
    <main className="space-y-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Channel Policies</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Define rules for how different channel patterns behave across your apps.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          disabled={apps.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 active:scale-[0.98] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Create Policy
        </button>
      </header>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
            >
              <option value="">Select app...</option>
              {apps.map((app) => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Channel pattern (e.g. private-*)"
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-teal-500/50"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-500/50"
            >
              {channelTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating || !selectedAppId || !pattern.trim()}
              className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50"
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

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : allPolicies.length === 0 ? (
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
              {apps.length === 0
                ? "Create an application first, then define channel policies."
                : "Establish authorization and encryption rules for your channels."}
            </p>
          </div>
        </motion.section>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
                <th className="px-4 py-3 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">App</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pattern</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
              </tr>
            </thead>
            <tbody>
              {allPolicies.map((policy) => (
                <tr key={policy.id} className="border-b border-zinc-800/30 last:border-0">
                  <td className="px-4 py-3 text-zinc-300">{policy.appName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{policy.pattern}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${typeColors[policy.type] ?? "text-zinc-400 bg-zinc-800"}`}>
                      {policy.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
