"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/types/product";
import AppIcon from "@/components/AppIcon";

interface DockProps {
  products: Product[];
  shimmer?: boolean;
  onIconSelect?: (product: Product) => void;
}

export default function Dock({ products, shimmer, onIconSelect }: DockProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const userInteracted = useRef(false);

  useEffect(() => {
    if (userInteracted.current) {
      iconRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    userInteracted.current = true;
    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, products.length - 1));
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
        break;
      }
      case "Home": {
        e.preventDefault();
        setFocusedIndex(0);
        break;
      }
      case "End": {
        e.preventDefault();
        setFocusedIndex(products.length - 1);
        break;
      }
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Pinned apps"
      onKeyDown={handleKeyDown}
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around rounded-b-[38px] border-t border-white/30 bg-white/[0.72] px-4 pb-4 pt-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-[20px]"
    >
      {products.map((p, i) => (
        <AppIcon
          product={p}
          hideBadge
          key={p.id}
          tabIndex={i === focusedIndex ? 0 : -1}
          onSelect={onIconSelect}
          shimmer={shimmer}
          shimmerDelay={i * 80}
          ref={(el) => {
            iconRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
