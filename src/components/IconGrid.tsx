import { Product } from "@/types/product";
import AppIcon from "@/components/AppIcon";

interface IconGridProps {
  products: Product[];
}

export default function IconGrid({ products }: IconGridProps) {
  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-7 pt-[76px] pb-[90px] px-4">
      {products.map((p) => (
        <AppIcon product={p} key={p.id} />
      ))}
    </div>
  );
}
