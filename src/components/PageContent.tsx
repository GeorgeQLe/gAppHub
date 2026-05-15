"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import BadgeLegend from "@/components/BadgeLegend";
import Dock from "@/components/Dock";
import DynamicIsland from "@/components/DynamicIsland";
import HomeIndicator from "@/components/HomeIndicator";
import IconGrid from "@/components/IconGrid";
import PhoneFrame from "@/components/PhoneFrame";
import StatusBar from "@/components/StatusBar";
import type { Product } from "@/types/product";

type Variant = "none" | "boot" | "slide" | "assemble";

interface PageContentProps {
  dockProducts: Product[];
  gridProducts: Product[];
  variant: Variant;
}

type BootPhase = 0 | 1 | 2 | 3 | 4 | 5;

export default function PageContent({
  dockProducts,
  gridProducts,
  variant,
}: PageContentProps) {
  const reducedMotion = useReducedMotion();
  const [bootPhase, setBootPhase] = useState<BootPhase>(
    variant === "boot" ? 0 : 5,
  );

  useEffect(() => {
    if (variant !== "boot" || reducedMotion) return;

    setBootPhase(1);
    const timers = [
      setTimeout(() => setBootPhase(2), 800),
      setTimeout(() => setBootPhase(3), 1200),
      setTimeout(() => setBootPhase(4), 1800),
      setTimeout(() => setBootPhase(5), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [variant, reducedMotion]);

  const isBoot = variant === "boot" && !reducedMotion;
  const shouldAnimate = variant === "none" && !reducedMotion;

  const content = (
    <main className="flex h-screen flex-col items-center px-4 py-4">
      <svg
        width="140"
        height="32"
        viewBox="0 0 140 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Lexcorp"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#1d1d1f"
          fontSize="24"
          fontWeight="600"
          fontFamily="-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          letterSpacing="0.2em"
        >
          LEXCORP
        </text>
      </svg>

      <p className="mt-1 text-[13px] uppercase tracking-widest text-[#86868b]">
        Made in Boston, Building in Public
      </p>

      <div className="mt-3 min-h-0 flex-1 pb-4">
        <PhoneFrame>
          {isBoot ? (
            <BootPhoneContent
              phase={bootPhase}
              gridProducts={gridProducts}
              dockProducts={dockProducts}
            />
          ) : (
            <>
              <StatusBar />
              <DynamicIsland />
              <IconGrid products={gridProducts} />
              <Dock products={dockProducts} />
              <HomeIndicator />
            </>
          )}
        </PhoneFrame>
        <div className="mt-4">
          <BadgeLegend />
        </div>
      </div>
    </main>
  );

  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  if (variant === "boot" && reducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

function BootPhoneContent({
  phase,
  gridProducts,
  dockProducts,
}: {
  phase: BootPhase;
  gridProducts: Product[];
  dockProducts: Product[];
}) {
  return (
    <>
      {/* Phase 1–2: Black overlay with LEXCORP logo */}
      <AnimatePresence>
        {phase <= 2 && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase >= 2 ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.svg
              width="160"
              height="40"
              viewBox="0 0 160 40"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              animate={
                phase === 1
                  ? {
                      scale: [1, 1.06, 1],
                    }
                  : { scale: 1, opacity: 0 }
              }
              transition={
                phase === 1
                  ? {
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
                  : { duration: 0.3 }
              }
            >
              <text
                x="50%"
                y="50%"
                dominantBaseline="central"
                textAnchor="middle"
                fill="white"
                fontSize="28"
                fontWeight="600"
                fontFamily="-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
                letterSpacing="0.25em"
              >
                LEXCORP
              </text>
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3+: StatusBar fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <StatusBar />
      </motion.div>

      <DynamicIsland />

      {/* Phase 3+: Icons appear row by row with spring bounce */}
      <motion.div
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <IconGrid products={gridProducts} />
      </motion.div>

      {/* Phase 4+: Dock slides up */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{
          y: phase >= 4 ? 0 : 80,
          opacity: phase >= 4 ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
      >
        <Dock products={dockProducts} />
      </motion.div>

      <HomeIndicator />
    </>
  );
}
