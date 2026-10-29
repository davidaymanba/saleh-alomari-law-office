import { BrandMark } from "@/components/ui/BrandMark";

/**
 * شعار المكتب داخل عقد مدبّب (هيئة الأبواب النجدية).
 * .facade-line تُرسم بـ DrawSVG، و .facade-fill تظهر بعدها، و [data-hero-logo] يُكشف من اليمين لليسار.
 */
export function LogoArch({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative aspect-[480/600] w-full">
        <svg viewBox="0 0 480 600" className="absolute inset-0 size-full" aria-hidden="true" fill="none">
          <defs>
            <pattern id="arch-dots" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" fill="currentColor" opacity="0.12" />
            </pattern>
          </defs>

          <g data-depth="1.5">
            <path className="facade-fill" d="M92 600V266L240 118L388 266V600Z" style={{ fill: "var(--color-sand)" }} />
            <path className="facade-fill" d="M92 600V266L240 118L388 266V600Z" fill="url(#arch-dots)" />
          </g>

          {/* الإطار المزدوج */}
          <path className="facade-line" d="M60 600V252L240 72L420 252V600" stroke="currentColor" strokeWidth="2" />
          <path className="facade-line" d="M92 600V266L240 118L388 266V600" style={{ stroke: "var(--color-gold-logo)" }} strokeWidth="1.5" />

          {/* زخارف: مثلثات على كتفي العقد وشُرفات صغيرة أعلى المفتاح */}
          <path
            className="facade-line"
            d="M24 252L42 222L60 252M420 252L438 222L456 252M222 72L240 40L258 72"
            style={{ stroke: "var(--color-gold-logo)" }}
            strokeWidth="1.5"
          />
          <path className="facade-line" d="M60 300H92M388 300H420M60 330H92M388 330H420" stroke="currentColor" strokeWidth="1" opacity="0.5" />

          <path className="facade-line" d="M0 600H480" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div data-hero-logo className="absolute start-1/2 top-[33%] w-[50%] translate-x-1/2">
          <BrandMark height={360} fluid priority alt="" />
        </div>
      </div>
    </div>
  );
}
