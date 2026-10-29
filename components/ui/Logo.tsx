"use client";

import { useSite } from "@/components/layout/SiteProvider";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const site = useSite();
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandMark height={compact ? 46 : 60} priority />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight">{site.brand.primary}</span>
        {!compact && (
          <span className="mt-1.5 text-[0.7rem] font-medium opacity-70">{site.brand.secondary}</span>
        )}
      </span>
    </span>
  );
}
