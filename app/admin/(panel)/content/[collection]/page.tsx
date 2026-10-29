import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus } from "lucide-react";
import { collectionMeta, isCollection } from "@/lib/content/collections";
import { listDocs } from "@/lib/content/store";
import type { CollectionDoc, CollectionKey } from "@/lib/content/schema";
import { Card, EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/format";
import { moveContent } from "../actions";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ deleted?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollection(collection) ? collectionMeta[collection].label : "المحتوى" };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { collection } = await params;
  if (!isCollection(collection)) notFound();
  const { deleted } = await searchParams;
  return <List collection={collection} deleted={!!deleted} />;
}

function List<K extends CollectionKey>({ collection, deleted }: { collection: K; deleted: boolean }) {
  const meta = collectionMeta[collection];
  const rows = listDocs(collection);
  const base = `/admin/content/${collection}`;

  return (
    <>
      <PageHeader
        title={meta.label}
        description={meta.description}
        actions={
          <Link href={`${base}/new`} className="abtn abtn-primary">
            <Plus className="size-4" aria-hidden="true" />
            إضافة {meta.singular}
          </Link>
        }
      />
      {deleted && <Notice tone="success">تم الحذف.</Notice>}
      <Card bodyClassName="p-0">
        {rows.length === 0 ? (
          <EmptyState title="لا توجد عناصر بعد" text={`أضف أول ${meta.singular} ليظهر في الموقع.`} />
        ) : (
          <ul className="divide-y divide-ink/10">
            {rows.map((row, i) => {
              const doc = row.data as CollectionDoc[K];
              return (
                <li key={row.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <div className="flex shrink-0 gap-1">
                    <form action={moveContent.bind(null, collection, row.id, -1)}>
                      <button type="submit" disabled={i === 0} className="abtn abtn-ghost abtn-sm" aria-label="تحريك للأعلى">
                        <ArrowUp className="size-3.5" />
                      </button>
                    </form>
                    <form action={moveContent.bind(null, collection, row.id, 1)}>
                      <button
                        type="submit"
                        disabled={i === rows.length - 1}
                        className="abtn abtn-ghost abtn-sm"
                        aria-label="تحريك للأسفل"
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                    </form>
                  </div>
                  <Link href={`${base}/${row.id}`} className="group min-w-0 flex-1">
                    <p className="font-semibold group-hover:text-gold">{meta.title(doc)}</p>
                    <p className="truncate text-sm text-muted">{meta.subtitle(doc)}</p>
                  </Link>
                  <p className="shrink-0 text-xs text-muted">
                    آخر تعديل {formatDateTime(row.updatedAt)}
                    {row.updatedBy && ` — ${row.updatedBy}`}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    <a href={meta.publicPath(doc)} target="_blank" rel="noopener" className="abtn abtn-ghost abtn-sm" aria-label="عرض في الموقع">
                      <ExternalLink className="size-3.5" />
                    </a>
                    <Link href={`${base}/${row.id}`} className="abtn abtn-ghost abtn-sm">
                      <Pencil className="size-3.5" aria-hidden="true" />
                      تعديل
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <p className="mt-4 text-xs text-muted">الترتيب هنا هو ترتيب الظهور في الموقع.</p>
    </>
  );
}
