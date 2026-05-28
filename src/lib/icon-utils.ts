import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Brain,
  Building2,
  Calculator,
  ClipboardList,
  Code,
  Contact,
  Crosshair,
  DoorOpen,
  Eye,
  Gauge,
  HeartPulse,
  Home,
  Joystick,
  Landmark,
  MessageSquareWarning,
  Orbit,
  PenTool,
  Radio,
  Repeat,
  Rocket,
  ScrollText,
  Send,
  Server,
  Shield,
  Sparkles,
  Swords,
  Target,
  Telescope,
  TrendingUp,
  Tv,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  BookOpen,
  Boxes,
  Brain,
  Building2,
  Calculator,
  ClipboardList,
  Code,
  Contact,
  Crosshair,
  DoorOpen,
  Eye,
  Gauge,
  HeartPulse,
  Home,
  Joystick,
  Landmark,
  MessageSquareWarning,
  Orbit,
  PenTool,
  Radio,
  Repeat,
  Rocket,
  ScrollText,
  Send,
  Server,
  Shield,
  Sparkles,
  Swords,
  Target,
  Telescope,
  TrendingUp,
  Tv,
  Zap,
};

export const badgeColorMap: Record<string, string> = {
  L: "#22c55e",
  B: "#eab308",
  N: "#3b82f6",
  C: "#ef4444",
};

export const badgeTailwindColorMap: Record<string, string> = {
  L: "bg-[#22c55e]",
  B: "bg-[#eab308]",
  N: "bg-[#3b82f6]",
  C: "bg-[#ef4444]",
};

export const badgeLabelMap: Record<string, string> = {
  L: "Live",
  B: "Beta",
  N: "New",
  C: "Concept",
};

export const CUSTOM_ICON_IDS = new Set([
  "war-room",
  "pitwall",
  "gskillpacks",
  "gblockparty",
]);

export const iconAlignmentClassMap: Record<string, string> = {
  joystick: "-translate-x-0.5",
};

export function getIcon(name: string): LucideIcon | null {
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return ICON_MAP[pascalName] ?? null;
}
