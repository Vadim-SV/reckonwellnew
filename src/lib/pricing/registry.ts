import { z } from "zod";
import { calculateCt600Monthly } from "./final-accounts-ct600";
import { calculateFinanceTeamComparison } from "./finance-team-comparison";
import { INSTANT_QUOTE_RATES, calculateInstantQuote, emptyInstantQuoteInput } from "./instant-quote";
import { calculateMtdMonthly } from "./making-tax-digital";
import { calculateRdClaimFee } from "./rd-claim-fee";
import { calculateSelfAssessmentMonthly } from "./self-assessment";

/**
 * One entry per calculator: an input schema (shared by the browser and the
 * server) and a function that turns inputs into a display-ready Estimate.
 * The enquiry API recalculates with these — it never trusts a price sent
 * from the browser.
 */

export type EstimateLine = {
  label: string;
  /** Number in £, or text for ranges (e.g. "£400–£600"). */
  amount: number | string;
  period: "monthly" | "one-off";
  note?: string;
};

export type Estimate = {
  monthly: number | null;
  oneOff: number | null;
  /** Set when the price is a range — these always go through manual pricing. */
  monthlyRange?: [number, number];
  lines: EstimateLine[];
  notes: string[];
  /** True when a fixed quotation cannot be given (e.g. a price range). */
  manualPricing: boolean;
  /** Optional comparison block (outsource vs hire). */
  comparison?: {
    hiringAnnual: number;
    reckonwellAnnual: number;
    annualSavings: number;
    roles: { name: string; annual: number }[];
  };
};

const int = (max: number, min = 0) => z.number().int().min(min).max(max);
const bool = z.boolean();

const monthlyLines = (items: { label: string; amount: number; note?: string }[]): EstimateLine[] =>
  items.map((i) => ({ ...i, period: "monthly" }));
const oneOffLines = (items: { label: string; amount: number; note?: string }[]): EstimateLine[] =>
  items.map((i) => ({ ...i, period: "one-off" }));
const orNull = (n: number) => (n > 0 ? n : null);

const schemas = {
  bookkeeping: z.object({
    transactionsPerMonth: int(100_000),
    cleanupRequired: bool,
    cleanupMonths: int(120),
    softwareSetupRequired: bool,
  }),
  payroll: z.object({ employees: int(10_000, 1) }),
  "annual-accounts": z.object({
    annualProfit: int(1_000_000_000),
    employees: z.enum(["0", "1-5", "6-20", "20+"]),
    monitoring: z.enum(["annual", "quarterly", "monthly"]),
    transactions: z.enum(["low", "medium", "high"]),
    hasRdSpend: bool,
    raisingInvestment: bool,
    managementAccounts: bool,
  }),
  vat: z.object({ returnsPerYear: int(12, 1), registration: bool }),
  "self-assessment": z.object({
    income: int(100_000_000),
    hasRental: bool,
    monitoring: z.enum(["annual", "monthly"]),
    transactions: z.enum(["low", "medium", "high"]),
  }),
  mtd: z.object({
    incomeType: z.enum(["self-employed", "landlord"]),
    tier: z.enum(["filing-only", "monitoring", "full-accounting"]),
    properties: z.enum(["1", "2", "3-5", "5+"]),
  }),
  "rd-fee": z.object({
    rdSpend: int(1_000_000_000),
    hasPatents: bool,
    firstTime: bool,
    ongoing: bool,
  }),
  "finance-team": z.object({
    businessType: z.enum(["sole-trader", "limited-company"]),
    bookkeeping: bool,
    transactions: int(100_000),
    seniorAnalysis: bool,
    fundraising: bool,
    payroll: bool,
    employees: int(10_000),
    hrAssistance: bool,
    vat: bool,
    vatReturns: int(12),
    selfAssessment: bool,
    selfAssessmentPeople: int(50),
    corpTax: bool,
    monthlyRevenue: int(1_000_000_000),
  }),
  "instant-quote": z.object({
    businessType: z.enum(["sole-trader", "limited-company"]),
    industry: z.string().max(120).optional().default(""),
    isGroup: bool,
    groupCompanyCount: int(100, 1),
    bookkeepingRequired: bool,
    transactionsPerMonth: int(100_000),
    payrollRequired: bool,
    employees: int(10_000),
    cleanupRequired: bool,
    cleanupMonths: int(120),
    cleanupTransactions: int(100_000),
    selfAssessmentRequired: bool,
    finalAccountsRequired: bool,
    monthlyRevenue: int(1_000_000_000),
    directorSaRequired: bool,
    directorSaCount: int(50),
    rdRequired: bool,
    patentBoxRequired: bool,
    vatRegRequired: bool,
    softwareSetupRequired: bool,
  }),
} as const;

export type CalculatorKey = keyof typeof schemas;
export type CalculatorInputs<K extends CalculatorKey> = z.infer<(typeof schemas)[K]>;

const INDICATIVE =
  "This is an indicative estimate based on what you've told us. We'll confirm your fee after a short call.";

