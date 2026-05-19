# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phases 1–6 complete (2026-05-15). Phase 7 in progress.
> Total Phases: 7

## Phase 7: App Store Drawer

**Goal**: Replace direct external link-out on icon tap with a bottom-sheet drawer that shows app details (icon, title, badge, description, optional screenshots, optional testimonials) and an explicit "Open" CTA that navigates to the product URL. This sets user expectations before navigating away from GappHub.

**Scope**:
- Expand `Product` type with optional `screenshots`, `testimonials`, and `longDescription` fields
- Build `AppStoreDrawer` bottom-sheet component (~80% phone screen height, Framer Motion slide-up)
- Convert icon tap behavior: `<a href>` → opens drawer; "Open" CTA in drawer → `target="_blank"` navigation
- Apply to both grid and dock icons
- Backdrop overlay with tap-to-dismiss
- Swipe-down to dismiss
- Keyboard accessible: Escape to close, focus trap, Tab cycles through drawer content
- ARIA: `role="dialog"`, `aria-modal="true"`, focus return to triggering icon on close
- Screenshots: horizontal scrollable carousel (hidden when empty)
- Testimonials: stacked quote cards (hidden when empty)
- Header: large icon (72px) + app name with badge dot + "Open" pill button with external-link icon

**Acceptance Criteria:**
- [ ] Tapping any grid icon opens the bottom-sheet drawer instead of navigating directly
- [ ] Tapping any dock icon opens the bottom-sheet drawer
- [ ] Drawer displays app icon (72px), name with badge dot, and description
- [ ] "Open" CTA button in the drawer header opens the product URL in a new tab
- [ ] Screenshots carousel renders when `screenshots` array is populated, hidden when empty
- [ ] Testimonials render when `testimonials` array is populated, hidden when empty
- [ ] Swipe-down dismisses the drawer
- [ ] Tap on backdrop dismisses the drawer
- [ ] Escape key closes the drawer and returns focus to the triggering icon
- [ ] Focus is trapped within the drawer while open
- [ ] Drawer has `role="dialog"` and `aria-modal="true"`
- [ ] Drawer animates smoothly (Framer Motion slide-up, ~300ms)
- [ ] All existing tests pass (no regressions)

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium (modifies AppIcon click behavior, touches Dock)
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [x] Step 7.1: Expand `Product` type with optional drawer fields
  - Files: modify `src/types/product.ts`
  - Add optional fields to the `Product` interface:
    - `screenshots?: string[]` — URLs or paths to screenshot images
    - `testimonials?: { text: string; author: string }[]` — user testimonials
    - `longDescription?: string` — extended description for the drawer body
  - No changes to `public/data/products.json` data — fields are optional and absent by default
  - Existing product loading in `src/lib/products.ts` needs no change (optional fields pass through)

