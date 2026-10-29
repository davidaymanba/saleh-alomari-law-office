"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { onRevealReady } from "@/lib/motion-state";

/** عدّاد تصاعدي؛ يعرض القيمة النهائية في SSR وعند تقليل الحركة */
export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (ctx) => {
        const obj = { n: 0 };
        el.textContent = "0";
        const stop = onRevealReady(() => {
          ctx.add(() => {
            ScrollTrigger.create({
              trigger: el,
              start: "top 92%",
              once: true,
              onEnter: () =>
                gsap.to(obj, {
                  n: value,
                  duration: 1.8,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent = String(Math.round(obj.n));
                  },
                }),
            });
          });
        });
        return () => {
          stop();
          el.textContent = String(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
