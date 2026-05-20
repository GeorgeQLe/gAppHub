import { describe, it, expect } from "vitest";
import { render, within } from "@testing-library/react";
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
    expect(view.getByText("Concept")).toBeInTheDocument();
    expect(view.getByText("Deprecated")).toBeInTheDocument();
  });

  it("renders badge letters L, B, N, C", () => {
    const view = renderLegend();
    expect(view.getByText("L")).toBeInTheDocument();
    expect(view.getByText("B")).toBeInTheDocument();
    expect(view.getByText("N")).toBeInTheDocument();
    expect(view.getByText("C")).toBeInTheDocument();
  });
});
