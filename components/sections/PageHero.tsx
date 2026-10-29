import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Props = {
  title: ReactNode;
  lead?: ReactNode;
  eyebrow?: string;
  crumbs: Crumb[];
  children?: ReactNode;
};

/** رأس الصفحات الداخلية */
export function PageHero({ title, lead, eyebrow, crumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-sand pt-32 md:pt-40">
      <div className="texture-dots absolute inset-0" aria-hidden="true" />
      <div className="container-x relative pb-16 md:pb-20">
        <Reveal variant="fade">
          <Breadcrumbs items={crumbs} />
        </Reveal>
        {eyebrow && (
          <Reveal variant="fade" delay={0.1} className="mt-10">
            <span className="eyebrow">{eyebrow}</span>
          </Reveal>
        )}
        <SplitHeading as="h1" delay={0.1} className={`${eyebrow ? "mt-4" : "mt-10"} max-w-4xl text-4xl leading-snug font-bold md:text-6xl`}>
          {title}
        </SplitHeading>
        {lead && (
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-2xl text-lg leading-loose text-muted md:text-xl">{lead}</p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.35} className="mt-8">
            {children}
          </Reveal>
        )}
      </div>
      <div className="crenellation relative text-paper" aria-hidden="true" />
    </section>
  );
}
