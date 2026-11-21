import type { LineItem, PricingApproval } from "./types";

/**
 * MTD calculator — ported from the original source
 * (reckonwell-main/src/app/mtd-calculator/page.tsx, `calcMTDPrice`),
 * live at reckonwell.com/mtd-calculator.
 */
export const MTD_APPROVAL: PricingApproval = "recovered-unapproved";

export type MtdIncomeType = "self-employed" | "landlord";
export type MtdTier = "filing-only" | "monitoring" | "full-accounting";
export type PropertyBand = "1" | "2" | "3-5" | "5+";

export const MTD_TIERS: Record<MtdTier, { label: string; description: string; monthly: number }> = {
  "filing-only": {
    label: "MTD filing only",
    description: "Quarterly submissions to HMRC. Nothing more, nothing less.",
    monthly: 100,
  },
  monitoring: {
    label: "MTD + monthly monitoring",
    description: "Quarterly filings plus a monthly review of your income and tax position.",
    monthly: 175,
  },
  "full-accounting": {
    label: "MTD + full accounting",
    description: "Everything above, plus year-end accounts and full tax planning.",
    monthly: 250,
  },
};

const PROPERTY_SURCHARGE: Record<MtdTier, Record<PropertyBand, number>> = {
  "filing-only": { "1": 0, "2": 25, "3-5": 25, "5+": 50 },
  monitoring: { "1": 0, "2": 40, "3-5": 40, "5+": 75 },
  "full-accounting": { "1": 0, "2": 50, "3-5": 50, "5+": 100 },
};

export function calculateMtdMonthly(
  incomeType: MtdIncomeType,
  tier: MtdTier,
  properties: PropertyBand = "1",
): { monthly: number; breakdown: LineItem[] } {
  const t = MTD_TIERS[tier];
  const breakdown: LineItem[] = [{ label: t.label, amount: t.monthly }];
  let monthly = t.monthly;
  if (incomeType === "landlord") {
    const extra = PROPERTY_SURCHARGE[tier][properties] ?? 0;
    if (extra > 0) {
      breakdown.push({ label: `Additional properties (${properties})`, amount: extra });
      monthly += extra;
    }
  }
  return { monthly, breakdown };
}
