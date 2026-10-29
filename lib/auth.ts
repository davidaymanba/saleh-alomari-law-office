import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";
import { SESSION_COOKIE, type Role } from "./auth-shared";

export type User = { id: number; name: string; email: string; role: Role; lastLoginAt: string | null };

const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const sha = (t: string) => createHash("sha256").update(t).digest("hex");

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + TTL_MS;
  const d = db();
  d.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  d.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(sha(token), userId, expires);
  d.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").run(userId);

  // الكوكي الآمنة تُضبط فقط عند العمل عبر HTTPS (خلف خادم وسيط يضبط x-forwarded-proto)
  const secure = (await headers()).get("x-forwarded-proto") === "https";
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires: new Date(expires),
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha(token));
  jar.delete(SESSION_COOKIE);
}

/** يحذف كل جلسات المستخدم (عند تغيير كلمة المرور أو الحذف) */
export function destroyUserSessions(userId: number) {
  db().prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = db()
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.last_login_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha(token), Date.now()) as
    | { id: number; name: string; email: string; role: Role; last_login_at: string | null }
    | undefined;
  return row ? { id: row.id, name: row.name, email: row.email, role: row.role, lastLoginAt: row.last_login_at } : null;
});

/** يتطلب مستخدمًا مسجّلًا (وبدور مدير إن طُلب) وإلا يعيد التوجيه */
export async function requireUser(role?: Role): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (role === "admin" && user.role !== "admin") redirect("/admin?denied=1");
  return user;
}
