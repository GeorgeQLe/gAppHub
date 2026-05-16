"use client";

import { useRef, useState, forwardRef } from "react";
import { Product } from "@/types/product";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AppIconProps {
  product: Product;
  hideBadge?: boolean;
  tabIndex?: number;
}

const badgeColorMap: Record<string, string> = {
  L: "bg-[#22c55e]",
  B: "bg-[#eab308]",
  N: "bg-[#3b82f6]",
  C: "bg-[#ef4444]",
};

const badgeLabelMap: Record<string, string> = {
  L: "Live",
  B: "Beta",
  N: "New",
  C: "Concept",
};

const CUSTOM_ICON_IDS = new Set(["war-room", "pitwall", "gskillpacks", "gblockparty"]);

function getIcon(name: string): LucideIcon | null {
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return (icons as unknown as Record<string, LucideIcon>)[pascalName] ?? null;
}

const AppIcon = forwardRef<HTMLAnchorElement, AppIconProps>(function AppIcon(
  { product, hideBadge, tabIndex },
  ref,
) {
  const deprecated = product.badge === null;
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = `tooltip-${product.name.replace(/\s+/g, "-").toLowerCase()}`;

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShowTooltip(true), 400);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  const statusLabel = product.badge
    ? badgeLabelMap[product.badge]
    : "Deprecated";
  const compositeLabel = `${product.name}, ${statusLabel}`;

  const IconComponent = getIcon(product.icon);
  const firstLetter = product.name.charAt(0).toUpperCase();

  return (
    <div role="gridcell">
      <a
        ref={ref}
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={compositeLabel}
        aria-describedby={showTooltip ? tooltipId : undefined}
        tabIndex={tabIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col items-center gap-1 rounded-2xl transition-all duration-150 ease-out hover:scale-105 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.92] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      >
        <div className="relative">
          {CUSTOM_ICON_IDS.has(product.id) ? (
            <img
              src={`/icons/products/${product.id}.png`}
              alt=""
              width={60}
              height={60}
              className={`w-[60px] h-[60px] rounded-[22.5%] object-cover${deprecated ? " grayscale opacity-50" : ""}`}
              draggable={false}
            />
          ) : (
            <div
              className={`w-[60px] h-[60px] rounded-[22.5%] flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900${deprecated ? " grayscale opacity-50" : ""}`}
            >
              {IconComponent ? (
                <IconComponent size={28} className="text-white" strokeWidth={1.5} />
              ) : (
                <span className="text-white text-2xl font-bold">{firstLetter}</span>
              )}
            </div>
          )}
          {product.badge && !hideBadge && (
            <span
              aria-hidden="true"
              className={`absolute -top-[3px] -right-[3px] flex items-center justify-center w-[20px] h-[20px] rounded-full border-2 border-white text-white text-[11px] font-bold leading-none ${badgeColorMap[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
          {showTooltip && product.description && (
            <span
              id={tooltipId}
              role="tooltip"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-[#333]/90 text-white text-xs rounded-lg px-2 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-w-[200px] text-center whitespace-normal pointer-events-none"
            >
              {product.description}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#333]/90" />
            </span>
          )}
        </div>
        <span
          className={`text-[11px] font-medium text-center leading-tight truncate max-w-[74px] ${
            deprecated ? "text-gray-500" : "text-[#333]"
          }`}
        >
          {product.name}
        </span>
      </a>
    </div>
  );
});

export default AppIcon;
