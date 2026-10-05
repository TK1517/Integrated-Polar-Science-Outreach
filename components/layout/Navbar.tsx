"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

const navigation = [
  { name: "Knowledge", href: "/knowledge" },
  { name: "Research", href: "/publications" },
  { name: "Expeditions", href: "/expeditions" },
  { name: "Media", href: "/media" },
  { name: "Knowledge Graph", href: "/knowledge-graph" },
  { name: "Survival Challenge", href: "/polar-challenge" },
];

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("polar-theme");
    const shouldUseDark =
      savedTheme === "dark" ||
      (savedTheme === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Theme preference comes from browser storage/media, so this state must
    // be synchronized after mount to avoid reading browser APIs on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setThemeReady(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem("polar-theme", nextTheme ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
            ❄
          </div>

          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Polar Science
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              India
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/search"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Search
          </Link>

          {themeReady && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={darkMode}
              title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {themeReady && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={darkMode}
              title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          <button
            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
