# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 3 of 6 — Interactions & Badges
> Test strategy: tests-after

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

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [x] Step 3.1: Add notification badges to AppIcon
  - Files: modify `src/components/AppIcon.tsx`
  - Add a badge overlay element positioned top-right of the icon image, overlapping by ~6px
  - Badge shape: 20px diameter circle, 2px solid white border
  - Badge colors: L=#34C759 (green), B=#FF9500 (orange), N=#007AFF (blue), W=#AF52DE (purple)
  - Badge text: white, bold, 11px, single centered character
  - No badge rendered when `badge === null` (deprecated products)
  - Wrap the icon image + badge in a `relative` container to position the badge absolutely
  - Keep AppIcon as a server component for this step — no interactivity yet

- [x] Step 3.2: Convert AppIcon to client component and add hover/press/focus interactions
  - Files: modify `src/components/AppIcon.tsx`
  - Add `"use client"` directive
  - Hover state: CSS `transition` + `hover:scale-105` with subtle upward lift shadow (`hover:shadow-lg hover:-translate-y-0.5`)
  - Press/active state: `active:scale-[0.92]` with 150ms transition duration
  - Focus state: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2` on the `<a>` element
  - Release: spring back to 100% (handled by CSS transition), navigation via default `<a>` behavior
  - Use CSS transitions (no JS state needed for hover/press/focus — pure CSS pseudoclass approach)
  - Transition: `transition-transform duration-150 ease-out`

- [x] Step 3.3: Add description tooltip on hover
  - Files: modify `src/components/AppIcon.tsx`
  - Add tooltip state: `useState` for visibility, `useRef` + `setTimeout` for 400ms hover delay
  - Tooltip markup: dark rounded rectangle (`bg-[#333]/90 text-white text-xs rounded-lg px-2 py-1.5`) positioned above the icon with a small downward-pointing caret (CSS triangle via `after` pseudo-element or a `<span>`)
  - Max width: 200px, centered above icon
  - Content: `product.description` (1–2 lines)
  - Tooltip shadow: `shadow-md` (~`0 4px 12px rgba(0,0,0,0.15)`)
  - Show on `onMouseEnter` after 400ms delay, hide on `onMouseLeave` (clear timeout)
  - Dismiss on touch: tap elsewhere
  - Position: absolute, above the icon container, with `z-20` to float above other icons
  - Accessible: `role="tooltip"`, linked via `aria-describedby` on the `<a>`

- [x] Step 3.4: Build the BadgeLegend component
  - Files: create `src/components/BadgeLegend.tsx`
  - Horizontal row of badge examples, each showing the colored badge circle + label text
  - Items: L=Live, B=Beta, N=New, W=Wishlist, plus a grayed-out icon example for Deprecated
  - Typography: 12px regular, `text-[#86868b]` (muted secondary)
  - Each badge uses the same colors as in AppIcon (L=#34C759, B=#FF9500, N=#007AFF, W=#AF52DE)
  - Deprecated example: small grayed-out square icon + "Deprecated" label
  - Spacing: `gap-4` or `gap-6` between items, flex row with wrap for small screens
  - This is a client component (`"use client"`) to support legend tooltip hover

- [x] Step 3.5: Add legend tooltips and integrate BadgeLegend into the page
  - Files: modify `src/components/BadgeLegend.tsx`, modify `src/app/page.tsx`
  - Each legend item shows a tooltip on hover with a one-line description:
    - L: "Product is live and available"
    - B: "Product is in beta testing"
    - N: "Recently launched product"
    - W: "Product on the wishlist — coming soon"
    - Deprecated: "Product has been retired"
  - Tooltip styling: same as AppIcon tooltips (dark rounded rect, white text, 12px)
  - Simpler positioning since legend is outside the phone frame — tooltip above each item
  - In `page.tsx`: add `<BadgeLegend />` below the PhoneFrame container div, with `mt-4` spacing
  - Legend is centered horizontally, matching the phone frame alignment

  ### Step 3.6 Implementation Plan

  **What to build:** Write regression tests covering all Phase 3 acceptance criteria — interaction states, badges, tooltips, and BadgeLegend.

  **Context:** Phase 3 implementation is complete (Steps 3.1–3.5). All components are client components with interaction states:
  - `AppIcon.tsx`: hover/press/focus CSS transitions, notification badges (L/B/N/W colored circles), description tooltips with 400ms delay
  - `BadgeLegend.tsx`: horizontal legend row with tooltips on hover, `useState` for hovered item tracking
  - `page.tsx`: integrates BadgeLegend below PhoneFrame
  - Existing test files: `src/__tests__/PhoneFrame.test.tsx` (6 tests), `src/__tests__/IconGrid.test.tsx` (6 tests), `src/__tests__/products.test.ts` (5 tests)

  **Files:**
  - **Create:** `src/__tests__/Interactions.test.tsx` — tests for AppIcon interaction classes and tooltip behavior
  - **Create:** `src/__tests__/BadgeLegend.test.tsx` — tests for BadgeLegend rendering and tooltip descriptions

  **Approach:**
  1. `Interactions.test.tsx`:
     - Test: AppIcon renders correct badge color and letter for each badge type (L, B, N, W)
     - Test: No badge rendered for deprecated products (badge null)
     - Test: Badge has white 2px border (`border-white border-2` classes)
     - Test: AppIcon `<a>` has focus-visible outline classes
     - Test: Hover/active scale classes are present (`hover:scale-105`, `active:scale-[0.92]`)
     - Test: Tooltip appears with correct description text (simulate mouseenter, advance timers 400ms)
     - Test: Deprecated products have `grayscale` styling (regression guard from Phase 2)
  2. `BadgeLegend.test.tsx`:
     - Test: Renders all 5 items (L, B, N, W, Deprecated)
     - Test: Each badge shows correct label text
     - Test: Tooltip text matches expected descriptions on hover (simulate mouseenter)
  3. Use `vi.useFakeTimers()` for AppIcon tooltip delay tests
  4. Use `makeProduct()` helper pattern (consistent with existing test files)

  **Execution Profile:**
  - Parallel mode: serial
  - Integration owner: main agent
  - Conflict risk: low
  - Review gates: none

  **Verification:**
  - `npx tsc --noEmit` passes
  - All new tests pass alongside existing 17 tests
  - `npm run build` succeeds

  **Ship-one-step handoff:** Implement only Step 3.6, validate it, then run `/ship` when done.

### Green
- [x] Step 3.6: Write regression tests covering Phase 3 acceptance criteria
  - Files: create `src/__tests__/Interactions.test.tsx`, create `src/__tests__/BadgeLegend.test.tsx`
  - Test: AppIcon renders correct badge color and letter for each badge type (L, B, N, W)
  - Test: No badge rendered for deprecated products (badge null)
  - Test: Badge has white 2px border
  - Test: AppIcon `<a>` has focus-visible outline classes
  - Test: Hover/active scale classes are present on AppIcon container
  - Test: Tooltip appears (controlled by state) with correct description text
  - Test: BadgeLegend renders all 5 items (L, B, N, W, Deprecated)
  - Test: BadgeLegend tooltip text matches expected descriptions
  - Test: Deprecated products still have grayscale styling (regression from Phase 2)
- [x] Step 3.7: Run all tests, verify they pass, build succeeds with `npm run build`

### Milestone: Phase 3 — Interactions & Badges
**Acceptance Criteria:**
- [x] Icons scale up on hover and press-in on click with smooth transitions
- [x] Keyboard focus shows visible blue outline ring
- [x] Badges render in correct colors with white letter, positioned at icon top-right with white border
- [x] Deprecated icons are visually grayed out and dimmed
- [x] Tooltips appear on hover after 400ms delay with product description text
- [x] Badge legend renders below the phone with all four states + deprecated example
- [x] Legend badges show tooltip descriptions on hover
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
