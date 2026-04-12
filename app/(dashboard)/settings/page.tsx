"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, CreditCard, Check, ExternalLink, Loader2, Fingerprint, Trash2, Plus, Save, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50";

type Tab = "profile" | "security" | "billing";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  activeOrganization?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  organizations?: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
  }>;
}

interface Passkey {
  id: string;
  name: string | null;
  createdAt: string;
  deviceType: string;
  backedUp: boolean;
}

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface BillingResponse {
  subscription: Subscription | null;
  organization?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
          Manage your account, security, and organization billing.
        </p>
      </header>

      <nav className="flex w-fit gap-1 rounded-lg border border-zinc-800/50 bg-zinc-950/60 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.015)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 overflow-hidden rounded-md px-4 py-2 text-sm font-medium transition-all duration-250 ${
              activeTab === tab.id
                ? "text-white shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
                : "text-zinc-400 saturate-125 hover:text-zinc-200"
            }`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="settings-tab-active"
                className="absolute inset-0 rounded-md bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04)_36%,rgba(255,255,255,0)_100%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            )}
            <tab.icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </nav>

      {activeTab === "profile" && <ProfileSection />}
      {activeTab === "security" && <SecuritySection />}
      {activeTab === "billing" && <BillingSection />}
    </main>
  );
}

// ─── Profile ───────────────────────────────────────────────────

function ProfileSection() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>;
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-white">Profile Information</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email</label>
          <input value={user?.email ?? ""} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
          <p className="text-[11px] text-zinc-600 ml-1">Email cannot be changed.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="button-default inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 transition disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
          {saved && <span className="text-xs text-teal-500 font-medium">Saved</span>}
        </div>
      </form>

      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">Account Details</h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account ID</span>
            <p className="mt-1 font-mono text-xs text-zinc-400">{user?.id}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Member Since</span>
            <p className="mt-1 text-xs text-zinc-400">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Organization</span>
            <p className="mt-1 text-xs text-zinc-400">{user?.activeOrganization?.name ?? "—"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Organizations</span>
            <p className="mt-1 text-xs text-zinc-400">{user?.organizations?.map((org) => org.name).join(", ") || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Security ──────────────────────────────────────────────────

function SecuritySection() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPasskeys() {
    const res = await fetch("/api/user/passkeys");
    if (res.ok) setPasskeys(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchPasskeys(); }, []);

  async function handleRegisterPasskey() {
    setRegistering(true);
    setError(null);
    try {
      const result = await authClient.passkey.addPasskey();
      if (result?.error) {
        setError(result.error.message ?? "Failed to register passkey.");
      } else {
        await fetchPasskeys();
      }
    } catch {
      setError("Passkey registration failed or was canceled.");
    }
    setRegistering(false);
  }

  async function handleDeletePasskey(id: string) {
    await fetch("/api/user/passkeys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPasskeys((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Passkeys</h2>
            <p className="mt-1 text-sm text-zinc-500">Use biometrics or a hardware key to sign in without a password.</p>
          </div>
          <button
            onClick={handleRegisterPasskey}
            disabled={registering}
            className="button-default inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 transition disabled:opacity-60"
          >
            {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Passkey
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-400">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-zinc-500" /></div>
        ) : passkeys.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center space-y-3">
            <div className="rounded-full bg-zinc-900 p-3 text-zinc-600"><Fingerprint className="h-6 w-6" /></div>
            <p className="text-xs text-zinc-500 max-w-xs">No passkeys registered. Add one to enable passwordless sign-in.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {passkeys.map((pk) => (
              <div key={pk.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-teal-500" />
                  <div>
                    <div className="text-sm text-white">{pk.name ?? "Passkey"}</div>
                    <div className="text-[11px] text-zinc-500">
                      {pk.deviceType === "singleDevice" ? "Single device" : "Multi-device"}
                      {pk.backedUp && " · Synced"}
                      {pk.createdAt && ` · Added ${new Date(pk.createdAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePasskey(pk.id)}
                  className="rounded-lg p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <PasswordChangeSection />
    </div>
  );
}

function PasswordChangeSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Failed to change password.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Something went wrong.");
    }
    setSaving(false);
  }

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">Password</h2>
      {error && <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-medium text-red-400">{error}</div>}
      {success && <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 px-4 py-3 text-xs font-medium text-teal-400">Password changed successfully.</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Current Password</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className={inputClass} />
        </div>
        <button type="submit" disabled={saving} className="button-default inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-950 transition disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
        </button>
      </form>
    </div>
  );
}

// ─── Billing ───────────────────────────────────────────────────

function BillingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [organization, setOrganization] = useState<BillingResponse["organization"]>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    fetch("/api/billing")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.subscription) setSubscription(data.subscription);
        if (data?.organization) setOrganization(data.organization);
        setLoadingSub(false);
      })
      .catch(() => setLoadingSub(false));
  }, []);

  const currentPlan = subscription?.status === "active" || subscription?.status === "trialing"
    ? subscription.plan
    : "hobby";

  async function handleUpgrade() {
    setLoading("pro");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setLoading(null);
    }
  }

  const plans = [
    {
      name: "Hobby", plan: "hobby", price: "$0",
      description: "For personal projects and exploration.",
      features: ["1 Application", "Public Channels", "Community Support", "Basic Analytics"],
      button: "Current Plan",
    },
    {
      name: "Pro", plan: "pro", price: "$29", period: "/mo",
      description: "Production-grade infrastructure.",
      features: ["Up to 10 Applications", "Presence & Encrypted Channels", "Redis-backed Fanout", "Priority Email Support", "Custom Auth Endpoints"],
      button: "Upgrade to Pro", highlight: true,
    },
    {
      name: "Enterprise", plan: "enterprise", price: "Custom",
      description: "For teams with high-scale needs.",
      features: ["SLA Guarantees", "Dedicated WebSocket Nodes", "Full Audit Trails", "White-glove Onboarding", "24/7 Phone Support"],
      button: "Contact Sales",
    },
  ];

  return (
    <div className="space-y-8">
      {subscription && subscription.status === "active" && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-teal-400">Pro Plan Active</span>
            <span className="ml-2 text-xs text-zinc-500">
              {subscription.cancelAtPeriodEnd
                ? `Cancels ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
            </span>
          </div>
          <button
            onClick={handlePortal}
            disabled={loading === "portal"}
            className="text-xs font-bold text-teal-500 uppercase tracking-widest hover:underline"
          >
            {loading === "portal" ? <Loader2 className="h-3 w-3 animate-spin" /> : "Manage"}
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.plan === currentPlan;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all ${
                plan.highlight
                  ? "border-teal-500/50 bg-teal-500/5 ring-1 ring-teal-500/50"
                  : "border-zinc-800/50 bg-zinc-900/30"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-950">
                  Recommended
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-zinc-500">{plan.period}</span>}
                </div>
                <p className="mt-3 text-xs text-zinc-400 leading-relaxed">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-teal-500 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                disabled={isCurrent || loadingSub || loading === plan.plan}
                onClick={
                  plan.plan === "pro" && !isCurrent ? handleUpgrade
                  : plan.plan === "enterprise" ? () => { window.location.href = "mailto:sales@summonflow.com"; }
                  : undefined
                }
                className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                  isCurrent
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : plan.highlight
                    ? "button-default text-zinc-950"
                    : "border border-zinc-700 text-zinc-300 hover:bg-white/5"
                }`}
              >
                {loading === plan.plan ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : isCurrent ? "Current Plan" : plan.button}
              </button>
            </div>
          );
        })}
      </div>

      <section className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-zinc-800 p-3 text-zinc-400"><CreditCard className="h-5 w-5" /></div>
            <div>
              <h3 className="text-base font-semibold text-white">Payment Method</h3>
              <p className="text-sm text-zinc-400">{subscription ? "Managed via Stripe." : "No payment method on file."}</p>
            </div>
          </div>
          {subscription && (
            <button onClick={handlePortal} className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors">
              Manage in Stripe
            </button>
          )}
        </div>
      </section>

      {subscription && (
        <footer className="flex items-center justify-between rounded-xl border border-dashed border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4 text-zinc-500" />
            <span className="text-xs text-zinc-500">Billing applies to {organization?.name ?? "your active organization"}.</span>
          </div>
          <button onClick={handlePortal} className="text-[10px] font-bold text-teal-500 uppercase tracking-widest hover:underline">Open Portal</button>
        </footer>
      )}
    </div>
  );
}
