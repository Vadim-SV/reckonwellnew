# Stage 05: Animated visuals, scroll motion and plainer copy

**Completed:** 22 November 2026 · **Branch:** `claude/intelligent-faraday-kb2332`

No pricing, calculator, API, email or legal code was changed.

## What's new

| Where | Visual | Motion |
| --- | --- | --- |
| Homepage hero | **Finance operations demo**: a live feed of invoices, bills and bank lines; phase tracker (Capture → Reconcile → Review → Report); reconciliation counter; customers-owed card; management report that ends with "March closed" | Continuous loop while visible; layered scroll depth |
| Homepage, new section | **"What happens to your books each month"**: six steps from documents arriving to month-end completed, with a sticky visual | **Scroll-progress driven** and reversible; no scroll hijacking; compact on mobile |
| Bookkeeping | Bank lines slide into Sales / Purchases / Wages / VAT | Loop + scroll depth |
| Outsourced finance team | Tasks move from an overloaded finance manager (150%) to Reckonwell (70%) | Loop + scroll depth |
| Payroll | Pay run: payslips, RTI to HMRC, pension upload | Loop |
| VAT | Return boxes fill, then the MTD submission | Loop |
| Annual accounts, Self Assessment, MTD, R&D | Filing tracker specific to each service | Loop |
| AP, credit control, management accounts, month-end, systems | (Stage 04) now with scroll depth; the systems visual uses paint-only SVG pulses | Loop + scroll depth |
| Group companies | (Stage 04) holding → subsidiaries → group overview | Scroll-driven, reversible |
| Industries (×5) | Technology MRR; e-commerce channel payouts; property SPVs; manufacturing product costing; hospitality daily takings | Loop + scroll depth |
| Startups | Five-stage journey: Starting a business → Setting up accounting → Growing operations → Monthly reporting → Multiple companies | Scroll-driven, reversible |
| Partners | Journey: Professional partner → Client introduction → Reckonwell support → Ongoing relationship (10% terms unchanged) | Scroll-driven, reversible |

## Principles applied
- Loops run only while on screen (`useLoopStep` + `useInView`) and pause off screen.
- Animations use transforms, opacity and SVG paint wherever motion is continuous. The systems visual no longer animates `left`/`top`.
- **Reduced motion:** every visual shows its meaningful completed state (verified on 19 pages), and scroll-driven pieces render complete.
- **Hydration fix:** a new `usePrefersReducedMotion` hook (built on `useSyncExternalStore`) replaces Motion's `useReducedMotion`. Motion's hook caused React hydration mismatches (#418) for reduced-motion visitors.

## Copy
A plain-English pass: "finance function" became "finance team" or "finance work", "headcount" became "staff", and "investor-ready reporting" became "clear reports for investors". A search found no buzzwords (leverage, seamless, optimise, visibility…). The homepage still leads with established businesses that need more finance capacity without hiring.

## Verification
- `npm run check`: lint, types, 41 tests, build of 36 routes.
- All 26 main pages scrolled down and back up in a real browser with motion on: **0 runtime or hydration errors**.
- Workflow section: the step advances on scroll down and returns to "Documents arrive" on scroll up (desktop and mobile).
- Screenshots at 1440px and 390px: no horizontal overflow.
