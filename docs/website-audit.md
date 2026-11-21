# Website audit — reckonwell.com

**Audited:** 21 November 2026
**Method:** I fetched the public pages and their compiled JavaScript bundles over HTTPS, read the CSS, took screenshots, and checked DNS records. Nothing on the production site was changed.
**Raw evidence:** the prettified bundles are not committed; you can re-fetch them from the chunk URLs quoted below.

---

## 1. Summary

| Question | Finding |
| --- | --- |
| Does `reckonwellnew` contain a website? | **No.** The repository was empty, with no commits. Stage 1 sets up a new Next.js app (see `project-plan.md`). |
| What is the live site built with? | Next.js (App Router) generated with **Rocket.new**, with Rocket analytics (`static.rocket.new`). Tailwind CSS. |
| Is the original source code available? | **No.** There is no repository access. Only the **compiled client bundles** are public, and source maps return `403`. |
| Can the calculator pricing be recovered? | **Yes, for four calculators.** Their pricing runs in the browser, so I recovered the exact rules from the bundles. The ports were verified against the original functions with 60,000 randomised inputs (§7). |
| Can the server integrations be recovered? | **No.** Leads, bookings and partner forms POST to `/api/calculator-lead`, `/api/notify` and `/api/referral-apply`. The server code, email templates and lead storage for those routes are not public (§9). |
| Does the live booking system have availability? | **No.** Visitors pick any future date and type a time. The site then sends a notification. There is no slot checking, no calendar event and no invite (§8). |

---

## 2. Positioning: live site vs new brief

| | Live site | New brief |
| --- | --- | --- |
| Headline | "Run your business. *We'll run your finances.*" | "We look after the financial side of growing businesses." |
| Category | "Fractional / part-time finance department for founder-led businesses" | Outsourced accounting and **financial operations** for growing UK businesses |
| Emphasis | Daily oversight, WhatsApp access, help raising capital | Bookkeeping, reconciliations, AP/AR, credit control, management accounts, controls, groups |
| Audience note (live) | "Founder-led and owner-managed businesses billing between £250k and £10m annually" | Startup → growing → established → group |

The new site keeps the tone of the live headline, which is plain, confident and human. It shifts the substance to ongoing monthly financial operations, with fundraising support as a secondary benefit.

---

## 3. Page inventory

### 3.1 Linked from the live navigation and footer
`/` · `/industries` · `/industries/{technology,ecommerce,property,manufacturing,hospitality}` · `/#pricing` (an anchor, not a page) · `/referrals` (Partner with us) · `/book` · `/quotation-calculator` (Instant Quote) · `/final-accounts-ct600-calculator` · `/making-tax-digital` · `/self-assessment` · `/r-and-d-tax-relief` · `/accounting/{london,old-street,moorgate,city-of-london,soho,kings-cross,farringdon}` · `/privacy-policy` · `/terms-of-service`

### 3.2 Additional pages found only in `sitemap.xml`
`/services` · `/fractional-finance-department` · `/contact` · `/limited-company-accounting` · `/self-employed-accounting` · `/bookkeeping-services` · `/payroll-services` · `/vat-returns` · `/company-formation` · `/london-payroll-services` · `/mtd-calculator` · 15 more London borough pages (`/accounting/westminster` … `/accounting/newham`) · a **US section** (`/us`, 8 city pages, 4 US guides).

### 3.3 Not present on the live site
`/pricing`, `/tools`, `/calculators`, `/vat` and `/payroll` all return 404. The brief's **Groups of Companies**, **Startups** and **Pricing** pages are new.

> **Decision needed:** whether the **US section** and the **London borough pages** carry over. They have SEO value but are outside the brief. My recommendation is to keep the URLs (redirect or migrate them) so existing rankings aren't lost. See `project-plan.md` §6.

---

## 4. Brand

### 4.1 Colours (from the live CSS, `/_next/static/css/90552696bef7391a.css`)

