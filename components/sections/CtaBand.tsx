import { ArrowLeft } from "lucide-react";
import { getSite } from "@/lib/content/queries";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Props = {
  title?: string;
  text?: string;
  /** رابط نموذج الطلب، مع معاملات مسبقة التعبئة إن وجدت */
  href?: string;
  whatsappText?: string;
};

export function CtaBand({
  title = "هل لديك موضوع قانوني؟",
  text = "أرسل لنا وصفًا مختصرًا، وسيدرسه المحامي المختص ثم نوضح لك الخيارات والرسوم قبل أي التزام.",
  href = "/consultation",
  whatsappText,
}: Props) {
  const site = getSite();
  return (
    <section className="on-dark relative text-paper">
      <div className="crenellation text-ink-2" aria-hidden="true" />
      <div className="relative overflow-hidden bg-ink-2 py-20 md:py-28">
        <div className="texture-dots-light absolute inset-0" aria-hidden="true" />
        <div className="container-x relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <SplitHeading className="text-3xl leading-snug md:text-5xl">{title}</SplitHeading>
            <Reveal delay={0.15}>
              <p className="mt-5 text-lg leading-relaxed text-paper/80">{text}</p>
              <p className="mt-3 text-sm text-paper/65">{site.feesNote}.</p>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={0.25} className="flex flex-wrap gap-3">
            <Button href={href} variant="light" icon={<ArrowLeft className="size-4.5" aria-hidden="true" />}>
              اطلب استشارة
            </Button>
            <Button href={whatsappUrl(site.contact.whatsapp, whatsappText ?? site.whatsappGreeting)} external variant="outline-light" icon={<WhatsAppIcon className="size-4.5" />}>
              واتساب
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
