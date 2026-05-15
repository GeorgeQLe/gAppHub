# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 5 of 6 — Loading Animations
> Test strategy: tests-after

## Phase 5: Loading Animations

**Goal**: Implement three entrance animation variants on separate routes (`/boot`, `/slide`, `/assemble`) so the user can compare them side by side and choose a winner for the main route.

**Scope**:
- `/boot` route: black screen → Lexcorp logo pulse → wallpaper fade → icons stagger row-by-row → dock slides up (total ~2.2s)
- `/slide` route: phone frame slides up + fades in → status bar → icons stagger + fade → dock fades in (total ~1.5s)
- `/assemble` route: frame sides slide in → seam flash → screen fade → Dynamic Island pop → icons drop with bounce → dock slides up (total ~2.3s)
- Main `/` route: simple fade-in as interim default
- `prefers-reduced-motion`: all variants collapse to ≤200ms opacity fade
- Animation implemented with CSS @keyframes + Framer Motion (or GSAP)

**Acceptance Criteria:**
- [ ] `/boot` plays the boot screen animation sequence as specified
- [ ] `/slide` plays the slide-up + fade animation sequence as specified
- [ ] `/assemble` plays the frame assembly animation sequence as specified
- [ ] All three routes end at the identical final state (fully rendered phone with icons)
- [ ] Main `/` route uses a simple fade-in as temporary default
- [ ] Reduced motion preference disables all animations, replacing with a quick opacity fade
- [ ] Animations feel smooth at 60fps with no visible jank
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low (new route files + shared wrapper; existing components unchanged)
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [x] Step 5.1: Install Framer Motion and create shared page wrapper + reduced motion hook
  - Files: modify `package.json`, create `src/hooks/useReducedMotion.ts`, create `src/components/PageContent.tsx`, modify `src/app/page.tsx`
  - Install `framer-motion` as a dependency
  - Create `useReducedMotion` hook: listens to `prefers-reduced-motion` media query, returns boolean
  - Extract the shared page content from `page.tsx` into `PageContent` — a client component that accepts `animationVariant` prop (`"none" | "boot" | "slide" | "assemble"`)
  - `PageContent` fetches products (via props from server page) and renders logo, tagline, PhoneFrame children, and BadgeLegend
  - The existing children (StatusBar, DynamicIsland, IconGrid, Dock, HomeIndicator) become animation targets via wrapper divs or Framer Motion `motion.*` components
  - Main `/` page.tsx: render `PageContent` with `variant="none"` and a simple 200ms fade-in on the entire content
  - Verify: app still renders identically on `/`, all 55 tests pass, `npm run build` succeeds

