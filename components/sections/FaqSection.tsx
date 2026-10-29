import { ArrowLeft } from "lucide-react";
import { homeFaq } from "@/data/faq";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";

export function FaqSection() {
  return (
    <section className="bg-sand/60 py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeader eyebrow="أسئلة شائعة" title="قبل أن تتواصل معنا" />
          <Reveal variant="fade" delay={0.2} className="mt-8">
            <Button href="/faq" variant="outline" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
              كل الأسئلة
            </Button>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <Accordion items={homeFaq} />
        </Reveal>
      </div>
    </section>
  );
}
