# Main pages: landing, services, industries, partners

**Completed:** 21 November 2026 · **Branch:** `claude/intelligent-faraday-kb2332`

## Pages

| Page | URL | Calculator | Form |
| --- | --- | --- | --- |
| Landing (for established companies extending their finance team) | `/` | Outsource vs hire | ✅ after calculator |
| Services index | `/services` | — | — |
| Outsourced finance team | `/outsourced-financial-operations` | Outsource vs hire | ✅ |
| Bookkeeping | `/bookkeeping-services` | Bookkeeping (Instant Quote rules) | ✅ |
| Payroll | `/payroll-services` | Payroll (Instant Quote rule, £3/employee) | ✅ |
| VAT returns | `/vat-returns` | VAT (£150/return + £50 registration) | ✅ |
| Annual accounts & CT600 | `/annual-accounts-ct600` | CT600 calculator | ✅ |
| Self Assessment | `/self-assessment` | Self Assessment calculator | ✅ |
| Making Tax Digital | `/making-tax-digital` | MTD calculator | ✅ |
| R&D tax relief | `/r-and-d-tax-relief` | R&D claim fee | ✅ (retainer → acknowledgement only) |
| Industries index + 5 industry pages | `/industries`, `/industries/{slug}` | — (links to service calculators) | ✅ |
| Instant quote | `/instant-quote` | Full Instant Quote | ✅ |
| Partner programme | `/partners` | — | ✅ partner form |
| Contact | `/contact` | — | ✅ |
| Privacy, Terms | `/privacy-policy`, `/terms-of-service` | Wording carried over unchanged | — |

Old URLs redirect permanently (`next.config.ts`), e.g. `/quotation-calculator` → `/instant-quote`, `/referrals` → `/partners`.

## How enquiries work
1. The calculator shows a live estimate from `src/lib/pricing/registry.ts`.
2. The form posts the **inputs**, not the price, to `/api/enquiry`. The server validates them and recalculates.
3. Emails: a notification to `EMAIL_INTERNAL_TO` (with inputs and estimate) and an acknowledgement to the customer. The acknowledgement includes the indicative estimate, except where pricing is manual (the R&D retainer range).
4. Spam protection: a honeypot field (silently dropped) and a per-IP rate limit. All user input is HTML-escaped in emails.

Email goes through Resend or Brevo, whichever key is set. **No key is set yet**, so in production the forms return a friendly error with the phone number and email address.

## Verification
- `npm run check`: lint, types, **26 tests** and a build of **29 routes**, all passing
- Every route returns 200; unknown industries return 404; old URLs return 308 redirects
- Browser test: calculator updates live, validation messages, successful submission, Instant Quote R&D note, nav dropdown
- No horizontal overflow at 390px or 1440px; reduced-motion visitors see a static final state

## Content notes
- Industry FAQs are carried over from the original site; other copy is new and aimed at established companies.
- Partner page keeps the current terms (10% of the net monthly fee for the life of the client).
- Footer now shows **Reckonwell Ltd**, taken from the original privacy policy.
