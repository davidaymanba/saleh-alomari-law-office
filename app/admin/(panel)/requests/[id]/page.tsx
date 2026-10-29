import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRequest, toWhatsAppNumber } from "@/lib/requests";
import { whatsappUrl } from "@/lib/whatsapp";
import { formatDateTime } from "@/lib/format";
import { Card, PageHeader } from "@/components/admin/ui";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { RequestUpdateForm } from "./RequestUpdateForm";
import { deleteRequest } from "../actions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `طلب #${(await params).id}` };
}

export default async function RequestPage({ params }: Props) {
  const user = await requireUser();
  const id = Number((await params).id);
  let req = getRequest(id);
  if (!req) notFound();
  // فتح الطلب الجديد يحوّله تلقائيًا إلى "قيد الدراسة"
  if (req.status === "new") {
    db()
      .prepare("UPDATE requests SET status = 'in_review', updated_at = datetime('now') WHERE id = ? AND status = 'new'")
      .run(id);
    req = getRequest(id)!;
  }
  // صفوف node:sqlite بلا prototype؛ تُحوَّل لكائنات عادية قبل تمريرها لمكوّن متصفح
  const users = (db().prepare("SELECT id, name FROM users ORDER BY name").all() as { id: number; name: string }[]).map(
    ({ id, name }) => ({ id, name }),
  );
  const greeting = `السلام عليكم ${req.name}، معك مكتب المحاماة بخصوص طلبك (${req.case_type}).`;

  const facts: [string, string][] = [
    ["الصفة", req.applicant_type],
    ["نوع القضية", req.case_type],
    ["نوع الطلب", req.service],
    ["الاستعجال", req.urgency],
    ["المدينة", req.city],
    ["طريقة التواصل المفضلة", req.contact_method],
  ];

  return (
    <>
      <PageHeader
        back={
          <Link href="/admin/requests" className="inline-flex items-center gap-1 text-muted hover:text-ink">
            <ChevronRight className="size-4" aria-hidden="true" />
            طلبات الاستشارة
          </Link>
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            {req.name}
            <StatusBadge status={req.status} className="text-sm" />
          </span>
        }
        description={`طلب #${req.id} — ورد في ${formatDateTime(req.created_at)}`}
        actions={
          <>
            <a
              href={whatsappUrl(toWhatsAppNumber(req.phone), greeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="abtn abtn-primary"
            >
              <WhatsAppIcon className="size-4" />
              مراسلة واتساب
            </a>
            <a href={`tel:${req.phone}`} className="abtn abtn-ghost">
              <Phone className="size-4" aria-hidden="true" />
              <span dir="ltr">{req.phone}</span>
            </a>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <Card title="تفاصيل الطلب">
            <p className="leading-loose whitespace-pre-wrap">{req.details}</p>
          </Card>
          <Card title="بيانات الطلب" bodyClassName="p-0">
            <dl className="grid divide-y divide-ink/8 sm:grid-cols-2 sm:divide-y-0">
              {facts.map(([k, v]) => (
                <div key={k} className="border-ink/8 px-5 py-3.5 sm:border-b">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card title="المتابعة">
            <RequestUpdateForm
              id={req.id}
              status={req.status}
              notes={req.notes}
              assignedTo={req.assigned_to}
              users={users}
            />
            <p className="mt-4 text-xs text-muted">آخر تحديث {formatDateTime(req.updated_at)}</p>
          </Card>
          {user.role === "admin" && (
            <form action={deleteRequest.bind(null, req.id)}>
              <SubmitButton variant="danger" pending="جارٍ الحذف…" confirm="حذف هذا الطلب نهائيًا؟" className="w-full">
                حذف الطلب
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
