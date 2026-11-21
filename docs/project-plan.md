# Reckonwell new website: project plan

**Repository:** `vadim-sv/reckonwellnew` · **Development branch:** `claude/intelligent-faraday-kb2332`
**Status:** Stage 1 complete (21 November 2026). Nothing has been deployed, and the production site is untouched.

Related documents: [`website-audit.md`](./website-audit.md) · [`pricing-rules.md`](./pricing-rules.md) · [`design-system.md`](./design-system.md) · [`stages/`](./stages/)

---

## 1. Goal

A premium, modern and interactive website for Reckonwell that:
- wins **ongoing monthly** outsourced financial operations clients (primary goal);
- keeps standalone compliance services easy to buy (secondary goal);
- generates **qualified** enquiries through calculators, the Instant Quote and discovery-call booking;
- ranks for UK searches such as *outsourced bookkeeping*, *management accounts*, *credit control services* and *group company accounting*;
- preserves the brand, prices, industries, trust logos and existing URLs.

---

## 2. Technical architecture

### 2.1 Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 16.4** (App Router, React 19.3, TypeScript) | Same family as the live site; server rendering for SEO; route handlers for the backend |
| Styling | **Tailwind CSS v4** with brand tokens in `@theme` | Fast, consistent, tokens shared by every component |
| Motion | **motion** (Framer Motion) + CSS keyframes | Scroll-linked, reversible animation with reduced-motion support |
| Icons | lucide-react | Light, consistent stroke icons |
| Validation | **zod** | One schema validates each form on the client and the server |
| Tests | **Vitest** (unit, especially pricing); Playwright (end-to-end, from Stage 6) | Pricing must be provably correct |
| Email | **Resend** + React Email templates | Transactional email with attachments (PDF, `.ics`) |
| PDF quotes | `@react-pdf/renderer`, rendered on the server | Branded PDFs without a headless browser |
| Database | Postgres (Neon via the Vercel Marketplace) | Bookings (unique slot constraint), quote and lead records |
| Spam protection | Cloudflare Turnstile + rate limiting | Protects public forms without annoying captchas |
| Hosting | **Vercel** | Preview URL per branch, edge CDN, environment-variable management |

All secrets (Resend key, database URL, Turnstile secret) are **server-only** environment variables. Nothing sensitive uses the `NEXT_PUBLIC_` prefix. See `.env.example`.

### 2.2 Folder structure

```
src/
  app/                      # Routes (App Router)
    layout.tsx              # Fonts, header/footer, organisation JSON-LD
    page.tsx                # Home
    (marketing)/…           # Service, industry, groups, startups pages   [Stage 4–5]
    tools/…                 # Calculators                                  [Stage 6]
    instant-quote/          # Instant Quote                                [Stage 6]
    book/                   # Booking                                      [Stage 7]
    api/                    # Route handlers: quote, booking, partner, contact [Stage 6–7]
    sitemap.ts, robots.ts
    design-system/          # Internal preview (noindex)
  components/
    ui/                     # Primitives: Button, Container, Section, …
    layout/                 # Header, footer, navigation
    motion/                 # Reveal and scroll helpers
    illustrations/          # Animated financial scenes                     [Stage 3]
    trust/                  # Certified & partnering logos
    calculators/            # Calculator UI shells                          [Stage 6]
  content/                  # Typed page content (services, industries, FAQs, trust)
  lib/
    site.ts                 # Company details: single source of truth
    navigation.ts           # Site map, nav, industries, compliance services
    pricing/                # Recovered pricing rules + tests (pure functions)
    email/, booking/, pdf/  # Server-side services                         [Stage 6–7]
docs/                       # Plan, audit, design system, stage notes
public/brand, public/trust  # Logos
```

### 2.3 Key design decisions
- **Pricing as pure functions** (`src/lib/pricing`). The same code powers the on-page calculators, the server that generates PDF quotes and the Pricing page, so the numbers can never drift apart. The server **recalculates** every quote and never trusts a price sent from the browser.
- **Content as typed data** (`src/content`). Pages are composed from reusable sections, so adding an industry or service means adding a content file, not new layout code.
- **Static by default.** Marketing pages are prerendered; only form submissions and booking availability hit the server.
- **Noindex until launch.** `robots.txt` and the meta robots tag block indexing unless `VERCEL_ENV=production`.

### 2.4 Booking and email design (Stage 7)

```
Visitor ─► /book  ── GET /api/booking/availability ─► rules (Mon–Fri, hours, 30-min slots,
                                                       buffers, notice period, UK bank holidays)
                                                       minus existing bookings in Postgres
        ─► POST /api/booking ─► validate (zod + Turnstile) ─► insert booking (unique slot)
                                ─► Resend: customer confirmation + .ics invite (METHOD:REQUEST)
                                ─► Resend: internal notification to vadim.s@reckonwell.com + .ics
                                ─► signed links to cancel or reschedule
```

