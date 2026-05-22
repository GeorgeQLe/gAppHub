# Journey Map

> Based on: `research/icp.md`, `research/positioning.md`, `research/concept-brief.md`, `specs/ui-gapphub.md`, `public/data/products.json`
> Date: 2026-05-22
> Scope: anonymous visitor discovery through product click-through for GappHub, a branded Lexcorp portfolio launcher

## Summary

GappHub's core journey is short, self-serve, and click-oriented. A visitor arrives from a social bio, shared URL, search result, pitch deck, or another Lexcorp product surface; recognizes the polished phone-frame portfolio metaphor; scans the app grid; optionally searches or swipes; opens one or more app-style drawers; then clicks through to the product that matches their intent.

The journey should optimize for three outcomes:

1. Help the visitor understand Lexcorp's portfolio breadth within seconds.
2. Give enough context to choose a relevant product without turning GappHub into a full product website.
3. Transfer the visitor to the right product with confidence and minimal friction.

## Primary Journey

| Stage | Visitor Goal | Visitor Actions | GappHub Touchpoints | Desired Feeling | Success Signal |
|---|---|---|---|---|---|
| 1. Trigger | Decide whether the shared Lexcorp link is worth opening | Clicks from a social bio, shared URL, pitch deck, search result, QR code, or product cross-link | Single route `/`; fast-loading phone-frame experience | "This looks intentional and credible." | Page loads quickly and the visitor stays long enough to scan |
| 2. Orientation | Understand what GappHub is | Watches the boot transition or lands directly on the populated phone frame | Boot splash, Dynamic Island brand copy, app grid, status badges, badge legend | "Lexcorp has a real portfolio, not just a link list." | Visitor sees multiple products and understands the app-icon metaphor |
| 3. Scan | Find a potentially relevant product | Reads icon names, notices featured apps, scans badge states, uses visual hierarchy | Prioritized grid, dock, page dots, badges, product names | "I can quickly tell what might matter to me." | Visitor hovers, taps, searches, swipes, or focuses an icon |
| 4. Narrow | Confirm whether a product is relevant | Opens an icon drawer, reads short and long descriptions, reviews status/category cues | App Store-style drawer with product icon, title, description, and Open CTA | "This product has enough context for me to decide." | Visitor opens at least one drawer and does not need a separate explanation page |
| 5. Click-through | Leave GappHub for the selected product | Clicks the drawer's Open CTA | Explicit outbound CTA to the product URL | "I know where I am going next." | Product link click |
| 6. Optional exploration loop | Compare other products before leaving | Closes drawer, returns to grid, swipes/searches, opens another drawer | Drawer close action, grid persistence, search, pagination, dock | "Exploring more is easy." | Multiple drawers opened or a second product link clicked |

## Segment Variations

### Portfolio Browser

This is the highest-volume visitor described in the ICP. They want a fast answer to "what does Lexcorp build?"

- Entry channels: social bio, search, shared URL, product cross-link.
- Likely behavior: brief scan, one drawer open, one click-through.
- Key product requirement: fast load, clear names, concise drawer copy, obvious Open CTA.
- Main failure mode: too much detail, unclear product names, or a drawer that obscures the outbound path.

### Partners And Investors

These visitors need a broader credibility read before a meeting, diligence review, or partnership conversation.

- Entry channels: pitch deck, LinkedIn, warm intro, direct share.
- Likely behavior: open multiple drawers, compare categories, inspect portfolio breadth.
- Key product requirement: long descriptions must communicate substance without unsupported traction claims.
- Main failure mode: the hub feels like a novelty link list rather than a reliable artifact of execution quality.

### Job Candidates And Talent

These visitors use the portfolio as evidence of what Lexcorp ships and how polished the company is.

- Entry channels: job posts, recruiter messages, LinkedIn, company research.
- Likely behavior: exploratory browsing across many products.
- Key product requirement: breadth, polish, responsive behavior, and product specificity.
- Main failure mode: generic placeholder content or inconsistent icon/detail quality weakens credibility.

## Moments That Matter

### First Three Seconds

