#!/usr/bin/env node
/**
 * SEO audit for a running build: every sitemap URL gets checked for title and
 * description length, a single H1, the canonical URL and structured data, and
 * duplicates are reported.
 *
 *   npm run build && npm run start   # in one terminal
 *   BASE_URL=http://localhost:3000 node scripts/seo-audit.mjs
 */
const base = process.env.BASE_URL ?? "http://localhost:3000";
const site = process.env.SITE_URL ?? "https://www.reckonwell.com";
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(site, "") || "/");
const seen = { title: new Map(), desc: new Map() };
let problems = 0;

for (const path of paths) {
  const html = await (await fetch(base + path)).text();
  const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
  const desc = decode(html.match(/name="description" content="([^"]*)"/)?.[1] ?? "");
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => {
    try { return JSON.parse(m[1])["@type"]; } catch { return "invalid"; }
  });
  const issues = [];
  if (title.length > 65) issues.push(`title ${title.length} chars`);
  if (desc.length < 70 || desc.length > 160) issues.push(`description ${desc.length} chars`);
  if (h1 !== 1) issues.push(`${h1} H1s`);
  const expected = site + (path === "/" ? "" : path);
  if (canonical.replace(/\/$/, "") !== expected.replace(/\/$/, "")) issues.push(`canonical ${canonical}`);
  if (ld.includes("invalid")) issues.push("invalid JSON-LD");
  for (const [k, v] of [["title", title], ["desc", desc]]) seen[k].set(v, [...(seen[k].get(v) ?? []), path]);
  problems += issues.length;
  console.log(`${issues.length ? "!!" : "ok"} ${path.padEnd(36)} ${title}${issues.length ? `\n   → ${issues.join("; ")}` : ""}   [${ld.join(", ")}]`);
}
for (const [k, map] of Object.entries(seen)) for (const [v, ps] of map) if (ps.length > 1) { problems++; console.log(`!! duplicate ${k}: "${v}" on ${ps.join(", ")}`); }
console.log(`\n${paths.length} pages checked, ${problems} issue(s).`);
process.exit(problems ? 1 : 0);
