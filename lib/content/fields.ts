/**
 * تعريف حقول محرر المحتوى في لوحة التحكم (بيانات قابلة للتمرير من الخادم إلى المتصفح).
 * المسارات بصيغة "contact.hours.0.days" وتطابق مسارات أخطاء zod.
 */
import { iconKeys, iconLabels } from "@/data/icons";
import { tracks, trackKeys, type CollectionKey } from "./schema";

export type Option = { value: string; label: string };

export type FieldDef =
  | { type: "text"; name: string; label: string; hint?: string; dir?: "ltr"; half?: boolean }
  | { type: "textarea"; name: string; label: string; hint?: string; rows?: number }
  | { type: "select"; name: string; label: string; hint?: string; options: Option[]; empty?: string; half?: boolean }
  | { type: "lines"; name: string; label: string; hint?: string }
  | { type: "checkbox"; name: string; label: string; hint?: string }
  | { type: "date"; name: string; label: string; half?: boolean }
  | { type: "object"; name: string; label: string; fields: FieldDef[] }
  | {
      type: "array";
      name: string;
      label: string;
      hint?: string;
      itemLabel: string;
      fields: FieldDef[];
      template: Record<string, unknown>;
    }
  | { type: "blocks"; name: string; label: string };

const iconOptions: Option[] = iconKeys.map((k) => ({ value: k, label: iconLabels[k] }));
const slugHint = "يظهر في رابط الصفحة. أحرف إنجليزية صغيرة وأرقام وشرطات فقط.";

export function collectionFields(collection: CollectionKey, ctx: { areas: Option[] }): FieldDef[] {
  switch (collection) {
    case "services":
      return [
        { type: "text", name: "title", label: "اسم الخدمة", half: true },
        { type: "text", name: "slug", label: "المعرّف (slug)", hint: slugHint, dir: "ltr", half: true },
        { type: "select", name: "icon", label: "الأيقونة", options: iconOptions, half: true },
        { type: "textarea", name: "description", label: "وصف مختصر", rows: 2, hint: "يظهر في قوائم الخدمات." },
        { type: "textarea", name: "details", label: "كيف نعمل", rows: 4 },
        { type: "lines", name: "whenNeeded", label: "متى تحتاجها؟", hint: "كل سطر نقطة مستقلة." },
      ];
    case "areas":
      return [
        { type: "text", name: "title", label: "اسم المجال", half: true },
        { type: "text", name: "slug", label: "المعرّف (slug)", hint: slugHint, dir: "ltr", half: true },
        {
          type: "select",
          name: "track",
          label: "المسار",
          options: trackKeys.map((t) => ({ value: t, label: tracks[t].title })),
          half: true,
        },
        { type: "select", name: "icon", label: "الأيقونة", options: iconOptions, half: true },
        { type: "textarea", name: "description", label: "وصف مختصر", rows: 2 },
        { type: "textarea", name: "intro", label: "الفقرة التعريفية", rows: 4, hint: "تظهر في صفحة المجال." },
        { type: "lines", name: "helpWith", label: "نساعدك في", hint: "كل سطر نقطة مستقلة." },
      ];
    case "team":
      return [
        { type: "text", name: "name", label: "الاسم", half: true },
        { type: "text", name: "id", label: "المعرّف", hint: "أحرف إنجليزية صغيرة وأرقام وشرطات.", dir: "ltr", half: true },
        { type: "text", name: "role", label: "المسمى الوظيفي", half: true },
        { type: "text", name: "initials", label: "الحروف الأولى", hint: "تظهر بدل الصورة؛ اتركها فارغة لإظهار الشعار.", half: true },
        { type: "textarea", name: "bio", label: "النبذة", rows: 5 },
        { type: "lines", name: "focus", label: "مجالات التركيز", hint: "كل سطر مجال." },
        { type: "checkbox", name: "featured", label: "المؤسس / عضو مميز", hint: "يظهر في قسم المؤسس في الرئيسية وصفحة الفريق." },
      ];
    case "guides":
      return [
        { type: "text", name: "title", label: "العنوان" },
        { type: "text", name: "slug", label: "المعرّف (slug)", hint: slugHint, dir: "ltr", half: true },
        { type: "text", name: "category", label: "التصنيف", half: true },
        { type: "date", name: "publishedAt", label: "تاريخ النشر", half: true },
        {
          type: "select",
          name: "relatedArea",
          label: "مجال الممارسة المرتبط",
          options: ctx.areas,
          empty: "— بدون —",
          half: true,
        },
        { type: "textarea", name: "excerpt", label: "المقتطف", rows: 3 },
        {
          type: "array",
          name: "sections",
          label: "أقسام الدليل",
          itemLabel: "قسم",
          template: { id: "", heading: "", blocks: [{ type: "p", text: "", items: [] }] },
          fields: [
            { type: "text", name: "heading", label: "عنوان القسم", half: true },
            { type: "text", name: "id", label: "معرّف القسم", hint: "للروابط داخل الصفحة.", dir: "ltr", half: true },
            { type: "blocks", name: "blocks", label: "المحتوى" },
          ],
        },
      ];
    case "faq":
      return [
        { type: "text", name: "title", label: "عنوان المجموعة", half: true },
        { type: "text", name: "id", label: "المعرّف", dir: "ltr", hint: "أحرف إنجليزية صغيرة وأرقام وشرطات.", half: true },
        {
          type: "array",
          name: "items",
          label: "الأسئلة",
          itemLabel: "سؤال",
          template: { q: "", a: "", home: false },
          fields: [
            { type: "text", name: "q", label: "السؤال" },
            { type: "textarea", name: "a", label: "الإجابة", rows: 3 },
            { type: "checkbox", name: "home", label: "إظهاره في الصفحة الرئيسية" },
          ],
        },
      ];
  }
}

