"use client";

import type { ReactNode } from "react";
import { useSplitReveal, type SplitRevealOptions } from "@/hooks/useSplitReveal";

type Props = SplitRevealOptions & {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  children: ReactNode;
};

/** عنوان يظهر سطرًا سطرًا (كلمات وأسطر فقط — لا تقسيم للحروف العربية) */
export function SplitHeading({ as: Tag = "h2", className, children, ...opts }: Props) {
  const ref = useSplitReveal<HTMLHeadingElement>(opts);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
