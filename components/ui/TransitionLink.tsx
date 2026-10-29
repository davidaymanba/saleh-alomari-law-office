"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/layout/TransitionProvider";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * رابط داخلي يمر عبر ستارة الانتقال.
 * النقرات المعدّلة (Ctrl/⌘/Shift/الزر الأوسط) والروابط الخارجية تعمل بشكل طبيعي.
 */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = usePageTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (target && target !== "_self") ||
      !href.startsWith("/")
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return <Link href={href} target={target} onClick={handle} {...rest} />;
}
