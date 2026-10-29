"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "@/lib/content/schema";

const SiteContext = createContext<SiteSettings | null>(null);

/** إعدادات الموقع (من قاعدة البيانات) للمكوّنات العاملة في المتصفح */
export function SiteProvider({ site, children }: { site: SiteSettings; children: ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used inside <SiteProvider>");
  return site;
}
