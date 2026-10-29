"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroyUserSessions, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { roles } from "@/lib/auth-shared";

export type FormState = { ok?: boolean; error?: string; errors?: Record<string, string> };

const password = z.string().min(8, "كلمة المرور 8 أحرف على الأقل");
const base = z.object({
  name: z.string().trim().min(2, "اكتب الاسم"),
  email: z.string().trim().email("بريد إلكتروني غير صحيح"),
  role: z.enum(roles, { error: "اختر الدور" }),
});

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message]));
}

const adminCount = () => (db().prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get() as { n: number }).n;

export async function createUser(_prev: FormState, form: FormData): Promise<FormState> {
  await requireUser("admin");
  const parsed = base.extend({ password }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { errors: fieldErrors(parsed.error.issues) };
  const { name, email, role, password: pw } = parsed.data;
  if (db().prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
    return { errors: { email: "هذا البريد مستخدم لحساب آخر" } };
  }
  db().prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(name, email, hashPassword(pw), role);
  revalidatePath("/admin/users");
  redirect("/admin/users?created=1");
}

export async function updateUser(id: number, _prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireUser("admin");
  const parsed = base.extend({ password: z.union([z.literal(""), password]) }).safeParse(Object.fromEntries(form));
  if (!parsed.success) return { errors: fieldErrors(parsed.error.issues) };
  const { name, email, role, password: pw } = parsed.data;

  const current = db().prepare("SELECT role FROM users WHERE id = ?").get(id) as { role: string } | undefined;
  if (!current) return { error: "المستخدم غير موجود" };
  if (db().prepare("SELECT 1 FROM users WHERE email = ? AND id != ?").get(email, id)) {
    return { errors: { email: "هذا البريد مستخدم لحساب آخر" } };
  }
  if (current.role === "admin" && role !== "admin" && adminCount() <= 1) {
    return { errors: { role: "يجب أن يبقى مدير واحد على الأقل" } };
  }

  db().prepare("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?").run(name, email, role, id);
  if (pw) {
    db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(pw), id);
    if (id !== me.id) destroyUserSessions(id);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteUser(id: number) {
  const me = await requireUser("admin");
  if (id === me.id) return;
  const target = db().prepare("SELECT role FROM users WHERE id = ?").get(id) as { role: string } | undefined;
  if (!target || (target.role === "admin" && adminCount() <= 1)) return;
  db().prepare("DELETE FROM users WHERE id = ?").run(id);
  revalidatePath("/admin/users");
  redirect("/admin/users?deleted=1");
}

export async function changeOwnPassword(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireUser();
  const current = String(form.get("current") ?? "");
  const next = password.safeParse(form.get("next"));
  if (!next.success) return { errors: { next: next.error.issues[0].message } };
  if (next.data !== form.get("confirm")) return { errors: { confirm: "كلمتا المرور غير متطابقتين" } };
  const row = db().prepare("SELECT password_hash FROM users WHERE id = ?").get(me.id) as { password_hash: string };
  if (!verifyPassword(current, row.password_hash)) return { errors: { current: "كلمة المرور الحالية غير صحيحة" } };
  db().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(next.data), me.id);
  return { ok: true };
}
