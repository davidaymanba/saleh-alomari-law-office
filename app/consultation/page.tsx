import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { site, processSteps } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { PageHero } from "@/components/sections/PageHero";
import { ConsultationForm } from "@/components/form/ConsultationForm";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export const metadata: Metadata = {
  title: "اطلب استشارة",
  description: `أرسل طلب استشارة أو خدمة قانونية عبر واتساب. ${site.feesNote}.`,
  alternates: { canonical: "/consultation" },
};

type Props = { searchParams: Promise<{ service?: string | string[]; area?: string | string[] }> };

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

export default async function ConsultationPage({ searchParams }: Props) {
  const sp = await searchParams;
  const service = first(sp.service);
  const area = first(sp.area);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/consultation", label: "اطلب استشارة" }]}
        eyebrow="طلب استشارة"
        title="أخبرنا عن موضوعك"
        lead={`عبّئ النموذج وسنجهّز طلبك في رسالة واتساب ترسلها بنفسك. ${site.feesNote}، ولا يبدأ العمل إلا بعد موافقتك.`}
      />

      <section className="container-x grid gap-14 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ConsultationForm key={`${service}-${area}`} defaultService={service} defaultArea={area} />
        </div>

        <aside className="lg:col-span-4">
          <div className="grid gap-6 lg:sticky lg:top-28">
            <div className="border border-ink/15 p-7">
              <h2 className="text-xl">ماذا يحدث بعد الإرسال؟</h2>
              <ol className="mt-6 grid gap-5">
                {processSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center border border-ink/20 font-display text-sm font-bold text-clay">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-semibold">{s.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="on-dark bg-ink p-7 text-paper">
              <h2 className="text-xl">تفضّل التواصل المباشر؟</h2>
              <div className="mt-5 grid gap-3">
                <a
                  href={whatsappUrl(site.whatsappGreeting)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-clay-soft"
                >
                  <WhatsAppIcon className="size-5" /> واتساب
                </a>
                <a href={`tel:${site.contact.phoneHref}`} className="inline-flex items-center gap-3 hover:text-clay-soft">
                  <Phone className="size-5" strokeWidth={1.5} aria-hidden="true" />
                  <span dir="ltr">{site.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
