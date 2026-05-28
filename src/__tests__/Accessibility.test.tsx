import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import PhoneFrame from "@/components/PhoneFrame";
import IconGrid from "@/components/IconGrid";
import AppIcon from "@/components/AppIcon";
import Dock from "@/components/Dock";
import StatusBar from "@/components/StatusBar";
import PageDots from "@/components/PageDots";
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

describe("PhoneFrame accessibility", () => {
  it('has role="region" with aria-label', () => {
    render(<PhoneFrame />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Lexcorp product launcher");
  });
});

describe("IconGrid accessibility", () => {
  it('has role="grid" with aria-label', () => {
    render(<IconGrid products={[makeProduct()]} />);
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAttribute("aria-label", "Product apps");
  });
});

describe("AppIcon accessibility", () => {
  it("has composite aria-label on the button", () => {
    render(<AppIcon product={makeProduct({ name: "Alpha", badge: "L" })} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Alpha, Live");
  });

  it("labels deprecated products correctly", () => {
    render(
      <AppIcon product={makeProduct({ name: "Legacy", badge: null })} />,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Legacy, Deprecated");
  });

  it("has aria-hidden on the badge", () => {
    const { container } = render(
      <AppIcon product={makeProduct({ badge: "B" })} />,
    );
    const badge = container.querySelector("span.rounded-full");
    expect(badge).toHaveAttribute("aria-hidden", "true");
  });
});

describe("StatusBar accessibility", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<StatusBar />);
    const bar = container.firstElementChild!;
    expect(bar).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Dock accessibility", () => {
  const dockProducts = [
    makeProduct({ id: "d1", name: "Phone", dock: true }),
    makeProduct({ id: "d2", name: "Messages", dock: true }),
  ];

  it('has role="toolbar" with aria-label', () => {
    render(<Dock products={dockProducts} />);
    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toHaveAttribute("aria-label", "Pinned apps");
  });

  it("has frosted glass and inset highlight classes", () => {
    const { container } = render(<Dock products={dockProducts} />);
    const dock = container.firstElementChild!;
    expect(dock.className).toContain("bg-white/[0.72]");
    expect(dock.className).toContain(
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
    );
  });
});

describe("Reduced motion on AppIcon", () => {
  it("disables hover scale and shadow transforms under reduced motion", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const css = fs.readFileSync(
      path.resolve(__dirname, "../app/globals.css"),
      "utf-8",
    );
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain('[role="gridcell"] button');
    expect(css).toContain('[role="toolbar"] button');
    expect(css).toContain("transform: none !important");
    expect(css).toContain("box-shadow: none !important");
  });

  it("replaces active scale with opacity dim under reduced motion", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const css = fs.readFileSync(
      path.resolve(__dirname, "../app/globals.css"),
      "utf-8",
    );
    const reducedMotionBlock = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)"),
    );
    expect(reducedMotionBlock).toContain("button:active");
    expect(reducedMotionBlock).toContain("transform: none !important");
    expect(reducedMotionBlock).toContain("opacity: 0.7");
    expect(reducedMotionBlock).toContain("transition-property: opacity");
  });
});

describe("PageDots accessibility", () => {
  it("dots have 44×44 minimum touch targets", () => {
    const { container } = render(
      <PageDots total={3} active={0} onChange={() => {}} />,
    );
    const buttons = container.querySelectorAll('button[role="tab"]');
    expect(buttons.length).toBe(3);
    buttons.forEach((btn) => {
      expect(btn.className).toContain("min-w-[44px]");
      expect(btn.className).toContain("min-h-[44px]");
    });
  });

  it("tabs have correct aria-selected state", () => {
    render(<PageDots total={3} active={1} onChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });
});
