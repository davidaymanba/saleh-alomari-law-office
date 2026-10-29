"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { changeOwnPassword, type FormState } from "../users/actions";

const fields = [
  { name: "current", label: "كلمة المرور الحالية", auto: "current-password" },
  { name: "next", label: "كلمة المرور الجديدة", auto: "new-password" },
  { name: "confirm", label: "تأكيد كلمة المرور الجديدة", auto: "new-password" },
];

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changeOwnPassword, {});
  return (
    <form action={action} className="grid max-w-sm gap-4">
      {fields.map((f) => (
        <div key={f.name} className="grid gap-1.5">
          <label htmlFor={f.name} className="text-sm font-semibold">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type="password"
            dir="ltr"
            autoComplete={f.auto}
            aria-invalid={!!state.errors?.[f.name]}
            className="ainput"
          />
          {state.errors?.[f.name] && (
            <p role="alert" className="text-xs font-semibold text-[#d92d20] dark:text-[#f97066]">
              {state.errors[f.name]}
            </p>
          )}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="abtn abtn-primary">
          {pending ? "جارٍ الحفظ…" : "تغيير كلمة المرور"}
        </button>
        {state.ok && !pending && (
          <span role="status" className="inline-flex items-center gap-1 text-sm text-[#25643f] dark:text-[#7fd1a0]">
            <Check className="size-4" aria-hidden="true" /> تم التغيير
          </span>
        )}
      </div>
    </form>
  );
}
