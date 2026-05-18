"use client";

import { useState, useEffect } from "react";
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
import type { Product } from "@/types/product";

type Variant = "none" | "boot" | "slide" | "assemble";

interface PageContentProps {
  dockProducts: Product[];
  gridProducts: Product[];
  variant: Variant;
}

type BootPhase = 0 | 1 | 2 | 3 | 4 | 5;
type BootIslandMessage = "Lexcorp" | "made with ♥" | 'by George "G" Le';
type SlidePhase = 0 | 1 | 2 | 3 | 4;
type AssemblePhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  const [bootPhase, setBootPhase] = useState<BootPhase>(
    variant === "boot" ? 1 : 5,
  );
  const [bootIslandMessage, setBootIslandMessage] = useState<BootIslandMessage | undefined>();
  const [slidePhase, setSlidePhase] = useState<SlidePhase>(
    variant === "slide" ? 0 : 4,
  );
  const [assemblePhase, setAssemblePhase] = useState<AssemblePhase>(
    variant === "assemble" ? 0 : 7,
  );

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
      setTimeout(() => setBootPhase(4), 2400),
      setTimeout(() => setBootPhase(5), 2800),
      setTimeout(() => {
        setBootIslandMessage(BOOT_ISLAND_MESSAGES[messageIndex]);
        scheduleNextMessage();
      }, 2800),
    ];

    return () => {
      timers.forEach(clearTimeout);
      if (rotateMessage) clearTimeout(rotateMessage);
    };
  }, [variant, reducedMotion]);

  useEffect(() => {
    if (variant !== "slide" || reducedMotion) return;

    const timers = [
      setTimeout(() => setSlidePhase(1), 0),
      setTimeout(() => setSlidePhase(2), 600),
      setTimeout(() => setSlidePhase(3), 1200),
      setTimeout(() => setSlidePhase(4), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [variant, reducedMotion]);

  useEffect(() => {
    if (variant !== "assemble" || reducedMotion) return;

    const timers = [
      setTimeout(() => setAssemblePhase(1), 0),
      setTimeout(() => setAssemblePhase(2), 400),
      setTimeout(() => setAssemblePhase(3), 700),
      setTimeout(() => setAssemblePhase(4), 900),
      setTimeout(() => setAssemblePhase(5), 1400),
      setTimeout(() => setAssemblePhase(6), 2000),
      setTimeout(() => setAssemblePhase(7), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [variant, reducedMotion]);

  const isBoot = variant === "boot" && !reducedMotion;
  const isSlide = variant === "slide" && !reducedMotion;
  const isAssemble = variant === "assemble" && !reducedMotion;
  const shouldAnimate = variant === "none" && !reducedMotion;

  const content = (
    <main className="flex h-screen max-h-screen flex-col items-center overflow-hidden px-4 py-4">
      <div className="flex min-h-0 flex-1 flex-col items-center pb-8">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <PhoneSwipeProvider>
          <PhoneFrame>
            {isBoot ? (
              <BootPhoneContent
                phase={bootPhase}
                islandLabel={bootIslandMessage}
                gridProducts={gridProducts}
                dockProducts={dockProducts}
              />
            ) : isSlide ? (
              <SlidePhoneContent
                phase={slidePhase}
                gridProducts={gridProducts}
                dockProducts={dockProducts}
              />
            ) : isAssemble ? (
              <AssemblePhoneContent
                phase={assemblePhase}
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
          </PhoneSwipeProvider>
        </div>
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

  if ((variant === "boot" || variant === "slide" || variant === "assemble") && reducedMotion) {
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
  islandLabel,
  gridProducts,
  dockProducts,
}: {
  phase: BootPhase;
  islandLabel?: string;
  gridProducts: Product[];
  dockProducts: Product[];
}) {
  return (
    <>
      {/* Phase 1–3: Boot splash copy sequence */}
      <AnimatePresence>
        {phase <= 3 && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-black px-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: phase >= 4 ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex w-full max-w-[300px] flex-col items-center gap-3 text-center text-white">
              <motion.div
                className="text-[24px] font-semibold leading-tight tracking-[0.04em]"
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.94, y: phase >= 1 ? 0 : 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                Lexcorp
              </motion.div>
              <motion.div
                className="text-[18px] font-medium leading-tight tracking-[0.02em] text-white/90"
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.94, y: phase >= 2 ? 0 : 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                made with ♥
              </motion.div>
              <motion.div
                className="text-[18px] font-medium leading-tight tracking-[0.02em] text-white/90"
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.94, y: phase >= 3 ? 0 : 8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                by George &quot;G&quot; Le
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4+: StatusBar fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <StatusBar />
      </motion.div>

      <DynamicIsland label={islandLabel} />

      {/* Phase 4+: Icons appear row by row with spring bounce */}
      <motion.div
        className="flex-1 overflow-hidden flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <IconGrid products={gridProducts} />
      </motion.div>

      {/* Phase 5+: Dock slides up */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{
          y: phase >= 5 ? 0 : 80,
          opacity: phase >= 5 ? 1 : 0,
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

function SlidePhoneContent({
  phase,
  gridProducts,
  dockProducts,
}: {
  phase: SlidePhase;
  gridProducts: Product[];
  dockProducts: Product[];
}) {
  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: phase >= 1 ? 0 : 100,
        opacity: phase >= 1 ? 1 : 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <StatusBar />
      </motion.div>

      <DynamicIsland />

      <motion.div
        className="flex-1 overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: phase >= 2 ? 1 : 0,
          scale: phase >= 2 ? 1 : 0.9,
        }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <IconGrid products={gridProducts} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Dock products={dockProducts} />
      </motion.div>

      <HomeIndicator />
    </motion.div>
  );
}

function AssemblePhoneContent({
  phase,
  gridProducts,
  dockProducts,
}: {
  phase: AssemblePhase;
  gridProducts: Product[];
  dockProducts: Product[];
}) {
  return (
    <>
      {/* Phase 1: Frame halves slide in via clip-path */}
      <motion.div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          background: "linear-gradient(145deg, #c0c0c0, #808080, #a0a0a0)",
        }}
        initial={{ clipPath: "inset(0 50% 0 0)", opacity: 1 }}
        animate={{
          clipPath: phase >= 1 ? "inset(0 0% 0 0)" : "inset(0 50% 0 0)",
          opacity: phase >= 2 ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          background: "linear-gradient(215deg, #c0c0c0, #808080, #a0a0a0)",
        }}
        initial={{ clipPath: "inset(0 0 0 50%)", opacity: 1 }}
        animate={{
          clipPath: phase >= 1 ? "inset(0 0 0 0%)" : "inset(0 0 0 50%)",
          opacity: phase >= 2 ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Phase 2: White flash along seam */}
      <AnimatePresence>
        {phase >= 2 && phase <= 3 && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, times: [0, 0.4, 1] }}
          >
            <div className="w-[2px] h-full bg-white shadow-[0_0_20px_8px_rgba(255,255,255,0.6)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2+: Frame overlays fade out to reveal screen */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: "linear-gradient(145deg, #c0c0c0, #808080, #a0a0a0)",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 2 ? 0 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Phase 3: Screen transitions from black to wallpaper */}
      <motion.div
        className="absolute inset-0 z-20 bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase >= 3 ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Phase 4: StatusBar slides in from sides, DynamicIsland pops */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: phase >= 4 ? 1 : 0,
          x: phase >= 4 ? 0 : -20,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          mass: 0.6,
        }}
      >
        <StatusBar />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: phase >= 4 ? 1 : 0,
          scale: phase >= 4 ? 1 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 18,
          mass: 0.5,
        }}
      >
        <DynamicIsland />
      </motion.div>

      {/* Phase 5: Icons drop from above with stagger */}
      <motion.div
        className="flex-1 overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: -40 }}
        animate={{
          opacity: phase >= 5 ? 1 : 0,
          y: phase >= 5 ? 0 : -40,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 22,
          mass: 0.7,
        }}
      >
        <IconGrid products={gridProducts} />
      </motion.div>

      {/* Phase 6: Dock slides up with spring */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{
          y: phase >= 6 ? 0 : 80,
          opacity: phase >= 6 ? 1 : 0,
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