const compute: { [K in CalculatorKey]: (i: CalculatorInputs<K>) => Estimate } = {
  bookkeeping(i) {
    const q = calculateInstantQuote({
      ...emptyInstantQuoteInput,
      bookkeepingRequired: true,
      transactionsPerMonth: i.transactionsPerMonth,
      cleanupRequired: i.cleanupRequired,
      cleanupMonths: i.cleanupMonths,
      softwareSetupRequired: i.softwareSetupRequired,
    });
    return {
      monthly: orNull(q.monthlyTotal),
      oneOff: orNull(q.oneoffTotal),
      lines: [...monthlyLines(q.monthlyBreakdown), ...oneOffLines(q.oneoffBreakdown)],
      notes: [INDICATIVE],
      manualPricing: false,
    };
  },
  payroll(i) {
    const q = calculateInstantQuote({ ...emptyInstantQuoteInput, payrollRequired: true, employees: i.employees });
    return {
      monthly: orNull(q.monthlyTotal),
      oneOff: null,
      lines: monthlyLines(q.monthlyBreakdown),
      notes: [INDICATIVE],
      manualPricing: false,
    };
  },
  "annual-accounts"(i) {
    const r = calculateCt600Monthly(i);
    return { monthly: r.monthly, oneOff: null, lines: monthlyLines(r.breakdown), notes: [INDICATIVE], manualPricing: false };
  },
  vat(i) {
    const c = calculateFinanceTeamComparison({
      businessType: "limited-company",
      bookkeeping: false,
      transactions: 0,
      seniorAnalysis: false,
      fundraising: false,
      payroll: false,
      employees: 0,
      hrAssistance: false,
      vat: true,
      vatReturns: i.returnsPerYear,
      selfAssessment: false,
      selfAssessmentPeople: 0,
      corpTax: false,
      monthlyRevenue: 0,
    });
    const monthly = Math.round(c.vat * 100) / 100;
    const lines: EstimateLine[] = [
      { label: `VAT returns (${i.returnsPerYear} a year)`, amount: monthly, period: "monthly", note: "£150 per return" },
    ];
    if (i.registration) {
      lines.push({ label: "VAT registration assistance", amount: INSTANT_QUOTE_RATES.vatRegistration, period: "one-off" });
    }
    return {
      monthly,
      oneOff: i.registration ? INSTANT_QUOTE_RATES.vatRegistration : null,
      lines,
      notes: [INDICATIVE],
      manualPricing: false,
    };
  },
  "self-assessment"(i) {
    const r = calculateSelfAssessmentMonthly(i);
    return { monthly: r.monthly, oneOff: null, lines: monthlyLines(r.breakdown), notes: [INDICATIVE], manualPricing: false };
  },
  mtd(i) {
    const r = calculateMtdMonthly(i.incomeType, i.tier, i.incomeType === "landlord" ? i.properties : "1");
    return { monthly: r.monthly, oneOff: null, lines: monthlyLines(r.breakdown), notes: [INDICATIVE], manualPricing: false };
  },
  "rd-fee"(i) {
    const r = calculateRdClaimFee(i);
    if (r.isMonthly) {
      return {
        monthly: null,
        oneOff: r.setupFee || null,
        monthlyRange: [r.feeMin, r.feeMax],
        lines: r.breakdown.map((b) => ({
          label: b.label,
          amount: b.amount,
          period: typeof b.amount === "number" ? "one-off" : "monthly",
          note: b.note,
        })),
        notes: [
          "The retainer is priced within a range. We'll agree the exact monthly fee once we understand your R&D activity.",
        ],
        manualPricing: true,
      };
    }
    return {
      monthly: null,
      oneOff: r.fee,
      lines: r.breakdown.map((b) => ({ label: b.label, amount: b.amount, period: "one-off", note: b.note })),
      notes: [INDICATIVE],
      manualPricing: false,
    };
  },
  "finance-team"(i) {
    const r = calculateFinanceTeamComparison(i);
    const oneOff: EstimateLine[] = [];
    if (r.selfAssessmentFee) oneOff.push({ label: "Self Assessment", amount: r.selfAssessmentFee, period: "one-off" });
    if (r.corpTaxFee) oneOff.push({ label: "Final accounts & Corporation Tax return", amount: r.corpTaxFee, period: "one-off" });
    return {
      monthly: orNull(Math.round(r.totalMonthly * 100) / 100),
      oneOff: orNull(r.totalOneoff),
      lines: [...monthlyLines(r.monthlyBreakdown), ...oneOff],
      notes: [
        INDICATIVE,
        "Hiring costs assume a £30,000 bookkeeper and a £58,000 finance manager, plus 15% employer National Insurance above £5,000 and 3% pension.",
      ],
      manualPricing: false,
      comparison: {
        hiringAnnual: r.hiringAnnual,
        reckonwellAnnual: Math.round(r.totalMonthly * 12),
        annualSavings: Math.round(r.annualSavings),
        roles: r.roles,
      },
    };
  },
  "instant-quote"(i) {
    const q = calculateInstantQuote(i);
    const notes = [INDICATIVE];
    if (i.businessType === "limited-company" && i.rdRequired) {
      notes.push(
        `R&D claims also carry a ${INSTANT_QUOTE_RATES.rdSuccessFeePercent}% success fee on any relief secured, invoiced separately once HMRC approves the claim.`,
      );
    }
    notes.push(`Quotes are valid for ${INSTANT_QUOTE_RATES.quoteValidityDays} days.`);
    return {
      monthly: orNull(q.monthlyTotal),
      oneOff: orNull(q.oneoffTotal),
      lines: [...monthlyLines(q.monthlyBreakdown), ...oneOffLines(q.oneoffBreakdown)],
      notes,
      manualPricing: false,
    };
  },
};

export const calculatorKeys = Object.keys(schemas) as CalculatorKey[];

export function estimate<K extends CalculatorKey>(key: K, inputs: CalculatorInputs<K>): Estimate {
  return compute[key](inputs);
}

/** Validate untrusted inputs (e.g. from an API request) and estimate. */
export function safeEstimate(key: string, inputs: unknown): { ok: true; estimate: Estimate; inputs: unknown } | { ok: false } {
  if (!(key in schemas)) return { ok: false };
  const k = key as CalculatorKey;
  const parsed = schemas[k].safeParse(inputs);
  if (!parsed.success) return { ok: false };
  return { ok: true, estimate: (compute[k] as (i: unknown) => Estimate)(parsed.data), inputs: parsed.data };
}
