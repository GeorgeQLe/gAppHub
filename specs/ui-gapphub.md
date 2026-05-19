# GappHub — UI Specification

## Source Evidence

- `research/concept-brief.md` — confirmed concept, constraints, and design direction
- UI interview conducted 2026-05-14

## Confirmed UI Assumptions Manifest

| Area | Decision | Source |
|---|---|---|
| Single-page app, one primary route `/` | Confirmed | `[from spec]` |
| Boot screen is the primary entrance animation on `/` | Confirmed | `[user decision 2026-05-18]` |
| No traditional header/sidebar/footer — phone frame is the UI | Confirmed | `[inferred, confirmed]` |
| No top header; brand copy appears in the Dynamic Island during boot | Confirmed | `[from user]` |
| Dynamic Island (iPhone 15+) frame style | Confirmed | `[from interview]` |
| 3D phone with drop shadow | Confirmed | `[from interview]` |
| Subtle light gradient wallpaper | Confirmed | `[from interview]` |
| Simplified frame on mobile viewports | Confirmed | `[from interview]` |
| Badge legend below phone + tooltip on hover | Confirmed | `[from interview]` |
| Light/aspirational Apple-inspired visual language | Confirmed | `[from spec]` |
| No dark mode | Confirmed | `[inferred, uncontested]` |

---

## Page Inventory & Route Map

| Route | Purpose |
|---|---|
| `/` | Main hub — boot screen entrance into the phone frame with product icon grid |

The former comparison routes (`/boot`, `/slide`, `/assemble`) were removed after the boot screen was selected as the primary experience.

---

## Global Shell

There is no global shell (no persistent header, sidebar, or footer). The entire viewport is the stage for the phone frame.

### Elements Outside the Phone Frame

#### Header
- No standalone logo, tagline, header, sidebar, or footer appears outside the phone frame.
- During the boot animation, the Dynamic Island rotates through the brand splash copy.

#### Badge Legend
- **Position:** Below the phone frame, centered, with comfortable spacing
- **Content:** A horizontal row of badge examples with labels:
  - `L` = Live
  - `B` = Beta
  - `N` = New
  - `W` = Wishlist
  - Grayed-out icon = Deprecated
- **Style:** Small text, muted colors, each badge rendered at actual size next to its label
- **Interaction:** Hovering a badge in the legend shows a tooltip with a one-line description

