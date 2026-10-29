import type { Guide } from "./schema";

/** وقت القراءة التقريبي بالدقائق (≈ 180 كلمة في الدقيقة للنص العربي) */
export function readingTime(guide: Guide) {
  const words = guide.sections
    .flatMap((s) => [s.heading, ...s.blocks.flatMap((b) => ("text" in b ? [b.text] : b.items))])
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
