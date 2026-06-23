"use client";

import { useEffect, useRef } from "react";
import { usePhoneSwipe } from "@/contexts/PhoneSwipeContext";

export default function PhoneFrame({ children }: { children?: React.ReactNode }) {
  const swipe = usePhoneSwipe();
  const regionRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef(swipe?.onWheel);

  useEffect(() => {
    wheelRef.current = swipe?.onWheel;
  }, [swipe?.onWheel]);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => wheelRef.current?.(e);
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="tablet-scale flex aspect-[375/812] h-[min(194.88vw,100%)] max-h-full w-auto max-w-[400px] flex-col items-center overflow-hidden rounded-3xl border-2 border-gray-300 shadow-md md:h-full md:min-w-[405px] md:max-w-none md:shrink-0 md:overflow-visible md:rounded-none md:border-0 md:shadow-none">
      <div className="phone-frame-shell flex h-full w-full flex-col rounded-3xl md:max-h-full md:w-full md:rounded-[50px] md:p-[3px]">
        <div className="flex min-h-0 flex-1 flex-col rounded-3xl md:rounded-[48px] md:bg-[#1c1c1e] md:p-3">
          <div
            ref={regionRef}
            role="region"
            aria-label="Lexcorp product launcher"
            className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl md:w-full md:flex-1 md:rounded-[38px]"
            style={{
              aspectRatio: "375 / 812",
              background: "linear-gradient(to bottom, #e8ecf4, #f5f0f6)",
            }}
            {...swipe?.mouseHandlers}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
