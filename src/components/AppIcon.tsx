"use client";

import { createElement, useLayoutEffect, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
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
const TOOLTIP_OFFSET = 8;
const ICON_SIZE = 54;

type TooltipPosition = {
  left: number;
  top: number;
  placement: "top" | "bottom";
};

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
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = `tooltip-${product.name.replace(/\s+/g, "-").toLowerCase()}`;

  const handleMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = iconRef.current?.getBoundingClientRect() ?? event.currentTarget.getBoundingClientRect();
    const placement = rect.top < 80 ? "bottom" : "top";
    setTooltipPosition({
      left: rect.left + rect.width / 2,
      top: placement === "top" ? rect.top - TOOLTIP_OFFSET : rect.bottom + TOOLTIP_OFFSET,
      placement,
    });
    timerRef.current = setTimeout(() => setShowTooltip(true), 400);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
    setTooltipPosition(null);
  };

  const statusLabel = product.badge
    ? badgeLabelMap[product.badge]
    : "Deprecated";
  const compositeLabel = `${product.name}, ${statusLabel}`;

  const icon = getIcon(product.icon);
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
        <div ref={iconRef} className="relative">
          {CUSTOM_ICON_IDS.has(product.id) ? (
            <img
              src={`/icons/products/${product.id}.png`}
              alt=""
              width={ICON_SIZE}
              height={ICON_SIZE}
              className={`h-[54px] w-[54px] rounded-[22.5%] object-cover${deprecated ? " grayscale opacity-50" : ""}`}
              draggable={false}
            />
          ) : (
            <div
              className={`flex h-[54px] w-[54px] items-center justify-center rounded-[22.5%] bg-gradient-to-br from-slate-700 to-slate-900${deprecated ? " grayscale opacity-50" : ""}`}
            >
              {icon ? (
                createElement(icon, {
                  size: 25,
                  className: "text-white",
                  strokeWidth: 1.5,
                })
              ) : (
                <span className="text-xl font-bold text-white">{firstLetter}</span>
              )}
            </div>
          )}
          {product.badge && !hideBadge && (
            <span
              aria-hidden="true"
              className={`absolute -top-[3px] -right-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white text-[10px] font-bold leading-none text-white ${badgeColorMap[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
        </div>
        <span
          className={`max-w-[68px] truncate text-center text-[10px] font-medium leading-tight ${
            deprecated ? "text-gray-500" : "text-[#333]"
          }`}
        >
          {product.name}
        </span>
      </a>
      {showTooltip && product.description && tooltipPosition && (
        <AppIconTooltip
          id={tooltipId}
          text={product.description}
          position={tooltipPosition}
        />
      )}
    </div>
  );
});

export default AppIcon;

function AppIconTooltip({
  id,
  text,
  position,
}: {
  id: string;
  text: string;
  position: TooltipPosition;
}) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [left, setLeft] = useState(position.left);

  useLayoutEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const viewportPadding = 8;
    const halfWidth = tooltip.offsetWidth / 2;
    const minLeft = viewportPadding + halfWidth;
    const maxLeft = window.innerWidth - viewportPadding - halfWidth;

    setLeft(Math.min(Math.max(position.left, minLeft), maxLeft));
  }, [position.left, text]);

  return createPortal(
    <span
      ref={tooltipRef}
      id={id}
      role="tooltip"
      className="fixed z-50 max-w-[200px] whitespace-normal rounded-lg bg-[#333]/90 px-2 py-1.5 text-center text-xs text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] pointer-events-none"
      style={{
        left,
        top: position.top,
        transform:
          position.placement === "top"
            ? "translate(-50%, -100%)"
            : "translate(-50%, 0)",
      }}
    >
      {text}
      <span
        className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
          position.placement === "top"
            ? "top-full border-t-[#333]/90"
            : "bottom-full border-b-[#333]/90"
        }`}
      />
    </span>,
    document.body,
  );
}
