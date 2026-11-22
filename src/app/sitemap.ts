import type { MetadataRoute } from "next";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  });
  return [
    entry("/", 1),
    entry("/services", 0.8),
    ...services.map((s) => entry(s.href, 0.9)),
    entry("/startups", 0.8),
    entry("/industries", 0.7),
    ...industries.map((i) => entry(`/industries/${i.slug}`, 0.8)),
    entry("/instant-quote", 0.8),
    entry("/partners", 0.6),
    entry("/contact", 0.6),
    entry("/privacy-policy", 0.2),
    entry("/terms-of-service", 0.2),
  ];
}
