import { ArrowLeft } from "lucide-react";
import { services } from "@/data/services";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";

export function ServicesSection() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHeader
        eyebrow="الخدمات"
        title="خدمات قانونية واضحة النطاق"
        lead="اختر ما يناسب موضوعك: من رأي قانوني قبل اتخاذ قرارك، إلى تمثيل كامل حتى صدور الحكم."
        action={
          <Button href="/services" variant="outline" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
            تفاصيل الخدمات
          </Button>
        }
      />
      <Reveal as="ul" selector="li" stagger={0.08} className="mt-14 border-t border-ink/15">
        {services.map((s, i) => (
          <li key={s.slug} className="border-b border-ink/15">
            <TransitionLink
              href={`/services#${s.slug}`}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 md:grid-cols-[4rem_auto_1fr_auto] md:gap-8 md:py-9"
            >
              <span className="hidden font-display text-sm text-muted md:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="grid size-12 place-items-center border border-ink/15 text-clay transition-colors duration-500 group-hover:border-clay group-hover:bg-clay group-hover:text-paper md:size-14">
                <Icon name={s.icon} className="size-6" />
              </span>
              <span className="flex flex-col gap-1.5 md:flex-row md:items-baseline md:gap-10">
                <span className="font-display text-xl font-semibold transition-colors duration-300 group-hover:text-clay md:min-w-56 md:text-2xl">
                  {s.title}
                </span>
                <span className="text-sm leading-relaxed text-muted md:text-base">{s.description}</span>
              </span>
              <ArrowLeft
                className="size-5 shrink-0 text-muted transition-transform duration-500 ease-[var(--ease-settle)] group-hover:-translate-x-2 group-hover:text-clay"
                aria-hidden="true"
              />
            </TransitionLink>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
