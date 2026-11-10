import {
  BadgeCheck,
  Bot,
  Building2,
  CalendarDays,
  Eye,
  Figma,
  Globe,
  KeyRound,
  Layers,
  LayoutTemplate,
  Palette,
  PenLine,
  Rocket,
  Search,
  ShoppingCart,
  Target,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/services";

const ICONS: Record<IconName, LucideIcon> = {
  search: Search,
  layout: LayoutTemplate,
  palette: Palette,
  key: KeyRound,
  eye: Eye,
  pen: PenLine,
  globe: Globe,
  figma: Figma,
  trending: TrendingUp,
  badge: BadgeCheck,
  bot: Bot,
  calendar: CalendarDays,
  building: Building2,
  cart: ShoppingCart,
  layers: Layers,
  target: Target,
  rocket: Rocket,
  workflow: Workflow,
};

export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}
