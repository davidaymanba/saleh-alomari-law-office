import { ArrowLeft } from "lucide-react";
import { formatDate, readingTime, type Guide } from "@/data/guides";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <TransitionLink
      href={`/guides/${guide.slug}`}
      className="group flex h-full flex-col border-t-2 border-ink pt-6 transition-colors duration-500 hover:border-clay"
    >
      <span className="flex items-center justify-between text-sm">
        <span className="font-semibold text-clay">{guide.category}</span>
        <span className="text-muted">{readingTime(guide)} دقائق قراءة</span>
      </span>
      <h3 className="mt-5 text-2xl leading-snug">
        <span className="link-underline">{guide.title}</span>
      </h3>
      <p className="mt-4 flex-1 leading-relaxed text-muted">{guide.excerpt}</p>
      <span className="mt-6 flex items-center justify-between text-sm">
        <time dateTime={guide.publishedAt} className="text-muted">
          {formatDate(guide.publishedAt)}
        </time>
        <span className="inline-flex items-center gap-2 font-semibold">
          اقرأ الدليل
          <ArrowLeft className="size-4 transition-transform duration-500 group-hover:-translate-x-1.5" aria-hidden="true" />
        </span>
      </span>
    </TransitionLink>
  );
}
