# Privacy policy: proposed changes for approval

**Status:** proposal only. The live wording at `/privacy-policy` has **not** been changed.
**Important:** this is a comparison of the current policy with what the new website actually does. It is **not legal advice and has not been legally reviewed.** Please have it checked by a qualified adviser before publishing.

The current policy was carried over unchanged from reckonwell.com (Effective 01/01/2024, last updated 02/09/2025).

---

## 1. Problems in the current policy (fix regardless of the new site)

| # | Current text | Issue |
| --- | --- | --- |
| 1 | §5 Data retention: "For up to **[X years]** after the end of our professional relationship" | An **unfilled placeholder** is published on the live site. A real retention period is needed. |
| 2 | §8: "contact us at: **info@reckonwell.com**" | The website and emails use **vadim.s@reckonwell.com**. Confirm that info@ exists and is monitored, or change the address. |
| 3 | §7: "For more details, see our **Cookie Policy**" | No cookie policy exists on either site. Remove the reference, or publish one. |
| 4 | §12: California (CCPA/CPRA) rights | Only needed if Reckonwell continues to target US clients (the old `/us` section). Confirm. |
| 5 | Company details | The policy names "Reckonwell Ltd". Consider adding the **company number** and **ICO registration number (CSN3799691)**. |

## 2. What the new website processes (facts for the update)

| Activity | Data collected | Where it goes | Retention (proposed: **you to decide**) |
| --- | --- | --- | --- |
| Contact and enquiry forms (all service pages, calculators, requirements tools, Instant Quote) | Name, email, optional phone, company, message, calculator/tool answers | Emailed to Reckonwell; acknowledgement emailed to the person; stored in the website database if `DATABASE_URL` is configured | e.g. 24 months if no engagement follows |
| Indicative estimate / enquiry summary PDFs | The same data, rendered as a PDF | Attached to both emails | As above |
| Discovery-call booking | Name, email, optional phone, company, enquiry type, message, chosen time | Stored in the database; calendar event created in Reckonwell's Google Calendar (when enabled) with the person as an attendee; confirmation emails | e.g. 24 months |
| Partner programme enquiries | Name, email, optional phone, organisation, partner type, message | Emailed and stored as above | e.g. 24 months, or the length of the partnership |
| Spam protection | A hidden form field; IP address used briefly for rate limiting (held in server memory only, not stored) | Not stored | Minutes |
| Server logs | Delivery logs record the **recipient's email domain** and provider message ID, not full addresses or content | Hosting provider logs | Per hosting provider |
| Analytics | **Not active.** Conversion events are prepared but send nothing unless an analytics tag is added with consent | n/a | n/a |
| Cookies | **The new site sets no cookies of its own.** Browser storage is not used for personal data | n/a | n/a |

### Processors to name (or describe by category)
- **Email delivery:** Brevo (Sendinblue SAS, France), or Resend if chosen instead
- **Hosting:** e.g. Vercel Inc. (USA). International transfer safeguards apply
- **Database:** e.g. Neon / Vercel Postgres (region to confirm)
- **Calendar:** Google LLC (Google Workspace / Google Calendar), if live booking is enabled

## 3. Suggested wording changes (draft)

**§1 Information we collect, add:**
> *Information you give us through our website forms and tools, including answers you enter into our price calculators and requirements tools, and the date and time you choose for a discovery call.*

**§2 How we use your information, add:**
> *To prepare an indicative estimate or summary of your enquiry, to arrange and confirm discovery calls (including sending calendar invitations), and to respond to partner programme enquiries.*

**§4 Sharing, replace "email platforms" with named categories:**
> *Service providers who help us run our website and services, including our email delivery provider (Brevo), our website hosting and database providers, and Google (if we arrange a call through Google Calendar).*

**§5 Retention:** replace "[X years]" with the periods you choose, for example:
> *Website enquiries that do not lead to an engagement are kept for up to 24 months. Client records are kept for 6 years after our relationship ends, to meet legal and regulatory requirements.*
*(The 6-year figure reflects common UK practice for financial records. Please confirm it with your adviser and AML obligations.)*

**§7 Cookies:** until analytics is added:
> *Our website does not currently use analytics or advertising cookies. If we introduce them, we will ask for your consent first and update this policy.*

**§14 Contact:** use one monitored address (see problem #2).

## 4. Before analytics is switched on
A consent banner (or a cookieless analytics product) is needed before GA4 or similar is loaded. The tracking code is already restricted to non-personal event names (see `src/lib/analytics.ts`).
