# GappHub — Concept Interview Log

## Session Date

2026-05-14

## Starting Input

> I'd like to create a new front-end application for lexcorp which will feature all shipped and live products as app icons on a simulated phone screen. This is not a full iphone app, it is just a stylized linktree type app which routes out to the product's website when the user clicks on the icon.

## Interview Rounds

### Round 1: Assumptions Manifest

Presented initial concept assumptions covering summary, problem hypothesis, beneficiary hypothesis, product category, value wedge, constraints, non-goals, and unknowns.

**User response:** Confirmed the manifest was broadly correct. Addressed unknowns directly: product data is stored in the `lexcorp-war-room` repo and the site can sync from it or a shared DB.

### Round 2: Design, Data, and Metadata

Three questions asked:

1. **Phone screen style?** — User chose: Realistic iPhone (bezel, notch/dynamic island, status bar, home indicator).
2. **Data source?** — User chose: Dynamic fetch with static JSON as backup.
3. **Product metadata?** — User chose: All of the above (icon, name, URL, short description, and status badges).

### Round 3: Hosting and Responsiveness

Two questions asked:

1. **Hosting?** — User chose: Vercel.
2. **Responsive?** — User chose: Fully responsive.

### Round 4: Branding and Design Direction

User initially selected dark/techy theme, then corrected: the war-room uses dark/techy; GappHub should be **light and aspirational — sleek silver, polished, Apple-inspired**.

### Round 5: Loading Animation

User requested a nice animation on phone loading. Incorporated into the concept as a page-load animation for the phone frame.

### Coverage Checkpoint

Final summary confirmed by user:
- Light/aspirational Apple-like design
- Realistic iPhone frame with loading animation
- Rich product metadata (icon, name, URL, description, badges)
- Dynamic fetch + static JSON fallback
- Vercel hosting
- Fully responsive

User approved: "Ship it."

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Phone frame style | Realistic iPhone | Reinforces the "app launcher" metaphor |
| Design aesthetic | Light, silver, Apple-inspired | Contrasts with dark/techy war-room; projects premium quality |
| Data strategy | Dynamic fetch + static fallback | Stays in sync with war-room; resilient to fetch failures |
| Product metadata | Icon, name, URL, description, badges | Rich enough to be informative without overwhelming |
| Hosting | Vercel | Free tier friendly, good DX, supports static and edge |
| Responsiveness | Fully responsive | Accessible on all devices |
| Loading animation | Yes, on phone frame | Adds polish and delight to page load |

## Unresolved For Downstream

- Exact API contract or data format from lexcorp-war-room
- Number of products to display (affects grid layout)
- Whether product icon artwork already exists
- Specific animation style for phone loading (fade-in, slide-up, boot screen, etc.)
- Typography and exact color palette within the "Apple-inspired" direction
