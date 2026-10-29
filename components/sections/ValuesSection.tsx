import { values } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";

export function ValuesSection() {
  return (
    <section className="on-dark relative text-paper">
      <div className="crenellation text-ink" aria-hidden="true" />
      <div className="relative bg-ink py-24 md:py-32">
        <div className="texture-dots-light absolute inset-0" aria-hidden="true" />
        <div className="container-x relative">
          <SectionHeader
            dark
            eyebrow="لماذا نحن"
            title="قيمٌ نعمل بها في كل ملف"
            lead="الثقة في العلاقة بين المحامي وموكله تُبنى بالوضوح والمتابعة، لا بالوعود."
          />
          <Reveal as="ul" selector="li" stagger={0.1} className="mt-16 grid gap-px bg-paper/12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.title} className="flex flex-col gap-4 bg-ink p-8 lg:min-h-72">
                <span className="font-display text-5xl font-bold text-clay-soft/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-auto text-2xl">{v.title}</h3>
                <p className="leading-relaxed text-paper/65">{v.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
      <div className="crenellation rotate-180 text-ink" aria-hidden="true" />
    </section>
  );
}
