import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { footerNav, site } from "@/data/site";
import { practiceAreas } from "@/data/practiceAreas";
import { whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative mt-auto text-paper">
      <div className="crenellation text-ink" aria-hidden="true" />
      <div className="relative bg-ink">
        <div className="texture-dots-light absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-4">
            <Logo className="[&_svg]:text-clay-soft" />
            <p className="mt-6 max-w-sm text-sm leading-loose text-paper/65">{site.description}</p>
            <a
              href={whatsappUrl(site.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-paper/20 px-4 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-clay-soft hover:text-clay-soft"
            >
              <WhatsAppIcon className="size-4.5" />
              راسلنا على واتساب
            </a>
          </div>

          <nav aria-label="روابط الموقع" className="lg:col-span-2">
            <h2 className="mb-5 font-sans text-sm font-semibold text-clay-soft">الموقع</h2>
            <ul className="grid gap-2.5 text-sm text-paper/75">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <TransitionLink href={item.href} className="link-underline hover:text-paper">
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="مجالات الممارسة" className="lg:col-span-3">
            <h2 className="mb-5 font-sans text-sm font-semibold text-clay-soft">مجالات الممارسة</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-paper/75 lg:grid-cols-1">
              {practiceAreas.slice(0, 8).map((a) => (
                <li key={a.slug}>
                  <TransitionLink href={`/practice-areas/${a.slug}`} className="link-underline hover:text-paper">
                    {a.title}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="mb-5 font-sans text-sm font-semibold text-clay-soft">تواصل معنا</h2>
            <ul className="grid gap-3.5 text-sm text-paper/75">
              <li className="flex items-start gap-3">
                <Phone className="mt-1 size-4 shrink-0 text-paper/45" aria-hidden="true" />
                <a href={`tel:${site.contact.phoneHref}`} dir="ltr" className="hover:text-paper">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-1 size-4 shrink-0 text-paper/45" aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-paper">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-paper/45" aria-hidden="true" />
                <span>{site.contact.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-paper/45" aria-hidden="true" />
                <span className="grid gap-1">
                  {site.contact.hours.map((h) => (
                    <span key={h.days}>
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container-x relative flex flex-col gap-3 border-t border-paper/10 py-6 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. جميع الحقوق محفوظة.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>ترخيص رقم: {site.legal.licenseNo}</span>
            <span>س.ت: {site.legal.crNo}</span>
          </p>
        </div>
        <p className="container-x relative pb-8 text-xs text-paper/40">{site.legal.disclaimer}</p>
      </div>
    </footer>
  );
}
