import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { locales, defaultLocale } from "@/lib/i18n";
import { TransitionProvider } from "@/components/layout/TransitionProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/layout/Preloader";
import { PRELOAD_KEY } from "@/lib/preload";
import { themeColors, themeScript } from "@/lib/theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const reem = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-reem",
  display: "swap",
});

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: themeColors.light,
  width: "device-width",
  initialScale: 1,
};

/** يتخطى شاشة التحميل إن عُرضت سابقًا في الجلسة أو عند تفضيل تقليل الحركة — يعمل قبل أول رسم */
const preloadScript = `try{if(sessionStorage.getItem("${PRELOAD_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.remove("is-preloading")}catch(e){document.documentElement.classList.remove("is-preloading")}`;

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
  address: { "@type": "PostalAddress", streetAddress: site.contact.address, addressLocality: site.contact.city, addressCountry: "SA" },
  areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
  availableLanguage: ["ar"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = locales[defaultLocale];
  return (
    <html
      lang={locale.htmlLang}
      dir={locale.dir}
      className={`is-preloading ${plex.variable} ${reem.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + preloadScript }} />
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <a
          href="#main"
          className="fixed start-4 top-4 z-[110] -translate-y-24 bg-ink px-4 py-2 text-sm text-paper transition-transform focus:translate-y-0"
        >
          تخطَّ إلى المحتوى
        </a>
        <Preloader />
        <SmoothScroll />
        <TransitionProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
        </TransitionProvider>
      </body>
    </html>
  );
}
