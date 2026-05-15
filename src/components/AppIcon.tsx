import { Product } from "@/types/product";

interface AppIconProps {
  product: Product;
}

const badgeColorMap: Record<string, string> = {
  L: "bg-[#34C759]",
  B: "bg-[#FF9500]",
  N: "bg-[#007AFF]",
  W: "bg-[#AF52DE]",
};

export default function AppIcon({ product }: AppIconProps) {
  const deprecated = product.badge === null;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1"
    >
      <div className="relative">
        <img
          src={product.icon}
          alt={product.name}
          width={60}
          height={60}
          className={`rounded-[22.5%] overflow-hidden${deprecated ? " grayscale opacity-50" : ""}`}
        />
        {product.badge && (
          <span
            className={`absolute -top-[3px] -right-[3px] flex items-center justify-center w-[20px] h-[20px] rounded-full border-2 border-white text-white text-[11px] font-bold leading-none ${badgeColorMap[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <span
        className={`text-[11px] font-medium text-center leading-tight truncate max-w-[74px] ${
          deprecated ? "text-gray-400" : "text-[#333]"
        }`}
      >
        {product.name}
      </span>
    </a>
  );
}
