"use client";

import { useRef } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onRevealReady } from "@/lib/motion-state";
import { useSite } from "@/components/layout/SiteProvider";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { LogoArch } from "./LogoArch";

export function Hero() {
  const site = useSite();
  const root = useRef<HTMLElement>(null);
  const [line1, line2 = ""] = site.tagline.split("…");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, (ctx) => {
        gsap.set(q("[data-hero-fade]"), { opacity: 0, y: 28 });
        gsap.set(q(".facade-line"), { drawSVG: "0%" });
        gsap.set(q(".facade-fill"), { opacity: 0 });
        gsap.set(q("[data-hero-logo]"), { clipPath: "inset(0% 0% 0% 100%)" });

        return onRevealReady(() => {
          ctx.add(() => {
            gsap
              .timeline({ delay: 0.2 })
              .to(q(".facade-line"), { drawSVG: "100%", duration: 2, stagger: 0.05, ease: "najdi" }, 0)
              .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.45)
              .to(q(".facade-fill"), { opacity: 1, duration: 1.4, stagger: 0.06, ease: "power1.inOut" }, 1.1)
              // الشعار يُكتب من اليمين إلى اليسار
              .to(q("[data-hero-logo]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "najdi" }, 1.2);
          });
        });
      });

      mm.add(MQ.desktop, () => {
        q<HTMLElement>("[data-depth], [data-hero-logo]").forEach((g) => {
          gsap.to(g, {
            yPercent: Number(g.dataset.depth ?? -1) * 10,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
        gsap.to(q("[data-hero-art]"), {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden pt-28 md:pt-32">
      <div className="texture-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="container-x grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="pb-6 lg:col-span-7 lg:pb-24">
          <p data-hero-fade className="eyebrow mb-6">
            محاماة واستشارات قانونية — المملكة العربية السعودية
          </p>
          <SplitHeading
            as="h1"
            delay={0.35}
            stagger={0.14}
            className="text-[2.6rem] leading-[1.3] font-bold sm:text-6xl lg:text-[4.4rem]"
          >
            {line2 ? `${line1}…` : line1}
            {line2 && (
              <>
                <br />
                <span className="text-gold-logo">{line2.trim()}</span>
              </>
            )}
          </SplitHeading>
          <p data-hero-fade className="mt-7 max-w-xl text-lg leading-loose text-muted md:text-xl">
            نقدّم الاستشارات القانونية والتمثيل القضائي للأفراد والشركات بفريق من المحامين المرخّصين، ونوضح لك
            موقفك وخياراتك قبل أي التزام.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap gap-3">
            <Button href="/consultation" icon={<ArrowLeft className="size-4.5" aria-hidden="true" />}>
              اطلب استشارة
            </Button>
            <Button
              href={whatsappUrl(site.contact.whatsapp, site.whatsappGreeting)}
              external
              variant="outline"
              icon={<WhatsAppIcon className="size-4.5" />}
            >
              تواصل عبر واتساب
            </Button>
          </div>
          <p data-hero-fade className="mt-6 inline-flex items-center gap-2 text-sm text-muted">
            <Info className="size-4 text-gold" aria-hidden="true" />
            {site.feesNote}، وتُوضَّح لك كتابيًا قبل بدء العمل.
          </p>
        </div>

        <div data-hero-art className="relative mx-auto w-full max-w-md text-ink lg:col-span-5 lg:max-w-none">
          <LogoArch className="mx-auto w-full max-w-[30rem]" />
        </div>
      </div>
    </section>
  );
}
