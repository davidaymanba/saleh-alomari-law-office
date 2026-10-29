import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import { getArea, getGuide, getGuides, getSite } from "@/lib/content/queries";
import type { GuideBlock } from "@/lib/content/schema";
import { formatDate, readingTime } from "@/lib/content/utils";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";
import { GuideCard } from "@/components/sections/GuideCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.title, description: guide.excerpt, publishedTime: guide.publishedAt },
  };
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="my-6 flex gap-3 border-s-2 border-gold bg-sand/70 p-5 text-base">
          <Info className="mt-1 size-5 shrink-0 text-gold" aria-hidden="true" />
          <p className="!my-0">{block.text}</p>
        </aside>
      );
  }
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  const site = getSite();
  const area = guide.relatedArea ? getArea(guide.relatedArea) : undefined;
  const others = getGuides().filter((g) => g.slug !== guide.slug).slice(0, 2);
  const consultHref = area ? `/consultation?area=${area.slug}` : "/consultation";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    inLanguage: "ar",
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/guides/${guide.slug}`,
  };

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/guides", label: "أدلة قانونية" },
          { href: `/guides/${guide.slug}`, label: guide.title },
        ]}
        eyebrow={guide.category}
        title={guide.title}
        lead={guide.excerpt}
      >
        <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time>
          <span>{readingTime(guide)} دقائق قراءة</span>
        </p>
      </PageHero>

      <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="محتويات الدليل" className="lg:sticky lg:top-28">
            <h2 className="font-sans text-sm font-semibold text-gold">محتويات الدليل</h2>
            <ol className="mt-4 grid gap-2 border-s border-ink/15 ps-4 text-sm">
              {guide.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted transition-colors hover:text-ink">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="prose-ar text-lg leading-loose lg:col-span-7 lg:col-start-5">
          {guide.sections.map((s) => (
            <Reveal key={s.id} as="section" className="scroll-mt-28 [&+section]:mt-12" >
              <h2 id={s.id} className="scroll-mt-28 text-2xl md:text-3xl">
                {s.heading}
              </h2>
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </Reveal>
          ))}

          <div className="mt-14 border border-ink/15 p-6 text-base">
            <p className="!mt-0 text-muted">{site.legal.disclaimer} لكل حالة ظروفها، ويُستحسن عرض موضوعك على محامٍ.</p>
            <div className="mt-6">
              <Button href={consultHref} icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
                {area ? `اطلب استشارة في ${area.title}` : "اطلب استشارة"}
              </Button>
            </div>
          </div>
        </article>
      </div>

      {others.length > 0 && (
        <section className="container-x pb-24">
          <h2 className="text-2xl md:text-3xl">أدلة أخرى</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {others.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>
      )}

      <CtaBand href={consultHref} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
