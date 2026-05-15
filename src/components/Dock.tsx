"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/types/product";
import AppIcon from "@/components/AppIcon";

interface DockProps {
  products: Product[];
}

export default function Dock({ products }: DockProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const iconRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    iconRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-4 pb-6 pt-3 border-t border-white/30 bg-white/60 backdrop-blur-[20px] rounded-b-[38px]"
    >
      {products.map((p, i) => (
        <AppIcon
          product={p}
          hideBadge
          key={p.id}
          tabIndex={i === focusedIndex ? 0 : -1}
          ref={(el) => {
            iconRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
