import type { CalculatorKey } from "@/lib/pricing/registry";
import type { ScopingKey } from "@/lib/scoping/registry";
import { operationsServices } from "./services-operations";

export type Faq = { question: string; answer: string };

export type ServiceTool = { kind: "calculator"; key: CalculatorKey } | { kind: "scoping"; key: ScopingKey };

export type IllustrationKey =
  | "bookkeeping"
  | "finance-team"
  | "payroll"
  | "vat"
  | "annual-accounts"
  | "self-assessment"
  | "mtd"
  | "rd"
  | "accounts-payable"
  | "credit-control"
  | "management-accounts"
  | "month-end-close"
  | "accounting-systems"
  | "group-companies";

export type Service = {
  slug: string;
  /** Public URL. Original services keep their existing root-level URLs. */
  href: string;
  name: string;
  category: "operations" | "compliance" | "support";
  /** One line for cards and menus. */
  summary: string;
  eyebrow: string;
  title: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  /** Price calculator (approved/recovered pricing) or requirements tool (no pricing). */
  tool: ServiceTool;
  calculatorTitle: string;
  calculatorIntro: string;
  includes: { title: string; text: string }[];
  goodFit: string[];
  steps: { title: string; text: string }[];
  faqs: Faq[];
  related: string[];
  /** Optional richer sections used by the newer service pages. */
  explanation?: string[];
  benefits?: { title: string; text: string }[];
  illustration?: IllustrationKey;
  /** "section": a scroll-driven illustration shown in its own section instead of the hero. */
  illustrationPlacement?: "hero" | "section";
  illustrationTitle?: string;
};

const onboardingSteps = (service: string): Service["steps"] => [
  { title: "A short call", text: `We talk through your business, your current setup and what you need from ${service}.` },
  { title: "A fixed monthly fee", text: "You get a clear proposal. No hourly billing, and you can cancel any time." },
  { title: "We handle the switch", text: "We collect what we need from you or your previous accountant. Onboarding usually takes two to three weeks." },
  { title: "Work carries on every month", text: "You get regular updates, quick answers and the confidence that deadlines are covered." },
];

