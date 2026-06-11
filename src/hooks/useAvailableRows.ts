"use client";

import { useState, useLayoutEffect, RefObject } from "react";

const ICON_HEIGHT = 54;
const LABEL_HEIGHT = 16;
const GAP_Y = 16; // gap-y-4 = 1rem = 16px
const ROW_HEIGHT = ICON_HEIGHT + LABEL_HEIGHT + GAP_Y;
const PT = 52;
const PB = 180;
const MIN_ROWS = 3;
const MAX_ROWS = 6;
const COLS = 4;

export function useAvailableRows(
  containerRef: RefObject<HTMLElement | null>,
  frozen = false,
): number {
  const [iconsPerPage, setIconsPerPage] = useState(MAX_ROWS * COLS);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function compute() {
      if (frozen) return;
      const h = el!.clientHeight;
      if (h === 0) return;
      const available = h - PT - PB;
      const rows = Math.floor((available + GAP_Y) / ROW_HEIGHT);
      const clamped = Math.max(MIN_ROWS, Math.min(MAX_ROWS, rows));
      setIconsPerPage(clamped * COLS);
    }

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, frozen]);

  return iconsPerPage;
}
