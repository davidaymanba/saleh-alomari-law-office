import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { dailyRequests, dailyViews, requestsBy, topPages, totals } from "@/lib/analytics";
import { listRequests } from "@/lib/requests";
import { countDocs } from "@/lib/content/store";
import { collectionKeys, collectionMeta } from "@/lib/content/collections";
import { formatNumber, timeAgo } from "@/lib/format";
import { BarList, ColumnChart, StatTile } from "@/components/admin/charts";
import { Card, EmptyState, Notice } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "نظرة عامة" };

const DAYS = 30;

export default async function OverviewPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser();
  const { denied } = await searchParams;
  const { current, previous } = totals(DAYS);
  const pending = listRequests({ status: "new" }).total;
  const latest = listRequests({ status: "all" }).rows.slice(0, 6);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl">مرحبًا، {user.name}</h1>
        <p className="mt-1.5 text-sm text-muted">ملخص آخر {DAYS} يومًا مقارنة بالفترة السابقة.</p>
      </div>
      {denied && <Notice tone="warning">هذه الصفحة متاحة للمديرين فقط.</Notice>}

      {pending > 0 && (
        <Link
          href="/admin/requests?status=new"
          className="mb-6 flex items-center gap-4 border border-gold/40 bg-gold/8 px-5 py-4 transition-colors hover:bg-gold/12"
        >
          <Inbox className="size-5 text-gold" aria-hidden="true" />
          <span className="flex-1 font-semibold">
            {pending === 1 ? "طلب استشارة جديد بانتظار المراجعة" : `${pending} طلبات استشارة جديدة بانتظار المراجعة`}
          </span>
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="الزيارات" value={formatNumber(current.views)} current={current.views} previous={previous.views} />
        <StatTile label="الزوار" value={formatNumber(current.visitors)} current={current.visitors} previous={previous.visitors} />
        <StatTile label="طلبات الاستشارة" value={formatNumber(current.requests)} current={current.requests} previous={previous.requests} />
        <StatTile
          label="معدل التحويل"
          value={`${current.conversion.toFixed(1)}%`}
          hint={<span className="text-muted">طلبات ÷ زوار</span>}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="الزيارات اليومية" action={<Link href="/admin/analytics" className="text-xs text-muted hover:text-ink">التفاصيل</Link>}>
          <ColumnChart data={dailyViews(DAYS)} unit="زيارة" />
        </Card>
        <Card title="طلبات الاستشارة اليومية">
          <ColumnChart data={dailyRequests(DAYS)} unit="طلب" />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          title="أحدث الطلبات"
          className="lg:col-span-2"
          bodyClassName="p-0"
          action={<Link href="/admin/requests" className="text-xs text-muted hover:text-ink">كل الطلبات</Link>}
        >
          {latest.length === 0 ? (
            <EmptyState title="لا توجد طلبات بعد" text="ستظهر هنا الطلبات المرسلة من نموذج الاستشارة." />
          ) : (
            <ul className="divide-y divide-ink/8">
              {latest.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/requests/${r.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-sand/40">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{r.name}</span>
                      <span className="block truncate text-xs text-muted">
                        {r.case_type} — {r.service}
                      </span>
                    </span>
                    <StatusBadge status={r.status} />
                    <span className="w-20 shrink-0 text-end text-xs text-muted">{timeAgo(r.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="الطلبات حسب نوع القضية">
          <BarList rows={requestsBy("case_type", DAYS, 6)} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="الصفحات الأكثر زيارة" className="lg:col-span-2">
          <BarList rows={topPages(DAYS, 6)} labelDir="ltr" />
        </Card>
        <Card title="المحتوى" bodyClassName="p-0">
          <ul className="divide-y divide-ink/8">
            {collectionKeys.map((k) => (
              <li key={k}>
                <Link href={`/admin/content/${k}`} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-sand/40">
                  {collectionMeta[k].label}
                  <span className="font-semibold tabular-nums">{countDocs(k)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
