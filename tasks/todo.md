# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 1 of 6 — Project Scaffold & Phone Frame
> Test strategy: tests-after

## Phase 1: Project Scaffold & Phone Frame

**Goal**: Establish the Next.js project, deploy a blank shell to Vercel, and render the realistic iPhone 15 frame with Dynamic Island, status bar (live easter eggs), wallpaper, home indicator, Lexcorp logo, and tagline. This is the visual foundation everything else layers onto.

**Scope**:
- Next.js project initialization with TypeScript, Tailwind CSS (or CSS modules), and system font stack
- Page background: silver-to-white gradient (`#f5f5f7` → `#ffffff`)
- Phone frame shell: rounded rectangle with metallic border gradient, dark bezel, 3D multi-layer box-shadow
- Dynamic Island: pill-shaped black cutout centered at top
- Status bar: real-world time (left), signal bars tied to product data (right), battery % tied to shipped ratio (right)
- Wallpaper: subtle blue-gray to lavender gradient inside the screen area
- Home indicator: dark gray capsule at bottom
- Lexcorp logo/wordmark above the phone (placeholder SVG)
- Tagline: "Made in Boston, Building in Public" below the logo
- Vercel deployment pipeline (manual project setup required first)

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [x] Step 1.1: Initialize Next.js project with TypeScript and Tailwind CSS
  - Files: create `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`
  - Initialize with `npx create-next-app@latest` using App Router, TypeScript, Tailwind CSS, ESLint
  - Configure system font stack in Tailwind config and globals
  - Set page metadata (title: "GappHub — Lexcorp Products", description)

- [x] Step 1.2: Build page layout with background gradient and logo/tagline
  - Files: modify `src/app/page.tsx`, modify `src/app/globals.css`
  - Full-viewport layout with silver-to-white gradient background (`#f5f5f7` → `#ffffff`)
  - Flexbox column: logo → tagline → phone frame → (legend placeholder)
  - Lexcorp placeholder logo (inline SVG or text wordmark, ~120–160px wide, charcoal color)
  - Tagline "Made in Boston, Building in Public" below logo (13px, uppercase tracking, medium gray `#86868b`)

- [x] Step 1.3: Build the phone frame shell component
  - Files: create `src/components/PhoneFrame.tsx`
  - Outer frame: rounded rectangle (~423×860px including frame), metallic border gradient, corner radius ~50px
  - Inner bezel: ~12px dark border (`#1c1c1e`), corner radius ~38px
  - 3D shadow: multi-layer `box-shadow` (primary `0 20px 60px rgba(0,0,0,0.15)`, secondary `0 2px 8px rgba(0,0,0,0.08)`, edge highlight `inset 0 1px 0 rgba(255,255,255,0.3)`)
  - Screen area: 375×812px, contains wallpaper gradient (`#e8ecf4` → `#f5f0f6`), overflow hidden

- [x] Step 1.4: Build the Dynamic Island component
  - Files: create `src/components/DynamicIsland.tsx`, modify `src/app/page.tsx`
  - Pill-shaped black cutout (`#000`), ~120×36px, centered horizontally, ~12px below top of screen area
  - Positioned absolutely within the screen area

