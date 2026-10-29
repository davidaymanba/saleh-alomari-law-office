import type { Metadata } from "next";
import { getSite } from "@/lib/content/queries";
import { SiteProvider } from "@/components/layout/SiteProvider";
import { TransitionProvider } from "@/components/layout/TransitionProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Analytics } from "@/components/layout/Analytics";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.shortName} | ${site.tagline}`, template: `%s | ${site.shortName}` },
    description: site.description,
    applicationName: site.shortName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      siteName: site.name,
      title: site.name,
      description: site.description,
      url: "/",
    },
    twitter: { card: "summary_large_image", title: site.name, description: site.description },
    formatDetection: { telephone: false },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = getSite();
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    telephone: site.contact.phoneHref,
    email: site.contact.email,
    founder: { "@type": "Person", name: site.founder },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: site.contact.city,
      addressCountry: "SA",
    },
    areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
    availableLanguage: ["ar"],
  };

  return (
    <SiteProvider site={site}>
      <a
        href="#main"
        className="fixed start-4 top-4 z-[110] -translate-y-24 bg-ink px-4 py-2 text-sm text-paper transition-transform focus:translate-y-0"
      >
        تخطَّ إلى المحتوى
      </a>
      <Preloader />
      <SmoothScroll />
      <Analytics />
      <TransitionProvider>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </TransitionProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
    </SiteProvider>
  );
}
