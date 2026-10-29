"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pending: pendingLabel = "جارٍ الحفظ…",
  variant = "primary",
  className,
  confirm,
}: {
  children: ReactNode;
  pending?: string;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
  /** رسالة تأكيد قبل الإرسال */
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={cn("abtn", `abtn-${variant}`, className)}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
