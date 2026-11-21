import type { LineItem, PricingApproval } from "./types";

/**
 * Self Assessment calculator — ported from the original source
 * (reckonwell-main/src/app/self-assessment-calculator/page.tsx, `calcPrice`).
 * Live at reckonwell.com/self-assessment-calculator. Explains the published
 * "From £80/month" for self-employed accounting.
 */
export const SELF_ASSESSMENT_APPROVAL: PricingApproval = "recovered-unapproved";

export type SaMonitoring = "annual" | "monthly";
export type SaTransactionVolume = "low" | "medium" | "high";

export type SelfAssessmentInput = {
  /** Annual income (£). */
  income: number;
  hasRental: boolean;
  monitoring: SaMonitoring;
  /** low < 50/month · medium 50–200 · high > 200 */
  transactions: SaTransactionVolume;
};

const VOLUME_MULTIPLIER: Record<SaTransactionVolume, number> = { low: 1, medium: 1.2, high: 1.5 };

export function calculateSelfAssessmentMonthly(input: SelfAssessmentInput): {
  monthly: number;
  breakdown: LineItem[];
} {
  const { income, hasRental, monitoring, transactions } = input;
  const breakdown: LineItem[] = [];

  let base = 80;
  if (income >= 250_000) base = 400;
  else if (income >= 100_000 && monitoring === "monthly") base = 250;
  else if (income >= 50_000 || hasRental || monitoring === "monthly") base = 150;
  breakdown.push({ label: "Base fee", amount: base });

  const mult = VOLUME_MULTIPLIER[transactions];
  const afterMult = Math.round(base * mult);
  if (mult > 1) {
    breakdown.push({ label: `Transaction volume (${transactions})`, amount: afterMult - base, note: `×${mult}` });
  }

  let total = afterMult;
  if (monitoring === "monthly") {
    breakdown.push({ label: "Monthly tax planning", amount: 75 });
    total += 75;
  } else if (income >= 50_000) {
    breakdown.push({ label: "Quarterly tax estimates", amount: 50 });
    total += 50;
  }
  if (income >= 50_000) {
    breakdown.push({ label: "MTD compliance (income >£50k)", amount: 75 });
    total += 75;
  }
  return { monthly: total, breakdown };
}
