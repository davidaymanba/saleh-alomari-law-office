"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";
import { TransitionLink } from "./TransitionLink";

export type ButtonVariant = "primary" | "ink" | "outline" | "light" | "outline-light";

type Props = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
  /** يفتح في تبويب جديد (واتساب، الخرائط...) */
  external?: boolean;
  magnetic?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  icon,
  external = false,
  magnetic = true,
  className,
}: Props) {
  const ref = useMagnetic<HTMLSpanElement>(magnetic ? 0.22 : 0);
  const cls = cn("btn", `btn-${variant}`, className);
  const inner = (
    <span data-magnetic-inner className="inline-flex items-center gap-2.5">
      {children}
      {icon}
    </span>
  );

  return (
    <span ref={ref} className="inline-flex">
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        <TransitionLink href={href} className={cls}>
          {inner}
        </TransitionLink>
      )}
    </span>
  );
}
