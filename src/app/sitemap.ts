import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Only routes that exist are listed. Each stage adds its pages here
 * (Stage 8 will generate this from the route/content registry).
 */
const liveRoutes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return liveRoutes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
