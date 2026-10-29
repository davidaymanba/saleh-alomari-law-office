import { getSite } from "@/lib/content/queries";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";

export function TrustStats() {
  const { trustStats } = getSite();
  return (
    <section aria-label="مؤشرات" className="container-x">
      <Reveal
        selector="[data-stat]"
        stagger={0.1}
        as="dl"
        className="grid grid-cols-2 border-y border-ink/15 lg:grid-cols-4"
      >
        {trustStats.map((s, i) => (
          <div
            key={s.label}
            data-stat
            className={`flex flex-col-reverse gap-2 px-2 py-8 md:px-6 md:py-10 ${i % 2 === 1 ? "border-s border-ink/15" : ""} ${i >= 2 ? "border-t border-ink/15 lg:border-t-0" : ""} ${i === 2 ? "lg:border-s" : ""}`}
          >
            <dt className="text-sm leading-relaxed text-muted md:text-base">{s.label}</dt>
            <dd className="font-display text-4xl font-bold text-gold md:text-5xl">
              {typeof s.value === "number" ? <Counter value={s.value} /> : s.value}
            </dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