const titledArray = (name: string, label: string, itemLabel: string): FieldDef => ({
  type: "array",
  name,
  label,
  itemLabel,
  template: { title: "", text: "" },
  fields: [
    { type: "text", name: "title", label: "العنوان" },
    { type: "textarea", name: "text", label: "النص", rows: 2 },
  ],
});

export const settingsFields: FieldDef[] = [
  {
    type: "object",
    name: "",
    label: "الهوية",
    fields: [
      { type: "text", name: "name", label: "اسم المكتب الكامل" },
      { type: "text", name: "shortName", label: "الاسم المختصر", half: true },
      { type: "text", name: "founder", label: "المؤسس", half: true },
      { type: "text", name: "brand.primary", label: "الشعار النصي — السطر الأول", half: true },
      { type: "text", name: "brand.secondary", label: "الشعار النصي — السطر الثاني", half: true },
      { type: "text", name: "tagline", label: "العبارة الرئيسية", hint: "افصل بين السطرين بعلامة … لتلوين السطر الثاني." },
      { type: "textarea", name: "description", label: "وصف المكتب", rows: 3, hint: "يُستخدم في محركات البحث والتذييل." },
      { type: "text", name: "url", label: "رابط الموقع", dir: "ltr", hint: "مثل https://www.alomari.sa" },
    ],
  },
  {
    type: "object",
    name: "contact",
    label: "التواصل",
    fields: [
      { type: "text", name: "whatsapp", label: "رقم واتساب", dir: "ltr", hint: "بالصيغة الدولية بدون + : 9665XXXXXXXX", half: true },
      { type: "text", name: "phone", label: "الهاتف كما يظهر", dir: "ltr", half: true },
      { type: "text", name: "phoneHref", label: "الهاتف للاتصال المباشر", dir: "ltr", hint: "مثل +9665XXXXXXXX", half: true },
      { type: "text", name: "email", label: "البريد الإلكتروني", dir: "ltr", half: true },
      { type: "text", name: "address", label: "العنوان" },
      { type: "text", name: "city", label: "المدينة", half: true },
      { type: "text", name: "mapUrl", label: "رابط الخريطة", dir: "ltr", half: true },
      {
        type: "array",
        name: "hours",
        label: "ساعات العمل",
        itemLabel: "فترة",
        template: { days: "", time: "" },
        fields: [
          { type: "text", name: "days", label: "الأيام", half: true },
          { type: "text", name: "time", label: "الوقت", half: true },
        ],
      },
    ],
  },
  {
    type: "object",
    name: "legal",
    label: "البيانات النظامية",
    fields: [
      { type: "text", name: "licenseNo", label: "رقم الترخيص", half: true },
      { type: "text", name: "crNo", label: "رقم السجل التجاري", half: true },
      { type: "textarea", name: "disclaimer", label: "إخلاء المسؤولية", rows: 2 },
    ],
  },
  {
    type: "object",
    name: "",
    label: "رسائل عامة",
    fields: [
      { type: "text", name: "whatsappGreeting", label: "رسالة واتساب الافتراضية" },
      { type: "text", name: "feesNote", label: "ملاحظة الرسوم" },
    ],
  },
  {
    type: "array",
    name: "trustStats",
    label: "مؤشرات الثقة",
    hint: "الأرقام تُعدّ تصاعديًا في الموقع، وأي نص آخر يُعرض كما هو.",
    itemLabel: "مؤشر",
    template: { value: "", label: "" },
    fields: [
      { type: "text", name: "value", label: "القيمة", half: true },
      { type: "text", name: "label", label: "الوصف", half: true },
    ],
  },
  titledArray("values", "القيم", "قيمة"),
  titledArray("processSteps", "خطوات العمل", "خطوة"),
];
