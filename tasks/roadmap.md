# Roadmap: GappHub

> Generated from: specs/ui-gapphub.md, research/concept-brief.md
> Date: 2026-05-14
> Total Phases: 6

## Summary

GappHub is built in six serial phases, each layering new capability onto the previous. Phase 1 establishes the project scaffold and renders the static phone frame. Phases 2–4 progressively add content (icons, data), interactivity (hover, press, badges, search, pagination, dock), and Phase 5 delivers the three entrance animation variants. Phase 6 handles responsive adaptation, accessibility, and final polish. Placeholder assets are used until real Lexcorp logo and product icons are provided.

## Phase Overview

| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1 | Project Scaffold & Phone Frame | ui-gapphub.md §Frame Shell, §Status Bar, §Page Chrome | Rendered iPhone 15 frame with Dynamic Island, status bar, wallpaper, logo, and tagline on a styled page | M |
| 2 | Icon Grid & Data Layer | ui-gapphub.md §Icon Grid, §App Icon, §Data Shape | 4×6 icon grid populated from dynamic fetch + static JSON fallback, sorted by priority | M |
| 3 | Interactions & Badges | ui-gapphub.md §App Icon States, §Notification Badge, §Description Tooltip, §Badge Legend | Hover/press animations, notification badges (L/B/N/W), deprecated state, tooltips, badge legend | M |
| 4 | Dock, Pagination & Search | ui-gapphub.md §Dock, §Pagination, §Pull-Down Search | Frosted glass dock with 4 pinned apps, swipe pagination with dots, Spotlight-style search | L |
| 5 | Loading Animations | ui-gapphub.md §Loading Animations | Three entrance animation variants on `/boot`, `/slide`, `/assemble` routes | M |
| 6 | Responsive, Accessibility & Polish | ui-gapphub.md §Responsive, §Accessibility, §Visual Style | Mobile/tablet/desktop adaptation, keyboard nav, screen reader support, reduced motion, final visual polish | M |

---

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

**Acceptance Criteria:**
- [ ] Next.js app builds and runs locally with `npm run dev`
- [ ] Phone frame renders at correct proportions (~375×812 screen area) with visible Dynamic Island, bezel, and 3D shadow
- [ ] Status bar displays current real-world time on the left
- [ ] Wallpaper gradient is visible behind the (empty) screen area
- [ ] Home indicator renders at the bottom of the screen area
- [ ] Lexcorp placeholder logo and tagline are visible above the phone
- [ ] Page background is the specified silver-to-white gradient
- [ ] App deploys to Vercel successfully

**Manual Tasks:**
- Create Vercel project and link to GitHub repo _(blocks: deployment acceptance criterion)_

**Parallelization:** serial

**Coordination Notes:** Foundation phase — all subsequent phases depend on the frame shell and project structure established here.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** none

**Subagent lanes:** none

### Implementation
- Step 1.1: Initialize Next.js project with TypeScript and Tailwind CSS
  - Files: create `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`
  - Initialize with `npx create-next-app@latest` using App Router, TypeScript, Tailwind CSS, ESLint
  - Configure system font stack in Tailwind config and globals
  - Set page metadata (title: "GappHub — Lexcorp Products", description)

- Step 1.2: Build page layout with background gradient and logo/tagline
  - Files: modify `src/app/page.tsx`, modify `src/app/globals.css`
  - Full-viewport layout with silver-to-white gradient background (`#f5f5f7` → `#ffffff`)
  - Flexbox column: logo → tagline → phone frame → (legend placeholder)
  - Lexcorp placeholder logo (inline SVG or text wordmark, ~120–160px wide, charcoal color)
  - Tagline "Made in Boston, Building in Public" below logo (13px, uppercase tracking, medium gray `#86868b`)

