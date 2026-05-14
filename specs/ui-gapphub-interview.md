# GappHub — UI Interview Log

## Session Date

2026-05-14

## Manifest

The UI Assumptions Manifest was presented covering: single-page structure, no traditional shell, centered phone frame, 4-column icon grid, iOS-style rounded square icons, hover effects, animation on load, and responsive behavior. User confirmed the manifest was broadly correct, with one correction: status badges should look like iOS notification badges with a letter (not a number) representing the product state.

## Interview Questions & Decisions

### Round 1: Page Chrome, Frame Style, Status Bar

**Q: What appears outside the phone frame?**
- Options: Logo above / Logo below / Phone only
- Answer: Logo above phone with tagline "Made in Boston, Building in Public"

**Q: Which iPhone frame style?**
- Options: Dynamic Island (15+) / Notch (13/14) / Generic modern
- Answer: Dynamic Island (iPhone 15+)

**Q: Status bar indicators?**
- Options: Fake iOS indicators / Minimal empty
- Answer: Correlate indicators with real data as easter eggs — time = real time, signal = live products ratio, battery = % shipped

### Round 2: Easter Eggs, Legend, Badge States

**Q: Easter egg approach?**
- Options: Dynamic live data / Uptime counter / Mix and match
- Answer: Dynamic/live data

**Q: Badge legend placement?**
- Options: Below phone / Inside phone dock / Tooltip on hover
- Answer: Both below phone AND tooltip on hover

**Q: Badge states?**
- Options: L only / Multiple states / Custom
- Answer: Multiple states — L (Live), B (Beta), N (New), W (Wishlist). Deprecated apps are grayed out with no badge.

### Round 3: Sort Order, Pagination, Tap Behavior

**Q: Default sort order?**
- Options: Status priority / Manual curated / Recency
- Answer: Hybrid — Row 1: hot/trending/featured. Row 2: new. Rows 3+: live products with priority. Bottom row: wishlist. User filtering also available.

**Q: Pagination style?**
- Options: Swipe + dots / Vertical scroll / Swipe + dots + search
- Answer: Swipe + dots with pull-down search (iOS Spotlight style)

**Q: Tap behavior?**
- Options: New tab immediately / Press animation + new tab / Preview card then navigate
- Answer: Press animation (iOS press-in) then opens in new tab

### Round 4: Loading Animation, Mobile Viewport

**Q: Loading animation style?**
- Options: Boot screen / Slide up + fade / Assemble
- Answer: Build all three on separate routes (`/boot`, `/slide`, `/assemble`) so they can be compared live

**Q: Mobile viewport — keep phone frame?**
- Options: Keep the frame / Drop the frame / Simplified frame
- Answer: Simplified frame — minimal border/shadow, no realistic bezel detail

### Round 5: Search Scope, Dock

**Q: Search scope?**
- Options: Name only / Name + description + badge / Name + category/tags
- Answer: Name, badge state, and category/tags

**Q: Dock at bottom?**
- Options: Pinned apps / No dock / Dock with actions
- Answer: Pinned apps — War Room, key Lexcorp products, and George "G" Le relevant apps (4 total)

### Round 6: Wallpaper, Frame Depth

**Q: Wallpaper style?**
- Options: Subtle light gradient / Abstract mesh blob / Solid light color
- Answer: Subtle light gradient

**Q: Frame depth/realism?**
- Options: 3D with shadow / Slight tilt perspective / Flat 2D
- Answer: 3D with drop shadow and edge highlights

### Additional Context (User-Initiated)

**User asked: "Do we need Three.js?"**
- Answer: No. All 3D effects (shadow, depth, perspective) are achievable with CSS transforms, box-shadow, and standard animation libraries (Framer Motion / GSAP). Three.js would be unnecessary overhead for this scope.

**User noted: "We should also have a legend to explain the badges"**
- Incorporated as a legend below the phone frame + tooltip on badge hover.

## Coverage Checkpoint

Full checklist presented covering pages/routes, phone frame, icon grid, app icons, legend, outside frame elements, three animation variants, responsive behavior, and accessibility. User confirmed: "Complete, write it."

## Notable Changes From Concept Brief

| Topic | Concept Brief | Interview Decision |
|---|---|---|
| Badge style | Generic status badges ("New", "Beta") | iOS notification badge circles with single letters (L/B/N/W) |
| Deprecated handling | Not specified | Grayed out icons, no badge |
| Dock | Not specified | 4-app persistent dock (War Room + 3 TBD) |
| Search | Not specified | Pull-down Spotlight-style search |
| Pagination | Not specified (assumed scroll) | Swipe with iOS page dots, 24 icons per page |
| Loading animation | Single animation TBD | Three variants on separate routes for comparison |
| Status bar | Not specified | Live easter eggs (time, signal = live ratio, battery = shipped %) |
| Sort order | Not specified | Curated hybrid: featured → new → live → wishlist → deprecated |
| Legend | Not specified | Below phone + tooltip on hover |
