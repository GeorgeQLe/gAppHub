# App Store Drawer — Feature Interview Log

> Date: 2026-05-18
> Artifact path: `specs/app-store-drawer-feature-interview.md`

## Feature Evidence Brief

### Idea
Replace direct external link-out on icon tap with a bottom-sheet drawer that mirrors a typical app store detail page: app icon, title, screenshots, description, testimonials, and a prominent "Open" CTA with external-link icon. Motivation: currently there is no indication to users that tapping an icon navigates to an external site, which feels jarring.

### Evidence Sources
- `src/components/AppIcon.tsx` — current `<a href target="_blank">` behavior
- `src/types/product.ts` — current data schema (no screenshots/testimonials fields)
- `public/data/products.json` — 34 products
- `specs/ui-gapphub.md` — confirmed UI spec with "No in-app product detail pages" non-goal
- `research/concept-brief.md` — "External links only" constraint
- `tasks/roadmap.md` — all 6 phases complete, empty task queue
- `src/components/SearchOverlay.tsx` — existing overlay pattern (prior art)

### Claim Validation

| Claim | Verdict | Evidence |
|---|---|---|
| No indication icons link out | **Confirmed** `[from codebase]` | `AppIcon.tsx:85-88` — plain `<a>` with no visual external-link indicator. Tooltip is desktop-only, 400ms delay. |
| Intermediate screen improves UX | **Supported** `[inferred]` | Unexpected new-tab navigation is a known anti-pattern. Setting expectations reduces user surprise. |
| App store pattern fits | **Partially supported** `[from idea]` | Pattern makes sense but data model needs expansion for screenshots/testimonials. |

### Spec Conflicts Overridden (User-Confirmed)
1. `specs/ui-gapphub.md` § Non-Goals: "No in-app product detail pages" — **overridden**
2. `specs/ui-gapphub.md` § Non-Goals: "No app store features" — **partially overridden** (detail page yes, ratings/reviews/install counts still excluded)
3. `research/concept-brief.md` § Constraints: "External links only" — **overridden**
4. `research/concept-brief.md` § Non-Goals: "No app store or marketplace features" — **partially overridden**

### Technical Gotchas & Mitigations
1. **Data model expansion** — `Product` needs optional `screenshots`, `testimonials`, `longDescription`. Most products will have empty fields initially. Mitigation: hide sections when data is absent.
2. **Mobile cramped space** — Phone frame is 375px wide. Bottom sheet at ~80% height gives sufficient room. Horizontal screenshot carousel works at this width.
3. **Swipe conflict** — Icon grid uses horizontal swipe for pagination. Bottom sheet uses vertical swipe to dismiss. Orthogonal gestures, no conflict.
4. **Accessibility** — Changing `<a>` to open a drawer instead of navigating changes the interaction contract. Need `role="button"` on icons, dialog pattern with focus trap on the drawer, Escape to close.
5. **Dock icons** — Must also open the drawer (user confirmed).

### Journey Placement
Inserts between "user discovers app on grid" and "user navigates to external product." Adds a consideration/preview step analogous to App Store detail pages.

## Questions & Answers

**Q1: Override existing non-goals?**
A: Yes, override. Show drawer for all products even with sparse content. Will research product repos for screenshots separately.

**Q2: Drawer style?**
A: Bottom sheet. Slides up from bottom, covers ~80% of phone screen. Familiar iOS pattern. Swipe down to dismiss.

**Q3: CTA button label?**
A: "Open" with external-link icon. Matches App Store's "Get" button placement — top of the drawer.

**Q4: Dock icons?**
A: Both grid and dock icons open the drawer.

**Q5: Empty screenshots state?**
A: Hide the section entirely. Clean and minimal. Screenshots appear when data is added.

**Q6: Badge display in drawer?**
A: Same small colored dot from the icon grid, shown next to the title. Minimal.

## Planning Destination + Priority Checkpoint

- **Decision:** Update existing spec + concept brief + add Phase 7 to roadmap
- **Target artifacts:**
  - `specs/ui-gapphub.md` — add App Store Drawer section, update non-goals
  - `research/concept-brief.md` — update constraints and non-goals
  - `tasks/roadmap.md` — add Phase 7
  - `src/types/product.ts` — add optional fields (implementation phase)
- **Scope now:** Bottom sheet drawer with icon, title, badge dot, description, screenshots carousel (when available), testimonials (when available), "Open" CTA at top. Framer Motion animation. Focus trap. Keyboard accessible.
- **Deferred:** Populating screenshots/testimonials data, long descriptions, ratings/reviews/install counts.
- **Priority:** Phase 7, next work, no blockers.
- **User confirmed:** Yes.

## Next Steps

- **Next work:** Sequence Phase 7 implementation into detailed build steps
- **Recommended next command:** `/roadmap` to add Phase 7, then `/plan-phase 7`
