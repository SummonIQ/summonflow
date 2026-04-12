"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function MarketingHeroBackground() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-[-18%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(232,176,77,0.18)_0%,rgba(232,176,77,0.08)_32%,transparent_72%)] blur-3xl"
        animate={{ x: [0, 22, -16, 0], y: [0, -10, 16, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: `translate3d(${pointer.x * 14}px, ${pointer.y * 8}px, 0)` }}
      />
      <motion.div
        className="absolute right-[-16%] top-[-6%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(15,76,83,0.2)_0%,rgba(15,76,83,0.07)_36%,transparent_76%)] blur-3xl"
        animate={{ x: [0, -24, 12, 0], y: [0, 16, -18, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -12}px, 0)` }}
      />

      <motion.div
        className="absolute left-[-4%] top-[14%] h-[32rem] w-[18rem] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--gold)_12%,transparent),transparent)] blur-[34px]"
        animate={{ x: [0, 12, 0], y: [0, 16, 0], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[14%] top-[8%] h-[1px] w-[34rem] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--foreground)_10%,transparent),transparent)]"
        animate={{ x: [-20, 14, -20], opacity: [0.16, 0.28, 0.16] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[10%] top-[20%] h-[1px] w-[22rem] bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--teal)_20%,transparent),transparent)]"
        animate={{ x: [16, -14, 16], opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[18%] top-[24%] h-[18rem] w-[18rem] rounded-full border border-[color:color-mix(in_srgb,var(--foreground)_6%,transparent)]"
        animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.14, 0.28, 0.14] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[8%] top-[16%] h-[24rem] w-[24rem] rounded-full border border-[color:color-mix(in_srgb,var(--teal)_8%,transparent)]"
        animate={{ scale: [1.04, 0.98, 1.04], opacity: [0.12, 0.24, 0.12] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[22%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--gold)_10%,transparent)_0%,transparent_68%)] blur-[48px]"
        animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[10%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--teal)_11%,transparent)_0%,transparent_70%)] blur-[52px]"
        animate={{ scale: [1.04, 0.96, 1.04], opacity: [0.14, 0.24, 0.14] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[30%] top-[12%] h-[28rem] w-[14rem] bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--foreground)_7%,transparent),transparent)] blur-[22px]"
        animate={{ rotate: [-12, -8, -12], x: [0, 12, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[18%] top-[10%] h-[24rem] w-[12rem] bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--teal)_14%,transparent),transparent)] blur-[22px]"
        animate={{ rotate: [14, 10, 14], x: [0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--background)_72%,transparent))]" />
      <div className="absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,var(--background),transparent)]" />
      <div className="absolute inset-y-0 right-0 w-20 bg-[linear-gradient(270deg,var(--background),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,var(--background),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,color-mix(in_srgb,var(--teal)_9%,transparent),transparent_24%),radial-gradient(circle_at_28%_26%,color-mix(in_srgb,var(--gold)_7%,transparent),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,transparent_38%,color-mix(in_srgb,var(--foreground)_5%,transparent)_49%,transparent_60%)] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_8%,transparent),transparent_30%,transparent_78%,color-mix(in_srgb,var(--background)_18%,transparent))]" />
    </div>
  );
}
