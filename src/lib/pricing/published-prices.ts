/**
 * "From" prices published in the original site's copy (reckonwell-main,
 * captured 5 Oct 2026 and matching the live site on 21 Nov 2026).
 * `consistentWithCalculator` records whether a calculator actually produces
 * that minimum. Items marked false need a decision before the Pricing page
 * (Stage 6) — see docs/pricing-rules.md §8.
 */
export type PublishedPrice = {
  service: string;
  display: string;
  amount: number;
  basis: "monthly" | "one-off" | "per-employee-monthly";
  source: string;
  consistentWithCalculator: boolean | null;
  comment?: string;
};

export const PUBLISHED_PRICES: PublishedPrice[] = [
  {
    service: "Self-employed accounting / Self Assessment",
    display: "From £80/month",
    amount: 80,
    basis: "monthly",
    source: "services/page.tsx, self-assessment/page.tsx",
    consistentWithCalculator: true,
    comment: "Self Assessment calculator minimum is £80/month.",
  },
  {
    service: "Limited company accounting",
    display: "From £150/month",
    amount: 150,
    basis: "monthly",
    source: "services/page.tsx",
    consistentWithCalculator: false,
    comment: "CT600 calculator minimum is £200/month (£150 base + £50 director salary planning, always added).",
  },
  {
    service: "Bookkeeping",
    display: "From £150/month",
    amount: 150,
    basis: "monthly",
    source: "bookkeeping-services/page.tsx",
    consistentWithCalculator: null,
    comment: "Instant Quote charges £2 per transaction, so £150 corresponds to 75 transactions a month.",
  },
  {
    service: "Making Tax Digital",
    display: "From £34/month",
    amount: 34,
    basis: "monthly",
    source: "services/page.tsx, AdditionalServicesSection.tsx",
    consistentWithCalculator: false,
    comment: "MTD calculator minimum is £100/month; London page copy also says 'From £100/mo'. MTD section copy says £300/month.",
  },
  {
    service: "Fractional finance",
    display: "From £200/month",
    amount: 200,
    basis: "monthly",
    source: "services/page.tsx, AdditionalServicesSection.tsx",
    consistentWithCalculator: null,
    comment: "Fractional finance page also says 'All included — £1,000/month flat'.",
  },
  {
    service: "Payroll",
    display: "From £40/employee",
    amount: 40,
    basis: "per-employee-monthly",
    source: "services/page.tsx, limited-company-accounting/page.tsx",
    consistentWithCalculator: false,
    comment: "Matches the CT600 calculator (£40). Instant Quote uses £3 and the comparison calculator uses £6.",
  },
  {
    service: "R&D tax relief claim",
    display: "From £850 one-off",
    amount: 850,
    basis: "one-off",
    source: "services/page.tsx",
    consistentWithCalculator: true,
    comment: "R&D fee calculator: £950 − £100 first-time discount. Instant Quote charges £300 + 5% success fee.",
  },
  {
    service: "Company formation",
    display: "From £299",
    amount: 299,
    basis: "one-off",
    source: "company-formation/page.tsx",
    consistentWithCalculator: null,
    comment: "No calculator rule exists; the page links to the Instant Quote, which has no formation item.",
  },
];
