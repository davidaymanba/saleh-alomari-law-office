import type { Metadata } from "next";
import Link from "next/link";
import { dailyRequests, dailyViews, devices, requestsBy, topPages, topReferrers, totals } from "@/lib/analytics";
import { formatNumber } from "@/lib/format";
import { BarList, ColumnChart, StatTile } from "@/components/admin/charts";
import { Card, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "الإحصاءات" };

const ranges = [7, 30, 90] as const;

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams;
  const days = ranges.find((r) => String(r) === sp.days) ?? 30;
  const { current, previous } = totals(days);

  return (
    <>
      <PageHeader
        title="الإحصاءات"
        description="زيارات الموقع وطلبات الاستشارة. لا تُستخدم كوكيز ولا تُحفظ بيانات شخصية للزوار."
        actions={
          <nav aria-label="الفترة" className="flex border border-ink/15">
            {ranges.map((r) => (
              <Link
                key={r}
                href={`/admin/analytics?days=${r}`}
                aria-current={r === days ? "page" : undefined}
                className={cn("px-4 py-2 text-sm", r === days ? "bg-ink font-semibold text-paper" : "hover:bg-ink/5")}
              >
                {r} يومًا
              </Link>
            ))}
          </nav>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="الزيارات" value={formatNumber(current.views)} current={current.views} previous={previous.views} />
        <StatTile label="الزوار" value={formatNumber(current.visitors)} current={current.visitors} previous={previous.visitors} />
        <StatTile label="طلبات الاستشارة" value={formatNumber(current.requests)} current={current.requests} previous={previous.requests} />
        <StatTile
          label="معدل التحويل"
          value={`${current.conversion.toFixed(1)}%`}
          current={current.conversion}
          previous={previous.conversion}
        />
      </div>

      <div className="mt-6 grid gap-6">
        <Card title="الزيارات اليومية">
          <ColumnChart data={dailyViews(days)} unit="زيارة" height={220} />
        </Card>
        <Card title="طلبات الاستشارة اليومية">
          <ColumnChart data={dailyRequests(days)} unit="طلب" />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="الصفحات الأكثر زيارة">
          <BarList rows={topPages(days, 10)} labelDir="ltr" />
        </Card>
        <Card title="مصادر الزوار">
          <BarList rows={topReferrers(days)} />
        </Card>
        <Card title="الأجهزة">
          <BarList rows={devices(days)} />
        </Card>
        <Card title="الطلبات حسب المدينة">
          <BarList rows={requestsBy("city", days)} />
        </Card>
        <Card title="الطلبات حسب نوع القضية">
          <BarList rows={requestsBy("case_type", days)} />
        </Card>
        <Card title="الطلبات حسب نوع الخدمة">
          <BarList rows={requestsBy("service", days)} />
        </Card>
      </div>
    </>
  );
}
