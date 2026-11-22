# Launch readiness — Stage 06

**Date:** 22 November 2026 · **Branch:** `claude/intelligent-faraday-kb2332` · Not merged, not deployed.

Related: [`pricing-conflicts-report.md`](./pricing-conflicts-report.md) · [`privacy-policy-proposed-changes.md`](./privacy-policy-proposed-changes.md) · [`pricing-rules.md`](./pricing-rules.md)

---

## 1. Route inventory

**Pages (29, all in the sitemap)**

| Area | Routes |
| --- | --- |
| Home | `/` |
| Services | `/services` · `/outsourced-financial-operations` · `/bookkeeping-services` · `/payroll-services` · `/vat-returns` · `/annual-accounts-ct600` · `/self-assessment` · `/making-tax-digital` · `/r-and-d-tax-relief` · `/services/accounts-payable` · `/services/credit-control` · `/services/management-accounts` · `/services/month-end-close` · `/services/accounting-systems` · `/services/group-companies` |
| Industries | `/industries` · `/industries/{technology, ecommerce, property, manufacturing, hospitality}` |
| Conversion | `/startups` · `/partners` · `/instant-quote` · `/book` · `/contact` |
| Legal | `/privacy-policy` · `/terms-of-service` |
| Internal | `/design-system` (noindex, disallowed in robots.txt) |

**API routes:** `POST /api/enquiry` · `POST /api/partner` · `POST /api/booking` · `GET /api/booking/availability`

**Permanent redirects from old URLs (308):** `/quotation-calculator` → `/instant-quote` · `/final-accounts-ct600-calculator`, `/limited-company-accounting` → `/annual-accounts-ct600` · `/mtd-calculator` → `/making-tax-digital` · `/self-assessment-calculator`, `/self-employed-accounting` → `/self-assessment` · `/rd-tax-relief-calculator` → `/r-and-d-tax-relief` · `/fractional-finance-department` → `/outsourced-financial-operations` · `/london-payroll-services` → `/payroll-services` · `/referrals` → `/partners`.
The temporary `/book` redirect has been removed now that `/book` is a real page.

**Not yet migrated (decision needed):** the London borough pages (`/accounting/*`), the US section (`/us/*`), `/services`-era pages such as `/company-formation`. They currently return 404 on the new site, and so would lose any search traffic they have. Add redirects or pages before launch.

## 2. Newly completed in this stage

| Feature | What it does |
| --- | --- |
| **Enquiry references** | Every enquiry gets a unique reference (`RW-YYMMDD-XXXXXX`; bookings `RWB-…`, partners `RWP-…`), shown to the customer and used in email subjects. |
| **Enquiry records** | Saved to Postgres when `DATABASE_URL` is set: inputs, the server-calculated result, and each email's outcome. |
| **Idempotency** | Each form sends a one-off key. A double click or retry returns the original reference and **sends no second set of emails**. |
| **PDFs** | Branded "Indicative estimate" (priced calculators) or "Enquiry summary" (requirements tools and manual pricing), attached to both the customer and internal emails. |
| **Booking page** (`/book`) | Live Google Calendar scheduling when configured; otherwise a clearly labelled "Request a call" flow. |
| **Booking emails** | Confirmation (*"Your Discovery Call with Reckonwell is Confirmed"*) with an `.ics` invite, plus an internal notification. Request-mode emails say plainly that the call is **not booked yet**. |
| **Email provider** | Brevo preferred, Resend as fallback. Supports attachments and logs every attempt with the provider's message ID. |
| **Analytics events** | Prepared but **inactive**: `calculator_completed`, `contact_form_submitted`, `instant_quote_submitted`, `booking_completed`, `booking_requested`, `partner_enquiry_submitted`, `startup_enquiry_submitted`. They carry no personal or financial data. |
| **SEO** | Titles and descriptions tightened for the target searches; `/book` added to the sitemap; reusable audit script `npm run seo:audit`. |

## 3. Email configuration (Brevo)

