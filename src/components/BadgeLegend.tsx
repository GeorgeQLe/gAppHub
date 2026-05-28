"use client";

const legendItems = [
  { letter: "L", label: "Live", color: "#22c55e" },
  { letter: "B", label: "Beta", color: "#eab308" },
  { letter: "N", label: "New", color: "#3b82f6" },
  { letter: "C", label: "Concept", color: "#ef4444" },
];

export default function BadgeLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {legendItems.map((item) => (
        <div
          key={item.letter}
          className="relative flex items-center gap-1.5"
        >
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white leading-none"
            style={{ backgroundColor: item.color }}
          >
            {item.letter}
          </span>
          <span className="text-xs text-[#6e6e73]">{item.label}</span>
        </div>
      ))}
      <div className="relative flex items-center gap-1.5">
        <span className="flex items-center justify-center w-4 h-4 rounded-[22.5%] bg-gradient-to-br from-slate-700 to-slate-900 grayscale opacity-50" />
        <span className="text-xs text-[#6e6e73]">Deprecated</span>
      </div>
    </div>
  );
}
