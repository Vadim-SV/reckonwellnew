import { z } from "zod";

/**
 * Scoping tools for services without approved pricing. They turn a visitor's
 * answers into a clear requirements summary — never a monetary figure. The
 * enquiry API validates and re-summarises the answers on the server, exactly
 * as it recalculates calculator estimates.
 */

export type ScopeSummary = {
  headline: string;
  items: { label: string; value: string }[];
  /** What we'd set up or take on, based on the answers. */
  focus: string[];
  pricingNote: string;
};

const TAILORED =
  "Tailored quote: we'll confirm a fixed monthly fee after a short call, once we've seen how your records are set up.";

const pick = <T extends string>(values: readonly [T, ...T[]]) => z.enum(values);
const many = <T extends string>(values: readonly [T, ...T[]]) => z.array(z.enum(values)).max(values.length);

// ── Option lists (shared with the UI) ────────────────────────────────────────
export const options = {
  monthlyVolume: ["under-50", "50-200", "200-500", "500-plus"] as const,
  software: ["xero", "quickbooks", "sage", "spreadsheets", "other"] as const,
  paymentRuns: ["weekly", "fortnightly", "monthly"] as const,
  approval: ["owner", "manager", "multi-level"] as const,
  invoiceArrival: ["email", "paper", "capture-tool", "mixed"] as const,
  terms: ["14", "30", "60-plus"] as const,
  overdue: ["little", "some", "a-lot"] as const,
  chasing: ["nobody", "ad-hoc", "in-house"] as const,
  frequency: ["monthly", "quarterly"] as const,
  audience: ["owners", "board", "investors", "lenders"] as const,
  reportExtras: ["budget", "cashflow", "kpis", "commentary", "aged-balances"] as const,
  closeToday: ["not-closed", "over-10", "5-10", "under-5"] as const,
  closeTasks: ["bank", "accruals", "payroll", "vat", "fixed-assets", "intercompany"] as const,
  systemsGoal: ["move", "tidy", "integrate"] as const,
  integrations: ["bank-feeds", "capture", "payroll", "ecommerce", "payments", "invoicing"] as const,
  groupSoftware: ["same", "mixed", "unsure"] as const,
  intercompany: ["none", "occasional", "regular"] as const,
  groupReporting: ["each", "overview", "board-pack"] as const,
  team: ["none", "bookkeeper", "finance-manager", "finance-director"] as const,
  startupStage: ["pre-incorporation", "just-incorporated", "under-12-months", "1-2-years"] as const,
  structure: ["limited-company", "sole-trader", "unsure"] as const,
  startupNeeds: ["software", "bank", "invoicing", "deadlines", "records", "vat", "payroll", "monthly"] as const,
};

