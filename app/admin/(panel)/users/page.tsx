import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { roleLabels, type Role } from "@/lib/auth-shared";
import { formatDateTime } from "@/lib/format";
import { Card, Notice, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "المستخدمون" };

type Props = { searchParams: Promise<{ created?: string; deleted?: string }> };

export default async function UsersPage({ searchParams }: Props) {
  const me = await requireUser("admin");
  const sp = await searchParams;
  const users = db()
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.created_at, u.last_login_at,
        (SELECT COUNT(*) FROM requests r WHERE r.assigned_to = u.id AND r.status IN ('new','in_review','contacted')) AS open_requests
       FROM users u ORDER BY u.role, u.name`,
    )
    .all() as {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at: string;
    last_login_at: string | null;
    open_requests: number;
  }[];

  return (
    <>
      <PageHeader
        title="المستخدمون"
        description="حسابات الدخول إلى لوحة التحكم وأدوارها."
        actions={
          <Link href="/admin/users/new" className="abtn abtn-primary">
            <Plus className="size-4" aria-hidden="true" />
            إضافة مستخدم
          </Link>
        }
      />
      {sp.created && <Notice tone="success">تم إنشاء الحساب.</Notice>}
      {sp.deleted && <Notice tone="success">تم حذف الحساب.</Notice>}
      <Card bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs text-muted">
                <th className="px-5 py-3 text-start font-semibold">الاسم</th>
                <th className="px-3 py-3 text-start font-semibold">الدور</th>
                <th className="px-3 py-3 text-start font-semibold">طلبات مفتوحة</th>
                <th className="px-5 py-3 text-start font-semibold">آخر دخول</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-sand/40">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/users/${u.id}`} className="font-semibold hover:text-gold">
                      {u.name}
                    </Link>
                    {u.id === me.id && <span className="ms-2 text-xs text-muted">(أنت)</span>}
                    <p className="text-xs text-muted" dir="ltr">
                      {u.email}
                    </p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-semibold",
                        u.role === "admin" ? "bg-ink text-paper" : "bg-ink/8",
                      )}
                    >
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">{u.open_requests}</td>
                  <td className="px-5 py-3.5 text-muted">{u.last_login_at ? formatDateTime(u.last_login_at) : "لم يدخل بعد"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