| Token (live) | Hex | Role |
| --- | --- | --- |
| `--primary` | `#12233f` | Navy: primary brand colour, buttons, headings accent |
| `--primary-hover` | `#0b172b` | Deep navy |
| `--secondary` | `#275e86` | Steel blue |
| `--background` | `#fff1e0` | Warm cream page background |
| `--surface` | `#f6e9d8` | Sand: alternate sections |
| `--card-darker` | `#e9decf` | Oat |
| `--accent-tint` / `--primary-light` | `#e3e7ed` | Mist: cool tint |
| `--secondary-light` | `#e4eaef` | Haze |
| `--body-text` | `#333333` | Body copy |
| `--muted` | `#66605c` | Secondary text |
| `--muted-foreground` | `#8a8378` | Tertiary text (low contrast: large text only) |
| `--green-accent` | `#2d6a4f` | Positive |
| `--red-accent` | `#8c3d2b` | Negative |
| Footer | `#000000` bg, `#b8b8b8` text, `#d69aab` link hover | Dark footer |
| `--radius` | `2px` | Sharp corners |

**Legacy remnants:** the bundles still contain an older gold theme (`rgba(201,168,76,…)`, `#080808`, `#C9A84C`) and Tailwind blue (`#2563eb`) on the R&D page. These are inconsistent with the current brand and are **not** carried forward.

### 4.2 Typography
- **Display:** Newsreader (serif, used in italic for emphasis, e.g. "*We'll run your finances.*")
- **Body/UI:** Work Sans

### 4.3 Logo and assets (copied into `public/`)

| Asset | Live path | New path |
| --- | --- | --- |
| Wordmark, black | `/assets/images/reckonwell-high-resolution-logo-grayscale-transparent-…png` | `/brand/reckonwell-logo-black.png` |
| Wordmark, white | `/assets/images/Reckonwell-1779490857835.png` | `/brand/reckonwell-logo-white.png` |
| Favicon | `/favicon.ico` | `src/app/favicon.ico` |

Not used: `app_logo.png` (gold chevrons from the old theme) and an "RW" signature image, which may be the founder's signature. Please confirm.

> **Asset request:** I only have the wordmark as a 2000×270 PNG. An **SVG logo** and a **square brand mark** would give sharper rendering, a proper favicon/app icon set and Open Graph images.

---

## 5. Content worth preserving
- Founder quote: *"You should make decisions with a clear picture of your finances, not wait for the year-end accounts to find out what happened."* — Vadim Siubaeff, Founder
- FAQs: what we handle, working alongside existing teams, onboarding in 2–3 weeks, rolling monthly with no contract
- Industry descriptions (Technology, E-Commerce, Property, Manufacturing, Hospitality) and long-form FAQ content on each industry page, which is good for SEO
- Company details: 124 City Road, London EC1V 2NX · 020 3818 6205 · ICO reg. CSN3799691

---

## 6. Trust: "Certified & Partnering With"

The live site groups every logo under one heading. The new site should say accurately what each relationship is. **Each one needs confirming by Reckonwell before launch.**

| Logo | What the live asset shows | Proposed classification | Confirm? |
| --- | --- | --- | --- |
| HMRC AML Supervised | Shield badge "HMRC AML Supervised" | **Regulatory supervision** | Please confirm the supervision reference |
| ICO | ICO logo, footer states reg. CSN3799691 | **Registration** (data protection) | Confirmed on the live site |
| IAB | International Association of Bookkeepers | **Professional membership** | Please confirm membership level |
| Xero | Xero logo with "Certified Advisor" badge | **Certification** (software) | Please confirm |
| QuickBooks | "Certified ProAdvisor – Advanced Online" badge | **Certification** (software) | Please confirm |
| Revolut Business | Wordmark | **Supported platform** or **commercial partner** | Is there a formal partnership? |
| Tide | Wordmark | **Supported platform** or **commercial partner** | Is there a formal partnership? |

Until confirmed, the shared component (`src/components/trust/TrustStrip.tsx`) keeps the live site's neutral heading. The data in `src/content/trust.ts` already records each item's `kind` and a `confirmed` flag.

---

## 7. Calculators and pricing

