# Pricing conflicts report

**Date:** 22 November 2026 · **Status:** for decision. **No prices have been changed** apart from payroll, which you approved on 22 November.
Detailed rules: [`pricing-rules.md`](./pricing-rules.md) · Code: `src/lib/pricing/`

Every calculator on the new site uses the original rules exactly (verified against the original source). Where two rules disagree, both are still live in their own calculators. The PDF and emails label every figure as an **indicative estimate, not a binding offer**.

| # | Topic | Conflicting prices and their sources | What the new site does now | Pages affected | Recommendation (for your decision) |
| --- | --- | --- | --- | --- | --- |
| 1 | **Final accounts & CT600** | One-off **£500 / £750 / £1,000** by monthly revenue (Instant Quote, comparison calculator) **vs** monthly package from **£200/month** (CT600 calculator) | Instant Quote shows the one-off fee; the Annual accounts page shows the monthly package | `/instant-quote`, `/annual-accounts-ct600` | Treat them as two products: **"Year-end only" (one-off)** and **"Year-end + monitoring" (monthly)**. Name them differently on both pages. |
| 2 | **Payroll** | £3 / £6 / £40 per employee | ✅ **Resolved:** £4 per employee per month, £25 minimum, everywhere | All payroll pricing | Done. |
| 3 | **R&D claim** | **£300** + 5% success fee (Instant Quote) **vs** **£950–£2,500** claim fee, "From £850" with the first-time discount (R&D calculator) | Both shown on their own pages | `/instant-quote`, `/r-and-d-tax-relief` | Remove R&D from the Instant Quote and link to the dedicated R&D calculator, or confirm that the £300 is an application fee on top of the claim fee. |
| 4 | **Making Tax Digital** | Published **"From £34/month"** (old services page) **vs** calculator from **£100/month** **vs** "£300/month" (old MTD section copy) | Calculator only (from £100). The £34 and £300 figures are **not** shown anywhere on the new site | `/making-tax-digital` (and a future Pricing page) | Confirm the starting price (£100 matches the calculator). |
| 5 | **Limited company accounting** | Published **"From £150/month"** **vs** CT600 calculator minimum **£200** (the £50 director salary planning is always added) | Calculator only. "From £150" isn't shown | `/annual-accounts-ct600` | Make salary planning optional, or publish "from £200". |
| 6 | **Outsourced finance team** | **"From £200/month"** and **"All included — £1,000/month flat"** (old pages) **vs** itemised comparison calculator | Itemised calculator only, labelled indicative | `/`, `/outsourced-financial-operations` | Decide whether there's a headline package price. If so, add it to the pricing config so every page uses it. |
| 7 | **Bookkeeping** | **"From £150/month"** **vs** **£2 per transaction** with no minimum | Calculator only (e.g. 40 transactions = £80) | `/bookkeeping-services`, `/instant-quote` | Add a monthly minimum to the rule (for example £150) or drop the "from" price. |
| 8 | **Company formation** | **"From £299"** with no calculator rule | Not offered on the new site; the startup page uses a tailored quote | `/startups` | Add a fixed formation fee to the Founder's Launch Offer if you want to publish one. |
| 9 | **VAT on fees** | No page says whether prices include VAT | PDFs and emails say "VAT treatment will be confirmed in your engagement letter" | All priced pages and PDFs | State "All prices exclude VAT" (if Reckonwell is VAT-registered) and add it to the calculators. |
| 10 | **VAT returns** *(new finding)* | **£150 per return** (comparison calculator, used by the VAT page: £50/month for quarterly) **vs** **£60/month** for quarterly VAT inside the CT600 package | Both live in their own calculators | `/vat-returns`, `/annual-accounts-ct600` | Pick one quarterly VAT price, or say the package includes a discount. |

## What happens once you decide
Each decision is a small change in one place: the rules live in `src/lib/pricing/`, and every page, the Instant Quote, the emails and the PDFs use those same functions. Tests will be updated so the new prices are locked in.
Once prices are approved, the PDF title can change from "Indicative estimate" to "Quotation" (one setting in `src/lib/pdf/estimate-pdf.ts`).
