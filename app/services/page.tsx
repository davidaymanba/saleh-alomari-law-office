import type { Metadata } from "next";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

export const metadata: Metadata = {
  title: "الخدمات",
  description: `الاستشارات القانونية، والتوكيل بقضية، وكتابة المذكرات، ورفع الدعاوى، وحضور الجلسات. ${site.feesNote}.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/services", label: "الخدمات" }]}
        eyebrow="الخدمات"
        title="خدمات قانونية واضحة النطاق"
        lead={`خمس خدمات تغطي احتياجك من الرأي القانوني حتى التمثيل الكامل. ${site.feesNote}، وتُوضَّح لك قبل بدء العمل.`}
      >
        <nav aria-label="الخدمات" className="flex flex-wrap gap-2">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="border border-ink/20 bg-paper px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-x py-12 md:py-20">
        {services.map((s, i) => (
          <article
            key={s.slug}
            id={s.slug}
            className="grid scroll-mt-28 gap-10 border-b border-ink/15 py-16 last:border-b-0 md:py-20 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <Reveal variant="fade" className="flex items-center gap-4">
                <span className="on-dark grid size-14 place-items-center bg-ink text-clay-soft">
                  <Icon name={s.icon} className="size-7" />
                </span>
                <span className="font-display text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              </Reveal>
              <SplitHeading className="mt-6 text-3xl md:text-4xl">{s.title}</SplitHeading>
              <Reveal delay={0.1}>
                <p className="mt-4 text-lg leading-relaxed text-muted">{s.description}</p>
                <div className="mt-8">
                  <Button
                    href={`/consultation?service=${s.slug}`}
                    variant="primary"
                    icon={<ArrowLeft className="size-4" aria-hidden="true" />}
                  >
                    اطلب هذه الخدمة
                  </Button>
                </div>
              </Reveal>
            </div>
            <div className="grid gap-8 lg:col-span-6 lg:col-start-7">
              <Reveal>
                <h3 className="font-sans text-sm font-semibold text-clay">كيف نعمل</h3>
                <p className="mt-3 text-lg leading-loose">{s.details}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="font-sans text-sm font-semibold text-clay">متى تحتاجها؟</h3>
                <ul className="mt-4 grid gap-3">
                  {s.whenNeeded.map((w) => (
                    <li key={w} className="flex items-start gap-3 leading-relaxed">
                      <CircleCheck className="mt-1 size-5 shrink-0 text-clay" strokeWidth={1.5} aria-hidden="true" />
                      {w}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </article>
        ))}
      </div>

      <ProcessSection />
      <CtaBand />
    </>
  );
}
