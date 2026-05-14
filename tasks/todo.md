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

- [ ] Step 2.2: Build the data fetch layer with static fallback
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

  ### Step 2.2 Implementation Plan

  **What to build:**
  Create `src/lib/products.ts` with two exported functions:
  1. `getProducts()` — async fetch with env-var URL override and static JSON fallback
  2. `sortProducts()` — deterministic priority sort matching the spec's row layout

  **File to create:** `src/lib/products.ts`

  **Technical details:**
  - Import `Product` from `@/types/product` (path alias already configured in tsconfig)
  - `getProducts()`: try `fetch(process.env.NEXT_PUBLIC_PRODUCTS_URL || '/data/products.json')`, catch → `import('../../public/data/products.json')` as static fallback. For server components, the `/data/products.json` path resolves via Next.js public dir.
  - `sortProducts()` priority buckets (in order):
    1. `featured === true` → sorted by `order` ascending
    2. Next 4 by highest `order` among non-featured (newest) → sorted by `order` descending
    3. Remaining with `badge === "L"` → alphabetical by `name`
    4. Remaining with `badge === "B"` → alphabetical by `name`
    5. Remaining with `badge === "W"` → alphabetical by `name`
    6. `badge === null` (deprecated) → alphabetical by `name`
  - Pure server-side module — no `"use client"`, no browser APIs
  - The 24 products in `products.json` (from Step 2.1) have: 4 featured, 4 N-badge (newest candidates by high order), 12 L-badge, 4 B-badge, 3 W-badge, 1 null-badge

  **Acceptance criteria:**
  - `npx tsc --noEmit` passes
  - `npm run build` succeeds
  - All 6 existing tests still pass (no regressions)
  - Manual verification: import and call both functions in a scratch test or node REPL to confirm sort order matches spec

  **Execution Profile:**
  - Parallel mode: serial
  - Integration owner: main agent
  - Conflict risk: low
  - Review gates: none

  **Ship-one-step handoff:** Implement only Step 2.2, validate it (TypeScript compiles, build passes, tests green), then run `/ship` when done.

- [ ] Step 2.3: Create placeholder icon SVGs
  - Files: create `public/icons/placeholder.svg`
  - Single generic placeholder SVG (60×60, rounded square with a subtle gradient fill and centered app-like glyph)
  - Update `products.json` entries to reference `/icons/placeholder.svg`
  - Optionally create 2-3 color variants for visual variety (e.g., blue, green, orange fills)

- [ ] Step 2.4: Build the AppIcon component
  - Files: create `src/components/AppIcon.tsx`
  - Props: `product: Product`
  - Renders: `<a>` wrapping the icon image + label, `target="_blank"` and `rel="noopener noreferrer"`
  - Icon image: 60×60px, `border-radius: 22.5%` (squircle approximation), `overflow-hidden`
  - Name label: centered below icon, 4px gap, 11px system sans-serif medium weight, `#333` color
  - Truncation: single line, `text-overflow: ellipsis`, `overflow: hidden`, `white-space: nowrap`, max-width 74px
  - No badge rendering yet (Phase 3) — but leave space for badge overlay position
  - Deprecated state: apply `grayscale(100%)` + `opacity: 0.5` to icon, gray label text
  - No hover/press animations yet (Phase 3)

- [ ] Step 2.5: Build the IconGrid component and integrate into the page
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
- [ ] Step 2.6: Write regression tests covering acceptance criteria
  - Files: create `src/__tests__/IconGrid.test.tsx`, modify or extend `src/__tests__/PhoneFrame.test.tsx`
  - Test: IconGrid renders the correct number of icons (24)
  - Test: Each icon displays a product name
  - Test: Icon links have `target="_blank"` and correct `href`
  - Test: `sortProducts()` correctly orders featured → newest → live → beta → wishlist → deprecated
  - Test: Long product names are truncated (element has truncation CSS classes)
  - Test: Deprecated products have grayscale styling
  - Test: Data layer falls back to static JSON when fetch fails (mock fetch failure)

- [ ] Step 2.7: Run all tests, verify they pass, build succeeds with `npm run build`

### Milestone: Phase 2 — Icon Grid & Data Layer
**Acceptance Criteria:**
- [ ] Grid renders 24 icons correctly inside the phone frame with proper spacing
- [ ] Icons display placeholder artwork, product name, and truncate long names with ellipsis
- [ ] Clicking an icon opens the product URL in a new tab
- [ ] Products sort according to the priority layout rules
- [ ] Data fetches from configured URL when available
- [ ] App gracefully falls back to `products.json` when fetch fails (no error visible to user)
- [ ] Deprecated products render at the end of the sort order
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
