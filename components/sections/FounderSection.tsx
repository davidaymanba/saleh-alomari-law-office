import { ArrowLeft } from "lucide-react";
import { team } from "@/data/team";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Monogram } from "./Monogram";

export function FounderSection() {
  const founder = team.find((m) => m.featured) ?? team[0];

  return (
    <section className="container-x grid items-center gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <Reveal variant="clip" className="overflow-hidden">
          <Parallax speed={10}>
            <Monogram initials={founder.initials} className="w-full" />
          </Parallax>
        </Reveal>
      </div>
      <div className="lg:col-span-7">
        <Reveal variant="fade" className="mb-4">
          <span className="eyebrow">المؤسس</span>
        </Reveal>
        <SplitHeading className="text-3xl md:text-[2.75rem]">{founder.name}</SplitHeading>
        <Reveal selector="[data-r]" stagger={0.1} delay={0.1}>
          <p data-r className="mt-2 font-medium text-clay">
            {founder.role}
          </p>
          <p data-r className="mt-6 text-lg leading-loose text-muted">
            {founder.bio}
          </p>
          <ul data-r className="mt-6 flex flex-wrap gap-2">
            {founder.focus.map((f) => (
              <li key={f} className="border border-ink/15 px-3.5 py-1.5 text-sm">
                {f}
              </li>
            ))}
          </ul>
          <div data-r className="mt-9">
            <Button href="/team" variant="outline" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
              تعرّف على الفريق
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
