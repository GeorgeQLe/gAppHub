"use client";

import { useState } from "react";

const legendItems = [
  { letter: "L", label: "Live", color: "#22c55e", description: "Product is live and available" },
  { letter: "B", label: "Beta", color: "#eab308", description: "Product is actively building" },
  { letter: "N", label: "New", color: "#3b82f6", description: "Recently launched product" },
  { letter: "C", label: "Concept", color: "#ef4444", description: "Product is planned or incubating" },
];

const deprecatedDescription = "Product has been retired";

function Tooltip({ id, text }: { id: string; text: string }) {
  return (
    <div
      id={id}
      role="tooltip"
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#333]/90 text-white text-xs rounded-lg px-2 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
    >
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#333]/90" />
    </div>
  );
}

export default function BadgeLegend() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {legendItems.map((item) => {
        const tooltipId = `tooltip-${item.letter}`;
        return (
          <div
            key={item.letter}
            className="relative flex items-center gap-1.5 cursor-default"
            onMouseEnter={() => setHovered(item.letter)}
            onMouseLeave={() => setHovered(null)}
            aria-describedby={hovered === item.letter ? tooltipId : undefined}
          >
            {hovered === item.letter && <Tooltip id={tooltipId} text={item.description} />}
            <span
              className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white leading-none"
              style={{ backgroundColor: item.color }}
            >
              {item.letter}
            </span>
            <span className="text-xs text-[#6e6e73]">{item.label}</span>
          </div>
        );
      })}
      <div
        className="relative flex items-center gap-1.5 cursor-default"
        onMouseEnter={() => setHovered("deprecated")}
        onMouseLeave={() => setHovered(null)}
        aria-describedby={hovered === "deprecated" ? "tooltip-deprecated" : undefined}
      >
        {hovered === "deprecated" && <Tooltip id="tooltip-deprecated" text={deprecatedDescription} />}
        <span className="flex items-center justify-center w-4 h-4 rounded-[3px] bg-[#1c1c1e]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="10" height="10" rx="2" fill="#000000" />
          </svg>
        </span>
        <span className="text-xs text-[#6e6e73]">Deprecated</span>
      </div>
    </div>
  );
}
