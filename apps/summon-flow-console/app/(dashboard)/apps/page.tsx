"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Terminal, Trash2, Loader2, ArrowRight, Activity, Shield } from "lucide-react";

interface App {
  id: string;
  name: string;
  key: string;
  secret: string;
  createdAt: string;
  channelPolicies: { id: string; pattern: string; type: string }[];
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  async function fetchApps() {
    const res = await fetch("/api/apps");
    if (res.ok) setApps(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchApps(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/apps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      setNewName("");
      setShowCreate(false);
      await fetchApps();
    }
    setCreating(false);
  }

  async function handleDelete(e: React.MouseEvent, appId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this application?")) return;
    await fetch(`/api/apps/${appId}`, { method: "DELETE" });
    setApps((prev) => prev.filter((a) => a.id !== appId));
  }

  return (
    <main className="space-y-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Applications</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Manage your realtime applications.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Application
        </button>
      </header>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setShowCreate(false); setNewName(""); }}>
          <form
            onSubmit={handleCreate}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-white">Create Application</h2>
              <p className="mt-1 text-sm text-zinc-500">Give your app a name. You&apos;ll get a key and secret to connect.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Application Name</label>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Production, Staging, My App"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50"
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => { setShowCreate(false); setNewName(""); }} className="rounded-lg px-4 py-2.5 text-sm text-zinc-400 hover:text-white transition">
                Cancel
              </button>
              <button type="submit" disabled={creating || !newName.trim()} className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-teal-400 disabled:opacity-50">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : apps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center space-y-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20"
        >
          <div className="rounded-full bg-zinc-900 p-4 text-zinc-600">
            <Terminal className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-300">No applications yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
              Create your first application to start using SummonFlow.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800/50">
          {apps.map((app, i) => (
            <Link
              key={app.id}
              href={`/apps/${app.id}`}
              className={`group flex items-center justify-between px-5 py-4 transition hover:bg-zinc-900/40 ${i !== 0 ? "border-t border-zinc-800/30" : ""}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-zinc-500 group-hover:text-teal-500 transition">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{app.name}</div>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-zinc-500">
                    <span>{new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {app.channelPolicies.length} {app.channelPolicies.length === 1 ? "policy" : "policies"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleDelete(e, app.id)}
                  className="rounded-lg p-2 text-zinc-700 hover:text-red-400 hover:bg-red-500/5 transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="rounded-lg p-2 text-zinc-700 group-hover:text-teal-500 transition">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
