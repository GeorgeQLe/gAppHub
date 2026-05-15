import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Dock from "@/components/Dock";
import { splitDockProducts } from "@/lib/products";
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

beforeEach(() => {
  cleanup();
});

describe("Dock", () => {
  const dockProducts = [
    makeProduct({ id: "d1", name: "Phone", dock: true }),
    makeProduct({ id: "d2", name: "Messages", dock: true }),
    makeProduct({ id: "d3", name: "Safari", dock: true }),
    makeProduct({ id: "d4", name: "Music", dock: true }),
  ];

  it("renders 4 dock icons", () => {
    render(<Dock products={dockProducts} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
  });

  it("has frosted glass classes", () => {
    const { container } = render(<Dock products={dockProducts} />);
    const dock = container.firstElementChild!;
    expect(dock.className).toContain("backdrop-blur-[20px]");
    expect(dock.className).toContain("bg-white/60");
  });

  it("hides badges on dock icons", () => {
    const { container } = render(
      <Dock products={[makeProduct({ id: "d1", badge: "L", dock: true })]} />
    );
    const badge = container.querySelector("span.rounded-full");
    expect(badge).toBeNull();
  });
});

describe("splitDockProducts", () => {
  it("separates dock from grid products", () => {
    const products = [
      makeProduct({ id: "d1", dock: true }),
      makeProduct({ id: "d2", dock: true }),
      makeProduct({ id: "g1", dock: false }),
      makeProduct({ id: "g2", dock: false }),
      makeProduct({ id: "g3", dock: false }),
    ];
    const { dock, grid } = splitDockProducts(products);
    expect(dock).toHaveLength(2);
    expect(grid).toHaveLength(3);
    expect(dock.every((p) => p.dock)).toBe(true);
    expect(grid.every((p) => !p.dock)).toBe(true);
  });
});
