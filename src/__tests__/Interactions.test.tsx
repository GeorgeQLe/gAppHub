import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AppIcon from "@/components/AppIcon";
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

describe("AppIcon badge rendering", () => {
  it("renders green badge with letter L", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: "L" })} />
    );
    const badge = container.querySelector("span.rounded-full")!;
    expect(badge).toHaveTextContent("L");
    expect(badge.className).toContain("bg-[#22c55e]");
  });

  it("renders yellow badge with letter B", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: "B" })} />
    );
    const badge = container.querySelector("span.rounded-full")!;
    expect(badge).toHaveTextContent("B");
    expect(badge.className).toContain("bg-[#eab308]");
  });

  it("renders blue badge with letter N", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: "N" })} />
    );
    const badge = container.querySelector("span.rounded-full")!;
    expect(badge).toHaveTextContent("N");
    expect(badge.className).toContain("bg-[#3b82f6]");
  });

  it("renders red badge with letter C", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: "C" })} />
    );
    const badge = container.querySelector("span.rounded-full")!;
    expect(badge).toHaveTextContent("C");
    expect(badge.className).toContain("bg-[#ef4444]");
  });

  it("does not render badge for deprecated products", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: null })} />
    );
    const badge = container.querySelector("span.rounded-full");
    expect(badge).toBeNull();
  });

  it("badge has white 2px border", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: "L" })} />
    );
    const badge = container.querySelector("span.rounded-full")!;
    expect(badge.className).toContain("border-2");
    expect(badge.className).toContain("border-white");
  });
});

describe("AppIcon interaction classes", () => {
  it("has focus-visible outline classes", () => {
    const { container } = render(
      <AppIcon product={makeProduct()} />
    );
    const link = container.querySelector("a")!;
    expect(link.className).toContain("focus-visible:outline");
    expect(link.className).toContain("focus-visible:outline-2");
    expect(link.className).toContain("focus-visible:outline-blue-500");
  });

  it("has hover and active scale classes", () => {
    const { container } = render(
      <AppIcon product={makeProduct()} />
    );
    const link = container.querySelector("a")!;
    expect(link.className).toContain("hover:scale-105");
    expect(link.className).toContain("active:scale-[0.92]");
  });
});

describe("AppIcon tooltip", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows tooltip with description after 400ms hover", () => {
    const { container } = render(
      <AppIcon
        product={makeProduct({ description: "My cool app" })}
      />
    );
    const view = within(container);
    const link = container.querySelector("a")!;

    fireEvent.mouseEnter(link);
    expect(view.queryByRole("tooltip")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    const tooltip = view.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("My cool app");
  });

  it("hides tooltip on mouse leave", () => {
    const { container } = render(
      <AppIcon
        product={makeProduct({ description: "My cool app" })}
      />
    );
    const view = within(container);
    const link = container.querySelector("a")!;

    fireEvent.mouseEnter(link);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(view.getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      fireEvent.mouseLeave(link);
    });
    expect(view.queryByRole("tooltip")).toBeNull();
  });
});

describe("AppIcon deprecated styling", () => {
  it("applies grayscale and opacity to deprecated product icon", () => {
    const { container } = render(
      <AppIcon
        product={makeProduct({ name: "Old App", badge: null })}
      />
    );
    const iconDiv = container.querySelector(".rounded-\\[22\\.5\\%\\]")!;
    expect(iconDiv.className).toContain("grayscale");
    expect(iconDiv.className).toContain("opacity-50");
  });

  it("does not apply grayscale to active product icon", () => {
    const { container } = render(
      <AppIcon
        product={makeProduct({ name: "New App", badge: "L" })}
      />
    );
    const iconDiv = container.querySelector(".rounded-\\[22\\.5\\%\\]")!;
    expect(iconDiv.className).not.toContain("grayscale");
  });
});
