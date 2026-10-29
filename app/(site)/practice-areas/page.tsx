import type { Metadata } from "next";
import { getAreasByTrack } from "@/lib/content/queries";
import { tracks, type Track } from "@/lib/content/schema";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { AreaCard } from "@/components/sections/AreaCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "مجالات الممارسة",
  description:
    "مجالات عملنا للأفراد: الأحوال الشخصية، العمالية، العقارات، التركات، الجزائية، التنفيذ. وللشركات: التأسيس، العقود، التجارية، الاستثمار الأجنبي، التحكيم، الملكية الفكرية.",
  alternates: { canonical: "/practice-areas" },
};

export default function PracticeAreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/practice-areas", label: "مجالات الممارسة" }]}
        eyebrow="مجالات الممارسة"
        title="خبرة في المسائل التي تمس حياتك وأعمالك"
        lead="نعمل في مسارين: مسار للأفراد، ومسار للشركات والمنشآت. اختر المجال الأقرب لموضوعك لتعرف كيف نساعدك."
      />
      {(["individuals", "companies"] as Track[]).map((t, i) => (
        <section key={t} id={t} className={`scroll-mt-24 py-20 md:py-28 ${i === 1 ? "bg-sand/60" : ""}`}>
          <div className="container-x">
            <SectionHeader eyebrow={tracks[t].label} title={tracks[t].title} lead={tracks[t].lead} />
            <Reveal selector="[data-card]" stagger={0.07} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getAreasByTrack(t).map((a) => (
                <div key={a.slug} data-card>
                  <AreaCard area={a} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      ))}
      <CtaBand />
    </>
  );
}
