import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PageDots from "@/components/PageDots";
import IconGrid from "@/components/IconGrid";
import PhoneFrame from "@/components/PhoneFrame";
import { PhoneSwipeProvider } from "@/contexts/PhoneSwipeContext";
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

  it("active dot has dark class, inactive has translucent dark class", () => {
    render(<PageDots total={3} active={1} />);
    const tabs = screen.getAllByRole("tab");
    const dots = tabs.map((tab) => tab.querySelector("span")!);
    expect(dots[0].className).toContain("bg-[#1d1d1f]/35");
    expect(dots[1].className).toContain("bg-[#1d1d1f]");
    expect(dots[1].className).not.toContain("bg-[#1d1d1f]/35");
    expect(dots[2].className).toContain("bg-[#1d1d1f]/35");
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

  it("ArrowRight past last icon advances to next page", () => {
    render(<IconGrid products={products} />);
    const region = screen.getByRole("grid", { name: "Product apps" });

    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // 24 icons per page — arrow past the last one to trigger page change
    for (let i = 0; i < 24; i++) {
      fireEvent.keyDown(region, { key: "ArrowRight" });
    }

    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("ArrowLeft at first icon goes to previous page", () => {
    render(<IconGrid products={products} />);
    const region = screen.getByRole("grid", { name: "Product apps" });

    // Navigate to page 2
    for (let i = 0; i < 24; i++) {
      fireEvent.keyDown(region, { key: "ArrowRight" });
    }
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // ArrowLeft at first icon of page 2 goes back to page 1
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
    render(
      <PhoneSwipeProvider>
        <PhoneFrame>
          <IconGrid products={products} />
        </PhoneFrame>
      </PhoneSwipeProvider>
    );
    const phoneRegion = screen.getByRole("region", { name: "Lexcorp product launcher" });

    fireEvent.mouseDown(phoneRegion, { clientX: 200 });
    fireEvent.mouseUp(phoneRegion, { clientX: 100 });

    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
