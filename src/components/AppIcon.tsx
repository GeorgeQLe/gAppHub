"use client";

import { useRef, useState } from "react";
import { Product } from "@/types/product";

interface AppIconProps {
  product: Product;
  hideBadge?: boolean;
}

const badgeColorMap: Record<string, string> = {
  L: "bg-[#34C759]",
  B: "bg-[#FF9500]",
  N: "bg-[#007AFF]",
  W: "bg-[#AF52DE]",
};

const badgeLabelMap: Record<string, string> = {
  L: "Live",
  B: "Beta",
  N: "New",
  W: "Wishlist",
};

export default function AppIcon({ product, hideBadge }: AppIconProps) {
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

  return (
    <div role="gridcell">
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={compositeLabel}
        aria-describedby={showTooltip ? tooltipId : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col items-center gap-1 rounded-2xl transition-all duration-150 ease-out hover:scale-105 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.92] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      >
        <div className="relative">
          <img
            src={product.icon}
            alt={product.name}
            width={60}
            height={60}
            className={`rounded-[22.5%] overflow-hidden${deprecated ? " grayscale opacity-50" : ""}`}
          />
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
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-[#333]/90 text-white text-xs rounded-lg px-2 py-1.5 shadow-md max-w-[200px] text-center whitespace-normal pointer-events-none"
            >
              {product.description}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#333]/90" />
            </span>
          )}
        </div>
        <span
          className={`text-[11px] font-medium text-center leading-tight truncate max-w-[74px] ${
            deprecated ? "text-gray-400" : "text-[#333]"
          }`}
        >
          {product.name}
        </span>
      </a>
    </div>
  );
}
