# Reckonwell design system

The aim is a premium, modern and trustworthy look that stays recognisably Reckonwell. The live site's palette and type are kept; the new layer adds depth, data visualisation and motion.

**Implementation:** tokens live in `src/app/globals.css` (Tailwind v4 `@theme`), so every token is available as a utility (e.g. `bg-navy`, `text-muted`, `rounded-card`). There is a live preview at **`/design-system`** (not indexed).

---

## 1. Principles

1. **Calm confidence.** Plenty of cream space, a serif display face and few colours on a page. The finance should feel under control.
2. **Show the work.** Illustrations depict real tasks: invoices, reconciliations, payment runs, reports. No abstract blobs or stock photos of handshakes.
3. **Motion explains.** Every animation reveals a step in a process or a piece of information. Nothing moves only to decorate.
4. **Plain British English.** Write as a sensible accountant would speak to a busy founder.
5. **Accessible by default.** WCAG 2.2 AA contrast, keyboard navigation, reduced-motion support, and content that never depends on JavaScript to be visible.

---

## 2. Colour

### 2.1 Brand palette (verified from the live CSS)

| Token | Hex | Use | Contrast on cream |
| --- | --- | --- | --- |
| `navy` | `#12233f` | Primary: buttons, emphasis, dark sections | 14.1 : 1 |
| `navy-deep` | `#0b172b` | Hover / pressed | — |
| `steel` | `#275e86` | Secondary accent, links, focus ring, charts | 6.2 : 1 |
| `cream` | `#fff1e0` | Page background | — |
| `sand` | `#f6e9d8` | Alternate section background | — |
| `oat` | `#e9decf` | Deeper surface, table stripes | — |
| `mist` | `#e3e7ed` | Cool tint panel, chips | — |
| `haze` | `#e4eaef` | Cool tint variant | — |
| `ink` | `#000000` | Headings, footer background | 18.9 : 1 |
| `body` | `#333333` | Body copy | 11.4 : 1 |
| `muted` | `#66605c` | Secondary text, labels | 5.6 : 1 |
| `subtle` | `#8a8378` | **Large text and decoration only** | 3.4 : 1 ⚠ |
| `positive` | `#2d6a4f` | Reconciled, paid, on track | 5.8 : 1 |
| `negative` | `#8c3d2b` | Overdue, variance, risk | 6.7 : 1 |
| `rose` | `#d69aab` | Link hover on black (footer) | 9.1 : 1 on black |
| `slate-blue` | `#4a6fa5` | Supporting chart blue | 4.6 : 1 |

### 2.2 Derived tints (for illustrations and charts)
`navy-80 #2a3a55` · `navy-60 #59657a` · `steel-light #8fb3cf` · `positive-light #cfe5d9` · `negative-light #efd5ce`

### 2.3 Proportions
Roughly **70% cream/sand, 20% navy/ink, 10% accents.** Green and red are reserved for status: paid, reconciled, overdue. They are never decorative.

### 2.4 Data visualisation order
1. navy · 2. steel · 3. steel-light · 4. slate-blue · 5. oat. Use positive and negative only for meaning.

---

## 3. Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display (`font-display`) | **Newsreader** | Weight 400, tight tracking (-0.015em). Italic in navy for the emphasised half of a headline, as on the live site. |
| Body and UI (`font-sans`) | **Work Sans** | 16–18px body, 1.6 line height |
| Numbers | Newsreader or Work Sans with `.tabular` | Tabular figures for prices and tables |
| Eyebrow | Work Sans 11px, uppercase, 0.18em tracking, `muted` | Section labels |

Type scale (mobile → desktop): H1 48 → 72px · H2 36 → 48px · H3 24 → 30px · Body 16 → 18px · Small 14px.

Both fonts are self-hosted via `next/font`: no layout shift and no request to Google from the browser.

---

## 4. Layout, shape and depth
- **Container:** `max-w-7xl` with 16 / 24 / 32px gutters (`<Container>`). Narrow (`max-w-3xl`) for long-form text.
- **Section rhythm:** `<Section spacing="sm|md|lg">`, which gives 48–128px vertical padding, with tones `cream | sand | mist | navy | ink`.
- **Radius:** `rounded-xs` (2px) for buttons and inputs, keeping the live site's crisp feel. `rounded-card` (10px) and `rounded-panel` (18px) are for the new illustration panels and dashboards.
- **Elevation:** `shadow-card` (subtle, navy-tinted) and `shadow-float` (illustration cards floating over the page).
- **Borders:** a 1px hairline at navy 15% (`border-hairline`).

