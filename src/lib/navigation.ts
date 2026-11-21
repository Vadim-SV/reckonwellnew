import { industries } from "@/content/industries";
import { services } from "@/content/services";

export type NavLink = { label: string; href: string; description?: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const primaryNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({ label: s.name, href: `/${s.slug}`, description: s.summary })),
  },
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
  quote: { label: "Instant quote", href: "/instant-quote" },
  partner: { label: "Partner with us", href: "/partners" },
} as const;

export const footerNav = {
  services: services.map((s) => ({ label: s.name, href: `/${s.slug}` })),
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
