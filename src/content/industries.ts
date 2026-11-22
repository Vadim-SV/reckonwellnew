import industryFaqs from "./industry-faqs.json";
import type { Faq } from "./services";

/**
 * Industry pages. FAQs are carried over from the original reckonwell.com
 * industry pages (reckonwell-main/src/app/industries/*) to keep their
 * search value; the rest of the copy is written for established companies.
 */
export type Industry = {
  slug: "technology" | "ecommerce" | "property" | "manufacturing" | "hospitality";
  name: string;
  summary: string;
  title: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  challenges: { title: string; text: string }[];
  weHandle: string[];
  services: string[];
  faqs: Faq[];
};

type RawFaq = { question: string; answer: string };
const faqsFor = (key: keyof typeof industryFaqs): Faq[] => (industryFaqs[key] as RawFaq[]).map((f) => ({ ...f }));

export const industries: Industry[] = [
  {
    slug: "technology",
    name: "Technology",
    summary: "Recurring revenue, R&D claims and clear reports for investors.",
    title: "Finance support for technology and SaaS companies.",
    lede: "Subscription revenue, development costs and investor reporting make technology finance more involved than it looks. We keep the books accurate every month so your MRR, margins and runway are numbers you can trust.",
    metaTitle: "Accounting Services for Technology Companies",
    metaDescription:
      "Outsourced bookkeeping, management accounts and R&D tax relief for UK technology and SaaS companies — recurring revenue, deferred income and investor reporting.",
    challenges: [
      { title: "Revenue that isn't cash", text: "Annual subscriptions paid up front have to be spread across the months they cover, or your profit is overstated." },
      { title: "Investor and board reporting", text: "Monthly packs with burn, runway and SaaS metrics need clean, consistent books behind them." },
      { title: "R&D tax relief", text: "Development costs may qualify for relief, but only with the right records and a defensible claim." },
      { title: "A growing team", text: "Payroll, contractors and share schemes add admin quickly as the team grows." },
    ],
    weHandle: [
      "Deferred income and revenue recognition",
      "Monthly management accounts with burn and runway",
      "Stripe, GoCardless and app-store reconciliations",
      "Payroll and contractor payments",
      "R&D tax relief claims",
      "Year-end accounts and CT600",
    ],
    services: ["management-accounts", "outsourced-financial-operations", "r-and-d-tax-relief", "credit-control"],
    faqs: faqsFor("technology"),
  },
  {
    slug: "ecommerce",
    name: "E-Commerce",
    summary: "Marketplace payouts, platform fees, stock and VAT across channels.",
    title: "Finance support for e-commerce businesses.",
    lede: "Shopify, Amazon and payment-provider payouts bundle sales, fees and refunds together. We separate them properly so you can see real margins by channel, value stock correctly and file VAT with confidence.",
    metaTitle: "E-commerce Bookkeeping for Shopify & Amazon Sellers",
    metaDescription:
      "Outsourced bookkeeping for UK e-commerce businesses: Shopify and Amazon payout reconciliation, platform fees, stock and VAT across sales channels.",
    challenges: [
      { title: "Net payouts hide the detail", text: "Booking only what lands in the bank understates revenue and loses the platform fees." },
      { title: "Stock and cash", text: "Cash tied up in stock and inbound shipments needs watching as you scale." },
      { title: "VAT across channels", text: "Marketplace rules, overseas sales and imports each have their own VAT treatment." },
      { title: "Profit by channel", text: "Advertising, fulfilment and returns need allocating to see which channels actually make money." },
    ],
    weHandle: [
      "Shopify, Amazon and PayPal payout reconciliation",
      "Platform fee and refund tracking",
      "Stock records and year-end valuation",
      "VAT returns, including marketplace rules",
      "Channel-level management reporting",
      "Supplier payments and import costs",
    ],
    services: ["bookkeeping-services", "accounting-systems", "vat-returns", "accounts-payable"],
    faqs: faqsFor("ecommerce"),
  },
  {
    slug: "property",
    name: "Property",
    summary: "Landlords, SPVs, rental income, finance costs and portfolio cash flow.",
    title: "Finance support for property businesses and SPVs.",
    lede: "Whether you hold property personally or through limited companies, we keep rental income, finance costs and director's loans accurately recorded across your portfolio — and handle the accounts and tax returns that follow.",
    metaTitle: "Property Company Accounting for Landlords & SPVs",
    metaDescription:
      "Bookkeeping, accounts and tax for UK landlords and property SPVs: rental income, mortgage interest, director's loans, MTD for Income Tax and CT600s.",
    challenges: [
      { title: "Several companies, one portfolio", text: "Each SPV needs its own books, accounts and tax return, with transactions between them tracked." },
      { title: "Director's loans", text: "Money moving between you and your companies must be recorded carefully to avoid tax charges." },
      { title: "Making Tax Digital", text: "Landlords with qualifying income over £50,000 must send quarterly updates from April 2026." },
      { title: "Cash flow across properties", text: "Voids, refurbishments and refinancing make portfolio cash flow hard to see." },
    ],
    weHandle: [
      "Rental income and letting-agent statements",
      "Mortgage interest and finance costs",
      "Director's loan accounts",
      "SPV accounts and CT600s",
      "MTD for Income Tax quarterly updates",
      "Portfolio-level reporting",
    ],
    services: ["group-companies", "bookkeeping-services", "making-tax-digital", "annual-accounts-ct600"],
    faqs: faqsFor("property"),
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    summary: "Stock, production costs, margins, working capital and controls.",
    title: "Finance support for manufacturers.",
    lede: "Stock, work in progress and production overheads make manufacturing accounts demanding. We keep purchasing, costing and stock records in order so your margins are accurate and your working capital is under control.",
    metaTitle: "Manufacturing Bookkeeping & Outsourced Finance",
    metaDescription:
      "Outsourced bookkeeping and management accounts for UK manufacturers: stock and WIP, product costing, margins, working capital and capital allowances.",
    challenges: [
      { title: "Stock and work in progress", text: "Materials, labour and overheads all need to be reflected in stock values at month-end." },
      { title: "True product margins", text: "Without overheads allocated properly, products can be priced below their real cost." },
      { title: "Working capital", text: "Cash locked in stock and customer credit can squeeze a profitable business." },
      { title: "Capital investment", text: "Machinery purchases may qualify for full expensing and other allowances." },
    ],
    weHandle: [
      "Purchase ledger and supplier payment runs",
      "Stock and WIP records",
      "Product costing and margin reporting",
      "Credit control on customer accounts",
      "Capital allowances and R&D claims",
      "Monthly management accounts",
    ],
    services: ["accounts-payable", "credit-control", "management-accounts", "r-and-d-tax-relief"],
    faqs: faqsFor("manufacturing"),
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    summary: "Daily takings, supplier costs, tips, payroll, VAT and margins.",
    title: "Finance support for restaurants, bars and hospitality groups.",
    lede: "High transaction volumes, tips, shift-based payroll and complex VAT on food mean hospitality finance never stops. We reconcile your takings, run payroll and keep food and labour costs in view across every site.",
    metaTitle: "Hospitality Bookkeeping for Restaurants & Bars",
    metaDescription:
      "Outsourced bookkeeping, payroll and VAT for UK restaurants, bars and hospitality groups: daily takings, tips and tronc, supplier costs and margins.",
    challenges: [
      { title: "Daily takings", text: "EPOS, card terminals, delivery platforms and cash all need reconciling — ideally every day." },
      { title: "Tips and payroll", text: "Tips law, tronc schemes and shift-based staff make payroll easy to get wrong." },
      { title: "VAT on food", text: "Hot, cold, eat-in and takeaway sales can carry different VAT treatment." },
      { title: "Costs across sites", text: "Food and labour costs need tracking by site to protect margins." },
    ],
    weHandle: [
      "EPOS, card and delivery-platform reconciliations",
      "Weekly or monthly payroll, including tips",
      "Supplier invoices and payment runs",
      "VAT returns",
      "Site-by-site cost reporting",
      "Year-end accounts",
    ],
    services: ["bookkeeping-services", "payroll-services", "accounts-payable", "vat-returns"],
    faqs: faqsFor("hospitality"),
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
