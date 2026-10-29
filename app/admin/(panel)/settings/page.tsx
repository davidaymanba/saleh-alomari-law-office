import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/content/store";
import { settingsFields } from "@/lib/content/fields";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { PageHeader } from "@/components/admin/ui";
import { saveSiteSettings } from "../content/actions";

export const metadata: Metadata = { title: "إعدادات الموقع" };

export default async function SettingsPage() {
  await requireUser("admin");
  return (
    <>
      <PageHeader
        title="إعدادات الموقع"
        description="بيانات المكتب والتواصل والنصوص العامة التي تظهر في أكثر من صفحة."
      />
      <ContentEditor fields={settingsFields} initial={getSettings()} save={saveSiteSettings} sections />
    </>
  );
}