The page must communicate that GappHub is the polished Lexcorp portfolio front door before the visitor decides to bounce. The phone frame, app grid, and brand copy carry this moment more than explanatory text.

### First Icon Decision

The visitor should be able to choose an icon from name, badge, category familiarity, visual priority, or search. If they cannot decide what to tap, the grid has failed as a launcher.

### Drawer Confidence

The drawer should answer: what is this, why might I care, and where do I go next? It should not add marketplace expectations such as ratings, reviews, install counts, accounts, or personalization.

### Product Handoff

The Open CTA should feel explicit and intentional. Visitors should not wonder whether they are installing, buying, opening an in-app page, or leaving for the product site.

## Friction Map

| Friction | Journey Stage | Impact | Mitigation |
|---|---|---|---|
| Slow page load | Trigger / orientation | Visitor leaves before seeing portfolio breadth | Keep front-end-only scope, local static fallback, optimized assets |
| Metaphor confusion | Orientation | Visitor may not know icons are outbound product entries | Preserve familiar iPhone home-screen layout and explicit drawer CTA |
| Too many similar products | Scan | Visitor cannot decide what to open | Keep priority sorting, badges, categories, search, and concise labels |
| Drawer overexplains | Narrow | Launcher becomes a product microsite and slows decision-making | Keep drawer copy concise and click-oriented |
| Drawer underexplains | Narrow | Partners, investors, and candidates lack enough context | Use the existing `longDescription` field for substance without feature bloat |
| Weak outbound clarity | Click-through | Visitor hesitates or misses the product link | Keep Open CTA prominent and consistently placed |
| Mobile crowding | Scan / narrow | Primary mobile visitors struggle to tap and read | Preserve responsive row computation, simplified frame, and touch-friendly controls |

## Current Product Journey Fit

The implemented product data supports this journey because each entry includes:

- `name` for icon scanning.
- `description` for quick hover/tap context.
- `longDescription` for drawer evaluation.
- `url` for outbound click-through.
- `badge` and `category` for filtering and status interpretation.
- `featured`, `dock`, and `order` for visual hierarchy.

This data model is enough for the current journey. Durable accounts, admin tooling, analytics dashboards, payments, reviews, or marketplace functions would expand the journey beyond GappHub's portfolio launcher role and should stay deferred unless a future experiment proves the need.

## Journey Metrics

These are measurement ideas for future instrumentation, not implementation requirements for the current documentation step:

| Metric | What It Indicates |
|---|---|
| Page load to first visible grid | Whether the first-three-second moment is protected |
| First interaction rate | Whether visitors understand the grid is actionable |
| Drawer open rate | Whether icon names and visual hierarchy create curiosity |
| Product click-through rate | Whether GappHub succeeds as a launcher |
| Drawers opened per session | Whether visitors are browsing broadly or finding one target quickly |
| Search usage | Whether the product count or naming requires extra discovery support |
| No-result search rate | Whether categories, product names, or synonyms need refinement |

## Content Implications

- Product names should stay short enough to scan under icons.
- Drawer titles and descriptions should favor concrete product jobs over internal project lore.
- Status badges should reinforce product maturity without making unsupported traction claims.
- Landing copy should describe GappHub as a portfolio launcher or front door, not an app store, marketplace, or commerce surface.
- The first viewport should continue to make the phone frame and product grid the primary signal.

## Assumptions To Validate

- Visitors understand that tapping an icon opens a product detail drawer rather than launching a native app.
- The current product count remains manageable with pagination and search.
- The same short journey serves all three audience segments without requiring separate landing pages.
- The Open CTA language is sufficiently clear for external product navigation.
- Future analytics, if added, can remain lightweight and privacy-respecting.

## Next Steps

Recommended: `$metrics` — define the minimal measurement model for this journey before GTM and landing-copy work.

Follow-on work:

- `$gtm` — map the distribution channels that create journey triggers.
- `$landing-copy` — turn the journey and positioning into page and drawer copy guidance.
- `$monetization` — document why monetization is minimal or not applicable for this portfolio launcher.
