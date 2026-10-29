"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onRevealReady } from "@/lib/motion-state";
import { whatsappUrl } from "@/lib/whatsapp";
import { site } from "@/data/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function WhatsAppFloat() {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (ctx) => {
        gsap.set(ref.current, { scale: 0, opacity: 0 });
        return onRevealReady(() => {
          ctx.add(() => {
            gsap.to(ref.current, { scale: 1, opacity: 1, duration: 0.8, delay: 1.2, ease: "back.out(1.6)" });
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      href={whatsappUrl(site.whatsappGreeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="group fixed end-5 bottom-5 z-30 flex items-center gap-2 rounded-full bg-[#1f7a4d] p-3.5 text-white shadow-lg shadow-ink/25 transition-colors duration-300 hover:bg-[#186440] md:end-8 md:bottom-8"
    >
      <WhatsAppIcon className="size-6" />
      <span className="sr-only">واتساب</span>
    </a>
  );
}
