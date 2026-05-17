# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> All 6 implementation phases complete (2026-05-15)

## Priority Task Queue

- [x] `/research-roadmap` - Documentation scan complete (2026-05-15).
- [x] All implementation phases complete; documentation current; spec drift resolved.
- [x] Orphaned `tasks/manual-todo.md`: 1 non-blocking `_(after:...)_` item from Phase 6 remains unchecked (real device testing). Deferred to future work (2026-05-16).
- [x] Task pipeline is healthy; no issues found.

## Priority Documentation Todo

- [x] `/spec-drift fix all` - Resolved 7 spec drift items, added 1 implementation task. See `specs/drift-report.md`.
- [x] `/reconcile-dev-docs fix tasks` - Fixed Phase 5 milestone: checked 3 acceptance criteria, added completion date, filled On Completion section.

## Implementation Tasks (from spec drift)

- [x] Add `prefers-reduced-motion` support to AppIcon hover/press states — disable `hover:scale-105` and replace `active:scale-[0.92]` with opacity dim when reduced motion is active. File: `src/components/AppIcon.tsx`. Spec ref: `specs/ui-gapphub.md` § Reduced Motion.
  - **Implementation plan:**
    - Add a CSS `@media (prefers-reduced-motion: reduce)` block in `src/app/globals.css` that overrides AppIcon interactive states:
      - Disable `hover:scale-105`, `hover:shadow-lg`, `hover:-translate-y-0.5` — set `transform: none !important; box-shadow: none !important` on hover
      - Replace `active:scale-[0.92]` with `opacity: 0.7` on active
      - Keep `transition-all duration-150 ease-out` but for opacity only
    - Alternative approach: use the existing `useReducedMotion()` hook in AppIcon to conditionally apply different className strings. This is cleaner but requires reading the hook in every AppIcon instance.
    - **Recommended:** CSS media query approach — zero runtime cost, no React re-renders, applies universally. Add to `globals.css` targeting the AppIcon `<a>` elements inside `[role="gridcell"]` and `[role="toolbar"]`.
    - **Test updates:** Add 2 tests to `src/__tests__/Accessibility.test.tsx`:
      - Test: AppIcon hover classes include `hover:scale-105` (default)
      - Test: verify the CSS media query exists in globals.css (or mock `matchMedia` to test reduced-motion className branch if using the hook approach)
    - **Verification:** `npx tsc --noEmit` passes, `npm run lint` only pre-existing warnings, all tests pass, reduced-motion behavior confirmed
    - **Acceptance criteria:** When `prefers-reduced-motion: reduce` is active, hovering an AppIcon does not scale/lift and pressing dims via opacity instead of scaling down
    - **Ship-one-step handoff:** Implement only this task, validate it, then run `/ship` when done.
  - **Execution Profile:** serial, main agent, low conflict risk

> **Note:** Business research items (ICP, competitive analysis, positioning, GTM, monetization, metrics, landing copy, journey map) are not applicable — GappHub is a personal portfolio launcher, not a revenue-generating SaaS product. No concept-exploration needed; `research/concept-brief.md` already exists.

## Phase 6: Responsive, Accessibility & Polish (Complete)

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
- [x] Phone frame renders correctly at desktop, tablet, mobile, and wide desktop breakpoints
- [x] Mobile uses simplified frame without realistic bezel details
- [x] Tab key navigates through all interactive elements in logical order
- [x] Arrow keys navigate the icon grid spatially
- [x] Screen reader announces icon names, states, and "opens in new tab"
- [x] Reduced motion disables all animations and transitions
- [x] All text/background combinations pass WCAG AA contrast (4.5:1)
- [x] Touch targets meet 44×44px minimum on mobile viewports
- [x] Visual output matches spec across all breakpoints

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

- [x] Step 6.3: Implement full keyboard navigation for icon grid and dock
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

