import {
  AppWindow,
  Bug,
  Code2,
  Lock,
  Palette,
  Radio,
  ShieldCheck,
  Unplug,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ChangelogEntry = {
  title: string;
  description: string;
  size?: "major" | "minor";
};

export type CategoryStyle = {
  label: string;
  icon: LucideIcon;
  glow: string;
  badgeClass: string;
  iconTileClass: string;
  iconClass: string;
};

export const CATEGORIES: Record<string, CategoryStyle> = {
  Bug: {
    label: "Bug",
    icon: Bug,
    glow: "rgba(248,113,113,0.12)",
    badgeClass: "border-red-400/28 bg-red-500/10 text-red-300",
    iconTileClass: "border-red-400/18 bg-red-500/10",
    iconClass: "text-red-300/90",
  },
  Security: {
    label: "Security",
    icon: ShieldCheck,
    glow: "rgba(45,212,191,0.1)",
    badgeClass: "border-teal-400/26 bg-teal-500/10 text-teal-300",
    iconTileClass: "border-teal-400/16 bg-teal-500/10",
    iconClass: "text-teal-300/86",
  },
  Channels: {
    label: "Channels",
    icon: Radio,
    glow: "rgba(96,165,250,0.1)",
    badgeClass: "border-sky-400/26 bg-sky-500/10 text-sky-300",
    iconTileClass: "border-sky-400/16 bg-sky-500/10",
    iconClass: "text-sky-300/86",
  },
  Encryption: {
    label: "Encryption",
    icon: Lock,
    glow: "rgba(244,114,182,0.09)",
    badgeClass: "border-pink-400/26 bg-pink-500/10 text-pink-300",
    iconTileClass: "border-pink-400/16 bg-pink-500/10",
    iconClass: "text-pink-300/84",
  },
  API: {
    label: "API",
    icon: Code2,
    glow: "rgba(167,139,250,0.09)",
    badgeClass: "border-violet-400/26 bg-violet-500/10 text-violet-300",
    iconTileClass: "border-violet-400/16 bg-violet-500/10",
    iconClass: "text-violet-300/86",
  },
  Integrations: {
    label: "Integrations",
    icon: Unplug,
    glow: "rgba(251,191,36,0.08)",
    badgeClass: "border-amber-400/26 bg-amber-500/10 text-amber-300",
    iconTileClass: "border-amber-400/16 bg-amber-500/10",
    iconClass: "text-amber-300/86",
  },
  Performance: {
    label: "Performance",
    icon: Zap,
    glow: "rgba(34,197,94,0.09)",
    badgeClass: "border-emerald-400/26 bg-emerald-500/10 text-emerald-300",
    iconTileClass: "border-emerald-400/16 bg-emerald-500/10",
    iconClass: "text-emerald-300/86",
  },
  Design: {
    label: "Design",
    icon: Palette,
    glow: "rgba(132,204,22,0.1)",
    badgeClass: "border-lime-400/26 bg-lime-500/10 text-lime-300",
    iconTileClass: "border-lime-400/16 bg-lime-500/10",
    iconClass: "text-lime-300/86",
  },
  Product: {
    label: "Product",
    icon: AppWindow,
    glow: "rgba(129,140,248,0.1)",
    badgeClass: "border-indigo-400/26 bg-indigo-500/10 text-indigo-300",
    iconTileClass: "border-indigo-400/16 bg-indigo-500/10",
    iconClass: "text-indigo-300/86",
  },
};

export function getEntryCategory(entry: { title: string; description: string }): CategoryStyle {
  const text = `${entry.title} ${entry.description}`.toLowerCase();

  if (/\bfix(es|ed|ing)?\b/.test(text) || /\bbug\b/.test(text) || text.includes("broken") || text.includes("crash")) return CATEGORIES.Bug;
  if (text.includes("passkey") || text.includes("password") || text.includes("auth") || text.includes("security") || text.includes("2fa")) return CATEGORIES.Security;
  if (text.includes("channel") || text.includes("presence") || text.includes("subscribe")) return CATEGORIES.Channels;
  if (text.includes("encrypt")) return CATEGORIES.Encryption;
  if (/\bapi\b/.test(text) || text.includes("webhook") || text.includes("endpoint") || text.includes("sdk") || text.includes("snippet")) return CATEGORIES.API;
  if (text.includes("stripe") || text.includes("billing") || text.includes("integration") || text.includes("database") || text.includes("neon") || text.includes("prisma")) return CATEGORIES.Integrations;
  if (text.includes("fast") || text.includes("performance") || text.includes("redis") || text.includes("fanout")) return CATEGORIES.Performance;
  if (text.includes("dark") || text.includes("light") || text.includes("theme") || text.includes("design") || text.includes("ui")) return CATEGORIES.Design;

  return CATEGORIES.Product;
}

export function isBugEntry(entry: ChangelogEntry): boolean {
  return getEntryCategory(entry).label === "Bug";
}

export function isMinorEntry(entry: ChangelogEntry): boolean {
  if (entry.size === "minor") return true;
  if (entry.size === "major") return false;
  if (getEntryCategory(entry).label === "Bug") return true;
  return false;
}
