import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Estimate } from "@/lib/pricing/registry";
import type { ScopeSummary } from "@/lib/scoping/registry";
import { site } from "@/lib/site";
import { LOGO_SIZE, LOGO_WHITE_PNG_BASE64 } from "./logo";

/**
 * Branded PDF for an enquiry.
 *
 *  - Calculator enquiries → "Indicative estimate" (prices from the server-side
 *    pricing engine, clearly labelled as not a binding offer).
 *  - Requirements tools and manual pricing → "Enquiry summary" (no prices).
 *
 * Uses the standard Helvetica fonts (WinAnsi), so text is sanitised first.
 */

export type PdfInput = {
  reference: string;
  issuedAt: Date;
  serviceLabel: string;
  customer: { name: string; email: string; company?: string };
  estimate?: Estimate;
  scope?: ScopeSummary;
  /** Calculator / tool answers, shown as scope assumptions. */
  inputs?: Record<string, unknown>;
  /** Days the estimate stays valid (Instant Quote: 7). */
  validDays?: number;
};

const NAVY = rgb(18 / 255, 35 / 255, 63 / 255);
const STEEL = rgb(39 / 255, 94 / 255, 134 / 255);
const INK = rgb(0.1, 0.1, 0.1);
const MUTED = rgb(102 / 255, 96 / 255, 92 / 255);
const SAND = rgb(246 / 255, 233 / 255, 216 / 255);
const LINE = rgb(0.86, 0.84, 0.8);

const A4 = { w: 595.28, h: 841.89 };
const M = 48; // margin

const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

/** Map characters Helvetica/WinAnsi can't encode to safe equivalents. */
export function pdfSafe(text: string): string {
  return text
    .replace(/[−‐‑]/g, "-")
    .replace(/→/g, "->")
    .replace(/[✓✔]/g, "")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7e -ÿ–—‘’“”•…€]/g, "");
}

/** Plain-English labels for calculator answers. Unlisted keys fall back to a humanised name. */
const INPUT_LABELS: Record<string, string> = {
  businessType: "Business type",
  industry: "Industry",
  isGroup: "Group of companies",
  groupCompanyCount: "Companies in the group",
  bookkeepingRequired: "Bookkeeping",
  transactionsPerMonth: "Transactions a month",
  payrollRequired: "Payroll",
  employees: "Employees",
  cleanupRequired: "Catch-up bookkeeping",
  cleanupMonths: "Months to catch up",
  cleanupTransactions: "Catch-up transactions a month",
  selfAssessmentRequired: "Self Assessment",
  finalAccountsRequired: "Final accounts & CT600",
  monthlyRevenue: "Average monthly revenue",
  directorSaRequired: "Director Self Assessment",
  directorSaCount: "Directors",
  rdRequired: "R&D tax credits application",
  patentBoxRequired: "Patent Box application",
  vatRegRequired: "VAT registration assistance",
  softwareSetupRequired: "Software setup & training",
  annualProfit: "Annual profit",
  monitoring: "Monitoring",
  transactions: "Transaction volume",
  hasRdSpend: "R&D spend",
  raisingInvestment: "Raising investment",
  managementAccounts: "Management accounts",
  returnsPerYear: "VAT returns a year",
  registration: "VAT registration help",
  income: "Annual income",
  hasRental: "Rental income",
  incomeType: "Income type",
  tier: "Level of support",
  properties: "Properties",
  rdSpend: "Annual R&D spend",
  hasPatents: "Patents or IP revenue",
  firstTime: "First claim",
  ongoing: "Monthly retainer",
  bookkeeping: "Bookkeeping",
  seniorAnalysis: "Senior financial analysis",
  fundraising: "Fundraising support",
  payroll: "Payroll",
  hrAssistance: "HR assistance",
  vat: "VAT returns",
  vatReturns: "VAT returns a year",
  selfAssessment: "Self Assessment",
  selfAssessmentPeople: "People needing Self Assessment",
  corpTax: "Corporation Tax return",
};
const MONEY_KEYS = new Set(["monthlyRevenue", "annualProfit", "income", "rdSpend"]);
const VALUE_LABELS: Record<string, string> = {
  "limited-company": "Limited company",
  "sole-trader": "Sole trader",
  "self-employed": "Self-employed",
  landlord: "Landlord",
  "filing-only": "Filing only",
  monitoring: "With monthly monitoring",
  "full-accounting": "With full accounting",
  annual: "Annual",
  quarterly: "Quarterly",
  monthly: "Monthly",
  low: "Low",
  medium: "Medium",
  high: "High",
};

