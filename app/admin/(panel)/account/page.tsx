import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { roleDescriptions, roleLabels } from "@/lib/auth-shared";
import { Card, PageHeader } from "@/components/admin/ui";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "حسابي" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="حسابي" />
      <div className="grid max-w-3xl gap-6">
        <Card title="بيانات الحساب">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">الاسم</dt>
              <dd className="font-semibold">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">البريد الإلكتروني</dt>
              <dd className="font-semibold" dir="ltr">
                {user.email}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">الدور</dt>
              <dd className="font-semibold">{roleLabels[user.role]}</dd>
              <dd className="text-sm text-muted">{roleDescriptions[user.role]}</dd>
            </div>
          </dl>
        </Card>
        <Card title="تغيير كلمة المرور">
          <PasswordForm />
        </Card>
      </div>
    </>
  );
}
