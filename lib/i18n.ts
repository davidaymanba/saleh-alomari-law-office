/**
 * إعداد اللغات. الموقع مبني بالعربية فقط حاليًا، لكن البنية جاهزة لإضافة لغة أخرى:
 * 1) أضف اللغة إلى locales مع اتجاهها.
 * 2) انسخ ملفات /data بمحتوى اللغة الجديدة (أو حوّل كل حقل نصي إلى كائن { ar, en }).
 * 3) انقل الصفحات إلى app/[locale]/ واقرأ اللغة من params.
 */
export const locales = {
  ar: { dir: "rtl", label: "العربية", htmlLang: "ar" },
} as const;

export type Locale = keyof typeof locales;
export const defaultLocale: Locale = "ar";
