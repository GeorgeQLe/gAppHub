# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 6 of 6 — Responsive, Accessibility & Polish
> Test strategy: tests-after

## Phase 6: Responsive, Accessibility & Polish

**Goal**: Ensure the app works across all viewport sizes, meets accessibility requirements, and has final visual polish.

**Scope**:
- Desktop (≥1024px): full-scale frame, centered, generous whitespace
- Tablet (768–1023px): frame at ~85% scale
- Mobile (<768px): simplified frame (thin border + subtle shadow, no realistic bezel/island), screen fills ~90% width
- Wide desktop (≥1440px): frame stays at 100%, extra whitespace absorbed
- Logo/tagline/legend scale and reflow for each breakpoint
- Keyboard navigation: tab order through icons, arrow key grid navigation, Enter/Space to activate
- Screen reader: `role="region"`, `role="grid"`, `role="gridcell"`, `role="toolbar"` with proper aria-labels
- Status bar: `aria-hidden="true"`
- Badges: `aria-hidden="true"` (info in parent aria-label)
- Page indicator: `role="tablist"` with page labels
- Color contrast: verify all text/bg combinations meet WCAG AA
- Touch targets: minimum 44×44px on mobile
- Final visual polish: verify all shadows, gradients, typography, and spacing match spec

**Acceptance Criteria:**
- [ ] Phone frame renders correctly at desktop, tablet, mobile, and wide desktop breakpoints
- [ ] Mobile uses simplified frame without realistic bezel details
- [ ] Tab key navigates through all interactive elements in logical order
- [ ] Arrow keys navigate the icon grid spatially
- [ ] Screen reader announces icon names, states, and "opens in new tab"
- [ ] Reduced motion disables all animations and transitions
- [ ] All text/background combinations pass WCAG AA contrast (4.5:1)
- [ ] Touch targets meet 44×44px minimum on mobile viewports
- [ ] Visual output matches spec across all breakpoints

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low (modifications to existing components, no new features)
**Review gates:** none

**Subagent lanes:** none

### Implementation

- [x] Step 6.1: Add responsive breakpoints to PhoneFrame and page layout
  - Files: modify `src/components/PhoneFrame.tsx`, modify `src/components/PageContent.tsx`
  - **PhoneFrame changes:**
    - Desktop (≥1024px): current full-scale (~375px screen width, realistic bezel + metallic frame) — no change needed
    - Tablet (768–1023px): wrap outer frame in a container with `transform: scale(0.85)` via Tailwind `md:scale-85` or media query
    - Mobile (<768px): replace realistic bezel (metallic gradient, thick padding, rounded-[50px]) with simplified frame: thin 2px rounded border (`border-2 border-gray-300 rounded-3xl`), subtle shadow, no metallic gradient, no Dynamic Island visual. Screen area fills ~90% viewport width instead of fixed 375px
    - Wide desktop (≥1440px): no scaling change, frame stays at 100%
    - Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) or CSS media queries
    - PhoneFrame needs a `simplified` prop or internal breakpoint detection to swap bezel rendering
  - **PageContent changes:**
    - Logo/tagline: reduce font sizes on mobile (`text-lg` → smaller on `sm:`)
    - BadgeLegend: allow wrapping, reduce font size on mobile
    - Ensure no horizontal overflow at any breakpoint
  - **Verification:** Dev server renders correctly at 375px, 768px, 1024px, 1440px viewports

- [x] Step 6.2: Add comprehensive ARIA roles and labels for screen readers
  - Files: modify `src/components/PhoneFrame.tsx`, modify `src/components/IconGrid.tsx`, modify `src/components/AppIcon.tsx`, modify `src/components/Dock.tsx`, modify `src/components/StatusBar.tsx`, modify `src/components/PageDots.tsx`

- [ ] Step 6.3: Implement full keyboard navigation for icon grid and dock
  - Files: modify `src/components/IconGrid.tsx`, modify `src/components/AppIcon.tsx`, modify `src/components/Dock.tsx`
  - **IconGrid keyboard navigation:**
    - Currently supports ArrowLeft/ArrowRight for page navigation on the grid container
    - Add Up/Down/Left/Right arrow key navigation between individual icons within the grid (4-column spatial navigation)
    - Each `<a>` in the grid should be focusable (already is) — add `roving tabindex` pattern: only the active icon has `tabIndex={0}`, others have `tabIndex={-1}`
    - Arrow keys move focus between icons: Left/Right move horizontally, Up/Down move between rows, wrapping at row edges advances to next/previous row
    - Enter/Space on a focused icon triggers navigation (already handled by `<a>` default behavior)
    - Tab from last grid icon should move to first dock icon
  - **Dock keyboard navigation:**
    - Add Left/Right arrow key navigation between dock icons
    - Same roving tabindex pattern
    - Tab from dock should move to legend
  - **Tab order:** Logo (skip) → first grid icon → (arrow keys within grid) → Tab → first dock icon → (arrow keys within dock) → Tab → legend
  - **Verification:** Navigate entire UI using only keyboard, verify all icons reachable
  - **Implementation plan (Step 6.3):**
    - `src/components/IconGrid.tsx`:
      - Add `focusedIndex` state (number, default 0) tracking which icon within the current page has roving focus
      - Move the `onKeyDown` handler from the container div to inside the grid page divs or delegate from container
      - Arrow key logic: Left/Right move `focusedIndex ± 1` within current page (wrap at page boundary triggers page change), Up/Down move `focusedIndex ± 4` (4-column grid)
      - When `focusedIndex` changes, call `.focus()` on the corresponding `<a>` element via refs
      - Pass `tabIndex={focusedIndex === i ? 0 : -1}` to each `AppIcon` (or the gridcell wrapper)
      - Remove the existing `tabIndex={0}` from the container div (icons themselves will be focusable)
      - Preserve existing ArrowLeft/ArrowRight page navigation when focus is on the container (not on an icon)
    - `src/components/AppIcon.tsx`:
      - Accept optional `tabIndex` prop and forward it to the `<a>` element
      - Accept optional `onKeyDown` callback prop for keyboard nav delegation
    - `src/components/Dock.tsx`:
      - Add `focusedIndex` state for roving tabindex across dock icons
      - Add `onKeyDown` handler: ArrowLeft/ArrowRight move between dock icons
      - Pass `tabIndex` to each dock `AppIcon`
    - Approach: roving tabindex pattern — only one element per group has `tabIndex={0}`, rest have `tabIndex={-1}`. Arrow keys move focus within group, Tab moves between groups.
    - Key decisions: Use `useRef` array to hold refs to `<a>` elements for programmatic `.focus()`. Page changes triggered by arrow nav at boundaries should auto-focus first/last icon on new page.
    - Acceptance criteria: `npx tsc --noEmit` passes, `npm run lint` only pre-existing warnings, all 66 tests pass, keyboard-only navigation reaches every icon.
    - **Ship-one-step handoff:** Implement only Step 6.3, validate it, then run `/ship` when done.

