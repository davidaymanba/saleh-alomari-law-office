import Image from "next/image";
import { cn } from "@/lib/utils";

/** أبعاد ملف الشعار (بعد قصّ الهوامش) */
const W = 392;
const H = 524;

/**
 * شعار المكتب. تُعرض النسخة الملوّنة على الخلفيات الفاتحة، والنسخة ذات الخط العاجي
 * داخل الأقسام الداكنة (.on-dark) وفي الوضع الليلي — بالـ CSS دون JavaScript.
 */
export function BrandMark({
  height,
  className,
  alt = "",
  priority = false,
  fluid = false,
}: {
  /** الارتفاع بالبكسل (يُتجاهل مع fluid) */
  height: number;
  className?: string;
  alt?: string;
  priority?: boolean;
  /** يملأ عرض الحاوية مع الحفاظ على النسبة */
  fluid?: boolean;
}) {
  const width = Math.round((height * W) / H);
  const size = fluid ? { width: "100%", height: "auto" } : { height, width };
  const common = { width, height, priority, alt, draggable: false, style: size } as const;
  return (
    <span
      className={cn("relative inline-block shrink-0", fluid && "block w-full", className)}
      style={fluid ? { aspectRatio: `${W} / ${H}` } : { height, width }}
    >
      <Image src="/brand/logo.png" className="logo-for-light" {...common} />
      <Image src="/brand/logo-light.png" className="logo-for-dark" {...common} alt="" aria-hidden={alt ? true : undefined} />
    </span>
  );
}
