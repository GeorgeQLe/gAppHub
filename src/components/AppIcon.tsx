import { Product } from "@/types/product";

interface AppIconProps {
  product: Product;
}

export default function AppIcon({ product }: AppIconProps) {
  const deprecated = product.badge === null;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1"
    >
      <img
        src={product.icon}
        alt={product.name}
        width={60}
        height={60}
        className={`rounded-[22.5%] overflow-hidden${deprecated ? " grayscale opacity-50" : ""}`}
      />
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
