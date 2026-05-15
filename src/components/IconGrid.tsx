"use client";

import { useState, useRef, useCallback } from "react";
import { Product } from "@/types/product";
import AppIcon from "@/components/AppIcon";
import PageDots from "@/components/PageDots";
import SearchOverlay from "@/components/SearchOverlay";

const ICONS_PER_PAGE = 24;
const PULL_DOWN_THRESHOLD = 30;

const BADGE_LABELS: Record<string, string> = {
  L: "launch",
  B: "beta",
  N: "new",
  W: "waitlist",
};

interface IconGridProps {
  products: Product[];
}

export default function IconGrid({ products }: IconGridProps) {
  const pages = chunk(products, ICONS_PER_PAGE);
  const totalPages = pages.length;
  const [page, setPage] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const dragRef = useRef<{ startX: number; dragging: boolean } | null>(null);

  const goTo = useCallback(
    (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))),
    [totalPages],
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleDismissSearch = useCallback(() => {
    setShowSearch(false);
    setSearchTerm("");
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    touchRef.current = null;

    if (
      !showSearch &&
      dy > PULL_DOWN_THRESHOLD &&
      Math.abs(dy) > Math.abs(dx)
    ) {
      setShowSearch(true);
      return;
    }

    if (showSearch) return;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    goTo(page + (dx < 0 ? 1 : -1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, dragging: true };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragRef.current?.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current = null;
    if (showSearch) return;
    if (Math.abs(dx) < 50) return;
    goTo(page + (dx < 0 ? 1 : -1));
  };

  const handleMouseLeave = () => {
    dragRef.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSearch) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(page - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(page + 1);
    }
  };

  const filtered = showSearch ? filterProducts(products, searchTerm) : null;

  return (
    <div
      className="overflow-hidden flex-1 relative"
      role="region"
      aria-label="App pages"
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <SearchOverlay
        visible={showSearch}
        onSearch={handleSearch}
        onDismiss={handleDismissSearch}
      />

      {filtered !== null ? (
        filtered.length > 0 ? (
          <div className="w-full grid grid-cols-4 gap-x-5 gap-y-7 pt-[76px] pb-[90px] px-4 content-start">
            {filtered.map((p) => (
              <AppIcon product={p} key={p.id} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-white/60 text-sm">
            No apps found
          </div>
        )
      ) : (
        <>
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {pages.map((pageProducts, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 grid grid-cols-4 gap-x-5 gap-y-7 pt-[76px] pb-[90px] px-4 content-start"
              >
                {pageProducts.map((p) => (
                  <AppIcon product={p} key={p.id} />
                ))}
              </div>
            ))}
          </div>
          <div className="-mt-[78px]">
            <PageDots total={totalPages} active={page} onChange={goTo} />
          </div>
        </>
      )}
    </div>
  );
}

function filterProducts(products: Product[], term: string): Product[] {
  if (!term.trim()) return products;
  const q = term.toLowerCase();
  return products.filter((p) => {
    if (p.name.toLowerCase().includes(q)) return true;
    if (p.badge && BADGE_LABELS[p.badge]?.includes(q)) return true;
    if (p.category.some((c) => c.toLowerCase().includes(q))) return true;
    return false;
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
