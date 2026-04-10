"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <button
      onClick={() => setTheme(next)}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
      title={`Theme: ${theme}`}
    >
      {theme === "dark" && <Moon className="h-3.5 w-3.5" />}
      {theme === "light" && <Sun className="h-3.5 w-3.5" />}
      {theme === "system" && <Monitor className="h-3.5 w-3.5" />}
    </button>
  );
}