#### Page Background
- **Color:** Light gradient — soft silver (#f5f5f7) to white (#ffffff), top to bottom
- **Texture:** None — clean and flat

---

## Phone Frame — Detailed Anatomy

### Frame Shell

- **Model reference:** iPhone 15 Pro style — flat titanium edges, thin bezels, Dynamic Island
- **Rendering:** CSS-based. The frame is a rounded rectangle with:
  - Outer border: 2–3px solid with a subtle metallic gradient (light silver to slightly darker silver)
  - Inner bezel: ~12px dark (near-black #1c1c1e) border simulating the screen bezel
  - Corner radius: ~50px outer, ~38px inner (matching iPhone proportions)
- **3D depth:** `box-shadow` with multiple layers:
  - Primary: `0 20px 60px rgba(0,0,0,0.15)` — soft diffuse shadow below
  - Secondary: `0 2px 8px rgba(0,0,0,0.08)` — tight contact shadow
  - Edge highlight: `inset 0 1px 0 rgba(255,255,255,0.3)` on the top edge for a subtle reflection
- **Size (desktop):** Approximately 375px wide × 812px tall (iPhone logical resolution), with the frame adding ~24px on each side
- **Centering:** Horizontally and vertically centered in the viewport (with vertical offset to accommodate logo above and legend below)

### Dynamic Island

- **Shape:** Pill-shaped cutout, centered at the top of the screen area
- **Size:** ~120px × 36px
- **Color:** Black (#000), matching the bezel
- **Position:** ~12px below the top edge of the screen area
- **Behavior:** Static — no expanding or interactive states

### Status Bar

- **Position:** Inside the screen area, flanking the Dynamic Island
- **Height:** ~48px (accommodates Dynamic Island alignment)
- **Content (left of island):** Current real-world time in `h:mm` format
- **Content (right of island):**
  - **Battery:** Static full battery icon (decorative)
- **Typography:** SF Pro or system sans-serif, 12px, semibold
- **Color:** Dark text on the light wallpaper background

### Wallpaper

- **Style:** Subtle light gradient — very soft blue-to-lavender or silver-to-white
- **Opacity:** 100% — this is the background of the screen area behind the icon grid
- **Feel:** Airy and light, consistent with the Apple aesthetic

### Home Indicator

- **Position:** Centered at the bottom of the screen area, ~8px from the bottom edge
- **Size:** ~134px wide × 5px tall
- **Color:** Dark gray with slight transparency
- **Shape:** Rounded capsule

---

## Icon Grid

### Layout

- **Columns:** 4
- **Rows per page:** 6 (24 icons per page, matching iOS)
- **Grid gaps:** ~20px horizontal, ~28px vertical (icon center to icon center: ~90px horizontal, ~100px vertical)
- **Top padding:** ~76px from top of screen area (below status bar)
- **Bottom padding:** ~90px from bottom (above dock area)

### Sort Order (Default)

The grid fills in this priority order:

1. **Row 1 (positions 1–4):** Hot / trending / featured products — manually curated
2. **Row 2 (positions 5–8):** Newest products (most recently launched)
3. **Rows 3–5 (positions 9–20):** Live products, then Beta, in alphabetical order within each group
4. **Row 6 (positions 21–24):** Wishlist products
5. **Overflow:** If products exceed 24, they flow onto additional pages
6. **Deprecated products:** Placed last, after wishlist, on the final page

### Pagination

- **Mechanism:** Horizontal swipe between pages (touch + mouse drag)
- **Page indicator dots:** iOS-style, centered below the grid and above the dock
  - Active dot: slightly larger and fully opaque
  - Inactive dots: smaller, semi-transparent
  - Number of dots = number of pages
- **Keyboard:** Left/right arrow keys navigate between pages
- **Transition:** Smooth horizontal slide (300ms ease-out)

### Pull-Down Search (Spotlight)

- **Trigger:** Pull-down gesture from the top of the icon grid area (or swipe down on the first page)
- **Appearance:** A search bar slides down from above the grid, pushing the grid down slightly
- **Input:** Text field with placeholder "Search apps..."
- **Search scope:** Product name, badge state (L/B/N/W), category tags
- **Results:** Filtered icons replace the grid in real-time as the user types. If no matches, show "No apps found" centered in the grid area
- **Dismiss:** Tap outside, press Escape, or swipe up

---

## Dock

### Layout

- **Position:** Fixed at the bottom of the screen area, above the home indicator
- **Height:** ~90px
- **Background:** Frosted glass effect — `backdrop-filter: blur(20px)` with semi-transparent white/light overlay
- **Separator:** Subtle top border or shadow separating dock from the grid
- **Icons:** 4 pinned icons, evenly spaced
- **Persists:** Dock remains visible across all pages and during search

### Dock Contents

| Position | App | Notes |
|---|---|---|
| 1 | War Room | Links to the lexcorp-war-room app |
| 2 | TBD | Key Lexcorp product |
| 3 | TBD | Key Lexcorp product |
| 4 | George "G" Le | Personal site or portfolio |

Dock apps follow the same icon design as grid icons but may omit badges.

---

## App Icon — Component Spec

### Icon Image

- **Shape:** Rounded square (iOS superellipse / squircle), CSS `border-radius: 22.5%` approximation
- **Size:** 60px × 60px on desktop
- **Border:** None
- **Content:** Product icon artwork (provided per product)

### Name Label

- **Position:** Centered below the icon, 4px gap
- **Typography:** System sans-serif, 11px, medium weight
- **Color:** Dark gray (#333) on the light wallpaper
- **Truncation:** Single line, ellipsis if longer than ~8 characters
- **Max width:** 74px

### Notification Badge

- **Shape:** Circle (or rounded pill if two characters)
- **Size:** 20px diameter minimum, expands for wider content
- **Position:** Top-right corner of the icon, overlapping by ~6px
- **Background colors (WCAG AA compliant):**
  - `L` (Live): Green (#15803d)
  - `B` (Beta): Orange (#C2410C)
  - `N` (New): Blue (#0066CC)
  - `W` (Wishlist): Purple (#8B3FC1)
- **Text:** White, bold, 11px, single character centered
- **Border:** 2px solid white outline (to separate from icon artwork)

### Deprecated State

- **Icon:** Full icon with a CSS `grayscale(100%)` and `opacity: 0.5` filter
- **Badge:** None
- **Label:** Gray text, slightly more transparent
- **Interaction:** Still clickable (links to archived or final product URL)

### Interaction States

| State | Visual |
|---|---|
| Default | Icon at 100% scale, no transform |
| Hover | Scale to 105%, subtle upward lift shadow. Description tooltip appears after 400ms delay |
| Press / Active | Scale to 92% (iOS press-in effect), held for 150ms |
| Release | Spring back to 100%, then navigate to URL in new tab |
| Focus (keyboard) | 2px blue outline ring around the icon, 2px offset |
| Disabled | N/A — all icons are interactive |

### Description Tooltip

- **Trigger:** Hover (400ms delay) or long-press on touch
- **Position:** Centered above the icon, with a small downward-pointing caret
- **Content:** Short description text (1–2 lines)
- **Style:** Dark rounded rectangle (#333, 90% opacity), white text, 12px, 8px padding, max-width 200px
- **Dismiss:** Mouse leaves icon area, or tap elsewhere on touch

---

## Loading Animation — Primary Boot Screen

The primary route `/` starts with the boot screen and ends at the fully rendered phone with populated icons.

### Boot Screen (`/`)

1. **0–800ms:** Black screen fills the phone frame. `Lexcorp` fades and pops into view at the center of the splash screen.
2. **800–1600ms:** `made with ♥` fades in underneath while the first line remains visible.
3. **1600–2400ms:** `by George "G" Le` fades in underneath the existing lines.
4. **2400–2800ms:** Screen transitions to the wallpaper gradient. Status bar and icons fade in.
5. **2800ms+:** Dock slides up. Dynamic Island starts rotating through `Lexcorp`, `made with ♥`, and `by George "G" Le`.

### Reduced Motion

When `prefers-reduced-motion: reduce` is active, the boot sequence is skipped and the phone frame appears immediately at full opacity. Total transition: ≤200ms opacity fade.

---

## Responsive Behavior

### Desktop (≥1024px)

- Phone frame at full scale (~423px × 860px including frame)
- Centered horizontally and vertically with slight upward offset
- Logo above, legend below — all visible without scrolling
- Generous whitespace on all sides

### Tablet (768px–1023px)

- Phone frame scales to ~85% (`transform: scale(0.85)`)
- Logo and legend scale proportionally
- Still centered, whitespace reduced

### Mobile (< 768px)

- **Simplified frame:** Thin rounded border (2px) and subtle shadow replace the realistic bezel, Dynamic Island, and metallic edges
- Phone screen area fills ~90% of viewport width
- Status bar, icon grid, dock, and home indicator still rendered inside the simplified frame
- Logo and tagline stack above, reduced in size
- Legend moves below, single-line wrapping allowed
- Swipe pagination still works (native touch)
- Search: pull-down gesture

### Wide Desktop (≥1440px)

- Phone frame remains at 100% scale (does not grow larger)
- Extra whitespace absorbed by the background

---

## Visual Style Direction

### Typography

- **Primary font:** System font stack (`-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif`)
- **Icon labels:** 11px medium
- **Tagline:** 13px regular, uppercase tracking 0.05em
- **Legend:** 12px regular
- **Tooltip:** 12px regular
- **Status bar:** 12px semibold

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-gradient-start` | #f5f5f7 | Page background top |
| `--bg-gradient-end` | #ffffff | Page background bottom |
| `--frame-silver` | #e0e0e5 | Phone frame metallic tone |
| `--frame-silver-highlight` | #f0f0f3 | Frame top edge highlight |
| `--bezel-black` | #1c1c1e | Screen bezel and Dynamic Island |
| `--wallpaper-start` | #e8ecf4 | Wallpaper gradient top (soft blue-gray) |
| `--wallpaper-end` | #f5f0f6 | Wallpaper gradient bottom (soft lavender) |
| `--text-primary` | #1d1d1f | Icon labels, status bar |
| `--text-secondary` | #6e6e73 | Tagline, legend labels (WCAG AA compliant) |
| `--dock-blur-bg` | rgba(255,255,255,0.72) | Dock frosted glass |
| `--badge-live` | #15803d | Live badge (WCAG AA) |
| `--badge-beta` | #C2410C | Beta badge (WCAG AA) |
| `--badge-new` | #0066CC | New badge (WCAG AA) |
| `--badge-wishlist` | #8B3FC1 | Wishlist badge (WCAG AA) |
| `--shadow-primary` | rgba(0,0,0,0.15) | Phone drop shadow |

### Shadows

- Phone frame: multi-layer as specified in Frame Shell section
- Dock: `inset 0 1px 0 rgba(255,255,255,0.5)` top highlight
- Tooltip: `0 4px 12px rgba(0,0,0,0.15)`

---

## Accessibility

### Keyboard Navigation

- **Tab order:** Logo (skip link) → first icon in grid → left-to-right, top-to-bottom through grid → dock icons left-to-right → legend
- **Arrow keys:** Navigate grid spatially (up/down/left/right between icons)
- **Enter / Space:** Activate icon (triggers press animation + navigation)
- **Escape:** Close search overlay or dismiss tooltip
- **Page left/right:** Navigate between grid pages

### Screen Reader

- Phone frame: `role="region"` with `aria-label="Lexcorp product launcher"`
- Icon grid: `role="grid"` with `aria-label="Product apps"`
- Each icon: `role="gridcell"` containing an `<a>` with `aria-label="{Product Name}, {badge state}"` (e.g. "Alpha, Live"). Description conveyed via `aria-describedby` referencing the tooltip when visible.
- Badge: `aria-hidden="true"` (info conveyed via parent aria-label)
- Status bar: `aria-hidden="true"` (decorative easter eggs)
- Dock: `role="toolbar"` with `aria-label="Pinned apps"`
- Legend: visible text, no special ARIA needed
- Page indicator: `role="tablist"` with `aria-label="Page {n} of {total}"`

### Color and Contrast

- All badge colors pass WCAG AA against white text at their specified sizes
- Icon labels (#333 on light wallpaper) exceed 4.5:1 contrast ratio
- Focus outlines are blue (#007AFF) on light backgrounds — high visibility
- Deprecated grayscale icons maintain sufficient contrast for their labels

### Reduced Motion

- All entrance animations collapse to a ≤200ms opacity fade
- Swipe transitions become instant page switches
- Hover scale effects are disabled when `prefers-reduced-motion: reduce` is active (CSS media query in `globals.css`)
- Press animation is replaced by a simple opacity dim when reduced motion is active (CSS media query in `globals.css`)

---

## Implementation Notes

### Tech Recommendation

- **Framework:** React (Next.js) or vanilla with a lightweight framework — Vercel-native deployment
- **Animation:** CSS `@keyframes` + `transition` for most effects. Framer Motion if using React, or GSAP for vanilla. No Three.js needed — all 3D effects are achievable with CSS `transform`, `perspective`, and `box-shadow`
- **Swipe:** Touch events or a lightweight library like `react-swipeable` / Hammer.js
- **Data fetching:** `fetch()` at runtime with `products.json` fallback via `try/catch`
- **Search:** Client-side filter — no backend needed for the small product set

### Data Shape (Expected)

```json
{
  "products": [
    {
      "id": "war-room",
      "name": "War Room",
      "url": "https://...",
      "icon": "/icons/war-room.png",
      "description": "Lexcorp command center",
      "badge": "L",
      "category": ["internal", "tools"],
      "featured": true,
      "dock": true,
      "order": 1
    }
  ]
}
```

### Performance Budget

- First Contentful Paint: < 1.5s
- Animation start: < 500ms after FCP
- Total bundle: < 150KB gzipped (excluding icon images)

---

## App Store Drawer (Bottom Sheet)

> Added: 2026-05-18. Overrides previous non-goal "No in-app product detail pages."

### Trigger

Tapping any app icon (grid or dock) opens a bottom-sheet drawer instead of navigating directly to the external URL. This replaces the current `<a href target="_blank">` behavior.

### Layout

- **Style:** iOS-style bottom sheet, slides up from the bottom of the phone screen area
- **Height:** ~80% of the phone screen area
- **Backdrop:** Semi-transparent dark overlay behind the sheet (tap to dismiss)
- **Dismiss:** Swipe down, tap backdrop, or press Escape
- **Animation:** Framer Motion slide-up with spring easing, ~300ms

### Content (top to bottom)

1. **Header row (sticky):**
   - App icon (large, ~72px, same squircle shape as grid icons)
   - App name (bold, ~16px) with badge dot inline (same colored dot as grid badges)
   - "Open" CTA button (right-aligned, pill-shaped, filled blue/primary color, with external-link icon). Opens `product.url` in a new tab.
2. **Description:** Product description text (~14px, regular weight, muted color). Uses existing `description` field; falls back to `longDescription` when available.
3. **Screenshots carousel (conditional):** Horizontal scrollable row of screenshot images. Hidden entirely when `product.screenshots` is empty or absent.
4. **Testimonials (conditional):** Vertically stacked quote cards. Hidden entirely when `product.testimonials` is empty or absent.

### Data Model Changes

New optional fields on `Product`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `screenshots` | `string[]` | No | URLs or paths to screenshot images |
| `testimonials` | `{ text: string; author: string }[]` | No | User testimonials |
| `longDescription` | `string` | No | Extended description for the drawer |

When `screenshots` and `testimonials` are absent, the drawer shows only the header + description + CTA. This is the expected initial state for most products.

### Accessibility

- Drawer has `role="dialog"` with `aria-modal="true"` and `aria-label="{product name} details"`
- Focus is trapped within the drawer while open
- Escape key closes the drawer and returns focus to the icon that opened it
- "Open" button has `aria-label="Open {product name} in new tab"`
- Icons change from `<a>` to `<button>` (or `<a role="button">`) since they no longer navigate directly

### Keyboard Interaction

| Key | Action |
|---|---|
| Enter/Space on icon | Opens drawer |
| Escape | Closes drawer |
| Tab | Cycles through drawer content (CTA button, screenshots, etc.) |
| Enter on "Open" CTA | Opens external URL in new tab |

### Responsive Behavior

- **Desktop/Tablet:** Bottom sheet at ~80% of phone screen height, max content width matches phone screen
- **Mobile (simplified frame):** Same bottom sheet pattern, occupies ~80% of the visible phone area

---

## Open Questions

1. Which 3 apps fill the remaining dock slots alongside War Room?
2. What category/tag taxonomy should products use?
3. Exact Lexcorp logo asset (SVG preferred)
4. Whether the chosen animation variant should be configurable or hard-coded after selection
5. Product icon artwork source — does each product already have an iOS-style icon?

## Non-Goals

- No dark mode
- No user accounts or auth
- No app store marketplace features (ratings, reviews, install counts)
- No real push notifications or OS integration
- No native mobile app wrapper
