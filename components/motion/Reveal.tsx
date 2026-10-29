"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal, type RevealOptions } from "@/hooks/useReveal";

type Props = RevealOptions & {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** غلاف ظهور عند التمرير؛ مرّر selector لتحريك العناصر الداخلية بتتابع */
export function Reveal({ as: Tag = "div", className, children, ...opts }: Props) {
  const ref = useReveal<HTMLElement>(opts);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
