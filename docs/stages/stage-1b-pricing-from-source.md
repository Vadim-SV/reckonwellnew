# Stage 1b: Pricing taken from the original source

**Completed:** 21 November 2026 · **Input:** `reckonwell-main` source archive supplied by Reckonwell

## What changed
- **Instant Quote, CT600, MTD and outsource-vs-hire:** confirmed against the original source. The rules were identical to those recovered in Stage 1. I added the 5% R&D success-fee note and the documented salary derivation (`trueEmploymentCost`).
- **New ports:** the Self Assessment calculator (`self-assessment.ts`) and the R&D claim fee calculator (`rd-claim-fee.ts`). Both are live on reckonwell.com but weren't in its sitemap.
- **Published "from" prices** catalogued with their source and a consistency flag (`published-prices.ts`).
- **New rulebook:** [`../pricing-rules.md`](../pricing-rules.md). It covers every rule, the inputs, how quotes are emailed today, and 9 conflicts to resolve.
- **Audit updated** with what the source revealed about the APIs, email, calendar and analytics.

## Verification
- Each port was compared with the function extracted verbatim from `reckonwell-main`. The Instant Quote, CT600, comparison, Self Assessment and R&D fee calculators were each tested with 20,000 random inputs, and MTD exhaustively. **All outputs matched exactly.**
- `npm run check` passes: lint, types, 18 unit tests, build.

## What was deliberately not taken from the archive
- **`.env`:** it contains live credentials (Brevo, Supabase, Tally, a GA ID). None were copied.
- **The original source code itself:** it isn't committed here, and only pricing logic was ported.
- **The R&D relief estimator:** the formula needs review against the current scheme.