/** Answers worth showing: skips "No", zero and empty values, and the group size when not a group. */
function relevantInputs(inputs: Record<string, unknown>): [string, string][] {
  const out: [string, string][] = [];
  for (const [k, v] of Object.entries(inputs)) {
    if (v === false || v === "" || v === 0 || v === undefined || v === null) continue;
    if (k === "groupCompanyCount" && inputs.isGroup !== true) continue;
    const label = INPUT_LABELS[k] ?? humanise(k);
    const value =
      typeof v === "number" && MONEY_KEYS.has(k)
        ? gbp(v)
        : typeof v === "number"
          ? v.toLocaleString("en-GB")
          : typeof v === "string"
            ? (VALUE_LABELS[v] ?? v)
            : show(v);
    out.push([label, value]);
  }
  return out;
}

const humanise = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const show = (v: unknown): string =>
  typeof v === "boolean" ? (v ? "Yes" : "No") : Array.isArray(v) ? (v.length ? v.join(", ") : "None") : String(v ?? "");

class Writer {
  page!: PDFPage;
  y = 0;
  constructor(
    private doc: PDFDocument,
    public font: PDFFont,
    public bold: PDFFont,
  ) {
    this.newPage();
  }
  newPage() {
    this.page = this.doc.addPage([A4.w, A4.h]);
    this.y = A4.h - M;
  }
  ensure(space: number) {
    if (this.y - space < M + 40) {
      this.newPage();
      this.y -= 10;
    }
  }
  wrap(text: string, size: number, width: number, font = this.font): string[] {
    const words = pdfSafe(text).split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > width && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  text(text: string, opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; x?: number; width?: number; gap?: number } = {}) {
    const size = opts.size ?? 10;
    const lh = size * 1.4;
    for (const l of this.wrap(text, size, opts.width ?? A4.w - 2 * M - (opts.x ?? 0), opts.font)) {
      this.ensure(lh);
      this.page.drawText(l, { x: M + (opts.x ?? 0), y: this.y - size, size, font: opts.font ?? this.font, color: opts.color ?? INK });
      this.y -= lh;
    }
    this.y -= opts.gap ?? 0;
  }
  heading(text: string) {
    this.ensure(40);
    this.y -= 10;
    this.page.drawText(pdfSafe(text.toUpperCase()), { x: M, y: this.y - 8, size: 8, font: this.bold, color: MUTED });
    this.y -= 18;
  }
  rule() {
    this.page.drawLine({ start: { x: M, y: this.y }, end: { x: A4.w - M, y: this.y }, thickness: 0.6, color: LINE });
  }
  row(cells: { text: string; x: number; align?: "left" | "right"; width?: number; font?: PDFFont; color?: ReturnType<typeof rgb> }[], size = 10) {
    const heights = cells.map((c) => this.wrap(c.text, size, c.width ?? 200, c.font).length);
    const lines = Math.max(...heights);
    const h = lines * size * 1.4 + 10;
    this.ensure(h);
    for (const c of cells) {
      const font = c.font ?? this.font;
      this.wrap(c.text, size, c.width ?? 200, font).forEach((l, i) => {
        const w = font.widthOfTextAtSize(l, size);
        const x = c.align === "right" ? M + c.x - w : M + c.x;
        this.page.drawText(l, { x, y: this.y - 6 - size - i * size * 1.4, size, font, color: c.color ?? INK });
      });
    }
    this.y -= h;
    this.rule();
  }
}

