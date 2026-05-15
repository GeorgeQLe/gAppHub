import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import BadgeLegend from "@/components/BadgeLegend";

function renderLegend() {
  const { container } = render(<BadgeLegend />);
  return within(container.firstElementChild as HTMLElement);
}

describe("BadgeLegend", () => {
  it("renders all 5 legend items", () => {
    const view = renderLegend();
    expect(view.getByText("Live")).toBeInTheDocument();
    expect(view.getByText("Beta")).toBeInTheDocument();
    expect(view.getByText("New")).toBeInTheDocument();
    expect(view.getByText("Wishlist")).toBeInTheDocument();
    expect(view.getByText("Deprecated")).toBeInTheDocument();
  });

  it("renders badge letters L, B, N, W", () => {
    const view = renderLegend();
    expect(view.getByText("L")).toBeInTheDocument();
    expect(view.getByText("B")).toBeInTheDocument();
    expect(view.getByText("N")).toBeInTheDocument();
    expect(view.getByText("W")).toBeInTheDocument();
  });

  it("shows tooltip on hover for Live badge", () => {
    const view = renderLegend();
    fireEvent.mouseEnter(view.getByText("Live").closest("div")!);
    expect(view.getByRole("tooltip")).toHaveTextContent(
      "Product is live and available"
    );
  });

  it("shows tooltip on hover for Beta badge", () => {
    const view = renderLegend();
    fireEvent.mouseEnter(view.getByText("Beta").closest("div")!);
    expect(view.getByRole("tooltip")).toHaveTextContent(
      "Product is in beta testing"
    );
  });

  it("shows tooltip on hover for New badge", () => {
    const view = renderLegend();
    fireEvent.mouseEnter(view.getByText("New").closest("div")!);
    expect(view.getByRole("tooltip")).toHaveTextContent(
      "Recently launched product"
    );
  });

  it("shows tooltip on hover for Wishlist badge", () => {
    const view = renderLegend();
    fireEvent.mouseEnter(view.getByText("Wishlist").closest("div")!);
    expect(view.getByRole("tooltip")).toHaveTextContent(
      "Product on the wishlist — coming soon"
    );
  });

  it("shows tooltip on hover for Deprecated item", () => {
    const view = renderLegend();
    fireEvent.mouseEnter(view.getByText("Deprecated").closest("div")!);
    expect(view.getByRole("tooltip")).toHaveTextContent(
      "Product has been retired"
    );
  });

  it("hides tooltip on mouse leave", () => {
    const view = renderLegend();
    const container = view.getByText("Live").closest("div")!;
    fireEvent.mouseEnter(container);
    expect(view.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    expect(view.queryByRole("tooltip")).toBeNull();
  });
});
