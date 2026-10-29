import { Hero } from "@/components/sections/Hero";
import { TrustStats } from "@/components/sections/TrustStats";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PracticeTracks } from "@/components/sections/PracticeTracks";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { GuidesSection } from "@/components/sections/GuidesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { getAreas, getSite } from "@/lib/content/queries";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <ServicesSection />
      <PracticeTracks areas={getAreas()} />
      <ProcessSection steps={getSite().processSteps} />
      <ValuesSection />
      <FounderSection />
      <GuidesSection />
      <FaqSection />
      <CtaBand />
    </>
  );
}
