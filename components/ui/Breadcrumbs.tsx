import { ChevronLeft } from "lucide-react";
import { getSite } from "@/lib/content/queries";
import { TransitionLink } from "./TransitionLink";

export type Crumb = { href: string; label: string };

/** مسار التنقل مع بيانات BreadcrumbList المنظمة */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const site = getSite();
  const all = [{ href: "/", label: "الرئيسية" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: new URL(c.href, site.url).toString(),
    })),
  };

  return (
    <nav aria-label="مسار التنقل" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 opacity-80">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-medium">
                  {c.label}
                </span>
              ) : (
                <>
                  <TransitionLink href={c.href} className="link-underline">
                    {c.label}
                  </TransitionLink>
                  <ChevronLeft className="size-3.5 opacity-60" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