1. **Generate a new Brevo API key** (Brevo → SMTP & API → API keys). **Delete the old key**, which was in the source archive.
2. **Authenticate the sending domain** reckonwell.com in Brevo (Senders, domains & dedicated IPs → Domains). Brevo shows DNS records (a Brevo code TXT, DKIM, and a DMARC recommendation). Add them at **IONOS** (Domains & SSL → reckonwell.com → DNS).
   - Keep the existing IONOS SPF record. Brevo's instructions say whether to add `include:spf.brevo.com`.
   - The existing `brevo-code` TXT record suggests the domain may already be partly verified.
3. **Set the environment variables** in the hosting provider (e.g. Vercel → Project → Settings → Environment Variables), **not** in a committed file:
   `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS=vadim.s@reckonwell.com`, `EMAIL_FROM_NAME=Reckonwell`, `EMAIL_INTERNAL_TO=vadim.s@reckonwell.com`.
4. **Test:** submit the contact form on a preview deployment. Check both emails arrive, then check Brevo → Transactional → Logs for the message IDs shown in the server logs.

*Behaviour without a key:* in development, emails are printed to the terminal. In production, a form that cannot email **and** cannot store returns a clear error with the phone number and email address, so no enquiry is silently lost.

## 4. Calendar integration (live booking)

