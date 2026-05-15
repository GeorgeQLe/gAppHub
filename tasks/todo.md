# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 4 of 6 — Dock, Pagination & Search
> Test strategy: tests-after

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

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium (IconGrid rewrite touches pagination, dock, and search simultaneously)
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [ ] Step 4.1: Build the Dock component and separate dock products from the grid
  - Files: create `src/components/Dock.tsx`, modify `src/app/page.tsx`, modify `src/lib/products.ts`
  - Build `Dock.tsx` as a client component (`"use client"`)
  - Props: `{ products: Product[] }` — expects the 4 dock-flagged products
  - Layout: fixed at bottom of PhoneFrame screen area, above HomeIndicator
    - Position: `absolute bottom-0 left-0 right-0` within PhoneFrame's relative screen
    - Height: ~90px, frosted glass background: `bg-white/60 backdrop-blur-[20px]`
    - Subtle top separator: `border-t border-white/30` or `shadow-[0_-1px_0_rgba(0,0,0,0.05)]`
  - Render 4 AppIcon components evenly spaced in a flex row (`justify-around`)
  - Dock icons may omit badges per spec — add an optional `hideBadge` prop to AppIcon or pass badge-stripped products
  - In `products.ts`: add a `splitDockProducts(products)` helper that returns `{ dock: Product[], grid: Product[] }` based on `product.dock === true`
  - In `page.tsx`: call `splitDockProducts` after sort, pass `dock` to `<Dock>`, pass `grid` to `<IconGrid>`
  - Update IconGrid's `pb-[90px]` bottom padding to account for dock overlap if needed

- [ ] Step 4.2: Convert IconGrid to paginated client component with swipe navigation
  - Files: rewrite `src/components/IconGrid.tsx`
  - Convert to `"use client"` component
  - Page state: `useState<number>(0)` for current page index
  - Page calculation: chunk grid products into pages of 24 (`Math.ceil(products.length / 24)`)
  - Layout: horizontal overflow container with `transform: translateX(-${page * 100}%)` and `transition: transform 300ms ease-out`
  - Each page is a 4-col × 6-row grid, rendered side by side in a flex row
  - Touch/mouse swipe: use `onTouchStart/Move/End` and `onMouseDown/Move/Up` handlers
    - Track swipe delta, threshold of ~50px to trigger page change
    - Prevent default on horizontal swipes to avoid scroll conflict
  - Keyboard: `onKeyDown` handler for ArrowLeft/ArrowRight to change pages
    - Make the grid container focusable with `tabIndex={0}` and `role="region"` with `aria-label`
  - Clamp page index to `[0, totalPages - 1]`

- [ ] Step 4.3: Add iOS-style page indicator dots
  - Files: create `src/components/PageDots.tsx`, modify `src/components/IconGrid.tsx`
  - Props: `{ total: number, active: number, onChange?: (page: number) => void }`
  - Render a horizontal row of dots centered below the grid and above the dock
  - Active dot: 8px diameter, `bg-white` (or `bg-[#333]`) fully opaque
  - Inactive dots: 6px diameter, `bg-white/40` (or `bg-[#333]/30`) semi-transparent
  - Transition between sizes: `transition-all duration-200`
  - Position: between grid bottom and dock top, ~4px gap
  - Accessibility: `role="tablist"` with `aria-label="Page indicator"`, each dot `role="tab"` with `aria-selected`
  - Clicking a dot navigates to that page
  - Integrate into IconGrid — render PageDots below the pages container, pass page state

- [ ] Step 4.4: Build pull-down search overlay
  - Files: create `src/components/SearchOverlay.tsx`, modify `src/components/IconGrid.tsx`
  - SearchOverlay client component:
    - Input: text field with placeholder "Search apps...", `bg-white/80 backdrop-blur-[10px] rounded-xl`
    - Position: above the grid, slides down when active (CSS transform + transition)
    - State: `searchTerm` string, managed internally
    - Props: `{ onSearch: (term: string) => void, onDismiss: () => void, visible: boolean }`
    - Dismiss: Escape keydown on input, click/tap on backdrop overlay
  - In IconGrid:
    - Add `showSearch` state, toggled by pull-down gesture detection
    - Pull-down trigger: `onTouchStart/Move/End` detecting downward swipe (>30px) at top of grid
    - When search is active, filter products by: name (case-insensitive substring), badge letter, category tags
    - Filtered results replace the paginated grid (single page, no pagination)
    - If no results: show "No apps found" centered text
    - On dismiss: clear search, return to paginated grid at previous page

- [ ] Step 4.5: Wire up all components and refine integration
  - Files: modify `src/app/page.tsx`, modify `src/components/IconGrid.tsx`
  - Ensure dock persists across page swipes and during search (dock is separate from IconGrid)
  - Ensure page dots hide when search is active
  - Verify keyboard navigation: ArrowLeft/Right for pages, Escape for search dismiss
  - Ensure touch events don't conflict (horizontal swipe for pages vs. vertical pull-down for search)
  - Test with current 24 products: 4 dock = 20 grid products = 1 page (dots should show but only 1 dot)
  - Verify HomeIndicator still renders below dock

### Green
- [ ] Step 4.6: Write regression tests covering Phase 4 acceptance criteria
  - Files: create `src/__tests__/Dock.test.tsx`, create `src/__tests__/Pagination.test.tsx`, create `src/__tests__/Search.test.tsx`
  - Dock tests: renders 4 icons, frosted glass classes present, dock products excluded from grid
  - Pagination tests: page state changes on simulated swipe, page dots render correctly, arrow key navigation works, page content changes
  - Search tests: search input filters by name/badge/category, "No apps found" for empty results, Escape dismisses search
  - Use `makeProduct()` helper, `vi.useFakeTimers()` where needed
- [ ] Step 4.7: Run all tests, verify they pass, build succeeds with `npm run build`

### Milestone: Phase 4 — Dock, Pagination & Search
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
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
