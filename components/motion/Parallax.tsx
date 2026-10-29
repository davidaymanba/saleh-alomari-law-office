"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * إزاحة رأسية مرتبطة بالتمرير (سطح المكتب كامل، الجهاز اللوحي مخفف، الجوال بلا إزاحة).
 * speed موجب: يتحرك أبطأ من الصفحة.
 */
export function Parallax({
  children,
  speed = 12,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const build = (amount: number) =>
        gsap.fromTo(
          el,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      mm.add(MQ.desktop, () => {
        build(speed);
      });
      mm.add(MQ.tablet, () => {
        build(speed / 2);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
