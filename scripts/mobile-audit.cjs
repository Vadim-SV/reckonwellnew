#!/usr/bin/env node
/**
 * Responsive audit: for every page at several widths, reports horizontal
 * overflow, elements poking past the screen edge, tap targets under 40px,
 * text under 12px (outside illustrations) and over-tall headings.
 *
 *   npm run build && npm run start          # in one terminal
 *   BASE_URL=http://localhost:3000 node scripts/mobile-audit.cjs [widths]
 *   e.g. node scripts/mobile-audit.cjs 320,375,390,414,768,1024,1440
 */
const { chromium } = require('playwright');
const pages = ['/', '/services', '/outsourced-financial-operations', '/bookkeeping-services', '/payroll-services', '/vat-returns', '/annual-accounts-ct600', '/self-assessment', '/making-tax-digital', '/r-and-d-tax-relief',
  '/services/accounts-payable', '/services/credit-control', '/services/management-accounts', '/services/month-end-close', '/services/accounting-systems', '/services/group-companies',
  '/industries', '/industries/technology', '/industries/ecommerce', '/industries/property', '/industries/manufacturing', '/industries/hospitality',
  '/startups', '/partners', '/instant-quote', '/book', '/contact', '/privacy-policy', '/terms-of-service', '/nope-404'];
const widths = (process.argv[2] || '320,375,390,414,768').split(',').map(Number);
(async () => {
  const b = await chromium.launch();
  const summary = {};
  for (const w of widths) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce', hasTouch: true, isMobile: w < 768 });
    const p = await ctx.newPage();
    for (const path of pages) {
      await p.goto((process.env.BASE_URL || 'http://localhost:3000') + path, { waitUntil: 'load' }); await p.waitForTimeout(250);
      const r = await p.evaluate((vw) => {
        const out = { overflow: document.documentElement.scrollWidth - vw, poking: [], smallTargets: [], tinyText: 0, tinyTextSamples: [], bigHeadings: [] };
        const clipped = (el) => { for (let a = el.parentElement; a; a = a.parentElement) { const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return true; } return false; };
        const label = (el) => (el.getAttribute('aria-label') || el.innerText || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
        for (const el of document.querySelectorAll('body *')) {
          const rc = el.getBoundingClientRect();
          if (!rc.width || !rc.height) continue;
          const st = getComputedStyle(el);
          if (st.visibility === 'hidden' || st.display === 'none' || el.closest('[aria-hidden="true"]') || el.closest('.sr-only')) continue;
          if ((rc.right > vw + 1 || rc.left < -1) && !clipped(el) && st.position !== 'fixed') out.poking.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} [${Math.round(rc.left)}→${Math.round(rc.right)}] "${label(el)}"`);
          if (el.matches('a[href], button, select, input:not([type=hidden]), textarea, [role=switch], summary, label:has(input[type=radio]), label:has(input[type=checkbox])')) {
            const inText = el.tagName === 'A' && el.closest('p, li span, label, address, footer p') && !el.className.includes('inline-flex');
            if (!inText && !el.closest('[role="img"]') && (rc.height < 40 || rc.width < 40) && !el.matches('input[type=checkbox]')) out.smallTargets.push(`${el.tagName.toLowerCase()} ${Math.round(rc.width)}×${Math.round(rc.height)} "${label(el)}"`);
          }
          if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !el.closest('[role="img"]')) {
            const fs = parseFloat(st.fontSize);
            if (fs < 12) { out.tinyText++; if (out.tinyTextSamples.length < 3) out.tinyTextSamples.push(`${fs}px "${el.textContent.trim().slice(0, 30)}"`); }
          }
          if (/^H[12]$/.test(el.tagName)) { const fs = parseFloat(st.fontSize); const lines = Math.round(rc.height / parseFloat(st.lineHeight || fs * 1.1)); if (lines > 6) out.bigHeadings.push(`${el.tagName} ${fs}px ${lines} lines "${label(el)}"`); }
        }
        out.poking = [...new Set(out.poking)].slice(0, 6); out.smallTargets = [...new Set(out.smallTargets)];
        return out;
      }, w);
      const issues = [];
      if (r.overflow > 0) issues.push(`PAGE OVERFLOW ${r.overflow}px`);
      if (r.poking.length) issues.push(`poking: ${r.poking.join(' | ')}`);
      if (r.smallTargets.length) issues.push(`small targets (${r.smallTargets.length}): ${r.smallTargets.slice(0, 8).join(' | ')}`);
      if (r.tinyText) issues.push(`tiny text x${r.tinyText}: ${r.tinyTextSamples.join(' | ')}`);
      if (r.bigHeadings.length) issues.push(`tall headings: ${r.bigHeadings.join(' | ')}`);
      if (issues.length) console.log(`[${w}] ${path}\n   - ${issues.join('\n   - ')}`);
      summary[w] = (summary[w] || 0) + issues.length;
    }
    await ctx.close();
  }
  console.log('summary issues per width', summary); await b.close();
  process.exit(Object.values(summary).some((n) => n > 0) ? 1 : 0);
})();
