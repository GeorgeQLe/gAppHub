interface PageDotsProps {
  total: number;
  active: number;
  onChange?: (page: number) => void;
}

export default function PageDots({ total, active, onChange }: PageDotsProps) {
  if (total <= 1) return null;

  return (
    <div
      className="flex items-center justify-center gap-1.5"
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
                ? "h-2 w-2 bg-[#1d1d1f]"
                : "h-1.5 w-1.5 bg-[#1d1d1f]/35"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