- Step 1.3: Build the phone frame shell component
  - Files: create `src/components/PhoneFrame.tsx`
  - Outer frame: rounded rectangle (~423×860px including frame), metallic border gradient, corner radius ~50px
  - Inner bezel: ~12px dark border (`#1c1c1e`), corner radius ~38px
  - 3D shadow: multi-layer `box-shadow` (primary `0 20px 60px rgba(0,0,0,0.15)`, secondary `0 2px 8px rgba(0,0,0,0.08)`, edge highlight `inset 0 1px 0 rgba(255,255,255,0.3)`)
  - Screen area: 375×812px, contains wallpaper gradient (`#e8ecf4` → `#f5f0f6`), overflow hidden

- Step 1.4: Build the Dynamic Island component
  - Files: create `src/components/DynamicIsland.tsx`
  - Pill-shaped black cutout (`#000`), ~120×36px, centered horizontally, ~12px below top of screen area
  - Positioned absolutely within the screen area

- Step 1.5: Build the status bar component with live easter eggs
  - Files: create `src/components/StatusBar.tsx`
  - Height: ~44px, positioned at top of screen area, flanking the Dynamic Island
  - Left side: current real-world time in `h:mm` format (updates every minute via `useEffect` + `setInterval`)
  - Right side: signal bars (placeholder static for now — will be driven by product data in Phase 2), Wi-Fi icon (always full, decorative SVG), battery icon with percentage (placeholder static for now)
  - Typography: system sans-serif, 12px, semibold, dark text on light wallpaper

- Step 1.6: Build the home indicator component
  - Files: create `src/components/HomeIndicator.tsx`
  - Rounded capsule, ~134×5px, dark gray with slight transparency
  - Centered horizontally, ~8px from bottom of screen area

- Step 1.7: Assemble all components on the main page
  - Files: modify `src/app/page.tsx`
  - Compose: page background → logo/tagline → PhoneFrame (containing wallpaper, DynamicIsland, StatusBar, empty screen area, HomeIndicator)
  - Verify vertical centering with offset for logo above and legend space below

### Green
- Step 1.8: Write smoke tests covering acceptance criteria
  - Files: create `src/__tests__/PhoneFrame.test.tsx`, create `jest.config.ts` (or vitest config), install test dependencies
  - Set up testing framework (Vitest + React Testing Library recommended for Next.js)
  - Test: PhoneFrame component renders without crashing
  - Test: StatusBar displays a time string matching `h:mm` format
  - Test: Home indicator renders
  - Test: Dynamic Island renders
  - Test: Page renders logo text and tagline text

- Step 1.9: Run all tests, verify they pass, build succeeds with `npm run build`

### Milestone: Phase 1 — Scaffold & Frame ✓ (completed 2026-05-14)
**Acceptance Criteria:**
- [x] Next.js app builds and runs locally with `npm run dev`
- [x] Phone frame renders at correct proportions (~375×812 screen area) with visible Dynamic Island, bezel, and 3D shadow
- [x] Status bar displays current real-world time on the left
- [x] Wallpaper gradient is visible behind the (empty) screen area
- [x] Home indicator renders at the bottom of the screen area
- [x] Lexcorp placeholder logo and tagline are visible above the phone
- [x] Page background is the specified silver-to-white gradient
- [x] App deploys to Vercel successfully
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 2: Icon Grid & Data Layer

**Goal**: Populate the phone frame with product app icons in a 4×6 grid, sourced from dynamic data fetch with static JSON fallback, sorted by the priority layout (featured → new → live → wishlist → deprecated).

**Scope**:
- `products.json` static fallback file with sample product data matching the expected schema
- Data fetch layer: runtime fetch from configurable URL, falls back to `products.json` on failure
- App icon component: rounded square (squircle) with product artwork, name label below, truncation
- Grid layout: 4 columns × 6 rows, correct spacing and padding within the phone screen area
- Sort logic: Row 1 = featured, Row 2 = newest, Rows 3–5 = live then beta (alphabetical within), Row 6 = wishlist, deprecated last
- Placeholder icon artwork for sample products

