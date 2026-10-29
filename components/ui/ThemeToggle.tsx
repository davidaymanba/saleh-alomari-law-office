"use client";

import { useEffect, type MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { prefersReducedMotion } from "@/lib/gsap";
import { THEME_KEY, themeColors, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function current(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }
}

/** زر تبديل الوضع الليلي/النهاري؛ الأيقونة تُحدَّد بالـ CSS فلا اختلاف بين الخادم والمتصفح */
export function ThemeToggle({ className }: { className?: string }) {
  // اتباع مظهر النظام ما لم يختر الزائر مظهرًا بنفسه
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (localStorage.getItem(THEME_KEY)) return;
      } catch {}
      apply(mq.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    if (!document.startViewTransition || prefersReducedMotion()) {
      apply(next, true);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const t = document.startViewTransition(() => apply(next, true));
    t.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="تبديل الوضع الليلي والنهاري"
      title="الوضع الليلي / النهاري"
      className={cn(
        "grid size-11 cursor-pointer place-items-center border border-current/20 transition-colors duration-300 hover:border-current/60",
        className,
      )}
    >
      <Moon className="size-[1.15rem] dark:hidden" strokeWidth={1.6} aria-hidden="true" />
      <Sun className="hidden size-[1.15rem] dark:block" strokeWidth={1.6} aria-hidden="true" />
    </button>
  );
}
