import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { footerNav, primaryNav, serviceNavGroups } from "@/lib/navigation";
import { site } from "@/lib/site";

const APP = join(process.cwd(), "src", "app");

/** Every route that has a page.tsx, with dynamic segments expanded from content. */
function knownRoutes(): Set<string> {
  const routes = new Set<string>();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "page.tsx") {
        const route = "/" + relative(APP, dir).split(sep).filter((seg) => seg && !seg.startsWith("(")).join("/");
        routes.add(route === "/" ? "/" : route.replace(/\/$/, ""));
      }
    }
  };
  walk(APP);
  const expanded = new Set<string>();
  for (const r of routes) {
    if (r === "/services/[slug]") services.filter((s) => s.href.startsWith("/services/")).forEach((s) => expanded.add(s.href));
    else if (r === "/industries/[slug]") industries.forEach((i) => expanded.add(`/industries/${i.slug}`));
    else expanded.add(r);
  }
  return expanded;
}

const routes = knownRoutes();
const path = (href: string) => href.split("#")[0] || "/";

describe("internal links", () => {
  it("every service href has a page", () => {
    for (const s of services) expect(routes, s.href).toContain(s.href);
  });

  it("service hrefs and slugs are unique", () => {
    expect(new Set(services.map((s) => s.href)).size).toBe(services.length);
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length);
  });

  it("related services and industry services all exist", () => {
    const slugs = new Set(services.map((s) => s.slug));
    for (const s of services) for (const r of s.related) expect(slugs, `${s.slug} → ${r}`).toContain(r);
    for (const i of industries) for (const r of i.services) expect(slugs, `${i.slug} → ${r}`).toContain(r);
  });

  it("navigation and footer links resolve", () => {
    const links = [
      ...primaryNav.flatMap((n) => [n.href, ...(n.children ?? []).map((c) => c.href), ...(n.groups ?? []).flatMap((g) => g.links.map((l) => l.href))]),
      ...Object.values(footerNav).flat().map((l) => l.href),
    ];
    for (const href of links) expect(routes, href).toContain(path(href));
  });

  it("services menu has the three groups and includes the new pages", () => {
    expect(serviceNavGroups.map((g) => g.title)).toEqual(["Financial operations", "Accounting & compliance", "Business support"]);
    const all = serviceNavGroups.flatMap((g) => g.links.map((l) => l.href));
    for (const href of [
      "/services/accounts-payable",
      "/services/credit-control",
      "/services/management-accounts",
      "/services/month-end-close",
      "/services/accounting-systems",
      "/services/group-companies",
      "/startups",
    ])
      expect(all).toContain(href);
    expect(new Set(all).size).toBe(all.length);
  });

  it("every sitemap URL is a real page", () => {
    for (const entry of sitemap()) expect(routes, entry.url).toContain(entry.url.replace(site.url, "") || "/");
  });
});
