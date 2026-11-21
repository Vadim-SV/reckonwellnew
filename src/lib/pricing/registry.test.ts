import { describe, expect, it } from "vitest";
import { safeEstimate } from "./registry";

describe("pricing registry", () => {
  it("recalculates bookkeeping from inputs", () => {
    const r = safeEstimate("bookkeeping", {
      transactionsPerMonth: 120,
      cleanupRequired: true,
      cleanupMonths: 3,
      softwareSetupRequired: true,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.estimate.monthly).toBe(240);
      expect(r.estimate.oneOff).toBe(720 + 100);
    }
  });

  it("prices VAT at £150 a return plus optional registration", () => {
    const r = safeEstimate("vat", { returnsPerYear: 4, registration: true });
    expect(r.ok && [r.estimate.monthly, r.estimate.oneOff]).toEqual([50, 50]);
  });

  it("routes the R&D retainer to manual pricing", () => {
    const r = safeEstimate("rd-fee", { rdSpend: 0, hasPatents: false, firstTime: false, ongoing: true });
    expect(r.ok && r.estimate.manualPricing).toBe(true);
    expect(r.ok && r.estimate.monthlyRange).toEqual([400, 600]);
  });

  it("rejects unknown calculators, wrong types and out-of-range values", () => {
    expect(safeEstimate("nope", {}).ok).toBe(false);
    expect(safeEstimate("payroll", { employees: "5" }).ok).toBe(false);
    expect(safeEstimate("payroll", { employees: -1 }).ok).toBe(false);
    expect(safeEstimate("vat", { returnsPerYear: 4, registration: "false" }).ok).toBe(false);
  });
});
