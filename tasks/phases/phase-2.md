# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 2 of 6 — Icon Grid & Data Layer
> Test strategy: tests-after

## Phase 2: Icon Grid & Data Layer

**Goal**: Populate the phone frame with product app icons in a 4×6 grid, sourced from dynamic data fetch with static JSON fallback, sorted by the priority layout (featured → new → live → wishlist → deprecated).

**Scope**:
- `products.json` static fallback file with sample product data matching the expected schema
- Data fetch layer: runtime fetch from configurable URL, falls back to `products.json` on failure
- App icon component: rounded square (squircle) with product artwork, name label below, truncation
- Grid layout: 4 columns × 6 rows, correct spacing and padding within the phone screen area
- Sort logic: Row 1 = featured, Row 2 = newest, Rows 3–5 = live then beta (alphabetical within), Row 6 = wishlist, deprecated last
- Placeholder icon artwork for sample products

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [x] Step 2.1: Define the product data schema and create static `products.json`
  - Files: create `public/data/products.json`, create `src/types/product.ts`
  - Define TypeScript interface `Product` with fields: `id` (string), `name` (string), `url` (string), `icon` (string), `description` (string), `badge` (`"L" | "B" | "N" | "W" | null`), `category` (string[]), `featured` (boolean), `dock` (boolean), `order` (number)
  - Define `ProductsResponse` type: `{ products: Product[] }`
  - Create `products.json` with 24 sample products covering all badge states: 4 featured, 4 newest (high order values), ~12 live/beta (mix of L and B badges), 4 wishlist (W badge), and at least 1 deprecated (null badge)
  - Use placeholder icon paths (`/icons/placeholder.svg`) — actual icons in a later sub-step
  - Each product needs a realistic name, description, and URL (can use `#` placeholder URLs)

- [x] Step 2.2: Build the data fetch layer with static fallback
  - Files: create `src/lib/products.ts`
  - Export async function `getProducts(): Promise<Product[]>` that:
    - Fetches from `process.env.NEXT_PUBLIC_PRODUCTS_URL` if set, otherwise from `/data/products.json`
    - On fetch failure, imports `products.json` directly as static fallback
    - Returns the `products` array from the response
  - Export function `sortProducts(products: Product[]): Product[]` implementing the priority sort:
    - Featured products first (sorted by `order`)
    - Then products with highest `order` values (newest) — next 4
    - Then live (badge "L") alphabetically by name
    - Then beta (badge "B") alphabetically by name
    - Then wishlist (badge "W") alphabetically by name
    - Deprecated (badge null) last, alphabetically by name
  - This is a server-side utility — used in page.tsx or a server component

  ### Step 2.3 Implementation Plan

  **What to build:**
  Create placeholder icon SVG(s) for the product grid. A single generic placeholder SVG (60×60, rounded square with subtle gradient fill and centered app-like glyph), plus optionally 2-3 color variants for visual variety.

  **Files:**
  - Create: `public/icons/placeholder.svg`
  - Optionally create: `public/icons/placeholder-blue.svg`, `public/icons/placeholder-green.svg`, `public/icons/placeholder-orange.svg`
  - Modify: `public/data/products.json` — update icon paths if multiple variants are created

  **Technical details:**
  - SVG dimensions: 60×60px viewBox
  - Shape: rounded rectangle (`rx`/`ry` for squircle approximation)
  - Fill: subtle linear gradient (e.g., light gray top-left to medium gray bottom-right)
  - Center glyph: simple abstract app icon shape (e.g., rounded square outline, grid dots, or generic "app" symbol)
  - Color variants (optional): swap gradient colors — blue (`#4A90D9`→`#357ABD`), green (`#4CAF50`→`#388E3C`), orange (`#FF9800`→`#F57C00`)
  - If variants are created, distribute them across `products.json` entries for visual variety in the grid
  - Keep SVGs minimal — no external dependencies, no embedded fonts

  **Acceptance criteria:**
  - `public/icons/placeholder.svg` exists and renders at 60×60 in browser
  - `npx tsc --noEmit` passes
  - `npm run build` succeeds
  - All 6 existing tests still pass (no regressions)

  **Execution Profile:**
  - Parallel mode: serial
  - Integration owner: main agent
  - Conflict risk: low
  - Review gates: none

  **Ship-one-step handoff:** Implement only Step 2.3, validate it, then run `/ship` when done.

- [x] Step 2.3: Create placeholder icon SVGs
  - Files: create `public/icons/placeholder.svg`
  - Single generic placeholder SVG (60×60, rounded square with a subtle gradient fill and centered app-like glyph)
  - Update `products.json` entries to reference `/icons/placeholder.svg`
  - Optionally create 2-3 color variants for visual variety (e.g., blue, green, orange fills)

- [x] Step 2.4: Build the AppIcon component
  - Files: create `src/components/AppIcon.tsx`
  - Props: `product: Product`
  - Renders: `<a>` wrapping the icon image + label, `target="_blank"` and `rel="noopener noreferrer"`
  - Icon image: 60×60px, `border-radius: 22.5%` (squircle approximation), `overflow-hidden`
  - Name label: centered below icon, 4px gap, 11px system sans-serif medium weight, `#333` color
  - Truncation: single line, `text-overflow: ellipsis`, `overflow: hidden`, `white-space: nowrap`, max-width 74px
  - No badge rendering yet (Phase 3) — but leave space for badge overlay position
  - Deprecated state: apply `grayscale(100%)` + `opacity: 0.5` to icon, gray label text
  - No hover/press animations yet (Phase 3)