- [ ] Step 1.5: Build the status bar component with live easter eggs
  - Files: create `src/components/StatusBar.tsx`
  - Height: ~44px, positioned at top of screen area, flanking the Dynamic Island
  - Left side: current real-world time in `h:mm` format (updates every minute via `useEffect` + `setInterval`)
  - Right side: signal bars (placeholder static for now — will be driven by product data in Phase 2), Wi-Fi icon (always full, decorative SVG), battery icon with percentage (placeholder static for now)
  - Typography: system sans-serif, 12px, semibold, dark text on light wallpaper

  #### Implementation Plan (Step 1.5)

  **Context:** The phone screen area (`PhoneFrame.tsx`) is a `relative overflow-hidden rounded-[38px]` div (375×812px). `DynamicIsland.tsx` sits at `absolute top-3 left-1/2 -translate-x-1/2 z-10` as a 120×36px black pill. `page.tsx` composes `<DynamicIsland />` as a child of `<PhoneFrame>`. The status bar needs to flank the Dynamic Island on both sides.

  **What to build:**
  Create a `StatusBar` client component that renders the iOS-style status bar at the top of the phone screen. It has two sections flanking the Dynamic Island:
  - **Left cluster** (time): real-world clock in `h:mm` format, updating every minute
  - **Right cluster** (indicators): signal bars icon (4 bars, static placeholder), Wi-Fi icon (static SVG), battery icon with "100%" text (static placeholder)

  **Files to create/modify:**
  - **Create** `src/components/StatusBar.tsx` — the status bar with time + indicators
  - **Modify** `src/app/page.tsx` — add `<StatusBar />` as a child of `<PhoneFrame>`, alongside `<DynamicIsland />`

  **Technical approach:**
  - `"use client"` directive (needs `useEffect` + `useState` for live clock)
  - Container: `absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-6`
  - Left side: `<span>` showing time via `new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })`
  - Right side: flex row with inline SVG icons for signal bars, Wi-Fi, and battery + percentage text
  - Typography: `text-xs font-semibold text-[#1d1d1f]`
  - z-index: lower than Dynamic Island (no z-index needed, or z-0) — the island overlaps the center naturally
  - Clock update: `useEffect` with `setInterval(60000)` and cleanup, initial state from `useState`
  - Signal bars: 4 rounded rectangles of increasing height (inline SVG, ~16×12px)
  - Wi-Fi icon: simple inline SVG arc icon (~14×12px)
  - Battery icon: inline SVG rectangle with fill level + "100%" text beside it (~28×12px icon)

  **Conventions from prior steps:**
  - Tailwind v4 with CSS `@theme` config (no `tailwind.config.ts`)
  - Light-only design (no dark mode)
  - Pure Tailwind classes preferred; inline styles for complex SVG viewBox values
  - PhoneFrame screen area is `relative overflow-hidden rounded-[38px]`

  **Execution Profile:**
  - Parallel mode: serial
  - Integration owner: main agent

  **Verification:**
  - `npm run build` succeeds
  - `npm run lint` clean
  - Dev server shows time on left side, signal/Wi-Fi/battery on right side, flanking the Dynamic Island
  - Time updates when the minute changes (can test by setting system clock or waiting)

  **Handoff:** Implement only this step, validate it, then run `/ship` when done.

- [ ] Step 1.6: Build the home indicator component
  - Files: create `src/components/HomeIndicator.tsx`
  - Rounded capsule, ~134×5px, dark gray with slight transparency
  - Centered horizontally, ~8px from bottom of screen area

- [ ] Step 1.7: Assemble all components on the main page
  - Files: modify `src/app/page.tsx`
  - Compose: page background → logo/tagline → PhoneFrame (containing wallpaper, DynamicIsland, StatusBar, empty screen area, HomeIndicator)
  - Verify vertical centering with offset for logo above and legend space below

### Green
- [ ] Step 1.8: Write smoke tests covering acceptance criteria
  - Files: create `src/__tests__/PhoneFrame.test.tsx`, create `vitest.config.ts`, install test dependencies
  - Set up testing framework (Vitest + React Testing Library)
  - Test: PhoneFrame component renders without crashing
  - Test: StatusBar displays a time string matching `h:mm` format
  - Test: Home indicator renders
  - Test: Dynamic Island renders
  - Test: Page renders logo text and tagline text

- [ ] Step 1.9: Run all tests, verify they pass, build succeeds with `npm run build`

### Milestone: Phase 1 — Scaffold & Frame
**Acceptance Criteria:**
- [ ] Next.js app builds and runs locally with `npm run dev`
- [ ] Phone frame renders at correct proportions (~375×812 screen area) with visible Dynamic Island, bezel, and 3D shadow
- [ ] Status bar displays current real-world time on the left
- [ ] Wallpaper gradient is visible behind the (empty) screen area
- [ ] Home indicator renders at the bottom of the screen area
- [ ] Lexcorp placeholder logo and tagline are visible above the phone
- [ ] Page background is the specified silver-to-white gradient
- [ ] App deploys to Vercel successfully
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests
