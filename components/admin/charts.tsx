import type { ReactNode } from "react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** أرقام محاور نظيفة: 0 / 5 / 10 … */
function niceMax(max: number) {
  if (max <= 4) return 4;
  const mag = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => max / s <= 4) ?? 10 * mag;
  return Math.ceil(max / step) * step;
}

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}K` : String(n));

const dayFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "short", timeZone: "UTC" });
const fullDayFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const fmtDay = (d: string, full = false) => (full ? fullDayFmt : dayFmt).format(new Date(`${d}T00:00:00Z`));

/**
 * أعمدة يومية لسلسلة واحدة (لا مفتاح ألوان: العنوان يسمّي السلسلة).
 * الأعمدة ≤ 24px برأس مستدير 4px، فجوة 2px، شبكة رفيعة، وتلميح عند المرور على كامل العمود.
 * الزمن يجري من اليمين (الأقدم) إلى اليسار (الأحدث) مع اتجاه الصفحة.
 */
export function ColumnChart({
  data,
  unit,
  height = 180,
}: {
  data: { day: string; value: number }[];
  /** اسم الوحدة في التلميح: "زيارة"، "طلب" */
  unit: string;
  height?: number;
}) {
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const labelEvery = Math.ceil(data.length / 6);
  const peak = data.reduce((best, d) => (d.value > best.value ? d : best), data[0]);

  return (
    <figure>
      <div className="flex gap-2" style={{ height }}>
        {/* محور القيم */}
        <div className="relative w-8 shrink-0 text-[0.7rem] text-muted tabular-nums" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute end-0 -translate-y-1/2" style={{ bottom: `${(t / max) * 100}%` }}>
              {compact(t)}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          {ticks.map((t) => (
            <div
              key={t}
              aria-hidden="true"
              className={cn("absolute inset-x-0 h-px", t === 0 ? "bg-ink/25" : "bg-ink/8")}
              style={{ bottom: `${(t / max) * 100}%` }}
            />
          ))}
          <ol className="relative flex h-full items-end gap-[2px]">
            {data.map((d) => (
              <li
                key={d.day}
                className="group relative flex h-full flex-1 items-end justify-center"
                aria-label={`${fmtDay(d.day, true)}: ${d.value} ${unit}`}
              >
                <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/5" aria-hidden="true" />
                <span
                  className="relative w-full max-w-6 rounded-t-[4px] bg-chart"
                  style={{ height: d.value ? `max(2px, ${(d.value / max) * 100}%)` : 0 }}
                />
                {d === peak && d.value > 0 && (
                  <span className="absolute text-[0.7rem] font-semibold tabular-nums" style={{ bottom: `calc(${(d.value / max) * 100}% + 4px)` }}>
                    {d.value}
                  </span>
                )}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full z-10 mb-2 hidden w-max border border-ink/10 bg-paper px-2.5 py-1.5 text-xs shadow-lg shadow-ink/10 group-hover:block"
                >
                  <span className="block text-muted">{fmtDay(d.day, true)}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 font-semibold">
                    <span className="size-2 rounded-full bg-chart" aria-hidden="true" />
                    {formatNumber(d.value)} {unit}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="ms-10 mt-2 flex gap-[2px] text-[0.7rem] text-muted" aria-hidden="true">
        {data.map((d, i) => (
          <span key={d.day} className="relative flex-1 text-center">
            {(data.length - 1 - i) % labelEvery === 0 && (
              // آخر تسمية تُثبَّت على الحافة كي لا تخرج من البطاقة
              <span className={cn("absolute whitespace-nowrap", i === data.length - 1 ? "end-0" : "start-1/2 translate-x-1/2")}>
                {fmtDay(d.day)}
              </span>
            )}
          </span>
        ))}
      </div>
      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-xs text-muted hover:text-ink">عرض البيانات كجدول</summary>
        <div className="mt-2 max-h-60 overflow-y-auto" data-lenis-prevent>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-ink/8">
              {[...data].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="py-1.5">{fmtDay(d.day, true)}</td>
                  <td className="py-1.5 text-end tabular-nums">{formatNumber(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/** ترتيب أفقي لسلسلة واحدة: الاسم والقيمة نصًا، وشريط رفيع للمقارنة */
export function BarList({
  rows,
  empty = "لا توجد بيانات في هذه الفترة",
  format = formatNumber,
  labelDir,
}: {
  rows: { label: string; value: number }[];
  empty?: string;
  format?: (n: number) => string;
  labelDir?: "ltr";
}) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value));
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <ol className="grid gap-3.5">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${format(r.value)} (${Math.round((r.value / total) * 100)}%)`}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="truncate" dir={labelDir}>
              {r.label}
            </span>
            <span className="shrink-0 font-semibold tabular-nums">{format(r.value)}</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-ink/6" aria-hidden="true">
            <div className="h-full rounded-e-[4px] bg-chart" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/** بطاقة رقم: التسمية، القيمة، والتغيّر مقارنة بالفترة السابقة */
export function StatTile({
  label,
  value,
  current,
  previous,
  hint,
  icon,
}: {
  label: string;
  value: string;
  current?: number;
  previous?: number;
  hint?: ReactNode;
  icon?: ReactNode;
}) {
  let delta: ReactNode = null;
  if (current !== undefined && previous !== undefined) {
    if (previous === 0) {
      delta = current > 0 ? <span className="text-muted">جديد هذه الفترة</span> : null;
    } else {
      const pct = Math.round(((current - previous) / previous) * 100);
      const up = pct >= 0;
      delta = (
        <span className={cn("font-semibold", pct === 0 ? "text-muted" : up ? "text-[#25643f] dark:text-[#7fd1a0]" : "text-[#b42318] dark:text-[#f97066]")}>
          <span aria-hidden="true">{pct === 0 ? "•" : up ? "▲" : "▼"}</span>{" "}
          <bdi dir="ltr">
            {up && pct > 0 ? "+" : ""}
            {pct}%
          </bdi>
          <span className="font-normal text-muted"> عن الفترة السابقة</span>
        </span>
      );
    }
  }
  return (
    <div className="acard flex flex-col gap-1 p-5">
      <p className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </p>
      <p className="font-sans text-3xl font-semibold">{value}</p>
      <p className="min-h-5 text-xs">{delta ?? hint}</p>
    </div>
  );
}
