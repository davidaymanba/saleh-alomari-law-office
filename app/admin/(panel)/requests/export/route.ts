import { getCurrentUser } from "@/lib/auth";
import { allRequests } from "@/lib/requests";
import { isRequestStatus, requestStatusLabels } from "@/lib/requests-shared";
import { formatDateTime } from "@/lib/format";

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

/** تصدير الطلبات CSV (بترميز UTF-8 مع BOM ليفتح بالعربية في Excel) */
export async function GET(req: Request) {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  const sp = new URL(req.url).searchParams;
  const status = sp.get("status");
  const rows = allRequests({ status: isRequestStatus(status) ? status : "all", q: sp.get("q")?.trim() || undefined });

  const header = ["رقم", "التاريخ", "الاسم", "الجوال", "المدينة", "الصفة", "نوع القضية", "نوع الطلب", "الاستعجال", "التواصل المفضل", "الحالة", "المسؤول", "التفاصيل", "ملاحظات"];
  const lines = rows.map((r) =>
    [
      r.id,
      formatDateTime(r.created_at),
      r.name,
      r.phone,
      r.city,
      r.applicant_type,
      r.case_type,
      r.service,
      r.urgency,
      r.contact_method,
      requestStatusLabels[r.status],
      r.assigned_name ?? "",
      r.details,
      r.notes,
    ]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="requests-${date}.csv"`,
    },
  });
}
