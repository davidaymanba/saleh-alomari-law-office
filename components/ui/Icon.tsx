import {
  BadgeCheck,
  Briefcase,
  Building,
  Building2,
  FilePen,
  FileSignature,
  Gavel,
  Globe,
  Handshake,
  Landmark,
  Lightbulb,
  MessageSquareText,
  Scale,
  ScrollText,
  ShieldAlert,
  Stamp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/data/icons";

const map: Record<IconKey, LucideIcon> = {
  consultation: MessageSquareText,
  representation: BadgeCheck,
  memo: FilePen,
  lawsuit: Gavel,
  hearings: Landmark,
  family: Users,
  labor: Briefcase,
  realEstate: Building2,
  inheritance: ScrollText,
  criminal: ShieldAlert,
  enforcement: Stamp,
  formation: Building,
  contracts: FileSignature,
  commercial: Handshake,
  investment: Globe,
  arbitration: Scale,
  ip: Lightbulb,
};

export function Icon({ name, className, strokeWidth = 1.5 }: { name: IconKey; className?: string; strokeWidth?: number }) {
  const C = map[name];
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
