/** التواريخ في قاعدة البيانات بتوقيت UTC بصيغة "YYYY-MM-DD HH:MM:SS"؛ تُعرض بتوقيت الرياض */
export function parseDbDate(s: string) {
  return new Date(s.includes("T") ? s : `${s.replace(" ", "T")}Z`);
}

export function formatDateTime(s: string) {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parseDbDate(s));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

/** منذ متى (تقريبي) */
export function timeAgo(s: string) {
  const diff = (Date.now() - parseDbDate(s).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  if (diff < 86400 * 30) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return formatDateTime(s);
}
