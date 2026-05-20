# Spec Drift Report — 2026-05-19

## Resolved (this audit)

- **Badge letter W → C**: Spec said `W = Wishlist (#8B3FC1)`. Code uses `C = Concept (#ef4444)`. Updated spec to match code across §Notification Badge, §Color Palette, §Badge Legend, §Search scope, §Sort Order.
- **Badge colors**: Updated all four badge color tokens to match implementation — `L: #22c55e`, `B: #eab308`, `N: #3b82f6`, `C: #ef4444`. Removed "(WCAG AA)" annotations from spec (original AA-compliant colors were replaced during visual tuning).
- **Icon size**: Spec said 60×60px. Code uses `ICON_SIZE = 54` (`AppIcon.tsx:32`). Updated spec to 54×54px.
- **Badge size**: Spec said 20px diameter. Code uses 18×18px (`AppIcon.tsx:125`). Updated spec to 18px.
- **Badge overlap**: Spec said ~6px. Code uses 3px (`-top-[3px] -right-[3px]`). Updated spec.
- **Label font size**: Spec said 11px. Code uses 10px (`text-[10px]` in `AppIcon.tsx:132`). Updated spec and §Typography.
- **Label max-width**: Spec said 74px. Code uses 68px (`max-w-[68px]` in `AppIcon.tsx:132`). Updated spec.
- **Grid vertical gap**: Spec said ~28px. Code uses 16px (`gap-y-4` in `IconGrid.tsx:13`). Updated spec.
- **Grid padding**: Spec said pt-76px pb-90px. Code uses pt-52px pb-120px (`IconGrid.tsx:13`). Updated spec.
- **Grid rows**: Spec said "6 rows (24 icons per page)". Code dynamically computes 3–6 rows via `useAvailableRows` hook. Updated spec.
- **Page dot colors**: Spec implied white/transparent dots. Code uses dark dots (`bg-[#1d1d1f]` / `bg-[#1d1d1f]/35` in `PageDots.tsx:28-29`). Updated spec with exact sizes and colors.
- **Drawer description fallback**: Spec said `description → longDescription`. Code does `longDescription ?? description` (`AppStoreDrawer.tsx:176`). Updated spec to match code.
- **Interaction States "Release"**: Spec said "navigate to URL in new tab". Since Phase 7, icons open the drawer. Updated §Interaction States.
- **Boot animation timing**: Spec said precise 0–800ms phases. Code uses ~1.1s per text beat, total ~3.7s. Updated spec with approximate phase timings.
- **Dynamic Island text cycling**: Spec said only "Static — no expanding or interactive states". Added documentation of `popLayout` mode and `will-change: transform` for flicker-free text transitions.
- **Reduced motion hover/press** (carried from prior report): Previously listed as "Remaining" but was implemented on 2026-05-15 via CSS media query in `globals.css`. Confirmed resolved.

## Resolved (prior audit, 2026-05-15)

- Badge colors updated from original (#34C759, #FF9500, #007AFF, #AF52DE) to WCAG AA values
- Text secondary color #86868b → #6e6e73
- AppIcon aria-label simplified
- Status bar signal/battery changed to static decorative
- Status bar height ~44px → ~48px
- Icon inner shadow removed from spec
- Lazy-loading removed from spec

## Verified (no drift)

- Phone frame `role="region"` + `aria-label="Lexcorp product launcher"` — matches
- Icon grid `role="grid"` + `aria-label="Product apps"` — matches
- Badge `aria-hidden="true"` — matches
- Status bar `aria-hidden="true"` — matches
- Dock `role="toolbar"` + `aria-label="Pinned apps"` — matches
- Dock `bg-white/[0.72]` + `backdrop-blur-[20px]` — matches
- Page indicator `role="tablist"` with numbered tab labels — matches
- Mobile simplified frame (border-2, rounded-3xl, shadow-md) — matches
- Tablet scale(0.85) — matches
- Screen area 375×812 aspect ratio — matches
- Icon label color #333 — matches
- Truncation via `max-w-[68px]` + `truncate` — matches
- Primary `/` route uses boot screen; former comparison routes removed — matches
- Entrance animation reduced motion ≤200ms fade — matches
- Reduced motion hover/press via CSS media query — matches
- App Store Drawer §Layout, §Content, §Accessibility, §Keyboard — matches
- Drawer data model (`screenshots`, `testimonials`, `longDescription`) — matches

## Undocumented Code (info only)

- `PhoneSwipeContext` — desktop mouse-drag swipe emulation, not mentioned in spec
- `useAvailableRows` hook — dynamic row calculation, now noted in §Icon Grid Layout
- Icon close button (×) on search overlay — not in spec
- Swipe-up-to-dismiss search — implementation detail of "swipe up" dismiss listed in spec

## Deferred

- Status bar data-driven easter egg (signal bars = Live count, battery = shipped ratio) — deferred to future work
- `metadata.title` says "gAppHub" (lowercase g, no subtitle) vs concept brief "GappHub — Lexcorp Products" — cosmetic, not blocking

## Archive

- Pre-update spec archived at: `docs/history/archive/2026-05-19/130000/specs/ui-gapphub.md`
- Pre-update drift report archived at: `docs/history/archive/2026-05-19/130000/specs/drift-report.md`
- Prior spec archive: `docs/history/archive/2026-05-15/141800/specs/ui-gapphub.md`
