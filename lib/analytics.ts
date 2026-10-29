import "server-only";
import { db } from "./db";

/** التجميع اليومي بتوقيت الرياض (UTC+3 بلا توقيت صيفي) */
const DAY = "date(ts, '+3 hours')";
const RDAY = "date(created_at, '+3 hours')";

export type DayPoint = { day: string; value: number };

function riyadhToday() {
  return new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
}

/** قائمة الأيام من الأقدم للأحدث */
export function dayKeys(days: number, offset = 0) {
  const end = new Date(`${riyadhToday()}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() - offset);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function fill(keys: string[], rows: { day: string; n: number }[]): DayPoint[] {
  const m = new Map(rows.map((r) => [r.day, r.n]));
  return keys.map((day) => ({ day, value: m.get(day) ?? 0 }));
}

function range(days: number, offset = 0) {
  const keys = dayKeys(days, offset);
  return { keys, from: keys[0], to: keys[keys.length - 1] };
}

export function dailyViews(days: number) {
  const { keys, from, to } = range(days);
  const rows = db()
    .prepare(`SELECT ${DAY} AS day, COUNT(*) AS n FROM pageviews WHERE ${DAY} BETWEEN ? AND ? GROUP BY day`)
    .all(from, to) as { day: string; n: number }[];
  return fill(keys, rows);
}

export function dailyRequests(days: number) {
  const { keys, from, to } = range(days);
  const rows = db()
    .prepare(`SELECT ${RDAY} AS day, COUNT(*) AS n FROM requests WHERE status != 'spam' AND ${RDAY} BETWEEN ? AND ? GROUP BY day`)
    .all(from, to) as { day: string; n: number }[];
  return fill(keys, rows);
}

function totalsFor(from: string, to: string) {
  const d = db();
  const views = d.prepare(`SELECT COUNT(*) AS n FROM pageviews WHERE ${DAY} BETWEEN ? AND ?`).get(from, to) as { n: number };
  // بصمة الزائر يومية، فمجموع الزوار = مجموع الزوار المميزين لكل يوم
  const visitors = d
    .prepare(
      `SELECT COALESCE(SUM(n), 0) AS n FROM (SELECT COUNT(DISTINCT visitor) AS n FROM pageviews WHERE ${DAY} BETWEEN ? AND ? GROUP BY ${DAY})`,
    )
    .get(from, to) as { n: number };
  const requests = d
    .prepare(`SELECT COUNT(*) AS n FROM requests WHERE status != 'spam' AND ${RDAY} BETWEEN ? AND ?`)
    .get(from, to) as { n: number };
  return {
    views: views.n,
    visitors: visitors.n,
    requests: requests.n,
    conversion: visitors.n ? (requests.n / visitors.n) * 100 : 0,
  };
}

/** إجماليات الفترة الحالية والفترة السابقة المماثلة (للمقارنة) */
export function totals(days: number) {
  const cur = range(days);
  const prev = range(days, days);
  return { current: totalsFor(cur.from, cur.to), previous: totalsFor(prev.from, prev.to) };
}

export type Ranked = { label: string; value: number };

function ranked(sql: string, from: string, to: string, limit: number) {
  return db().prepare(sql).all(from, to, limit) as Ranked[];
}

export function topPages(days: number, limit = 8) {
  const { from, to } = range(days);
  return ranked(
    `SELECT path AS label, COUNT(*) AS value FROM pageviews WHERE ${DAY} BETWEEN ? AND ? GROUP BY path ORDER BY value DESC LIMIT ?`,
    from,
    to,
    limit,
  );
}

export function topReferrers(days: number, limit = 8) {
  const { from, to } = range(days);
  return ranked(
    `SELECT COALESCE(referrer, 'مباشر / غير معروف') AS label, COUNT(DISTINCT visitor || ${DAY}) AS value
     FROM pageviews WHERE ${DAY} BETWEEN ? AND ? GROUP BY label ORDER BY value DESC LIMIT ?`,
    from,
    to,
    limit,
  );
}

const deviceLabels: Record<string, string> = { mobile: "جوال", desktop: "كمبيوتر", tablet: "جهاز لوحي" };

export function devices(days: number) {
  const { from, to } = range(days);
  return ranked(
    `SELECT device AS label, COUNT(DISTINCT visitor || ${DAY}) AS value
     FROM pageviews WHERE ${DAY} BETWEEN ? AND ? GROUP BY device ORDER BY value DESC LIMIT ?`,
    from,
    to,
    10,
  ).map((r) => ({ ...r, label: deviceLabels[r.label] ?? r.label }));
}

export function requestsBy(column: "case_type" | "service" | "urgency" | "city", days: number, limit = 8) {
  const { from, to } = range(days);
  return ranked(
    `SELECT ${column} AS label, COUNT(*) AS value FROM requests
     WHERE status != 'spam' AND ${RDAY} BETWEEN ? AND ? GROUP BY ${column} ORDER BY value DESC LIMIT ?`,
    from,
    to,
    limit,
  );
}
