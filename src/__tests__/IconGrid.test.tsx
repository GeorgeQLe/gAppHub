import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import IconGrid from "@/components/IconGrid";
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

describe("IconGrid", () => {
  it("renders correct number of icons", () => {
    const products = Array.from({ length: 24 }, (_, i) =>
      makeProduct({ id: `p-${i}`, name: `App ${i}` })
    );
    render(<IconGrid products={products} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(24);
  });

  it("displays each product name", () => {
    const products = [
      makeProduct({ id: "a", name: "Alpha" }),
      makeProduct({ id: "b", name: "Bravo" }),
    ];
    render(<IconGrid products={products} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();
  });

  it("links open in new tab with correct href", () => {
    const { container } = render(
      <IconGrid
        products={[
          makeProduct({ id: "a", url: "https://alpha.example.com" }),
        ]}
      />
    );
    const link = container.querySelector("a")!;
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("href", "https://alpha.example.com");
  });

  it("applies truncate class to name span", () => {
    const products = [
      makeProduct({
        id: "long",
        name: "This Is A Very Long Product Name",
      }),
    ];
    render(<IconGrid products={products} />);
    const span = screen.getByText("This Is A Very Long Product Name");
    expect(span.className).toContain("truncate");
  });

  it("applies grayscale class to deprecated product icon", () => {
    const products = [
      makeProduct({ id: "dep", name: "Deprecated", badge: null }),
    ];
    const { container } = render(<IconGrid products={products} />);
    const iconDiv = container.querySelector(".rounded-\\[22\\.5\\%\\]")!;
    expect(iconDiv.className).toContain("grayscale");
  });

  it("does not apply grayscale class to non-deprecated product icon", () => {
    const products = [
      makeProduct({ id: "active", name: "Active", badge: "L" }),
    ];
    const { container } = render(<IconGrid products={products} />);
    const iconDiv = container.querySelector(".rounded-\\[22\\.5\\%\\]")!;
    expect(iconDiv.className).not.toContain("grayscale");
  });
});