- [x] Step 7.2: Build the `AppStoreDrawer` component
  - Files: create `src/components/AppStoreDrawer.tsx`

  **Implementation Plan (self-contained for clear-context execution):**

  Create `src/components/AppStoreDrawer.tsx` as a `"use client"` component. Read `src/components/AppIcon.tsx` first to understand the icon rendering logic (`CUSTOM_ICON_IDS`, Lucide fallback, `badgeColorMap`) that needs to be reused in the drawer header.

  - **Props:** `product: Product | null` (null = closed), `onClose: () => void`
  - **Animation:** Framer Motion `AnimatePresence` + `motion.div` with `y: "100%"` → `y: "20%"` (occupies bottom 80% of phone screen). Spring easing, ~300ms. When `prefers-reduced-motion`, collapse to opacity fade via `useReducedMotion` hook.
  - **Backdrop:** Semi-transparent `bg-black/40` overlay, click handler calls `onClose`. `z-30` to sit above grid/dock but below any portaled tooltips.
  - **Sheet container:** `absolute bottom-0 left-0 right-0 h-[80%]` with `bg-white rounded-t-2xl` and `overflow-y-auto`. Inner padding for content.
  - **Drag-to-dismiss:** Use Framer Motion `drag="y"` with `dragConstraints={{ top: 0 }}` and `dragElastic={0.2}`. On `onDragEnd`, if `offset.y > 100` or `velocity.y > 500`, call `onClose`.
  - **Header row (sticky):**
    - App icon: 72×72px squircle. Reuse the same icon rendering logic from `AppIcon.tsx` (custom PNG for `CUSTOM_ICON_IDS`, Lucide icon otherwise, fallback letter). Extract a shared `ProductIcon` sub-component or inline the logic.
    - App name: bold 16px, with badge dot inline (reuse `badgeColorMap` from `AppIcon.tsx`). Badge dot is 10px colored circle next to the name.
    - "Open" CTA: `<a href={product.url} target="_blank" rel="noopener noreferrer">` styled as pill button (filled blue `bg-blue-500 text-white rounded-full px-4 py-1.5 text-sm font-semibold`). Include `ExternalLink` icon from `lucide-react` (size 14, inline). `aria-label="Open {product.name} in new tab"`.
  - **Description:** `product.longDescription ?? product.description`. Rendered as `<p>` with `text-sm text-gray-600 leading-relaxed`.
  - **Screenshots carousel (conditional):** Only render when `product.screenshots?.length > 0`. Horizontal scrollable div (`overflow-x-auto flex gap-3 snap-x snap-mandatory`). Each screenshot: `<img>` with `rounded-lg` and `snap-center`, max-height ~200px. Show scroll indicators if content overflows.
  - **Testimonials (conditional):** Only render when `product.testimonials?.length > 0`. Vertical stack of quote cards. Each card: `bg-gray-50 rounded-lg p-3`, italic quote text, `— author` line below.
  - **Accessibility:**
    - `role="dialog"` and `aria-modal="true"` on the sheet container
    - `aria-label="{product.name} details"` on the sheet
    - Focus trap: on mount, focus the "Open" CTA button. On `keydown`, trap Tab within the sheet (wrap from last focusable to first and vice versa). On Escape, call `onClose`.
    - When sheet closes, restore focus to the triggering element (passed via ref or callback).

  **Key patterns from existing code:**
  - `src/components/SearchOverlay.tsx` is prior art for overlay patterns within the phone frame (backdrop, dismiss, animation)
  - `src/hooks/useReducedMotion.ts` uses `useSyncExternalStore` — import and use it for reduced motion check
  - `badgeColorMap` in `AppIcon.tsx` maps badge letters to hex colors — reuse for badge dot
  - `CUSTOM_ICON_IDS` in `AppIcon.tsx` determines which products use custom PNG icons vs Lucide icons
  - Framer Motion is already installed and used extensively in `PageContent.tsx`

  **Acceptance criteria for this step:**
  - Component renders product name, description, icon, badge dot, and "Open" CTA when product is non-null
  - Component renders nothing when product is null
  - "Open" CTA links to product URL with `target="_blank"` and `rel="noopener noreferrer"`
  - Drawer has `role="dialog"` and `aria-modal="true"`
  - Escape key calls `onClose`
  - Backdrop click calls `onClose`
  - Drag-down dismisses the drawer (Framer Motion `drag="y"`)
  - Screenshots carousel renders conditionally
  - Testimonials render conditionally
  - Focus trap is implemented (Tab wraps within drawer)
  - `npx tsc --noEmit` passes, `npm test` passes

  **Ship-one-step handoff:** implement only this step, validate it, then run `/ship` when done.

