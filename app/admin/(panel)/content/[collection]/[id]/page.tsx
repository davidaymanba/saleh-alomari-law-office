import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { collectionMeta, isCollection } from "@/lib/content/collections";
import { collectionFields } from "@/lib/content/fields";
import { getDoc, listDocs } from "@/lib/content/store";
import type { CollectionDoc, CollectionKey } from "@/lib/content/schema";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { Notice, PageHeader } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { formatDateTime } from "@/lib/format";
import { deleteContent, saveContent } from "../../actions";

type Props = {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, id } = await params;
  if (!isCollection(collection)) return {};
  return { title: `${id === "new" ? "إضافة" : "تعديل"} ${collectionMeta[collection].singular}` };
}

export default async function EditPage({ params, searchParams }: Props) {
  const { collection, id } = await params;
  if (!isCollection(collection)) notFound();
  const { saved } = await searchParams;
  return <Editor collection={collection} id={id} saved={!!saved} />;
}

function Editor<K extends CollectionKey>({ collection, id, saved }: { collection: K; id: string; saved: boolean }) {
  const meta = collectionMeta[collection];
  const isNew = id === "new";
  const row = isNew ? null : getDoc(collection, Number(id));
  if (!isNew && !row) notFound();

  const areas = listDocs("areas").map((r) => ({ value: r.data.slug, label: r.data.title }));
  const fields = collectionFields(collection, { areas });
  const base = `/admin/content/${collection}`;
  const doc = row?.data as CollectionDoc[K] | undefined;

  return (
    <>
      <PageHeader
        back={
          <Link href={base} className="inline-flex items-center gap-1 text-muted hover:text-ink">
            <ChevronRight className="size-4" aria-hidden="true" />
            {meta.label}
          </Link>
        }
        title={doc ? meta.title(doc) : `إضافة ${meta.singular}`}
        description={
          row ? `آخر تعديل ${formatDateTime(row.updatedAt)}${row.updatedBy ? ` بواسطة ${row.updatedBy}` : ""}` : meta.description
        }
        actions={
          doc && (
            <>
              <a href={meta.publicPath(doc)} target="_blank" rel="noopener" className="abtn abtn-ghost">
                <ExternalLink className="size-4" aria-hidden="true" />
                عرض في الموقع
              </a>
              <form action={deleteContent.bind(null, collection, row!.id)}>
                <SubmitButton variant="danger" pending="جارٍ الحذف…" confirm={`حذف «${meta.title(doc)}» نهائيًا؟`}>
                  حذف
                </SubmitButton>
              </form>
            </>
          )
        }
      />
      {saved && <Notice tone="success">تم الحفظ، والتعديلات ظاهرة الآن في الموقع.</Notice>}
      <ContentEditor
        key={row?.id ?? "new"}
        fields={fields}
        initial={(row?.data as Record<string, unknown>) ?? meta.empty()}
        save={saveContent.bind(null, collection, row?.id ?? null)}
        newBase={isNew ? base : undefined}
      />
    </>
  );
}
