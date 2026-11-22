import { describe, expect, it } from "vitest";
import { safeScope, scopingKeys } from "./registry";

describe("scoping tools", () => {
  it("summarises accounts payable answers without any price", () => {
    const r = safeScope("accounts-payable", {
      invoicesPerMonth: "50-200",
      arrival: "email",
      paymentRuns: "weekly",
      approval: "manager",
      statementReconciliations: true,
      software: "xero",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.summary.focus).toContain("Monthly supplier statement reconciliations");
    expect(r.summary.focus).toContain("Work directly in your Xero");
    expect(JSON.stringify(r.summary)).not.toMatch(/£\d/);
  });

  it("describes a group of companies", () => {
    const r = safeScope("group-companies", {
      companies: 4,
      transactionsPerMonth: "200-500",
      software: "mixed",
      intercompany: "regular",
      reporting: "overview",
      team: "finance-manager",
    });
    expect(r.ok && r.summary.headline).toBe("4 companies, 200–500 transactions a month");
    expect(r.ok && r.summary.focus).toContain("Intercompany balances reconciled every month");
  });

  it("rejects unknown keys, bad values and oversized lists", () => {
    expect(safeScope("nope", {}).ok).toBe(false);
    expect(safeScope("group-companies", { companies: 1 }).ok).toBe(false);
    expect(
      safeScope("startup-launch", { stage: "just-incorporated", structure: "limited-company", needs: ["hack"], transactionsPerMonth: "under-50" }).ok,
    ).toBe(false);
  });

  it("never outputs a monetary amount", () => {
    expect(scopingKeys.length).toBe(7);
    const r = safeScope("startup-launch", {
      stage: "just-incorporated",
      structure: "unsure",
      needs: ["software", "bank", "vat"],
      transactionsPerMonth: "under-50",
    });
    expect(r.ok && JSON.stringify(r.summary)).not.toMatch(/£\d/);
  });
});
