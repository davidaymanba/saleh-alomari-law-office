import { ArrowLeft } from "lucide-react";
import type { PracticeArea } from "@/data/practiceAreas";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { cn } from "@/lib/utils";

export function AreaCard({ area, className }: { area: PracticeArea; className?: string }) {
  return (
    <TransitionLink
      href={`/practice-areas/${area.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border border-ink/12 bg-paper p-7 transition-colors duration-500 hover:border-ink",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 ease-[var(--ease-najdi)] group-hover:scale-y-100"
      />
      <span className="relative flex items-start justify-between">
        <Icon name={area.icon} className="size-8 text-clay transition-colors duration-500 group-hover:text-clay-soft dark:group-hover:text-clay-2" />
        <ArrowLeft
          className="size-5 text-muted transition-all duration-500 group-hover:-translate-x-1 group-hover:text-paper"
          aria-hidden="true"
        />
      </span>
      <span className="relative mt-10 font-display text-xl font-semibold transition-colors duration-500 group-hover:text-paper">
        {area.title}
      </span>
      <span className="relative mt-2 text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-paper/70">
        {area.description}
      </span>
    </TransitionLink>
  );
}