const coreServices: Service[] = [
  {
    slug: "outsourced-financial-operations",
    href: "/outsourced-financial-operations",
    name: "Outsourced finance team",
    category: "operations",
    summary: "We run your day-to-day finance work, so you don't need to hire.",
    eyebrow: "Outsourced financial operations",
    title: "Your finance team, without the hiring.",
    lede: "When the finance workload outgrows the people you have, you don't have to recruit. We take on the bookkeeping, payables, receivables, payroll and monthly reporting, and work alongside anyone you already have.",
    metaTitle: "Outsourced Finance Team for SMEs",
    metaDescription:
      "Extend your finance team without hiring. Reckonwell runs bookkeeping, accounts payable, credit control, payroll and management accounts for UK SMEs.",
    tool: { kind: "calculator", key: "finance-team" },
    illustration: "finance-team",
    calculatorTitle: "What would it cost to hire instead?",
    calculatorIntro:
      "Choose the work you need covered. We'll show our indicative monthly fee next to the cost of employing people to do it.",
    includes: [
      { title: "Bookkeeping & reconciliations", text: "Every transaction coded and every bank, card and payment account reconciled, so the numbers are always current." },
      { title: "Accounts payable", text: "Supplier bills captured, checked and approved, with payment runs prepared on the schedule you choose." },
      { title: "Accounts receivable & credit control", text: "Invoices raised on time, payments matched and polite, persistent follow-up on anything overdue." },
      { title: "Payroll", text: "Monthly payroll, payslips, RTI submissions to HMRC and pension auto-enrolment handled for you." },
      { title: "Management accounts", text: "A monthly pack showing profit, cash, what you're owed and what you owe — with a short commentary in plain English." },
      { title: "Financial controls", text: "Sensible approval limits, month-end checklists and clean records that stand up to an audit or due diligence." },
    ],
    goodFit: [
      "Your finance work has outgrown one person, or your bookkeeper is leaving",
      "You'd rather not take on the cost and risk of another hire",
      "Your finance director or manager needs the routine work taken off their desk",
      "You want reliable monthly numbers instead of waiting for year-end",
    ],
    steps: onboardingSteps("your finance work"),
    faqs: [
      {
        question: "Do we have to replace our current team?",
        answer:
          "No. Most clients keep their finance manager or finance director and hand us the volume work — bookkeeping, payables, receivables and payroll. Others ask us to look after all of it. We fit around what you already have.",
      },
      {
        question: "How is this different from using an accountant at year-end?",
        answer:
          "A year-end accountant looks back once a year. We work in your books every month, so your records are always up to date, suppliers and staff are paid on time, and you see your numbers while you can still act on them.",
      },
      {
        question: "Which accounting software do you work with?",
        answer:
          "We mainly work in Xero and QuickBooks. If you're on something else, we'll talk you through whether to stay or switch, and we can set up and train your team on new software.",
      },
      {
        question: "Is there a long contract?",
        answer: "No. We work on a rolling monthly basis and you can cancel at any time.",
      },
    ],
    related: ["accounts-payable", "credit-control", "management-accounts", "bookkeeping-services"],
  },
  {
    slug: "bookkeeping-services",
    href: "/bookkeeping-services",
    name: "Bookkeeping",
    category: "operations",
    summary: "Accurate, up-to-date books with every account reconciled.",
    eyebrow: "Outsourced bookkeeping",
    title: "Books that are right, every month.",
    lede: "We code your transactions, reconcile every account and keep your records up to date — so you always know where the business stands and year-end holds no surprises.",
    metaTitle: "Outsourced Bookkeeping UK for Growing Companies",
    metaDescription:
      "Outsourced bookkeeping for growing UK companies: transactions coded and accounts reconciled every month in Xero or QuickBooks. Get an instant estimate.",
    tool: { kind: "calculator", key: "bookkeeping" },
    illustration: "bookkeeping",
    calculatorTitle: "Estimate your bookkeeping fee",
    calculatorIntro:
      "Bookkeeping is priced on the number of transactions you have each month. If your books are behind, we can bring them up to date first.",
    includes: [
      { title: "Transaction coding", text: "Sales, purchases and expenses posted to the right accounts with the right VAT treatment." },
      { title: "Bank reconciliations", text: "Bank, card and payment-platform accounts matched to your records, line by line." },
      { title: "Supplier and customer ledgers", text: "Clear lists of who you owe and who owes you, kept accurate throughout the month." },
      { title: "Catch-up work", text: "Months of backlog brought up to date and tidied before we take over the routine." },
      { title: "Software setup", text: "Xero or QuickBooks set up properly, with bank feeds, rules and training for your team." },
      { title: "Month-end checks", text: "A consistent month-end routine so the numbers are ready for reporting and VAT." },
    ],
    goodFit: [
      "Your books are behind, or nobody is sure they're right",
      "Your team is spending hours on data entry instead of their real jobs",
      "You need clean records for VAT, lenders or investors",
      "You want someone accountable for the books every month",
    ],
    steps: onboardingSteps("your bookkeeping"),
    faqs: [
      {
        question: "How is bookkeeping priced?",
        answer:
          "By the number of transactions you have each month — roughly the number of lines on your bank and card statements. Use the calculator for an indicative figure; we'll confirm it once we've looked at a recent statement.",
      },
      {
        question: "Our books are months behind. Can you help?",
        answer:
          "Yes. We'll bring the records up to date first, then take over the monthly routine. The catch-up is a one-off fee based on the number of months and transactions involved.",
      },
      {
        question: "Do we need to change software?",
        answer:
          "Not usually. We work in Xero and QuickBooks. If you're on spreadsheets or older desktop software, we'll recommend the simplest route and can set it up for you.",
      },
    ],
    related: ["accounts-payable", "month-end-close", "accounting-systems", "vat-returns"],
  },
  {
    slug: "payroll-services",
    href: "/payroll-services",
    name: "Payroll",
    category: "compliance",
    summary: "Accurate monthly payroll, payslips, RTI and pensions.",
    eyebrow: "Payroll services",
    title: "Your team paid correctly, on time.",
    lede: "We run your payroll each month, send payslips, make the RTI submissions to HMRC and manage pension auto-enrolment — so payday is never a worry.",
    metaTitle: "Outsourced Payroll Services",
    metaDescription:
      "Outsourced payroll for UK businesses: monthly payroll, payslips, RTI submissions, pension auto-enrolment, starters and leavers. Get an instant estimate.",
    tool: { kind: "calculator", key: "payroll" },
    illustration: "payroll",
    calculatorTitle: "Estimate your payroll fee",
    calculatorIntro: "Payroll is £4 per employee per month, from £25 a month.",
    includes: [
      { title: "Monthly payroll", text: "Gross-to-net calculations, deductions and a payment summary ready for your bank." },
      { title: "Payslips", text: "Clear payslips sent securely to every employee." },
      { title: "RTI submissions", text: "Full Payment Submissions and Employer Payment Summaries filed with HMRC on time." },
      { title: "Pension auto-enrolment", text: "Assessments, contributions and pension provider uploads handled each pay run." },
      { title: "Starters and leavers", text: "New starter checklists, P45s and year-end P60s prepared for you." },
      { title: "Statutory pay", text: "Sick, maternity and paternity pay calculated correctly." },
    ],
    goodFit: [
      "Payroll currently depends on one person in your office",
      "You're growing and want payroll to scale without extra admin",
      "You want payroll and your bookkeeping kept in step",
    ],
    steps: onboardingSteps("payroll"),
    faqs: [
      {
        question: "Can you take over payroll part-way through the tax year?",
        answer:
          "Yes. We'll take the year-to-date figures from your current provider so that tax, National Insurance and pension calculations carry on correctly.",
      },
      {
        question: "Do you handle pension auto-enrolment?",
        answer:
          "Yes. We assess employees each pay run, calculate contributions and upload them to your pension provider.",
      },
    ],
    related: ["outsourced-financial-operations", "bookkeeping-services", "annual-accounts-ct600"],
  },
  {
    slug: "vat-returns",
    href: "/vat-returns",
    name: "VAT returns",
    category: "compliance",
    summary: "VAT returns prepared, checked and filed under Making Tax Digital.",
    eyebrow: "VAT returns",
    title: "VAT returns, prepared and filed for you.",
    lede: "We prepare your VAT returns from up-to-date books, check them properly and file them with HMRC through Making Tax Digital software — on time, every time.",
    metaTitle: "VAT Returns & VAT Registration Services",
    metaDescription:
      "VAT returns prepared, reviewed and filed with HMRC under Making Tax Digital, plus help with VAT registration. Get an instant estimate.",
    tool: { kind: "calculator", key: "vat" },
    illustration: "vat",
    calculatorTitle: "Estimate your VAT fee",
    calculatorIntro: "VAT returns are priced per return. Most businesses file four a year.",
    includes: [
      { title: "Return preparation", text: "VAT calculated from reconciled records, with the right treatment for each transaction." },
      { title: "Review before filing", text: "A second check for errors and unusual items before anything goes to HMRC." },
      { title: "MTD filing", text: "Returns submitted through HMRC-recognised Making Tax Digital software." },
      { title: "VAT registration", text: "Help deciding when to register and completing the registration with HMRC." },
    ],
    goodFit: [
      "You're VAT-registered, or about to pass the registration threshold",
      "You want VAT handled by the same people who keep your books",
      "You sell across several channels and the VAT treatment is getting complicated",
    ],
    steps: onboardingSteps("VAT"),
    faqs: [
      {
        question: "When do I have to register for VAT?",
        answer:
          "You must register if your VAT-taxable turnover over the previous 12 months goes above £90,000, or if you expect it to go above that in the next 30 days alone. Some businesses register voluntarily below the threshold.",
      },
      {
        question: "When are VAT returns due?",
        answer:
          "Most businesses file quarterly. The return and payment are usually due one month and seven days after the end of each VAT period.",
      },
      {
        question: "Does Making Tax Digital apply to VAT?",
        answer:
          "Yes. All VAT-registered businesses must keep digital records and file VAT returns using MTD-compatible software.",
      },
    ],
    related: ["bookkeeping-services", "making-tax-digital", "outsourced-financial-operations"],
  },
  {
    slug: "annual-accounts-ct600",
    href: "/annual-accounts-ct600",
    name: "Annual accounts & CT600",
    category: "compliance",
    summary: "Statutory accounts and Corporation Tax returns, filed on time.",
    eyebrow: "Annual accounts & Corporation Tax",
    title: "Year-end accounts and tax, done properly.",
    lede: "Every limited company must file statutory accounts with Companies House and a CT600 Corporation Tax return with HMRC. We prepare both, make sure every allowable deduction is claimed and file well before the deadlines.",
    metaTitle: "Annual Accounts & CT600 Corporation Tax Returns",
    metaDescription:
      "Statutory year-end accounts and CT600 Corporation Tax returns for UK limited companies, prepared and filed on time. Get an instant estimate.",
    tool: { kind: "calculator", key: "annual-accounts" },
    illustration: "annual-accounts",
    calculatorTitle: "Estimate your monthly fee",
    calculatorIntro:
      "The fee depends on your profit, your number of staff and how closely you'd like us to keep an eye on your position during the year.",
    includes: [
      { title: "Statutory accounts", text: "Year-end accounts prepared to FRS 102 or FRS 105 and filed at Companies House." },
      { title: "CT600 return", text: "Your Corporation Tax return prepared and submitted to HMRC, with the tax computation." },
      { title: "Tax planning", text: "Director salary and dividend planning so you take money out of the company tax-efficiently." },
      { title: "In-year monitoring", text: "Optional quarterly or monthly reviews so you know your tax position before year-end." },
      { title: "VAT returns", text: "Quarterly VAT returns included where you choose quarterly or monthly monitoring." },
      { title: "Management accounts", text: "Optional monthly management accounts for companies with investors or a board." },
    ],
    goodFit: [
      "You run a limited company and want year-end handled without the stress",
      "You'd like to know your tax bill before it's due, not after",
      "You're raising investment and need reliable reporting",
    ],
    steps: onboardingSteps("your year-end"),
    faqs: [
      {
        question: 'What is included in "Final Accounts & CT600"?',
        answer:
          "Statutory year-end accounts prepared to FRS 102/105 standard, filed at Companies House, plus your CT600 Corporation Tax return submitted to HMRC. VAT returns are included where applicable.",
      },
      {
        question: "When are the deadlines?",
        answer:
          "A private company's accounts are due at Companies House nine months after its year end. Corporation Tax is usually payable nine months and one day after the end of the accounting period, and the CT600 must be filed within 12 months.",
      },
      {
        question: "Do I need management accounts as well?",
        answer:
          "They're optional but recommended for any company with investors, a board or significant growth. They give you a monthly view of profit, cash and key figures — not just a year-end snapshot.",
      },
      {
        question: "How long does year-end take?",
        answer:
          "Typically four to six weeks from when we receive your records. We aim to file well before the Companies House and HMRC deadlines so you're never at risk of a penalty.",
      },
    ],
    related: ["outsourced-financial-operations", "bookkeeping-services", "r-and-d-tax-relief"],
  },
  {
    slug: "self-assessment",
    href: "/self-assessment",
    name: "Self Assessment",
    category: "compliance",
    summary: "Personal tax returns for directors, sole traders and landlords.",
    eyebrow: "Self Assessment",
    title: "Your tax return, sorted before the deadline.",
    lede: "We prepare and file Self Assessment returns for company directors, sole traders and landlords — and keep an eye on your position during the year so the bill never comes as a surprise.",
    metaTitle: "Self Assessment Tax Returns",
    metaDescription:
      "Self Assessment tax returns for directors, sole traders, freelancers and landlords, with optional monthly monitoring and MTD support. Get an instant estimate.",
    tool: { kind: "calculator", key: "self-assessment" },
    illustration: "self-assessment",
    calculatorTitle: "Estimate your Self Assessment fee",
    calculatorIntro:
      "The price depends on your income, whether you have rental income and how closely you'd like us to monitor your position.",
    includes: [
      { title: "Tax return", text: "Your Self Assessment return prepared from your records and filed with HMRC." },
      { title: "Tax estimates", text: "A running estimate of what you'll owe, so you can put money aside." },
      { title: "Rental income", text: "Property income and allowable expenses reported correctly." },
      { title: "Making Tax Digital", text: "Quarterly MTD updates handled for you where your income is over the threshold." },
    ],
    goodFit: [
      "You're a company director with dividends or other income",
      "You're self-employed or a landlord",
      "You've had a late return or an unexpected tax bill before",
    ],
    steps: onboardingSteps("your tax return"),
    faqs: [
      {
        question: "When is the Self Assessment deadline?",
        answer:
          "Online returns and any tax owed are due by 31 January after the end of the tax year. Paper returns are due by 31 October.",
      },
      {
        question: 'What does "monthly monitoring" include?',
        answer:
          "A monthly review of your income and a running tax estimate throughout the year, so you know what you'll owe well before January.",
      },
    ],
    related: ["making-tax-digital", "annual-accounts-ct600", "bookkeeping-services"],
  },
  {
    slug: "making-tax-digital",
    href: "/making-tax-digital",
    name: "Making Tax Digital",
    category: "compliance",
    summary: "Quarterly MTD for Income Tax updates for sole traders and landlords.",
    eyebrow: "Making Tax Digital for Income Tax",
    title: "Quarterly MTD updates, handled.",
    lede: "From April 2026, sole traders and landlords with qualifying income over £50,000 must keep digital records and send HMRC quarterly updates. We take care of every submission.",
    metaTitle: "Making Tax Digital for Income Tax (MTD ITSA)",
    metaDescription:
      "Making Tax Digital for Income Tax support for sole traders and landlords: digital records, quarterly updates and the final declaration. Get an instant estimate.",
    tool: { kind: "calculator", key: "mtd" },
    illustration: "mtd",
    calculatorTitle: "Estimate your MTD fee",
    calculatorIntro: "Choose how much support you'd like. Landlords with several properties pay a little more.",
    includes: [
      { title: "Digital records", text: "Your income and expenses kept in HMRC-recognised software." },
      { title: "Quarterly updates", text: "All four quarterly submissions sent to HMRC on time." },
      { title: "Final declaration", text: "Your end-of-year position finalised and submitted." },
      { title: "Monitoring", text: "Optional monthly reviews of your income and tax position." },
    ],
    goodFit: [
      "You're self-employed or a landlord with qualifying income over £50,000",
      "Your income is likely to pass £30,000 before April 2027",
      "You'd rather not learn new software and deadlines yourself",
    ],
    steps: onboardingSteps("Making Tax Digital"),
    faqs: [
      {
        question: "Who has to use MTD for Income Tax?",
        answer:
          "From 6 April 2026 it applies to sole traders and landlords with qualifying income over £50,000. The threshold falls to £30,000 from April 2027 and £20,000 from April 2028.",
      },
      {
        question: "What changes in practice?",
        answer:
          "You keep digital records in compatible software and send HMRC an update every quarter, then finalise the year — instead of filing a single annual return.",
      },
    ],
    related: ["self-assessment", "vat-returns", "bookkeeping-services"],
  },
  {
    slug: "r-and-d-tax-relief",
    href: "/r-and-d-tax-relief",
    name: "R&D tax relief",
    category: "compliance",
    summary: "R&D tax relief claims prepared to stand up to HMRC scrutiny.",
    eyebrow: "R&D tax relief",
    title: "R&D claims, prepared properly.",
    lede: "If your company is resolving genuine scientific or technological uncertainty, it may be able to claim R&D tax relief. We identify qualifying spend, write the technical narrative and file a claim that stands up to scrutiny.",
    metaTitle: "R&D Tax Relief Claims",
    metaDescription:
      "R&D tax relief claims for UK companies: qualifying spend identified, technical narrative written and claim filed with HMRC. Get an instant fee estimate.",
    tool: { kind: "calculator", key: "rd-fee" },
    illustration: "rd",
    calculatorTitle: "Estimate the fee for your claim",
    calculatorIntro:
      "Claims are priced on your annual R&D spend. Companies with ongoing R&D can choose a monthly retainer instead.",
    includes: [
      { title: "Eligibility review", text: "An honest view of whether your work qualifies before you commit." },
      { title: "Qualifying spend", text: "Staff, subcontractor, software and consumable costs identified and calculated." },
      { title: "Technical narrative", text: "A clear write-up of the advances and uncertainties, in the form HMRC expects." },
      { title: "Filing and enquiries", text: "The claim filed with your CT600, and any HMRC questions answered on your behalf." },
    ],
    goodFit: [
      "You develop new software, products or processes",
      "You've never claimed, or aren't sure your previous claims were right",
      "You want a claim that is defensible from day one",
    ],
    steps: onboardingSteps("your R&D claim"),
    faqs: [
      {
        question: "What qualifies as R&D spend?",
        answer:
          "Salaries for engineers and developers working on novel technology, software licences used exclusively for R&D, hardware development and prototyping, and testing and validation of new products. Routine maintenance, admin and training do not qualify. We review your situation and identify exactly what counts.",
      },
      {
        question: "Which scheme applies now?",
        answer:
          "For accounting periods beginning on or after 1 April 2024, most companies claim under the merged R&D scheme. Loss-making companies that are R&D-intensive may qualify for Enhanced R&D Intensive Support (ERIS). We'll confirm which applies to you.",
      },
      {
        question: "How long does the process take?",
        answer:
          "We typically complete the claim within four to six weeks of receiving your records. HMRC then takes several weeks to process it.",
      },
      {
        question: "What if HMRC challenges the claim?",
        answer:
          "We prepare every claim to be defensible — technical narrative, spend breakdown and supporting evidence. If HMRC raises a query, we respond on your behalf.",
      },
    ],
    related: ["annual-accounts-ct600", "outsourced-financial-operations"],
  },
];

/** Display order: financial operations, then compliance, then business support. */
const order = [
  "outsourced-financial-operations",
  "bookkeeping-services",
  "accounts-payable",
  "credit-control",
  "management-accounts",
  "month-end-close",
  "payroll-services",
  "vat-returns",
  "annual-accounts-ct600",
  "self-assessment",
  "making-tax-digital",
  "r-and-d-tax-relief",
  "accounting-systems",
  "group-companies",
];

export const services: Service[] = [...coreServices, ...operationsServices].sort(
  (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug),
);

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const serviceGroups = [
  { key: "operations", title: "Financial operations", text: "Ongoing monthly work that keeps your finances running smoothly." },
  { key: "compliance", title: "Accounting & compliance", text: "Returns and filings, on their own or alongside ongoing support." },
  { key: "support", title: "Business support", text: "Help with systems, group structures and getting started." },
] as const;
