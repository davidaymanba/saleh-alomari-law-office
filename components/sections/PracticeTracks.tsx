"use client";

import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { gsap, Flip, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getAreasByTrack, tracks, type Track } from "@/data/practiceAreas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "./SectionHeader";
import { AreaCard } from "./AreaCard";

const order: Track[] = ["individuals", "companies"];

/** مجالات الممارسة بمسارين؛ مؤشر التبويب ينتقل بـ Flip وتظهر البطاقات بتتابع */
export function PracticeTracks() {
  const [track, setTrack] = useState<Track>("individuals");
  const root = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const select = (t: Track) => {
    if (t === track) return;
    flipState.current = Flip.getState(root.current?.querySelector("[data-flip-id='tab-indicator']") ?? null);
    setTrack(t);
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      if (prefersReducedMotion()) return;
      Flip.from(state, {
        targets: root.current?.querySelector("[data-flip-id='tab-indicator']"),
        duration: 0.7,
        ease: "najdi",
      });
      gsap.from(gsap.utils.toArray("[data-area-card]", root.current), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.06,
        clearProps: "all",
      });
    },
    { scope: root, dependencies: [track] },
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const next = order[(order.indexOf(track) + 1) % order.length];
    select(next);
    root.current?.querySelector<HTMLButtonElement>(`#tab-${next}`)?.focus();
  };

  const areas = getAreasByTrack(track);

  return (
    <section ref={root} className="relative bg-sand py-24 md:py-32">
      <div className="texture-dots absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeader
          eyebrow="مجالات الممارسة"
          title="نعمل مع الأفراد والشركات"
          lead={tracks[track].lead}
          action={
            <div role="tablist" aria-label="المسار" onKeyDown={onKeyDown} className="flex border border-ink/20 bg-paper p-1">
              {order.map((t) => {
                const active = t === track;
                return (
                  <button
                    key={t}
                    id={`tab-${t}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="areas-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => select(t)}
                    className={cn(
                      "relative cursor-pointer px-6 py-2.5 text-sm font-semibold transition-colors duration-500 md:px-8",
                      active ? "text-paper" : "text-ink hover:text-clay",
                    )}
                  >
                    {active && <span data-flip-id="tab-indicator" className="absolute inset-0 bg-ink" aria-hidden="true" />}
                    <span className="relative">{tracks[t].title}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        <div
          id="areas-panel"
          role="tabpanel"
          aria-labelledby={`tab-${track}`}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {areas.map((a) => (
            <div key={a.slug} data-area-card>
              <AreaCard area={a} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/practice-areas" variant="ink" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
            كل مجالات الممارسة
          </Button>
        </div>
      </div>
    </section>
  );
}