- [x] Step 2.5: Build the IconGrid component and integrate into the page
  - Files: create `src/components/IconGrid.tsx`, modify `src/app/page.tsx`
  - IconGrid accepts `products: Product[]` (already sorted)
  - Renders a 4-column CSS grid inside the phone screen area
  - Grid specs: 4 columns, ~20px horizontal gap, ~28px vertical gap
  - Top padding: ~76px (below status bar + Dynamic Island area)
  - Bottom padding: ~90px (future dock area)
  - Position: within PhoneFrame's screen area, after StatusBar and DynamicIsland
  - Populate with AppIcon components for each product
  - In `page.tsx`: call `getProducts()` + `sortProducts()` at the server component level, pass sorted products to IconGrid
  - Verify grid renders 24 icons properly within the phone frame without overflow

### Green
- [x] Step 2.6: Write regression tests covering acceptance criteria
  - Files: create `src/__tests__/IconGrid.test.tsx`, modify or extend `src/__tests__/PhoneFrame.test.tsx`
  - Test: IconGrid renders the correct number of icons (24)
  - Test: Each icon displays a product name
  - Test: Icon links have `target="_blank"` and correct `href`
  - Test: `sortProducts()` correctly orders featured → newest → live → beta → wishlist → deprecated
  - Test: Long product names are truncated (element has truncation CSS classes)
  - Test: Deprecated products have grayscale styling
  - Test: Data layer falls back to static JSON when fetch fails (mock fetch failure)

  ### Step 2.6 Implementation Plan

  **What to build:**
  Write regression tests for Phase 2 acceptance criteria. These tests cover the IconGrid component, AppIcon component, sortProducts logic, and the data fetch fallback layer.

  **Files:**
  - Create: `src/__tests__/IconGrid.test.tsx`
  - Modify: `src/__tests__/PhoneFrame.test.tsx` (if needed for integration-level assertions)

  **Technical details:**

  **`src/__tests__/IconGrid.test.tsx`** — new test file:
  1. Import `IconGrid` from `@/components/IconGrid`, `AppIcon` from `@/components/AppIcon`, types from `@/types/product`
  2. Create a helper `makeProduct(overrides)` to generate test `Product` objects with sensible defaults
  3. Tests:
     - "renders correct number of icons" — pass 24 products to IconGrid, assert 24 `<a>` elements rendered
     - "each icon displays product name" — pass 3 products with known names, assert each name appears in the DOM
     - "icon links have target=_blank and correct href" — pass products with known URLs, assert `<a>` elements have `target="_blank"` and matching `href`
     - "long names are truncated" — render AppIcon with a long-name product, assert the label element has `truncate` class
     - "deprecated products have grayscale styling" — render AppIcon with `badge: null`, assert icon `<img>` has `grayscale` class
     - "non-deprecated products do not have grayscale" — render AppIcon with `badge: "L"`, assert no `grayscale` class

  **`src/__tests__/products.test.tsx`** (or `.ts`) — new test file for data layer:
  4. Import `sortProducts` from `@/lib/products`
  5. Tests:
     - "sorts featured first by order" — create mix of featured/non-featured, assert featured come first sorted by order asc
     - "newest non-featured come after featured" — verify the next 4 entries are highest-order non-featured products
     - "groups by badge L → B → W → null, alphabetical within" — verify remaining products follow badge ordering
     - "fallback: getProducts returns static data when fetch fails" — mock `fetch` to throw, call `getProducts()`, assert it returns products array from static JSON

  **Existing tests in `src/__tests__/PhoneFrame.test.tsx`:**
  - Already updated to handle async `Home` component (done in Step 2.5)
  - No further changes expected unless integration assertions are added

  **Patterns established:**
  - Test framework: Vitest + React Testing Library + jsdom
  - Config: `vitest.config.ts` with `@/` path alias and react plugin
  - Fake timers used for StatusBar time tests (wrap in `beforeEach`/`afterEach`)
  - Async server components: call `const jsx = await Component()` then `render(jsx)`

  **Acceptance criteria:**
  - All new tests pass
  - All 6 existing tests still pass (no regressions)
  - `npx tsc --noEmit` passes
  - `npm run build` succeeds

  **Execution Profile:**
  - Parallel mode: serial
  - Integration owner: main agent
  - Conflict risk: low
  - Review gates: none

  **Ship-one-step handoff:** Implement only Step 2.6, validate it, then run `/ship` when done.

- [x] Step 2.7: Run all tests, verify they pass, build succeeds with `npm run build`

### Milestone: Phase 2 — Icon Grid & Data Layer
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
- Deviations from plan: created `src/__tests__/products.test.ts` as a separate file instead of extending `PhoneFrame.test.tsx`; did not modify `PhoneFrame.test.tsx` (no changes needed)
- Tech debt / follow-ups: none
- Ready for next phase: yes
