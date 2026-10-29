import { NajdiMark } from "@/components/ui/NajdiMark";
import { cn } from "@/lib/utils";

/** صورة رمزية بالحروف الأولى أو بعلامة المكتب (إلى أن تُضاف صور الفريق) */
export function Monogram({ initials, className }: { initials?: string; className?: string }) {
  return (
    <div className={cn("relative grid aspect-[4/5] place-items-center overflow-hidden bg-sand", className)} aria-hidden="true">
      <div className="texture-dots absolute inset-0" />
      <div className="crenellation absolute inset-x-0 bottom-0 text-sand-2" />
      {initials ? (
        <span className="relative font-display text-6xl font-bold text-clay">{initials}</span>
      ) : (
        <NajdiMark className="relative size-16 text-clay/70" strokeWidth={1.5} />
      )}
    </div>
  );
}
