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

- [ ] Step 5.2: Build the `/boot` animation route
  - Files: create `src/app/boot/page.tsx`
  - Server component that fetches products and passes them + variant to `PageContent`
  - Animation sequence (all times from page load, using Framer Motion `useAnimate` or `AnimatePresence`):
    - 0–800ms: Black overlay fills phone screen, white Lexcorp logo SVG (80px wide) fades in at center with subtle scale pulse (1.0 → 1.05 → 1.0 loop)
    - 800–1200ms: Logo fades out, black overlay fades to reveal wallpaper gradient
    - 1200–1800ms: StatusBar fades in. Icons stagger in row-by-row (4 per row, 50ms delay per icon), each scaling from 80% → 100% with slight bounce (`type: "spring"`, `bounce: 0.3`)
    - 1800–2200ms: Dock slides up from `translateY(100%)` to `translateY(0)`. PageDots fade in
    - 2200ms+: Settled, all transforms removed
  - Reduced motion: skip all, show final state with ≤200ms opacity fade
  - Verify: `/boot` plays full sequence and ends at identical state to `/`

- [ ] Step 5.3: Build the `/slide` animation route
  - Files: create `src/app/slide/page.tsx`
  - Server component that fetches products and passes them + variant to `PageContent`
  - Animation sequence:
    - 0–600ms: Entire phone frame (including outer wrapper) slides up from `translateY(100px)` + `opacity: 0` → final position + `opacity: 1`, ease-out curve
    - 600–1200ms: StatusBar fades in first (200ms), then icons stagger in (40ms per icon, each scale 90% → 100% + fade 0 → 1)
    - 1200–1500ms: Dock fades in. PageDots appear
    - 1500ms+: Settled
  - Reduced motion: skip all, show final state with ≤200ms opacity fade
  - Verify: `/slide` plays full sequence and ends at identical state to `/`

- [ ] Step 5.4: Build the `/assemble` animation route
  - Files: create `src/app/assemble/page.tsx`
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

- [ ] Step 5.5: Polish animations and verify cross-route consistency
  - Files: modify `src/components/PageContent.tsx` (if needed), any animation route files
  - Visually compare all four routes side by side in the browser
  - Verify all three variant routes end at the exact same visual state as `/`
  - Check for jank: use browser DevTools Performance tab, verify animations use `transform`/`opacity` only (GPU-composited properties)
  - Test reduced motion: toggle `prefers-reduced-motion` in DevTools → all variants should collapse to ≤200ms fade
  - Fix any timing, easing, or layering issues found

### Green
- [ ] Step 5.6: Write regression tests covering Phase 5 acceptance criteria
  - Files: create `src/__tests__/Animations.test.tsx`
  - Test each route's page component renders without crashing
  - Test `useReducedMotion` hook returns correct value based on media query
  - Test that all animation routes render the same final content (same number of icons, same dock, same status bar)
  - Test that reduced motion class/attribute is applied when `prefers-reduced-motion` is active
  - Use `vi.stubGlobal` or `window.matchMedia` mock for reduced motion testing
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
