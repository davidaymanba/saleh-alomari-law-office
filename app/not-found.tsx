import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NajdiMark } from "@/components/ui/NajdiMark";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80dvh] flex-col items-center justify-center pt-28 pb-20 text-center">
      <NajdiMark className="size-20 text-clay" strokeWidth={1.4} />
      <p className="mt-8 font-display text-7xl font-bold text-clay">404</p>
      <h1 className="mt-4 text-3xl md:text-4xl">الصفحة غير موجودة</h1>
      <p className="mt-4 max-w-md text-lg text-muted">ربما تغيّر رابط الصفحة أو أُزيلت. يمكنك العودة إلى الرئيسية أو طلب استشارة.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
          الصفحة الرئيسية
        </Button>
        <Button href="/consultation" variant="outline">
          اطلب استشارة
        </Button>
      </div>
    </section>
  );
}
