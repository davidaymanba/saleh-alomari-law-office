"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { blockReveal, releaseReveal } from "@/lib/motion-state";
import { getLenis, scrollToTarget } from "@/lib/lenis-store";
import { BrandMark } from "@/components/ui/BrandMark";

type Ctx = { navigate: (href: string) => void };

const TransitionContext = createContext<Ctx | null>(null);

export function usePageTransition() {
  return useContext(TransitionContext);
}

/**
 * انتقال الصفحات: ستارة بحافة شُرفات تصعد لتغطي الصفحة، ثم يتم التنقل،
 * ثم تكمل صعودها لتكشف الصفحة الجديدة وتبدأ حركات الظهور فيها.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { contextSafe } = useGSAP({ scope: curtain });

  const uncover = contextSafe(() => {
    const el = curtain.current;
    if (!el || !busy.current) return;
    if (failsafe.current) clearTimeout(failsafe.current);

    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { visibility: "hidden", yPercent: 100 });
          busy.current = false;
        },
      })
      .to(el.querySelector("[data-curtain-mark]"), { opacity: 0, duration: 0.25 })
      .to(el, {
        yPercent: -100,
        duration: 0.9,
        ease: "najdi",
        onStart: () => {
          getLenis()?.start();
          releaseReveal();
        },
      });
  });

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      const samePath = url.pathname === window.location.pathname;

      if (samePath) {
        if (url.hash) scrollToTarget(url.hash, { offset: -96 });
        else if (url.search !== window.location.search) router.push(href, { scroll: false });
        else scrollToTarget(0);
        return;
      }
      if (busy.current) return;
      if (prefersReducedMotion() || !curtain.current) {
        router.push(href);
        return;
      }

      busy.current = true;
      blockReveal();
      getLenis()?.stop();
      router.prefetch(href);

      const el = curtain.current;
      gsap
        .timeline()
        .set(el, { visibility: "visible", yPercent: 100 })
        .set(el.querySelector("[data-curtain-mark]"), { opacity: 0 })
        .to(el, { yPercent: 0, duration: 0.75, ease: "najdi" })
        .to(el.querySelector("[data-curtain-mark]"), { opacity: 1, duration: 0.3 }, "-=0.2")
        .call(() => {
          router.push(href, { scroll: false });
          // إن لم يتغير المسار لأي سبب لا تبقى الصفحة مغطاة
          failsafe.current = setTimeout(uncover, 4000);
        });
    },
    [router, uncover],
  );

  useEffect(() => {
    if (busy.current) uncover();
  }, [pathname, uncover]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="on-dark pointer-events-none invisible fixed inset-x-0 -top-4 -bottom-4 z-[90] flex flex-col text-ink"
      >
        <div className="crenellation" />
        <div className="grid flex-1 place-items-center bg-ink">
          <span data-curtain-mark className="opacity-0">
            <BrandMark height={84} />
          </span>
        </div>
        <div className="crenellation rotate-180" />
      </div>
    </TransitionContext.Provider>
  );
}
