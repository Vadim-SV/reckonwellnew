# Stage 04: Missing service pages, Startups and Group companies

**Completed:** 22 November 2026 · **Branch:** `claude/intelligent-faraday-kb2332`

## New pages

| Page | URL | Tool after the hero content | Illustration |
| --- | --- | --- | --- |
| Accounts payable | `/services/accounts-payable` | Requirements tool → form | Bills moving from received → checked → ready to pay |
| Credit control | `/services/credit-control` | Requirements tool → form | Overdue invoices progressing to paid; aged debtors shrinking |
| Management accounts | `/services/management-accounts` | Requirements tool → form | Ledger lines becoming a report with a trend line |
| Month-end close | `/services/month-end-close` | Requirements tool → form | Close checklist ticking off; progress ring |
| Accounting systems | `/services/accounting-systems` | Requirements tool → form | Apps syncing into Xero/QuickBooks |
| Group companies | `/services/group-companies` | Requirements tool → form | **Scroll-driven**: holding company → subsidiaries → group overview (reverses on scroll up) |
| Startups (Founder's Launch Offer) | `/startups` | Startup launch tool → startup enquiry form | **Scroll-driven** growth journey: Startup → Growing → Established → Group |

The original eight service URLs are unchanged.

## No new prices
None of these services has approved pricing, so each uses a **requirements tool** (`src/lib/scoping/registry.ts`). The tool summarises the visitor's answers and always ends in a *tailored quote*; it never shows a £ figure (enforced by tests).

The enquiry API validates and re-summarises the answers on the server, exactly as it recalculates calculator estimates. The pricing registry and formulas are untouched.

## Other changes
- **Services menu:** grouped into Financial operations / Accounting & compliance / Business support (data-driven; Startups sits under Business support). The footer is grouped the same way.
- **Homepage:** content and design unchanged. The "What we take over" links now go to the new pages; the services grid shows the operational services; there's a one-line link to Startups and compliance.
- **Services overview:** three groups, plus a Startups card.
- **Industry pages:** "most useful services" now include the relevant operational pages.
- **Call-to-action band:** "Book a discovery call" (`/book`).
- **`/book`:** now a **temporary** (307) redirect to `/contact`, so browsers won't cache it before the real booking page arrives in Stage 06.
- **Layout fix:** service pages with four "what's included" items no longer leave empty grid cells.

## Verification
- `npm run check`: lint, types, **41 tests** (including a new route-integrity suite and scoping tests) and a build of **36 routes**.
- Smoke test: all new routes return 200, unknown `/services/*` returns 404, titles, canonicals and H1s are unique, and the sitemap includes the new pages.
- Browser: the scoping summary updates live and submits (emails logged in dev); no price appears in any scoping tool; the group visual builds on scroll down and reverses on scroll up; the startup journey line follows scroll; the payroll calculator still works.
- Screenshots at 1440px and 390px with reduced motion: no horizontal overflow, and illustrations show their completed state.
