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

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
