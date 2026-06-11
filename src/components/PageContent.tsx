"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PhoneSwipeProvider } from "@/contexts/PhoneSwipeContext";
import BadgeLegend from "@/components/BadgeLegend";
import Dock from "@/components/Dock";
import DynamicIsland from "@/components/DynamicIsland";
import HomeIndicator from "@/components/HomeIndicator";
import IconGrid from "@/components/IconGrid";
import PhoneFrame from "@/components/PhoneFrame";
import StatusBar from "@/components/StatusBar";
import AppStoreDrawer from "@/components/AppStoreDrawer";
import VittlesWidget from "@/components/VittlesWidget";
import type { Product } from "@/types/product";

type Variant = "none" | "boot";

interface PageContentProps {
  dockProducts: Product[];
  gridProducts: Product[];
  variant: Variant;
}

type BootPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type BootIslandMessage = "Lexcorp" | "made with ♥" | 'by George "G" Le';
const BOOT_ISLAND_MESSAGES: BootIslandMessage[] = [
  "Lexcorp",
  "made with ♥",
  'by George "G" Le',
];
const BOOT_ISLAND_MESSAGE_DELAY = 2000;

export default function PageContent({
  dockProducts,
  gridProducts,
  variant,
}: PageContentProps) {
  const reducedMotion = useReducedMotion();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleIconSelect = useCallback((product: Product) => {
    triggerRef.current = document.activeElement as HTMLButtonElement;
    setSelectedProduct(product);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setSelectedProduct(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const [bootPhase, setBootPhase] = useState<BootPhase>(
    variant === "boot" ? 1 : 7,
  );
  const [bootShimmer, setBootShimmer] = useState(false);
  const [bootIslandMessage, setBootIslandMessage] = useState<BootIslandMessage | undefined>();
  useEffect(() => {
    if (variant !== "boot" || reducedMotion) return;

    let messageIndex = 0;
    let rotateMessage: ReturnType<typeof setTimeout> | undefined;

    const scheduleNextMessage = () => {
      rotateMessage = setTimeout(() => {
        messageIndex = (messageIndex + 1) % BOOT_ISLAND_MESSAGES.length;
        setBootIslandMessage(BOOT_ISLAND_MESSAGES[messageIndex]);
        scheduleNextMessage();
      }, BOOT_ISLAND_MESSAGE_DELAY);
    };

    const timers = [
      setTimeout(() => setBootPhase(2), 800),
      setTimeout(() => setBootPhase(3), 1600),
      // Phase 4: Vittles banner glitches in
      setTimeout(() => setBootPhase(4), 2400),
      // Phase 5: Vittles banner glitch-dissolves away
      setTimeout(() => setBootPhase(5), 4200),
      // Phase 6: Home screen reveals (was phase 4)
      setTimeout(() => setBootPhase(6), 5000),
      // Phase 7: Dock slides up + shimmer (was phase 5)
      setTimeout(() => setBootPhase(7), 5400),
      setTimeout(() => setBootShimmer(true), 5400),
      setTimeout(() => {
        setBootIslandMessage(BOOT_ISLAND_MESSAGES[messageIndex]);
        scheduleNextMessage();
      }, 5400),
    ];

    return () => {
      timers.forEach(clearTimeout);
      if (rotateMessage) clearTimeout(rotateMessage);
    };
  }, [variant, reducedMotion]);

  const isBoot = variant === "boot" && !reducedMotion;
  const shouldAnimate = variant === "none" && !reducedMotion;

  const content = (
    <main className="flex h-dvh max-h-dvh flex-col items-center overflow-hidden px-4 py-4">
      <div className="flex min-h-0 flex-1 flex-col items-center pb-8">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <PhoneSwipeProvider>
          <PhoneFrame>
            {isBoot ? (
              <BootPhoneContent
                phase={bootPhase}
                islandLabel={bootIslandMessage}
                shimmer={bootShimmer}
                gridProducts={gridProducts}
                dockProducts={dockProducts}
                drawerOpen={selectedProduct !== null}
                onIconSelect={handleIconSelect}
                searchActive={searchActive}
                onSearchVisibilityChange={setSearchActive}
              />
            ) : (
              <>
                <div className={`transition-opacity duration-200 ${searchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                  <StatusBar />
                </div>
                <div className={`transition-opacity duration-200 ${searchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                  <DynamicIsland />
                </div>
                <div className="relative flex flex-col flex-1 min-h-0">
                  <IconGrid products={gridProducts} drawerOpen={selectedProduct !== null} onIconSelect={handleIconSelect} onSearchVisibilityChange={setSearchActive} />
                  <div className="absolute inset-x-0 bottom-[120px] z-10 pointer-events-none">
                    <VittlesWidget />
                  </div>
                </div>
                <Dock products={dockProducts} onIconSelect={handleIconSelect} />
                <HomeIndicator />
              </>
            )}
            <AppStoreDrawer product={selectedProduct} onClose={handleDrawerClose} />
          </PhoneFrame>
          </PhoneSwipeProvider>
        </div>
        <div className="mt-4">
          <BadgeLegend />
        </div>
      </div>
    </main>
  );

  if (shouldAnimate || (variant === "boot" && reducedMotion)) {
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

function VittlesSplash({ phase }: { phase: BootPhase }) {
  const isRevealing = phase === 4;
  const isDissolving = phase === 5;
  const isVisible = isRevealing || isDissolving;

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{ background: "#07111F" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isDissolving ? 0 : 1 }}
      transition={{ duration: isDissolving ? 0.6 : 0.1 }}
    >
      {/* Scanline overlay */}
      <div className="vittles-scanlines pointer-events-none absolute inset-0 z-30 opacity-40" />

      {/* Glitch flicker overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: "linear-gradient(180deg, transparent 50%, rgba(10,91,255,0.02) 50%)",
          backgroundSize: "100% 4px",
          animation: isRevealing ? "glitch-flicker 0.4s steps(1) 1" : undefined,
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 px-8 text-center"
        style={{
          animation: isRevealing
            ? "glitch-reveal 0.8s ease-out 1 both"
            : "glitch-dissolve 0.6s ease-in 1 both",
        }}
      >
        {/* Top rule */}
        <div
          className="h-px w-24"
          style={{
            background: `linear-gradient(90deg, transparent, ${
              "#0A5BFF"
            }, transparent)`,
          }}
        />

        {/* Title with glitch text effect */}
        <div
          className="vittles-glitch-text text-[22px] font-bold uppercase tracking-[0.18em]"
          data-text="OPERATION VITTLES"
          style={{ color: "#F3F6FB" }}
        >
          OPERATION VITTLES
        </div>

        {/* Tagline */}
        <div
          className="text-[13px] font-medium tracking-[0.06em]"
          style={{ color: "#C7D2E0" }}
        >
          Apps as Distribution
        </div>

        {/* Status badge */}
        <div
          className="mt-1 rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{
            borderColor: "rgba(59,130,246,0.4)",
            color: "#0A5BFF",
            background: "rgba(10,91,255,0.08)",
          }}
        >
          Active
        </div>

        {/* Bottom rule */}
        <div
          className="h-px w-24"
          style={{
            background: `linear-gradient(90deg, transparent, ${
              "#0A5BFF"
            }, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

function BootPhoneContent({
  phase,
  islandLabel,
  shimmer,
  gridProducts,
  dockProducts,
  drawerOpen,
  onIconSelect,
  searchActive,
  onSearchVisibilityChange,
}: {
  phase: BootPhase;
  islandLabel?: string;
  shimmer?: boolean;
  gridProducts: Product[];
  dockProducts: Product[];
  drawerOpen?: boolean;
  onIconSelect?: (product: Product) => void;
  searchActive?: boolean;
  onSearchVisibilityChange?: (visible: boolean) => void;
}) {
  return (
    <>
      {/* Phase 1–3: Boot splash copy sequence */}
      <AnimatePresence>
        {phase <= 3 && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden px-6"
            style={{ background: "linear-gradient(135deg, #FF9A56, #FF6B6B)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: phase >= 4 ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex w-full max-w-[300px] flex-col items-center gap-3 text-center text-white">
              <motion.div
                className="shimmer-text text-[24px] font-semibold leading-tight tracking-[0.04em]"
                style={{ '--shimmer-delay': '0.35s' } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.94, y: phase >= 1 ? 0 : 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                Lexcorp
              </motion.div>
              <motion.div
                className="shimmer-text text-[18px] font-medium leading-tight tracking-[0.02em] text-white/90"
                style={{ '--shimmer-delay': '1.15s' } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.94, y: phase >= 2 ? 0 : 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                made with ♥
              </motion.div>
              <motion.div
                className="shimmer-text text-[18px] font-medium leading-tight tracking-[0.02em] text-white/90"
                style={{ '--shimmer-delay': '1.95s' } as React.CSSProperties}
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.94, y: phase >= 3 ? 0 : 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                by George &quot;G&quot; Le
              </motion.div>
            </div>
            {phase === 3 && (
              <div
                className="shimmer-wipe absolute inset-0 z-10 pointer-events-none"
                style={{ animationDelay: '0.4s' }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4–5: Operation Vittles cyberpunk banner */}
      <AnimatePresence>
        {(phase === 4 || phase === 5) && (
          <VittlesSplash phase={phase} />
        )}
      </AnimatePresence>

      {/* Phase 6+: StatusBar fades in */}
      <div className={`transition-opacity duration-200 ${searchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 6 ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <StatusBar />
        </motion.div>
      </div>

      <div className={`transition-opacity duration-200 ${searchActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <DynamicIsland label={islandLabel} />
      </div>

      {/* Phase 6+: Icons appear */}
      <motion.div
        className="relative flex-1 overflow-hidden flex flex-col min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 6 ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <IconGrid products={gridProducts} drawerOpen={drawerOpen} shimmer={shimmer} onIconSelect={onIconSelect} onSearchVisibilityChange={onSearchVisibilityChange} />
        {/* Vittles widget appears after boot */}
        <motion.div
          className="absolute inset-x-0 bottom-[120px] z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 7 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <VittlesWidget />
        </motion.div>
      </motion.div>

      {/* Phase 7+: Dock slides up */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{
          y: phase >= 7 ? 0 : 80,
          opacity: phase >= 7 ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
      >
        <Dock products={dockProducts} shimmer={shimmer} onIconSelect={onIconSelect} />
      </motion.div>

      <HomeIndicator />
    </>
  );
}

