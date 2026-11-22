# Pricing rules: quotation and calculators

**Source:** the original website source code supplied as `reckonwell-main` (files dated 5 October 2026). Its prices match the live site on 21 November 2026.
**Code:** `src/lib/pricing/`. Every rule below is a pure function, with unit tests in `pricing.test.ts`.
**Verification:** each port was compared with the original function extracted from `reckonwell-main`. The Instant Quote, CT600, comparison, Self Assessment and R&D fee calculators were each tested with 20,000 random inputs; MTD was tested with every possible input. **All outputs were identical.** (This was before the approved payroll change, which now deliberately differs from the original in the Instant Quote, CT600 and comparison calculators.)

> **Changes approved by Reckonwell:** payroll is £4 per employee per month with a £25 monthly minimum (22 Nov 2026). Everything else below is unchanged from the original source.

> **Status: `recovered-unapproved`.** These are the prices the current site uses. Several contradict each other (§8). Until Reckonwell approves a single rulebook, the new site will show them as estimates. It will not send binding PDF quotations.

| # | Calculator | Live URL | Original file → new module |
| --- | --- | --- | --- |
| 1 | Instant Quote | `/quotation-calculator` | `quotation-calculator/page.tsx` → `instant-quote.ts` |
| 2 | Final Accounts & CT600 | `/final-accounts-ct600-calculator` | `final-accounts-ct600-calculator/page.tsx` → `final-accounts-ct600.ts` |
| 3 | Making Tax Digital | `/mtd-calculator` | `mtd-calculator/page.tsx` → `making-tax-digital.ts` |
| 4 | Self Assessment | `/self-assessment-calculator` (live, not linked in the sitemap) | `self-assessment-calculator/page.tsx` → `self-assessment.ts` |
| 5 | R&D claim fee | `/rd-tax-relief-calculator` (live, not linked in the sitemap) | `rd-tax-relief-calculator/page.tsx` → `rd-claim-fee.ts` |
| 6 | Outsource vs hire | `/fractional-finance-department` | `components/FractionalFinanceCalculator.tsx` → `finance-team-comparison.ts` |
| — | R&D *relief* estimator | `/r-and-d-tax-relief` | **Not ported** (§7) |
| — | Published "from" prices | various pages | → `published-prices.ts` |

---

## 1. Instant Quote

