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
  makeProduct({ id: "4", name: "Delta", badge: "W", category: ["marketing"] }),
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

    const backdrop = container.querySelector("[aria-hidden]")!;
    fireEvent.click(backdrop);
    expect(onDismiss).toHaveBeenCalled();
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

  it("pull-down gesture opens search and shows all products", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();
  });

  it("filters by product name", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("Alpha");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Bravo")).toBeNull();
  });

  it("filters by badge label", () => {
    render(<IconGrid products={products} />);
    openSearchAndType("launch");

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
  });
});
