"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppWindow,
  Activity,
  Shield,
  Settings,
  LogOut,
  Signal,
  ChevronUp,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/apps", label: "Applications", icon: AppWindow },
  { href: "/channels", label: "Active Channels", icon: Activity },
  { href: "/policies", label: "Channel Policies", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-[var(--line)] bg-[var(--panel)] backdrop-blur-xl">
        <div className="flex h-full flex-col px-4 py-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
              <Signal className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">SummonFlow</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[var(--foreground)] bg-[var(--line)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)]"
                  }`}
                >
                  <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-[var(--accent)]" : "group-hover:text-[var(--foreground)]"}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-4 bg-[var(--accent)] rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="relative border-t border-[var(--line)] pt-3" ref={menuRef}>
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
                    <div className="px-3 py-2 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Theme</div>
                    {([
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Monitor },
                    ] as const).map((t) => (
                      <button
                        key={t.value}
                        onClick={() => { setTheme(t.value); }}
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
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)] transition"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
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
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-[var(--line)] transition"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-medium text-[var(--foreground)] truncate">{user?.firstName} {user?.lastName}</div>
                <div className="text-[11px] text-[var(--muted)] truncate">{user?.email}</div>
              </div>
              <ChevronUp className={`h-4 w-4 text-[var(--muted)] transition-transform ${menuOpen ? "" : "rotate-180"}`} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 pl-64">
        <div className="h-full">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className="mx-auto max-w-7xl px-8 py-8"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
