import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import PhoneFrame from "@/components/PhoneFrame";

beforeEach(() => {
  cleanup();
});

describe("PhoneFrame — mobile", () => {
  it("renders simplified frame classes", () => {
    const { container } = render(<PhoneFrame />);
    const outer = container.firstElementChild!;
    expect(outer.className).toContain("border-2");
    expect(outer.className).toContain("rounded-3xl");
    expect(outer.className).toContain("h-[min(194.88vw,100%)]");
    expect(outer.className).toContain("max-h-full");
  });

  it("does not render metallic gradient", () => {
    const { container } = render(<PhoneFrame />);
    const shell = container.querySelector(".phone-frame-shell") as HTMLElement;
    expect(shell.style.background).toBe("");
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
    const frame = container.querySelector(".phone-frame-shell");
    expect(frame?.className).toContain("md:rounded-[50px]");
  });

  it("uses the desktop metallic shell class", () => {
    const { container } = render(<PhoneFrame />);
    const frame = container.querySelector(".phone-frame-shell");
    expect(frame).not.toBeNull();
  });

  it("has region role and aria-label", () => {
    render(<PhoneFrame />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Lexcorp product launcher");
  });
});
