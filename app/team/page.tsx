import type { Metadata } from "next";
import { team } from "@/data/team";
import { site } from "@/data/site";
import { PageHero } from "@/components/sections/PageHero";
import { FounderSection } from "@/components/sections/FounderSection";
import { Monogram } from "@/components/sections/Monogram";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "الفريق",
  description: `فريق ${site.name}: محامون ومستشارون مرخّصون في مجالات الأحوال الشخصية والعمل والعقار والقضايا التجارية والعقود.`,
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  const members = team.filter((m) => !m.featured);

  return (
    <>
      <PageHero
        crumbs={[{ href: "/team", label: "الفريق" }]}
        eyebrow="الفريق"
        title="محامون مرخّصون يعملون على ملفك"
        lead="يُسند كل طلب إلى المحامي الأقرب لتخصصه، تحت إشراف المؤسس، مع متابعة منتظمة حتى إنجاز العمل."
      />
      <FounderSection />
      <section className="bg-sand/60 py-24 md:py-28">
        <div className="container-x">
          <SectionHeader eyebrow="فريق المكتب" title="المحامون والمستشارون" />
          <Reveal as="ul" selector="li" stagger={0.1} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <li key={m.id} className="flex flex-col">
                <Monogram initials={m.initials} />
                <h3 className="mt-6 text-xl">{m.name}</h3>
                <p className="mt-1 text-sm font-medium text-clay">{m.role}</p>
                <p className="mt-4 leading-relaxed text-muted">{m.bio}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {m.focus.map((f, i) => (
                    <li key={`${f}-${i}`} className="border border-ink/15 px-3 py-1 text-xs">
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
