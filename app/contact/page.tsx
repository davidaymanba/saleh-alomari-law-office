import type { Metadata } from "next";
import { ArrowLeft, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: `تواصل مع ${site.name} عبر واتساب أو الهاتف أو البريد الإلكتروني، أو زرنا في المكتب.`,
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: <WhatsAppIcon className="size-6" />,
    label: "واتساب",
    value: "راسلنا مباشرة",
    href: whatsappUrl(site.whatsappGreeting),
    external: true,
  },
  {
    icon: <Phone className="size-6" strokeWidth={1.5} aria-hidden="true" />,
    label: "الهاتف",
    value: site.contact.phone,
    href: `tel:${site.contact.phoneHref}`,
    ltr: true,
  },
  {
    icon: <Mail className="size-6" strokeWidth={1.5} aria-hidden="true" />,
    label: "البريد الإلكتروني",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
  },
  {
    icon: <MapPin className="size-6" strokeWidth={1.5} aria-hidden="true" />,
    label: "العنوان",
    value: site.contact.address,
    href: site.contact.mapUrl,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/contact", label: "تواصل معنا" }]}
        eyebrow="تواصل معنا"
        title="نحن هنا لنسمعك"
        lead="اختر الطريقة الأنسب لك. لعرض موضوعك بتفاصيله، نوصي بنموذج طلب الاستشارة؛ فهو يجهّز رسالتك كاملة."
      >
        <Button href="/consultation" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
          نموذج طلب الاستشارة
        </Button>
      </PageHero>

      <section className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <Reveal as="ul" selector="li" stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col gap-8 border border-ink/15 p-7 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
              >
                <span className="text-clay transition-colors duration-500 group-hover:text-clay-soft dark:group-hover:text-clay-2">{c.icon}</span>
                <span>
                  <span className="block text-sm text-muted transition-colors duration-500 group-hover:text-paper/60">
                    {c.label}
                  </span>
                  <span dir={c.ltr ? "ltr" : undefined} className="mt-1 block text-lg font-semibold">
                    {c.value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>

        <Reveal delay={0.2} className="lg:col-span-4">
          <div className="on-dark h-full bg-ink p-8 text-paper">
            <Clock className="size-6 text-clay-soft" strokeWidth={1.5} aria-hidden="true" />
            <h2 className="mt-6 text-2xl">ساعات العمل</h2>
            <dl className="mt-6 grid gap-4">
              {site.contact.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-paper/15 pb-4">
                  <dt className="text-paper/70">{h.days}</dt>
                  <dd className="font-semibold">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-paper/60">
              يمكنك إرسال طلبك عبر واتساب في أي وقت، وسنرد عليه في أقرب وقت خلال ساعات العمل.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
