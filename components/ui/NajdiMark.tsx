import { cn } from "@/lib/utils";

/**
 * علامة المكتب: جدار نجدي بشُرفات مثلثة وباب مثلث الرأس.
 * المسارات خطية (stroke) لتُرسم بـ DrawSVG في شاشة التحميل.
 */
export function NajdiMark({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="miter"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path className="mark-path" d="M8 42V14L12 6L16 14L20 6L24 14L28 6L32 14L36 6L40 14V42Z" />
      <path className="mark-path" d="M8 19H40" />
      <path className="mark-path" d="M19 42V30L24 24L29 30V42" />
    </svg>
  );
}
