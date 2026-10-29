/**
 * مخططات المحتوى (zod) — مصدر الأنواع للموقع ولوحة التحكم.
 * يُتحقق بها من كل ما يُحفظ في قاعدة البيانات.
 */
import { z } from "zod";
import { iconKeys } from "@/data/icons";

const req = (label: string) => z.string().trim().min(1, `${label}: هذا الحقل مطلوب`);
const slug = (label = "المعرّف") =>
  z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${label}: أحرف إنجليزية صغيرة وأرقام وشرطات فقط (مثل family-law)`);
const lines = (label: string) =>
  z.array(z.string().trim().min(1)).min(1, `${label}: أضف عنصرًا واحدًا على الأقل`);

export const tracks = {
  individuals: {
    label: "أفراد",
    title: "للأفراد",
    lead: "نقف معك في المسائل التي تمس حياتك وأسرتك وعملك وممتلكاتك، بخطوات واضحة وتواصل مستمر.",
  },
  companies: {
    label: "شركات",
    title: "للشركات",
    lead: "نرافق المنشآت من التأسيس إلى التعاقد وتسوية النزاعات، بما يحمي أعمالها ويقلل مخاطرها النظامية.",
  },
} as const;
export const trackKeys = ["individuals", "companies"] as const;
export type Track = (typeof trackKeys)[number];

// ——— الخدمات ———
export const serviceSchema = z.object({
  slug: slug(),
  title: req("العنوان"),
  icon: z.enum(iconKeys),
  description: req("الوصف المختصر"),
  details: req("الوصف الموسّع"),
  whenNeeded: lines("متى تحتاجها"),
});
export type Service = z.infer<typeof serviceSchema>;

// ——— مجالات الممارسة ———
export const areaSchema = z.object({
  slug: slug(),
  track: z.enum(trackKeys),
  title: req("العنوان"),
  icon: z.enum(iconKeys),
  description: req("الوصف المختصر"),
  intro: req("الفقرة التعريفية"),
  helpWith: lines("نساعدك في"),
});
export type PracticeArea = z.infer<typeof areaSchema>;

// ——— الفريق ———
export const teamSchema = z.object({
  id: slug(),
  name: req("الاسم"),
  role: req("المسمى"),
  /** حروف الاسم المختصرة للصورة الرمزية؛ فارغة = شعار المكتب */
  initials: z.string().trim().max(6).optional(),
  bio: req("النبذة"),
  focus: z.array(z.string().trim().min(1)),
  featured: z.boolean().optional(),
});
export type TeamMember = z.infer<typeof teamSchema>;

// ——— الأدلة ———
export const guideBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: req("الفقرة") }),
  z.object({ type: z.literal("note"), text: req("الملاحظة") }),
  z.object({ type: z.literal("ul"), items: lines("القائمة") }),
  z.object({ type: z.literal("ol"), items: lines("القائمة المرقمة") }),
]);
export type GuideBlock = z.infer<typeof guideBlockSchema>;

export const guideSchema = z.object({
  slug: slug(),
  title: req("العنوان"),
  excerpt: req("المقتطف"),
  category: req("التصنيف"),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ النشر غير صحيح"),
  relatedArea: z.string().optional(),
  sections: z
    .array(
      z.object({
        id: slug("معرّف القسم"),
        heading: req("عنوان القسم"),
        blocks: z.array(guideBlockSchema).min(1, "أضف فقرة واحدة على الأقل"),
      }),
    )
    .min(1, "أضف قسمًا واحدًا على الأقل"),
});
export type Guide = z.infer<typeof guideSchema>;
export type GuideSection = Guide["sections"][number];

// ——— الأسئلة الشائعة ———
export const faqGroupSchema = z.object({
  id: slug(),
  title: req("عنوان المجموعة"),
  items: z
    .array(z.object({ q: req("السؤال"), a: req("الإجابة"), home: z.boolean().optional() }))
    .min(1, "أضف سؤالًا واحدًا على الأقل"),
});
export type FaqGroup = z.infer<typeof faqGroupSchema>;
export type FaqItem = FaqGroup["items"][number];

// ——— إعدادات الموقع ———
const titled = z.object({ title: req("العنوان"), text: req("النص") });

export const siteSettingsSchema = z.object({
  name: req("اسم المكتب"),
  shortName: req("الاسم المختصر"),
  founder: req("المؤسس"),
  brand: z.object({ primary: req("سطر الشعار الأول"), secondary: req("سطر الشعار الثاني") }),
  tagline: req("الشعار"),
  description: req("الوصف"),
  url: z.string().trim().url("رابط الموقع غير صحيح"),
  contact: z.object({
    whatsapp: z.string().trim().regex(/^\d{8,15}$|^9665X+$/, "رقم واتساب بالصيغة الدولية بدون + (مثل 9665XXXXXXXX)"),
    phone: req("الهاتف"),
    phoneHref: req("رقم الهاتف للاتصال"),
    email: z.string().trim().email("البريد الإلكتروني غير صحيح"),
    address: req("العنوان"),
    city: req("المدينة"),
    mapUrl: z.string().trim().url("رابط الخريطة غير صحيح"),
    hours: z.array(z.object({ days: req("الأيام"), time: req("الوقت") })),
  }),
  legal: z.object({
    licenseNo: req("رقم الترخيص"),
    crNo: req("رقم السجل التجاري"),
    disclaimer: req("إخلاء المسؤولية"),
  }),
  whatsappGreeting: req("رسالة واتساب الافتراضية"),
  feesNote: req("ملاحظة الرسوم"),
  trustStats: z.array(
    z.object({
      // الأرقام تُعدّ تصاعديًا في الموقع، والنصوص تُعرض كما هي
      value: z.preprocess(
        (v) => (typeof v === "string" && /^\d+$/.test(v.trim()) ? Number(v) : v),
        z.union([z.number(), z.string().trim().min(1, "القيمة مطلوبة")]),
      ),
      label: req("الوصف"),
    }),
  ),
  values: z.array(titled),
  processSteps: z.array(titled),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

// ——— المجموعات ———
export const collectionSchemas = {
  services: serviceSchema,
  areas: areaSchema,
  team: teamSchema,
  guides: guideSchema,
  faq: faqGroupSchema,
} as const;
export type CollectionKey = keyof typeof collectionSchemas;
export type CollectionDoc = {
  services: Service;
  areas: PracticeArea;
  team: TeamMember;
  guides: Guide;
  faq: FaqGroup;
};

/** الحقل الذي يُعرّف المستند داخل مجموعته */
export const collectionKeyField: Record<CollectionKey, string> = {
  services: "slug",
  areas: "slug",
  team: "id",
  guides: "slug",
  faq: "id",
};
