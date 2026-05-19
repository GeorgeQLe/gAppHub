export interface Product {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  badge: "L" | "B" | "N" | "C" | null;
  category: string[];
  featured: boolean;
  dock: boolean;
  order: number;
  screenshots?: string[];
  testimonials?: { text: string; author: string }[];
  longDescription?: string;
}

export interface ProductsResponse {
  products: Product[];
}
