# Stage 06: Booking, PDF quotations, transactional emails and final SEO

**Completed:** 22 November 2026 · **Branch:** `claude/intelligent-faraday-kb2332`

Full details, configuration steps and the launch checklist: [`../launch-readiness.md`](../launch-readiness.md).

## Summary
- **Email:** Brevo preferred (Resend fallback), attachments, delivery logging with provider message IDs.
- **Enquiries:** server-side recalculation (unchanged), unique references, Postgres storage, idempotent submissions, PDF attached to both emails, booking link in acknowledgements.
- **PDFs:** "Indicative estimate" / "Enquiry summary" from the same pricing engine; never presented as a binding offer.
- **Booking:** `/book` with live Google Calendar scheduling (Europe/London, DST-safe, buffers, bank holidays, layered double-booking prevention) or a clearly labelled request flow when no calendar is configured.
- **SEO:** titles and descriptions tightened for target searches; `npm run seo:audit` (29 pages, 0 issues).
- **Analytics:** privacy-safe conversion events prepared; inactive until a tag and consent are added.
- **Reports:** pricing conflicts (10 items, nothing changed automatically) and proposed privacy policy changes (not applied).

## Verification
- `npm run check` passes; **71 tests** with a database (68 + 3 skipped without one).
- Browser QA: 29 pages, 0 broken internal links, 0 runtime errors, no horizontal overflow at 1440px and 390px; the booking page overflow bug was found and fixed.

## Unchanged by design
Calculator formulas, pricing rules (except the approved payroll rule from earlier), legal page wording, existing routes and redirects (except removing the temporary `/book` redirect).
