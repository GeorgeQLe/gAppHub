# GappHub — Phase 7 Archive

> Project: GappHub (Lexcorp product portfolio launcher)
> Phase: 7 of 7 — App Store Drawer
> Test strategy: tests-after
> Completed: 2026-05-19

## Phase 7: App Store Drawer

**Goal**: Replace direct external link-out on icon tap with a bottom-sheet drawer that shows app details (icon, title, badge, description, optional screenshots, optional testimonials) and an explicit "Open" CTA that navigates to the product URL. This sets user expectations before navigating away from GappHub.

**Scope**:
- Expand `Product` type with optional `screenshots`, `testimonials`, and `longDescription` fields
- Build `AppStoreDrawer` bottom-sheet component (~80% phone screen height, Framer Motion slide-up)
- Convert icon tap behavior: `<a href>` → opens drawer; "Open" CTA in drawer → `target="_blank"` navigation
- Apply to both grid and dock icons
- Backdrop overlay with tap-to-dismiss
- Swipe-down to dismiss
- Keyboard accessible: Escape to close, focus trap, Tab cycles through drawer content
- ARIA: `role="dialog"`, `aria-modal="true"`, focus return to triggering icon on close
- Screenshots: horizontal scrollable carousel (hidden when empty)
- Testimonials: stacked quote cards (hidden when empty)
- Header: large icon (72px) + app name with badge dot + "Open" pill button with external-link icon

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium (modifies AppIcon click behavior, touches Dock)
**Review gates:** none

**Subagent lanes:** none

### Implementation
- [x] Step 7.1: Expand `Product` type with optional drawer fields
  - Files: modify `src/types/product.ts`
- [x] Step 7.2: Build the `AppStoreDrawer` component
  - Files: create `src/components/AppStoreDrawer.tsx`
- [x] Step 7.3: Convert AppIcon from link to button and add `onSelect` callback
  - Files: modify `src/components/AppIcon.tsx`
- [x] Step 7.4: Wire drawer state into PageContent, IconGrid, and Dock
  - Files: modify `src/components/PageContent.tsx`, `src/components/IconGrid.tsx`, `src/components/Dock.tsx`
- [x] Step 7.5: Polish, reduced motion, and edge cases
  - Files: modify `src/components/PageContent.tsx`, `src/components/IconGrid.tsx`

### Green
- [x] Step 7.6: Write regression tests covering acceptance criteria
  - Files: create `src/__tests__/AppStoreDrawer.test.tsx`, modify `src/__tests__/Interactions.test.tsx`, modify `src/__tests__/Dock.test.tsx`
- [x] Step 7.7: Run all tests, verify they pass, `npx tsc --noEmit` succeeds, `npm run lint` has only pre-existing warnings, `next build` succeeds

### Milestone: Phase 7 — App Store Drawer ✓ (completed 2026-05-19)
**Acceptance Criteria:**
- [x] Tapping any grid icon opens the bottom-sheet drawer instead of navigating directly
- [x] Tapping any dock icon opens the bottom-sheet drawer
- [x] Drawer displays app icon (72px), name with badge dot, and description
- [x] "Open" CTA button in the drawer header opens the product URL in a new tab
- [x] Screenshots carousel renders when `screenshots` array is populated, hidden when empty
- [x] Testimonials render when `testimonials` array is populated, hidden when empty
- [x] Swipe-down dismisses the drawer
- [x] Tap on backdrop dismisses the drawer
- [x] Escape key closes the drawer and returns focus to the triggering icon
- [x] Focus is trapped within the drawer while open
- [x] Drawer has `role="dialog"` and `aria-modal="true"`
- [x] Drawer animates smoothly (Framer Motion slide-up, ~300ms)
- [x] All phase tests pass
- [x] No regressions in previous phase tests

**On Completion:**
- Deviations from plan: none — all steps implemented as specified
- Tech debt / follow-ups: `@next/next/no-img-element` warnings on AppIcon.tsx and AppStoreDrawer.tsx (accepted, local PNGs)
- Ready for next phase: yes (no more phases — all 7 complete)
