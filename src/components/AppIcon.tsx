"use client";

import { createElement, forwardRef } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import {
  badgeTailwindColorMap,
  badgeLabelMap,
  CUSTOM_ICON_IDS,
  iconAlignmentClassMap,
  getIcon,
} from "@/lib/icon-utils";

interface AppIconProps {
  product: Product;
  hideBadge?: boolean;
  tabIndex?: number;
  onSelect?: (product: Product) => void;
  shimmer?: boolean;
  shimmerDelay?: number;
}

const ICON_SIZE = 54;

const AppIcon = forwardRef<HTMLButtonElement, AppIconProps>(function AppIcon(
  { product, hideBadge, tabIndex, onSelect, shimmer, shimmerDelay },
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
        className="flex flex-col items-center gap-1 transition-all duration-150 ease-out hover:scale-105 hover:-translate-y-0.5 active:scale-[0.92] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
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
                  className: `text-white ${iconAlignmentClassMap[product.icon] ?? ""}`.trim(),
                  strokeWidth: 1.5,
                })
              ) : (
                <span className="text-xl font-bold text-white">{firstLetter}</span>
              )}
            </div>
          )}
          {shimmer && (
            <div
              className="shimmer-foil absolute inset-0 rounded-[22.5%] pointer-events-none"
              style={shimmerDelay ? { animationDelay: `${shimmerDelay}ms` } : undefined}
            />
          )}
          {product.badge && !hideBadge && (
            <span
              aria-hidden="true"
              className={`absolute -top-[3px] -right-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white text-[10px] font-bold leading-none text-white ${badgeTailwindColorMap[product.badge]}`}
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
