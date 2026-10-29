"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ, DUR } from "@/lib/gsap";
import { onRevealReady } from "@/lib/motion-state";

export type RevealVariant = "fade-up" | "fade" | "clip" | "curtain";

export type RevealOptions = {
  /** محدد العناصر داخل الحاوية؛ بدونه تتحرك الحاوية نفسها */
  selector?: string;
  variant?: RevealVariant;
  y?: number;
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
};

function states(variant: RevealVariant, y: number): [gsap.TweenVars, gsap.TweenVars] {
  switch (variant) {
    case "fade":
      return [{ opacity: 0 }, { opacity: 1 }];
    case "clip":
      return [
        { clipPath: "inset(100% 0% 0% 0%)", y: y * 0.6 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0 },
      ];
    case "curtain":
      return [
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)" },
      ];
    default:
      return [
        { opacity: 0, y },
        { opacity: 1, y: 0 },
      ];
  }
}

/**
 * ظهور عند التمرير. الحالة الابتدائية تُضبط داخل useGSAP (لا في SSR)،
 * فيبقى المحتوى ظاهرًا كاملًا عند تعطيل JavaScript أو تفضيل تقليل الحركة.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(opts: RevealOptions = {}) {
  const ref = useRef<T>(null);
  const {
    selector,
    variant = "fade-up",
    y = 40,
    stagger = 0.12,
    delay = 0,
    duration = DUR.reveal,
    start = "top 88%",
  } = opts;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const targets = selector ? gsap.utils.toArray<HTMLElement>(selector, root) : [root];
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (ctx) => {
        const [from, to] = states(variant, y);
        gsap.set(targets, from);
        const stop = onRevealReady(() => {
          ctx.add(() => {
            ScrollTrigger.batch(targets, {
              start,
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  ...to,
                  duration,
                  delay,
                  stagger,
                  ease: "settle",
                  overwrite: true,
                  clearProps: "transform,clipPath",
                }),
            });
          });
        });
        return stop;
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
