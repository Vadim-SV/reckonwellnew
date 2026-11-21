/**
 * Site map for the new website. Routes marked `stage` are built in that
 * development stage; until then they resolve to the branded 404 page.
 */
export type NavItem = {
  label: string;
  href: string;
  description?: string;
  stage: number;
};

export const primaryNav: NavItem[] = [
  {
    label: "Financial Operations",
    href: "/outsourced-financial-operations",
    description: "Bookkeeping, payables, receivables, credit control and monthly reporting.",
    stage: 4,
  },
  {
    label: "Accounting & Compliance",
    href: "/accounting-and-compliance",
    description: "Annual accounts, CT600, VAT, payroll, Self Assessment, MTD and R&D.",
    stage: 5,
  },
  { label: "Industries", href: "/industries", stage: 4 },
  { label: "Groups", href: "/groups-of-companies", stage: 4 },
  { label: "Startups", href: "/startups", stage: 4 },
  { label: "Pricing", href: "/pricing", stage: 6 },
  { label: "Tools", href: "/tools", stage: 6 },
];

export const ctaNav = {
  book: { label: "Book a discovery call", href: "/book", stage: 7 },
  quote: { label: "Instant quote", href: "/instant-quote", stage: 6 },
  partner: { label: "Partner with us", href: "/partners", stage: 5 },
} as const;

/** Industry categories preserved from the live site. */
export const industries = [
  { slug: "technology", label: "Technology" },
  { slug: "ecommerce", label: "E-Commerce" },
  { slug: "property", label: "Property" },
  { slug: "manufacturing", label: "Manufacturing" },
  { slug: "hospitality", label: "Hospitality" },
] as const;

/** Standalone compliance services preserved from the live site. */
export const complianceServices = [
  { slug: "annual-accounts-ct600", label: "Annual Accounts & CT600" },
  { slug: "self-assessment", label: "Self Assessment" },
  { slug: "vat", label: "VAT" },
  { slug: "payroll", label: "Payroll" },
  { slug: "making-tax-digital", label: "Making Tax Digital" },
  { slug: "r-and-d-tax-relief", label: "R&D Tax Relief" },
] as const;

export const footerNav = {
  services: [
    { label: "Outsourced financial operations", href: "/outsourced-financial-operations" },
    { label: "Accounting & compliance", href: "/accounting-and-compliance" },
    { label: "Groups of companies", href: "/groups-of-companies" },
    { label: "Startups", href: "/startups" },
    { label: "Pricing", href: "/pricing" },
  ],
  industries: industries.map((i) => ({ label: i.label, href: `/industries/${i.slug}` })),
  company: [
    { label: "Book a discovery call", href: "/book" },
    { label: "Instant quote", href: "/instant-quote" },
    { label: "Tools & calculators", href: "/tools" },
    { label: "Partner with us", href: "/partners" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms-of-service" },
  ],
};
