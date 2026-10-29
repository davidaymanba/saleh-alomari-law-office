"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type AccordionItem = { q: string; a: string };

export function Accordion({
  items,
  className,
  dark = false,
}: {
  items: AccordionItem[];
  className?: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const first = useRef(true);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);
      const instant = first.current || prefersReducedMotion();
      first.current = false;
      panels.forEach((p, i) => {
        const isOpen = i === open;
        gsap.to(p, {
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          duration: instant ? 0 : 0.6,
          ease: "najdi",
          overwrite: true,
        });
      });
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <div ref={root} className={cn("border-t", dark ? "border-paper/15" : "border-ink/15", className)}>
      {items.map((item, i) => {
        const isOpen = i === open;
        const btnId = `${baseId}-b${i}`;
        const panelId = `${baseId}-p${i}`;
        return (
          <div key={item.q} className={cn("border-b", dark ? "border-paper/15" : "border-ink/15")}>
            <h3 className="font-sans text-base font-semibold md:text-lg">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-start"
              >
                <span className={cn("transition-colors duration-300", !isOpen && "group-hover:text-gold")}>
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative grid size-9 shrink-0 place-items-center border transition-colors duration-500",
                    isOpen ? "border-gold bg-gold text-paper" : dark ? "border-paper/25" : "border-ink/20",
                  )}
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span
                    className={cn(
                      "absolute h-3.5 w-px bg-current transition-transform duration-500 ease-[var(--ease-najdi)]",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              data-panel
              aria-hidden={!isOpen}
              inert={!isOpen}
              className="h-0 overflow-hidden opacity-0"
            >
              <p className={cn("max-w-3xl pb-6 leading-loose", dark ? "text-paper/75" : "text-muted")}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
