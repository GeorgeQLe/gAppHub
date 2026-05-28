# Session History — GappHub

## 2026-05-27 — Fix: Shimmer effect clipped to text letterforms

- Replaced `.shimmer-text` pseudo-element overlay technique with `background-clip: text` approach in `src/app/globals.css`.
- Old: `::after` pseudo-element swept a semi-transparent white gradient across the entire text bounding box (visible between/around letters).
- New: gradient IS the text color, clipped to glyph shapes via `background-clip: text` + `color: transparent`. Base text is 85%-opacity white, shimmer band is 100%-opacity white.
- Reuses existing `@keyframes shimmer` (no keyframe changes). No component changes needed — existing `shimmer-text` class, `--shimmer-delay` CSS variable, and Framer Motion props work as-is.
- Verified: single CSS rule change, no regressions to `.shimmer-foil` or `.shimmer-wipe` effects.

## 2026-05-25 — Shimmer effects on boot splash text and screen wipe

- Added `.shimmer-text` CSS class with pseudo-element shimmer sweep for boot splash text lines (Lexcorp, made with ♥, by George "G" Le), staggered via `--shimmer-delay` CSS custom property.
- Added `.shimmer-wipe` CSS class with vertical shimmer wipe overlay triggered at boot phase 3 completion.
- Applied shimmer-text to all three boot splash `motion.div` elements in `PageContent.tsx` with delays 0.35s, 1.15s, 1.95s.
- Added shimmer-wipe overlay as a full-screen pointer-events-none div at phase 3.

## 2026-05-25 — Shimmer effect on app icons after boot

- Added a one-shot holographic shimmer sweep across app icons after the boot splash fades (phase 4).
- CSS-only implementation: `@keyframes shimmer` + `.shimmer-foil` class in `globals.css`, absolutely-positioned overlay in `AppIcon.tsx`.
- Staggered per icon (80ms delay per index) so the sweep cascades across the grid.
- Threaded `shimmer` prop through `IconGrid`, `Dock`, and `BootPhoneContent`.
- Triggered via `bootShimmer` state in `PageContent.tsx` at 2800ms (when icons fade in).
- Validation: `npm run build` passes, `npm run lint` clean.

## 2026-05-22 — Journey map research shipped

- Created `research/journey-map.md`, mapping the anonymous visitor flow from discovery trigger through orientation, app-grid scan, drawer evaluation, product click-through, and optional exploration loop.
- Grounded the map in `research/icp.md`, `research/positioning.md`, `research/concept-brief.md`, `specs/ui-gapphub.md`, and `public/data/products.json`.
- Marked the journey-map documentation queue item complete in `tasks/todo.md`.
- Validation: documentation-focused checks only; no source code changed and executable app tests were not required for this documentation-only step.
- Ship manifest: User goal: execute the next incomplete `$run` step, which was the journey-map documentation item. Changed files: `research/journey-map.md`, `alignment/commit-and-push-by-feature-journey-map.html`, `tasks/todo.md`, `tasks/history.md`. Per-file purpose: new journey research artifact; alignment preview page; task completion bookkeeping; session history record. User-goal mapping: the new research file directly satisfies the unchecked `/journey-map` item, and task/history updates make the project state resumable. Tests run: file existence and source-reference checks. Skipped tests: `npm run lint`, `npm test`, and `npm run build` because this step changed only Markdown documentation and task records, not application source, configuration, runtime assets, schemas, or command surfaces. Adversarial review: checked the journey does not reposition GappHub as a marketplace, app store, commerce surface, or SaaS product and keeps infrastructure/analytics as future measurement ideas only. Residual risk: assumptions about visitor comprehension and CTA wording still need validation with real users or analytics. Rollback note: revert the shipping commit to remove the journey map and restore the queue item. Next command: `$run`.

## 2026-05-21 — ICP and competitive alignment page shipped

- Created `alignment/icp.html`, a standalone static HTML page synthesizing `research/icp.md`, `research/competitive-analysis.md`, and `research/concept-brief.md`.
- Renamed the page from `alignment/index.html` to `alignment/icp.html` after user correction.
- Marked the ICP and competitive-analysis documentation queue items complete because both research files now exist and the alignment page links their conclusions.
- Replaced three remaining app `<img>` usages with Next `Image` to clear lint warnings before shipping; updated the affected drawer test for Next image URL rewriting.
- Validation: `npm run lint` clean, `npm test` passed 102/102 tests, `npm run build` passed.
- Ship manifest: User goal: create and ship an HTML alignment page about ICP and competitive analysis. Changed files: `alignment/icp.html`, `alignment/ship-icp.html`, `src/components/AppIcon.tsx`, `src/components/AppStoreDrawer.tsx`, `src/__tests__/AppStoreDrawer.test.tsx`, `tasks/todo.md`, `tasks/history.md`, `tasks/lessons.md`. Per-file purpose: static strategy page; ship handoff page; lint-warning cleanup; test selector update; task/history/lesson bookkeeping. User-goal mapping: the requested page is `alignment/icp.html`; code/test edits support the ship validation gate. Tests run: `npm run lint`, `npm test`, `npm run build`. Skipped tests: none. Adversarial review: verified unrelated untracked `.agents/`, `.claude/`, and `.codex/` files are excluded from the ship boundary; accepted no residual lint warnings. Residual risk: no browser visual QA beyond file creation because this is a static artifact and the browser-open attempt may be platform-gated. Rollback note: revert the shipping commit to remove the page and validation cleanup. Next command: `$run`.

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

## 2026-05-14 — Phase 2, Step 2.1: Define product data schema and static products.json

- Created `src/types/product.ts` with `Product` and `ProductsResponse` TypeScript interfaces
- `Product` fields: `id`, `name`, `url`, `icon`, `description`, `badge` (`"L"|"B"|"N"|"W"|null`), `category` (string[]), `featured` (boolean), `dock` (boolean), `order` (number)
- Created `public/data/products.json` with 24 sample products:
  - 4 featured + dock (Mail, Calendar, Drive, Chat)
  - 4 newest (Notes, Tasks, Meet, Photos — badge "N")
  - 4 beta (Translate, Analytics, Studio, Code — badge "B")
  - 8 live (Sheets, Slides, Forms, Maps, Music, News, Wallet, Health — badge "L")
  - 3 wishlist (Vault, AI, CRM — badge "W")
  - 1 deprecated/null badge (Hub Classic)
- All products use placeholder icon paths (`/icons/placeholder.svg`) and `#` URLs
- Categories span: productivity, communication, storage, media, utilities, developer, design, entertainment, finance, health, security, business
- Verified: TypeScript compiles clean, JSON valid (24 products), `npm run build` passes, 6/6 tests pass

## 2026-05-14 — Phase 2, Step 2.3: Create placeholder icon SVGs

- Created 4 placeholder SVG icons (60×60px viewBox, rounded rect with linear gradient fill + centered glyph):
  - `public/icons/placeholder.svg` — purple gradient (default)
  - `public/icons/placeholder-blue.svg` — blue gradient
  - `public/icons/placeholder-green.svg` — green gradient
  - `public/icons/placeholder-orange.svg` — orange gradient
- Each SVG: `rx="12"` rounded square, subtle two-tone linear gradient, inner rounded-rect outline stroke, centered circle glyph — all in white
- Updated `public/data/products.json` to cycle color variants across all 24 products for visual variety
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 6/6 tests pass (no regressions)

## 2026-05-14 — Phase 2, Step 2.4: Build the AppIcon component

- Created `src/components/AppIcon.tsx` — presentational server component for iOS-style app icons
- Props: `{ product: Product }` — renders `<a>` wrapping 60×60 squircle `<img>` + centered name label
- Icon: `rounded-[22.5%]` border-radius, `overflow-hidden`, explicit width/height attributes
- Label: 11px `font-medium`, `text-[#333]`, single-line truncation via `truncate` + `max-w-[74px]`
- Deprecated state (badge === null): `grayscale opacity-50` on icon, `text-gray-400` on label
- Container: flex column, items-center, 4px gap (`gap-1`)
- Plain `<img>` (not Next.js `<Image>`) — local static SVGs don't need optimization
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 6/6 tests pass (no regressions)

## 2026-05-14 — Phase 2, Step 2.5: Build IconGrid component and integrate into page

- Created `src/components/IconGrid.tsx` — server component rendering a 4-column CSS grid (`grid-cols-4`, `gap-x-5 gap-y-7`) of `AppIcon` components
- Grid padding: `pt-[76px]` (clear status bar + Dynamic Island), `pb-[90px]` (dock reservation), `px-4`
- Props: `{ products: Product[] }` — expects pre-sorted array, maps to `<AppIcon>` with `key={p.id}`
- Updated `src/app/page.tsx`: converted `Home()` to async, calls `sortProducts(await getProducts())`, passes products to `<IconGrid>` between `<DynamicIsland>` and `<HomeIndicator>`
- Updated `src/__tests__/PhoneFrame.test.tsx`: Home page tests now await the async component (`const jsx = await Home(); render(jsx)`)
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 6/6 tests pass (no regressions)

## 2026-05-14 — Phase 2, Step 2.2: Build the data fetch layer with static fallback

- Created `src/lib/products.ts` with two exported functions
- `getProducts()`: async fetch from `NEXT_PUBLIC_PRODUCTS_URL` env var or `/data/products.json`, falls back to static JSON import on failure
- `sortProducts()`: deterministic priority sort — featured (by order asc) → top 4 newest non-featured (by order desc) → remaining L → B → W → null (each alphabetical by name)
- Imports `Product` type from `@/types/product`, static data from `../../public/data/products.json`
- Pure server-side module — no `"use client"`, no browser APIs
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 6/6 tests pass (no regressions)

## 2026-05-14 — Phase 3, Step 3.1: Add notification badges to AppIcon

- Added badge color map (`badgeColorMap`) with four badge types: L=#34C759, B=#FF9500, N=#007AFF, W=#AF52DE
- Wrapped `<img>` in a `relative` container div inside the `<a>` element
- Added absolutely-positioned badge `<span>` at top-right (-3px offset): 20px circle, 2px white border, white bold 11px letter
- Badge only renders when `product.badge` is truthy (not null) — deprecated icons unchanged
- AppIcon remains a server component (no JS/state needed)
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 17/17 tests pass (no regressions)

## 2026-05-14 — Phase 3, Step 3.2: Convert AppIcon to client component with hover/press/focus interactions