**Acceptance Criteria:**
- [ ] Grid renders 24 icons correctly inside the phone frame with proper spacing
- [ ] Icons display placeholder artwork, product name, and truncate long names with ellipsis
- [ ] Clicking an icon opens the product URL in a new tab
- [ ] Products sort according to the priority layout rules
- [ ] Data fetches from configured URL when available
- [ ] App gracefully falls back to `products.json` when fetch fails (no error visible to user)
- [ ] Deprecated products render at the end of the sort order

**Parallelization:** serial

**Coordination Notes:** Depends on the phone frame shell from Phase 1 for correct positioning within the screen area.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** none

**Subagent lanes:** none

### Implementation
- Step 2.1: Define the product data schema and create static `products.json`
  - Files: create `public/data/products.json`, create `src/types/product.ts`
- Step 2.2: Build the data fetch layer with static fallback
  - Files: create `src/lib/products.ts`
- Step 2.3: Create placeholder icon SVGs
  - Files: create `public/icons/placeholder.svg`
- Step 2.4: Build the AppIcon component
  - Files: create `src/components/AppIcon.tsx`
- Step 2.5: Build the IconGrid component and integrate into the page
  - Files: create `src/components/IconGrid.tsx`, modify `src/app/page.tsx`

### Green
- Step 2.6: Write regression tests covering acceptance criteria
  - Files: create `src/__tests__/IconGrid.test.tsx`
- Step 2.7: Run all tests, verify they pass, build succeeds

### Milestone: Phase 2 — Icon Grid & Data Layer ✓ (completed 2026-05-14)
**Acceptance Criteria:**
- [x] Grid renders 24 icons correctly inside the phone frame with proper spacing
- [x] Icons display placeholder artwork, product name, and truncate long names with ellipsis
- [x] Clicking an icon opens the product URL in a new tab
- [x] Products sort according to the priority layout rules
- [x] Data fetches from configured URL when available
- [x] App gracefully falls back to `products.json` when fetch fails (no error visible to user)
- [x] Deprecated products render at the end of the sort order
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion:**
- Deviations from plan: created `src/__tests__/products.test.ts` as separate file instead of extending PhoneFrame.test.tsx
- Tech debt / follow-ups: none
- Ready for next phase: yes

---

## Phase 3: Interactions & Badges

**Goal**: Add hover and press interaction states to icons, render notification badges (L/B/N/W) with correct colors, implement deprecated grayscale state, show description tooltips on hover, and render the badge legend below the phone frame.

**Scope**:
- Hover state: scale to 105% with upward lift shadow
- Press/active state: scale to 92% for 150ms, spring back to 100%, then navigate
- Focus state: 2px blue outline ring for keyboard users
- Notification badges: colored circles (Green=L, Orange=B, Blue=N, Purple=W) with white letter, positioned top-right of icon
- Deprecated state: `grayscale(100%)` + `opacity: 0.5` filter, gray label
- Description tooltip: dark rounded rectangle above icon on hover (400ms delay), with caret
- Badge legend below the phone frame: horizontal row of badge examples with labels
- Legend tooltip: hovering a badge in the legend shows a one-line description

**Acceptance Criteria:**
- [ ] Icons scale up on hover and press-in on click with smooth transitions
- [ ] Keyboard focus shows visible blue outline ring
- [ ] Badges render in correct colors with white letter, positioned at icon top-right with white border
- [ ] Deprecated icons are visually grayed out and dimmed
- [ ] Tooltips appear on hover after 400ms delay with product description text
- [ ] Badge legend renders below the phone with all four states + deprecated example
- [ ] Legend badges show tooltip descriptions on hover

**Parallelization:** serial

**Coordination Notes:** Builds directly on the icon component from Phase 2.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** none

**Subagent lanes:** none

