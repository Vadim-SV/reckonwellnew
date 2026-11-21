import type { Estimate } from "@/lib/pricing/registry";
import type { ContactInput, PartnerInput } from "@/lib/forms/schemas";
import { site } from "@/lib/site";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);

const amountText = (a: number | string) => (typeof a === "number" ? (a < 0 ? `−${gbp(-a)}` : gbp(a)) : a);

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#fff1e0;font-family:Arial,Helvetica,sans-serif;color:#333;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff1e0;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid rgba(18,35,63,.12);">
<tr><td style="background:#12233f;padding:22px 28px;">
<img src="${site.url}/brand/reckonwell-logo-white.png" alt="Reckonwell" width="150" style="display:block;height:auto;border:0;">
</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6;">${body}</td></tr>
<tr><td style="padding:18px 28px;background:#f6e9d8;font-size:12px;color:#66605c;line-height:1.5;">
Reckonwell · ${escapeHtml(site.address.street)}, ${escapeHtml(site.address.locality)} ${escapeHtml(site.address.postcode)} · ${escapeHtml(site.phone)}
</td></tr>
</table></td></tr></table></body></html>`;
}

function estimateTable(e: Estimate): string {
  const rows = e.lines
    .map(
      (l) => `<tr>
<td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(l.label)}${
        l.note ? ` <span style="color:#66605c;font-size:13px;">(${escapeHtml(l.note)})</span>` : ""
      }</td>
<td style="padding:8px 0;border-bottom:1px solid #eee;color:#66605c;font-size:13px;">${l.period === "monthly" ? "per month" : "one-off"}</td>
<td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${escapeHtml(amountText(l.amount))}</td></tr>`,
    )
    .join("");
  const totals: string[] = [];
  if (e.monthlyRange) totals.push(`Monthly: <strong>${gbp(e.monthlyRange[0])}–${gbp(e.monthlyRange[1])}</strong>`);
  else if (e.monthly) totals.push(`Monthly: <strong>${gbp(e.monthly)}</strong>`);
  if (e.oneOff) totals.push(`One-off: <strong>${gbp(e.oneOff)}</strong>`);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:12px 0;">${rows}</table>
<p style="margin:12px 0;font-size:16px;color:#12233f;">${totals.join(" &nbsp;·&nbsp; ")}</p>
${e.notes.map((n) => `<p style="margin:6px 0;font-size:13px;color:#66605c;">${escapeHtml(n)}</p>`).join("")}`;
}

const row = (label: string, value: string) =>
  value
    ? `<tr><td style="padding:4px 12px 4px 0;color:#66605c;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`
    : "";

export function enquiryInternalEmail(args: {
  contact: ContactInput;
  sourceLabel: string;
  estimate?: Estimate;
  calculatorInputs?: unknown;
}): { subject: string; html: string } {
  const { contact, sourceLabel, estimate } = args;
  const subject = `New enquiry — ${sourceLabel} — ${contact.name}${contact.company ? ` (${contact.company})` : ""}`;
  const body = `<h1 style="font-size:20px;color:#12233f;margin:0 0 16px;">New website enquiry</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("Page", sourceLabel)}${row("Name", contact.name)}${row("Email", contact.email)}${row("Phone", contact.phone)}${row("Company", contact.company)}
</table>
${contact.message ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Message</h2><p style="white-space:pre-wrap;margin:0;">${escapeHtml(contact.message)}</p>` : ""}
${estimate ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Calculator estimate (recalculated on the server)</h2>${estimateTable(estimate)}${estimate.manualPricing ? '<p style="color:#8c3d2b;font-size:13px;">Needs manual pricing — the customer was sent an acknowledgement only.</p>' : ""}` : ""}
${args.calculatorInputs ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Calculator inputs</h2><pre style="font-size:12px;background:#f6e9d8;padding:12px;white-space:pre-wrap;">${escapeHtml(JSON.stringify(args.calculatorInputs, null, 2))}</pre>` : ""}`;
  return { subject, html: layout(subject, body) };
}

export function enquiryAcknowledgementEmail(args: {
  contact: ContactInput;
  sourceLabel: string;
  estimate?: Estimate;
}): { subject: string; html: string } {
  const { contact, estimate } = args;
  const firstName = contact.name.split(" ")[0];
  const subject = "Thanks for getting in touch — Reckonwell";
  const estimateBlock =
    estimate && !estimate.manualPricing
      ? `<p>For reference, here is the indicative estimate you saw on our website for <strong>${escapeHtml(args.sourceLabel)}</strong>:</p>${estimateTable(estimate)}`
      : estimate?.manualPricing
        ? `<p>This service is priced individually, so we'll confirm the fee once we understand a little more about your business.</p>`
        : "";
  const body = `<p style="margin-top:0;">Hello ${escapeHtml(firstName)},</p>
<p>Thank you for your enquiry. We've received your details and someone from our team will be in touch shortly.</p>
${estimateBlock}
<p>If anything is urgent, call us on <a href="${site.phoneHref}" style="color:#275e86;">${escapeHtml(site.phone)}</a> or reply to this email.</p>
<p style="margin-bottom:0;">Kind regards,<br>The Reckonwell team</p>`;
  return { subject, html: layout(subject, body) };
}

export function partnerInternalEmail(p: PartnerInput): { subject: string; html: string } {
  const name = `${p.firstName} ${p.lastName}`;
  const subject = `New partner enquiry — ${name} (${p.partnerType})`;
  const body = `<h1 style="font-size:20px;color:#12233f;margin:0 0 16px;">New partner programme enquiry</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("Name", name)}${row("Email", p.email)}${row("Phone", p.phone)}${row("Organisation", p.organisation)}${row("Partner type", p.partnerType)}
</table>
${p.message ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Message</h2><p style="white-space:pre-wrap;margin:0;">${escapeHtml(p.message)}</p>` : ""}`;
  return { subject, html: layout(subject, body) };
}

export function partnerAcknowledgementEmail(p: PartnerInput): { subject: string; html: string } {
  const subject = "Your Reckonwell partner enquiry";
  const body = `<p style="margin-top:0;">Hello ${escapeHtml(p.firstName)},</p>
<p>Thank you for your interest in partnering with Reckonwell. We review every enquiry personally and aim to reply within 48 hours to arrange a short call.</p>
<p style="margin-bottom:0;">Kind regards,<br>The Reckonwell team</p>`;
  return { subject, html: layout(subject, body) };
}
