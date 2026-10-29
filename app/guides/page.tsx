import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { site } from "@/data/site";
import { PageHero } from "@/components/sections/PageHero";
import { GuideCard } from "@/components/sections/GuideCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "أدلة قانونية",
  description: "أدلة قانونية مبسّطة عن الفصل التعسفي، وقسمة التركات، ومراجعة العقود، وغيرها من المسائل الشائعة في المملكة.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const sorted = [...guides].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/guides", label: "أدلة قانونية" }]}
        eyebrow="أدلة قانونية"
        title="اعرف حقوقك بلغة واضحة"
        lead={`أدلة مبسّطة تشرح الإجراءات الشائعة. ${site.legal.disclaimer}`}
      />
      <section className="container-x py-20 md:py-28">
        <Reveal selector="[data-card]" stagger={0.1} className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((g) => (
            <div key={g.slug} data-card>
              <GuideCard guide={g} />
            </div>
          ))}
        </Reveal>
      </section>
      <CtaBand />
    </>
  );
}
