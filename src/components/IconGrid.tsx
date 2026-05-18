"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { useAvailableRows } from "@/hooks/useAvailableRows";
import { usePhoneSwipe } from "@/contexts/PhoneSwipeContext";
import AppIcon from "@/components/AppIcon";
import PageDots from "@/components/PageDots";
import SearchOverlay from "@/components/SearchOverlay";

const COLS = 4;
const PULL_DOWN_THRESHOLD = 30;
const GRID_PAGE_CLASSES = "w-full grid grid-cols-4 gap-x-5 gap-y-4 pt-[52px] pb-[120px] px-4 content-start";

const BADGE_LABELS: Record<string, string> = {
  L: "live",
  B: "beta",
  N: "new",
  C: "concept",
};

interface IconGridProps {
  products: Product[];
}

export default function IconGrid({ products }: IconGridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const iconsPerPage = useAvailableRows(gridContainerRef);
  const pages = chunk(products, iconsPerPage);
  const totalPages = pages.length;
  const [page, setPage] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const iconRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const userInteracted = useRef(false);
  const swipe = usePhoneSwipe();

  const goTo = useCallback(
    (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))),
    [totalPages],
  );

  const safePage = useMemo(
    () => (totalPages > 0 ? Math.min(page, totalPages - 1) : 0),
    [page, totalPages],
  );

  const showSearchRef = useRef(showSearch);
  useEffect(() => {
    showSearchRef.current = showSearch;
  }, [showSearch]);

  useEffect(() => {
    swipe?.registerSwipe((delta) => {
      if (showSearchRef.current) return;
      goTo(page + delta);
    });
  }, [swipe, goTo, page]);

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

  const currentPageIcons = pages[safePage] ?? [];
  const iconCount = currentPageIcons.length;

  useEffect(() => {
    if (userInteracted.current) iconRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    userInteracted.current = true;
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
        } else if (safePage > 0) {
          goTo(safePage - 1);
          const prevCount = pages[safePage - 1].length;
          setFocusedIndex(prevCount - 1);
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const next = focusedIndex + COLS;
        if (next < iconCount) {
          setFocusedIndex(next);
        } else if (safePage < totalPages - 1) {
          goTo(safePage + 1);
          setFocusedIndex(Math.min(col, (pages[safePage + 1]?.length ?? 1) - 1));
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = focusedIndex - COLS;
        if (prev >= 0) {
          setFocusedIndex(prev);
        } else if (safePage > 0) {
          goTo(safePage - 1);
          const prevPageCount = pages[safePage - 1].length;
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
        if (safePage !== lastPage) goTo(lastPage);
        setFocusedIndex((pages[lastPage]?.length ?? 1) - 1);
        break;
      }
    }
  };

  const filtered = showSearch ? filterProducts(products, searchTerm) : null;

  return (
    <div
      ref={gridContainerRef}
      className="overflow-hidden flex-1 relative"
      role="grid"
      aria-label="Product apps"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      <SearchOverlay
        visible={showSearch}
        onSearch={handleSearch}
        onDismiss={handleDismissSearch}
      />

      {filtered !== null ? (
        filtered.length > 0 ? (
          <div className={GRID_PAGE_CLASSES}>
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
            style={{ transform: `translateX(-${safePage * 100}%)` }}
          >
            {pages.map((pageProducts, i) => (
              <div
                key={i}
                className={`flex-shrink-0 ${GRID_PAGE_CLASSES}`}
              >
                {pageProducts.map((p, j) =>
                  i === safePage ? (
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
          <div className="pointer-events-auto absolute inset-x-0 bottom-[100px] z-20">
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
