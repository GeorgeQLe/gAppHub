import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act, cleanup, screen } from "@testing-library/react";
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
    const link = container.querySelector("button")!;
    expect(link.className).toContain("focus-visible:outline");
    expect(link.className).toContain("focus-visible:outline-2");
    expect(link.className).toContain("focus-visible:outline-blue-500");
  });

  it("has hover and active scale classes", () => {
    const { container } = render(
      <AppIcon product={makeProduct()} />
    );
    const link = container.querySelector("button")!;
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
    const link = container.querySelector("button")!;

    fireEvent.mouseEnter(link);
    expect(screen.queryByRole("tooltip")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("My cool app");
    expect(tooltip.className).toContain("fixed");
    expect(tooltip.className).not.toContain("-translate-x-1/2");
  });

  it("centers the portal tooltip on the icon artwork", () => {
    const { container } = render(
      <AppIcon
        product={makeProduct({ description: "My cool app" })}
      />
    );
    const link = container.querySelector("button")!;
    const iconWrapper = link.querySelector("div.relative")!;

    vi.spyOn(link, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 120,
      right: 300,
      bottom: 198,
      width: 300,
      height: 78,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    });
    vi.spyOn(iconWrapper, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 120,
      right: 160,
      bottom: 180,
      width: 60,
      height: 60,
      x: 100,
      y: 120,
      toJSON: () => ({}),
    });

    fireEvent.mouseEnter(link);
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByRole("tooltip")).toHaveStyle({ left: "130px" });
  });

  it("hides tooltip on mouse leave", () => {
    const { container } = render(
      <AppIcon
        product={makeProduct({ description: "My cool app" })}
      />
    );
    const link = container.querySelector("button")!;

    fireEvent.mouseEnter(link);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    act(() => {
      fireEvent.mouseLeave(link);
    });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

describe("AppIcon onSelect callback", () => {
  it("calls onSelect with the product when clicked", () => {
    const product = makeProduct({ name: "Click Me" });
    const onSelect = vi.fn();
    render(<AppIcon product={product} onSelect={onSelect} />);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(product);
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
