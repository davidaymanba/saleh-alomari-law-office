import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { getArea, getAreas, getAreasByTrack, getGuides, getServices, getSite } from "@/lib/content/queries";
import { tracks } from "@/lib/content/schema";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { PageHero } from "@/components/sections/PageHero";
import { AreaCard } from "@/components/sections/AreaCard";
import { GuideCard } from "@/components/sections/GuideCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAreas().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = getArea((await params).slug);
  if (!area) return {};
  return {
    title: area.title,
    description: `${area.description} ${getSite().feesNote}.`,
    alternates: { canonical: `/practice-areas/${area.slug}` },
  };
}

export default async function PracticeAreaPage({ params }: Props) {
  const area = getArea((await params).slug);
  if (!area) notFound();

  const services = getServices();
  const related = getGuides().filter((g) => g.relatedArea === area.slug);
  const siblings = getAreasByTrack(area.track).filter((a) => a.slug !== area.slug).slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/practice-areas", label: "مجالات الممارسة" },
          { href: `/practice-areas/${area.slug}`, label: area.title },
        ]}
        eyebrow={tracks[area.track].title}
        title={area.title}
        lead={area.description}
      >
        <Button href={`/consultation?area=${area.slug}`} icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
          اطلب استشارة في {area.title}
        </Button>
      </PageHero>

      <section className="container-x grid gap-14 py-24 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal variant="fade">
            <Icon name={area.icon} className="size-12 text-gold" strokeWidth={1.2} />
          </Reveal>
          <SplitHeading className="mt-6 text-2xl leading-relaxed md:text-3xl">{area.intro}</SplitHeading>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <h2 className="font-sans text-sm font-semibold text-gold">نساعدك في</h2>
          </Reveal>
          <Reveal as="ul" selector="li" stagger={0.08} className="mt-5 border-t border-ink/15">
            {area.helpWith.map((h) => (
              <li key={h} className="flex items-start gap-3 border-b border-ink/15 py-4 text-lg">
                <CircleCheck className="mt-1.5 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                {h}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-sand/60 py-20 md:py-24">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl">كيف يمكننا خدمتك في هذا المجال؟</h2>
          <p className="mt-3 text-muted">اختر نوع الخدمة، وسيُجهَّز طلبك بالمجال والخدمة مسبقًا.</p>
          <Reveal as="ul" selector="li" stagger={0.06} className="mt-8 flex flex-wrap gap-3">
            {services.map((s) => (
              <li key={s.slug}>
                <TransitionLink
                  href={`/consultation?area=${area.slug}&service=${s.slug}`}
                  className="group inline-flex items-center gap-3 border border-ink/20 bg-paper px-5 py-3 font-medium transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <Icon name={s.icon} className="size-5 text-gold group-hover:text-gold-soft dark:group-hover:text-[#76623d]" />
                  {s.title}
                </TransitionLink>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-20 md:py-24">
          <h2 className="text-2xl md:text-3xl">أدلة ذات صلة</h2>
          <Reveal selector="[data-card]" className="mt-10 grid gap-10 md:grid-cols-3">
            {related.map((g) => (
              <div key={g.slug} data-card>
                <GuideCard guide={g} />
              </div>
            ))}
          </Reveal>
        </section>
      )}

      <section className="container-x pb-24 md:pb-28">
        <h2 className="text-2xl md:text-3xl">مجالات أخرى {tracks[area.track].title}</h2>
        <Reveal selector="[data-card]" stagger={0.08} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siblings.map((a) => (
            <div key={a.slug} data-card>
              <AreaCard area={a} />
            </div>
          ))}
        </Reveal>
      </section>

      <CtaBand
        title={`لديك موضوع في ${area.title}؟`}
        href={`/consultation?area=${area.slug}`}
        whatsappText={`السلام عليكم، أرغب في الاستفسار عن موضوع في ${area.title}.`}
      />
    </>
  );
}
