"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis-store";
import { isRevealBlocked, onRevealReady } from "@/lib/motion-state";

/** تمرير سلس مربوط بمؤقت GSAP؛ يُعطَّل كليًا عند تفضيل تقليل الحركة */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1, autoRaf: false, anchors: { offset: -96 } });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // لا تمرير أثناء شاشة التحميل
    let cancelWait = () => {};
    if (isRevealBlocked()) {
      lenis.stop();
      cancelWait = onRevealReady(() => lenis.start());
    }

    return () => {
      cancelWait();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