- [ ] Step 6.4: Ensure touch targets meet 44×44px minimum and verify contrast
  - Files: modify `src/components/AppIcon.tsx` (if needed), modify `src/components/PageDots.tsx` (if needed)
  - **Touch targets:**
    - AppIcon `<a>` elements: icons are 60×60px — already meets 44px minimum
    - PageDots buttons: currently 6-8px dots — add min 44×44px tap area via padding or invisible hit target (`min-w-[44px] min-h-[44px]`)
    - Dock icons: same as AppIcon, 60×60px — OK
    - SearchOverlay dismiss button/backdrop: full-screen — OK
  - **Color contrast audit (WCAG AA 4.5:1):**
    - Icon labels: `#333` on wallpaper gradient (`#e8ecf4`→`#f5f0f6`) — verify ≥4.5:1
    - Tagline: `#86868b` on page background (`#f5f5f7`) — verify ≥4.5:1 (may need darkening)
    - Badge text: white on colored backgrounds (L=#34C759, B=#FF9500, N=#007AFF, W=#AF52DE) — verify at 11px bold
    - Status bar text: `#1d1d1f` on wallpaper — high contrast, OK
    - Deprecated label: `text-gray-400` on wallpaper — verify or darken
    - Fix any contrast failures found
  - **Verification:** All tap targets ≥44px, all text passes 4.5:1 contrast ratio

- [ ] Step 6.5: Visual polish pass — verify spec conformance
  - Files: modify any component files as needed
  - **Check against spec (specs/ui-gapphub.md):**
    - Typography: verify all font sizes match spec (icon labels 11px, tagline 13px, legend 12px, tooltip 12px, status bar 12px)
    - Shadows: phone frame multi-layer, dock inset highlight (`inset 0 1px 0 rgba(255,255,255,0.5)`), tooltip shadow (`0 4px 12px rgba(0,0,0,0.15)`)
    - Gradients: page background, phone frame metallic, wallpaper — all match spec color tokens
    - Spacing: logo to tagline, tagline to phone, phone to legend — proportional at all breakpoints
    - Dock glass: `rgba(255,255,255,0.72)` per spec (currently `bg-white/60` = 0.60) — fix if needed
  - **Reduced motion:** already implemented in Phase 5, verify no new CSS transitions introduced without `motion-safe` guards
  - **Verification:** Visual comparison against spec at each breakpoint

### Green
- [ ] Step 6.6: Write regression tests covering Phase 6 acceptance criteria
  - Files: create `src/__tests__/Responsive.test.tsx`, create `src/__tests__/Accessibility.test.tsx`
  - **Responsive tests:**
    - PhoneFrame renders simplified frame when viewport < 768px (mock `window.innerWidth` or use container queries)
    - PhoneFrame renders full realistic frame at ≥1024px
    - Layout has no horizontal overflow at 375px viewport
  - **Accessibility tests:**
    - PhoneFrame screen area has `role="region"` and correct `aria-label`
    - IconGrid has `role="grid"` and `aria-label="Product apps"`
    - AppIcon `<a>` has comprehensive `aria-label` with name, badge state, description, and "Opens in new tab"
    - Badge `<span>` has `aria-hidden="true"`
    - StatusBar has `aria-hidden="true"`
    - Dock has `role="toolbar"` and `aria-label="Pinned apps"`
    - Arrow key navigation moves focus between grid icons
    - PageDots buttons have minimum 44px tap target dimensions
  - **Verification:** All tests pass, no regressions in 66 existing tests

- [ ] Step 6.7: Run all tests, verify they pass, build succeeds _(will be no-op if 6.6 tests pass)_

### Milestone: Phase 6 — Responsive, Accessibility & Polish
**Acceptance Criteria:**
- [ ] Phone frame renders correctly at desktop, tablet, mobile, and wide desktop breakpoints
- [ ] Mobile uses simplified frame without realistic bezel details
- [ ] Tab key navigates through all interactive elements in logical order
- [ ] Arrow keys navigate the icon grid spatially
- [ ] Screen reader announces icon names, states, and "opens in new tab"
- [ ] Reduced motion disables all animations and transitions
- [ ] All text/background combinations pass WCAG AA contrast (4.5:1)
- [ ] Touch targets meet 44×44px minimum on mobile viewports
- [ ] Visual output matches spec across all breakpoints
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
