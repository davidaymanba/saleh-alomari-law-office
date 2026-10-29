import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({ eyebrow, title, lead, action, dark = false, as = "h2", className }: Props) {
  return (
    <div className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <Reveal variant="fade" className="mb-4">
            <span className={cn("eyebrow", dark && "text-gold-soft")}>{eyebrow}</span>
          </Reveal>
        )}
        <SplitHeading as={as} className="text-3xl leading-snug md:text-[2.75rem]">
          {title}
        </SplitHeading>
        {lead && (
          <Reveal delay={0.15}>
            <p className={cn("mt-5 text-lg leading-relaxed", dark ? "text-paper/70" : "text-muted")}>{lead}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal variant="fade" delay={0.2} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
