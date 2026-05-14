# Session History — GappHub

## 2026-05-14 — Phase 1, Step 1.1: Initialize Next.js project

- Scaffolded Next.js 16 with App Router, TypeScript, Tailwind CSS v4, ESLint
- Configured system font stack (`-apple-system`, `BlinkMacSystemFont`, `system-ui`, etc.) via CSS `@theme` block
- Set metadata: title "GappHub — Lexcorp Products", description with tagline
- Replaced demo content with minimal "GappHub" placeholder
- Removed Next.js demo assets (next.svg, vercel.svg) and default README
- Verified `npm run build` passes and dev server renders correctly
- Note: Tailwind v4 uses CSS-based config (`@theme` in globals.css) instead of `tailwind.config.ts`

## 2026-05-14 — Phase 1, Step 1.2: Page layout with background gradient and logo/tagline

- Removed dark-mode `prefers-color-scheme` media query (light-only product page)
- Added silver-to-white gradient background (`linear-gradient(to bottom, #f5f5f7, #ffffff)`) with `min-height: 100vh`
- Built full-viewport flex column layout centered on both axes
- Added inline SVG "LEXCORP" wordmark (~140px, charcoal `#1d1d1f`, letterspaced)
- Added tagline "Made in Boston, Building in Public" (13px, uppercase, `tracking-widest`, gray `#86868b`)
- Added spacer div below tagline for phone frame placement in Step 1.3
- Verified: `npm run build` passes, `npm run lint` clean, dev server renders correctly

## 2026-05-14 — Phase 1, Step 1.3: Phone frame shell component

- Created `src/components/PhoneFrame.tsx` with realistic iPhone 15 Pro frame
- Outer metallic gradient border (`linear-gradient(145deg, #e0e0e0, #a0a0a0, #c0c0c0)`), rounded-[50px], 3px padding
- Inner dark bezel (`#1c1c1e`, rounded-[48px], 12px padding)
- Screen area: 375×812px, wallpaper gradient (`#e8ecf4` → `#f5f0f6`), overflow-hidden, relative
- 3D multi-layer box-shadow on outer frame
- Accepts `children` prop for Dynamic Island, StatusBar, HomeIndicator composition
- Updated `src/app/page.tsx`: imported PhoneFrame, replaced spacer div content with `<PhoneFrame />`
- Verified: `npm run build` passes, `npm run lint` clean, dev server renders phone frame correctly

## 2026-05-14 — Phase 1, Step 1.4: Dynamic Island component

- Created `src/components/DynamicIsland.tsx` — pill-shaped black cutout (120×36px, `rounded-full`, `bg-black`)
- Absolutely positioned: `top-3 left-1/2 -translate-x-1/2 z-10` within PhoneFrame's screen area
- Updated `src/app/page.tsx`: imported DynamicIsland, passed as child of `<PhoneFrame>`
- Pure Tailwind classes, no inline styles needed
- Verified: `npm run build` passes, `npm run lint` clean

## 2026-05-14 — Phase 1, Step 1.5: Status bar component with live easter eggs

- Created `src/components/StatusBar.tsx` — client component with live clock and indicator icons
- Left cluster: real-world time via `toLocaleTimeString`, updates every 60s via `useEffect`/`setInterval`
- Right cluster: signal bars (4-bar SVG), Wi-Fi (3-arc SVG), battery icon + "100%" text
- Container: `absolute top-0 left-0 right-0 h-[44px] flex items-center justify-between px-6`
- Typography: `text-xs font-semibold text-[#1d1d1f]`
- Updated `src/app/page.tsx`: imported StatusBar, added as child of `<PhoneFrame>` alongside DynamicIsland
- No z-index needed — Dynamic Island's `z-10` naturally overlaps the center
- Verified: `npm run build` passes, `npm run lint` clean

## 2026-05-14 — Phase 1, Steps 1.8–1.9: Smoke tests

- Set up Vitest + React Testing Library + jsdom test environment
- Created `vitest.config.ts` with jsdom environment, react plugin, and `@/` path alias
- Added `"test": "vitest run"` script to `package.json`
- Installed dev deps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react`
- Created `src/__tests__/PhoneFrame.test.tsx` with 6 smoke tests:
  - PhoneFrame renders children
  - StatusBar displays time matching `h:mm` pattern (using `vi.useFakeTimers()`)
  - DynamicIsland renders
  - HomeIndicator renders
  - Home page renders LEXCORP SVG (via `aria-label`)
  - Home page renders tagline text
- All 6 tests pass, `npm run build` succeeds, `npm run lint` clean
- Step 1.9 (verification) marked no-op — all checks passed during 1.8
- Phase 1 implementation steps all complete; phase milestone blocked by manual task (Vercel project setup)

## 2026-05-14 — Phase 1: Visual fixes & milestone completion

- Fixed StatusBar right-side icons overlapping Dynamic Island — switched from flex row to absolute-positioned left/right groups
- Vertically centered StatusBar items with Dynamic Island (both at 22px from top)
- Repositioned Dynamic Island from `top-3` to `top-[4px]` so its center aligns with status bar items
- Made PhoneFrame height flexible (`flex-1` instead of fixed `h-[812px]`) so phone fills remaining viewport
- Changed page layout from `min-h-screen justify-center` to `h-screen` with compact padding, eliminating scroll
- Reduced margins: logo-to-tagline `mt-3` → `mt-1`, tagline-to-phone `mt-12` → `mt-3`
- Vercel project created and linked (manual task completed by user)
- All Phase 1 milestone acceptance criteria now met — phase complete
- 6/6 tests pass, build succeeds, lint clean

## 2026-05-14 — Phase 1, Step 1.6: Home indicator component

- Created `src/components/HomeIndicator.tsx` — iOS-style swipe-up capsule (134×5px, `rounded-full`, `bg-[#1d1d1f] opacity-30`)
- Absolutely positioned: `bottom-2 left-1/2 -translate-x-1/2` within PhoneFrame's screen area
- Server component — no interactivity or state
- Updated `src/app/page.tsx`: imported HomeIndicator, added as child of `<PhoneFrame>`
- Step 1.7 (assemble all components) marked no-op — components were composed incrementally in Steps 1.3–1.6
- Verified: `npm run build` passes, `npm run lint` clean