### Implementation
- Step 3.1: Add notification badges to AppIcon
  - Files: modify `src/components/AppIcon.tsx`
- Step 3.2: Convert AppIcon to client component and add hover/press/focus interactions
  - Files: modify `src/components/AppIcon.tsx`
- Step 3.3: Add description tooltip on hover
  - Files: modify `src/components/AppIcon.tsx`
- Step 3.4: Build the BadgeLegend component
  - Files: create `src/components/BadgeLegend.tsx`
- Step 3.5: Add legend tooltips and integrate BadgeLegend into the page
  - Files: modify `src/components/BadgeLegend.tsx`, modify `src/app/page.tsx`

### Green
- Step 3.6: Write regression tests covering acceptance criteria
  - Files: create `src/__tests__/Interactions.test.tsx`, create `src/__tests__/BadgeLegend.test.tsx`
- Step 3.7: Run all tests, verify they pass, build succeeds

### Milestone: Phase 3 — Interactions & Badges
**Acceptance Criteria:**
- [ ] Icons scale up on hover and press-in on click with smooth transitions
- [ ] Keyboard focus shows visible blue outline ring
- [ ] Badges render in correct colors with white letter, positioned at icon top-right with white border
- [ ] Deprecated icons are visually grayed out and dimmed
- [ ] Tooltips appear on hover after 400ms delay with product description text
- [ ] Badge legend renders below the phone with all four states + deprecated example
- [ ] Legend badges show tooltip descriptions on hover
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 4: Dock, Pagination & Search

**Goal**: Add the persistent frosted-glass dock with 4 pinned apps, horizontal swipe pagination with iOS-style page dots, and pull-down Spotlight-style search.

**Scope**:
- Dock: 4-icon row fixed at bottom of screen area, frosted glass (`backdrop-filter: blur(20px)`), subtle separator
- Dock contents: War Room + 3 placeholder slots (TBD), persists across pages
- Pagination: horizontal swipe between pages (touch + mouse drag), smooth 300ms slide transition
- Page indicator dots: iOS-style below grid, above dock (active = larger/opaque, inactive = smaller/transparent)
- Keyboard pagination: left/right arrow keys to navigate pages
- Pull-down search: swipe/pull-down gesture from top of grid area, search bar slides in
- Search input: filters icons by name, badge state, and category tags in real-time
- Search results replace the grid; "No apps found" for empty results
- Search dismiss: tap outside, Escape key, or swipe up

**Acceptance Criteria:**
- [ ] Dock renders with frosted glass effect and 4 pinned app icons
- [ ] Dock stays fixed across page swipes
- [ ] Swiping horizontally navigates between icon pages with smooth transition
- [ ] Page dots render correctly, highlighting the active page
- [ ] Arrow keys navigate between pages
- [ ] Pull-down gesture reveals search bar
- [ ] Typing in search filters icons in real-time by name, badge, and tags
- [ ] "No apps found" shows for empty search results
- [ ] Escape or tap-outside dismisses search

**Parallelization:** serial

**Coordination Notes:** This is the most complex phase — dock positioning affects grid layout, pagination restructures how icons are grouped, and search needs access to the full product data set. Keep it serial.

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 5: Loading Animations

**Goal**: Implement three entrance animation variants on separate routes (`/boot`, `/slide`, `/assemble`) so the user can compare them side by side and choose a winner for the main route.

**Scope**:
- `/boot` route: black screen → Lexcorp logo pulse → wallpaper fade → icons stagger row-by-row → dock slides up (total ~2.2s)
- `/slide` route: phone frame slides up + fades in → status bar → icons stagger + fade → dock fades in (total ~1.5s)
- `/assemble` route: frame sides slide in → seam flash → screen fade → Dynamic Island pop → icons drop with bounce → dock slides up (total ~2.3s)
- Main `/` route: simple fade-in as interim default
- `prefers-reduced-motion`: all variants collapse to ≤200ms opacity fade
- Animation implemented with CSS @keyframes + Framer Motion (or GSAP)