- [x] Step 5.2: Build the `/boot` animation route
  - Files: create `src/app/boot/page.tsx`, modify `src/components/PageContent.tsx`
  - Server component that fetches products and passes them + variant to `PageContent`
  - Animation sequence (all times from page load, using Framer Motion `useAnimate` or `AnimatePresence`):
    - 0–800ms: Black overlay fills phone screen, white Lexcorp logo SVG (80px wide) fades in at center with subtle scale pulse (1.0 → 1.05 → 1.0 loop)
    - 800–1200ms: Logo fades out, black overlay fades to reveal wallpaper gradient
    - 1200–1800ms: StatusBar fades in. Icons stagger in row-by-row (4 per row, 50ms delay per icon), each scaling from 80% → 100% with slight bounce (`type: "spring"`, `bounce: 0.3`)
    - 1800–2200ms: Dock slides up from `translateY(100%)` to `translateY(0)`. PageDots fade in
    - 2200ms+: Settled, all transforms removed
  - Reduced motion: skip all, show final state with ≤200ms opacity fade
  - Verify: `/boot` plays full sequence and ends at identical state to `/`

  **Implementation plan:**

  1. **Create `src/app/boot/page.tsx`** — async server component identical to `src/app/page.tsx` but passes `variant="boot"` to `PageContent`

  2. **Extend `PageContent` for `variant="boot"`** in `src/components/PageContent.tsx`:
     - When `variant === "boot"` and `!reducedMotion`, orchestrate a multi-phase animation sequence:
       - **Phase 1 (0–800ms):** Render a black overlay (`position: absolute`, `inset: 0`, `z-index: 50`) inside the PhoneFrame area. Center a white LEXCORP SVG (80px wide) with a looping scale pulse (`animate={{ scale: [1, 1.05, 1] }}`, `transition={{ repeat: Infinity, duration: 1 }}`). Both overlay and logo fade in from opacity 0.
       - **Phase 2 (800–1200ms):** Logo fades out, black overlay fades out to reveal the wallpaper/content beneath.
       - **Phase 3 (1200–1800ms):** StatusBar fades in. IconGrid icons stagger in row-by-row (4 per row, 50ms delay per icon). Each icon scales from 0.8 → 1.0 with spring bounce (`type: "spring"`, `bounce: 0.3`).
       - **Phase 4 (1800–2200ms):** Dock slides up from `translateY(100%)` → `translateY(0)`. PageDots fade in.
       - **Phase 5 (2200ms+):** Settled, all animation wrappers removed or at final values.
     - Use `useState` for a phase counter or `useAnimate` from Framer Motion to orchestrate timing via `setTimeout` or Framer's `sequence` API.
     - Children components (StatusBar, IconGrid, Dock) need to be individually wrapped in `motion.div` elements for staggered control. Consider passing animation state as props or using CSS visibility to initially hide elements.
     - The boot overlay (black screen + logo) is an additional element layered on top of the phone content.

  3. **Key patterns from Step 5.1:**
     - `PageContent` already has the `variant` prop and `useReducedMotion` hook wired up
     - When `reducedMotion` is true, skip all boot animation and render with ≤200ms opacity fade (same as `variant="none"`)
     - Product type imported from `@/types/product`
     - `matchMedia` mock in `src/__tests__/setup.ts` handles test environment

  4. **Verification:**
     - `npx tsc --noEmit` passes
     - `npm run build` succeeds
     - All 55 existing tests pass (no regressions)
     - Dev server: `/boot` plays the full 2.2s boot sequence
     - Dev server: `/boot` ends at the identical visual state as `/`
     - Dev server: toggling `prefers-reduced-motion` in DevTools shows instant render on `/boot`

  ### Execution Profile
  **Parallel mode:** serial
  **Integration owner:** main agent
  **Conflict risk:** low (new route file + extending existing PageContent)

  **Ship-one-step handoff:** Implement only Step 5.2, validate it, then run `/ship` when done.

- [x] Step 5.3: Build the `/slide` animation route
  - Files: create `src/app/slide/page.tsx`, modify `src/components/PageContent.tsx`
  - Server component that fetches products and passes them + variant to `PageContent`
  - Animation sequence:
    - 0–600ms: Entire phone frame (including outer wrapper) slides up from `translateY(100px)` + `opacity: 0` → final position + `opacity: 1`, ease-out curve
    - 600–1200ms: StatusBar fades in first (200ms), then icons stagger in (40ms per icon, each scale 90% → 100% + fade 0 → 1)
    - 1200–1500ms: Dock fades in. PageDots appear
    - 1500ms+: Settled
  - Reduced motion: skip all, show final state with ≤200ms opacity fade
  - Verify: `/slide` plays full sequence and ends at identical state to `/`

  **Implementation plan:**

  1. **Create `src/app/slide/page.tsx`** — async server component identical to `src/app/page.tsx` / `src/app/boot/page.tsx` but passes `variant="slide"` to `PageContent`

  2. **Extend `PageContent` for `variant="slide"`** in `src/components/PageContent.tsx`:
     - Follow the same pattern as boot: use `useState<SlidePhase>` (0–4) with `useEffect` scheduling `setTimeout` chain
     - When `variant === "slide"` and `!reducedMotion`, orchestrate:
       - **Phase 1 (0–600ms):** The entire `<main>` content wrapper (logo + tagline + PhoneFrame + BadgeLegend) slides up from `translateY(100px)` + `opacity: 0` → final position + `opacity: 1`, ease-out. Use `motion.main` wrapping the content.
       - **Phase 2 (600–1200ms):** StatusBar fades in (200ms). Icons stagger in — each icon scales from 0.9 → 1.0 and fades from 0 → 1, with 40ms delay per icon. This likely needs the `IconGrid` content wrapped in a `motion.div` or individual icon wrappers with `staggerChildren`.
       - **Phase 3 (1200–1500ms):** Dock fades in from opacity 0 → 1. PageDots fade in simultaneously.
       - **Phase 4 (1500ms+):** Settled, all animation wrappers at final values.
     - Unlike boot, the slide variant doesn't need a separate `SlidePhoneContent` component — the phone content structure is the same as the default, just wrapped in motion divs. The main difference is the outer wrapper slides up.
     - May need a `SlidePhoneContent` sub-component if individual child wrappers are needed for StatusBar/IconGrid/Dock fade-in timing.

  3. **Key patterns from Step 5.2:**
     - Boot used `BootPhoneContent` to swap phone internals — slide can follow same pattern for per-child animation wrappers
     - Phase state + setTimeout chain pattern works well
     - `AnimatePresence` only needed for elements that mount/unmount (boot overlay); slide elements are always present, just animated
     - Reduced motion path: render the default (non-animated) phone content with 200ms opacity fade

  4. **Verification:**
     - `npx tsc --noEmit` passes
     - All 55 existing tests pass (no regressions)
     - Dev server: `/slide` plays the full ~1.5s slide-up sequence
     - Dev server: `/slide` ends at the identical visual state as `/`
     - Dev server: toggling `prefers-reduced-motion` shows instant render on `/slide`
     - Note: `npm run build` has a pre-existing static generation timeout (not caused by our changes)

  ### Execution Profile
  **Parallel mode:** serial
  **Integration owner:** main agent
  **Conflict risk:** low (new route file + extending existing PageContent)

  **Ship-one-step handoff:** Implement only Step 5.3, validate it, then run `/ship` when done.

