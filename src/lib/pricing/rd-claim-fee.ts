import type { PricingApproval } from "./types";

/**
 * R&D tax relief **fee** calculator (what Reckonwell charges) — ported from
 * the original source (reckonwell-main/src/app/rd-tax-relief-calculator/page.tsx,
 * `calcRDPrice`). Live at reckonwell.com/rd-tax-relief-calculator.
 * £950 − £100 first-time discount = the published "From £850 one-off".
 *
 * The retainer is a price *range* (£400–£600/month), so it cannot be issued
 * as a fixed quotation — it must go through the manual-pricing path.
 *
 * Not to be confused with the R&D *relief* estimator on /r-and-d-tax-relief,
 * which is deliberately not ported (docs/website-audit.md §7.5).
 */
export const RD_CLAIM_FEE_APPROVAL: PricingApproval = "recovered-unapproved";

export type RdClaimFeeInput = {
  /** Annual qualifying R&D spend (£). */
  rdSpend: number;
  hasPatents: boolean;
  firstTime: boolean;
  ongoing: boolean;
};

/** Line items allow a text amount for the retainer range, as on the live site. */
export type RdLineItem = { label: string; amount: number | string; note?: string };

export type RdClaimFeeResult =
  | {
      isMonthly: false;
      isRange: false;
      fee: number;
      breakdown: RdLineItem[];
    }
  | {
      isMonthly: true;
      isRange: true;
      fee: string;
      feeMin: number;
      feeMax: number;
      /** One-off Patent Box planning setup, charged on top of the retainer. */
      setupFee: number;
      breakdown: RdLineItem[];
    };

export function calculateRdClaimFee(input: RdClaimFeeInput): RdClaimFeeResult {
  const { rdSpend, hasPatents, firstTime, ongoing } = input;
  const breakdown: RdLineItem[] = [];

  if (ongoing) {
    const retainerMin = 400;
    const retainerMax = 600;
    breakdown.push({ label: "Monthly retainer (R&D monitoring + claim)", amount: `£${retainerMin}–£${retainerMax}` });
    let totalMin = retainerMin;
    let totalMax = retainerMax;
    let setupFee = 0;
    if (hasPatents) {
      breakdown.push({ label: "Patent Box planning (one-time setup)", amount: 300, note: "then +£100/mo" });
      totalMin += 100;
      totalMax += 100;
      setupFee = 300;
    }
    return {
      isMonthly: true,
      isRange: true,
      fee: `£${totalMin}–£${totalMax}`,
      feeMin: totalMin,
      feeMax: totalMax,
      setupFee,
      breakdown,
    };
  }

  let base: number;
  let patentAdd: number;
  let discount: number;
  if (rdSpend >= 500_000) {
    base = 2000;
    patentAdd = hasPatents ? 500 : 0;
    discount = firstTime ? 300 : 0;
  } else if (rdSpend >= 200_000) {
    base = 1500;
    patentAdd = hasPatents ? 300 : 0;
    discount = firstTime ? 200 : 0;
  } else {
    base = 950;
    patentAdd = 0;
    discount = firstTime ? 100 : 0;
  }

  breakdown.push({ label: "Claim preparation fee", amount: base });
  if (patentAdd > 0) breakdown.push({ label: "Patent valuation", amount: patentAdd });
  if (discount > 0) breakdown.push({ label: "First-time client discount", amount: -discount });

  return { isMonthly: false, isRange: false, fee: base + patentAdd - discount, breakdown };
}