The site uses **Google Calendar** (the variable names match the old site's unused integration). It needs a Google account whose calendar Vadim actually uses for meetings.

1. In Google Cloud Console, create a project, enable the **Google Calendar API**, and create an **OAuth client ID** (type "Web application").
2. Generate a **refresh token** with the scope `https://www.googleapis.com/auth/calendar.events` plus `…/calendar.freebusy` (or `…/calendar`), signed in as the calendar owner. The OAuth Playground is the simplest way.
3. Set `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` and `GOOGLE_CALENDAR_ID` (usually the account's email address).
4. Set `DATABASE_URL` too (strongly recommended): bookings are recorded, and a database unique index blocks double bookings.
5. Optional: `BOOKING_CREATE_GOOGLE_MEET=false` to stop creating Meet links; `BOOKING_LOCATION` for a fixed location or Teams link.

**Rules** (`src/lib/booking/config.ts`, defaults awaiting your confirmation): Monday–Friday, 30-minute calls, starts 09:30–16:30 UK time, 15-minute buffer around existing events, 24 hours' minimum notice, three weeks ahead, England & Wales bank holidays (2026–2027) excluded.

**How double bookings are prevented:**
1. Availability excludes busy calendar time and bookings in progress.
2. The slot is reserved in the database (unique index).
3. The calendar is re-checked just before booking.
4. The Google event ID is derived from the slot time, so a second event for the same slot is rejected by Google.

**Confirmations are sent only after the event exists.** If anything fails, the slot is released and no confirmation is sent.

*Without Google credentials:* `/book` shows "Request a call". Visitors choose up to three working days and a time of day, and Vadim confirms by email. No invented time slots are ever shown.

> If Vadim's calendar is on IONOS or Microsoft 365 rather than Google, the calendar module (`src/lib/booking/calendar.ts`) has a small interface (`busy` + `createEvent`) that can be implemented for CalDAV or Microsoft Graph.

## 5. PDF quotations

- Generated on the server with `pdf-lib` from **the same server-side pricing engine** (prices are never taken from the browser).
- Content: Reckonwell logo and colours, customer details, reference, date, valid-until (Instant Quote: 7 days), line items with monthly/one-off basis, totals, notes (e.g. the 5% R&D success fee), the details the estimate is based on, VAT treatment, exclusions, next steps with the booking link, and a footer on every page.
- **Labelling:** "Indicative estimate — not a binding offer. Final fees are confirmed in an engagement letter." Requirements tools and manual pricing (e.g. the R&D retainer range) produce an **"Enquiry summary"** with no prices.
- Once prices are approved, the title can change to "Quotation" in one place.

## 6. Outstanding pricing conflicts
Ten items, nine open; payroll is resolved. See [`pricing-conflicts-report.md`](./pricing-conflicts-report.md). Nothing was changed automatically.

## 7. SEO summary
- **Every page:** unique title (≤ 65 characters) and description (70–160), one H1, a canonical URL on `https://www.reckonwell.com`, and BreadcrumbList.
- **Structured data:**
  - AccountingService on every page.
  - Service on the service and industry pages, including the startup page.
  - FAQPage wherever there are FAQs.
- **Target searches covered by titles and copy:**
  - The finance team itself: outsourced finance team, finance outsourcing for SMEs, outsourced bookkeeping UK and bookkeeping for growing companies.
  - Specific services: accounts payable, credit control outsourcing, management accounts, Xero bookkeeping and setup, and group company accounting.
  - Each industry: technology, e-commerce, property company accounting, manufacturing and hospitality bookkeeping.
- **Homepage focus:** outsourced finance team and bookkeeping, not low-cost tax returns.
- **Indexing:** pre-launch, every page is `noindex` and `robots.txt` disallows everything unless `VERCEL_ENV=production`. This flips automatically on the production deployment.
- **Audit:** `npm run seo:audit` → 29 pages, 0 issues.

## 8. Automated test results (actual)
`npm run check` (lint → types → tests → build):
- **ESLint:** pass · **TypeScript:** pass · **Build:** 38 routes generated
- **Vitest:** 10 files, **71 tests passed** with a Postgres database (`npm run test:db` for the store suite); 68 passed + 3 skipped without one.
  - Pricing (incl. payroll £4/£25 rule) · registry · scoping · email escaping · route integrity
  - Booking: Europe/London conversion incl. both 2026 clock changes, slot rules, buffers, bank holidays, notice period
  - Google Calendar provider (mocked API): create with Meet link, idempotent retry, conflict, cancelled-event ID reuse · ICS format
  - PDF content (via `pdftotext`): figures, labels, disclaimers; no prices in summaries
  - Postgres store (real database): enquiry idempotency, double-booking prevention, **8 concurrent requests for one slot → exactly 1 booking**
  - API routes end to end: request mode, live mode with fake calendar (event before emails, `.ics` attached, no duplicate emails, clash refused, conflict releases slot), enquiry with PDF and no duplicate emails

## 9. Manual QA and screenshot review
- **Browser crawl:** 29 sitemap pages and 29 unique internal links, **0 broken**. All 10 old URLs redirect correctly. Unknown pages return 404.
- **Booking page:** request flow tested in the browser (validation, maximum three days, success with reference; both emails produced). One overflow bug was found and fixed: the row of day buttons overflowed the card on desktop and widened the page on mobile.
- **Enquiry flow:** Instant Quote submission produced reference `RW-…`, and both emails carried the PDF attachment.
- **Desktop (1440px) and mobile (390px):** 11 key pages loaded with **no runtime errors and no horizontal overflow**.
- **Not testable here without credentials:** real email delivery (Brevo), live Google Calendar booking, and the production database. The logic is covered by the mocked and integration tests above.

## 10. Production readiness checklist

| # | Item | Owner | Status |
| --- | --- | --- | --- |
| 1 | Rotate the Brevo key; rotate the Tally key (exposed on the old site) | Reckonwell | ☐ |
| 2 | Authenticate reckonwell.com in Brevo (DNS at IONOS) | Reckonwell | ☐ |
| 3 | Create a Postgres database and set `DATABASE_URL` | Reckonwell / dev | ☐ |
| 4 | Decide: Google Calendar for live booking (or keep request mode) and set the credentials | Reckonwell | ☐ |
| 5 | Confirm booking hours, call length, notice and buffer | Reckonwell | ☐ |
| 6 | Resolve the pricing conflicts (report) and VAT wording | Reckonwell | ☐ |
| 7 | Approve privacy policy changes (fix the "[X years]" placeholder) | Reckonwell + adviser | ☐ |
| 8 | Confirm trust logo classifications (certification / membership / partner) | Reckonwell | ☐ |
| 9 | Decide on the London borough pages and US section (redirect or rebuild) | Reckonwell | ☐ |
| 10 | Analytics: choose a tool, add a consent banner, load the tag | Reckonwell / dev | ☐ |
| 11 | Connect the repo to Vercel; set env vars for Preview and Production | dev | ☐ |
| 12 | Preview test: contact form, Instant Quote (PDF), booking, partner form | Reckonwell | ☐ |
| 13 | Point www.reckonwell.com at the new deployment (after approval) | Reckonwell | ☐ |
| 14 | Submit the sitemap in Google Search Console; monitor 404s for 2–4 weeks | Reckonwell | ☐ |
