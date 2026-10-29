"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { roleDescriptions, roleLabels, roles, type Role } from "@/lib/auth-shared";
import type { FormState } from "./actions";

type Props = {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  user?: { name: string; email: string; role: Role };
  submitLabel: string;
};

export function UserForm({ action, user, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const err = (k: string) =>
    state.errors?.[k] && (
      <p role="alert" className="text-xs font-semibold text-[#d92d20] dark:text-[#f97066]">
        {state.errors[k]}
      </p>
    );

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor="name" className="text-sm font-semibold">
            الاسم
          </label>
          <input id="name" name="name" defaultValue={user?.name} aria-invalid={!!state.errors?.name} className="ainput" />
          {err("name")}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            defaultValue={user?.email}
            aria-invalid={!!state.errors?.email}
            className="ainput text-start"
          />
          {err("email")}
        </div>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-semibold">الدور</legend>
        {roles.map((r) => (
          <label key={r} className="flex cursor-pointer items-start gap-3 border border-ink/12 p-3 has-[:checked]:border-gold has-[:checked]:bg-gold/5">
            <input type="radio" name="role" value={r} defaultChecked={(user?.role ?? "editor") === r} className="mt-1 accent-gold" />
            <span>
              <span className="block text-sm font-semibold">{roleLabels[r]}</span>
              <span className="block text-xs text-muted">{roleDescriptions[r]}</span>
            </span>
          </label>
        ))}
        {err("role")}
      </fieldset>

      <div className="grid gap-1.5 md:max-w-sm">
        <label htmlFor="password" className="text-sm font-semibold">
          {user ? "كلمة مرور جديدة" : "كلمة المرور"}
        </label>
        {user && <p className="-mt-1 text-xs text-muted">اتركها فارغة للإبقاء على كلمة المرور الحالية.</p>}
        <input
          id="password"
          name="password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          aria-invalid={!!state.errors?.password}
          className="ainput"
        />
        {err("password")}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="abtn abtn-primary">
          {pending ? "جارٍ الحفظ…" : submitLabel}
        </button>
        {state.ok && !pending && (
          <span role="status" className="inline-flex items-center gap-1 text-sm text-[#25643f] dark:text-[#7fd1a0]">
            <Check className="size-4" aria-hidden="true" /> تم الحفظ
          </span>
        )}
        {state.error && <span className="text-sm font-semibold text-[#d92d20]">{state.error}</span>}
      </div>
    </form>
  );
}
