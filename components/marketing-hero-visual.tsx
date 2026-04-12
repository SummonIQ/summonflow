"use client";

import { motion } from "framer-motion";
import { Activity, Lock, Radio, Users, Zap } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const orbitItems = [
  {
    label: "Presence",
    detail: "128 live",
    icon: Users,
    className: "left-[5%] top-[18%]",
    y: [0, -10, 0],
    x: [0, 8, 0],
    duration: 9.8,
  },
  {
    label: "Encrypted",
    detail: "AES-256-GCM",
    icon: Lock,
    className: "right-[6%] top-[12%]",
    y: [0, 12, 0],
    x: [0, -8, 0],
    duration: 10.6,
  },
  {
    label: "Fanout",
    detail: "Redis-backed",
    icon: Zap,
    className: "right-[7%] bottom-[21%]",
    y: [0, -9, 0],
    x: [0, -6, 0],
    duration: 9.1,
  },
  {
    label: "Channels",
    detail: "4 types",
    icon: Radio,
    className: "left-[7%] bottom-[18%]",
    y: [0, 11, 0],
    x: [0, 10, 0],
    duration: 11.2,
  },
];

export function MarketingHeroVisual() {
  const signalCoreAnchor = {
    left: "50%",
    top: "39.5%",
  } as const;

  return (
    <div className="relative h-[34rem] w-[min(46rem,100vw-2rem)] max-w-none overflow-visible lg:h-[38rem] [transform-style:preserve-3d]">
      {/* Background Glow - Origin Locked */}
      <motion.div
        className="absolute h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--teal)_20%,transparent)_0%,color-mix(in_srgb,var(--accent)_12%,transparent)_38%,transparent_72%)] blur-2xl will-change-[transform,opacity]"
        style={signalCoreAnchor}
        initial={{ x: "-50%", y: "-50%" }}
        animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.62, 0.88, 0.62], x: "-50%", y: "-50%" }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Origin-locked Rings and Logo */}
      <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        {Array.from({ length: 12 }, (_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full will-change-[transform,opacity]"
            style={{
              ...signalCoreAnchor,
              width: "3rem",
              height: "3rem",
              background:
                "radial-gradient(circle, transparent 45%, rgba(50,214,196,0.22) 48%, rgba(50,214,196,0.08) 52%, transparent 58%)",
            }}
            initial={{ opacity: 0, scale: 1, x: "-50%", y: "-50%" }}
            animate={{
              scale: [1, 48],
              opacity: [0, 0.16, 0.07, 0.015, 0],
              x: "-50%",
              y: "-50%",
            }}
            transition={{
              duration: 18,
              delay: index * 1.5,
              repeat: Infinity,
              ease: "linear",
              opacity: {
                duration: 18,
                delay: index * 1.5,
                repeat: Infinity,
                ease: "easeOut",
                times: [0, 0.1, 0.3, 0.6, 1],
              },
            }}
          />
        ))}

        {/* Static Logo Components */}
        <div 
          className="absolute h-[3rem] w-[3rem] rounded-full border border-[rgba(50,214,196,0.14)] shadow-[0_0_20px_rgba(50,214,196,0.05)]" 
          style={{ ...signalCoreAnchor, transform: "translate3d(-50%, -50%, 0)" }}
        />
        <div
          className="absolute h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--foreground)_10%,transparent)_0%,transparent_72%)] blur-xl"
          style={{ ...signalCoreAnchor, transform: "translate3d(-50%, -50%, 0)" }}
        />
        <div 
          className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--teal)_16%,transparent)_0%,transparent_72%)]"
          style={{ ...signalCoreAnchor, transform: "translate3d(-50%, -50%, 0)" }}
        >
          <BrandMark className="text-teal-500" />
        </div>
        <div 
          className="absolute rounded-full bg-[linear-gradient(135deg,color-mix(in_srgb,var(--teal)_34%,transparent),color-mix(in_srgb,var(--teal)_22%,transparent)_58%,color-mix(in_srgb,var(--foreground)_12%,transparent))] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--teal)] shadow-[0_14px_28px_-18px_rgba(10,90,84,0.9)] w-[4.4rem] leading-tight text-center"
          style={{ left: "50%", top: "42.8%", transform: "translateX(-50%)" }}
        >
          Signal Core
        </div>
      </div>

      {/* Crosshairs - Positioned relative to anchor */}
      <div className="absolute left-1/2 bottom-[60.5%] h-[7rem] w-px -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--teal)_28%,transparent),transparent)] opacity-70" />
        <motion.div
          className="absolute bottom-0 left-0 h-[2.1rem] w-full bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--teal)_48%,transparent),transparent)] will-change-transform"
          animate={{ y: ["0%", "-320%"], opacity: [0, 0.45, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute top-[39.5%] left-1/2 h-[6.5rem] w-px -translate-x-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--teal)_28%,transparent),transparent)] opacity-70" />
        <motion.div
          className="absolute left-0 top-0 h-[2rem] w-full bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--teal)_48%,transparent),transparent)] will-change-transform"
          animate={{ y: ["-10%", "300%"], opacity: [0, 0.4, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute left-[28%] top-[39.5%] h-px w-[7rem] -translate-y-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--teal)_28%,transparent),transparent)] opacity-70" />
        <motion.div
          className="absolute right-0 top-0 h-full w-[2.1rem] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--teal)_48%,transparent),transparent)] will-change-transform"
          animate={{ x: ["0%", "-320%"], opacity: [0, 0.42, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute right-[28%] top-[39.5%] h-px w-[7rem] -translate-y-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--teal)_28%,transparent),transparent)] opacity-70" />
        <motion.div
          className="absolute left-0 top-0 h-full w-[2.1rem] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--teal)_48%,transparent),transparent)] will-change-transform"
          animate={{ x: ["-10%", "320%"], opacity: [0, 0.42, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {orbitItems.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            className={`absolute ${item.className} rounded-[1.35rem] border-x-0 border-t border-b border-t-[color:rgb(89_104_109)] border-b-[color:rgb(16_23_27)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%),linear-gradient(to_bottom_right,rgba(108,126,132,0.2)_0%,rgba(24,35,40,0.78)_52%,rgba(9,14,17,0.92)_100%)] p-4 shadow-[0_28px_54px_-16px_rgba(2,8,10,0.54),0_52px_136px_-34px_rgba(4,12,15,0.74)] backdrop-blur-xl will-change-transform [transform:translate3d(0,0,0)]`}
            animate={{ y: item.y, x: item.x }}
            transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--teal)_12%,transparent)]">
                <Icon className="h-3 w-3 text-[var(--teal)]" />
              </span>
              <span>{item.label}</span>
            </div>
            <div className="mt-1.5 pl-7 text-[15px] font-semibold leading-none text-[var(--foreground)]">{item.detail}</div>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute right-[18%] top-[44%] overflow-hidden rounded-full border border-[rgba(255,162,162,0.18)] bg-[linear-gradient(to_bottom_right,rgba(255,126,126,0.22),rgba(183,28,28,0.18)_60%,rgba(96,12,12,0.14))] px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#ff4f66] shadow-[0_18px_34px_-18px_rgba(122,20,20,0.82)] backdrop-blur-2xl will-change-transform [transform:translate3d(0,0,0)]"
        animate={{ x: [0, 8, 0], y: [0, -7, 0] }}
        transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="relative flex items-center gap-2.5">
          <motion.span
            aria-hidden
            className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff3f55] shadow-[0_0_0_0_rgba(255,78,98,0.72)]"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(255,78,98,0.68)",
                "0 0 0 6px rgba(255,78,98,0)",
              ],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <span className="inline-flex items-center">live</span>
        </span>
      </motion.div>

      <motion.div
        className="absolute left-[38%] top-[6%] overflow-hidden rounded-full border border-[rgba(180,220,215,0.18)] bg-[linear-gradient(to_bottom_right,rgba(140,232,215,0.18),rgba(24,60,62,0.4)_60%,rgba(8,22,26,0.58))] px-3 py-1.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--teal)_72%,white_28%)] shadow-[0_18px_34px_-18px_rgba(6,40,42,0.7)] backdrop-blur-2xl will-change-transform [transform:translate3d(0,0,0)]"
        animate={{ x: [0, -7, 0], y: [0, 8, 0] }}
        transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="relative flex items-center gap-2.5">
          <span aria-hidden className="inline-flex items-center gap-[3px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block h-1.5 w-1.5 rounded-full bg-[color:color-mix(in_srgb,var(--teal)_78%,white_22%)] will-change-opacity"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2.5, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.18,
                }}
              />
            ))}
          </span>
        </span>
      </motion.div>

      <motion.div
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded-[1.35rem] border-x-0 border-t border-b border-t-[color:rgb(89_104_109)] border-b-[color:rgb(16_23_27)] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_40%),linear-gradient(to_bottom_right,rgba(108,126,132,0.2)_0%,rgba(24,35,40,0.78)_52%,rgba(9,14,17,0.92)_100%)] p-4 shadow-[0_28px_58px_-18px_rgba(2,8,10,0.56),0_54px_140px_-38px_rgba(4,12,15,0.76)] backdrop-blur-xl will-change-transform [transform:translate3d(-50%,0,0)]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 10.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--teal)_12%,transparent)]">
            <Activity className="h-3 w-3 text-[var(--teal)]" />
          </span>
          <span>Deployment</span>
        </div>
        <div className="mt-1.5 pl-7 text-[15px] font-semibold leading-none text-[var(--foreground)]">fanout acknowledged in 38ms</div>
      </motion.div>
    </div>
  );
}