- [x] Step 6.4: Ensure touch targets meet 44×44px minimum and verify contrast
  - Files: modified `src/components/PageDots.tsx`, `src/components/AppIcon.tsx`, `src/components/BadgeLegend.tsx`, `src/components/PageContent.tsx`

- [x] Step 6.5: Visual polish pass — verify spec conformance
  - Files: modified `src/components/Dock.tsx`, `src/components/AppIcon.tsx`, `src/components/BadgeLegend.tsx`, `src/__tests__/Dock.test.tsx`

### Green
- [x] Step 6.6: Write regression tests covering Phase 6 acceptance criteria
  - Files: create `src/__tests__/Responsive.test.tsx`, create `src/__tests__/Accessibility.test.tsx`
  - **Implementation plan (Step 6.6):**
    - **`src/__tests__/Responsive.test.tsx`:**
      - Mock `useIsMobile` hook (from `src/hooks/useIsMobile.ts`) to control breakpoint detection
      - Test: PhoneFrame renders simplified frame at mobile (<768px) — assert `border-2`, `rounded-3xl`, no metallic gradient style, no Dynamic Island visual within frame
      - Test: PhoneFrame renders full realistic frame at desktop (≥1024px) — assert `rounded-[50px]`, metallic `background: linear-gradient(145deg, ...)` in inline styles
      - Test: PhoneFrame screen area maintains `role="region"` and `aria-label` at both mobile and desktop
      - Test: Mobile frame uses `w-[90vw]` and `max-w-[400px]`
    - **`src/__tests__/Accessibility.test.tsx`:**
      - Test: PhoneFrame screen area has `role="region"` and `aria-label="Lexcorp product launcher"`
      - Test: IconGrid has `role="grid"` and `aria-label="Product apps"`
      - Test: AppIcon `<a>` has composite `aria-label` with product name and badge state (e.g. "Test App, Live")
      - Test: Badge `<span>` has `aria-hidden="true"`
      - Test: StatusBar has `aria-hidden="true"`
      - Test: Dock has `role="toolbar"` and `aria-label="Pinned apps"`
      - Test: Dock glass uses spec opacity `bg-white/[0.72]` and inset highlight `shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]`
      - Test: PageDots buttons have minimum 44px tap target (`min-w-[44px] min-h-[44px]`)
    - **Key context:** `useIsMobile` uses `useSyncExternalStore` with `matchMedia` — mock `window.matchMedia` to control mobile/desktop. Existing test setup in `src/__tests__/setup.ts` already mocks `matchMedia` (default: `matches: false` = desktop). Use `vi.spyOn(window, 'matchMedia')` per-test for mobile overrides.
    - **Acceptance criteria:** `npx tsc --noEmit` passes, `npm run lint` only pre-existing warnings, all tests pass (66 existing + new), no regressions.
    - **Ship-one-step handoff:** Implement only Step 6.6, validate it, then run `/ship` when done.
  - **Execution Profile:** serial, main agent, low conflict risk

- [x] Step 6.7: Run all tests, verify they pass, build succeeds _(no-op: 82/82 tests pass, lint clean)_

### Milestone: Phase 6 — Responsive, Accessibility & Polish
**Acceptance Criteria:**
- [x] Phone frame renders correctly at desktop, tablet, mobile, and wide desktop breakpoints
- [x] Mobile uses simplified frame without realistic bezel details
- [x] Tab key navigates through all interactive elements in logical order
- [x] Arrow keys navigate the icon grid spatially
- [x] Screen reader announces icon names, states, and "opens in new tab"
- [x] Reduced motion disables all animations and transitions
- [x] All text/background combinations pass WCAG AA contrast (4.5:1)
- [x] Touch targets meet 44×44px minimum on mobile viewports
- [x] Visual output matches spec across all breakpoints
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion:**
- Deviations from plan: none
- Tech debt / follow-ups: `<img>` lint warning in AppIcon (intentional, local product icon PNGs do not need `next/image`)
- Ready for next phase: yes
