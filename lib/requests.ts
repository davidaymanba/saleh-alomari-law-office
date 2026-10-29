import "server-only";
import { db } from "./db";
import type { RequestStatus } from "./requests-shared";

export type RequestRow = {
  id: number;
  created_at: string;
  updated_at: string;
  applicant_type: string;
  case_type: string;
  service: string;
  urgency: string;
  details: string;
  name: string;
  phone: string;
  city: string;
  contact_method: string;
  status: RequestStatus;
  notes: string;
  assigned_to: number | null;
  assigned_name: string | null;
};

const SELECT = `SELECT r.*, u.name AS assigned_name FROM requests r LEFT JOIN users u ON u.id = r.assigned_to`;
export const PAGE_SIZE = 25;

function where(f: { status?: RequestStatus | "all"; q?: string }) {
  const conds: string[] = [];
  const args: string[] = [];
  if (f.status && f.status !== "all") {
    conds.push("r.status = ?");
    args.push(f.status);
  } else {
    conds.push("r.status != 'spam'");
  }
  if (f.q) {
    conds.push("(r.name LIKE ? OR r.phone LIKE ? OR r.details LIKE ? OR r.city LIKE ? OR r.case_type LIKE ?)");
    const like = `%${f.q}%`;
    args.push(like, like, like, like, like);
  }
  return { sql: conds.length ? `WHERE ${conds.join(" AND ")}` : "", args };
}

export function listRequests(f: { status?: RequestStatus | "all"; q?: string; page?: number }) {
  const w = where(f);
  const page = Math.max(1, f.page ?? 1);
  const rows = db()
    .prepare(`${SELECT} ${w.sql} ORDER BY r.created_at DESC, r.id DESC LIMIT ? OFFSET ?`)
    .all(...w.args, PAGE_SIZE, (page - 1) * PAGE_SIZE) as RequestRow[];
  const { n } = db().prepare(`SELECT COUNT(*) AS n FROM requests r ${w.sql}`).get(...w.args) as { n: number };
  return { rows, total: n, page, pages: Math.max(1, Math.ceil(n / PAGE_SIZE)) };
}

export function allRequests(f: { status?: RequestStatus | "all"; q?: string }) {
  const w = where(f);
  return db().prepare(`${SELECT} ${w.sql} ORDER BY r.created_at DESC`).all(...w.args) as RequestRow[];
}

export function getRequest(id: number) {
  return (db().prepare(`${SELECT} WHERE r.id = ?`).get(id) as RequestRow | undefined) ?? null;
}

export function statusCounts() {
  const rows = db().prepare("SELECT status, COUNT(*) AS n FROM requests GROUP BY status").all() as {
    status: RequestStatus;
    n: number;
  }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.n])) as Partial<Record<RequestStatus, number>>;
}

/** رقم واتساب دولي من رقم الجوال المُدخل (افتراض أرقام سعودية) */
export function toWhatsAppNumber(phone: string) {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("05") && p.length === 10) p = `966${p.slice(1)}`;
  else if (p.startsWith("5") && p.length === 9) p = `966${p}`;
  return p;
}
