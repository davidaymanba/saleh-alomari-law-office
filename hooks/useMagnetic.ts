"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * زر مغناطيسي: يتبع المؤشر بلطف داخل حدوده (أجهزة المؤشر الدقيق فقط).
 * العنصر الداخلي [data-magnetic-inner] يتحرك بقدر أكبر قليلًا لإحساس بالعمق.
 */
export function useMagnetic<T extends HTMLElement = HTMLSpanElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.finePointer} and (prefers-reduced-motion: no-preference)`, () => {
        const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.5, ease: "power3.out" }) : null;
        const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.5, ease: "power3.out" }) : null;

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * strength);
          yTo(dy * strength);
          ixTo?.(dx * strength * 0.35);
          iyTo?.(dy * strength * 0.35);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
          ixTo?.(0);
          iyTo?.(0);
        };

        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
