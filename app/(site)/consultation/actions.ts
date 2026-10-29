"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { consultationSchema } from "@/components/form/schema";

export type SubmitResult = { ok: true } | { ok: false; reason: "invalid" | "rate" | "error" };

/** يحفظ طلب الاستشارة في قاعدة البيانات ليظهر في لوحة التحكم */
export async function submitConsultation(input: unknown, honeypot: string): Promise<SubmitResult> {
  // حقل مخفي يملؤه السبام فقط: نتظاهر بالنجاح دون حفظ
  if (honeypot) return { ok: true };

  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid" };

  const ip = clientIp(await headers());
  if (!rateLimit(`consult:${ip}`, 5, 10 * 60 * 1000)) return { ok: false, reason: "rate" };

  const v = parsed.data;
  try {
    db()
      .prepare(
        `INSERT INTO requests (applicant_type, case_type, service, urgency, details, name, phone, city, contact_method)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(v.applicantType, v.caseType, v.service, v.urgency, v.details, v.name, v.phone, v.city, v.contactMethod);
    return { ok: true };
  } catch (e) {
    console.error("[consultation] save failed", e);
    return { ok: false, reason: "error" };
  }
}
