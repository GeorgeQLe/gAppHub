"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VITTLES } from "@/lib/vittles-data";

const cardVariants = {
  hidden: { height: 0, opacity: 0, marginTop: 0 },
  visible: { height: "auto", opacity: 1, marginTop: 8 },
  exit: {
    height: 0,
    opacity: 0,
    marginTop: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
      marginTop: { duration: 0.2 },
    },
  },
};

export default function VittlesWidget() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggle = useCallback(() => setExpanded((v) => !v), []);

  useEffect(() => {
    if (!expanded) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("touchstart", handleClick, true);
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("touchstart", handleClick, true);
    };
  }, [expanded]);

  return (
    <div ref={containerRef} className="flex flex-col items-center px-4 pointer-events-auto">
      <button
        onClick={toggle}
        aria-expanded={expanded}
        aria-label="Operation Vittles details"
        className="group w-full max-w-[calc(100%-32px)] rounded-2xl border px-4 py-2.5 text-left backdrop-blur-xl transition-[transform,box-shadow] duration-200 active:scale-[0.98] hover:ring-1 hover:ring-blue-400/40 hover:shadow-[0_0_12px_rgba(10,91,255,0.25)]"
        style={{
          background: expanded
            ? `linear-gradient(135deg, ${VITTLES.colors.bg}, ${VITTLES.colors.cardBg})`
            : "rgba(11, 21, 38, 0.65)",
          borderColor: VITTLES.colors.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ background: VITTLES.colors.primary }}
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: VITTLES.colors.heading }}
            >
              {VITTLES.name}
            </span>
          </div>
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: VITTLES.colors.accent }}
          >
            {VITTLES.status}
          </span>
        </div>

        <AnimatePresence>
          {!expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-1.5 line-clamp-1 text-[10px] leading-relaxed"
              style={{ color: VITTLES.colors.secondary }}
            >
              Apps as distribution — sustained airlift across the chasm
            </motion.p>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              height: { type: "spring", stiffness: 400, damping: 30 },
              opacity: { duration: 0.15 },
              marginTop: { type: "spring", stiffness: 400, damping: 30 },
            }}
            className="w-full max-w-[calc(100%-32px)] cursor-pointer overflow-hidden rounded-2xl border backdrop-blur-xl active:scale-[0.98] transition-[transform,box-shadow] duration-200 hover:ring-1 hover:ring-blue-400/40 hover:shadow-[0_0_12px_rgba(10,91,255,0.25)]"
            onClick={toggle}
            role="button"
            tabIndex={0}
            aria-label="Collapse Operation Vittles details"
            style={{
              background: `linear-gradient(180deg, ${VITTLES.colors.cardBg}, ${VITTLES.colors.bg})`,
              borderColor: VITTLES.colors.border,
            }}
          >
            <div className="vittles-scanlines pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-30" />
            <div className="relative z-20 p-4">
              <p
                className="text-[10px] leading-relaxed"
                style={{ color: VITTLES.colors.secondary }}
              >
                {VITTLES.overview}
              </p>

              <div className="mt-3 space-y-1.5">
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: VITTLES.colors.accent }}
                >
                  Objectives
                </span>
                {VITTLES.objectives.map((obj) => (
                  <div key={obj.text} className="flex items-start gap-2">
                    <div
                      className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: obj.completed
                          ? "#22c55e"
                          : VITTLES.colors.primary,
                        opacity: obj.completed ? 1 : 0.6,
                      }}
                    />
                    <span
                      className="text-[10px] leading-snug"
                      style={{
                        color: obj.completed
                          ? VITTLES.colors.secondary
                          : VITTLES.colors.accent,
                      }}
                    >
                      {obj.text}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="mt-3 flex items-center justify-between border-t pt-2"
                style={{ borderColor: VITTLES.colors.border }}
              >
                <span
                  className="text-[9px]"
                  style={{ color: VITTLES.colors.accent }}
                >
                  {VITTLES.dates.start} → {VITTLES.dates.end}
                </span>
                <span
                  className="text-[9px] font-medium"
                  style={{ color: VITTLES.colors.primary }}
                >
                  leexperimental.com
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
