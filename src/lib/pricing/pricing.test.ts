import { describe, expect, it } from "vitest";
import {
  calculateCt600Monthly,
  calculateFinanceTeamComparison,
  calculateInstantQuote,
  calculateMtdMonthly,
  emptyInstantQuoteInput,
  quoteReference,
} from "./index";

describe("Instant Quote (recovered rules)", () => {
  it("returns zero for an empty form", () => {
    const r = calculateInstantQuote(emptyInstantQuoteInput);
    expect(r.monthlyTotal).toBe(0);
    expect(r.oneoffTotal).toBe(0);
  });

  it("prices bookkeeping at £2 per transaction and payroll at £3 per employee", () => {
    const r = calculateInstantQuote({
      ...emptyInstantQuoteInput,
      bookkeepingRequired: true,
      transactionsPerMonth: 100,
      payrollRequired: true,
      employees: 5,
    });
    expect(r.monthlyBreakdown).toEqual([
      { label: "Bookkeeping", amount: 200 },
      { label: "Payroll", amount: 15 },
    ]);
    expect(r.monthlyTotal).toBe(215);
  });

  it("applies revenue bands for Final Accounts and multiplies across a group", () => {
    const base = { ...emptyInstantQuoteInput, businessType: "limited-company" as const, finalAccountsRequired: true };
    expect(calculateInstantQuote({ ...base, monthlyRevenue: 999 }).oneoffTotal).toBe(500);
    expect(calculateInstantQuote({ ...base, monthlyRevenue: 1000 }).oneoffTotal).toBe(750);
    expect(calculateInstantQuote({ ...base, monthlyRevenue: 10000 }).oneoffTotal).toBe(750);
    expect(calculateInstantQuote({ ...base, monthlyRevenue: 10001 }).oneoffTotal).toBe(1000);
    expect(
      calculateInstantQuote({ ...base, monthlyRevenue: 15000, isGroup: true, groupCompanyCount: 3 }).oneoffTotal,
    ).toBe(3000);
  });

  it("only offers sole-trader Self Assessment to sole traders", () => {
    const ltd = calculateInstantQuote({
      ...emptyInstantQuoteInput,
      businessType: "limited-company",
      selfAssessmentRequired: true,
    });
    expect(ltd.oneoffTotal).toBe(0);
  });

  it("prices cleanup from bookkeeping volume when bookkeeping is selected", () => {
    const r = calculateInstantQuote({
      ...emptyInstantQuoteInput,
      bookkeepingRequired: true,
      transactionsPerMonth: 80,
      cleanupRequired: true,
      cleanupMonths: 6,
      cleanupTransactions: 999, // ignored
    });
    expect(r.oneoffBreakdown).toContainEqual({ label: "Bookkeeping Cleanup", amount: 960 });
  });

  it("formats quote references like the live site", () => {
    expect(quoteReference(new Date(2026, 10, 21, 9, 5, 3))).toBe("RW-20261121-090503");
  });
});

describe("Final Accounts & CT600 monthly (recovered rules)", () => {
  it("prices the default journey", () => {
    const r = calculateCt600Monthly({
      annualProfit: 200_000,
      employees: "0",
      monitoring: "annual",
      transactions: "low",
      hasRdSpend: false,
      raisingInvestment: false,
      managementAccounts: false,
    });
    expect(r.monthly).toBe(200); // £150 base + £50 director salary planning
  });

  it("applies multipliers, payroll and add-ons", () => {
    const r = calculateCt600Monthly({
      annualProfit: 300_000,
      employees: "6-20",
      monitoring: "quarterly",
      transactions: "medium",
      hasRdSpend: true,
      raisingInvestment: true,
      managementAccounts: true,
    });
    // base 300 → ×1.3 = 390 → ×1.2 = 468; +520 payroll +60 VAT +100 MA +50 +200 +100
    expect(r.monthly).toBe(1498);
  });
});

describe("MTD (recovered rules)", () => {
  it("prices tiers and landlord property surcharges", () => {
    expect(calculateMtdMonthly("self-employed", "filing-only").monthly).toBe(100);
    expect(calculateMtdMonthly("self-employed", "full-accounting", "5+").monthly).toBe(250);
    expect(calculateMtdMonthly("landlord", "monitoring", "3-5").monthly).toBe(215);
    expect(calculateMtdMonthly("landlord", "full-accounting", "5+").monthly).toBe(350);
  });
});

describe("Outsource vs hire comparison (recovered rules)", () => {
  it("compares against a bookkeeper salary benchmark", () => {
    const r = calculateFinanceTeamComparison({
      businessType: "limited-company",
      bookkeeping: true,
      transactions: 100,
      seniorAnalysis: false,
      fundraising: false,
      payroll: true,
      employees: 5,
      hrAssistance: false,
      vat: true,
      vatReturns: 4,
      selfAssessment: false,
      selfAssessmentPeople: 1,
      corpTax: true,
      monthlyRevenue: 5000,
    });
    expect(r.totalMonthly).toBe(200 + 30 + 50);
    expect(r.corpTaxFee).toBe(750);
    expect(r.hiringAnnual).toBe(34_650);
    expect(r.annualSavings).toBe(34_650 - 12 * 280);
  });
});
