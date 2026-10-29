"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "");

  if (!email || !password) return { error: "أدخل البريد الإلكتروني وكلمة المرور", email };

  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000) || !rateLimit(`login:${email.toLowerCase()}`, 6, 15 * 60 * 1000)) {
    return { error: "محاولات كثيرة. حاول مجددًا بعد 15 دقيقة.", email };
  }

  const user = db().prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة", email };
  }

  await createSession(user.id);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
