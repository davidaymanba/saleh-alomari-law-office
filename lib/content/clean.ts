/** تنظيف قيم المحرر قبل التحقق: حذف الأسطر الفارغة من قوائم النصوص */
export function cleanInput(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return value.filter((v) => v.trim() !== "");
    return value.map(cleanInput);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, cleanInput(v)]));
  }
  return value;
}

/** يحوّل أخطاء zod إلى خريطة: مسار الحقل ← أول رسالة */
export function issuesToMap(issues: { path: PropertyKey[]; message: string }[]) {
  const map: Record<string, string> = {};
  for (const i of issues) {
    const key = i.path.map(String).join(".");
    map[key] ??= /^Invalid|^Expected|^Required/.test(i.message) ? "قيمة غير صالحة" : i.message;
  }
  return map;
}

export type SaveResult = { ok: true; id?: number } | { ok: false; message: string; errors: Record<string, string> };
