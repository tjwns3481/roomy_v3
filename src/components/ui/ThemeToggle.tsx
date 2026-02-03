"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydration pattern
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 w-10 h-10" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      <span className="material-symbols-outlined text-[20px] text-slate-700 dark:text-yellow-400">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
