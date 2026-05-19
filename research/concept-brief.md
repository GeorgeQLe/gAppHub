# GappHub — Concept Brief

## Summary

GappHub is a single-page web app that showcases all shipped and live Lexcorp products as app icons rendered inside a realistic iPhone frame. Visitors tap an icon to navigate to that product's live website. The aesthetic is light, aspirational, and Apple-inspired — sleek silver tones, polished surfaces, generous whitespace. A loading animation plays when the phone frame first appears on screen. Product data is fetched dynamically from the lexcorp-war-room repo or shared database, with a committed static JSON file as fallback.

Think of it as a branded Linktree, but presented as an elegant phone home screen instead of a plain link list.

## Problem Hypothesis

Lexcorp ships multiple products but lacks a single, visually cohesive hub that lets visitors discover and navigate the full portfolio. Existing options (plain link lists, scattered landing pages) don't convey the polish or product-company identity that Lexcorp wants to project.

## Beneficiary Hypothesis

- **Primary:** Visitors, potential customers, and partners who want a quick overview of Lexcorp's product portfolio and one-click access to each product.
- **Secondary:** The Lexcorp team, who gets a single shareable URL that represents the entire product suite.

## Product Category Guess

Branded link hub / portfolio launcher. Comparable to Linktree, Bento, or bio-link pages, but differentiated by the simulated phone-screen presentation and Apple-grade visual polish.

## Value Wedge

The realistic iPhone frame with a smooth loading animation turns a utilitarian link list into a memorable, on-brand experience. It signals that Lexcorp builds polished digital products — the hub itself is a product showcase.

## Constraints

- **Front-end only.** No backend application server; data comes from a shared DB or the lexcorp-war-room repo.
- **Vercel hosting.** Deployed as a static or edge-rendered site on Vercel.
- **Fully responsive.** The phone frame and icon grid must adapt gracefully from large desktop screens down to mobile viewports.
- **Dynamic + static fallback.** Fetch product data at runtime; fall back to a committed `products.json` if the fetch fails.
- **App store drawer for link-out.** Each icon opens a bottom-sheet detail drawer (icon, title, description, screenshots, testimonials) with an explicit "Open" CTA that navigates to the external product URL. This replaced the original "external links only" constraint (2026-05-18).

## Non-Goals

- Not a native iOS or Android app.
- No user accounts, authentication, or personalization.
- No analytics dashboards, admin panels, or e-commerce.
- No in-app product detail pages — icons link out.
- No app store marketplace features (ratings, reviews, install counts). In-app detail drawers are now included (2026-05-18).

## Design Direction

- **Light and aspirational.** Inspired by Apple's product marketing aesthetic.
- **Sleek silver / polished.** Metallic tones, subtle gradients, clean typography.
- **Generous whitespace.** Let the phone frame breathe on the page.
- **Realistic iPhone frame.** Includes bezel, dynamic island/notch, status bar, and home indicator.
- **Loading animation.** The phone frame animates in on page load (fade, slide-up, or a subtle boot-screen effect).
- **Contrasts with the war-room.** The war-room repo uses a dark/techy theme; GappHub is intentionally the opposite — bright, clean, premium.

## Product Metadata Per Entry

Each product entry includes:

| Field | Required | Notes |
|---|---|---|
| Icon | Yes | App icon artwork |
| Name | Yes | Product name displayed under the icon |
| URL | Yes | External link to the product's live site |
| Short description | Optional | Subtitle or tooltip on hover/tap |
| Status badge | Optional | Tags like "New", "Beta", "Popular" |

## Assumptions And Unknowns

| Assumption | Tag | Risk |
|---|---|---|
| Product data lives in the lexcorp-war-room repo or a shared DB | `[from user]` | Low — confirmed by user |
| A fetch API or raw content URL exists to pull product data | `[inferred]` | Medium — exact API contract TBD |
| Lexcorp has fewer than ~30 products (fits a single phone screen or scrollable grid) | `[inferred]` | Low — can paginate or scroll if more |
| Each product already has icon artwork available | `[inferred]` | Medium — may need to create icons |
| The loading animation is CSS/JS-based, not a video | `[inferred]` | Low — standard approach |
| No brand guidelines document exists yet; design direction is "Apple-like" | `[inferred]` | Low — user confirmed direction |

## ICP Readiness

The concept is **ready for ICP** with the following inputs:

- **Beneficiary hypotheses:** external visitors/partners discovering Lexcorp's portfolio; internal team sharing a single portfolio URL.
- **Assumptions to test first:** Whether visitors actually need a hub (vs. finding products through other channels), and whether the phone-screen metaphor resonates or confuses the target audience.

However, given this is a lightweight portfolio/link hub rather than a revenue-generating product, a full ICP process may be heavier than needed. The user should decide whether to run ICP or jump straight to UI/UX design.

## Next Steps

**Recommended next command:** `/ui-interview`

The concept is well-defined and the design direction is clear. A UI interview will lock down the phone frame layout, icon grid behavior, responsive breakpoints, loading animation specifics, and interaction details before implementation.

Other useful options:
- `/ux-variation` — If exploring multiple presentation approaches (e.g., phone frame vs. floating icons vs. carousel) before committing to one.
- `/design-system` — If extracting formal design tokens (colors, typography, spacing) for the light/silver Apple-inspired theme.
