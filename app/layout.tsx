import type { Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";
import "./globals.css";
import { locales, defaultLocale } from "@/lib/i18n";
import { PRELOAD_KEY } from "@/lib/preload";
import { themeColors, themeScript } from "@/lib/theme";

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

export const viewport: Viewport = {
  themeColor: themeColors.light,
  width: "device-width",
  initialScale: 1,
};

/**
 * يُفعّل شاشة التحميل قبل أول رسم: أول زيارة في الجلسة فقط، وليس في لوحة التحكم
 * ولا عند تفضيل تقليل الحركة. بدون JavaScript لا تظهر الشاشة أصلًا.
 */
const preloadScript = `try{if(!sessionStorage.getItem("${PRELOAD_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!location.pathname.startsWith("/admin"))document.documentElement.classList.add("is-preloading")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = locales[defaultLocale];
  return (
    <html lang={locale.htmlLang} dir={locale.dir} className={`${plex.variable} ${reem.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + preloadScript }} />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip">{children}</body>
    </html>
  );
}
