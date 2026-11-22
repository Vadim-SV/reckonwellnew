import { industries } from "./industries";
import { services } from "./services";

/** Human-readable name for the page an enquiry came from. */
export function labelForSource(source: string): string {
  const fixed: Record<string, string> = {
    home: "Home page",
    contact: "Contact page",
    "instant-quote": "Instant quote",
    partners: "Partner programme",
    startups: "Startups (Founder's Launch Offer)",
  };
  if (fixed[source]) return fixed[source];
  const service = services.find((s) => s.slug === source);
  if (service) return service.name;
  const industry = industries.find((i) => `industries/${i.slug}` === source);
  if (industry) return `${industry.name} (industry page)`;
  return source || "Website";
}
