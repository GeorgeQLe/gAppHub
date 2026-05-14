import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
});

describe("DynamicIsland", () => {
  it("renders", () => {
    const { container } = render(<DynamicIsland />);
    expect(container.firstChild).toBeInTheDocument();
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
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 9, 41));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders LEXCORP text", () => {
    render(<Home />);
    expect(screen.getByLabelText("Lexcorp")).toBeInTheDocument();
  });

  it("renders tagline", () => {
    render(<Home />);
    expect(
      screen.getAllByText(/Made in Boston, Building in Public/).length
    ).toBeGreaterThan(0);
  });
});
