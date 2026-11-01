"use client";

import { useLayoutEffect } from "react";
import { SunMoon } from "lucide-react";

export default function ThemeToggle() {
  // Re-apply the stored theme after React's development remount clears the
  // attribute set by the inline script in the root layout. No-op in production.
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        document.documentElement.setAttribute("data-theme", stored);
      }
    } catch {
      // Storage can be unavailable in restricted browser modes.
    }
  }, []);

  const toggleTheme = () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";

    document.documentElement.setAttribute("data-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch {
      // The theme still applies for this session if storage is unavailable.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="inline-flex h-9 w-9 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
    >
      <SunMoon size={16} strokeWidth={1.75} />
    </button>
  );
}
