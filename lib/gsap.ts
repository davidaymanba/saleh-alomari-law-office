"use client";

/**
 * نقطة التسجيل الوحيدة لـ GSAP وإضافاته.
 * استورد gsap وكل الإضافات من هنا فقط حتى تُسجَّل مرة واحدة.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let registered = false;

function register() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    MorphSVGPlugin,
    Flip,
    CustomEase,
  );
  // "najdi": حركة متوازنة ثقيلة البداية والنهاية — للانتقالات والمسح
  CustomEase.create("najdi", "0.65, 0, 0.35, 1");
  // "settle": حجر يستقر في مكانه — للظهور
  CustomEase.create("settle", "0.22, 1, 0.36, 1");
  gsap.defaults({ ease: "settle", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

register();

export const EASE = {
  najdi: "najdi",
  settle: "settle",
} as const;

/** مدد الحركة الموحّدة */
export const DUR = {
  reveal: 1.1,
  revealLong: 1.4,
  micro: 0.4,
} as const;

/**
 * نقاط التوقف المستخدمة مع gsap.matchMedia().
 * desktop: كل شيء — tablet: بارالاكس مخفف — mobile: الظهور فقط — reduce: بلا حركة تقريبًا
 */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  tablet:
    "(min-width: 768px) and (max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(MQ.reduce).matches
  );
}

export function isRTL() {
  return typeof document !== "undefined" && document.documentElement.dir === "rtl";
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, Flip, CustomEase, useGSAP };
