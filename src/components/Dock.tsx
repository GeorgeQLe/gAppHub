"use client";

import { Product } from "@/types/product";
import AppIcon from "@/components/AppIcon";

interface DockProps {
  products: Product[];
}

export default function Dock({ products }: DockProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-4 pb-6 pt-3 border-t border-white/30 bg-white/60 backdrop-blur-[20px] rounded-b-[38px]">
      {products.map((p) => (
        <AppIcon product={p} hideBadge key={p.id} />
      ))}
    </div>
  );
}