---

## 5. Motion

| Setting | Value |
| --- | --- |
| Library | `motion` (Framer Motion), imported from `motion/react` |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out-soft`) |
| Durations | 150–250ms for UI feedback · 600–800ms for reveals · 6–20s for ambient loops |
| Entrance | 16–24px rise and fade |
| Scroll behaviour | Reveals **reverse when scrolled back up** (`viewport.once = false`). Hero-scale illustrations use scroll-linked progress (`useScroll` + `useTransform`), so they follow the scroll exactly in both directions. |
| Ambient | Very slow loops: a tick appearing on a reconciled line, a cursor moving across an invoice. These pause when off-screen. |

**Rules**
- Above-the-fold content uses the CSS-only `.rise` class, so it never waits for JavaScript (better LCP).
- `<Reveal>` content is marked `data-reveal`. CSS forces it visible under `prefers-reduced-motion: reduce` and for visitors without JavaScript.
- Under reduced motion, loops stop and scroll-linked scenes show their final, fully explained state.
- Never animate layout properties (width, height, top). Use `transform` and `opacity` only.

---

## 6. Illustration system (built in Stage 3)

All illustrations are **code-drawn SVG and HTML "UI fragments"** in brand colours, not raster images. They stay crisp, small and easy to animate, and they can show realistic (fictional) numbers.

| Scene | What it shows | Scroll behaviour |
| --- | --- | --- |
| Invoice flow | An invoice card is captured, coded and approved | Fields fill in as you scroll |
| Bank reconciliation | Bank lines slide across to match ledger entries and turn green | Lines match one by one; unmatch on scroll up |
| Supplier payment run | Bills grouped into a payment batch, approved, then paid | Status chips advance |
| Credit control | Aged debtors chart; overdue invoices get reminders and move to paid | Bars shrink over time |
| Management reporting | P&L and cash dashboard assembling from tiles | Tiles assemble |
| Group structure | Parent with subsidiaries; intercompany lines and consolidation | Branches draw in |

Each scene is a reusable component under `src/components/illustrations/`. Each has a static fallback and an accessible text description (`role="img"` + `aria-label`).

---

## 7. Components

| Component | Status | File |
| --- | --- | --- |
| `Container`, `Section`, `Eyebrow` | ✅ Stage 1 | `src/components/ui/` |
| `Button`, `ButtonLink` (primary, secondary, light, ghost; sm/md/lg) | ✅ Stage 1 | `src/components/ui/Button.tsx` |
| `Reveal` (scroll reveal, reversible, accessible) | ✅ Stage 1 | `src/components/motion/Reveal.tsx` |
| `SiteHeader` (sticky, blur on scroll, mobile menu, skip link) | ✅ Stage 1 (full mega-menu in Stage 2) | `src/components/layout/` |
| `SiteFooter` | ✅ Stage 1 | `src/components/layout/` |
| `TrustStrip` | ✅ Stage 1 | `src/components/trust/` |
| Mega-menu, breadcrumbs, FAQ accordion, cards, stat, CTA band, form fields, stepper, segmented control, slider, toast | Stage 2 | — |
| Illustration scenes | Stage 3 | — |
| Calculator shell, live result summary, quote breakdown | Stage 6 | — |
| Booking calendar and slot picker | Stage 7 | — |

---

## 8. Voice and tone

**Core message:** *We look after the financial side of growing businesses. We handle bookkeeping, reporting and day-to-day financial work so our clients can focus on running their companies.*

| Do | Don't |
| --- | --- |
| "We reconcile your bank accounts every week." | "We leverage cutting-edge solutions to optimise your financial workflows." |
| "Your suppliers get paid on time." | "Seamless end-to-end AP orchestration." |
| "You'll get a short report each month showing profit, cash and what's owed to you." | "Actionable, data-driven insights." |
| Use British spelling: organise, colour, programme, cheque | Use American spelling |
| Explain a term the first time: "accounts payable (the bills you owe)" | Stack jargon: "AP/AR, accruals, prepayments, KPIs" |

Words to avoid: *leverage, seamless, cutting-edge, empower, unlock, game-changing, world-class, revolutionise, synergy, robust solution.*

Prices are always shown in **£ with commas** (e.g. £1,250) and state whether they are monthly or one-off and whether VAT is included.

---

## 9. Logo usage
- Black wordmark on cream or light backgrounds; white wordmark on navy or black.
- Minimum height 24px; clear space at least the height of the "R".
- Never recolour, stretch or add effects. An SVG master has been requested (see `website-audit.md` §4.3).
