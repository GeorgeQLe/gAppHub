import type { Product, ProductsResponse } from "@/types/product";
import staticData from "../../public/data/products.json";

export async function getProducts(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_PRODUCTS_URL || "/data/products.json";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ProductsResponse = await res.json();
    return data.products;
  } catch {
    return (staticData as ProductsResponse).products;
  }
}

export function splitDockProducts(products: Product[]): {
  dock: Product[];
  grid: Product[];
} {
  return {
    dock: products.filter((p) => p.dock),
    grid: products.filter((p) => !p.dock),
  };
}

export function sortProducts(products: Product[]): Product[] {
  const featured = products
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);

  const nonFeatured = products.filter((p) => !p.featured);

  const newest = nonFeatured
    .slice()
    .sort((a, b) => b.order - a.order)
    .slice(0, 4)
    .sort((a, b) => b.order - a.order);

  const newestIds = new Set(newest.map((p) => p.id));
  const remaining = nonFeatured.filter((p) => !newestIds.has(p.id));

  const byBadge = (badge: string | null) =>
    remaining
      .filter((p) => p.badge === badge)
      .sort((a, b) => a.name.localeCompare(b.name));

  return [
    ...featured,
    ...newest,
    ...byBadge("L"),
    ...byBadge("B"),
    ...byBadge("W"),
    ...byBadge(null),
  ];
}
