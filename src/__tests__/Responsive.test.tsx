import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("@/hooks/useIsMobile", () => ({ useIsMobile: vi.fn(() => false) }));

import { useIsMobile } from "@/hooks/useIsMobile";
import PhoneFrame from "@/components/PhoneFrame";

const mockUseIsMobile = vi.mocked(useIsMobile);

beforeEach(() => {
  cleanup();
  mockUseIsMobile.mockReturnValue(false);
});

describe("PhoneFrame — mobile", () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(true);
  });

  it("renders simplified frame classes", () => {
    const { container } = render(<PhoneFrame />);
    const outer = container.firstElementChild!;
    expect(outer.className).toContain("border-2");
    expect(outer.className).toContain("rounded-3xl");
    expect(outer.className).toContain("w-[90vw]");
  });

  it("does not render metallic gradient", () => {
    const { container } = render(<PhoneFrame />);
    const outer = container.firstElementChild!;
    expect((outer as HTMLElement).style.background).toBe("");
  });

  it("has region role and aria-label", () => {
    render(<PhoneFrame />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Lexcorp product launcher");
  });
});

describe("PhoneFrame — desktop", () => {
  it("renders full frame with rounded-[50px]", () => {
    const { container } = render(<PhoneFrame />);
    const frame = container.querySelector(".rounded-\\[50px\\]");
    expect(frame).not.toBeNull();
  });

  it("renders metallic gradient inline style", () => {
    const { container } = render(<PhoneFrame />);
    const frame = container.querySelector(".rounded-\\[50px\\]") as HTMLElement;
    expect(frame.style.background).toContain("linear-gradient");
  });

  it("has region role and aria-label", () => {
    render(<PhoneFrame />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Lexcorp product launcher");
  });
});
