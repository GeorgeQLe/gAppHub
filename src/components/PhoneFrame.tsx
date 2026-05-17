"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

export default function PhoneFrame({ children }: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-[90vw] max-w-[400px] overflow-hidden rounded-3xl border-2 border-gray-300 shadow-md">
        <div
          role="region"
          aria-label="Lexcorp product launcher"
          className="relative min-h-0 w-full overflow-hidden flex flex-col"
          style={{
            aspectRatio: "375 / 812",
            background: "linear-gradient(to bottom, #e8ecf4, #f5f0f6)",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="tablet-scale h-full flex flex-col items-center">
      <div
        className="flex w-fit flex-col rounded-[50px] p-[3px] max-h-full"
        style={{
          background: "linear-gradient(145deg, #e0e0e0, #a0a0a0, #c0c0c0)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col rounded-[48px] bg-[#1c1c1e] p-3">
          <div
            role="region"
            aria-label="Lexcorp product launcher"
            className="relative min-h-0 flex-1 w-[375px] overflow-hidden rounded-[38px] flex flex-col"
            style={{
              aspectRatio: "375 / 812",
              background: "linear-gradient(to bottom, #e8ecf4, #f5f0f6)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
