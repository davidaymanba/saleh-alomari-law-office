"use client";

import type Lenis from "lenis";

/** مرجع مشترك لنسخة Lenis الحالية (null عند تفضيل تقليل الحركة) */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** تمرير سلس إلى عنصر أو موضع، مع الرجوع للتمرير الأصلي عند عدم توفر Lenis */
export function scrollToTarget(
  target: string | number | HTMLElement,
  opts: { offset?: number; immediate?: boolean } = {},
) {
  const { offset = 0, immediate = false } = opts;
  if (instance) {
    instance.scrollTo(target, { offset, immediate, force: true, duration: 1.2 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
}
