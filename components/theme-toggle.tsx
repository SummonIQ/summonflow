"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0 shadow-none outline-none text-[var(--muted)] transition hover:text-[var(--foreground)]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.98, rotate: isDark ? -180 : 180 }}
      transition={{ type: "spring", stiffness: 420, damping: 24, mass: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, scale: 0.7, rotate: -32 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 32 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Moon className="h-4 w-4 text-[#4f6dca]" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, scale: 0.7, rotate: 32 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: -32 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Sun className="h-4 w-4 text-[#f0b44d]" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