- [x] Step 5.4: Build the `/assemble` animation route
  - Files: create `src/app/assemble/page.tsx`, modify `src/components/PageContent.tsx`
  - Server component that fetches products and passes them + variant to `PageContent`
  - Animation sequence:
    - 0–400ms: Phone frame split into left/right halves (using clip-path or separate divs), sliding in from off-screen horizontally. Top/bottom edges slide in vertically
    - 400–700ms: Frame pieces meet, brief white flash/highlight along seam lines (opacity pulse on a border overlay)
    - 700–900ms: Screen area transitions from black to wallpaper gradient
    - 900–1400ms: Dynamic Island pops in (scale 0 → 1 with bounce). StatusBar slides in from the sides
    - 1400–2000ms: Icons drop in from above (translateY -30px → 0) one by one, 30ms stagger, soft bounce landing
    - 2000–2300ms: Dock slides up. PageDots fade in
    - 2300ms+: Settled
  - Reduced motion: skip all, show final state with ≤200ms opacity fade
  - This is the most complex variant — may need to simplify the frame-split effect if CSS clip-path approach proves unwieldy. Fallback: frame fades from transparent → opaque instead of splitting
  - Verify: `/assemble` plays full sequence and ends at identical state to `/`

  _(Completed: 7-phase assembly animation with clip-path frame halves, seam flash, spring physics on DI/StatusBar/icons/dock)_

- [x] Step 5.5: Polish animations and verify cross-route consistency
  - Files: modify `src/components/PageContent.tsx` (if needed), any animation route files
  - Visually compare all four routes side by side in the browser
  - Verify all three variant routes end at the exact same visual state as `/`
  - Check for jank: use browser DevTools Performance tab, verify animations use `transform`/`opacity` only (GPU-composited properties)
  - Test reduced motion: toggle `prefers-reduced-motion` in DevTools → all variants should collapse to ≤200ms fade
  - Fix any timing, easing, or layering issues found

  **Implementation plan:**

  1. **Start dev server** and visually review all 4 routes (`/`, `/boot`, `/slide`, `/assemble`):
     - Confirm each animation plays to completion without visual glitches
     - Verify all 3 variant routes end at identical final state (same StatusBar, DynamicIsland, IconGrid, Dock, HomeIndicator layout)
     - Check that no z-index conflicts cause elements to overlap incorrectly during animation phases

  2. **Review animation properties for GPU compositing:**
     - Audit `src/components/PageContent.tsx` — all animated properties should be `transform` and `opacity` only (GPU-composited)
     - `clip-path` in assemble Phase 1 is NOT GPU-composited on all browsers — if jank is observed, replace with `translateX` + `overflow: hidden` approach or simple opacity fade fallback
     - Document any properties that can't be changed without breaking the visual effect

  3. **Test reduced motion on all variant routes:**
     - Toggle `prefers-reduced-motion: reduce` in browser DevTools (or via system settings)
     - Verify all 4 routes (`/`, `/boot`, `/slide`, `/assemble`) render with ≤200ms opacity fade, no animation sequences
     - Verify final visual state matches between reduced-motion and non-reduced-motion

  4. **Fix any issues found** — timing, easing, layering, z-index, or jank problems

  5. **Verification:**
     - `npx tsc --noEmit` passes
     - `npm run lint` — only pre-existing warnings (not in modified files)
     - All 55 existing tests pass (no regressions)
     - All 4 routes visually correct in browser

  ### Execution Profile
  **Parallel mode:** serial
  **Integration owner:** main agent
  **Conflict risk:** low (modifications to existing PageContent only if issues found)

  _(Completed: Audited all 4 routes — final states consistent, all animations use transform/opacity except brief clip-path on lightweight overlays in assemble Phase 1, reduced motion correctly collapses to ≤200ms fade. No code changes needed. 55/55 tests pass, tsc clean, lint only pre-existing warnings.)_

  **Ship-one-step handoff:** Implement only Step 5.6, validate it, then run `/ship` when done.

