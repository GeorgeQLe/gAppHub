import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PageDots from "@/components/PageDots";
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

beforeEach(() => {
  cleanup();
});

describe("PageDots", () => {
  it("renders correct number of dots", () => {
    render(<PageDots total={3} active={0} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
  });

  it("active dot has bg-white class, inactive has bg-white/40", () => {
    render(<PageDots total={3} active={1} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].className).toContain("bg-white/40");
    expect(tabs[1].className).toContain("bg-white");
    expect(tabs[1].className).not.toContain("bg-white/40");
    expect(tabs[2].className).toContain("bg-white/40");
  });

  it("returns null when total <= 1", () => {
    const { container } = render(<PageDots total={1} active={0} />);
    expect(container.innerHTML).toBe("");
  });
});

describe("IconGrid keyboard navigation", () => {
  const products = Array.from({ length: 30 }, (_, i) =>
    makeProduct({ id: `p-${i}`, name: `App ${i}` })
  );

  it("ArrowRight advances to next page", () => {
    render(<IconGrid products={products} />);
    const region = screen.getByRole("region", { name: "App pages" });

    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.keyDown(region, { key: "ArrowRight" });

    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft goes to previous page", () => {
    render(<IconGrid products={products} />);
    const region = screen.getByRole("region", { name: "App pages" });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

describe("IconGrid swipe navigation", () => {
  const products = Array.from({ length: 30 }, (_, i) =>
    makeProduct({ id: `p-${i}`, name: `App ${i}` })
  );

  it("swipe left advances to next page", () => {
    render(<IconGrid products={products} />);
    const region = screen.getByRole("region", { name: "App pages" });

    fireEvent.mouseDown(region, { clientX: 200 });
    fireEvent.mouseUp(region, { clientX: 100 });

    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