- `.ics` invites work with any calendar (IONOS, Outlook, Google, Apple), which matters because reckonwell.com mail is hosted at **IONOS**, not Google Workspace.
- **Optional:** two-way sync with Vadim's real calendar so personal commitments block slots. That needs the calendar provider (a CalDAV/IONOS, Google or Microsoft 365 API) and is planned as an add-on.
- **Alternative:** embed Cal.com. It's faster to launch and handles calendar sync, but it's less on-brand and a third-party dependency. Decision needed (§7).

### 2.5 Quotation flow (Stage 6)

```
Instant Quote ─► live estimate in the browser (shared pricing functions)
             ─► "Send me this quote" ─► POST /api/quote ─► server recalculates
                 ├─ all items have approved rules ─► branded PDF + email to customer,
                 │                                    copy to vadim.s@reckonwell.com, booking link
                 └─ any item needs manual pricing  ─► acknowledgement email (no amount),
                                                      internal notification with the inputs
```

---

## 3. Information architecture

| Page | Proposed URL | Stage |
| --- | --- | --- |
| Home | `/` | 3 |
| Outsourced Financial Operations | `/outsourced-financial-operations` + sub-pages (bookkeeping, accounts payable, accounts receivable & credit control, management accounts, financial controls, accounting software) | 4 |
| Accounting & Compliance | `/accounting-and-compliance` + `/annual-accounts-ct600`, `/self-assessment`, `/vat-returns`, `/payroll-services`, `/making-tax-digital`, `/r-and-d-tax-relief` | 5 |
| Industries | `/industries`, `/industries/{technology,ecommerce,property,manufacturing,hospitality}` | 4 |
| Groups of Companies | `/groups-of-companies` | 4 |
| Startups (+ Founder's Launch Offer) | `/startups` | 4 |
| Pricing | `/pricing` | 6 |
| Tools & Calculators | `/tools`, `/tools/final-accounts-ct600`, `/tools/making-tax-digital`, `/tools/outsource-vs-hire` | 6 |
| Instant Quote | `/instant-quote` | 6 |
| Book a Discovery Call | `/book` | 7 |
| Partner With Us | `/partners` | 5 |
| Contact, Privacy, Terms | `/contact`, `/privacy-policy`, `/terms-of-service` | 5 |
| London location pages | `/accounting/{area}` (kept) | 8 |

Existing compliance URLs (`/self-assessment`, `/making-tax-digital`, `/r-and-d-tax-relief`, `/vat-returns`, `/payroll-services`) are **kept as they are** to protect rankings.

---

## 4. Stages

Each stage ends with a working build, a stage note in `docs/stages/`, a commit on the development branch and a review by you before the next stage starts.

| Stage | Scope | Main deliverables | Acceptance |
| --- | --- | --- | --- |
| **1. Audit & setup** ✅ | Repository audit, live-site audit, architecture, project setup | Next.js app, tokens, header/footer, trust strip, recovered pricing + tests, three docs | Lint, types, tests and build all pass |
| **2. Design system & navigation** | Full component library; mega-menu; breadcrumbs; forms; FAQ; CTA bands; mobile nav polish | `/design-system` complete; navigation final | Keyboard and screen-reader checks pass; AA contrast |
| **3. Homepage & illustrations** | Final homepage copy and six animated financial scenes | Scroll-linked, reversible animation; reduced-motion fallbacks | Lighthouse ≥ 90 on mobile; no layout shift |
| **4. Services, industries, groups, startups** | Financial Operations hub and sub-pages; 5 industry pages (migrating the existing FAQ content); Groups page; Startups + Founder's Launch Offer | Content model in `src/content` | Copy approved; internal links in place |
| **5. Partners & compliance** | Partner Programme with enquiry form; compliance hub and service pages; contact; legal | Partner form (stored + emailed) | Form validation and spam protection |
| **6. Calculators & quotes** | Instant Quote, CT600, MTD, outsource-vs-hire, Pricing page; PDF quotes; quote emails | `/api/quote`, PDF template, email templates | **Pricing rulebook approved**; unit + end-to-end tests |
| **7. Booking & emails** | Availability engine, booking API, confirmations, `.ics` invites, internal notifications, cancel/reschedule | `/api/booking/*`, database schema | End-to-end booking test; no double bookings |
| **8. SEO, testing & optimisation** | Metadata per page, JSON-LD (Service, FAQPage, Breadcrumb, Organisation), sitemap, 301 redirect map, performance, accessibility audit, analytics | Launch checklist | Every old URL resolves (200 or 301); Core Web Vitals green |

---

## 5. SEO plan (summary)
- **Target clusters:** outsourced bookkeeping · outsourced accounting services · outsourced finance operations · management accounts · accounts payable outsourcing · credit control services · group company accounting · bookkeeping for growing businesses · industry bookkeeping (5) · startup accounting services.
- One primary keyword per page, natural headings (one H1), and descriptive titles under 60 characters and descriptions under 155.
- Structured data: `AccountingService` (done), `Service` + `Offer` (only with approved prices), `FAQPage`, `BreadcrumbList`.
- Internal linking: service ↔ industry ↔ tool ↔ booking.
- Canonical host: decide between `www.reckonwell.com` and `reckonwell.com`, and redirect the other.

---

## 6. URL preservation and redirect map (Stage 8)

| Old URL | New URL |
| --- | --- |
| `/quotation-calculator` | `/instant-quote` (301) |
| `/final-accounts-ct600-calculator` | `/tools/final-accounts-ct600` (301) |
| `/mtd-calculator` | `/tools/making-tax-digital` (301) |
| `/referrals` | `/partners` (301) |
| `/services` | `/accounting-and-compliance` (301) |
| `/fractional-finance-department` | `/outsourced-financial-operations` (301) |
| `/bookkeeping-services` | `/outsourced-financial-operations/bookkeeping` (301) |
| `/limited-company-accounting` | `/accounting-and-compliance` or a dedicated page (decision) |
| `/self-employed-accounting` | `/self-assessment` or a dedicated page (decision) |
| `/company-formation` | `/startups` (301) |
| `/london-payroll-services` | `/payroll-services` (301) |
| `/industries/*`, `/self-assessment`, `/making-tax-digital`, `/r-and-d-tax-relief`, `/vat-returns`, `/payroll-services`, `/book`, `/contact`, `/accounting/*`, legal pages | **Unchanged** |
| `/us/*` | Decision needed: keep, or redirect to the home page |

I'll check this against Search Console data before launch.

---

## 7. Decisions and information needed from Reckonwell

| # | Needed for | Question |
| --- | --- | --- |
| 1 | Stage 6 | **Approve the pricing rulebook** in [`pricing-rules.md`](./pricing-rules.md) and resolve the nine conflicts in §8. In particular: is Final Accounts one-off or monthly; is payroll £3, £6 or £40 per employee; and does MTD start at £34 or £100? |
| 2 | Stage 6 | Are prices shown **excluding VAT**? Is Reckonwell VAT-registered? |
| 3 | Stage 4 | **Founder's Launch Offer:** what is included, and the price (or "price on request")? |
| 4 | Stage 2 | **Trust logos:** confirm the classification of each one (`website-audit.md` §6) |
| 5 | Stage 7 | Booking: working hours, slot length (30 min?), buffers, minimum notice, video link (Google Meet, Teams or Zoom?), and which **calendar** Vadim uses |
| 6 | Stage 7 | Custom booking (recommended) or a Cal.com embed? If Vadim uses **Google Calendar**, the original source's unused Google Calendar integration can be rebuilt (with correct UK time zones) for real availability and invites |
| 7 | Stage 6–7 | Email: keep **Brevo** (already used by the current site) or move to **Resend** as the brief suggests? Either way, who manages DNS at **IONOS**? Which "from" address should we use? |
| 8 | Stage 5 | Partner programme: keep **10% lifetime commission**, or change the terms for accountancy practices and bookkeeping partnerships? |
| 9 | Stage 8 | Keep the **US section** and the 22 London location pages? |
| 10 | Stage 2 | Logo as **SVG**, plus a square brand mark |
| 11 | Stage 4 | Real client testimonials or case studies we're allowed to publish (none will be invented) |
| 12 | Stage 8 | Access to Google Search Console and analytics |
| 13 | Footer | Registered company name and number |
| 14 | Now | **Rotate the Brevo API key and the Tally API key.** The Brevo key was shared inside the source zip, and the Tally key is exposed in the live site's browser code (`website-audit.md` §9) |

---

## 8. Risks

| Risk | Mitigation |
| --- | --- |
| Lost rankings at launch | Keep or 301-redirect every old URL; migrate long-form FAQ content; Search Console check |
| Wrong prices in automated quotes | One approved rulebook; server-side recalculation; tests; acknowledgement fallback |
| Email deliverability | Verify the domain in Resend (SPF/DKIM/DMARC) before go-live |
| Double bookings | Unique constraint on the slot in the database; transactional insert |
| Over-animation hurting performance or accessibility | Transform/opacity only; pause off-screen; reduced-motion fallbacks; Lighthouse budget |
| Claims about partnerships or certifications | Confirm each logo's status before launch (§7 #4) |

---

## 9. Working agreement
- All work happens on `claude/intelligent-faraday-kb2332`. No merge to the production branch and no deployment without your approval.
- Every stage: `npm run check` (lint, types, tests, build) must pass.
- No invented prices, formulas, testimonials or credentials.