**Inputs:** business type (sole trader / limited company) · industry (15 options) · group of companies (and how many) · bookkeeping (transactions per month) · payroll (employees; "directors in payroll" is also asked but **does not affect the price**) · clean-up (months, and transactions if bookkeeping isn't selected) · one-off services.

| Item | Applies to | Price |
| --- | --- | --- |
| Bookkeeping | all | **£2 × transactions** per month |
| Payroll | all | **£4 × employees** per month, **minimum £25** *(changed 22 Nov 2026 — was £3 × employees)* |
| Self Assessment | sole trader | **£200** one-off |
| Final Accounts & CT600 | limited company | **£500** if monthly revenue < £1,000 · **£750** if £1,000–£10,000 · **£1,000** if > £10,000 · **× number of companies** for a group |
| Director Self Assessment | limited company | **£200 per director** |
| R&D Tax Credits application | limited company | **£300** one-off **+ 5% success fee** on relief secured, invoiced separately once HMRC approves (not in the total) |
| Patent Box application | limited company | **£300** one-off |
| VAT registration assistance | all | **£50** |
| Accounting software setup & training | all | **£100** |
| Bookkeeping clean-up | all | **£2 × transactions × months** (uses the bookkeeping volume when bookkeeping is selected) |

**Output:** a monthly total plus a one-off total, each with a breakdown. **Quote reference:** `RW-YYYYMMDD-HHMMSS`. **Valid for 7 days.**

## 2. Final Accounts & CT600 (monthly)

1. **Base fee:** £150 · £300 if profit ≥ £250k or 6+ employees · £500 if profit ≥ £500k or 20+ employees · £750 if profit ≥ £1m
2. **Monitoring:** annual ×1 · quarterly ×1.3 · monthly ×1.6 (rounded)
3. **Transaction volume:** low (< 100/month) ×1 · medium (100–500) ×1.2 · high (> 500) ×1.5 (rounded)
4. **Payroll:** £4 × headcount, minimum £25 *(changed 22 Nov 2026 — was £40 × headcount)*. The bands count as none = 0, 1–5 = 3, 6–20 = 13, 20+ = 25.
5. **Quarterly VAT returns:** +£60 when monitoring is quarterly or monthly
6. **Add-ons:** management accounts +£100 · director salary planning **+£50, always added** · ongoing R&D relief +£200 · investor reporting +£100

## 3. Making Tax Digital (monthly)

| Tier | Price | Landlord extra for 2 / 3–5 / 5+ properties |
| --- | --- | --- |
| Filing only | £100 | +£25 / +£25 / +£50 |
| + monthly monitoring | £175 | +£40 / +£40 / +£75 |
| + full accounting | £250 | +£50 / +£50 / +£100 |

## 4. Self Assessment (monthly)

1. **Base:** £80 · **£150** if income ≥ £50k, or there's rental income, or monthly monitoring is chosen · **£250** if income ≥ £100k with monthly monitoring · **£400** if income ≥ £250k
2. **Transaction volume:** low (< 50/month) ×1 · medium (50–200) ×1.2 · high (> 200) ×1.5 (rounded)
3. **Monitoring:** monthly → +£75 monthly tax planning; otherwise, if income ≥ £50k → +£50 quarterly tax estimates
4. **MTD compliance:** +£75 if income ≥ £50k

Copy on the page: *"This is an indicative price … Your engagement letter will confirm the exact fee."*

## 5. R&D claim fee

**One-off claim:**

| Annual R&D spend | Claim fee | Patent valuation (if patents/IP) | First-time discount |
| --- | --- | --- | --- |
| < £200k | £950 | — | −£100 |
| £200k–£499k | £1,500 | +£300 | −£200 |
| ≥ £500k | £2,000 | +£500 | −£300 |

**Ongoing retainer:** **£400–£600/month** (a range). With patents: +£100/month, plus £300 one-off Patent Box planning setup.
Because the retainer is a range, it **must use the manual-pricing path** (an acknowledgement, not a quotation).

## 6. Outsource vs hire comparison

**Reckonwell side (monthly):** bookkeeping £2/transaction · **payroll £4/employee, minimum £25** *(was £6/employee)* · HR assistance £5/employee · VAT returns £150 per return ÷ 12 · senior-level analysis +£1,000 · fundraising & investor support +£1,000.
**One-off:** Self Assessment £200/person · Corporation Tax return £500 / £750 / £1,000 by monthly revenue (same bands as §1).

**Hiring side (annual, fully loaded):** cost = gross salary + 15% employer NI above £5,000 + 3% pension.

| Role | Assumption | Annual cost |
| --- | --- | --- |
| Bookkeeper / accounts assistant | £30,000 salary | £34,650 |
| Finance manager (if senior analysis is selected) | £58,000 salary | £67,690 |
| Fractional CFO (if fundraising is selected) | £3,000/month retainer | £36,000 |
| HR retainer (if HR assistance is selected) | £300/month | £3,600 |

Savings = hiring cost − Reckonwell cost, floored at £0. **The gross salaries have no cited source.** Check them against a current salary survey before publishing.

## 7. R&D relief estimator: not ported

Formula on `/r-and-d-tax-relief`: SME 20% of spend; large company 25% × (spend + 130%); Patent Box 15% of IP revenue. This estimates **tax relief**, not a Reckonwell fee, and appears to pre-date the merged R&D scheme for accounting periods beginning on or after 1 April 2024. A qualified adviser should specify the rules before it is rebuilt.

---

## 8. Conflicts to resolve before automated quotations

| # | Topic | Conflict | Suggested question |
| --- | --- | --- | --- |
| 1 | **Final Accounts & CT600** | One-off £500/£750/£1,000 (Instant Quote, comparison) vs **monthly** package from £200 (CT600 calculator) | Are these two products (a standalone year-end vs an ongoing package), or should one replace the other? |
| 2 | ~~**Payroll**~~ ✅ **Resolved 22 Nov 2026** | Was £3 / £6 / £40 per employee | Reckonwell set **£4 per employee per month, minimum £25**, applied in every calculator via `src/lib/pricing/payroll.ts` |
| 3 | **R&D claim** | £300 + 5% success fee (Instant Quote) vs £850–£2,200 one-off (R&D fee calculator, published "From £850") | Is the £300 an application fee on top of a success fee, or out of date? |
| 4 | **Making Tax Digital** | Published "From £34/month" vs calculator minimum £100/month vs "£300/month" in the MTD section copy | What is the starting price? |
| 5 | **Limited company accounting** | Published "From £150/month" vs CT600 calculator minimum £200 (because the £50 salary planning is always added) | Should salary planning be optional? |
| 6 | **Fractional finance** | "From £200/month" vs "All included — £1,000/month flat" vs itemised calculator | Which is the offer? |
| 7 | **Bookkeeping** | "From £150/month" vs £2 per transaction (no minimum) | Is there a monthly minimum? |
| 8 | **Company formation** | "From £299" with no calculator rule | Fixed price, or add to the Instant Quote? |
| 9 | **VAT** | Prices never say whether VAT is included | Are all prices excluding VAT? |

---

## 9. How quotes are sent today (for Stage 6–7)

From `src/app/api/calculator-lead/route.ts` in the original source:
- Every calculator POSTs to `/api/calculator-lead`. The server **does not recalculate**; it trusts the browser's figures.
- Email goes out through the **Brevo** API from `vadim.s@reckonwell.com` to (a) Vadim, "New Quotation Lead — …", and (b) the customer, "Your Reckonwell Quotation — RW-…", with a link to `/book`.
- No PDF is generated, and nothing is stored in a database.

The new build will recalculate prices on the server with these same functions and attach a branded PDF once prices are approved. Otherwise it will send an acknowledgement.
