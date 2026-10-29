"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, MQ, DUR } from "@/lib/gsap";
import { onRevealReady } from "@/lib/motion-state";

export type SplitRevealOptions = {
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
};

/**
 * إظهار العنوان سطرًا سطرًا بقناع.
 * ⚠️ النص العربي يُقسَّم إلى كلمات وأسطر فقط — لا تقسّمه إلى حروف أبدًا لأن ذلك يكسر اتصال الحروف.
 */
export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>(
  opts: SplitRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const { delay = 0, stagger = 0.12, duration = DUR.revealLong, start = "top 88%" } = opts;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, (ctx) => {
        let played = false;
        let tween: gsap.core.Tween | null = null;

        const split = SplitText.create(el, {
          type: "words,lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self: SplitText) {
            tween = gsap.from(self.lines, {
              yPercent: 110,
              duration,
              delay: played ? 0 : delay,
              stagger,
              ease: "settle",
              paused: !played,
            });
            return tween;
          },
        });

        const stop = onRevealReady(() => {
          ctx.add(() => {
            ScrollTrigger.create({
              trigger: el,
              start,
              once: true,
              onEnter: () => {
                played = true;
                tween?.play();
              },
            });
          });
        });

        return () => {
          stop();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
