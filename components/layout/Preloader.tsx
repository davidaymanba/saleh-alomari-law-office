"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { endPreload } from "@/lib/motion-state";
import { useSite } from "./SiteProvider";
import { BrandMark } from "@/components/ui/BrandMark";

import { PRELOAD_KEY } from "@/lib/preload";

/**
 * شاشة التحميل (أول زيارة في الجلسة فقط).
 * تُعرض من الخادم مباشرة، ويُخفيها سكربت <head> إن سبق عرضها في الجلسة نفسها.
 */
export function Preloader() {
  const site = useSite();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !document.documentElement.classList.contains("is-preloading")) return;

      const finish = () => {
        try {
          sessionStorage.setItem(PRELOAD_KEY, "1");
        } catch {}
      };

      if (prefersReducedMotion()) {
        finish();
        endPreload();
        return;
      }

      // يبقى ظاهرًا أثناء صعوده حتى بعد إزالة is-preloading
      root.classList.add("is-active");
      const q = gsap.utils.selector(root);

      gsap
        .timeline({
          delay: 0.15,
          onComplete: () => {
            root.classList.remove("is-active");
            finish();
          },
        })
        // الشعار يُكشف من اليمين إلى اليسار كاتجاه الكتابة
        .from(q("[data-pl-logo]"), { clipPath: "inset(0% 0% 0% 100%)", scale: 0.96, duration: 1.5, ease: "najdi" })
        .from(q("[data-pl-text]"), { yPercent: 110, duration: 0.9, stagger: 0.1 }, 0.55)
        .to(q("[data-pl-inner]"), { opacity: 0, y: -24, duration: 0.5, ease: "najdi" }, "+=0.35")
        .to(root, { yPercent: -100, duration: 1.05, ease: "najdi" }, "-=0.15")
        .call(endPreload, [], "<0.25");
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="preloader on-dark fixed inset-x-0 top-0 -bottom-4 z-[100] flex flex-col text-paper [&.is-active]:!flex"
    >
      <div className="relative grid flex-1 place-items-center bg-ink">
        <div data-pl-inner className="flex flex-col items-center gap-6">
          <span data-pl-logo className="block">
            <BrandMark height={150} priority />
          </span>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="overflow-hidden py-0.5">
              <span data-pl-text className="block text-sm text-paper/60">
                {site.brand.secondary}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="crenellation rotate-180 text-ink" />
    </div>
  );
}
