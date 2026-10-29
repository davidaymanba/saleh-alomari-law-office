import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Role } from "@/lib/auth-shared";
import { Card, PageHeader } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { UserForm } from "../UserForm";
import { createUser, deleteUser, updateUser } from "../actions";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "مستخدم" };

export default async function UserPage({ params }: Props) {
  const me = await requireUser("admin");
  const { id } = await params;
  const isNew = id === "new";
  const user = isNew
    ? null
    : (db().prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(Number(id)) as
        | { id: number; name: string; email: string; role: Role }
        | undefined);
  if (!isNew && !user) notFound();

  return (
    <>
      <PageHeader
        back={
          <Link href="/admin/users" className="inline-flex items-center gap-1 text-muted hover:text-ink">
            <ChevronRight className="size-4" aria-hidden="true" />
            المستخدمون
          </Link>
        }
        title={user ? user.name : "إضافة مستخدم"}
        actions={
          user &&
          user.id !== me.id && (
            <form action={deleteUser.bind(null, user.id)}>
              <SubmitButton variant="danger" pending="جارٍ الحذف…" confirm={`حذف حساب «${user.name}»؟`}>
                حذف الحساب
              </SubmitButton>
            </form>
          )
        }
      />
      <Card className="max-w-3xl">
        {user ? (
          <UserForm
            action={updateUser.bind(null, user.id)}
            user={{ name: user.name, email: user.email, role: user.role }}
            submitLabel="حفظ التعديلات"
          />
        ) : (
          <UserForm action={createUser} submitLabel="إنشاء الحساب" />
        )}
      </Card>
    </>
  );
}