All four calculators below compute prices **in the browser**, so I recovered their rules from the compiled bundles. They have been ported to typed functions in `src/lib/pricing/`, with unit tests (`pricing.test.ts`). I also compared my ports with the original minified functions: **20,000 random inputs each** for the Instant Quote, CT600 and comparison calculators, plus **all 24 possible MTD input combinations**. **All outputs matched exactly.**

Every rule set is flagged `recovered-unapproved` in code. These are the prices the live site shows today, but §7.6 lists conflicts that need a decision before any quotation is sent automatically.

### 7.1 Instant Quote: `/quotation-calculator`
Chunk: `app/quotation-calculator/page-a867a3173d02f0d6.js` → `src/lib/pricing/instant-quote.ts`

| Item | Rule |
| --- | --- |
| Bookkeeping (monthly) | **£2 × transactions per month** |
| Payroll (monthly) | **£3 × employees** |
| Self Assessment (one-off, sole traders) | **£200** |
| Final Accounts & CT600 (one-off, limited companies) | monthly revenue < £1,000 → **£500**; £1,000–£10,000 → **£750**; > £10,000 → **£1,000**; × number of companies if a group |
| Director Self Assessment | **£200 per director** |
| R&D Tax Credits application | **£300** |
| Patent Box application | **£300** |
| VAT registration assistance | **£50** |
| Accounting software setup & training | **£100** |
| Bookkeeping clean-up (one-off) | **£2 × transactions × months** (uses the bookkeeping volume if bookkeeping is selected) |
| Quote reference | `RW-YYYYMMDD-HHMMSS`, valid for **7 days** |

Inputs: business type, 15 industries, group of companies (and how many), bookkeeping volume, employees, clean-up months, monthly revenue, directors. Submission POSTs the full breakdown to `/api/calculator-lead`.

### 7.2 Final Accounts & CT600 calculator: `/final-accounts-ct600-calculator`
Chunk: `app/final-accounts-ct600-calculator/page-496d25bfa2de59c2.js` → `src/lib/pricing/final-accounts-ct600.ts`

A 7-step monthly price:
1. **Base fee:** £150; £300 if profit ≥ £250k or 6+ staff; £500 if profit ≥ £500k or 20+ staff; £750 if profit ≥ £1m
2. **Monitoring multiplier:** annual ×1, quarterly ×1.3, monthly ×1.6 (rounded)
3. **Transaction volume multiplier:** low ×1, medium ×1.2, high ×1.5 (rounded)
4. **Payroll:** £40 × headcount (bands count as 0 / 3 / 13 / 25 employees)
5. **Quarterly VAT returns:** +£60 if monitoring is quarterly or monthly
6. Add-ons: monthly management accounts +£100 · director salary planning **+£50 (always added)** · ongoing R&D relief +£200 · investor reporting +£100

### 7.3 MTD calculator: `/mtd-calculator`
Chunk: `app/mtd-calculator/page-35789cbad2e50a47.js` → `src/lib/pricing/making-tax-digital.ts`

| Tier | Monthly | Landlord surcharge: 2 / 3–5 / 5+ properties |
| --- | --- | --- |
| MTD filing only | £100 | +£25 / +£25 / +£50 |
| MTD + monthly monitoring | £175 | +£40 / +£40 / +£75 |
| MTD + full accounting | £250 | +£50 / +£50 / +£100 |

### 7.4 "Outsource vs hire" comparison: `/fractional-finance-department`
Chunk: `app/fractional-finance-department/page-3575453204e79004.js` → `src/lib/pricing/finance-team-comparison.ts`

Monthly: bookkeeping £2/transaction · **payroll £6/employee** · HR assistance £5/employee · VAT returns £150 per return ÷ 12 · senior analysis +£1,000 · fundraising support +£1,000. One-off: Self Assessment £200/person, Corporation Tax return £500/£750/£1,000 by revenue.
Hiring benchmarks: bookkeeper £34,650 · finance manager £67,690 · fractional CFO £36,000 · HR retainer £3,600 a year. **These salary figures have no cited source**, and they need one before reuse.

