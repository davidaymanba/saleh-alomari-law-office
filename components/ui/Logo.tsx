import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { NajdiMark } from "./NajdiMark";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <NajdiMark className="size-10 text-clay" strokeWidth={2.2} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight">{site.brand.primary}</span>
        {!compact && (
          <span className="mt-1.5 text-[0.7rem] font-medium opacity-70">{site.brand.secondary}</span>
        )}
      </span>
    </span>
  );
}
