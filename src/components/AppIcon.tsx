"use client";

import { createElement, forwardRef } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AppIconProps {
  product: Product;
  hideBadge?: boolean;
  tabIndex?: number;
  onSelect?: (product: Product) => void;
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
const ICON_SIZE = 54;

function getIcon(name: string): LucideIcon | null {
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return (icons as unknown as Record<string, LucideIcon>)[pascalName] ?? null;
}

const AppIcon = forwardRef<HTMLButtonElement, AppIconProps>(function AppIcon(
  { product, hideBadge, tabIndex, onSelect },
  ref,
) {
  const deprecated = product.badge === null;

  const statusLabel = product.badge
    ? badgeLabelMap[product.badge]
    : "Deprecated";
  const compositeLabel = `${product.name}, ${statusLabel}`;

  const icon = getIcon(product.icon);
  const firstLetter = product.name.charAt(0).toUpperCase();

  return (
    <div role="gridcell">
      <button
        ref={ref}
        type="button"
        onClick={() => onSelect?.(product)}
        aria-label={compositeLabel}
        tabIndex={tabIndex}
        className="flex flex-col items-center gap-1 rounded-2xl transition-all duration-150 ease-out hover:scale-105 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.92] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      >
        <div className="relative">
          {CUSTOM_ICON_IDS.has(product.id) ? (
            <Image
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
      </button>
    </div>
  );
});

export default AppIcon;
