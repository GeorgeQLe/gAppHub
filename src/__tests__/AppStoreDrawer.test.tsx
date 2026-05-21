import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import AppStoreDrawer from "@/components/AppStoreDrawer";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "test-id",
    name: "Test App",
    url: "https://example.com",
    icon: "layout-grid",
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

describe("AppStoreDrawer rendering", () => {
  it("renders product name, description, and Open button when product is provided", () => {
    render(<AppStoreDrawer product={makeProduct()} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("A test product")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders nothing when product is null", () => {
    const { container } = render(
      <AppStoreDrawer product={null} onClose={vi.fn()} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("uses longDescription when available", () => {
    render(
      <AppStoreDrawer
        product={makeProduct({ longDescription: "Extended description" })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Extended description")).toBeInTheDocument();
    expect(screen.queryByText("A test product")).toBeNull();
  });
});

describe("AppStoreDrawer CTA", () => {
  it("has correct href and target attributes", () => {
    render(
      <AppStoreDrawer
        product={makeProduct({ url: "https://example.com/app" })}
        onClose={vi.fn()}
      />,
    );
    const link = screen.getByRole("link", { name: /open test app/i });
    expect(link).toHaveAttribute("href", "https://example.com/app");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has aria-label with product name", () => {
    render(
      <AppStoreDrawer product={makeProduct({ name: "My App" })} onClose={vi.fn()} />,
    );
    const link = screen.getByRole("link", { name: "Open My App in new tab" });
    expect(link).toBeInTheDocument();
  });
});

describe("AppStoreDrawer accessibility", () => {
  it("has role=dialog and aria-modal=true", () => {
    render(<AppStoreDrawer product={makeProduct()} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("has aria-label with product name", () => {
    render(
      <AppStoreDrawer product={makeProduct({ name: "Cool App" })} onClose={vi.fn()} />,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-label",
      "Cool App details",
    );
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<AppStoreDrawer product={makeProduct()} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("AppStoreDrawer dismiss", () => {
  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <AppStoreDrawer product={makeProduct()} onClose={onClose} />,
    );
    const backdrop = container.querySelector(".bg-black\\/40")!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("AppStoreDrawer screenshots", () => {
  it("hides screenshots section when screenshots is absent", () => {
    render(<AppStoreDrawer product={makeProduct()} onClose={vi.fn()} />);
    expect(screen.queryByText("Screenshots")).toBeNull();
  });

  it("hides screenshots section when screenshots is empty", () => {
    render(
      <AppStoreDrawer
        product={makeProduct({ screenshots: [] })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByText("Screenshots")).toBeNull();
  });

  it("shows screenshots section when screenshots has entries", () => {
    render(
      <AppStoreDrawer
        product={makeProduct({
          screenshots: ["/img/s1.png", "/img/s2.png"],
        })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Screenshots")).toBeInTheDocument();
    const images = screen.getAllByRole("img", { name: /screenshot/i });
    expect(images).toHaveLength(2);
  });
});

describe("AppStoreDrawer testimonials", () => {
  it("hides testimonials section when testimonials is absent", () => {
    render(<AppStoreDrawer product={makeProduct()} onClose={vi.fn()} />);
    expect(screen.queryByText("Testimonials")).toBeNull();
  });

  it("hides testimonials section when testimonials is empty", () => {
    render(
      <AppStoreDrawer
        product={makeProduct({ testimonials: [] })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByText("Testimonials")).toBeNull();
  });

  it("shows testimonials section when testimonials has entries", () => {
    render(
      <AppStoreDrawer
        product={makeProduct({
          testimonials: [
            { text: "Great app!", author: "Alice" },
            { text: "Love it", author: "Bob" },
          ],
        })}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Testimonials")).toBeInTheDocument();
    expect(screen.getByText(/Great app!/)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });
});

describe("AppStoreDrawer icon rendering", () => {
  it("renders 72px icon for standard Lucide icons", () => {
    const { container } = render(
      <AppStoreDrawer product={makeProduct({ icon: "layout-grid" })} onClose={vi.fn()} />,
    );
    const iconDiv = container.querySelector(".h-\\[72px\\].w-\\[72px\\]");
    expect(iconDiv).toBeInTheDocument();
  });

  it("renders custom PNG for CUSTOM_ICON_IDS products", () => {
    const { container } = render(
      <AppStoreDrawer
        product={makeProduct({ id: "war-room", icon: "swords" })}
        onClose={vi.fn()}
      />,
    );
    const img = container.querySelector('img[width="72"][height="72"]');
    expect(img).toBeInTheDocument();
    expect(decodeURIComponent(img?.getAttribute("src") ?? "")).toContain(
      "/icons/products/war-room.png",
    );
    expect(img).toHaveAttribute("width", "72");
    expect(img).toHaveAttribute("height", "72");
  });

  it("renders badge dot with correct color next to product name", () => {
    const { container } = render(
      <AppStoreDrawer product={makeProduct({ badge: "L" })} onClose={vi.fn()} />,
    );
    const dot = container.querySelector(".h-2\\.5.w-2\\.5.rounded-full");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ backgroundColor: "rgb(34, 197, 94)" });
  });

  it("does not render badge dot for deprecated product", () => {
    const { container } = render(
      <AppStoreDrawer product={makeProduct({ badge: null })} onClose={vi.fn()} />,
    );
    const dot = container.querySelector(".h-2\\.5.w-2\\.5.rounded-full");
    expect(dot).toBeNull();
  });

  it("applies grayscale and opacity to deprecated product icon", () => {
    const { container } = render(
      <AppStoreDrawer product={makeProduct({ badge: null })} onClose={vi.fn()} />,
    );
    const icon = container.querySelector(".h-\\[72px\\].w-\\[72px\\]");
    expect(icon?.className).toContain("grayscale");
    expect(icon?.className).toContain("opacity-50");
  });
});
