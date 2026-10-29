import type { Metadata } from "next";
import { getSite } from "@/lib/content/queries";
import { PageHero } from "@/components/sections/PageHero";
import { TrustStats } from "@/components/sections/TrustStats";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

export function generateMetadata(): Metadata {
  return {
    title: "من نحن",
    description: `تعرّف على ${getSite().name}: رؤيتنا وقيمنا وطريقة عملنا مع الأفراد والشركات.`,
    alternates: { canonical: "/about" },
  };
}

export default function AboutPage() {
  const site = getSite();
  return (
    <>
      <PageHero
        crumbs={[{ href: "/about", label: "من نحن" }]}
        eyebrow="من نحن"
        title="مكتبٌ يبني الثقة بالوضوح والمتابعة"
        lead={`${site.name}؛ مكتب محاماة سعودي يقدّم الاستشارات القانونية والتمثيل القضائي للأفراد والشركات.`}
      />

      <section className="container-x grid gap-12 py-24 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="eyebrow">قصتنا</span>
          <SplitHeading className="mt-4 text-3xl leading-snug md:text-4xl">
            أسّسنا المكتب ليجد الموكّل من يشرح له موقفه بصدق، ويتابع ملفه حتى النهاية.
          </SplitHeading>
        </div>
        <Reveal selector="p" stagger={0.12} className="grid gap-6 text-lg leading-loose text-muted lg:col-span-6 lg:col-start-7">
          <p>
            أسّس {site.founder} المكتب على قناعة بسيطة: أن أكثر ما يحتاجه صاحب الموضوع القانوني هو أن يفهم موقفه بوضوح،
            وأن يعرف ما الذي سيحدث بعد ذلك، وكم سيكلّفه، قبل أن يلتزم بأي شيء.
          </p>
          <p>
            لذلك نبدأ كل طلب بدراسته، ثم نعرض الخيارات المتاحة بما لها وما عليها، ونحدد الرسوم كتابيًا. وبعد التوكيل
            نبقى على تواصل منتظم، ونطلعك على كل مستجد في ملفك.
          </p>
          <p>
            نعمل مع الأفراد في مسائل الأسرة والعمل والعقار والتركات والقضايا الجزائية والتنفيذ، ومع الشركات في التأسيس
            والعقود والنزاعات التجارية والتحكيم والملكية الفكرية.
          </p>
        </Reveal>
      </section>

      <TrustStats />
      <FounderSection />
      <ValuesSection />
      <ProcessSection steps={site.processSteps} />
      <CtaBand />
    </>
  );
}
