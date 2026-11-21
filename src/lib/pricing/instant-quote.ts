import type { LineItem, PricingApproval } from "./types";

/**
 * Instant Quote — ported from the original source
 * (reckonwell-main/src/app/quotation-calculator/page.tsx, `calculateQuote`),
 * live at reckonwell.com/quotation-calculator. Verified identical to the
 * original by randomised parity testing. Do not change these numbers without
 * approval. See docs/pricing-rules.md §1.
 */
export const INSTANT_QUOTE_APPROVAL: PricingApproval = "recovered-unapproved";

export const INSTANT_QUOTE_RATES = {
  bookkeepingPerTransaction: 2, // £/month per monthly transaction
  payrollPerEmployee: 3, // £/month per employee
  selfAssessment: 200, // one-off, sole traders
  finalAccounts: { under1k: 500, from1kTo10k: 750, over10k: 1000 }, // one-off, by monthly revenue, per company
  directorSelfAssessment: 200, // one-off, per director
  rdClaim: 300,
  /** Shown beside the R&D option: invoiced separately once HMRC approves the claim. Not added to the total. */
  rdSuccessFeePercent: 5,
  patentBox: 300,
  vatRegistration: 50,
  softwareSetup: 100,
  cleanupPerTransactionMonth: 2,
  quoteValidityDays: 7,
} as const;

export type BusinessType = "sole-trader" | "limited-company";

export type InstantQuoteInput = {
  businessType: BusinessType;
  isGroup: boolean;
  groupCompanyCount: number;
  bookkeepingRequired: boolean;
  transactionsPerMonth: number;
  payrollRequired: boolean;
  employees: number;
  cleanupRequired: boolean;
  cleanupMonths: number;
  /** Only used when bookkeeping is not required. */
  cleanupTransactions: number;
  selfAssessmentRequired: boolean;
  finalAccountsRequired: boolean;
  monthlyRevenue: number;
  directorSaRequired: boolean;
  directorSaCount: number;
  rdRequired: boolean;
  patentBoxRequired: boolean;
  vatRegRequired: boolean;
  softwareSetupRequired: boolean;
};

export type InstantQuoteResult = {
  monthlyTotal: number;
  oneoffTotal: number;
  monthlyBreakdown: LineItem[];
  oneoffBreakdown: LineItem[];
};

/** Industries offered in the live quote form (Question 1a). */
export const QUOTE_INDUSTRIES = [
  "Landlord / Property",
  "Restaurant / Hospitality",
  "Retail / E-commerce",
  "Construction / Trades",
  "Professional Services",
  "SaaS / Technology",
  "Manufacturing",
  "Healthcare / Wellness",
  "Creative / Media",
  "Charity / Non-Profit / Religious Organisation",
  "Food & Beverage (production)",
  "Transport / Logistics",
  "Beauty / Personal Care",
  "Education / Training",
  "Other",
] as const;

export const emptyInstantQuoteInput: InstantQuoteInput = {
  businessType: "sole-trader",
  isGroup: false,
  groupCompanyCount: 2,
  bookkeepingRequired: false,
  transactionsPerMonth: 0,
  payrollRequired: false,
  employees: 0,
  cleanupRequired: false,
  cleanupMonths: 0,
  cleanupTransactions: 0,
  selfAssessmentRequired: false,
  finalAccountsRequired: false,
  monthlyRevenue: 0,
  directorSaRequired: false,
  directorSaCount: 0,
  rdRequired: false,
  patentBoxRequired: false,
  vatRegRequired: false,
  softwareSetupRequired: false,
};

export function calculateInstantQuote(input: InstantQuoteInput): InstantQuoteResult {
  const r = INSTANT_QUOTE_RATES;
  const monthly: LineItem[] = [];
  const oneoff: LineItem[] = [];

  const bookkeeping = input.bookkeepingRequired
    ? r.bookkeepingPerTransaction * input.transactionsPerMonth
    : 0;
  if (bookkeeping > 0) monthly.push({ label: "Bookkeeping", amount: bookkeeping });

  const payroll = input.payrollRequired ? r.payrollPerEmployee * input.employees : 0;
  if (payroll > 0) monthly.push({ label: "Payroll", amount: payroll });

  if (input.businessType === "sole-trader" && input.selfAssessmentRequired) {
    oneoff.push({ label: "Self Assessment", amount: r.selfAssessment });
  }

  if (input.businessType === "limited-company") {
    if (input.finalAccountsRequired) {
      const perCompany =
        input.monthlyRevenue > 10_000
          ? r.finalAccounts.over10k
          : input.monthlyRevenue >= 1_000
            ? r.finalAccounts.from1kTo10k
            : r.finalAccounts.under1k;
      const companies = input.isGroup ? Math.max(1, input.groupCompanyCount) : 1;
      oneoff.push({ label: "Final Accounts & CT600", amount: perCompany * companies });
    }
    if (input.directorSaRequired) {
      const amount = r.directorSelfAssessment * input.directorSaCount;
      if (amount > 0) oneoff.push({ label: "Director Self Assessment", amount });
    }
    if (input.rdRequired) oneoff.push({ label: "R&D Tax Credits Application", amount: r.rdClaim });
    if (input.patentBoxRequired) oneoff.push({ label: "Patent Box Application", amount: r.patentBox });
  }

  if (input.vatRegRequired) {
    oneoff.push({ label: "VAT Registration Assistance", amount: r.vatRegistration });
  }
  if (input.softwareSetupRequired) {
    oneoff.push({ label: "Accounting Software Setup & Training", amount: r.softwareSetup });
  }
  if (input.cleanupRequired) {
    const tx = input.bookkeepingRequired ? input.transactionsPerMonth : input.cleanupTransactions;
    const amount = tx * input.cleanupMonths * r.cleanupPerTransactionMonth;
    if (amount > 0) oneoff.push({ label: "Bookkeeping Cleanup", amount });
  }

  return {
    monthlyTotal: bookkeeping + payroll,
    oneoffTotal: oneoff.reduce((sum, item) => sum + item.amount, 0),
    monthlyBreakdown: monthly,
    oneoffBreakdown: oneoff,
  };
}

/** Quote reference in the live format: RW-YYYYMMDD-HHMMSS. */
export function quoteReference(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `RW-${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(
    date.getHours(),
  )}${p(date.getMinutes())}${p(date.getSeconds())}`;
}