export const labels: Record<string, Record<string, string>> = {
  monthlyVolume: { "under-50": "Under 50", "50-200": "50–200", "200-500": "200–500", "500-plus": "500+" },
  software: { xero: "Xero", quickbooks: "QuickBooks", sage: "Sage", spreadsheets: "Spreadsheets", other: "Other / not sure" },
  paymentRuns: { weekly: "Weekly", fortnightly: "Fortnightly", monthly: "Monthly" },
  approval: { owner: "The owner approves", manager: "A manager approves", "multi-level": "Several approvers" },
  invoiceArrival: { email: "By email", paper: "On paper", "capture-tool": "Through a capture tool", mixed: "A mix" },
  terms: { "14": "14 days", "30": "30 days", "60-plus": "60 days or more" },
  overdue: { little: "Very little", some: "Some", "a-lot": "A lot" },
  chasing: { nobody: "Nobody, really", "ad-hoc": "Whoever has time", "in-house": "Someone in the team" },
  frequency: { monthly: "Monthly", quarterly: "Quarterly" },
  audience: { owners: "Owners / directors", board: "A board", investors: "Investors", lenders: "Lenders" },
  reportExtras: {
    budget: "Budget vs actual",
    cashflow: "Cash flow forecast",
    kpis: "Key figures (KPIs)",
    commentary: "Written commentary",
    "aged-balances": "Aged debtors and creditors",
  },
  closeToday: {
    "not-closed": "We don't really close the month",
    "over-10": "More than 10 working days",
    "5-10": "5–10 working days",
    "under-5": "Under 5 working days",
  },
  closeTasks: {
    bank: "Bank and card reconciliations",
    accruals: "Accruals and prepayments",
    payroll: "Payroll journals",
    vat: "VAT control account",
    "fixed-assets": "Fixed assets and depreciation",
    intercompany: "Intercompany balances",
  },
  systemsGoal: { move: "Move to Xero or QuickBooks", tidy: "Tidy up what we have", integrate: "Connect more apps" },
  integrations: {
    "bank-feeds": "Bank feeds",
    capture: "Receipt and invoice capture",
    payroll: "Payroll software",
    ecommerce: "E-commerce platforms",
    payments: "Payment providers (e.g. Stripe)",
    invoicing: "Invoicing or CRM tools",
  },
  groupSoftware: { same: "The same software everywhere", mixed: "Different software", unsure: "Not sure" },
  intercompany: { none: "None", occasional: "Occasional", regular: "Regular" },
  groupReporting: {
    each: "Each company's own reports",
    overview: "A group overview as well",
    "board-pack": "A group board pack",
  },
  team: {
    none: "No finance staff",
    bookkeeper: "A bookkeeper",
    "finance-manager": "A finance manager",
    "finance-director": "A finance director",
  },
  startupStage: {
    "pre-incorporation": "Not set up yet",
    "just-incorporated": "Just incorporated",
    "under-12-months": "Trading under 12 months",
    "1-2-years": "Trading 1–2 years",
  },
  structure: { "limited-company": "Limited company", "sole-trader": "Sole trader", unsure: "Not sure yet" },
  startupNeeds: {
    software: "Set up accounting software",
    bank: "Connect bank accounts",
    invoicing: "Set up invoicing",
    deadlines: "Understand our deadlines",
    records: "Organise our first records",
    vat: "VAT registration",
    payroll: "Payroll for the first hires",
    monthly: "Regular monthly bookkeeping",
  },
};

const L = (group: keyof typeof labels, value: string) => labels[group]?.[value] ?? value;
const list = (group: keyof typeof labels, values: string[]) =>
  values.length ? values.map((v) => L(group, v)).join(", ") : "None selected";

// ── Schemas ──────────────────────────────────────────────────────────────────
const schemas = {
  "accounts-payable": z.object({
    invoicesPerMonth: pick(options.monthlyVolume),
    arrival: pick(options.invoiceArrival),
    paymentRuns: pick(options.paymentRuns),
    approval: pick(options.approval),
    statementReconciliations: z.boolean(),
    software: pick(options.software),
  }),
  "credit-control": z.object({
    invoicesPerMonth: pick(options.monthlyVolume),
    terms: pick(options.terms),
    overdue: pick(options.overdue),
    chasing: pick(options.chasing),
    phoneFollowUp: z.boolean(),
    software: pick(options.software),
  }),
  "management-accounts": z.object({
    frequency: pick(options.frequency),
    audience: many(options.audience),
    extras: many(options.reportExtras),
    companies: z.number().int().min(1).max(50),
    software: pick(options.software),
  }),
  "month-end-close": z.object({
    closeToday: pick(options.closeToday),
    tasks: many(options.closeTasks),
    bankAccounts: z.number().int().min(1).max(200),
    companies: z.number().int().min(1).max(50),
    software: pick(options.software),
  }),
  "accounting-systems": z.object({
    current: pick(options.software),
    goal: pick(options.systemsGoal),
    integrations: many(options.integrations),
    users: z.number().int().min(1).max(500),
    training: z.boolean(),
  }),
  "group-companies": z.object({
    companies: z.number().int().min(2).max(50),
    transactionsPerMonth: pick(options.monthlyVolume),
    software: pick(options.groupSoftware),
    intercompany: pick(options.intercompany),
    reporting: pick(options.groupReporting),
    team: pick(options.team),
  }),
  "startup-launch": z.object({
    stage: pick(options.startupStage),
    structure: pick(options.structure),
    needs: many(options.startupNeeds),
    transactionsPerMonth: pick(options.monthlyVolume),
  }),
} as const;

export type ScopingKey = keyof typeof schemas;
export type ScopingInputs<K extends ScopingKey> = z.infer<(typeof schemas)[K]>;

const software = (s: string) =>
  s === "xero" || s === "quickbooks" ? `Work directly in your ${L("software", s)}` : "Agree the right accounting software with you";

