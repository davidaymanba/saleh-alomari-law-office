import "server-only";
import { cache } from "react";
import { getSettings, listDocs } from "./store";
import type { Track } from "./schema";

/** قراءات الموقع العام (مخزّنة لكل طلب) */
export const getSite = cache(() => getSettings());

export const getServices = cache(() => listDocs("services").map((r) => r.data));
export const getService = (slug: string) => getServices().find((s) => s.slug === slug);

export const getAreas = cache(() => listDocs("areas").map((r) => r.data));
export const getArea = (slug: string) => getAreas().find((a) => a.slug === slug);
export const getAreasByTrack = (track: Track) => getAreas().filter((a) => a.track === track);

export const getTeam = cache(() => listDocs("team").map((r) => r.data));

export const getGuides = cache(() =>
  listDocs("guides")
    .map((r) => r.data)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
);
export const getGuide = (slug: string) => getGuides().find((g) => g.slug === slug);

export const getFaq = cache(() => listDocs("faq").map((r) => r.data));
export const getHomeFaq = () => {
  const all = getFaq().flatMap((g) => g.items);
  const picked = all.filter((i) => i.home);
  return (picked.length ? picked : all).slice(0, 6);
};
