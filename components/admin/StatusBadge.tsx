import { cn } from "@/lib/utils";
import { requestStatusLabels, type RequestStatus } from "@/lib/requests-shared";

const tones: Record<RequestStatus, string> = {
  new: "bg-gold text-paper",
  in_review: "bg-[#b7791f]/15 text-[#8a5a12] dark:text-[#e8b45f]",
  contacted: "bg-[#2f6fb0]/12 text-[#245a91] dark:text-[#8cbcf0]",
  closed: "bg-[#2f7d4f]/12 text-[#25643f] dark:text-[#7fd1a0]",
  spam: "bg-ink/10 text-muted",
};

export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-xs font-semibold whitespace-nowrap", tones[status], className)}>
      {requestStatusLabels[status]}
    </span>
  );
}
