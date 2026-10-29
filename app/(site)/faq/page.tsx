import type { Metadata } from "next";
import { getFaq } from "@/lib/content/queries";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات عن الأسئلة الشائعة حول الرسوم، والاستشارات والتوكيل، وطريقة إرسال الطلب، والسرية.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqGroups = getFaq();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <>
      <PageHero
        crumbs={[{ href: "/faq", label: "الأسئلة الشائعة" }]}
        eyebrow="الأسئلة الشائعة"
        title="إجابات قبل أن تسأل"
        lead="جمعنا أكثر ما يُسأل عنه حول الرسوم وطريقة العمل والسرية. إن لم تجد إجابتك، راسلنا مباشرة."
      >
        <nav aria-label="أقسام الأسئلة" className="flex flex-wrap gap-2">
          {faqGroups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="border border-ink/20 bg-paper px-4 py-2 text-sm font-medium transition-colors duration-300 hover:bg-ink hover:text-paper">
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-x py-16 md:py-24">
        {faqGroups.map((g) => (
          <section key={g.id} id={g.id} className="grid scroll-mt-28 gap-8 py-10 lg:grid-cols-12">
            <h2 className="text-2xl md:text-3xl lg:col-span-4">{g.title}</h2>
            <Reveal className="lg:col-span-8">
              <Accordion items={g.items} />
            </Reveal>
          </section>
        ))}
      </div>

      <CtaBand title="لم تجد إجابتك؟" text="أرسل سؤالك أو وصفًا مختصرًا لموضوعك، وسنعود إليك." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
