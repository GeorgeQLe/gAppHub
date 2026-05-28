import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import SearchOverlay from "@/components/SearchOverlay";
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

const products = [
  makeProduct({ id: "1", name: "Alpha", badge: "L", category: ["design"] }),
  makeProduct({ id: "2", name: "Bravo", badge: "B", category: ["dev"] }),
  makeProduct({ id: "3", name: "Charlie", badge: "N", category: ["design"] }),
  makeProduct({ id: "4", name: "Delta", badge: "C", category: ["marketing"] }),
];

describe("SearchOverlay standalone", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onSearch when user types", () => {
    const onSearch = vi.fn();
    const onDismiss = vi.fn();
    render(
      <SearchOverlay visible={true} onSearch={onSearch} onDismiss={onDismiss} />
    );
    act(() => {
      vi.runAllTimers();
    });

    const input = screen.getByLabelText("Search apps");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(onSearch).toHaveBeenCalledWith("hello");
  });

  it("Escape calls onDismiss", () => {
    const onSearch = vi.fn();
    const onDismiss = vi.fn();
    render(
      <SearchOverlay visible={true} onSearch={onSearch} onDismiss={onDismiss} />
    );
    act(() => {
      vi.runAllTimers();
    });

    const input = screen.getByLabelText("Search apps");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onDismiss).toHaveBeenCalled();
  });

  it("backdrop click calls onDismiss", () => {
    const onSearch = vi.fn();
    const onDismiss = vi.fn();
    const { container } = render(
      <SearchOverlay visible={true} onSearch={onSearch} onDismiss={onDismiss} />
    );
    act(() => {
      vi.runAllTimers();
    });

    const backdrop = container.querySelector('[role="presentation"]')!;
    fireEvent.click(backdrop);
    expect(onDismiss).toHaveBeenCalled();
  });

  it("renders the close icon in black", () => {
    render(
      <SearchOverlay visible={true} onSearch={vi.fn()} onDismiss={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: "Close search" })).toHaveClass(
      "text-black"
    );
  });
});

describe("Search filtering via IconGrid", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function openSearchAndType(query: string) {
    const region = screen.getByRole("grid", { name: "Product apps" });
    fireEvent.mouseDown(region, { clientX: 100 });
    fireEvent.mouseUp(region, { clientX: 100 });

    fireEvent.touchStart(region, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchEnd(region, {
      changedTouches: [{ clientX: 100, clientY: 200 }],
    });

    act(() => {
      vi.runAllTimers();
    });

    const input = screen.getByLabelText("Search apps");
    fireEvent.change(input, { target: { value: query } });
  }

  const makeManyProducts = (count: number, namePrefix = "App") =>
    Array.from({ length: count }, (_, index) =>
      makeProduct({
        id: `app-${index + 1}`,
        name: `${namePrefix} ${index + 1}`,
        order: index + 1,
      }),
    );

  it("pull-down gesture opens search without flattening every page", () => {
    const manyProducts = makeManyProducts(30);

    render(<IconGrid products={manyProducts} />);
    openSearchAndType("");

    expect(screen.getByText("App 1")).toBeInTheDocument();
    expect(screen.getByText("App 24")).toBeInTheDocument();
    expect(document.querySelector("[data-search-results]")).toBeNull();
    expect(screen.queryByText("No apps found")).toBeNull();
  });

  it("uses paginated grid pages for broad search results", () => {
    const manyProducts = makeManyProducts(30);

    render(<IconGrid products={manyProducts} />);
    openSearchAndType("App");

    expect(document.querySelector("[data-search-results]")).toBeNull();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByText("App 1")).toBeInTheDocument();
    expect(screen.getByText("App 25")).toBeInTheDocument();
  });

  it("keeps horizontal swipe active while search is open", () => {
    const manyProducts = makeManyProducts(30);
    render(<IconGrid products={manyProducts} />);
    openSearchAndType("App");

    const region = screen.getByRole("grid", { name: "Product apps" });
    fireEvent.touchStart(region, {
      touches: [{ clientX: 200, clientY: 100 }],
    });
    fireEvent.touchEnd(region, {
      changedTouches: [{ clientX: 100, clientY: 105 }],
    });

    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("resets to the first page when the search query changes", () => {
    const manyProducts = makeManyProducts(50);
    render(<IconGrid products={manyProducts} />);
    openSearchAndType("App");

    const region = screen.getByRole("grid", { name: "Product apps" });
    fireEvent.touchStart(region, {
      touches: [{ clientX: 200, clientY: 100 }],
    });
    fireEvent.touchEnd(region, {
      changedTouches: [{ clientX: 100, clientY: 105 }],
    });
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.change(screen.getByLabelText("Search apps"), {
      target: { value: "live" },
    });

    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("does not use grid arrow navigation from the search input", () => {
    const manyProducts = makeManyProducts(30);
    render(<IconGrid products={manyProducts} />);
    openSearchAndType("App");

    const input = screen.getByLabelText("Search apps");
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("filters by product name", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("Alpha");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).toBeNull();
  });

  it("filters by badge label", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("live");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).toBeNull();
  });

  it("filters by category tag", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("design");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).toBeNull();
  });

  it("shows 'No apps found' for non-matching query", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("zzzzz");

    expect(screen.getByText("No apps found")).toBeInTheDocument();
    expect(screen.queryByRole("tablist")).toBeNull();
  });
});