### Green
- [ ] Step 5.6: Write regression tests covering Phase 5 acceptance criteria
  - Files: create `src/__tests__/Animations.test.tsx`
  - Test each route's page component renders without crashing
  - Test `useReducedMotion` hook returns correct value based on media query
  - Test that all animation routes render the same final content (same number of icons, same dock, same status bar)
  - Test that reduced motion class/attribute is applied when `prefers-reduced-motion` is active
  - Use `vi.stubGlobal` or `window.matchMedia` mock for reduced motion testing

  **Implementation plan:**

  1. **Create `src/__tests__/Animations.test.tsx`** with these test groups:

     **PageContent rendering (4 variants):**
     - `variant="none"` renders StatusBar, DynamicIsland, IconGrid, Dock, HomeIndicator, BadgeLegend
     - `variant="boot"` renders same final content (at settled phase 5)
     - `variant="slide"` renders same final content (at settled phase 4)
     - `variant="assemble"` renders same final content (at settled phase 7)
     - All 4 variants render the LEXCORP SVG logo and tagline text

     **useReducedMotion hook:**
     - Returns `false` when `prefers-reduced-motion` media query doesn't match
     - Returns `true` when `prefers-reduced-motion: reduce` matches
     - Updates when media query changes (simulate via `change` event on mql mock)

     **Reduced motion behavior on animation variants:**
     - When reduced motion is active, boot/slide/assemble variants skip animation phases (render at final state immediately)
     - The wrapping `motion.div` gets `opacity` animation with `duration: 0.2`

     **Cross-route consistency:**
     - All 4 variants render the same number of app icons (20 grid icons)
     - All 4 variants render the same number of dock icons (4)
     - StatusBar time display present in all variants at settled state

  2. **Testing approach:**
     - Mock `window.matchMedia` per-test to control reduced motion state (override the global mock from `src/__tests__/setup.ts`)
     - Use `vi.useFakeTimers()` and `vi.advanceTimersByTime()` to fast-forward animation phases to settled state
     - Import `PageContent` directly (not the async route pages) — pass mock product data
     - Use `makeProduct()` helper (same pattern as existing test files) for test data
     - The existing `src/__tests__/setup.ts` already mocks `matchMedia` with `matches: false` — override with `vi.spyOn` for reduced-motion tests

  3. **Key files:**
     - Create: `src/__tests__/Animations.test.tsx`
     - Read (reference): `src/components/PageContent.tsx`, `src/hooks/useReducedMotion.ts`, `src/__tests__/setup.ts`

  4. **Verification:**
     - `npx tsc --noEmit` passes
     - `npm run lint` — only pre-existing warnings
     - All tests pass (55 existing + new animation tests)
     - No regressions in any existing test file

  ### Execution Profile
  **Parallel mode:** serial
  **Integration owner:** main agent
  **Conflict risk:** low (new test file only, no source changes)

  **Ship-one-step handoff:** Implement only Step 5.6, validate it, then run `/ship` when done.

- [ ] Step 5.7: Run all tests, verify they pass, build succeeds with `npm run build` _(will be no-op if 5.6 tests pass)_

### Milestone: Phase 5 — Loading Animations
**Acceptance Criteria:**
- [ ] `/boot` plays the boot screen animation sequence as specified
- [ ] `/slide` plays the slide-up + fade animation sequence as specified
- [ ] `/assemble` plays the frame assembly animation sequence as specified
- [ ] All three routes end at the identical final state (fully rendered phone with icons)
- [ ] Main `/` route uses a simple fade-in as temporary default
- [ ] Reduced motion preference disables all animations, replacing with a quick opacity fade
- [ ] Animations feel smooth at 60fps with no visible jank
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
