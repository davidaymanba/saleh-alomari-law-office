"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-8 grid gap-5">
      <input type="hidden" name="next" value={next} />
      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="username"
          required
          defaultValue={state.email}
          className="ainput text-start"
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold">
          كلمة المرور
        </label>
        <input id="password" name="password" type="password" dir="ltr" autoComplete="current-password" required className="ainput" />
      </div>
      {state.error && (
        <p role="alert" className="border-s-2 border-[#d92d20] bg-[#d92d20]/8 px-3 py-2 text-sm">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="abtn abtn-primary min-h-11">
        {pending ? "جارٍ الدخول…" : "دخول"}
      </button>
    </form>
  );
}
