import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSite } from "@/lib/content/queries";
import { BrandMark } from "@/components/ui/BrandMark";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "تسجيل الدخول | لوحة التحكم", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentUser()) redirect("/admin");
  const { next } = await searchParams;
  const site = getSite();

  return (
    <main className="grid min-h-dvh flex-1 lg:grid-cols-2">
      <div className="on-dark relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-paper lg:flex">
        <div className="texture-dots-light absolute inset-0" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <BrandMark height={110} alt={site.name} />
        </div>
        <div className="relative">
          <p className="font-display text-4xl leading-snug font-bold">لوحة التحكم</p>
          <p className="mt-4 max-w-sm leading-relaxed text-paper/65">
            إدارة طلبات الاستشارة، ومحتوى الموقع، ومتابعة الزيارات — في مكان واحد.
          </p>
        </div>
        <div className="crenellation absolute inset-x-0 bottom-0 rotate-180 text-paper/5" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-center bg-paper px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark height={52} />
            <span className="font-display text-lg font-bold">{site.brand.primary}</span>
          </div>
          <h1 className="text-2xl">تسجيل الدخول</h1>
          <p className="mt-1.5 text-sm text-muted">أدخل بيانات حسابك للوصول إلى لوحة التحكم.</p>
          <LoginForm next={next ?? ""} />
        </div>
      </div>
    </main>
  );
}
