"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Users, 
  Clock, 
  Zap, 
  Search, 
  Filter,
  Lock,
  Radio,
  Globe
} from "lucide-react";
import { activeChannels } from "@/lib/mock-data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function ActiveChannelsPage() {
  return (
    <main className="space-y-10">
      {/* Header section */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Active Channels</h1>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Real-time monitor of live traffic across your estate. 
            Track connection counts, uptime, and last-mile events at the edge.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div className="text-xs">
            <span className="block font-semibold text-white uppercase tracking-wider">Live Monitor</span>
            <span className="text-zinc-500">Last updated: Just now</span>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-800/50 bg-zinc-950/40 p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search channels..." 
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2 text-sm text-zinc-300 outline-none focus:border-teal-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            <Filter className="h-3 w-3" />
            Filter
          </button>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <span className="text-xs text-zinc-500">
            Total Channels: <span className="text-white font-mono">{activeChannels.length}</span>
          </span>
        </div>
      </section>

      {/* Channels Table/List */}
      <motion.section 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {activeChannels.map((channel) => (
          <motion.div 
            key={channel.name} 
            variants={item}
            className="group relative rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5 transition-all duration-200 hover:border-zinc-700/50 hover:bg-zinc-800/20"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              {/* Status & Name */}
              <div className="flex flex-1 items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${channel.status === 'active' ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'bg-zinc-700'}`} />
                <div>
                  <h3 className="text-sm font-semibold text-white font-mono">{channel.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                    <Globe className="h-3 w-3" />
                    {channel.app}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:flex lg:items-center lg:gap-12">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    <Zap className="h-3 w-3" />
                    Type
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                    {channel.type === 'encrypted' && <Lock className="h-3 w-3 text-amber-500" />}
                    {channel.type === 'presence' && <Users className="h-3 w-3 text-teal-500" />}
                    {channel.type === 'public' && <Radio className="h-3 w-3 text-indigo-500" />}
                    {channel.type}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    <Users className="h-3 w-3" />
                    Members
                  </div>
                  <div className="text-xs text-zinc-300 font-mono">
                    {channel.members.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    <Clock className="h-3 w-3" />
                    Uptime
                  </div>
                  <div className="text-xs text-zinc-300 font-mono">
                    {channel.uptime}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5">
                    <Activity className="h-3 w-3" />
                    Last Event
                  </div>
                  <div className="text-xs text-zinc-300">
                    {channel.lastEvent}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 lg:ml-auto">
                <button className="rounded-lg border border-zinc-800 bg-zinc-950/20 p-2 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors">
                  <Activity className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Background line indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-teal-500/0 transition-all group-hover:bg-teal-500" />
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}
