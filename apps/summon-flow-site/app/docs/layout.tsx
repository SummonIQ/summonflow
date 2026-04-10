"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Terminal, 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Activity, 
  Code2,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

const docCategories = [
  {
    title: "Getting Started",
    items: [
      { href: "/docs", label: "Introduction", icon: BookOpen },
      { href: "/docs/quickstart", label: "Quickstart", icon: Zap },
      { href: "/docs/architecture", label: "Architecture", icon: Globe },
    ]
  },
  {
    title: "Core Concepts",
    items: [
      { href: "/docs/channels", label: "Channels & Presence", icon: Activity },
      { href: "/docs/authentication", label: "Authentication", icon: Shield },
      { href: "/docs/encryption", label: "End-to-end Encryption", icon: Lock },
    ]
  },
  {
    title: "Deployment",
    items: [
      { href: "/docs/railway", label: "Railway (Socket Server)", icon: Terminal },
      { href: "/docs/vercel", label: "Vercel (Auth/Publish)", icon: Code2 },
      { href: "/docs/cloudflare", label: "Cloudflare (Edge)", icon: Zap },
    ]
  },
  {
    title: "Reference",
    items: [
      { href: "/docs/client-sdk", label: "Client SDK API", icon: Code2 },
      { href: "/docs/server-api", label: "Server-side API", icon: Terminal },
    ]
  }
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100">
      {/* Sidebar Docs Navigation */}
      <aside className="fixed inset-y-0 left-0 w-72 border-r border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex h-full flex-col px-6 py-8">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to site</span>
          </Link>

          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white uppercase tracking-widest">SummonFlow</span>
          </div>

          <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            {docCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <h3 className="px-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  {category.title}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                          isActive 
                            ? "text-teal-400 bg-teal-500/5" 
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-teal-400" : "group-hover:text-zinc-100"}`} />
                        {item.label}
                        {isActive && (
                          <motion.div
                            layoutId="active-doc-nav"
                            className="absolute left-0 w-1 h-4 bg-teal-500 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <ChevronRight className={`ml-auto h-3 w-3 transition-transform ${isActive ? "opacity-100 rotate-90" : "opacity-0 group-hover:opacity-40"}`} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-8 border-t border-zinc-800/50 pt-6">
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-4">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Help & Community</h4>
              <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
                Found a bug? Join our Discord or open an issue on GitHub.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="https://github.com/SummonIQ/summonflow" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-teal-500 uppercase tracking-widest hover:underline">GitHub</a>
                <a href="https://github.com/SummonIQ/summonflow/discussions" target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-teal-500 uppercase tracking-widest hover:underline">Discussions</a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Documentation Content */}
      <main className="flex-1 pl-72">
        <div className="h-full">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
            className="mx-auto max-w-4xl px-12 py-16"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
