import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSite } from "@/lib/content/queries";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "لوحة التحكم", template: "%s | لوحة التحكم" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const { n } = db().prepare("SELECT COUNT(*) AS n FROM requests WHERE status = 'new'").get() as { n: number };

  return (
    <AdminShell user={{ name: user.name, role: user.role }} brand={getSite().brand.primary} newRequests={n}>
      {children}
    </AdminShell>
  );
}
