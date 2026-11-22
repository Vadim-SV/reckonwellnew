import { industries } from "@/content/industries";
import { serviceGroups, services } from "@/content/services";

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavItem = NavLink & { children?: NavLink[]; groups?: NavGroup[] };

const startups: NavLink = { label: "Startups", href: "/startups", description: "Founder's Launch Offer for new businesses." };

/** Services grouped for menus; Startups sits under Business Support. */
export const serviceNavGroups: NavGroup[] = serviceGroups.map((g) => ({
  title: g.title,
  links: [
    ...services.filter((s) => s.category === g.key).map((s) => ({ label: s.name, href: s.href, description: s.summary })),
    ...(g.key === "support" ? [startups] : []),
  ],
}));

export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services", groups: serviceNavGroups },
  {
    label: "Industries",
    href: "/industries",
    children: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}`, description: i.summary })),
  },
  { label: "Instant quote", href: "/instant-quote" },
  { label: "Partner with us", href: "/partners" },
];

export const ctaNav = {
  contact: { label: "Get in touch", href: "/contact" },
  book: { label: "Book a discovery call", href: "/book" },
  quote: { label: "Instant quote", href: "/instant-quote" },
  partner: { label: "Partner with us", href: "/partners" },
} as const;

export const footerNav = {
  operations: [...serviceNavGroups[0].links, ...serviceNavGroups[2].links].map(({ label, href }) => ({ label, href })),
  compliance: serviceNavGroups[1].links.map(({ label, href }) => ({ label, href })),
  industries: industries.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
  company: [
    { label: "Get in touch", href: "/contact" },
    { label: "Instant quote", href: "/instant-quote" },
    { label: "Partner with us", href: "/partners" },
    { label: "All services", href: "/services" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms-of-service" },
  ],
};
