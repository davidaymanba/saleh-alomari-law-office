/**
 * إعدادات الموقع العامة.
 * كل القيم بين الأقواس [ ] أو بصيغة XXXX هي قيم مؤقتة يجب استبدالها بالبيانات الرسمية للمكتب.
 */

import type { SiteSettings } from "@/lib/content/schema";

export const seedSite = {
  /** الرابط الأساسي للموقع بعد النشر (يُستخدم في الـ sitemap والـ Open Graph) */
  url: "https://www.example.com",

  name: "مكتب صالح العمري للمحاماة والاستشارات القانونية",
  shortName: "العمري للمحاماة",
  founder: "المحامي صالح العمري",
  /** سطرا الشعار النصي */
  brand: { primary: "صالح العمري", secondary: "للمحاماة والاستشارات القانونية" },
  tagline: "حضورٌ قانونيٌّ راسخ… يحفظ حقك بوضوح",
  description:
    "مكتب محاماة سعودي يقدّم الاستشارات القانونية والتمثيل القضائي للأفراد والشركات، بفريق من المحامين المرخّصين. الرسوم تُحدد بعد دراسة الطلب.",

  contact: {
    /** رقم واتساب بالصيغة الدولية بدون + أو أصفار بادئة، مثال: 9665XXXXXXXX */
    whatsapp: "9665XXXXXXXX",
    /** رقم الهاتف كما يظهر للزائر */
    phone: "+966 5X XXX XXXX",
    /** رقم الهاتف لرابط tel: */
    phoneHref: "+9665XXXXXXXX",
    email: "info@example.com",
    address: "[العنوان: الحي، الشارع، المدينة]",
    city: "[المدينة]",
    mapUrl: "https://maps.google.com/?q=[الموقع]",
    hours: [
      { days: "الأحد – الخميس", time: "[٩:٠٠ ص – ٥:٠٠ م]" },
      { days: "الجمعة – السبت", time: "مغلق" },
    ],
  },

  legal: {
    licenseNo: "[رقم الترخيص]",
    crNo: "[رقم السجل التجاري]",
    disclaimer:
      "المعلومات المنشورة في هذا الموقع للتوعية العامة ولا تُعد استشارة قانونية.",
  },

  /** رسالة واتساب الافتراضية للزر العائم */
  whatsappGreeting: "السلام عليكم، أرغب في الاستفسار عن خدمة قانونية.",

  feesNote: "الرسوم تُحدد بعد دراسة الطلب",
} satisfies Omit<SiteSettings, "trustStats" | "values" | "processSteps">;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/about", label: "من نحن" },
  { href: "/services", label: "الخدمات" },
  { href: "/practice-areas", label: "مجالات الممارسة" },
  { href: "/team", label: "الفريق" },
  { href: "/guides", label: "أدلة قانونية" },
  { href: "/contact", label: "تواصل معنا" },
];

export const footerNav: NavItem[] = [
  { href: "/", label: "الرئيسية" },
  ...mainNav,
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/consultation", label: "اطلب استشارة" },
];

/** مؤشرات الثقة: القيم الرقمية تُعدّ تصاعديًا، والقيم بين الأقواس تُعرض كما هي حتى تُستبدل */
export const seedTrustStats: SiteSettings["trustStats"] = [
  { value: "[XX]", label: "عامًا من الخبرة" },
  { value: 12, label: "مجالًا قانونيًا للأفراد والشركات" },
  { value: 5, label: "أنواع من الخدمات القانونية" },
  { value: "[X]", label: "محامين مرخّصين في الفريق" },
];

export const seedValues: SiteSettings["values"] = [
  {
    title: "النزاهة",
    text: "نعرض عليك الوضع القانوني كما هو، بما له وما عليه، دون تهويل أو وعود لا يملكها أحد.",
  },
  {
    title: "السرية",
    text: "كل ما تشاركه معنا محفوظ، ولا يُطّلع عليه إلا من يعمل على طلبك داخل المكتب.",
  },
  {
    title: "الوضوح",
    text: "نشرح الخطوات والخيارات بلغة مفهومة، ونحدد الرسوم كتابيًا قبل بدء العمل.",
  },
  {
    title: "الالتزام",
    text: "نتابع طلبك بانتظام، ونبقيك على اطلاع بكل مستجد حتى إنجاز العمل.",
  },
];

export const seedProcessSteps: SiteSettings["processSteps"] = [
  {
    title: "أرسل طلبك",
    text: "عبّئ نموذج الطلب أو راسلنا على واتساب بوصف مختصر لموضوعك.",
  },
  {
    title: "دراسة الطلب وتحديد الرسوم",
    text: "يراجع المحامي المختص طلبك، ثم نوضح لك الخيارات والرسوم قبل أي التزام.",
  },
  {
    title: "التوكيل وبدء العمل",
    text: "بعد موافقتك تُستكمل الوكالة والمستندات، ويبدأ الفريق العمل على ملفك.",
  },
  {
    title: "المتابعة حتى الإنجاز",
    text: "نبقيك على اطلاع بكل مرحلة، ونتابع الإجراءات حتى إنجاز الطلب.",
  },
];
