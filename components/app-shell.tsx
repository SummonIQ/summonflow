"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronUp,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useTheme } from "@/components/theme-provider";
import { BrandWordmark } from "@/components/brand-wordmark";
import { AppSwitcher } from "@/components/app-switcher";
import { useProductAnalytics } from "@/lib/analytics/client";

const navItems = [
  { href: "/channels", label: "Active Channels", icon: Activity },
  { href: "/stats", label: "Statistics", icon: BarChart3 },
  { href: "/policies", label: "Policies", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
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

const PageLayoutContext = createContext<{
  fullBleed: boolean;
  setFullBleed: (v: boolean) => void;
}>({ fullBleed: false, setFullBleed: () => {} });

export function useFullBleedPage(enabled = true) {
  const { setFullBleed } = useContext(PageLayoutContext);
  useEffect(() => {
    setFullBleed(enabled);
    return () => setFullBleed(false);
  }, [enabled, setFullBleed]);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [fullBleed, setFullBleed] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { trackProductEvent } = useProductAnalytics();

  useEffect(() => {
    fetch("/api/user")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setUser(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  async function handleSwitchOrganization(organizationId: string) {
    const organization = user?.organizations?.find((item) => item.id === organizationId);
    trackProductEvent("organization_switched", {
      organizationId,
      organizationName: organization?.name,
      previousOrganizationId: user?.activeOrganization?.id,
      source: "sidebar_user_menu",
    });
    setSwitchingOrgId(organizationId);
    try {
      const res = await fetch("/api/organizations/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setSwitchingOrgId(null);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--panel)] text-[var(--foreground)]">
      <aside className="flex w-64 shrink-0 flex-col bg-[var(--panel)]">
        <div className="flex h-full flex-col px-4 py-6">
          <div className="px-2 mb-4">
            <BrandWordmark />
          </div>

          <div className="mb-6">
            <AppSwitcher />
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => trackProductEvent("sidebar_navigation_clicked", {
                    label: item.label,
                    href: item.href,
                    currentPath: pathname,
                  })}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--line)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)]"
                  }`}
                >
                  <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-current" : "group-hover:text-[var(--foreground)]"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative pt-3" ref={menuRef}>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-2 right-2 mb-2 rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] shadow-xl overflow-hidden"
                >
                  <div className="p-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Organization</div>
                    {user?.organizations?.map((organization) => {
                      const isActive = user.activeOrganization?.id === organization.id;
                      return (
                        <button
                          key={organization.id}
                          onClick={() => handleSwitchOrganization(organization.id)}
                          disabled={isActive || switchingOrgId === organization.id}
                          className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition ${
                            isActive
                              ? "bg-[var(--line)] text-[var(--foreground)]"
                              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)]"
                          }`}
                        >
                          <div className="min-w-0 text-left">
                            <div className="truncate">{organization.name}</div>
                            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{organization.role}</div>
                          </div>
                          {switchingOrgId === organization.id ? <Moon className="h-3.5 w-3.5 animate-spin" /> : null}
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-[var(--line)] p-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Theme</div>
                    {([
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Monitor },
                    ] as const).map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setTheme(t.value);
                          trackProductEvent("theme_changed", {
                            theme: t.value,
                            previousTheme: theme,
                            source: "sidebar_user_menu",
                          });
                        }}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition ${theme === t.value ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)]"}`}
                      >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[var(--line)] p-1">
                    <Link
                      href="/settings"
                      onClick={() => {
                        setMenuOpen(false);
                        trackProductEvent("settings_link_clicked", { source: "sidebar_user_menu" });
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)] transition"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
                        trackProductEvent("logout_clicked", { source: "sidebar_user_menu" });
                        await signOut();
                        window.location.href = "/login";
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)] transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                const nextOpen = !menuOpen;
                setMenuOpen(nextOpen);
                trackProductEvent(nextOpen ? "user_menu_opened" : "user_menu_closed", {
                  source: "sidebar_user_menu",
                });
              }}
              className="flex w-full items-center gap-3 rounded-md border-x-0 border-t border-b border-t-[var(--line)] border-b-black/20 bg-[var(--panel-2)] px-3 py-2 transition hover:bg-[var(--line)] dark:border-t-[rgba(164,199,196,0.12)] dark:border-b-black/40 dark:bg-[#0a1216] dark:hover:bg-[#0d171c]"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-medium text-[var(--foreground)] truncate">{user?.firstName} {user?.lastName}</div>
                <div className="text-[11px] text-[var(--muted)] truncate">{user?.activeOrganization?.name ?? user?.email}</div>
              </div>
              <ChevronUp className={`h-4 w-4 text-[var(--muted)] transition-transform ${menuOpen ? "" : "rotate-180"}`} />
            </button>
          </div>
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden p-3 pl-0">
        <div className="relative h-full overflow-y-auto rounded-xl border border-[var(--line)] bg-[var(--background)]">
          <PageLayoutContext.Provider value={{ fullBleed, setFullBleed }}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
              className={fullBleed ? "relative" : "relative mx-auto max-w-7xl px-4 py-4"}
            >
              {children}
            </motion.div>
          </PageLayoutContext.Provider>
        </div>
      </main>
    </div>
  );
}
