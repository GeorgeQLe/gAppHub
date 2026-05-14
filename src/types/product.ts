export interface Product {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  badge: "L" | "B" | "N" | "W" | null;
  category: string[];
  featured: boolean;
  dock: boolean;
  order: number;
}

export interface ProductsResponse {
  products: Product[];
}