export async function buildEnquiryPdf(input: PdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const priced = Boolean(input.estimate && !input.estimate.manualPricing);
  const title = priced ? "Indicative estimate" : "Enquiry summary";
  doc.setTitle(`${title} ${input.reference} — Reckonwell`);
  doc.setAuthor("Reckonwell Ltd");
  doc.setSubject(input.serviceLabel);
  doc.setCreationDate(input.issuedAt);

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const logo = await doc.embedPng(Buffer.from(LOGO_WHITE_PNG_BASE64, "base64"));
  const w = new Writer(doc, font, bold);

  // Header band
  const bandH = 92;
  w.page.drawRectangle({ x: 0, y: A4.h - bandH, width: A4.w, height: bandH, color: NAVY });
  const logoW = 150;
  w.page.drawImage(logo, { x: M, y: A4.h - bandH / 2 - (logoW * LOGO_SIZE.height) / LOGO_SIZE.width / 2, width: logoW, height: (logoW * LOGO_SIZE.height) / LOGO_SIZE.width });
  const tw = bold.widthOfTextAtSize(title, 16);
  w.page.drawText(title, { x: A4.w - M - tw, y: A4.h - bandH / 2 + 2, size: 16, font: bold, color: rgb(1, 0.945, 0.878) });
  const refW = font.widthOfTextAtSize(input.reference, 10);
  w.page.drawText(input.reference, { x: A4.w - M - refW, y: A4.h - bandH / 2 - 16, size: 10, font, color: rgb(0.8, 0.82, 0.86) });
  w.y = A4.h - bandH - 28;

  // Details
  const dateFmt = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" }).format(d);
  const details: [string, string][] = [
    ["Prepared for", [input.customer.name, input.customer.company].filter(Boolean).join(", ")],
    ["Email", input.customer.email],
    ["Service", input.serviceLabel],
    ["Date", dateFmt(input.issuedAt)],
  ];
  if (priced && input.validDays) details.push(["Valid until", dateFmt(new Date(input.issuedAt.getTime() + input.validDays * 86_400_000))]);
  for (const [k, v] of details) {
    w.ensure(16);
    w.page.drawText(pdfSafe(k), { x: M, y: w.y - 10, size: 9, font: bold, color: MUTED });
    w.page.drawText(pdfSafe(v), { x: M + 90, y: w.y - 10, size: 10, font, color: INK });
    w.y -= 17;
  }

  // Prices
  if (input.estimate && priced) {
    const e = input.estimate;
    w.heading("Your indicative estimate");
    w.rule();
    w.row(
      [
        { text: "Description", x: 0, width: 300, font: bold, color: MUTED },
        { text: "Basis", x: 330, width: 80, font: bold, color: MUTED },
        { text: "Amount", x: A4.w - 2 * M, align: "right", width: 90, font: bold, color: MUTED },
      ],
      9,
    );
    for (const l of e.lines) {
      const amount = typeof l.amount === "number" ? (l.amount < 0 ? `-${gbp(-l.amount)}` : gbp(l.amount)) : String(l.amount);
      w.row([
        { text: l.note ? `${l.label} (${l.note})` : l.label, x: 0, width: 310 },
        { text: l.period === "monthly" ? "Monthly" : "One-off", x: 330, width: 80, color: MUTED },
        { text: amount, x: A4.w - 2 * M, align: "right", width: 90 },
      ]);
    }
    // Totals box
    const totals: [string, string][] = [];
    if (e.monthly) totals.push(["Monthly total", gbp(e.monthly)]);
    if (e.oneOff) totals.push(["One-off total", gbp(e.oneOff)]);
    const boxH = 18 + totals.length * 20;
    w.ensure(boxH + 10);
    w.y -= 8;
    w.page.drawRectangle({ x: M, y: w.y - boxH, width: A4.w - 2 * M, height: boxH, color: SAND });
    totals.forEach(([k, v], i) => {
      const yy = w.y - 22 - i * 20;
      w.page.drawText(k, { x: M + 14, y: yy, size: 11, font: bold, color: NAVY });
      const vw = bold.widthOfTextAtSize(v, 13);
      w.page.drawText(v, { x: A4.w - M - 14 - vw, y: yy, size: 13, font: bold, color: NAVY });
    });
    w.y -= boxH + 8;
    for (const n of e.notes) w.text(n, { size: 9, color: MUTED, gap: 2 });
    if (e.comparison) {
      w.heading("Compared with hiring");
      w.text(
        `Employing people for this work: about ${gbp(e.comparison.hiringAnnual)} a year. Reckonwell: about ${gbp(e.comparison.reckonwellAnnual)} a year.`,
        { size: 10 },
      );
    }
  }

  // Requirements summary (no prices)
  if (input.scope) {
    w.heading("What you told us");
    w.text(input.scope.headline, { size: 13, font: bold, color: NAVY, gap: 4 });
    for (const it of input.scope.items) {
      w.row([
        { text: it.label, x: 0, width: 200, color: MUTED },
        { text: it.value, x: 210, width: A4.w - 2 * M - 210 },
      ]);
    }
    w.heading("What we'd look after");
    for (const f of input.scope.focus) w.text(`•  ${f}`, { size: 10, gap: 1 });
    w.heading("Pricing");
    w.text(input.scope.pricingNote, { size: 10 });
  }
  if (input.estimate?.manualPricing) {
    w.heading("Pricing");
    w.text("This service is priced individually. We'll confirm a fee after a short call, once we understand what's involved.", { size: 10 });
    for (const n of input.estimate.notes) w.text(n, { size: 9, color: MUTED });
  }

  // Assumptions
  if (input.inputs && Object.keys(input.inputs).length && !input.scope) {
    w.heading("Based on these details");
    for (const [k, v] of relevantInputs(input.inputs)) {
      w.row([
        { text: k, x: 0, width: 240, color: MUTED },
        { text: v, x: 250, width: A4.w - 2 * M - 250 },
      ], 9);
    }
  }

  w.heading("VAT");
  w.text("The VAT treatment of these fees will be confirmed in your engagement letter.", { size: 10 });

  w.heading("Not included");
  for (const x of [
    "Work not listed in this document",
    "Specialist tax advice, statutory audit or legal advice",
    "Third-party software subscriptions",
  ])
    w.text(`•  ${x}`, { size: 10, gap: 1 });

  w.heading("Next steps");
  [
    `Book a discovery call at ${site.url.replace(/^https?:\/\//, "")}/book, or reply to the email this came with.`,
    "We'll confirm the scope with you and agree a fixed monthly fee.",
    "You'll receive an engagement letter setting out the work and fees before anything starts.",
  ].forEach((s, i) => w.text(`${i + 1}.  ${s}`, { size: 10, gap: 2 }));

  // Footer on every page
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const disclaimer = priced
      ? "This is an indicative estimate, not a binding offer. Final fees are confirmed in an engagement letter."
      : "This is a summary of your enquiry. It is not a quotation.";
    p.drawLine({ start: { x: M, y: M + 26 }, end: { x: A4.w - M, y: M + 26 }, thickness: 0.6, color: LINE });
    p.drawText(disclaimer, { x: M, y: M + 12, size: 8, font, color: STEEL });
    const company = pdfSafe(`${site.legalName} · ${site.address.street}, ${site.address.locality} ${site.address.postcode} · ${site.phone} · ${site.email}`);
    p.drawText(company, { x: M, y: M, size: 7.5, font, color: MUTED });
    const pn = `Page ${i + 1} of ${pages.length}`;
    p.drawText(pn, { x: A4.w - M - font.widthOfTextAtSize(pn, 7.5), y: M, size: 7.5, font, color: MUTED });
  });

  return doc.save();
}
