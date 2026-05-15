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

**Parallelization:** serial

**Coordination Notes:** Depends on all visual components from Phases 1–4 being in place. Each animation variant is independent of the others but all use the same final-state components.

**On Completion:**
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase: yes/no
