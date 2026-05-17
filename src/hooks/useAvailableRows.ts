"use client";

import { useState, useEffect, RefObject } from "react";

const ICON_HEIGHT = 60;
const LABEL_HEIGHT = 20;
const GAP_Y = 28; // gap-y-7 = 1.75rem = 28px
const ROW_HEIGHT = ICON_HEIGHT + LABEL_HEIGHT + GAP_Y;
const PT = 76;
const PB = 90;
const MIN_ROWS = 3;
const MAX_ROWS = 6;
const COLS = 4;

export function useAvailableRows(containerRef: RefObject<HTMLElement | null>): number {
  const [iconsPerPage, setIconsPerPage] = useState(MAX_ROWS * COLS);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function compute() {
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
  }, [containerRef]);

  return iconsPerPage;
}
