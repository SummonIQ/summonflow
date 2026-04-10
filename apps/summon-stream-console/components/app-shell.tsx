"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  AppWindow, 
  Cable, 
  Orbit, 
  Shield, 
  LogOut, 
  LayoutDashboard,
  Settings,
  Activity
} from "lucide-react";
import { signOut } from "@/lib/auth";

const navItems = [
  { href: "/apps", label: "Applications", icon: AppWindow },
  { href: "/channels", label: "Active Channels", icon: Activity },
  { href: "/policies", label: "Channel Policies", icon: Shield },
  { href: "/integrations", label: "Integrations", icon: Orbit },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex h-full flex-col px-4 py-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">SummonStream</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "text-white bg-white/5" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-teal-500" : "group-hover:text-zinc-100"}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 w-1 h-4 bg-teal-500 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Deployment Status */}
          <div className="mt-auto mb-6 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5 text-teal-500" />
              System Status
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">API Latency</span>
                <span className="text-teal-500 font-mono">12ms</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Active Nodes</span>
                <span className="text-white font-mono">3</span>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="border-t border-zinc-800/50 pt-4">
            <button 
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64">
        <div className="h-full">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }} // ease-out-cubic
            className="mx-auto max-w-7xl px-8 py-8"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
