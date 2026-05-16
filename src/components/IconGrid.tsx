"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Product } from "@/types/product";
import AppIcon from "@/components/AppIcon";
import PageDots from "@/components/PageDots";
import SearchOverlay from "@/components/SearchOverlay";

const ICONS_PER_PAGE = 24;
const COLS = 4;
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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const dragRef = useRef<{ startX: number; dragging: boolean } | null>(null);
  const iconRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

    if (showSearch) {
      if (dy < -PULL_DOWN_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        handleDismissSearch();
      }
      return;
    }
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

  const currentPageIcons = pages[page] ?? [];
  const iconCount = currentPageIcons.length;

  useEffect(() => {
    iconRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSearch) return;
    const col = focusedIndex % COLS;

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        if (focusedIndex + 1 < iconCount) {
          setFocusedIndex(focusedIndex + 1);
        } else if (page < totalPages - 1) {
          goTo(page + 1);
          setFocusedIndex(0);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (focusedIndex > 0) {
          setFocusedIndex(focusedIndex - 1);
        } else if (page > 0) {
          goTo(page - 1);
          const prevCount = pages[page - 1].length;
          setFocusedIndex(prevCount - 1);
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const next = focusedIndex + COLS;
        if (next < iconCount) {
          setFocusedIndex(next);
        } else if (page < totalPages - 1) {
          goTo(page + 1);
          setFocusedIndex(Math.min(col, (pages[page + 1]?.length ?? 1) - 1));
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = focusedIndex - COLS;
        if (prev >= 0) {
          setFocusedIndex(prev);
        } else if (page > 0) {
          goTo(page - 1);
          const prevPageCount = pages[page - 1].length;
          const lastRow = Math.floor((prevPageCount - 1) / COLS);
          const target = lastRow * COLS + col;
          setFocusedIndex(Math.min(target, prevPageCount - 1));
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        if (page !== 0) goTo(0);
        setFocusedIndex(0);
        break;
      }
      case "End": {
        e.preventDefault();
        const lastPage = totalPages - 1;
        if (page !== lastPage) goTo(lastPage);
        setFocusedIndex((pages[lastPage]?.length ?? 1) - 1);
        break;
      }
    }
  };

  const filtered = showSearch ? filterProducts(products, searchTerm) : null;

  return (
    <div
      className="overflow-hidden flex-1 relative"
      role="grid"
      aria-label="Product apps"
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
                {pageProducts.map((p, j) =>
                  i === page ? (
                    <AppIcon
                      product={p}
                      key={p.id}
                      tabIndex={j === focusedIndex ? 0 : -1}
                      ref={(el) => {
                        iconRefs.current[j] = el;
                      }}
                    />
                  ) : (
                    <AppIcon product={p} key={p.id} tabIndex={-1} />
                  ),
                )}
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