**Acceptance Criteria:**
- [ ] `/boot` plays the boot screen animation sequence as specified
- [ ] `/slide` plays the slide-up + fade animation sequence as specified
- [ ] `/assemble` plays the frame assembly animation sequence as specified
- [ ] All three routes end at the identical final state (fully rendered phone with icons)
- [ ] Main `/` route uses a simple fade-in as temporary default
- [ ] Reduced motion preference disables all animations, replacing with a quick opacity fade
- [ ] Animations feel smooth at 60fps with no visible jank

**Parallelization:** serial

**Coordination Notes:** Depends on all visual components from Phases 1–4 being in place. Each animation variant is independent of the others but all use the same final-state components.

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Phase 6: Responsive, Accessibility & Polish

**Goal**: Ensure the app works across all viewport sizes, meets accessibility requirements, and has final visual polish.

**Scope**:
- Desktop (≥1024px): full-scale frame, centered, generous whitespace
- Tablet (768–1023px): frame at ~85% scale
- Mobile (<768px): simplified frame (thin border + subtle shadow, no realistic bezel/island), screen fills ~90% width
- Wide desktop (≥1440px): frame stays at 100%, extra whitespace absorbed
- Logo/tagline/legend scale and reflow for each breakpoint
- Keyboard navigation: tab order through icons, arrow key grid navigation, Enter/Space to activate
- Screen reader: `role="region"`, `role="grid"`, `role="gridcell"`, `role="toolbar"` with proper aria-labels
- Status bar: `aria-hidden="true"`
- Badges: `aria-hidden="true"` (info in parent aria-label)
- Page indicator: `role="tablist"` with page labels
- Color contrast: verify all text/bg combinations meet WCAG AA
- Touch targets: minimum 44×44px on mobile
- Final visual polish: verify all shadows, gradients, typography, and spacing match spec

**Acceptance Criteria:**
- [ ] Phone frame renders correctly at desktop, tablet, mobile, and wide desktop breakpoints
- [ ] Mobile uses simplified frame without realistic bezel details
- [ ] Tab key navigates through all interactive elements in logical order
- [ ] Arrow keys navigate the icon grid spatially
- [ ] Screen reader announces icon names, states, and "opens in new tab"
- [ ] Reduced motion disables all animations and transitions
- [ ] All text/background combinations pass WCAG AA contrast (4.5:1)
- [ ] Touch targets meet 44×44px minimum on mobile viewports
- [ ] Visual output matches spec across all breakpoints

**Parallelization:** serial

**Coordination Notes:** Final phase — polishes everything from Phases 1–5. Testing should cover the full flow on real devices or emulators.

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no

---

## Deferred / Future Work

- Replace placeholder Lexcorp logo with final SVG asset
- Replace placeholder product icons with real artwork
- Fill remaining 3 dock slots with confirmed Lexcorp/George Le apps
- Choose winning animation variant and promote to main `/` route; remove losing variant routes
- Connect dynamic data fetch to the lexcorp-war-room API or shared DB (once API contract is defined)
- Category/tag taxonomy definition
- Vercel domain configuration and production deployment
- Analytics integration (if desired later)

## Cross-Phase Concerns

### Integration Tests
- End-to-end test: page loads → icons render → click opens new tab (write after Phase 2)
- Search + pagination integration test (write after Phase 4)
- Animation variant smoke test: each route loads without errors (write after Phase 5)
- Responsive snapshot tests across breakpoints (write after Phase 6)

### Non-Functional Requirements
- Performance: FCP < 1.5s, total bundle < 150KB gzipped (Phase 1 baseline, Phase 6 verification)
- Accessibility: WCAG AA compliance (Phase 6)
- Security: no user data handled; external links use `rel="noopener noreferrer"` (Phase 2)
