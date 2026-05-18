import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PhoneFrame from "@/components/PhoneFrame";
import StatusBar from "@/components/StatusBar";
import DynamicIsland from "@/components/DynamicIsland";
import HomeIndicator from "@/components/HomeIndicator";
import Home from "@/app/page";

describe("PhoneFrame", () => {
  it("renders children", () => {
    render(
      <PhoneFrame>
        <span data-testid="child">hello</span>
      </PhoneFrame>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

describe("StatusBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 9, 41));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays time matching h:mm pattern", () => {
    render(<StatusBar />);
    expect(screen.getByText(/^\d{1,2}:\d{2}/)).toBeInTheDocument();
  });

  it("renders only the battery icon on the right side", () => {
    const { container } = render(<StatusBar />);
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});

describe("DynamicIsland", () => {
  it("renders", () => {
    const { container } = render(<DynamicIsland />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders optional rotating label copy", () => {
    render(<DynamicIsland label="Lexcorp" />);
    expect(screen.getByText("Lexcorp")).toBeInTheDocument();
  });
});

describe("HomeIndicator", () => {
  it("renders", () => {
    const { container } = render(<HomeIndicator />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("Home page", () => {
  beforeEach(() => {
    cleanup();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 9, 41));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the product launcher", async () => {
    const jsx = await Home();
    render(jsx);
    expect(
      screen.getByRole("region", { name: "Lexcorp product launcher" }),
    ).toBeInTheDocument();
  });
});
