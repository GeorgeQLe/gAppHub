"use client";

const legendItems = [
  { letter: "L", label: "Live", color: "#34C759" },
  { letter: "B", label: "Beta", color: "#FF9500" },
  { letter: "N", label: "New", color: "#007AFF" },
  { letter: "W", label: "Wishlist", color: "#AF52DE" },
];

export default function BadgeLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {legendItems.map((item) => (
        <div key={item.letter} className="flex items-center gap-1.5">
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white leading-none"
            style={{ backgroundColor: item.color }}
          >
            {item.letter}
          </span>
          <span className="text-xs text-[#86868b]">{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="flex items-center justify-center w-4 h-4 rounded-[3px] bg-[#d2d2d7]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="10" height="10" rx="2" fill="#8E8E93" />
          </svg>
        </span>
        <span className="text-xs text-[#86868b]">Deprecated</span>
      </div>
    </div>
  );
}
