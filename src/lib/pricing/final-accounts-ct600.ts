import { payrollMonthlyFee } from "./payroll";
import type { LineItem, PricingApproval } from "./types";

/**
 * Final Accounts & CT600 calculator — ported from the original source
 * (reckonwell-main/src/app/final-accounts-ct600-calculator/page.tsx,
 * `calcCT600Price`), live at reckonwell.com/final-accounts-ct600-calculator.
 *
 * NOTE: this conflicts with the one-off Final Accounts price in the Instant
 * Quote (£500 / £750 / £1,000). Reckonwell must confirm which model applies.
 * See docs/pricing-rules.md §8.
 */
export const CT600_APPROVAL: PricingApproval = "recovered-unapproved";

export type EmployeeBand = "0" | "1-5" | "6-20" | "20+";
export type Monitoring = "annual" | "quarterly" | "monthly";
export type TransactionVolume = "low" | "medium" | "high";

export type Ct600Input = {
  annualProfit: number;
  employees: EmployeeBand;
  monitoring: Monitoring;
  transactions: TransactionVolume;
  hasRdSpend: boolean;
  raisingInvestment: boolean;
  managementAccounts: boolean;
};

const EMPLOYEE_COUNT: Record<EmployeeBand, number> = { "0": 0, "1-5": 3, "6-20": 13, "20+": 25 };
const MONITORING_MULTIPLIER: Record<Monitoring, number> = { annual: 1, quarterly: 1.3, monthly: 1.6 };
const VOLUME_MULTIPLIER: Record<TransactionVolume, number> = { low: 1, medium: 1.2, high: 1.5 };

export function calculateCt600Monthly(input: Ct600Input): { monthly: number; breakdown: LineItem[] } {
  const breakdown: LineItem[] = [];
  const headcount = EMPLOYEE_COUNT[input.employees];

  let base = 150;
  if (input.annualProfit >= 1_000_000) base = 750;
  else if (input.annualProfit >= 500_000 || headcount >= 20) base = 500;
  else if (input.annualProfit >= 250_000 || headcount >= 6) base = 300;
  breakdown.push({ label: "Base fee", amount: base });

  const mMult = MONITORING_MULTIPLIER[input.monitoring];
  const afterMonitoring = Math.round(base * mMult);
  if (mMult > 1) {
    const name = input.monitoring.charAt(0).toUpperCase() + input.monitoring.slice(1);
    breakdown.push({ label: `${name} monitoring`, amount: afterMonitoring - base, note: `×${mMult}` });
  }

  const vMult = VOLUME_MULTIPLIER[input.transactions];
  const afterVolume = Math.round(afterMonitoring * vMult);
  if (vMult > 1) {
    breakdown.push({
      label: `Transaction volume (${input.transactions})`,
      amount: afterVolume - afterMonitoring,
      note: `×${vMult}`,
    });
  }

  let total = afterVolume;
  if (headcount > 0) {
    const payroll = payrollMonthlyFee(headcount); // was £40 × headcount in the original
    breakdown.push({ label: `Payroll (${headcount} employees)`, amount: payroll });
    total += payroll;
  }
  if (input.monitoring === "quarterly" || input.monitoring === "monthly") {
    breakdown.push({ label: "Quarterly VAT returns", amount: 60 });
    total += 60;
  }
  if (input.managementAccounts) {
    breakdown.push({ label: "Monthly management accounts", amount: 100 });
    total += 100;
  }
  breakdown.push({ label: "Director salary planning", amount: 50 });
  total += 50;
  if (input.hasRdSpend) {
    breakdown.push({ label: "R&D relief ongoing", amount: 200 });
    total += 200;
  }
  if (input.raisingInvestment) {
    breakdown.push({ label: "Investor reporting", amount: 100 });
    total += 100;
  }
  return { monthly: total, breakdown };
}