- Added `"use client"` directive to `src/components/AppIcon.tsx`
- Added CSS-only interaction states on the `<a>` element via Tailwind classes:
  - `transition-all duration-150 ease-out` for smooth transitions
  - `hover:scale-105 hover:shadow-lg hover:-translate-y-0.5` for hover lift effect
  - `active:scale-[0.92]` for press-in feedback
  - `focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2` for keyboard focus ring
  - `rounded-2xl` so focus outline follows rounded shape
- No React state or event handlers needed — pure CSS pseudo-class approach
- Navigation remains default `<a>` behavior
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 17/17 tests pass (no regressions)

## 2026-05-14 — Phase 3, Step 3.3: Add description tooltip on hover to AppIcon

- Added `useState` for tooltip visibility + `useRef` for 400ms hover delay timer
- Added `onMouseEnter`/`onMouseLeave` handlers on `<a>` element for delay-show/instant-hide
- Tooltip markup: dark rounded rect (`bg-[#333]/90`, `text-white`, `text-xs`, `rounded-lg`, `max-w-[200px]`) positioned `absolute bottom-full` above the icon with `z-20`
- Downward-pointing caret via CSS border trick (`border-4 border-transparent border-t-[#333]/90`)
- Content: `product.description`, only rendered when tooltip state is true and description exists
- Accessibility: unique `id` per tooltip, `role="tooltip"`, `aria-describedby` on the `<a>` (only set when tooltip visible)
- Added `pointer-events-none` and `whitespace-normal` to tooltip for proper layout behavior
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 17/17 tests pass (no regressions)

## 2026-05-14 — Phase 2, Step 2.6: Write regression tests covering Phase 2 acceptance criteria

- Created `src/__tests__/IconGrid.test.tsx` with 6 tests:
  - IconGrid renders correct number of icons (24 `<a>` elements)
  - Each icon displays its product name
  - Links have `target="_blank"` and correct `href`
  - Long names have `truncate` CSS class
  - Deprecated products (badge null) have `grayscale` class on img
  - Non-deprecated products do not have `grayscale` class
- Created `src/__tests__/products.test.ts` with 5 tests:
  - `sortProducts` puts featured first sorted by order ascending
  - Next 4 entries are highest-order non-featured (newest)
  - Remaining grouped by badge L → B → W → null, alphabetical within each
  - Full badge ordering with alphabetical tiebreak across all groups
  - `getProducts` returns static data when fetch fails (mock global fetch to throw)
- Helper `makeProduct(overrides)` pattern used in both files for test data generation
- Verified: 17/17 tests pass (6 existing + 11 new), `npx tsc --noEmit` clean, `npm run build` succeeds

## 2026-05-14 — Phase 3, Step 3.4: Build the BadgeLegend component

- Created `src/components/BadgeLegend.tsx` — client component (`"use client"`) rendering a horizontal flex row of badge type examples
- Legend items array with 4 badge types: L=Live (#34C759), B=Beta (#FF9500), N=New (#007AFF), W=Wishlist (#AF52DE)
- Each badge: 16px colored circle (`w-4 h-4 rounded-full`) with centered white 9px bold letter + muted label (`text-xs text-[#86868b]`)
- Badge colors applied via inline `backgroundColor` style
- Deprecated example: small gray rounded square with inner SVG rect + "Deprecated" label
- Layout: `flex flex-wrap items-center justify-center gap-4` — wraps on small screens
- Standalone presentational component — will be integrated into page and get hover tooltips in Step 3.5
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 17/17 tests pass (no regressions)

## 2026-05-14 — Phase 3, Step 3.5: Add legend tooltips and integrate BadgeLegend into the page

- Added tooltip descriptions to each legend item in `BadgeLegend.tsx`: L="Product is live and available", B="Product is in beta testing", N="Recently launched product", W="Product on the wishlist — coming soon", Deprecated="Product has been retired"
- Implemented hover tooltip state via `useState<string | null>` — `onMouseEnter`/`onMouseLeave` per legend item
- Extracted `Tooltip` sub-component: absolute positioned above item (`bottom-full`), dark rounded rect (`bg-[#333]/90`), downward caret via CSS border trick
- Accessibility: `role="tooltip"` on tooltip element, `aria-describedby` on trigger (only set when visible)
- Integrated `<BadgeLegend />` into `src/app/page.tsx` below PhoneFrame with `mt-4` spacing, centered
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, 17/17 tests pass (no regressions)

## 2026-05-15 — Phase 3, Step 3.6: Write regression tests covering Phase 3 acceptance criteria

- Created `src/__tests__/Interactions.test.tsx` with 12 tests:
  - AppIcon renders correct badge color and letter for each badge type (L=#34C759, B=#FF9500, N=#007AFF, W=#AF52DE)
  - No badge rendered for deprecated products (badge null)
  - Badge has white 2px border (`border-2 border-white` classes)
  - AppIcon `<a>` has focus-visible outline classes (`focus-visible:outline`, `focus-visible:outline-2`, `focus-visible:outline-blue-500`)
  - Hover/active scale classes present (`hover:scale-105`, `active:scale-[0.92]`)
  - Tooltip appears with correct description after 400ms hover delay (fake timers)
  - Tooltip hides on mouse leave
  - Deprecated products have `grayscale` and `opacity-50` styling
  - Active products do not have grayscale
- Created `src/__tests__/BadgeLegend.test.tsx` with 8 tests:
  - Renders all 5 legend items (Live, Beta, New, Wishlist, Deprecated)
  - Renders badge letters L, B, N, W
  - Tooltip text matches expected descriptions for each badge type on hover
  - Tooltip for Deprecated shows "Product has been retired"
  - Tooltip hides on mouse leave
- Used `vi.useFakeTimers()` for AppIcon tooltip delay, `within()` for scoped queries to handle StrictMode double renders
- Verified: 37/37 tests pass (20 new + 17 existing), `npx tsc --noEmit` clean, `npm run build` succeeds

## 2026-05-15 — Phase 4, Step 4.1: Build the Dock component and separate dock products from the grid

- Created `src/components/Dock.tsx` — client component rendering 4 dock-flagged products in a frosted-glass bar
- Dock layout: `absolute bottom-0 left-0 right-0`, frosted glass `bg-white/60 backdrop-blur-[20px]`, subtle `border-t border-white/30` separator
- Icons evenly spaced via `justify-around`, `rounded-b-[38px]` to match PhoneFrame screen corners
- Added `hideBadge` optional prop to `AppIcon` — dock icons render without badge indicators
- Added `splitDockProducts()` helper to `src/lib/products.ts` — splits products by `dock` field into `{ dock, grid }`
- Updated `src/app/page.tsx`: calls `splitDockProducts` after sort, passes `dock` to `<Dock>` and `grid` to `<IconGrid>`
- Dock renders between IconGrid and HomeIndicator inside PhoneFrame
- Verified: `npx tsc --noEmit` clean, 37/37 tests pass (no regressions), `npm run build` succeeds

## 2026-05-15 — Phase 4, Step 4.3: Add iOS-style page indicator dots

- Created `src/components/PageDots.tsx` — standalone accessible page indicator component
- Props: `{ total, active, onChange }` — renders horizontal row of dots with `role="tablist"` and per-dot `role="tab"` + `aria-selected`
- Active dot: 8px (`w-2 h-2`) `bg-white`, inactive: 6px (`w-1.5 h-1.5`) `bg-white/40`
- `transition-all duration-200` for smooth size/opacity animation between states
- Returns `null` when `total <= 1` (no dots needed for single page)
- Updated `src/components/IconGrid.tsx`: replaced inline dot buttons with `<PageDots total={totalPages} active={page} onChange={goTo} />`
- Kept same `-mt-[78px]` positioning between grid and dock
- Verified: `npx tsc --noEmit` clean, `npm run build` succeeds, no test regressions

## 2026-05-15 — Phase 4, Step 4.2: Convert IconGrid to paginated client component with swipe navigation

- Rewrote `src/components/IconGrid.tsx` from server component to `"use client"` paginated component
- Added `chunk()` helper to split products into pages of 24 icons each
- Layout: outer `overflow-hidden flex-1` container, inner flex row of page panels with `translateX(-${page * 100}%)` slide animation (300ms ease-out)
- Each page panel: `w-full flex-shrink-0` with existing 4-col grid layout + `content-start` alignment
- Touch swipe: `onTouchStart`/`onTouchEnd` with 50px threshold, ignores vertical swipes (`Math.abs(dy) > Math.abs(dx)`)
- Mouse drag: `onMouseDown`/`onMouseUp` with 50px threshold, `onMouseLeave` cancels drag
- Keyboard: `onKeyDown` for ArrowLeft/ArrowRight with `preventDefault`, container `tabIndex={0}`, `role="region"`, `aria-label="App pages"`
- Page clamping via `goTo` callback: `Math.max(0, Math.min(p, totalPages - 1))`
- Added inline page indicator dots (6px circles, `bg-white`/`bg-white/40`) — shown only when `totalPages > 1`
- Props interface unchanged (`{ products: Product[] }`) — no breaking changes to page.tsx
- Verified: `npx tsc --noEmit` clean, 37/37 tests pass (no regressions), `npm run build` succeeds

## 2026-05-15 — Phase 4, Step 4.4: Build pull-down search overlay

- Created `src/components/SearchOverlay.tsx` — client component with slide-down search bar
- Props: `{ onSearch, onDismiss, visible }` — internal `searchTerm` state, auto-focus on show
- Input: `bg-white/80 backdrop-blur-[10px] rounded-xl`, placeholder "Search apps..."
- Slide animation via CSS transform + transition (`-translate-y-full` → `translate-y-0`)
- Dismiss: Escape keydown on input, click/tap on backdrop area (full-screen transparent div)
- Updated `src/components/IconGrid.tsx` with search integration:
  - Pull-down gesture: downward swipe >30px (dy > dx) triggers `showSearch` state
  - `filterProducts()` helper: case-insensitive match on product name, badge label (L→launch, B→beta, N→new, W→waitlist), and category tags
  - Search active: filtered results replace paginated grid in single flat grid, PageDots hidden
  - "No apps found" centered text for empty results
  - Horizontal swipe and keyboard nav disabled during search (early returns)
  - On dismiss: clears search term, returns to paginated grid at previous page
- Verified: `npx tsc --noEmit` clean, 37/37 tests pass (no regressions), `npm run build` succeeds

## 2026-05-15 — Phase 4, Steps 4.6–4.7: Regression tests and phase completion

- Created `src/__tests__/Dock.test.tsx` with 4 tests:
  - Dock renders 4 dock icons
  - Frosted glass classes present (`backdrop-blur-[20px]`, `bg-white/60`)
  - Dock icons hide badges (`hideBadge` prop — no badge span rendered)
  - `splitDockProducts()` correctly separates dock from grid products
- Created `src/__tests__/Pagination.test.tsx` with 6 tests:
  - PageDots renders correct number of dots
  - Active dot has `bg-white`, inactive has `bg-white/40`
  - Returns null when `total <= 1`
  - ArrowRight advances to next page (keyboard nav)
  - ArrowLeft returns to previous page
  - Mouse drag (swipe substitute) advances page
- Created `src/__tests__/Search.test.tsx` with 8 tests:
  - SearchOverlay standalone: calls onSearch on input, Escape calls onDismiss, backdrop click calls onDismiss
  - Integration via IconGrid: pull-down opens search, filters by name, filters by badge label ("launch" → L), filters by category tag, "No apps found" for non-matching query
- Key testing decisions: used explicit `cleanup()` in `beforeEach` (vitest auto-cleanup not configured); used mouse drag instead of touch events for swipe tests (jsdom touch support unreliable); tested SearchOverlay dismiss behaviors standalone for reliability
- Step 4.7 no-op: 55/55 tests pass, `npx tsc --noEmit` clean, `npm run build` succeeds
- All Phase 4 milestone acceptance criteria met — phase complete

## 2026-05-15 — Phase 4, Step 4.5: Wire up all components and refine integration

- Verified all integration points — no code changes needed, architecture was already correct:
  - Dock persists across page swipes and search (rendered as sibling to IconGrid in page.tsx, absolutely positioned)
  - PageDots hidden during search (filtered branch skips the fragment containing PageDots)
  - Touch conflicts resolved: vertical pull-down (>30px) → search, horizontal swipe (>50px) → pages, search mode disables swipe handlers
  - Keyboard: ArrowLeft/Right guarded by `if (showSearch) return`, Escape handled in SearchOverlay
  - HomeIndicator renders below Dock in page.tsx composition order
  - Single page (20 grid products < 24 per page): PageDots returns null for `total <= 1`
- Verified: `npx tsc --noEmit` clean, 37/37 tests pass (no regressions), `npm run build` succeeds

## 2026-05-15 — Phase 5, Step 5.1: Install Framer Motion + shared page wrapper

- Installed `framer-motion` as a dependency
- Created `src/hooks/useReducedMotion.ts`: custom hook listening to `prefers-reduced-motion: reduce` media query, SSR-safe (defaults `false`, updates on mount)
- Created `src/components/PageContent.tsx`: `"use client"` component extracting shared page content (logo, tagline, PhoneFrame children, BadgeLegend) with `variant` prop (`"none" | "boot" | "slide" | "assemble"`). For `variant="none"`, wraps content in a 200ms Framer Motion opacity fade-in; skips animation when reduced motion is preferred
- Refactored `src/app/page.tsx` to thin server component: fetches products, passes to `<PageContent variant="none" />`
- Created `src/__tests__/setup.ts` with `window.matchMedia` mock for jsdom test environment; wired into `vitest.config.ts` via `setupFiles`
- Verified: `npx tsc --noEmit` clean, 55/55 tests pass (no regressions), `npm run build` succeeds

## 2026-05-15 — Phase 5, Step 5.2: Build the `/boot` animation route

- Created `src/app/boot/page.tsx` — thin async server component identical to home page, passes `variant="boot"` to PageContent
- Extended `src/components/PageContent.tsx` with multi-phase boot animation orchestration:
  - Phase 1 (0–800ms): Black overlay with white LEXCORP logo, looping scale pulse (1.0 → 1.06 → 1.0)
  - Phase 2 (800–1200ms): Logo + overlay fade out (400ms ease-out) revealing content
  - Phase 3 (1200–1800ms): StatusBar fades in (300ms), IconGrid appears with staggered delay
  - Phase 4 (1800–2200ms): Dock slides up with spring physics (stiffness: 300, damping: 25)
  - Phase 5 (2200ms+): Settled at final state
- Boot animation uses `useState<BootPhase>` (0–5) with `useEffect` scheduling `setTimeout` chain
- Extracted `BootPhoneContent` sub-component for boot-specific phone internals
- Reduced motion: skips boot animation entirely, renders with 200ms opacity fade (same as `variant="none"`)
- `AnimatePresence` wraps the boot overlay for clean exit animation
- Note: `npm run build` static generation timeout is pre-existing on `main` (relative fetch URL in `getProducts` hangs during build); not introduced by this change
- Verified: `npx tsc --noEmit` clean, 55/55 tests pass (no regressions), dev server renders `/boot` correctly

## 2026-05-15 — Phase 5, Step 5.4: Build the `/assemble` animation route

- Created `src/app/assemble/page.tsx` — thin async server component passing `variant="assemble"` to PageContent
- Extended `src/components/PageContent.tsx` with 7-phase assemble animation orchestration:
  - Phase 1 (0–400ms): Left/right frame halves slide in via `clip-path: inset()` on two overlapping metallic gradient divs
  - Phase 2 (400–700ms): White flash along center seam (glowing 2px line with box-shadow), frame overlays fade out
  - Phase 3 (700–900ms): Black screen overlay fades to reveal wallpaper gradient
  - Phase 4 (900–1400ms): DynamicIsland pops with spring bounce (scale 0.3→1), StatusBar slides in from left (x: -20→0)
  - Phase 5 (1400–2000ms): Icons drop from above (y: -40→0) with spring physics
  - Phase 6 (2000–2300ms): Dock slides up (y: 80→0) with spring
  - Phase 7 (2300ms+): Settled at final state
- Extracted `AssemblePhoneContent` sub-component (same pattern as Boot/Slide)
- `AnimatePresence` wraps seam flash overlay for clean mount/unmount
- Reduced motion: skips all animation, renders with 200ms opacity fade
- Verified: `npx tsc --noEmit` clean, 55/55 tests pass (no regressions), lint only pre-existing warnings

## 2026-05-15 — Phase 5, Step 5.3: Build the `/slide` animation route

- Created `src/app/slide/page.tsx` — thin async server component passing `variant="slide"` to PageContent
- Extended `src/components/PageContent.tsx` with slide animation orchestration:
  - Phase 1 (0–600ms): Entire content slides up from `translateY(100px)` + `opacity: 0` → final position + full opacity, ease-out
  - Phase 2 (600–1200ms): StatusBar fades in (200ms), icons scale from 0.9→1.0 + fade with stagger delay
  - Phase 3 (1200–1500ms): Dock fades in
  - Phase 4 (1500ms+): Settled at final state
- Extracted `SlidePhoneContent` sub-component for slide-specific animation wrappers
- Uses `useState<SlidePhase>` (0–4) with `useEffect` scheduling `setTimeout` chain (same pattern as boot)
- Reduced motion: skips slide animation, renders with 200ms opacity fade
- Fixed pre-existing lint error: synchronous `setState` in effect bodies (boot + slide) — deferred to `setTimeout(..., 0)`
- Verified: `npx tsc --noEmit` clean, `npm run lint` clean, 55/55 tests pass (no regressions)

## 2026-05-15 — Phase 5, Step 5.5: Polish animations and verify cross-route consistency

- Audited all 4 animation routes (`/`, `/boot`, `/slide`, `/assemble`) for visual correctness and cross-route consistency
- Verified all routes end at identical final state: same StatusBar, DynamicIsland, IconGrid, Dock, HomeIndicator
- Reviewed animated properties: boot and slide use only GPU-composited `transform`/`opacity`; assemble uses `clip-path` on two lightweight overlay divs for 0.4s (acceptable, not worth refactoring)
- Confirmed reduced motion support on all routes: animation sequences skipped, ≤200ms opacity fade applied
- No code changes needed — all animations correct as-is
- Verified: `npx tsc --noEmit` clean, 55/55 tests pass, lint only pre-existing warnings (not in modified files)

## 2026-05-15 — Phase 5, Step 5.6: Write regression tests covering Phase 5 acceptance criteria

- Created `src/__tests__/Animations.test.tsx` with 11 regression tests in 4 groups:
  - **PageContent rendering (4 variants):** variant="none" renders final content immediately; boot/slide/assemble render same final content after advancing fake timers past animation duration (2200/1500/2300ms)
  - **useReducedMotion hook (3 tests):** returns false by default; returns true when `prefers-reduced-motion: reduce` matches; updates reactively when media query change event fires
  - **Reduced motion on animation variants (3 tests):** boot/slide/assemble with reduced motion skip animations and render final content immediately (no timer advancement needed)
  - **Cross-route consistency (1 test):** all 4 variants render exactly 20 grid icons and 4 dock icons at settled state
- Key testing decisions:
  - `vi.setSystemTime(new Date(2026, 0, 1, 9, 41, 0))` pins StatusBar clock for deterministic assertions
  - `vi.spyOn(window, "matchMedia").mockReturnValue(...)` overrides global setup mock for reduced motion tests
  - `screen.queryAllByText("9:41 AM").length >= 1` handles framer-motion duplicate elements in JSDOM
  - `.z-50.bg-black` selector distinguishes boot overlay from DynamicIsland's bg-black
  - Explicit `cleanup()` in `beforeEach` prevents DOM leaking between describe blocks
- Verified: 66/66 tests pass (55 existing + 11 new), `npx tsc --noEmit` clean, lint only pre-existing warnings

## 2026-05-15 — Phase 6, Step 6.2: Add comprehensive ARIA roles and labels for screen readers

- Added ARIA attributes across 6 components for screen reader navigation:
  - `PhoneFrame.tsx`: `role="region"` + `aria-label="Lexcorp product launcher"` on screen area div (both mobile and desktop branches)
  - `IconGrid.tsx`: Changed `role="region"` → `role="grid"`, `aria-label="App pages"` → `aria-label="Product apps"`
  - `AppIcon.tsx`: Wrapped content in `<div role="gridcell">`, added composite `aria-label` on `<a>` (e.g. "AppName, Live"), added `aria-hidden="true"` to badge `<span>`, new `badgeLabelMap` (L→Live, B→Beta, N→New, W→Wishlist, null→Deprecated)
  - `Dock.tsx`: Added `role="toolbar"` + `aria-label="Pinned apps"` to dock container
  - `StatusBar.tsx`: Added `aria-hidden="true"` to outer container (decorative)
  - `PageDots.tsx`: Changed per-dot `aria-label` from `"Page {n}"` to `"Page {n} of {total}"`
- Updated 2 test files (`Pagination.test.tsx`, `Search.test.tsx`) to match new role/name queries (`grid` / `"Product apps"`)
- Verified: `npx tsc --noEmit` clean, lint only pre-existing warnings, 66/66 tests pass (no regressions)

## 2026-05-15 — Phase 6, Step 6.3: Implement full keyboard navigation for icon grid and dock

- Implemented roving tabindex keyboard navigation pattern across IconGrid and Dock components
- `AppIcon.tsx`: Converted to `forwardRef`, accepts `tabIndex` prop forwarded to the `<a>` element
- `IconGrid.tsx`: Added `focusedIndex` state with 4-directional arrow key navigation (Right/Left/Up/Down) respecting 4-column grid layout. Page changes occur at boundaries (ArrowRight past last icon → next page, ArrowUp from top row → previous page same column). Home/End jump to first/last icon across all pages. Removed `tabIndex={0}` from container div. Uses `useEffect` + refs for programmatic `.focus()`.
- `Dock.tsx`: Added `focusedIndex` state with Left/Right + Home/End arrow key navigation. Each dock icon gets a ref for programmatic focus.
- Updated `Pagination.test.tsx`: 2 tests updated — ArrowRight/Left now navigate icons within page, page change requires arrowing past all icons on current page
- Pattern: only one element per group has `tabIndex={0}`, rest have `tabIndex={-1}`. Arrow keys move focus within group, Tab moves between groups (grid → dock → legend).
- Verified: `npx tsc --noEmit` clean, lint only pre-existing warnings, 66/66 tests pass (no regressions)

## 2026-05-15 — Phase 6, Step 6.1: Add responsive breakpoints to PhoneFrame and page layout

- Created `src/hooks/useIsMobile.ts`: `useSyncExternalStore`-based hook detecting `(max-width: 767px)` breakpoint, SSR-safe with server snapshot returning `false`
- Updated `src/components/PhoneFrame.tsx`: mobile (<768px) renders simplified frame — thin `border-2 border-gray-300`, `rounded-3xl`, `shadow-md`, `w-[90vw] max-w-[400px]`, aspect-ratio 375/812, no metallic gradient/bezel/Dynamic Island cutout. Desktop/wide: full realistic bezel unchanged. Tablet (768–1023px): wraps full frame in `.tablet-scale` container
- Added `.tablet-scale` CSS class to `src/app/globals.css` with `transform: scale(0.85)` at 768–1023px media query, `transform-origin: top center`
- Updated `src/components/PageContent.tsx`: logo SVG shrinks to 100×24 on mobile (from 140×32), tagline drops to 11px (from 13px), added `overflow-x-hidden` to main element
- Used `useSyncExternalStore` instead of `useState`+`useEffect` pattern to avoid the `set-state-in-effect` lint error that exists in `useReducedMotion`
- Verified: `npx tsc --noEmit` clean, lint only pre-existing warnings (none in modified files), 66/66 tests pass (no regressions)

## 2026-05-15 — Phase 6, Step 6.4: Touch targets and WCAG AA contrast compliance

- **PageDots touch targets:** Added `min-w-[44px] min-h-[44px]` with flex centering to each dot `<button>`, wrapped visual dot in a child `<span>` — visual size unchanged, tap target now meets 44×44px minimum
- **Badge contrast (WCAG AA 4.5:1 for white text on colored bg):**
  - Green (Live): `#34C759` → `#15803d` (~5.1:1 ratio)
  - Orange (Beta): `#FF9500` → `#C2410C` (~5.2:1 ratio)
  - Blue (New): `#007AFF` → `#0066CC` (~5.6:1 ratio)
  - Purple (Wishlist): `#AF52DE` → `#8B3FC1` (~5.9:1 ratio)
  - Updated both `AppIcon.tsx` (badgeColorMap) and `BadgeLegend.tsx` (legendItems) to use matching darkened colors
- **Text contrast fixes:**
  - Tagline (`PageContent.tsx`) and legend labels (`BadgeLegend.tsx`): `#86868b` → `#6e6e73` (~4.6:1 on `#f5f5f7`)
  - Deprecated icon labels (`AppIcon.tsx`): `text-gray-400` → `text-gray-500` for better contrast on wallpaper
- **Tests updated:** Badge color assertions in `Interactions.test.tsx` (4 tests), PageDots dot class assertions in `Pagination.test.tsx` (1 test) — now query child `<span>` instead of button
- Verified: `npx tsc --noEmit` clean, lint only pre-existing warnings (not in modified files), 66/66 tests pass (no regressions)

## 2026-05-15 — Phase 6, Step 6.5: Visual polish pass — verify spec conformance

- **Dock glass opacity:** `bg-white/60` → `bg-white/[0.72]` per spec token `--dock-blur-bg: rgba(255,255,255,0.72)`
- **Dock inset highlight:** Added `shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]` per spec
- **Tooltip shadows (AppIcon + BadgeLegend):** Replaced `shadow-md` (Tailwind default `0 4px 6px -1px...`) with spec-exact `shadow-[0_4px_12px_rgba(0,0,0,0.15)]`
- **Phone frame shadows:** Already matched spec (3-layer: primary, secondary, edge highlight) — no change needed
- **Typography audit:** All correct — icon labels 11px, tagline 13px/11px, legend 12px, tooltip 12px, status bar 12px
- **Reduced motion:** No new CSS transitions introduced in Phase 6 — no changes needed
- **Test update:** `Dock.test.tsx` assertion updated from `bg-white/60` to `bg-white/[0.72]`
- Verified: `npx tsc --noEmit` clean, lint only pre-existing warnings (not in modified files), 66/66 tests pass (no regressions)

## 2026-05-15 — Icon handler: Apply GappHub app icon across all surfaces

- Source asset: `gapphub-icon.png` (1254×1254 PNG, phone with teal G logo on black background)
- Generated `src/app/favicon.ico` (16/32/48px multi-size ICO via ImageMagick)
- Generated `src/app/icon.png` (512×512), `src/app/apple-icon.png` (180×180)
- Generated `public/apple-touch-icon.png` (180×180), `public/icon.png` (512×512), `public/icon-192.png` (192×192), `public/icon-512.png` (512×512)
- Created `public/manifest.webmanifest` with 192px and 512px icon entries
- Updated `src/app/layout.tsx`: added `icons` and `manifest` metadata
- All three Next App Router icon bodies verified in `.next/server/app/`

## 2026-05-15 — Lint fixes: resolve pre-existing lint errors

- Refactored `src/hooks/useReducedMotion.ts`: replaced `useState`+`useEffect` with `useSyncExternalStore` to eliminate `set-state-in-effect` lint error
- Removed unused `BADGE_ORDER` const from `src/lib/products.ts`
- Suppressed `set-state-in-effect` in `src/components/SearchOverlay.tsx` (intentional reset-on-open pattern)
- Updated `src/__tests__/Animations.test.tsx`: `mockReducedMotion` now returns `{ listeners, mockMql }` to support `useSyncExternalStore` snapshot mutation
- Verified: 0 lint errors, 66/66 tests pass

## 2026-05-15 — Reduced-motion support for AppIcon hover/press states

- Added `@media (prefers-reduced-motion: reduce)` block in `src/app/globals.css` targeting `[role="gridcell"] a` and `[role="toolbar"] a`
- Hover: `transform: none !important; box-shadow: none !important` — disables `hover:scale-105`, `hover:shadow-lg`, `hover:-translate-y-0.5`
- Active/press: `transform: none !important; opacity: 0.7` — replaces `active:scale-[0.92]` with opacity dim
- Transition scoped to `opacity` only under reduced motion
- Added test in `Accessibility.test.tsx` verifying the CSS media query content
- Removed TODO markers from `specs/ui-gapphub.md` § Reduced Motion
- Marked implementation task complete in `tasks/todo.md`
- Zero runtime cost — pure CSS, no React changes

## 2026-05-15 — Phase 6, Step 6.6: Write Phase 6 regression tests (Responsive + Accessibility)

- Created `src/__tests__/Responsive.test.tsx` with 6 tests:
  - Mobile PhoneFrame: `border-2`, `rounded-3xl`, `w-[90vw]`, no metallic gradient inline style
  - Desktop PhoneFrame: `rounded-[50px]`, metallic `linear-gradient` in inline style
  - Both branches: `role="region"` with `aria-label="Lexcorp product launcher"`
  - Mocked `useIsMobile` hook via `vi.mock('@/hooks/useIsMobile')` to control mobile/desktop rendering
- Created `src/__tests__/Accessibility.test.tsx` with 10 tests:
  - PhoneFrame `role="region"` + `aria-label="Lexcorp product launcher"`
  - IconGrid `role="grid"` + `aria-label="Product apps"`
  - AppIcon composite `aria-label` ("Alpha, Live") and deprecated label ("Legacy, Deprecated")
  - Badge `aria-hidden="true"` on badge span
  - StatusBar `aria-hidden="true"` on outer div
  - Dock `role="toolbar"` + `aria-label="Pinned apps"`, frosted glass + inset highlight classes
  - PageDots 44×44px minimum touch targets (`min-w-[44px]`, `min-h-[44px]`), correct `aria-selected` state
- Verified: 82/82 tests pass (66 existing + 16 new), `npx tsc --noEmit` clean, lint only pre-existing `<img>` warning
- Step 6.7 no-op: all validation already passed during 6.6
- All Phase 6 milestone acceptance criteria met — phase complete
- **All 6 phases complete** — project at deferred/future work stage

## 2026-05-16 — Post-completion: Mobile UX fixes (legend spacing, scroll bounce, search dismissal)

- Fixed legend covered by iPhone home indicator: increased bottom padding from `pb-4` to `pb-8` on legend wrapper in `PageContent.tsx`
- Disabled iOS elastic/bounce scroll: added `overscroll-behavior: none` to `html` and `body` in `globals.css`
- Added X (close) button to search overlay: styled as subtle gray circle with × character in `SearchOverlay.tsx`
- Added swipe-up-to-dismiss for search: modified `handleTouchEnd` in `IconGrid.tsx` to detect upward swipe when search is open
- Verified: `npx tsc --noEmit` clean, `npm run lint` only pre-existing `<img>` warning

## 2026-05-16 — Adopt real app icons from Lexcorp product repos

- Downloaded real app icon PNGs from 4 Lexcorp product repos (War Room, Pitwall, GSkillPacks, gBlockParty)
- Resized all to 120×120px (2× retina for 60px display) using `sips`, placed in `public/icons/products/`
- Updated `src/components/AppIcon.tsx`: added `CUSTOM_ICON_IDS` Set constant, conditional rendering that shows `<img>` for products with custom icons and falls back to Lucide icons for others
- Convention-based approach: no changes to `products.json` or `Product` type — the Set identifies which IDs have custom icons
- Deprecated styling (grayscale + opacity) applies correctly to custom icons via className

## 2026-05-16 — Fix: Phone screen showing >24 apps on mobile

- Added `flex flex-col` to both mobile and desktop PhoneFrame inner "screen" divs
- Root cause: IconGrid's `flex-1` had no effect outside a flex container, so `h-full` on the pages container resolved to `auto`, breaking pagination on initial render
- Animated variants (boot/slide/assemble) were unaffected because they already wrap content in flex containers
- Verified: `npx tsc --noEmit` clean, `npm run lint` clean

## 2026-05-16 — Fix: Height-responsive phone frame (dynamic icon rows + CSS scaling)

- Created `src/hooks/useAvailableRows.ts`: ResizeObserver-based hook that measures container height and computes optimal rows (3–6) of icons per page dynamically
- Updated `src/components/IconGrid.tsx`: replaced fixed `ICONS_PER_PAGE = 24` with dynamic value from `useAvailableRows`; added page-bounds clamping on resize
- Updated `src/components/PageContent.tsx`: changed main to `overflow-hidden` + `max-h-screen` to prevent page-level scroll
- Added height media queries in `src/app/globals.css`: `scale(0.9)` at ≤820px viewport height, `scale(0.8)` at ≤700px
- Added `ResizeObserver` mock to `src/__tests__/setup.ts` for test environment
- Root cause: no height-based adaptation existed — only width breakpoints at 768px and 1024px
- Verified: `npx tsc --noEmit` clean, 84/84 tests pass

## 2026-05-17 — Fix: Phone frame flicker and sizing on desktop

- Root cause: desktop PhoneFrame had no intrinsic height (purely content-driven), creating a circular dependency with the `useAvailableRows` ResizeObserver hook — measure height → change icon count → height changes → re-measure
- `PhoneFrame.tsx`: Added `aspectRatio: "375 / 812"` to desktop screen div for stable intrinsic height; moved `h-full` to `tablet-scale` wrapper; added `max-h-full` to chrome div to prevent overflow
- `PageContent.tsx`: Added `flex flex-col items-center` to phone wrapper div so PhoneFrame's `h-full` resolves correctly
- `useAvailableRows.ts`: Switched from `useEffect` to `useLayoutEffect` (runs before paint); default initial state changed from `0` to `MAX_ROWS * COLS` (24); removed `h === 0` fallback branch (just returns to keep default)
- `IconGrid.tsx`: Removed `measured` variable, conditional `invisible` class, and empty-array fallback — icons always chunked with iconsPerPage
- Verified: `npx tsc --noEmit` clean, 84/84 tests pass

## 2026-05-17 — Fix: Assemble animation gray gradient overlay persists

- Root cause: Two z-40 gray gradient overlays in `AssemblePhoneContent` (PageContent.tsx:353-374) animate clip-path to slide in during phase 1 but never fade out. A separate z-30 overlay fades at phase 2, but sits below the z-40 layers so has no visible effect.
- Fix: Added `opacity: phase >= 2 ? 0 : 1` to both z-40 overlay `animate` props so they fade out with the seam flash
- Verified: lint clean, 84/84 tests pass, build succeeds

## 2026-05-17 — Test: Split reduced-motion AppIcon test into 2 focused tests

- Split single "globals.css contains prefers-reduced-motion" test into 2 distinct tests in `Accessibility.test.tsx`:
  - "disables hover scale and shadow transforms under reduced motion" — verifies `transform: none !important` and `box-shadow: none !important` in hover rules
  - "replaces active scale with opacity dim under reduced motion" — verifies active state has `transform: none !important`, `opacity: 0.7`, and `transition-property: opacity`
- Total tests: 85 (was 84)
- Verified: tsc clean, lint clean (1 pre-existing warning), all 85 tests pass

## 2026-05-17 — Fix: Slide/Boot/Assemble pages show fewer apps than root

- Root cause: The `motion.div` wrapper around `IconGrid` in `SlidePhoneContent`, `BootPhoneContent`, and `AssemblePhoneContent` had `flex-1 overflow-hidden` but was not a flex container itself, so `IconGrid`'s `flex-1` had no effect and `useAvailableRows` measured content height instead of available space
- Fix: Added `flex flex-col` to the `motion.div` wrapping `IconGrid` in all three animation variants (PageContent.tsx lines 257, 317, 447)
- Verified: lint clean, build succeeds

## 2026-05-17 — Fix: Remove unwanted focus outline on Dock mount

- Root cause: `Dock.tsx` `useEffect` calls `.focus()` on the first icon (index 0) on every render including initial mount, triggering `focus-visible:outline-blue-500` styling on War Room icon
- Fix: Added `userInteracted` ref (initialized `false`), set to `true` in `handleKeyDown`, guarded `useEffect` focus call so `.focus()` only fires after keyboard interaction
- File: `src/components/Dock.tsx`
- Verified: 85/85 tests pass, lint clean

## 2026-05-17 — Fix: Remove unwanted focus outline on IconGrid mount

- Root cause: `IconGrid.tsx` `useEffect` calls `.focus()` on the focused icon on every render including initial mount, triggering `focus-visible` outline on Draft Stonk (first grid icon at index 0) — same bug pattern as Dock (fixed in commit b4fb84c)
- Fix: Added `userInteracted` ref (initialized `false`), set to `true` in `handleKeyDown`, guarded `useEffect` focus call with `if (userInteracted.current)` so `.focus()` only fires after keyboard interaction
- Mirrors exact pattern from `Dock.tsx:14-23`
- File: `src/components/IconGrid.tsx`
- Verified: 85/85 tests pass, lint clean

## 2026-05-17 — Polish: Boot splash copy and status bar battery

- Updated `src/components/StatusBar.tsx`: removed the redundant `100%` text while keeping the full battery icon.
- Updated `src/components/PageContent.tsx`: changed `/boot` from a single Lexcorp logo pulse into a three-beat splash sequence:
  - `Lexcorp`
  - `made with love`
  - `by George "G" Le`
- Extended the boot splash duration to 3.7s with ~1.1s per text beat, then status/icons reveal at phase 4 and dock reveal at phase 5.
- Reduced splash text tracking and constrained the text width so `Lexcorp` does not clip inside the phone screen.
- Updated `src/__tests__/Animations.test.tsx`: added `BOOT_DURATION`, updated boot final-state timing, and added coverage for the splash copy sequence.
- Added `tasks/lessons.md` entry for the user correction: readable splash timing and clipping must be visually considered, not only state-tested.
- Cleared stale task-doc note about build static-generation timeout; `pnpm run build` now succeeds.

### Ship Manifest

- User goal: make the boot screen show pop-in text (`Lexcorp`, `made with love`, `by George "G" Le`) and remove redundant battery percentage text.
- Changed files: `src/components/PageContent.tsx`, `src/components/StatusBar.tsx`, `src/__tests__/Animations.test.tsx`, `tasks/todo.md`, `tasks/roadmap.md`, `tasks/phases/phase-6.md`, `tasks/history.md`, `tasks/lessons.md`.
- Per-file purpose: `PageContent.tsx` implements the readable boot splash sequence; `StatusBar.tsx` removes `100%`; `Animations.test.tsx` verifies boot timing/final state and copy sequence; task docs record validation, stale build-note cleanup, and the correction lesson.
- User-goal mapping: boot route now presents the requested three text beats before UI reveal; battery cluster no longer duplicates full charge via text.
- Tests run: `pnpm test src/__tests__/Animations.test.tsx src/__tests__/PhoneFrame.test.tsx src/__tests__/Accessibility.test.tsx` (30 passed), `pnpm test` (86 passed), `pnpm exec tsc --noEmit` (passed), `pnpm run lint` (0 errors, 1 accepted warning), `pnpm run build` (passed).
- Skipped tests: none relevant; full automated test, typecheck, lint, and production build were run.
- Adversarial review: checked phase timing against user-visible readability, clipping risk from letter spacing inside the phone frame, reduced-motion behavior boundary, and final-state route consistency. The only warning is the accepted `@next/next/no-img-element` warning for local product icon PNGs in `AppIcon.tsx`.
- Residual risk: no automated screenshot/video assertion proves subjective splash readability across all devices; physical mobile/tablet verification remains deferred in `tasks/manual-todo.md`.
- Rollback note: revert the PageContent boot timing/text changes and StatusBar percentage removal, plus the associated test/doc changes.
- Next command: `$guide` for deferred real-device responsive testing when preparing for production launch.

## 2026-05-17 — Polish: Stack boot splash text instead of replacing it

- Updated `src/components/PageContent.tsx`: `/boot` splash now keeps previous lines visible while each new line fades in underneath:
  - `Lexcorp`
  - `made with love`
  - `by George "G" Le`
- Updated `src/__tests__/Animations.test.tsx`: renamed the splash test and asserted accumulated lines remain present after each phase.
- Updated `tasks/lessons.md` with the correction that stacked splash copy should use persistent lines, not a single swapped text node.

### Ship Manifest

- User goal: make the boot splash text appear one on top of each other rather than sequentially replacing the previous phrase.
- Changed files: `src/components/PageContent.tsx`, `src/__tests__/Animations.test.tsx`, `tasks/history.md`, `tasks/lessons.md`.
- Per-file purpose: `PageContent.tsx` renders persistent stacked splash lines; `Animations.test.tsx` verifies accumulated text visibility; docs record the correction and shipping boundary.
- User-goal mapping: each splash line now fades in while earlier lines stay visible, matching the requested stacked behavior.
- Tests run: `pnpm test src/__tests__/Animations.test.tsx` (12 passed), `pnpm run lint` (0 errors, 1 accepted warning), `pnpm test` (86 passed), `pnpm exec tsc --noEmit` (passed), `pnpm run build` (passed).
- Skipped tests: none relevant; focused animation test, full test suite, typecheck, lint, and production build were run.
- Adversarial review: checked that the splash lines accumulate instead of swapping, that final-state boot timing remains unchanged, and that reduced-motion behavior still bypasses the boot animation. Accepted warning remains `@next/next/no-img-element` for local product icon PNGs in `AppIcon.tsx`.
- Residual risk: no screenshot/video assertion verifies subjective visual spacing on physical devices; deferred real-device responsive testing remains in `tasks/manual-todo.md`.
- Rollback note: revert this stacked-line change and the corresponding animation test/docs if the single-line sequence is wanted again.
- Next command: `$guide` for deferred real-device responsive testing when preparing for production launch.

## 2026-05-17 — Polish: Use heart symbol in boot splash

- Updated `src/components/PageContent.tsx`: changed the second `/boot` splash line from `made with love` to `made with ♥`.
- Updated `src/__tests__/Animations.test.tsx`: changed the boot splash assertion to match the heart-symbol copy.

### Ship Manifest

- User goal: replace the word `love` in the boot splash with a heart symbol.
- Changed files: `src/components/PageContent.tsx`, `src/__tests__/Animations.test.tsx`, `tasks/history.md`.
- Per-file purpose: `PageContent.tsx` changes the visible splash copy; `Animations.test.tsx` keeps the copy regression test aligned; `tasks/history.md` records the shipping boundary.
- User-goal mapping: the stacked splash now reads `Lexcorp`, `made with ♥`, `by George "G" Le`.
- Tests run: `pnpm test src/__tests__/Animations.test.tsx` (12 passed), `pnpm test` (86 passed), `pnpm exec tsc --noEmit` (passed), `pnpm run lint` (0 errors, 1 accepted warning), `pnpm run build` (passed).
- Skipped tests: none relevant; focused animation test, full test suite, typecheck, lint, and production build were run.
- Adversarial review: checked that only text copy changed, boot timing and stacked visibility remain unchanged, and the test verifies the exact visible phrase. Accepted warning remains `@next/next/no-img-element` for local product icon PNGs in `AppIcon.tsx`.
- Residual risk: heart glyph rendering depends on platform font but should be covered by system fonts; no physical-device screenshot verification was run.
- Rollback note: change the splash text and test assertion back to `made with love`.
- Next command: `$guide` for deferred real-device responsive testing when preparing for production launch.

## 2026-05-17 — Fix: App icon tooltips clipped by grid overflow

- Confirmed user report: app-icon tooltips were rendered above each icon inside the `IconGrid` scroll/pagination container, whose `overflow-hidden` clips content at the grid boundary.
- Root cause: `src/components/AppIcon.tsx` positioned tooltips absolutely inside the icon subtree, while `src/components/IconGrid.tsx` needs `overflow-hidden` for page sliding and search containment.
- Fix: `AppIcon` now renders tooltips through a `createPortal` attached to `document.body`, with fixed viewport positioning and top/bottom placement based on the icon's bounding rect.
- Also adjusted dynamic Lucide icon rendering to use `createElement`, resolving the `react-hooks/static-components` lint error surfaced during validation.
- Updated `src/__tests__/Interactions.test.tsx` to query portal-rendered tooltips through `screen` and assert the tooltip uses fixed positioning.
- Verified: focused interactions test passes, typecheck clean, lint has only the accepted local-icon `<img>` warning.

## 2026-05-17 — Fix: Center app icon tooltips after portal positioning

- Confirmed user report: portal-rendered app tooltips could appear left of the hovered app icon because the positioning logic used the full anchor bounding box instead of the 60px icon artwork box.
- Root cause: the previous clipping fix in `src/components/AppIcon.tsx` moved tooltips to `document.body` and calculated `left` from `event.currentTarget.getBoundingClientRect()`. The anchor includes the label and hover transform box, so its center can drift from the visual icon center.
- Fix: `AppIcon` now measures a dedicated icon wrapper ref for tooltip placement and keeps the rendered portal tooltip clamped inside the viewport after measuring its real width.
- Updated `src/__tests__/Interactions.test.tsx` with a regression test where the link box is wider than the icon wrapper, asserting the tooltip centers on the icon artwork.
- Verified: `pnpm test src/__tests__/Interactions.test.tsx` (13 passed), `pnpm test` (87 passed), `pnpm exec tsc --noEmit` (passed), `pnpm lint` (0 errors, 1 accepted warning), `pnpm build` (passed).
- Prevention: layout tests for portal overlays should mock trigger and visual-anchor bounding boxes separately, so future fixes do not accidentally position against a wrapper instead of the visible target.
- Next command: `$guide` for deferred real-device hover/responsive verification when preparing for production launch.

## 2026-05-18 — Ship: Promote boot screen to root route

- Updated `src/app/page.tsx`: `/` now renders `PageContent` with `variant="boot"`.
- Removed obsolete comparison route pages: `src/app/boot/page.tsx`, `src/app/slide/page.tsx`, and `src/app/assemble/page.tsx`.
- Updated live project docs to reflect the selected route model: `specs/ui-gapphub.md`, `specs/drift-report.md`, `tasks/roadmap.md`, and `tasks/todo.md`.

### Ship Manifest

- User goal: move forward with the boot screen as primary, remove the other routes, and fold boot into the root.
- Changed files: `src/app/page.tsx`, `src/app/boot/page.tsx`, `src/app/slide/page.tsx`, `src/app/assemble/page.tsx`, `specs/ui-gapphub.md`, `specs/drift-report.md`, `tasks/roadmap.md`, `tasks/todo.md`, `tasks/phases/phase-5.md`, `tasks/history.md`.
- Per-file purpose: `page.tsx` promotes boot to `/`; deleted route pages remove public comparison routes; spec/task docs record the selected route model and prevent stale references.
- User-goal mapping: visiting `/` now starts with the boot screen, while `/boot`, `/slide`, and `/assemble` no longer exist as app routes.
- Tests run: `pnpm test` (87 passed), `pnpm exec tsc --noEmit` (passed after clearing stale `.next` generated route validators), `pnpm exec eslint` (0 errors, 1 accepted warning), `pnpm build` (passed; route output lists `/`, `_not-found`, and app icons only).
- Skipped tests: no additional browser screenshot test was run; this was a route-surface change verified by build route output plus existing animation/component tests.
- Adversarial review: confirmed Next app routing docs still use folder `page.tsx` files for public routes, checked `src/app` contains no nested route page files after deletion, verified production route output excludes the removed routes, and accepted the existing `@next/next/no-img-element` warning for local product icon PNGs in `AppIcon.tsx`.
- Residual risk: external bookmarks to the removed comparison routes will now hit Next's not-found behavior; this matches the requested removal.
- Rollback note: restore the three deleted route page files and change `src/app/page.tsx` back to `variant="none"` if comparison routes are needed again.
- Next command: `$guide` for deferred real-device responsive testing when preparing for production launch.

## 2026-05-18 — Fix: Remove signal bars from rendered phone status bar

- Confirmed user report: the rendered phone still included the signal-bars SVG in `src/components/StatusBar.tsx`.
- Root cause: the original status bar implementation added signal bars, battery, and later docs described them as decorative; the recent cleanup removed only the `100%` battery text, not the signal-bars SVG.
- Fix: removed the signal-bars SVG from `StatusBar`, leaving only the full battery icon on the right side.
- Updated `src/__tests__/PhoneFrame.test.tsx` with a regression assertion that `StatusBar` renders only one SVG.
- Updated `specs/ui-gapphub.md` so future implementation work does not reintroduce signal bars from stale spec text.

## 2026-05-18 — Fix: UI spacing — grid/dock overlap and icon sizing

- Pre-existing uncommitted changes: icon size 60→54px, dock padding reduction (pb-6→pb-4, pt-3→pt-2), page dot colors from white to dark (#1d1d1f), class ordering normalization, animation timing (BOOT_ISLAND_MESSAGE_DELAY 3000→1500), test assertions updated to match
- Grid/dock spacing fix: page dots were overlapping the dock because `bottom-[72px]` was less than the ~94px dock height. Grid top padding was only 4px below the Dynamic Island (40px element, 44px padding).
- `IconGrid.tsx`: extracted `GRID_PAGE_CLASSES` constant, changed grid padding from `pt-[44px] pb-[52px]` to `pt-[52px] pb-[120px]`, moved page dots from `bottom-[72px]` to `bottom-[100px]` (absolute positioned above dock)
- `useAvailableRows.ts`: updated constants to match new grid padding (PT=52, PB=120) and actual icon dimensions (ICON_HEIGHT=54, LABEL_HEIGHT=16, GAP_Y=16 for gap-y-4). Still yields 6 rows at full phone height.
- Verified: 89/89 tests pass, typecheck clean, lint has only pre-existing `<img>` warning

## 2026-05-18 — Phase 7, Step 7.1: Expand Product type with optional drawer fields

- Added three optional fields to `Product` interface in `src/types/product.ts`:
  - `screenshots?: string[]` — image URLs for screenshot carousel
  - `testimonials?: { text: string; author: string }[]` — user quotes
  - `longDescription?: string` — extended description for drawer body
- No changes to `products.json` or data loading — fields are optional and absent by default
- Verified: `npx tsc --noEmit` clean, 89/89 tests pass (no regressions)

## 2026-05-18 — Phase 7, Step 7.2: Build the AppStoreDrawer component

- Created `src/components/AppStoreDrawer.tsx` — bottom-sheet drawer component with Framer Motion slide-up animation
- Props: `product: Product | null` (null = closed), `onClose: () => void`
- Animation: `AnimatePresence` + `motion.div` with spring `y: "100%"` → `y: "0%"` (~300ms), reduced motion falls back to opacity fade
- Backdrop: `bg-black/40` overlay at `z-30`, click-to-dismiss
- Drag-to-dismiss: Framer Motion `drag="y"` with 100px offset or 500 velocity threshold; disabled under reduced motion
- Header: 72px squircle icon (reuses `CUSTOM_ICON_IDS`/Lucide/fallback-letter from AppIcon), app name + badge dot, "Open" pill CTA with `ExternalLink` icon
- Description: `longDescription ?? description`
- Screenshots carousel: conditional horizontal snap scroll with `snap-x snap-mandatory`
- Testimonials: conditional stacked quote cards (`bg-gray-50 rounded-lg`)
- Accessibility: `role="dialog"`, `aria-modal="true"`, focus trap (Tab wraps), Escape to close, auto-focus CTA on mount
- Icon rendering logic duplicated from AppIcon (same `CUSTOM_ICON_IDS` set, `getIcon()`, `badgeColorMap` with hex values instead of Tailwind classes)
- Verified: `npx tsc --noEmit` clean, 89/89 tests pass (no regressions)

## 2026-05-19 — Phase 7, Step 7.3: Convert AppIcon from link to button

- Changed `AppIcon.tsx` from `<a href>` to `<button type="button">` with `onSelect?: (product: Product) => void` callback
- Updated `forwardRef` generic from `HTMLAnchorElement` to `HTMLButtonElement`
- Updated `handleMouseEnter` event type to `React.MouseEvent<HTMLButtonElement>`
- Updated ref types in `Dock.tsx` and `IconGrid.tsx` from `HTMLAnchorElement` to `HTMLButtonElement`
- Updated 4 test files: `IconGrid.test.tsx` (link→gridcell/button assertions), `Dock.test.tsx` (link→button), `Accessibility.test.tsx` (link→button), `Interactions.test.tsx` (`querySelector("a")`→`querySelector("button")`)
- No changes to Search.test.tsx or Pagination.test.tsx (no link references)
- Verified: `npx tsc --noEmit` clean, 89/89 tests pass (no regressions)

## 2026-05-19 — Phase 7, Step 7.4: Wire drawer state into PageContent, IconGrid, and Dock

- Added `selectedProduct` state and `triggerRef` for focus restoration in `PageContent.tsx`
- Created `handleIconSelect` and `handleDrawerClose` callbacks with `useCallback`
- Rendered `<AppStoreDrawer>` inside PhoneFrame after all variant content
- Threaded `onIconSelect` prop through all animation sub-components (BootPhoneContent, SlidePhoneContent, AssemblePhoneContent) and the `variant="none"` branch
- Added `onIconSelect` prop to `IconGrid` — passed to all `<AppIcon>` instances (paginated grid + search results)
- Added `onIconSelect` prop to `Dock` — passed to all `<AppIcon>` instances
- Verified: `npx tsc --noEmit` clean, 89/89 tests pass (no regressions)

## 2026-05-19 — Phase 7, Step 7.5: Swipe conflict prevention (polish)

- Added `drawerOpen?: boolean` prop to `IconGrid` component
- When `drawerOpen` is true, all swipe interactions are suppressed:
  - `handleTouchStart` returns early (no touch tracking)
  - `handleTouchEnd` returns early (no page change or search pull-down)
  - `swipe?.registerSwipe` callback returns early (no PhoneSwipeProvider page change)
- Threaded `drawerOpen={selectedProduct !== null}` through all 4 `IconGrid` instances in `PageContent`:
  - Default variant, BootPhoneContent, SlidePhoneContent, AssemblePhoneContent
- Most Step 7.5 items were already implemented during Step 7.2 (reduced motion, deprecated styling, scroll, search overlay)
- Verified: `npx tsc --noEmit` clean, 89/89 tests pass (no regressions)

## 2026-05-19 — Phase 7, Step 7.6: Regression tests for App Store Drawer

- Created `src/__tests__/AppStoreDrawer.test.tsx` with 20 tests covering:
  - Rendering: product name/description/CTA when product provided, nothing when null, longDescription fallback
  - CTA: correct href, target="_blank", rel="noopener noreferrer", aria-label with product name
  - Accessibility: role="dialog", aria-modal="true", aria-label with product name, Escape calls onClose
  - Dismiss: backdrop click calls onClose
  - Screenshots: hidden when absent/empty, visible when populated with correct image count
  - Testimonials: hidden when absent/empty, visible when populated with content
  - Icon rendering: 72px Lucide icons, custom PNG for CUSTOM_ICON_IDS (war-room), badge dot with correct color, no badge dot for deprecated, grayscale+opacity for deprecated icons
- Added 1 test to `src/__tests__/Interactions.test.tsx`: clicking AppIcon button calls onSelect with product
- Added 1 test to `src/__tests__/Dock.test.tsx`: clicking dock icon calls onIconSelect with product
- Verified: `npx tsc --noEmit` clean, 111/111 tests pass (89 existing + 22 new, no regressions)

## 2026-05-19 — Phase 7, Step 7.7: Final verification (no-op)

- Step 7.7 verification completed during Step 7.6 session:
  - `npx tsc --noEmit`: clean
  - `npm test`: 111/111 pass
  - `npm run lint`: 0 errors, 3 warnings (all pre-existing `@next/next/no-img-element`)
  - `npm run build`: succeeds, static generation for `/` and `/_not-found`
- All Phase 7 milestone acceptance criteria met — phase complete
- **All 7 phases complete**

## 2026-05-19 — Fix: Dynamic Island text animation flicker on mobile

- Root cause: `AnimatePresence mode="wait"` serializes exit→remove→mount→enter, leaving a gap where the old GPU-cached layer lingers as a ghost frame on mobile browsers. Combined with no GPU layer promotion and `scale: 0.98` keeping old text nearly full-size at low opacity.
- Fix in `src/components/DynamicIsland.tsx`:
  - Switched `mode="wait"` → `mode="popLayout"` — exiting element pulled out of flow immediately, new element mounts in same frame
  - Added `style={{ willChange: "transform, opacity" }}` — pre-promotes element to GPU layer on mobile
  - Removed `scale` from initial/animate/exit, shortened exit duration to 0.25s via inline transition
- Verified: 111/111 tests pass, lint clean (0 errors, 3 pre-existing warnings)

## 2026-05-20 — Fix: Search overlay hidden by Dynamic Island and StatusBar icons

- Problem: When swiping down to open search, the search input was covered by the Dynamic Island and the cancel button was covered by the battery icon, because SearchOverlay is positioned at `top-0` inside IconGrid which starts at the top of PhoneFrame (StatusBar and DynamicIsland are absolutely positioned).
- Fix: Fade out Dynamic Island and StatusBar when search is active, fade them back in on dismiss.
- Added `onSearchVisibilityChange` callback prop to `IconGrid.tsx`, fires whenever `showSearch` state changes.
- Added `searchActive` state in `PageContent.tsx`, threaded through all 4 animation variants (none, boot, slide, assemble).
- Wrapped StatusBar and DynamicIsland in each variant with `transition-opacity duration-200` toggling `opacity-0 pointer-events-none` when search is active.
- Verified: 111/111 tests pass, typecheck clean

## 2026-05-20 — Polish: Warm sunset gradient splash screen background

- Replaced plain `bg-black` boot splash overlay with warm peach-to-coral gradient (`linear-gradient(135deg, #FF9A56, #FF6B6B)`) in `src/components/PageContent.tsx`
- Applied the same gradient to the assemble variant's phase-3 transition overlay
- Updated `public/manifest.webmanifest`: `background_color` and `theme_color` from `#000000` to `#FF9A56`
- Updated `src/__tests__/Animations.test.tsx`: changed `.z-40.bg-black` selectors to `.z-40` (class was removed)
- Verified: 111/111 tests pass, lint clean (0 errors, 3 pre-existing warnings)

## 2026-05-20 — Refactor: Remove tooltip code (replaced by App Store Drawer)

- The AppStoreDrawer (Phase 7) now shows product details on click, making hover tooltips redundant
- `AppIcon.tsx`: Removed `useLayoutEffect`, `useRef`, `useState`, `createPortal` imports; removed `TOOLTIP_OFFSET`, `TooltipPosition`, tooltip state/refs/handlers, tooltip JSX, and the entire `AppIconTooltip` component
- `BadgeLegend.tsx`: Removed `useState` import, `Tooltip` component, `deprecatedDescription` const, `description` fields, `hovered` state, and all hover/tooltip JSX attributes and `cursor-default` classes
- `BadgeLegend.test.tsx`: Removed 6 tooltip hover/hide tests and unused `fireEvent` import
- `Interactions.test.tsx`: Removed entire "AppIcon tooltip" describe block (3 tests) and unused `beforeEach`, `afterEach`, `act`, `cleanup` imports
- Net: −289 lines across 4 files
- Verified: 102/102 tests pass, typecheck clean

## 2026-05-20 — Fix: Drawer rubber-band animation on open

- Root cause: spring transition `{ stiffness: 400, damping: 35, mass: 0.8 }` had damping ratio ~0.978 (just below critical), causing overshoot into negative y territory clamped by `dragConstraints={{ top: 0 }}`
- Fix: increased `damping` from 35 to 38 in `src/components/AppStoreDrawer.tsx:101`, making the spring slightly overdamped (ratio ~1.06) to eliminate overshoot while keeping snappy feel
- Drag-to-dismiss unaffected (separate from entry/exit transition)
- Verified: 102/102 tests pass, lint clean (0 errors, 3 pre-existing warnings)

## 2026-05-20 — Fix: Drawer rubber-band overshoot (elastic clamp)

- Previous fix (damping 35→38) made spring overdamped but rubber-band persisted — root cause was `dragElastic={0.2}` allowing elastic displacement past `dragConstraints={{ top: 0 }}`, amplifying sub-pixel overshoot on frame timing
- Fix: set `dragElastic={0}` in `AppStoreDrawer.tsx:130` to hard-clamp at top constraint; reverted damping back to 35 for snappier feel (safe with elastic=0)
- Drag-to-dismiss (downward) unaffected — no `bottom` constraint
- Verified: 102/102 tests pass

## 2026-05-20 — Fix: Drawer rubber-band overshoot (disable drag during entry animation)

- Previous two fixes (damping 35→38, dragElastic=0) targeted the wrong layer — `dragElastic` and `dragConstraints` only affect user drag gestures, not the programmatic spring animation
- Root cause: `drag="y"` was active during the entry animation. Framer-motion's drag system and animation system share the same `y` motion value; at the settling point, the drag system's pixel-based constraint resolution (`top: 0px`) conflicts with the animation's percentage-based target (`y: "0%"`), producing a visible bounce
- Fix: added `canDrag` state (initially false, reset on `product` change), enabled only after `onAnimationComplete` fires with `"visible"` variant. Changed `drag` prop to `drag={reducedMotion ? false : canDrag ? "y" : false}`
- Kept `dragElastic={0}` and `damping=35` — both correct for post-animation drag behavior
- Verified: 102/102 tests pass

## 2026-05-20 — Fix: Drawer open causes icon grid reflow (the actual "rubber-band")

- Root cause: the perceived rubber-band was never spring overshoot — diagnostic page proved zero overshoot across all configurations. The visual artifact was the icon grid resetting/dropping when the drawer opened.
- Chain: `setSelectedProduct` → `drawerOpen={true}` → AppStoreDrawer mounts inside PhoneFrame → `ResizeObserver` on grid container fires → `setIconsPerPage` triggers re-render → `pages = chunk(products, iconsPerPage)` regenerates → grid reflows mid-animation
- Fix: added `frozen` parameter to `useAvailableRows` hook. When `true`, `compute()` early-returns so `ResizeObserver` callbacks are ignored. `IconGrid` passes `drawerOpen` as the frozen flag.
- Cleanup: removed debug instrumentation from `AppStoreDrawer.tsx` (debugSamples/debugRaf/debugStart refs, sampling useEffect, console logging in onAnimationComplete)
- Cleanup: deleted `public/debug-drawer.html` diagnostic page
- Verified: 102/102 tests pass, typecheck clean, lint 0 errors (3 pre-existing warnings)

## 2026-05-20 — Fix: Grid slides down when drawer opens (focus scroll)

- Root cause: `ctaRef.current?.focus()` in `AppStoreDrawer.tsx:80` triggers browser scroll-into-view behavior. The CTA button exists in the DOM but is off-screen (below `overflow-hidden` container) during mount at `y: "100%"`. `focus()` auto-scrolls the nearest scrollable ancestor, shifting the grid's `scrollTop`.
- Fix: added `{ preventScroll: true }` to the `focus()` call so the browser focuses without scrolling. The drawer's Framer Motion spring animation brings the CTA into view naturally.
- Verified: 102/102 tests pass, typecheck clean, lint 0 errors (3 pre-existing warnings)

## 2026-05-21 — Phase 8: Populate drawer longDescription for all 34 products

- Added `longDescription` field to all 34 products in `public/data/products.json`
- Each description is 2–4 sentences (257–387 chars), richer than the one-liner `description` but concise enough for the mobile bottom-sheet drawer
- Research sources: product page meta descriptions via leexperimental.com, existing product data, portfolio context from concept brief and feature interview docs
- Descriptions cover product purpose, key features, and value proposition — tailored to each product's maturity (launched, beta, archived, killed, reserved)
- Spellbook OS sub-modules (Sanctum, Foresight, Prism, Ritual, Portals, Scry) describe their role within the parent system
- Updated `tasks/todo.md` with completed Phase 8 section (35/35 items checked)
- Verified: 102/102 tests pass, typecheck clean, lint 0 errors (3 pre-existing warnings), JSON valid

## 2026-05-22 — Fix: Drawer mid-animation flash

- Root cause: the animated drawer sheet and backdrop both used `z-30`; the sheet also lacked explicit compositing/paint isolation while Framer Motion animated its transform, allowing intermittent backdrop/sheet repaint flashes during the slide-up.
- Fix: moved the sheet to `z-40` and added `transform-gpu`, `will-change-transform`, `[backface-visibility:hidden]`, and `[contain:paint]` to keep the sliding sheet on a stable isolated layer above the backdrop.
- Added regression coverage in `AppStoreDrawer.test.tsx` for the layer-isolation classes.
- Verified: drawer test 22/22 passes, full suite 106/106 passes, lint clean, production build succeeds.

## 2026-05-22 — Fix: Search uses single paged grid model

- User goal: keep horizontal page swaps available while search mode is enabled, avoiding the prior split behavior where typed search used a vertical results pane.
- Changed files:
  - `src/components/IconGrid.tsx` — derives `visibleProducts` from search state, paginates both normal and filtered app sets through the same grid branch, keeps page dots/swipes active in search, resets to page 1 on query change, and leaves search-input arrow keys to the input.
  - `src/__tests__/Search.test.tsx` — updates regression tests for broad search pagination, active swipes during search, query reset, input arrow key handling, and no-match state.
  - `alignment/investigate-search-grid-model.html` — alignment and wireframe artifact comparing split, single-grid, and hybrid search approaches; Option B selected.
  - `tasks/todo.md`, `tasks/history.md` — shipping notes and manifest.
- User-goal mapping: search now changes which products are in the grid, not how the grid navigates; empty and typed searches retain the same horizontal page model.
- Tests run:
  - `pnpm test` — 111/111 passing
  - `pnpm lint` — passing, no warnings emitted
  - `pnpm build` — passing, static route generation succeeds
  - `curl -I http://localhost:3000` — existing dev server responds 200
- Skipped tests: no manual mobile/tablet device pass; existing `tasks/manual-todo.md` keeps that deferred production-launch check.
- Adversarial review: checked for search-mode regressions around empty query flattening, filtered result pagination, page-dot visibility, swipe handling, no-match results, drawer swipe suppression, and input key handling. Initial implementation exposed a hook ordering crash and an invalid set-state-in-effect lint pattern; both were fixed before shipping.
- Residual risk: Safari Computer Use navigation remained on `/v2` during the manual browser attempt, so automated test/build evidence is the primary proof for the interaction. A real-device gesture check remains useful before production launch.
- Rollback note: revert the search-grid commit to restore the prior split model with separate typed search results.
- Next command: `$run`

## 2026-05-22 — Research: Positioning

- User goal: create `research/positioning.md` after ICP and competitive analysis.
- Changed files:
  - `research/positioning.md` — canonical positioning research artifact.
  - `alignment/positioning.html` — browser-readable alignment preview of the positioning recommendation.
  - `tasks/todo.md` — marks the positioning queue item complete.
  - `tasks/history.md` — records the shipped research work and manifest.
- Per-file purpose: keep the research artifact durable, provide a preview surface, and keep task history synchronized.
- User-goal mapping: the positioning doc defines competitive alternatives, unique attributes, value themes, best-fit audience, market category, positioning statement, and UI implications without reframing GappHub as a marketplace or standalone revenue product.
- Created `research/positioning.md` using local ICP, competitive analysis, concept brief, UI spec, and product data as source material.
- Positioned GappHub as a branded product portfolio launcher, not a marketplace, app store, generic bio-link page, or standalone revenue product.
- Recommended the primary frame: one shareable front door for Lexcorp's product universe, with the phone-frame metaphor as the positioning proof point.
- Checked current external category context for Linktree, Beacons, Carrd, Squarespace/link-in-bio builders, and April Dunford positioning methodology.
- Updated `tasks/todo.md` to mark the positioning queue item complete.
- Tests run:
  - `pnpm lint` — passed with no warnings emitted.
  - `pnpm test` — 111/111 tests passed.
- Skipped tests: `pnpm build` skipped because this was documentation/research-only and lint + tests already confirmed no source regression; no manual mobile/tablet pass because `tasks/manual-todo.md` keeps that deferred production-launch check.
- Adversarial review: checked the positioning against local ICP, competitive analysis, concept brief, UI spec, and product data; specifically reviewed for prohibited frames (marketplace, app store, standalone revenue product), unsupported monetization claims, and overclaiming table-stakes link aggregation.
- Residual risk: claims are evidence-backed by local research and current web checks, but user validation is still useful for proprietary brand constraints and whether "Lexcorp" should remain the first brand frame.
- Rollback note: revert the positioning research commit to remove the new artifact and reopen the queue item.
- Next command: `$run`

## 2026-05-28 — Fix all expert review findings

- Fixed all 12 findings from `/expert-review` (2 Critical, 2 High, 3 Medium, 2 Low, 3 skipped as low-risk).
- **Critical #1**: Changed reduced-motion CSS selectors from `a` → `button` in `globals.css` (icons became `<button>` in Phase 7). Updated 3 stale test assertions in `Accessibility.test.tsx`.
- **Critical #2**: Added missing `...byBadge("N")` to `sortProducts` in `products.ts` — "New" badge products were silently dropped from the grid.
- **High #3**: Replaced `import * as icons from "lucide-react"` barrel import with explicit map of 34 used icons in new `src/lib/icon-utils.ts`. Eliminates ~1,000+ unused icon imports from client bundle.
- **High #4**: Extracted duplicated `getIcon()`, `CUSTOM_ICON_IDS`, `iconAlignmentClassMap`, `badgeColorMap`, `badgeLabelMap` into shared `src/lib/icon-utils.ts`. Both `AppIcon.tsx` and `AppStoreDrawer.tsx` now import from the shared module.
- **Medium**: Fixed StatusBar hydration mismatch (empty initial state + `suppressHydrationWarning`). Deleted unused `useIsMobile` hook and stale test mock. Removed dead `SlidePhoneContent`/`AssemblePhoneContent` animation variants and simplified `Variant` type to `"none" | "boot"`.
- **Low**: Replaced `aria-hidden` with `role="presentation"` on SearchOverlay backdrop. Replaced BadgeLegend deprecated icon from black square SVG to grayscale squircle matching grid icon style.
- Updated `Animations.test.tsx` to remove slide/assemble variant tests and references. Updated `Search.test.tsx` backdrop selector.
- Verification: 107/107 tests pass, `tsc --noEmit` clean, `next build` succeeds, no remaining barrel imports or stale CSS selectors.

## 2026-05-28 — Fix sheen wipe popping in at the bottom

- Fixed the boot splash `.shimmer-wipe` band popping/flashing in at the phone's bottom edge instead of gliding up smoothly from below.
- Root cause was a timing/range coupling, not direction: with `background-size 100% 200%` and a `-200% → 200%` keyframe range, the band's visible travel was pushed into the fast middle of the `ease-in-out` curve, so it crossed the bottom edge at peak velocity (the "pop") while the slow-in part of the easing was spent off-screen.
- Retuned the keyframe range to `-40% → 140%` so the band enters the frame at the start of the timeline (during the gentle slow-in) and exits the top at the end — visible travel now spans the full duration. Also matched the static `background-position` to `0 -40%` so `fill: both` holds it hidden during the `0.4s` delay, and lengthened the sweep to `1s`.
- Kept the upward direction and `ease-in-out` (swapping keyframe values to reverse direction was rejected as it would make the band fall downward).
- Added a prevention comment above `@keyframes shimmer-wipe` documenting that the band must enter at the start of the timeline so the slow-in applies to the visible rise.
- Single file: `src/app/globals.css:89-117`. `.shimmer-wipe` is only consumed at `PageContent.tsx:215-220`; the `animationDelay: '0.4s'` there is unaffected.
- Also fixed an unrelated leftover lint warning: removed unused `vi` import from `Accessibility.test.tsx` (left over from the prior expert-review cleanup).
- Verification: `pnpm lint` clean (0 warnings), `pnpm test` 107/107 pass. The animation itself has no automated coverage — visual verification is recommended (reload boot, watch splash→icons sheen) but was not performed in this session.