- [x] Step 7.3: Convert AppIcon from link to button and add `onSelect` callback
  - Files: modify `src/components/AppIcon.tsx`
  - Change `<a href={product.url} target="_blank">` to `<button type="button" onClick={() => onSelect?.(product)}>`.
  - Add `onSelect?: (product: Product) => void` to `AppIconProps`.
  - Update `forwardRef` generic from `HTMLAnchorElement` to `HTMLButtonElement`.
  - Update `className`: keep all existing hover/press/focus styles. Add `cursor-pointer` and remove `target`, `rel` attributes.
  - The button still shows the same icon, name, badge, tooltip, and deprecated state — only the click behavior changes.
  - **Impact on existing tests:** Tests that assert `<a>` elements will need updating to expect `<button>`. Tests that check `href` and `target="_blank"` on AppIcon will be removed (those attributes move to the drawer's CTA).

  **Implementation Plan (self-contained for clear-context execution):**

  Modify `src/components/AppIcon.tsx` to change the interactive element from `<a>` to `<button>`. This is a targeted refactor — visual appearance and all existing features (icon, name, badge, tooltip, deprecated state) stay the same.

  - **Step A: Update props and ref type**
    - Add `onSelect?: (product: Product) => void` to `AppIconProps` interface (line ~9–12)
    - Change `forwardRef<HTMLAnchorElement, AppIconProps>` to `forwardRef<HTMLButtonElement, AppIconProps>` (line ~47)
    - Destructure `onSelect` from props alongside `product`, `hideBadge`, `tabIndex`

  - **Step B: Replace `<a>` with `<button>`**
    - Replace `<a ref={ref} href={product.url} target="_blank" rel="noopener noreferrer" ...>` (line ~85–96) with `<button ref={ref} type="button" onClick={() => onSelect?.(product)} ...>`
    - Keep all existing className hover/press/focus Tailwind classes
    - Add `cursor-pointer` to className
    - Remove `href`, `target`, `rel` attributes (those are now on AppStoreDrawer's CTA)
    - The tooltip `onMouseEnter`/`onMouseLeave` handlers stay on the button
    - Change `handleMouseEnter` type from `React.MouseEvent<HTMLAnchorElement>` to `React.MouseEvent<HTMLButtonElement>`

  - **Step C: Update tests**
    - `src/__tests__/IconGrid.test.tsx`: Change assertions from `<a>` elements to `<button>` elements. Remove `target="_blank"` and `href` assertions (lines referencing `getAllByRole('link')` → `getAllByRole('button')`).
    - `src/__tests__/Interactions.test.tsx`: Same — queries for links become queries for buttons. Remove `href`/`target` checks.
    - `src/__tests__/Dock.test.tsx`: Update dock icon queries from links to buttons.
    - `src/__tests__/Accessibility.test.tsx`: Update AppIcon role queries.
    - `src/__tests__/Search.test.tsx`: If any tests query `<a>` within icon results, update to `<button>`.
    - `src/__tests__/Responsive.test.tsx`: Check if PhoneFrame tests reference links — update if needed.
    - `src/__tests__/Pagination.test.tsx`: If pagination tests query icon links, update.

  - **Step D: Update Dock and IconGrid ref types**
    - `src/components/Dock.tsx`: if `iconRefs` is typed as `HTMLAnchorElement`, update to `HTMLButtonElement`
    - `src/components/IconGrid.tsx`: same ref type update

  **Key patterns from existing code:**
  - `AppIcon.tsx` currently uses `forwardRef<HTMLAnchorElement>` (line 47) — straightforward generic swap
  - Tooltip positioning uses `event.currentTarget.getBoundingClientRect()` — works the same on `<button>`
  - `CUSTOM_ICON_IDS`, `getIcon()`, `badgeColorMap` — no changes needed
  - `onSelect` is optional (`?.()` call) so AppIcons without a handler still render fine

  ### Execution Profile
  - **Parallel mode:** serial
  - **Conflict risk:** medium (touches AppIcon which is used by IconGrid, Dock, and tests)
  - **Test strategy:** tests-after (Step 7.6)

  **Acceptance criteria for this step:**
  - AppIcon renders a `<button>` instead of `<a>`
  - Clicking the button calls `onSelect(product)` when handler is provided
  - All visual features unchanged (icon, name, badge, tooltip, deprecated state, hover/press/focus)
  - `forwardRef` generic is `HTMLButtonElement`
  - All existing tests updated and passing (89 tests, no regressions)
  - `npx tsc --noEmit` passes

  **Ship-one-step handoff:** implement only this step, validate it, then run `/ship` when done.

- [x] Step 7.4: Wire drawer state into PageContent, IconGrid, and Dock
  - Files: modify `src/components/PageContent.tsx`, modify `src/components/IconGrid.tsx`, modify `src/components/Dock.tsx`

  **Implementation Plan (self-contained for clear-context execution):**

  Wire the `AppStoreDrawer` component (built in Step 7.2) into the app by adding selection state in `PageContent` and threading `onSelect` callbacks through `IconGrid` and `Dock` to each `AppIcon` (converted to `<button>` in Step 7.3).

  - **Step A: Add drawer state to PageContent (`src/components/PageContent.tsx`)**
    - Import `AppStoreDrawer` from `@/components/AppStoreDrawer` and `Product` from `@/types/product`
    - Add state: `const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)`
    - Add ref: `const triggerRef = useRef<HTMLButtonElement | null>(null)` for focus restoration
    - Create `handleIconSelect = (product: Product) => { triggerRef.current = document.activeElement as HTMLButtonElement; setSelectedProduct(product); }`
    - Create `handleDrawerClose = () => { setSelectedProduct(null); triggerRef.current?.focus(); triggerRef.current = null; }`
    - Render `<AppStoreDrawer product={selectedProduct} onClose={handleDrawerClose} />` inside the PhoneFrame's screen area (inside the `role="region"` container), after all existing children. This applies to the boot variant (the only active variant on `/`). Also add to the `variant="none"` branch for test compatibility.
    - Pass `onIconSelect={handleIconSelect}` to both `<IconGrid>` and `<Dock>` components

  - **Step B: Thread `onIconSelect` through IconGrid (`src/components/IconGrid.tsx`)**
    - Add `onIconSelect?: (product: Product) => void` to `IconGridProps` interface
    - Pass `onSelect={onIconSelect}` to every `<AppIcon>` — both in paginated grid and in search results filtered list
    - Note: `iconRefs` type was already updated to `HTMLButtonElement` in Step 7.3

  - **Step C: Thread `onIconSelect` through Dock (`src/components/Dock.tsx`)**
    - Add `onIconSelect?: (product: Product) => void` to `DockProps` interface
    - Pass `onSelect={onIconSelect}` to every `<AppIcon>`
    - Note: `iconRefs` type was already updated to `HTMLButtonElement` in Step 7.3

  **Key patterns from existing code:**
  - `PageContent.tsx` has multiple animation variant branches (boot, slide, assemble, none) — only boot and none are active (slide/assemble routes were removed). The drawer should render once at the PhoneFrame level, not per variant.
  - `IconGrid.tsx` renders `AppIcon` in two places: paginated grid pages and search results filtered list. Both need `onSelect`.
  - `AppStoreDrawer.tsx` expects `product: Product | null` and `onClose: () => void`.

  ### Execution Profile
  - **Parallel mode:** serial
  - **Conflict risk:** medium (modifies PageContent which has complex animation branches)
  - **Test strategy:** tests-after (Step 7.6)

  **Acceptance criteria for this step:**
  - Clicking any grid icon opens the AppStoreDrawer with that product's details
  - Clicking any dock icon opens the AppStoreDrawer
  - Clicking search result icons also opens the drawer
  - Closing the drawer (Escape, backdrop, drag) returns focus to the triggering icon
  - `npx tsc --noEmit` passes
  - `npm test` passes (89 tests, no regressions)

  **Ship-one-step handoff:** implement only this step, validate it, then run `/ship` when done.

- [x] Step 7.5: Polish, reduced motion, and edge cases
  - Files: modify `src/components/PageContent.tsx`, modify `src/components/IconGrid.tsx`

  **Implementation Plan (self-contained for clear-context execution):**

  Most polish items from the original plan are already implemented in `AppStoreDrawer.tsx`:
  - ✅ Reduced motion: already uses `useReducedMotion()`, switches to opacity fade, disables drag
  - ✅ Deprecated apps: grayscale + opacity-50 already applied to 72px icon
  - ✅ Scroll behavior: `overflow-y-auto` + `sticky top-0` header already present
  - ✅ Search overlay: `onSelect` already passed to search result AppIcons (done in Step 7.4)

  **Remaining work — Swipe conflict prevention:**

  When the drawer is open, IconGrid's touch swipe handlers and PhoneSwipeProvider's swipe should be suppressed to prevent page changes while interacting with the drawer.

  - **Step A: Pass `drawerOpen` to IconGrid (`src/components/PageContent.tsx`)**
    - Add `drawerOpen={selectedProduct !== null}` prop to all `<IconGrid>` instances (boot, slide, assemble, none variants)
    - Thread through BootPhoneContent, SlidePhoneContent, AssemblePhoneContent sub-components

  - **Step B: Suppress swipe in IconGrid when drawer is open (`src/components/IconGrid.tsx`)**
    - Add `drawerOpen?: boolean` to `IconGridProps`
    - In `handleTouchEnd`, add early return at the top: `if (drawerOpen) return;`
    - In the `swipe?.registerSwipe` callback, add: `if (drawerOpen) return;` before calling `goTo`
    - Store `drawerOpen` in a ref (like `showSearchRef`) for access in the swipe callback

  **Key patterns from existing code:**
  - `IconGrid.tsx` already has `showSearchRef` pattern for accessing state in the registered swipe callback
  - `PhoneSwipeProvider` registers frame-level swipe — the callback check is the right place to suppress

  ### Execution Profile
  - **Parallel mode:** serial
  - **Conflict risk:** low (small additions to existing touch handlers)
  - **Test strategy:** tests-after (Step 7.6)

  **Acceptance criteria for this step:**
  - Swiping on the phone screen while the drawer is open does not change the icon grid page
  - All existing behaviors preserved when drawer is closed
  - `npx tsc --noEmit` passes
  - `npm test` passes (89 tests, no regressions)

  **Ship-one-step handoff:** implement only this step, validate it, then run `/ship` when done.

### Green
- [x] Step 7.6: Write regression tests covering acceptance criteria
  - Files: create `src/__tests__/AppStoreDrawer.test.tsx`, modify `src/__tests__/Interactions.test.tsx`, modify `src/__tests__/Dock.test.tsx`

  **Implementation Plan (self-contained for clear-context execution):**

  Write regression tests for Phase 7 (App Store Drawer). Read `src/components/AppStoreDrawer.tsx` to understand the component structure and rendering logic. Read existing test files for test patterns used in this project (helper `makeProduct()`, `cleanup()` in `beforeEach`, `vi.useFakeTimers()`, jsdom mocking conventions).

  - **Step A: Create `src/__tests__/AppStoreDrawer.test.tsx`** with these tests:
    - AppStoreDrawer renders product name, description, and "Open" button when product is provided
    - AppStoreDrawer renders nothing when product is null
    - "Open" CTA has correct `href` and `target="_blank"` and `rel="noopener noreferrer"`
    - "Open" CTA has `aria-label` with product name (e.g. "Open TestApp in new tab")
    - Drawer has `role="dialog"` and `aria-modal="true"`
    - Pressing Escape calls `onClose`
    - Clicking backdrop calls `onClose`
    - Screenshots section hidden when `product.screenshots` is absent/empty
    - Screenshots section visible when `product.screenshots` has entries
    - Testimonials section hidden when `product.testimonials` is absent/empty
    - Testimonials section visible when `product.testimonials` has entries
    - Large icon renders at 72px for standard Lucide icons
    - Large icon renders custom PNG for `CUSTOM_ICON_IDS` (e.g. "war-room")
    - Badge dot renders with correct color next to product name
    - Deprecated product (badge null) shows grayscale + opacity on icon

  - **Step B: Update `src/__tests__/Interactions.test.tsx`:**
    - Add test: clicking AppIcon `<button>` calls `onSelect` with the product object
    - Existing tests already query `<button>` (updated in Step 7.3) — verify no stale `<a>` queries remain

  - **Step C: Update `src/__tests__/Dock.test.tsx`:**
    - Existing tests already query `<button>` (updated in Step 7.3) — verify no stale `<a>` queries remain
    - Add test: clicking dock icon button calls `onSelect` with the product

  **Key patterns from existing tests:**
  - `makeProduct(overrides)` helper in test files for generating test `Product` data
  - `cleanup()` in `beforeEach` to prevent DOM leaking
  - `screen.getByRole("dialog")` for dialog assertions
  - `fireEvent.keyDown(el, { key: "Escape" })` for keyboard tests
  - `vi.fn()` for mock callbacks
  - Framer Motion in jsdom: `AnimatePresence` and `motion.div` generally render their children immediately; no timer advancement needed for static assertions
  - `CUSTOM_ICON_IDS` in AppStoreDrawer includes "war-room" — use this for custom icon test

  ### Execution Profile
  - **Parallel mode:** serial
  - **Conflict risk:** low (new test file + small additions to existing tests)
  - **Test strategy:** tests-after (this IS the test step)

  **Acceptance criteria for this step:**
  - All new tests pass alongside existing 89 tests
  - `npx tsc --noEmit` passes
  - No regressions in existing tests

  **Ship-one-step handoff:** implement only this step, validate it, then run `/ship` when done.

- [x] Step 7.7: Run all tests, verify they pass, `npx tsc --noEmit` succeeds, `npm run lint` has only pre-existing warnings, `next build` succeeds

### Milestone: Phase 7 — App Store Drawer
**Acceptance Criteria:**
- [x] Tapping any grid icon opens the bottom-sheet drawer instead of navigating directly
- [x] Tapping any dock icon opens the bottom-sheet drawer
- [x] Drawer displays app icon (72px), name with badge dot, and description
- [x] "Open" CTA button in the drawer header opens the product URL in a new tab
- [x] Screenshots carousel renders when `screenshots` array is populated, hidden when empty
- [x] Testimonials render when `testimonials` array is populated, hidden when empty
- [x] Swipe-down dismisses the drawer
- [x] Tap on backdrop dismisses the drawer
- [x] Escape key closes the drawer and returns focus to the triggering icon
- [x] Focus is trapped within the drawer while open
- [x] Drawer has `role="dialog"` and `aria-modal="true"`
- [x] Drawer animates smoothly (Framer Motion slide-up, ~300ms)
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion:**
- Deviations from plan: none — all steps implemented as specified
- Tech debt / follow-ups: `@next/next/no-img-element` warnings on AppIcon.tsx and AppStoreDrawer.tsx (accepted, local PNGs)
- Ready for next phase: yes
