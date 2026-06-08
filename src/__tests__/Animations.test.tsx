import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PageContent from "@/components/PageContent";
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

function makeGridProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({ id: `grid-${i}`, name: `Grid App ${i}`, order: i }),
  );
}

function makeDockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) =>
    makeProduct({ id: `dock-${i}`, name: `Dock App ${i}`, dock: true, order: i }),
  );
}

const gridProducts = makeGridProducts(20);
const dockProducts = makeDockProducts(4);
const BOOT_DURATION = 2800;
const BOOT_ISLAND_MESSAGE_DELAY = 2000;

function mockReducedMotion(enabled: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mockMql = {
    matches: enabled,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
      if (event === "change") listeners.push(cb);
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  } as unknown as MediaQueryList;

  vi.spyOn(window, "matchMedia").mockReturnValue(mockMql);
  return { listeners, mockMql };
}

function renderPageContent(variant: "none" | "boot") {
  return render(
    <PageContent
      variant={variant}
      gridProducts={gridProducts}
      dockProducts={dockProducts}
    />,
  );
}

function expectFinalContent() {
  expect(screen.queryAllByText("9:41 AM").length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByLabelText(/Grid App/)).toHaveLength(20);
  expect(screen.getAllByLabelText(/Dock App/)).toHaveLength(4);
}

describe("PageContent rendering (4 variants)", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 41, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('variant="none" renders StatusBar, DynamicIsland, IconGrid, Dock, HomeIndicator', () => {
    renderPageContent("none");
    expectFinalContent();
  });

  it('variant="boot" renders same final content after animation completes', () => {
    renderPageContent("boot");
    act(() => { vi.advanceTimersByTime(BOOT_DURATION); });
    expectFinalContent();
  });

  it("boot splash stacks the intro text in the center", () => {
    renderPageContent("boot");

    expect(screen.getByText("Lexcorp")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByText("Lexcorp")).toBeInTheDocument();
    expect(screen.getByText("made with ♥")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByText("Lexcorp")).toBeInTheDocument();
    expect(screen.getByText("made with ♥")).toBeInTheDocument();
    expect(screen.getByText('by George "G" Le')).toBeInTheDocument();
  });

  it("starts rotating intro text through the Dynamic Island after the splash", () => {
    renderPageContent("boot");

    expect(screen.queryByLabelText("Lexcorp")).not.toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(5400); });
    expect(screen.getByLabelText("Lexcorp")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(BOOT_ISLAND_MESSAGE_DELAY); });
    expect(screen.getByLabelText("made with ♥")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(BOOT_ISLAND_MESSAGE_DELAY); });
    expect(screen.getByLabelText('by George "G" Le')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(BOOT_ISLAND_MESSAGE_DELAY); });
    expect(screen.getByLabelText("Lexcorp")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(BOOT_ISLAND_MESSAGE_DELAY); });
    expect(screen.getByLabelText("made with ♥")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(BOOT_ISLAND_MESSAGE_DELAY); });
    expect(screen.getByLabelText('by George "G" Le')).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(BOOT_ISLAND_MESSAGE_DELAY); });
    expect(screen.getByLabelText("Lexcorp")).toBeInTheDocument();
  });

});

describe("useReducedMotion hook", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 41, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns false when prefers-reduced-motion does not match", () => {
    mockReducedMotion(false);
    const { container } = renderPageContent("boot");

    expect(container.querySelector(".z-40")).toBeInTheDocument();
  });

  it("returns true when prefers-reduced-motion: reduce matches", () => {
    mockReducedMotion(true);
    const { container } = renderPageContent("boot");

    expect(container.querySelector(".z-40")).not.toBeInTheDocument();
  });

  it("updates when media query change event fires", () => {
    const { listeners, mockMql } = mockReducedMotion(false);
    const { container } = renderPageContent("boot");

    expect(container.querySelector(".z-40")).toBeInTheDocument();

    act(() => {
      (mockMql as { matches: boolean }).matches = true;
      listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent));
    });

    expect(container.querySelector(".z-40")).not.toBeInTheDocument();
  });
});

describe("Reduced motion on animation variants", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 41, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("boot with reduced motion skips animation and renders final content immediately", () => {
    mockReducedMotion(true);
    renderPageContent("boot");
    expectFinalContent();
  });

});

describe("Cross-route consistency", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 41, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("both variants render same number of grid icons (20) and dock icons (4)", () => {
    const variants = ["none", "boot"] as const;
    const timings = { none: 0, boot: BOOT_DURATION };

    for (const variant of variants) {
      const { unmount } = renderPageContent(variant);

      act(() => { vi.advanceTimersByTime(timings[variant]); });

      expect(screen.getAllByLabelText(/Grid App/)).toHaveLength(20);
      expect(screen.getAllByLabelText(/Dock App/)).toHaveLength(4);

      unmount();
    }
  });
});
