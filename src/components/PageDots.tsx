interface PageDotsProps {
  total: number;
  active: number;
  onChange?: (page: number) => void;
}

export default function PageDots({ total, active, onChange }: PageDotsProps) {
  if (total <= 1) return null;

  return (
    <div
      className="flex justify-center items-center gap-1.5"
      role="tablist"
      aria-label="Page indicator"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Page ${i + 1} of ${total}`}
          onClick={() => onChange?.(i)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <span
            className={`rounded-full transition-all duration-200 ${
              i === active
                ? "w-2 h-2 bg-white"
                : "w-1.5 h-1.5 bg-white/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
