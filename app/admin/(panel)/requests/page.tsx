import type { Metadata } from "next";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { listRequests, statusCounts } from "@/lib/requests";
import { isRequestStatus, requestStatusLabels, requestStatuses, type RequestStatus } from "@/lib/requests-shared";
import { Card, EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "طلبات الاستشارة" };

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string; deleted?: string }> };

export default async function RequestsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status: RequestStatus | "all" = isRequestStatus(sp.status) ? sp.status : "all";
  const q = sp.q?.trim() ?? "";
  const { rows, total, page, pages } = listRequests({ status, q, page: Number(sp.page) || 1 });
  const counts = statusCounts();
  const activeTotal = Object.entries(counts).reduce((s, [k, n]) => (k === "spam" ? s : s + (n ?? 0)), 0);

  const href = (p: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status: status === "all" ? undefined : status, q: q || undefined, ...p };
    Object.entries(merged).forEach(([k, v]) => v !== undefined && v !== "" && params.set(k, String(v)));
    const s = params.toString();
    return `/admin/requests${s ? `?${s}` : ""}`;
  };

  const tabs: { key: RequestStatus | "all"; label: string; n: number }[] = [
    { key: "all", label: "الكل", n: activeTotal },
    ...requestStatuses.map((s) => ({ key: s, label: requestStatusLabels[s], n: counts[s] ?? 0 })),
  ];

  return (
    <>
      <PageHeader
        title="طلبات الاستشارة"
        description="الطلبات الواردة من نموذج «اطلب استشارة» في الموقع."
        actions={
          <a href={`/admin/requests/export${href({ page: undefined }).replace("/admin/requests", "")}`} className="abtn abtn-ghost">
            <Download className="size-4" aria-hidden="true" />
            تصدير CSV
          </a>
        }
      />
      {sp.deleted && <Notice tone="success">تم حذف الطلب.</Notice>}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="تصفية حسب الحالة" className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={href({ status: t.key === "all" ? undefined : t.key, page: undefined })}
              aria-current={status === t.key ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-1.5 text-sm transition-colors",
                status === t.key ? "border-ink bg-ink font-semibold text-paper" : "border-ink/15 hover:border-ink/40",
              )}
            >
              {t.label}
              <span className={cn("text-xs", status === t.key ? "text-paper/70" : "text-muted")}>{t.n}</span>
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" role="search">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              name="q"
              defaultValue={q}
              placeholder="بحث بالاسم أو الجوال أو التفاصيل"
              aria-label="بحث"
              className="ainput w-72 max-w-full ps-9"
            />
          </div>
          <button type="submit" className="abtn abtn-ghost">
            بحث
          </button>
        </form>
      </div>

      <Card bodyClassName="p-0">
        {rows.length === 0 ? (
          <EmptyState
            title={q ? "لا توجد نتائج" : "لا توجد طلبات"}
            text={q ? "جرّب كلمات بحث أخرى." : "ستظهر هنا الطلبات المرسلة من نموذج الاستشارة."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-start text-xs text-muted">
                  <th className="px-5 py-3 text-start font-semibold">مقدّم الطلب</th>
                  <th className="px-3 py-3 text-start font-semibold">نوع القضية / الطلب</th>
                  <th className="px-3 py-3 text-start font-semibold">الاستعجال</th>
                  <th className="px-3 py-3 text-start font-semibold">الحالة</th>
                  <th className="px-3 py-3 text-start font-semibold">المسؤول</th>
                  <th className="px-5 py-3 text-start font-semibold">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {rows.map((r) => (
                  <tr key={r.id} className={cn("transition-colors hover:bg-sand/40", r.status === "new" && "bg-gold/[0.04]")}>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/requests/${r.id}`} className="font-semibold hover:text-gold">
                        {r.name}
                      </Link>
                      <p className="text-xs text-muted">
                        <span dir="ltr">{r.phone}</span> · {r.city}
                      </p>
                    </td>
                    <td className="px-3 py-3.5">
                      <p>{r.case_type}</p>
                      <p className="text-xs text-muted">{r.service}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={cn(r.urgency.startsWith("عاجل") && "font-semibold text-gold")}>{r.urgency.split(" (")[0]}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-3 py-3.5 text-muted">{r.assigned_name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted" title={formatDateTime(r.created_at)}>
                      {timeAgo(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {pages > 1 && (
        <nav aria-label="الصفحات" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">
            {total} طلب — صفحة {page} من {pages}
          </span>
          <span className="flex gap-2">
            {page > 1 && (
              <Link href={href({ page: page - 1 })} className="abtn abtn-ghost abtn-sm">
                السابق
              </Link>
            )}
            {page < pages && (
              <Link href={href({ page: page + 1 })} className="abtn abtn-ghost abtn-sm">
                التالي
              </Link>
            )}
          </span>
        </nav>
      )}
    </>
  );
}
