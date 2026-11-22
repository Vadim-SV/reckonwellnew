import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { safeEstimate } from "@/lib/pricing/registry";
import { safeScope } from "@/lib/scoping/registry";
import { buildEnquiryPdf, pdfSafe } from "./estimate-pdf";

const hasPdftotext = (() => {
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

function textOf(bytes: Uint8Array): string {
  const dir = mkdtempSync(join(tmpdir(), "rwpdf-"));
  const file = join(dir, "x.pdf");
  writeFileSync(file, bytes);
  return execFileSync("pdftotext", ["-layout", file, "-"]).toString();
}

const customer = { name: "Jane Smith", email: "jane@example.com", company: "Acme Ltd" };

describe("enquiry PDF", () => {
  it("sanitises characters the standard font can't encode", () => {
    expect(pdfSafe("−£40 → ✓")).toBe("-£40 -> ");
  });

  it("builds an indicative estimate from the server-side pricing engine", async () => {
    const r = safeEstimate("instant-quote", {
      businessType: "limited-company", industry: "Manufacturing", isGroup: false, groupCompanyCount: 1,
      bookkeepingRequired: true, transactionsPerMonth: 150, payrollRequired: true, employees: 10,
      cleanupRequired: false, cleanupMonths: 0, cleanupTransactions: 0, selfAssessmentRequired: false,
      finalAccountsRequired: true, monthlyRevenue: 25000, directorSaRequired: false, directorSaCount: 0,
      rdRequired: true, patentBoxRequired: false, vatRegRequired: false, softwareSetupRequired: false,
    });
    if (!r.ok) throw new Error("estimate failed");
    const bytes = await buildEnquiryPdf({
      reference: "RW-261122-ABC123", issuedAt: new Date("2026-11-22T10:00:00Z"), serviceLabel: "Instant quote",
      customer, estimate: r.estimate, inputs: r.inputs as Record<string, unknown>, validDays: 7,
    });
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
    if (!hasPdftotext) return;
    const t = textOf(bytes);
    for (const s of ["Indicative estimate", "RW-261122-ABC123", "Jane Smith, Acme Ltd", "£340", "£1,300", "29 November 2026", "not a binding offer", "VAT treatment", "/book"])
      expect(t, s).toContain(s);
  });

  it("produces a priceless enquiry summary for requirements tools", async () => {
    const r = safeScope("group-companies", {
      companies: 4, transactionsPerMonth: "200-500", software: "mixed", intercompany: "regular", reporting: "overview", team: "finance-manager",
    });
    if (!r.ok) throw new Error("scope failed");
    const bytes = await buildEnquiryPdf({ reference: "RW-261122-XYZ789", issuedAt: new Date(), serviceLabel: "Group companies", customer, scope: r.summary });
    if (!hasPdftotext) return;
    const t = textOf(bytes);
    expect(t).toContain("Enquiry summary");
    expect(t).toContain("It is not a quotation");
    expect(t).not.toMatch(/£\d/);
  });

  it("does not price manual-pricing services", async () => {
    const r = safeEstimate("rd-fee", { rdSpend: 0, hasPatents: false, firstTime: false, ongoing: true });
    if (!r.ok) throw new Error("estimate failed");
    const bytes = await buildEnquiryPdf({ reference: "RW-1", issuedAt: new Date(), serviceLabel: "R&D tax relief", customer, estimate: r.estimate });
    if (!hasPdftotext) return;
    const t = textOf(bytes);
    expect(t).toContain("Enquiry summary");
    expect(t).toContain("priced individually");
    expect(t).not.toContain("£400");
  });
});
