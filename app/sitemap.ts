import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { practiceAreas } from "@/data/practiceAreas";
import { guides } from "@/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/practice-areas",
    "/team",
    "/guides",
    "/faq",
    "/contact",
    "/consultation",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...practiceAreas.map((a) => ({
      url: `${site.url}/practice-areas/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...guides.map((g) => ({
      url: `${site.url}/guides/${g.slug}`,
      lastModified: g.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
