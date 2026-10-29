"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import type { SiteSettings } from "@/lib/content/schema";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";

/** خطوات العمل؛ الخط الواصل يُرسم مع التمرير */
export function ProcessSection({
  steps: processSteps,
  eyebrow = "آلية العمل",
}: {
  steps: SiteSettings["processSteps"];
  eyebrow?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-process-line]",
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: { trigger: "[data-process-steps]", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="container-x py-24 md:py-32">
      <SectionHeader
        eyebrow={eyebrow}
        title="من أول رسالة حتى إنجاز طلبك"
        lead="خطوات واضحة تعرف معها أين يقف طلبك، وما الخطوة التالية، وما الرسوم قبل أي التزام."
      />
      <div data-process-steps className="relative mt-16">
        {/* الخط الأفقي (سطح المكتب) — يُرسم من اليمين إلى اليسار */}
        <svg className="absolute inset-x-0 top-7 hidden h-px w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 1" aria-hidden="true">
          <line x1="100" y1="0.5" x2="0" y2="0.5" style={{ stroke: "var(--color-ink)" }} strokeOpacity="0.15" vectorEffect="non-scaling-stroke" />
          <line data-process-line x1="100" y1="0.5" x2="0" y2="0.5" style={{ stroke: "var(--color-gold)" }} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* الخط الرأسي (الجوال) */}
        <svg className="absolute top-0 bottom-0 start-7 w-px lg:hidden" preserveAspectRatio="none" viewBox="0 0 1 100" aria-hidden="true">
          <line x1="0.5" y1="0" x2="0.5" y2="100" style={{ stroke: "var(--color-ink)" }} strokeOpacity="0.15" vectorEffect="non-scaling-stroke" />
          <line data-process-line x1="0.5" y1="0" x2="0.5" y2="100" style={{ stroke: "var(--color-gold)" }} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>

        <Reveal as="ol" selector="li" stagger={0.12} className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
          {processSteps.map((step, i) => (
            <li key={step.title} className="relative flex gap-6 lg:flex-col">
              <span className="relative z-10 grid size-14 shrink-0 place-items-center border border-ink/20 bg-paper font-display text-lg font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
