# GappHub — Current Phase

> Project: GappHub (Lexcorp product portfolio launcher)
> All 8 phases complete (2026-05-21).
> Total Phases: 8

## Priority Task Queue

- [x] `$investigate` / `$ship` - align and implement single paged grid search model so search filters the same horizontal app grid while preserving page dots and swipes (2026-05-22).
- [x] `/research-roadmap` - documentation scan completed (2026-05-19).

## Priority Documentation Todo

- [x] `/spec-drift fix all` - update `specs/drift-report.md` because it was last updated 2026-05-18 09:59 but 7 source commits landed after that date (Phase 7 App Store Drawer implementation + Dynamic Island flicker fix). Completed 2026-05-19.
- [x] `/reconcile-dev-docs fix tasks` - reconcile task docs because `tasks/manual-todo.md` header still says "All 6 implementation phases complete (2026-05-15)" but Phase 7 is now complete; also verify phase archive completeness (no `tasks/phases/phase-7.md`). Completed 2026-05-20.
- [x] `/icp` - `research/icp.md` exists; shipped alignment summary page at `alignment/icp.html` (2026-05-21).
- [x] `/competitive-analysis` - `research/competitive-analysis.md` exists; shipped alignment summary page at `alignment/icp.html` (2026-05-21).
- [x] `/positioning` - create `research/positioning.md` because it is missing; after `/icp` and `/competitive-analysis`. Completed 2026-05-22.
  - Goal: define GappHub's strategic positioning as a polished Lexcorp portfolio launcher, using existing `research/icp.md`, `research/competitive-analysis.md`, `research/concept-brief.md`, `specs/ui-gapphub.md`, and product data as source material.
  - Output file: `research/positioning.md`.
  - Recommended structure: competitive alternatives, unique attributes, value themes, best-fit audience, market category, positioning statement, and implications for the current UI/landing experience.
  - Constraints: do not reposition GappHub as a marketplace, app store, or standalone revenue product; keep the app's role as a branded portfolio/navigation surface.
  - Verification: cite local source files used, check consistency with the ICP and competitive-analysis conclusions, and record any assumptions that need user validation.
  - Suggested route: `$positioning`.
- [x] `/journey-map` - create `research/journey-map.md` because it is missing; after `/icp`. Completed 2026-05-22.
- [ ] `/metrics` - create `research/metrics.md` because it is missing; after `/journey-map`.
- [ ] `/gtm` - create `research/gtm.md` because it is missing; after `/positioning` and `/journey-map`.
- [ ] `/monetization` - create `research/monetization.md` because it is missing; after `/icp` and `/competitive-analysis`. Note: GappHub is a portfolio launcher, not a revenue product — this may be minimal or N/A.
- [ ] `/landing-copy` - create `research/landing-copy.md` because it is missing; after `/positioning` and `/journey-map`. Relevant: the site itself is the landing experience.

## Phase 8 — Drawer Content Research (2026-05-21)

- [x] **#1 War Room** (`war-room`) — longDescription added
- [x] **#2 GSkillPacks** (`gskillpacks`) — longDescription added
- [x] **#3 Pitwall** (`pitwall`) — longDescription added
- [x] **#4 Bismarck AI** (`bismarck-ai`) — longDescription added
- [x] **#5 Draft Stonk** (`draft-stonk`) — longDescription added
- [x] **#6 calcLLM** (`calc-llm`) — longDescription added
- [x] **#7 Next Level Startup** (`next-level-startup`) — longDescription added
- [x] **#8 VectorFit** (`vectorfit`) — longDescription added
- [x] **#9 JIT Life OS** (`jit-life-os`) — longDescription added
- [x] **#10 gBlockParty** (`gblockparty`) — longDescription added
- [x] **#11 PulseBoard** (`pulseboard`) — longDescription added
- [x] **#12 Metternich Engine** (`metternich-engine`) — longDescription added
- [x] **#13 WarranIT** (`warranit`) — longDescription added
- [x] **#14 FormForge** (`formforge`) — longDescription added
- [x] **#15 SnipVault** (`snipvault`) — longDescription added
- [x] **#16 DriftLog** (`driftlog`) — longDescription added
- [x] **#17 Poketo** (`poketo`) — longDescription added
- [x] **#18 Poke CRM** (`poke-crm`) — longDescription added
- [x] **#19 Poke Growth** (`poke-growth`) — longDescription added
- [x] **#20 CheckGres** (`checkgres`) — longDescription added
- [x] **#21 GIGACHADD** (`gigachadd`) — longDescription added
- [x] **#22 Spellbook OS** (`spellbook-os`) — longDescription added
- [x] **#23 Moltke** (`moltke`) — longDescription added
- [x] **#24 SpaceNext** (`spacenext`) — longDescription added
- [x] **#25 B4** (`b4`) — longDescription added
- [x] **#26 Boston Founder Radio** (`boston-founder-radio`) — longDescription added
- [x] **#27 PMF Hunt** (`pmfhunt`) — longDescription added
- [x] **#28 Loadoutworks** (`loadoutworks`) — longDescription added
- [x] **#29 Sanctum** (`spellbook-sanctum`) — longDescription added
- [x] **#30 Foresight** (`spellbook-foresight`) — longDescription added
- [x] **#31 Prism** (`spellbook-prism`) — longDescription added
- [x] **#32 Ritual** (`spellbook-ritual`) — longDescription added
- [x] **#33 Portals** (`spellbook-portals`) — longDescription added
- [x] **#34 Scry** (`spellbook-scry`) — longDescription added
- [x] **#35 Compile** — All longDescription values applied to `public/data/products.json`

## Code Review Fixes
> Generated by `/expert-review` on 2026-05-28

### Critical
- [x] [src/app/globals.css:109-124] — Reduced motion CSS selectors target `a` elements but icons are `<button>` since Phase 7. Changed `a` → `button` in all rule blocks. Updated test assertions. (2026-05-28)
- [x] [src/lib/products.ts:52-58] — `sortProducts` omits `byBadge("N")`. Added `...byBadge("N")` between `byBadge("B")` and `byBadge("C")`. (2026-05-28)

### High
- [x] [src/components/AppIcon.tsx:6, src/components/AppStoreDrawer.tsx:7] — Replaced `import * as icons` barrel import with explicit map of 34 used icons in `src/lib/icon-utils.ts`. (2026-05-28)
- [x] [src/components/AppIcon.tsx + AppStoreDrawer.tsx] — Extracted shared constants and helpers into `src/lib/icon-utils.ts`. (2026-05-28)

### Medium (fixed 2026-05-28)
- [x] StatusBar hydration mismatch — initialize time as empty string, set in useEffect, added suppressHydrationWarning.
- [x] Unused `useIsMobile` hook — deleted `src/hooks/useIsMobile.ts` and stale test mock.
- [x] Dead animation variants — removed SlidePhoneContent, AssemblePhoneContent, related types/state/effects. Simplified Variant type to `"none" | "boot"`.

### Low (fixed 2026-05-28)
- [x] SearchOverlay backdrop — replaced `aria-hidden` with `role="presentation"`.
- [x] BadgeLegend deprecated icon — replaced black square SVG with grayscale squircle matching grid icon style.
