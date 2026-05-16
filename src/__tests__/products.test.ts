import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sortProducts, getProducts } from "@/lib/products";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-id",
    name: "Test App",
    url: "https://example.com",
    icon: "/icons/test.png",
    description: "A test product",
    badge: "L",
    category: ["tools"],
    featured: false,
    dock: false,
    order: 1,
    ...overrides,
  };
}

describe("sortProducts", () => {
  it("puts featured products first sorted by order ascending", () => {
    const products = [
      makeProduct({ id: "f2", featured: true, order: 5, name: "F2" }),
      makeProduct({ id: "nf", featured: false, order: 1, name: "NF" }),
      makeProduct({ id: "f1", featured: true, order: 2, name: "F1" }),
    ];
    const sorted = sortProducts(products);
    expect(sorted[0].id).toBe("f1");
    expect(sorted[1].id).toBe("f2");
  });

  it("places 4 highest-order non-featured as newest after featured", () => {
    const featured = makeProduct({
      id: "f1",
      featured: true,
      order: 1,
      name: "Featured",
    });
    const nonFeatured = Array.from({ length: 8 }, (_, i) =>
      makeProduct({
        id: `nf-${i}`,
        featured: false,
        order: (i + 1) * 10,
        name: `NF${i}`,
        badge: "L",
      })
    );
    const sorted = sortProducts([featured, ...nonFeatured]);
    const newest = sorted.slice(1, 5);
    expect(newest.map((p) => p.id)).toEqual([
      "nf-7",
      "nf-6",
      "nf-5",
      "nf-4",
    ]);
  });

  it("groups remaining by badge L → B → C → null, alphabetical within", () => {
    const products = [
      makeProduct({ id: "w1", badge: "C", name: "Zeta", order: 1 }),
      makeProduct({ id: "l1", badge: "L", name: "Beta", order: 2 }),
      makeProduct({ id: "n1", badge: null, name: "Alpha", order: 3 }),
      makeProduct({ id: "b1", badge: "B", name: "Gamma", order: 4 }),
      makeProduct({ id: "l2", badge: "L", name: "Aardvark", order: 5 }),
    ];
    const sorted = sortProducts(products);
    // first 4 are newest (only 5 non-featured, so 4 are newest)
    // remaining is just 1 product — the lowest order one
    // With 5 non-featured: newest = 4 highest order = order 5,4,3,2
    // remaining = order 1 (w1, badge W)
    expect(sorted[4].id).toBe("w1");
  });

  it("sorts remaining by badge order with alphabetical tiebreak", () => {
    // Need >4 non-featured so some land in "remaining"
    const filler = Array.from({ length: 4 }, (_, i) =>
      makeProduct({
        id: `filler-${i}`,
        order: 100 + i,
        name: `Filler${i}`,
        badge: "L",
      })
    );
    const remaining = [
      makeProduct({ id: "w1", badge: "C", name: "Whiskey", order: 1 }),
      makeProduct({ id: "l1", badge: "L", name: "Lima", order: 2 }),
      makeProduct({ id: "n1", badge: null, name: "Null", order: 3 }),
      makeProduct({ id: "b1", badge: "B", name: "Bravo", order: 4 }),
      makeProduct({ id: "l2", badge: "L", name: "Alpha", order: 5 }),
      makeProduct({ id: "b2", badge: "B", name: "Able", order: 6 }),
    ];
    const sorted = sortProducts([...filler, ...remaining]);
    // filler takes newest slots (order 100-103)
    // remaining sorted: L(Alpha, Lima), B(Able, Bravo), W(Whiskey), null(Null)
    const tail = sorted.slice(4);
    expect(tail.map((p) => p.id)).toEqual([
      "l2",
      "l1",
      "b2",
      "b1",
      "w1",
      "n1",
    ]);
  });
});

describe("getProducts", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error"))
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns static data without fetching when no product URL is configured", async () => {
    const products = await getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns static data when configured fetch fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_PRODUCTS_URL", "https://example.com/products.json");

    const products = await getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(fetch).toHaveBeenCalledWith("https://example.com/products.json");
  });
});
