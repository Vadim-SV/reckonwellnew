import type { LineItem, PricingApproval } from "./types";

/**
 * "Outsource vs hire" calculator — ported from the original source
 * (reckonwell-main/src/app/components/FractionalFinanceCalculator.tsx,
 * `calculateResults`), shown on reckonwell.com/fractional-finance-department.
 *
 * NOTE: payroll here is £6/employee/month, but the Instant Quote uses
 * £3/employee/month. Reckonwell must confirm the correct rate.
 * Salary benchmarks are the original site's assumptions (gross salaries have
 * no cited source). See docs/pricing-rules.md §6 and §8.
 */
export const FINANCE_TEAM_APPROVAL: PricingApproval = "recovered-unapproved";

export type FinanceTeamInput = {
  businessType: "sole-trader" | "limited-company";
  bookkeeping: boolean;
  transactions: number;
  seniorAnalysis: boolean;
  fundraising: boolean;
  payroll: boolean;
  employees: number;
  hrAssistance: boolean;
  vat: boolean;
  vatReturns: number; // per year
  selfAssessment: boolean;
  selfAssessmentPeople: number;
  corpTax: boolean;
  monthlyRevenue: number;
};

/**
 * Fully loaded annual cost of an employee, as derived in the original source:
 * gross salary + 15% employer NI above a £5,000 threshold + 3% pension.
 * e.g. £30,000 + 15% × £25,000 + 3% × £30,000 = £34,650.
 */
export function trueEmploymentCost(grossSalary: number): number {
  return grossSalary + 0.15 * Math.max(0, grossSalary - 5_000) + 0.03 * grossSalary;
}

/** Assumed gross salaries from the original source (no cited source). */
export const ASSUMED_SALARIES = { bookkeeper: 30_000, financeManager: 58_000 } as const;

export const HIRING_BENCHMARKS = {
  bookkeeper: { name: "Bookkeeper / Accounts Assistant", annual: 34_650 },
  financeManager: { name: "Finance Manager", annual: 67_690 },
  fractionalCfo: { name: "Fractional CFO (£3,000/mo retainer)", annual: 36_000 },
  hrRetainer: { name: "HR Retainer Service (£300/mo)", annual: 3_600 },
} as const;

export function calculateFinanceTeamComparison(e: FinanceTeamInput) {
  const bookkeeping = e.bookkeeping && e.transactions > 0 ? 2 * e.transactions : 0;
  const payroll = e.payroll && e.employees > 0 ? 6 * e.employees : 0;
  const hrAssistance = e.payroll && e.hrAssistance && e.employees > 0 ? 5 * e.employees : 0;
  const vat = e.vat && e.vatReturns > 0 ? (150 * e.vatReturns) / 12 : 0;
  const baseMonthly = bookkeeping + payroll + hrAssistance + vat;
  const analysisFee = e.seniorAnalysis ? 1000 : 0;
  const fundraisingFee = e.fundraising ? 1000 : 0;
  const totalMonthly = baseMonthly + analysisFee + fundraisingFee;

  const selfAssessmentFee =
    e.selfAssessment && e.selfAssessmentPeople > 0 ? 200 * e.selfAssessmentPeople : 0;
  let corpTaxFee = 0;
  if (e.businessType === "limited-company" && e.corpTax) {
    corpTaxFee = e.monthlyRevenue > 10_000 ? 1000 : e.monthlyRevenue >= 1_000 ? 750 : 500;
  }

  const roles: { name: string; annual: number }[] = [HIRING_BENCHMARKS.bookkeeper];
  if (e.seniorAnalysis) roles.push(HIRING_BENCHMARKS.financeManager);
  if (e.fundraising) roles.push(HIRING_BENCHMARKS.fractionalCfo);
  if (e.payroll && e.hrAssistance) roles.push(HIRING_BENCHMARKS.hrRetainer);
  const hiringAnnual = roles.reduce((s, r) => s + r.annual, 0);
  const hiringMonthly = hiringAnnual / 12;

  const monthlyBreakdown: LineItem[] = [];
  if (bookkeeping) monthlyBreakdown.push({ label: `Bookkeeping (${e.transactions} transactions)`, amount: bookkeeping });
  if (payroll) monthlyBreakdown.push({ label: `Payroll (${e.employees} employees)`, amount: payroll });
  if (hrAssistance) monthlyBreakdown.push({ label: `HR Assistance (${e.employees} employees)`, amount: hrAssistance });
  if (vat) monthlyBreakdown.push({ label: `VAT Returns (${e.vatReturns} per year)`, amount: vat });
  if (analysisFee) monthlyBreakdown.push({ label: "Senior-level financial analysis & advisory", amount: analysisFee });
  if (fundraisingFee) monthlyBreakdown.push({ label: "Fundraising & investor support", amount: fundraisingFee });

  return {
    bookkeeping,
    payroll,
    hrAssistance,
    vat,
    baseMonthly,
    analysisFee,
    fundraisingFee,
    advisoryFee: analysisFee + fundraisingFee,
    totalMonthly,
    selfAssessmentFee,
    corpTaxFee,
    totalOneoff: selfAssessmentFee + corpTaxFee,
    hiringAnnual,
    hiringMonthly,
    roles,
    monthlySavings: Math.max(0, hiringMonthly - totalMonthly),
    annualSavings: Math.max(0, hiringAnnual - 12 * totalMonthly),
    monthlyBreakdown,
  };
}
