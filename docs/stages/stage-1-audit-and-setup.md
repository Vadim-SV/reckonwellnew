# Stage 1: Repository audit and project setup

**Completed:** 21 November 2026 · **Branch:** `claude/intelligent-faraday-kb2332`

## What was done
1. **Repository audit:** `reckonwellnew` was empty (no commits), so I set up a new project.
2. **Live-site audit:** pages, brand tokens, assets, calculators, booking and integrations reviewed. See [`../website-audit.md`](../website-audit.md).
3. **Project setup:** Next.js 16.4.6 · React 19.3 · TypeScript · Tailwind CSS v4 · motion · zod · Vitest. `npm audit` reports 0 vulnerabilities. (The scaffolded Next 15.5.4 had a known critical RCE advisory, so it was upgraded.)
4. **Brand foundation:** colour and type tokens from the live CSS (`src/app/globals.css`); Newsreader + Work Sans via `next/font`; logos and trust badges in `public/`.
5. **Layout shell:** sticky header with mobile menu and skip link; footer with company details; branded 404.
6. **Foundation homepage:** hero, preserved trust strip, "what we look after" and the growth journey. This is a placeholder for Stage 3, not the final design.
7. **Design-system preview:** `/design-system` (noindex).
8. **Recovered pricing logic:** four calculators ported to `src/lib/pricing/` with unit tests. A fuzz test confirmed identical output to the live site's minified functions across 60,000 random inputs plus every MTD combination.
9. **SEO groundwork:** metadata template, `AccountingService` JSON-LD, `robots.txt` and `sitemap.xml` (noindex until production).
10. **Security headers:** `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; `X-Powered-By` removed.

## Verification

| Check | Result |
| --- | --- |
| `npm run lint` | ✅ pass |
| `npm run typecheck` | ✅ pass |
| `npm run test` | ✅ 10 tests pass |
| `npm run build` | ✅ 5 routes prerendered as static |
| Horizontal overflow at 390 / 1280 / 1440px | ✅ none |
| Reveal animation plays on scroll down and reverses on scroll up | ✅ |
| Reduced-motion and no-JavaScript visitors see all content | ✅ |

**Expected console noise:** navigation links to pages from later stages (e.g. `/pricing`) return 404 when Next.js prefetches them. This goes away as each stage adds its pages.

## Not done in Stage 1 (by design)
Page redesigns, illustrations, calculators UI, booking, emails, PDF quotes and redirects follow the stage plan in [`../project-plan.md`](../project-plan.md).
