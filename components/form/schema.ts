import { z } from "zod";
import { toLatinDigits } from "@/lib/utils";

export const applicantTypes = ["فرد", "شركة / منشأة"] as const;
export const urgencies = ["عادي", "خلال أسبوع", "عاجل (جلسة أو مهلة قريبة)"] as const;
export const contactMethods = ["واتساب", "اتصال هاتفي"] as const;
export const OTHER = "أخرى / غير متأكد";

export const consultationSchema = z.object({
  applicantType: z.enum(applicantTypes, { error: "اختر الصفة" }),
  caseType: z.string().min(1, "اختر نوع القضية"),
  service: z.string().min(1, "اختر نوع الطلب"),
  urgency: z.enum(urgencies, { error: "حدد مدى الاستعجال" }),
  details: z
    .string()
    .trim()
    .min(20, "اكتب وصفًا مختصرًا لا يقل عن 20 حرفًا")
    .max(1500, "الوصف طويل؛ اختصره في 1500 حرف كحد أقصى"),
  name: z.string().trim().min(2, "اكتب اسمك"),
  phone: z
    .string()
    .transform((v) => toLatinDigits(v).replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^\+?\d{9,15}$/, "أدخل رقم جوال صحيحًا، مثل 05XXXXXXXX")),
  city: z.string().trim().min(2, "اكتب المدينة"),
  contactMethod: z.enum(contactMethods, { error: "اختر طريقة التواصل" }),
  consent: z.literal(true, { error: "يلزم الإقرار للمتابعة" }),
});

export type ConsultationInput = z.input<typeof consultationSchema>;
export type ConsultationValues = z.output<typeof consultationSchema>;