// ── Summaries ────────────────────────────────────────────────────────────────
const summarise: { [K in ScopingKey]: (i: ScopingInputs<K>) => ScopeSummary } = {
  "accounts-payable"(i) {
    const focus = [
      `${L("paymentRuns", i.paymentRuns)} supplier payment runs prepared for your approval`,
      i.arrival === "capture-tool"
        ? "Process bills from your existing capture tool"
        : "Set up a single inbox and capture process for supplier bills",
      i.approval === "multi-level" ? "An approval route with more than one sign-off" : "A simple approval step before anything is paid",
      software(i.software),
    ];
    if (i.statementReconciliations) focus.splice(2, 0, "Monthly supplier statement reconciliations");
    return {
      headline: `${L("monthlyVolume", i.invoicesPerMonth)} supplier invoices a month, paid ${L("paymentRuns", i.paymentRuns).toLowerCase()}`,
      items: [
        { label: "Supplier invoices a month", value: L("monthlyVolume", i.invoicesPerMonth) },
        { label: "How invoices arrive", value: L("invoiceArrival", i.arrival) },
        { label: "Payment runs", value: L("paymentRuns", i.paymentRuns) },
        { label: "Approval", value: L("approval", i.approval) },
        { label: "Statement reconciliations", value: i.statementReconciliations ? "Yes" : "No" },
        { label: "Software", value: L("software", i.software) },
      ],
      focus,
      pricingNote: TAILORED,
    };
  },
  "credit-control"(i) {
    const focus = [
      "Weekly review of what's owed and what's overdue",
      i.phoneFollowUp ? "Polite reminders by email, followed up by phone" : "Polite, consistent email reminders on a set schedule",
      "Customer payments matched to invoices",
      "A short aged-debtors summary each month",
    ];
    if (i.overdue === "a-lot") focus.unshift("Start with a review of older overdue balances");
    if (i.chasing === "in-house") focus.push("Work alongside the person who currently chases payments");
    return {
      headline: `${L("monthlyVolume", i.invoicesPerMonth)} customer invoices a month on ${L("terms", i.terms)} terms`,
      items: [
        { label: "Customer invoices a month", value: L("monthlyVolume", i.invoicesPerMonth) },
        { label: "Usual payment terms", value: L("terms", i.terms) },
        { label: "Overdue today", value: L("overdue", i.overdue) },
        { label: "Who chases now", value: L("chasing", i.chasing) },
        { label: "Phone follow-up", value: i.phoneFollowUp ? "Yes" : "Email only" },
        { label: "Software", value: L("software", i.software) },
      ],
      focus,
      pricingNote: TAILORED,
    };
  },
  "management-accounts"(i) {
    const focus = [
      `${L("frequency", i.frequency)} profit and loss account and balance sheet`,
      ...i.extras.map((e) => L("reportExtras", e)),
    ];
    if (i.companies > 1) focus.push(`Reports for each of your ${i.companies} companies`);
    if (i.audience.includes("investors") || i.audience.includes("board")) focus.push("A pack laid out for board or investor meetings");
    return {
      headline: `${L("frequency", i.frequency)} management accounts${i.companies > 1 ? ` for ${i.companies} companies` : ""}`,
      items: [
        { label: "How often", value: L("frequency", i.frequency) },
        { label: "Who reads them", value: list("audience", i.audience) },
        { label: "Also included", value: list("reportExtras", i.extras) },
        { label: "Companies", value: String(i.companies) },
        { label: "Software", value: L("software", i.software) },
      ],
      focus,
      pricingNote: TAILORED,
    };
  },
  "month-end-close"(i) {
    const focus = [
      "A written month-end checklist agreed with you",
      ...i.tasks.map((t) => L("closeTasks", t)),
      "A review of the balance sheet before reports go out",
    ];
    if (i.closeToday === "not-closed" || i.closeToday === "over-10") focus.unshift("Bring the books up to date before the first close");
    return {
      headline: `Month-end close across ${i.bankAccounts} bank account${i.bankAccounts === 1 ? "" : "s"}${
        i.companies > 1 ? ` and ${i.companies} companies` : ""
      }`,
      items: [
        { label: "How long close takes now", value: L("closeToday", i.closeToday) },
        { label: "Tasks to cover", value: list("closeTasks", i.tasks) },
        { label: "Bank and card accounts", value: String(i.bankAccounts) },
        { label: "Companies", value: String(i.companies) },
        { label: "Software", value: L("software", i.software) },
      ],
      focus,
      pricingNote: TAILORED,
    };
  },
  "accounting-systems"(i) {
    const focus = [
      i.goal === "move"
        ? "Plan and carry out the move to Xero or QuickBooks, including opening balances"
        : i.goal === "tidy"
          ? "Tidy the chart of accounts, bank rules and settings you already have"
          : "Connect the apps you use so data flows in automatically",
      ...i.integrations.map((x) => `Connect ${L("integrations", x).toLowerCase()}`),
    ];
    if (i.training) focus.push(`Training for ${i.users} user${i.users === 1 ? "" : "s"}`);
    return {
      headline: `${L("systemsGoal", i.goal)} — currently on ${L("software", i.current)}`,
      items: [
        { label: "Current software", value: L("software", i.current) },
        { label: "Main goal", value: L("systemsGoal", i.goal) },
        { label: "Apps to connect", value: list("integrations", i.integrations) },
        { label: "People using it", value: String(i.users) },
        { label: "Training", value: i.training ? "Yes" : "No" },
      ],
      focus,
      pricingNote: TAILORED,
    };
  },
  "group-companies"(i) {
    const focus = [
      `Separate, reconciled books for each of the ${i.companies} companies`,
      i.intercompany === "none" ? "Checks to keep company records cleanly separated" : "Intercompany balances reconciled every month",
      i.reporting === "each"
        ? "Consistent monthly reports for each company"
        : i.reporting === "overview"
          ? "Company reports plus a group overview"
          : "A group board pack alongside company reports",
      i.software === "same" ? "One consistent setup across the group" : "A plan to bring the companies onto a consistent setup",
      "Liaison with your accountant on year-end and tax",
    ];
    if (i.team !== "none") focus.push(`Work alongside your ${L("team", i.team).replace(/^A /, "").toLowerCase()}`);
    return {
      headline: `${i.companies} companies, ${L("monthlyVolume", i.transactionsPerMonth)} transactions a month`,
      items: [
        { label: "Companies", value: String(i.companies) },
        { label: "Transactions a month (group)", value: L("monthlyVolume", i.transactionsPerMonth) },
        { label: "Software", value: L("groupSoftware", i.software) },
        { label: "Intercompany activity", value: L("intercompany", i.intercompany) },
        { label: "Reporting", value: L("groupReporting", i.reporting) },
        { label: "Finance team today", value: L("team", i.team) },
      ],
      focus,
      pricingNote: TAILORED,
    };
  },
  "startup-launch"(i) {
    const focus = i.needs.length ? i.needs.map((n) => L("startupNeeds", n)) : ["A short call to work out what you need first"];
    if (i.structure === "unsure") focus.push("A plain-English chat about sole trader vs limited company (with your adviser where tax advice is needed)");
    return {
      headline: `${L("startupStage", i.stage)} · ${L("structure", i.structure)}`,
      items: [
        { label: "Stage", value: L("startupStage", i.stage) },
        { label: "Structure", value: L("structure", i.structure) },
        { label: "Help needed", value: list("startupNeeds", i.needs) },
        { label: "Expected transactions a month", value: L("monthlyVolume", i.transactionsPerMonth) },
      ],
      focus,
      pricingNote: "Founder's Launch Offer: priced for your setup. We'll send a tailored quote after a short call.",
    };
  },
};

export const scopingKeys = Object.keys(schemas) as ScopingKey[];
export const isScopingKey = (key: string): key is ScopingKey => key in schemas;

export function scope<K extends ScopingKey>(key: K, inputs: ScopingInputs<K>): ScopeSummary {
  return summarise[key](inputs);
}

/** Validate untrusted answers (e.g. from an API request) and summarise. */
export function safeScope(key: string, inputs: unknown): { ok: true; summary: ScopeSummary; inputs: unknown } | { ok: false } {
  if (!isScopingKey(key)) return { ok: false };
  const parsed = schemas[key].safeParse(inputs);
  if (!parsed.success) return { ok: false };
  return { ok: true, summary: (summarise[key] as (i: unknown) => ScopeSummary)(parsed.data), inputs: parsed.data };
}