### 7.5 R&D tax relief estimator: `/r-and-d-tax-relief` (not ported)
The formula is SME: 20% of R&D spend; large company: 25% × (spend + 130% of spend); Patent Box: 15% of IP revenue. It appears to **pre-date the merged R&D scheme** that applies to accounting periods beginning on or after 1 April 2024. It is a tax-relief *estimate*, not a Reckonwell fee. **I have deliberately not ported it.** A qualified adviser should specify the current rules before any R&D estimator is rebuilt.

### 7.6 Pricing conflicts that need a decision

| # | Conflict | Where |
| --- | --- | --- |
| 1 | **Final Accounts & CT600:** one-off £500 / £750 / £1,000 vs **monthly** from £200 (7-step model) | Instant Quote vs CT600 calculator |
| 2 | **Payroll:** £3 vs £6 per employee per month (and £40/employee in the CT600 model) | Instant Quote vs comparison vs CT600 |
| 3 | **R&D claim:** £300 one-off vs "**From £850 one-off**" | Instant Quote vs service cards on `/accounting/london` |
| 4 | **Bookkeeping "From £150/month"** vs £2/transaction, which gives £150 only at 75 transactions | `/bookkeeping-services` vs Instant Quote |
| 5 | **Fractional Finance:** "All included — £1,000/month flat" vs itemised calculator on the same page | `/fractional-finance-department` |
| 6 | **Self-employed "From £80/month"** and **Company formation "From £299"** have no calculator rules behind them | `/self-employed-accounting`, `/company-formation` |

Other published "from" prices: Limited Company Accounting from £150/mo · MTD from £100/mo · Partner commission **10% of the net monthly fee, for the life of the client**.

> **Recommendation:** agree one pricing rulebook (a single `pricing` config) used by every calculator, the Instant Quote, PDF quotes and the Pricing page. Until that is agreed, Stage 6 will show **estimates** and send an **acknowledgement** rather than a binding PDF quotation (brief §10).

---

## 8. Booking: `/book`
Chunk: `app/book/page-c00b8e8716412c25.js`

- Two steps: (1) a month calendar where any day from today is selectable, including weekends; (2) a free hour/minute entry (default 10:00) with a timezone choice of Europe/London or America/New_York, plus name, email, phone and message.
- On submit it POSTs `{type: "booking", fields: {…, slot: "Monday 24 November 2026 at 10:00 (Europe/London)"}}` to `/api/notify`.
- **No availability, no double-booking protection, no calendar event, no `.ics` invite.** Customer confirmation behaviour depends on the unknown server code.
- The page describes a 30-minute call.

This means the brief's booking requirements (availability, calendar booking, invites) are **new functionality**, not a migration.

---

## 9. Integrations and items that need the original source or account access

| Item | What is known | What is needed |
| --- | --- | --- |
| `/api/calculator-lead` | Receives every calculator and contact submission (payloads documented in the bundles) | Where leads go (email, CRM, database?) and any templates |
| `/api/notify` | Receives booking submissions | Whether a customer confirmation is sent, and to whom |
| `/api/referral-apply` | Partner applications (first/last name, email, phone, role, …) | Destination and follow-up process |
| Email provider | DNS shows **Brevo** domain verification; mail is hosted at **IONOS** (`mx00/mx01.ionos.co.uk`); SPF includes IONOS only | Confirm the provider; Resend needs DNS records added at IONOS |
| Analytics | Rocket analytics script; custom events (`calculator_opened`, `form_submitted`, …) | Whether GA4 or Search Console exist; access for Stage 8 |
| Calendar | Not integrated | Which calendar Vadim uses (IONOS, Google, Outlook), so invites land in it |
| Legal pages | Present on the live site | Confirm they can be copied over unchanged |

---

## 10. SEO observations
- **Duplicate titles and descriptions:** several pages (CT600 calculator, quote, bookkeeping, company formation, contact) use the homepage's default title and description.
- The sitemap uses `https://reckonwell.com/…` while the site serves `https://www.reckonwell.com/…`. Canonical host consistency should be enforced.
- JSON-LD exists on some pages (Service/Offer, BreadcrumbList, AccountingService).
- Many service pages render their content client-side, which is weaker for crawlers. The new build server-renders all content.
- The new site must **preserve or 301-redirect every URL in the current sitemap** (map in `project-plan.md` §6).
