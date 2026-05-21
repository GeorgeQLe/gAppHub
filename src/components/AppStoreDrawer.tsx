"use client";

import { createElement, useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Product } from "@/types/product";

interface AppStoreDrawerProps {
  product: Product | null;
  onClose: () => void;
}

const badgeColorMap: Record<string, string> = {
  L: "#22c55e",
  B: "#eab308",
  N: "#3b82f6",
  C: "#ef4444",
};

const CUSTOM_ICON_IDS = new Set(["war-room", "pitwall", "gskillpacks", "gblockparty"]);
const ICON_SIZE = 72;

function getIcon(name: string): LucideIcon | null {
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return (icons as unknown as Record<string, LucideIcon>)[pascalName] ?? null;
}

export default function AppStoreDrawer({ product, onClose }: AppStoreDrawerProps) {
  const reducedMotion = useReducedMotion();
  const [canDrag, setCanDrag] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const sheet = sheetRef.current;
        if (!sheet) return;

        const focusable = sheet.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset when product changes
    setCanDrag(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    document.addEventListener("keydown", handleKeyDown);
    const raf = requestAnimationFrame(() => ctaRef.current?.focus({ preventScroll: true }));

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [product, handleKeyDown]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { y: "100%" },
        visible: { y: "0%" },
        exit: { y: "100%" },
      };

  const sheetTransition = reducedMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 400, damping: 35, mass: 0.8 };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="absolute inset-0 z-30 bg-black/40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            className="absolute bottom-0 left-0 right-0 z-30 h-[80%] overflow-hidden rounded-t-2xl bg-white"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={sheetTransition}
            onAnimationComplete={(variant) => {
              if (variant === "visible") {
                setCanDrag(true);
              }
            }}
            drag={reducedMotion ? false : canDrag ? "y" : false}
            dragConstraints={{ top: 0 }}
            dragElastic={0}
            onDragEnd={(_e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
          >
            <div className="h-full overflow-y-auto">
              {/* Drag handle */}
              <div className="sticky top-0 z-10 bg-white pt-3 pb-0">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
              </div>

              <div className="px-5 pb-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <DrawerIcon product={product} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-base font-bold text-gray-900">
                        {product.name}
                      </span>
                      {product.badge && (
                        <span
                          className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: badgeColorMap[product.badge] }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                  <a
                    ref={ctaRef}
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${product.name} in new tab`}
                    className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
                  >
                    Open
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {product.longDescription ?? product.description}
                </p>

                {/* Screenshots carousel */}
                {product.screenshots && product.screenshots.length > 0 && (
                  <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Screenshots</h3>
                    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
                      {product.screenshots.map((src, i) => (
                        <Image
                          key={i}
                          src={src}
                          alt={`${product.name} screenshot ${i + 1}`}
                          width={320}
                          height={200}
                          className="max-h-[200px] flex-shrink-0 snap-center rounded-lg object-cover"
                          draggable={false}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonials */}
                {product.testimonials && product.testimonials.length > 0 && (
                  <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Testimonials</h3>
                    <div className="flex flex-col gap-3">
                      {product.testimonials.map((t, i) => (
                        <div key={i} className="rounded-lg bg-gray-50 p-3">
                          <p className="text-sm italic text-gray-700">&ldquo;{t.text}&rdquo;</p>
                          <p className="mt-1 text-xs text-gray-500">&mdash; {t.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerIcon({ product }: { product: Product }) {
  const deprecated = product.badge === null;
  const icon = getIcon(product.icon);
  const firstLetter = product.name.charAt(0).toUpperCase();

  if (CUSTOM_ICON_IDS.has(product.id)) {
    return (
      <Image
        src={`/icons/products/${product.id}.png`}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        className={`h-[72px] w-[72px] rounded-[22.5%] object-cover${deprecated ? " grayscale opacity-50" : ""}`}
        draggable={false}
      />
    );
  }

  return (
    <div
      className={`flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-[22.5%] bg-gradient-to-br from-slate-700 to-slate-900${deprecated ? " grayscale opacity-50" : ""}`}
    >
      {icon ? (
        createElement(icon, {
          size: 34,
          className: "text-white",
          strokeWidth: 1.5,
        })
      ) : (
        <span className="text-2xl font-bold text-white">{firstLetter}</span>
      )}
    </div>
  );
}
