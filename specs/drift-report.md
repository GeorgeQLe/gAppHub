# Spec Drift Report — 2026-05-15

## Resolved

- **Badge colors** — updated spec from original (#34C759, #FF9500, #007AFF, #AF52DE) to WCAG AA-compliant values (#15803d, #C2410C, #0066CC, #8B3FC1) matching implementation
- **Text secondary color** — updated spec from #86868b to #6e6e73 (WCAG AA compliant on #f5f5f7)
- **AppIcon aria-label** — updated spec from verbose `"{Name} — {badge}. {description}. Opens in new tab."` to implemented `"{Name}, {statusLabel}"` with `aria-describedby` for tooltip descriptions
- **Status bar signal/battery** — updated spec from data-driven (Live count → signal bars, shipped ratio → battery %) to static decorative values (4 bars, 100%)
- **Status bar height** — updated spec from ~44px to ~48px (accommodates Dynamic Island alignment)
- **Icon inner shadow** — removed "1px subtle white inner shadow" from spec (not implemented, not needed)
- **Lazy-loading** — removed from spec (24 SVG icons, negligible benefit)

## Implementation Tasks Added

- **Reduced motion hover/press** — spec describes disabling hover:scale-105 and replacing active:scale-[0.92] with opacity dim when `prefers-reduced-motion: reduce` is active. Currently only entrance animations respect reduced motion. Added to `tasks/todo.md`.

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
- Truncation via max-w-[74px] + truncate — matches
- All 4 routes (/, /boot, /slide, /assemble) — matches
- Entrance animation reduced motion ≤200ms fade — matches

## Deferred

- Status bar data-driven easter egg (signal bars = Live count, battery = shipped ratio) — deferred to future work
- Icon lazy-loading — removed from spec, not needed for current icon count

## Archive

- Pre-update spec archived at: `docs/history/archive/2026-05-15/141800/specs/ui-gapphub.md`
