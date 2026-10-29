import { ArrowLeft } from "lucide-react";
import { getGuides } from "@/lib/content/queries";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import { GuideCard } from "./GuideCard";

export function GuidesSection() {
  const guides = getGuides();
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHeader
        eyebrow="أدلة قانونية"
        title="اعرف حقوقك قبل أن تتخذ قرارك"
        lead="أدلة مبسّطة تشرح الإجراءات الشائعة بلغة واضحة."
        action={
          <Button href="/guides" variant="outline" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
            كل الأدلة
          </Button>
        }
      />
      <Reveal selector="[data-card]" stagger={0.12} className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {guides.slice(0, 3).map((g) => (
          <div key={g.slug} data-card>
            <GuideCard guide={g} />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
