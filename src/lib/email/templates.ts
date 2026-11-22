import type { Estimate } from "@/lib/pricing/registry";
import type { ScopeSummary } from "@/lib/scoping/registry";
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

function scopeBlock(s: ScopeSummary): string {
  const items = s.items
    .map(
      (i) => `<tr><td style="padding:6px 12px 6px 0;color:#66605c;vertical-align:top;border-bottom:1px solid #eee;">${escapeHtml(i.label)}</td><td style="padding:6px 0;border-bottom:1px solid #eee;">${escapeHtml(i.value)}</td></tr>`,
    )
    .join("");
  return `<p style="margin:12px 0 6px;font-size:16px;color:#12233f;">${escapeHtml(s.headline)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:6px 0 12px;">${items}</table>
<p style="margin:12px 0 4px;font-weight:bold;color:#12233f;font-size:14px;">What we'd look after</p>
<ul style="margin:0 0 12px;padding-left:20px;font-size:14px;">${s.focus.map((f) => `<li style="margin:3px 0;">${escapeHtml(f)}</li>`).join("")}</ul>
<p style="margin:6px 0;font-size:13px;color:#66605c;">${escapeHtml(s.pricingNote)}</p>`;
}

const bookUrl = () => `${site.url}/book`;

const button = (href: string, label: string) =>
  `<p style="margin:22px 0;"><a href="${href}" style="display:inline-block;background:#12233f;color:#fff1e0;padding:12px 22px;text-decoration:none;font-size:14px;">${escapeHtml(label)}</a></p>`;

const row = (label: string, value: string) =>
  value
    ? `<tr><td style="padding:4px 12px 4px 0;color:#66605c;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`
    : "";

export function enquiryInternalEmail(args: {
  contact: ContactInput;
  sourceLabel: string;
  estimate?: Estimate;
  scope?: ScopeSummary;
  calculatorInputs?: unknown;
  reference: string;
  hasPdf?: boolean;
}): { subject: string; html: string } {
  const { contact, sourceLabel, estimate, scope } = args;
  const subject = `New enquiry ${args.reference} — ${sourceLabel} — ${contact.name}${contact.company ? ` (${contact.company})` : ""}`;
  const body = `<h1 style="font-size:20px;color:#12233f;margin:0 0 16px;">New website enquiry</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("Reference", args.reference)}${row("Page", sourceLabel)}${row("Name", contact.name)}${row("Email", contact.email)}${row("Phone", contact.phone)}${row("Company", contact.company)}
</table>
${contact.message ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Message</h2><p style="white-space:pre-wrap;margin:0;">${escapeHtml(contact.message)}</p>` : ""}
${estimate ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Calculator estimate (recalculated on the server)</h2>${estimateTable(estimate)}${estimate.manualPricing ? '<p style="color:#8c3d2b;font-size:13px;">Needs manual pricing — the customer was sent an acknowledgement only.</p>' : ""}` : ""}
${scope ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Scoping answers (validated on the server)</h2>${scopeBlock(scope)}` : ""}
${args.hasPdf ? '<p style="font-size:13px;color:#66605c;">The PDF sent to the customer is attached.</p>' : ""}
${args.calculatorInputs ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Calculator inputs</h2><pre style="font-size:12px;background:#f6e9d8;padding:12px;white-space:pre-wrap;">${escapeHtml(JSON.stringify(args.calculatorInputs, null, 2))}</pre>` : ""}`;
  return { subject, html: layout(subject, body) };
}

export function enquiryAcknowledgementEmail(args: {
  contact: ContactInput;
  sourceLabel: string;
  estimate?: Estimate;
  scope?: ScopeSummary;
  reference?: string;
  hasPdf?: boolean;
}): { subject: string; html: string } {
  const { contact, estimate, scope } = args;
  const firstName = contact.name.split(" ")[0];
  const subject = args.reference ? `Thanks for getting in touch — Reckonwell (${args.reference})` : "Thanks for getting in touch — Reckonwell";
  const estimateBlock =
    estimate && !estimate.manualPricing
      ? `<p>For reference, here is the indicative estimate you saw on our website for <strong>${escapeHtml(args.sourceLabel)}</strong>:</p>${estimateTable(estimate)}`
      : estimate?.manualPricing
        ? `<p>This service is priced individually, so we'll confirm the fee once we understand a little more about your business.</p>`
        : scope
          ? `<p>Here's a summary of what you told us about <strong>${escapeHtml(args.sourceLabel)}</strong>. We'll use it to prepare a tailored quote:</p>${scopeBlock(scope)}`
          : "";
  const body = `<p style="margin-top:0;">Hello ${escapeHtml(firstName)},</p>
<p>Thank you for your enquiry. We've received your details and someone from our team will be in touch shortly.</p>
${estimateBlock}
${args.hasPdf ? "<p>We've attached a PDF copy for your records. It is an indicative summary, not a binding offer.</p>" : ""}
<p>The quickest next step is a short discovery call at a time that suits you:</p>
${button(bookUrl(), "Book a discovery call")}
${args.reference ? `<p style="font-size:13px;color:#66605c;">Your reference: <strong>${escapeHtml(args.reference)}</strong></p>` : ""}
<p>If anything is urgent, call us on <a href="${site.phoneHref}" style="color:#275e86;">${escapeHtml(site.phone)}</a> or reply to this email.</p>
<p style="margin-bottom:0;">Kind regards,<br>The Reckonwell team</p>`;
  return { subject, html: layout(subject, body) };
}

export function partnerInternalEmail(p: PartnerInput, reference = ""): { subject: string; html: string } {
  const name = `${p.firstName} ${p.lastName}`;
  const subject = `New partner enquiry ${reference} — ${name} (${p.partnerType})`.replace("  ", " ");
  const body = `<h1 style="font-size:20px;color:#12233f;margin:0 0 16px;">New partner programme enquiry</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("Reference", reference)}${row("Name", name)}${row("Email", p.email)}${row("Phone", p.phone)}${row("Organisation", p.organisation)}${row("Partner type", p.partnerType)}
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


// ── Bookings ─────────────────────────────────────────────────────────────────

export type BookingEmailData = {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  enquiryType: string;
  message?: string;
  /** e.g. "Tuesday 14 July 2026 at 10:30 (BST)" */
  when: string;
  durationMinutes: number;
  location: string;
  meetingLink?: string;
};

export function bookingConfirmationEmail(b: BookingEmailData): { subject: string; html: string } {
  const subject = "Your Discovery Call with Reckonwell is Confirmed";
  const where = b.meetingLink
    ? `<a href="${escapeHtml(b.meetingLink)}" style="color:#275e86;">${escapeHtml(b.meetingLink)}</a>`
    : escapeHtml(b.location);
  const body = `<p style="margin-top:0;">Hello ${escapeHtml(b.name.split(" ")[0])},</p>
<p>Your discovery call is booked. We're looking forward to speaking with you.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px;margin:16px 0;background:#f6e9d8;padding:16px;width:100%;">
<tr><td style="padding:6px 16px 6px 16px;color:#66605c;">When</td><td style="padding:6px 16px 6px 0;"><strong>${escapeHtml(b.when)}</strong></td></tr>
<tr><td style="padding:6px 16px;color:#66605c;">Time zone</td><td style="padding:6px 16px 6px 0;">UK time (Europe/London)</td></tr>
<tr><td style="padding:6px 16px;color:#66605c;">Length</td><td style="padding:6px 16px 6px 0;">${b.durationMinutes} minutes</td></tr>
<tr><td style="padding:6px 16px;color:#66605c;">Where</td><td style="padding:6px 16px 6px 0;">${where}</td></tr>
<tr><td style="padding:6px 16px;color:#66605c;">Reference</td><td style="padding:6px 16px 6px 0;">${escapeHtml(b.reference)}</td></tr>
</table>
<p>A calendar invitation is attached. You may also receive an invitation from our calendar directly — both are for the same call.</p>
<p><strong>Need to change the time?</strong> Reply to this email or call us on <a href="${site.phoneHref}" style="color:#275e86;">${escapeHtml(site.phone)}</a> and we'll rearrange it.</p>
<p style="margin-bottom:0;">Kind regards,<br>The Reckonwell team</p>`;
  return { subject, html: layout(subject, body) };
}

export function bookingInternalEmail(b: BookingEmailData): { subject: string; html: string } {
  const subject = `New discovery call ${b.reference} — ${b.when} — ${b.name}`;
  const body = `<h1 style="font-size:20px;color:#12233f;margin:0 0 16px;">New discovery call booked</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("Reference", b.reference)}${row("When", b.when)}${row("Length", `${b.durationMinutes} minutes`)}${row("Where", b.meetingLink ?? b.location)}
${row("Name", b.name)}${row("Company", b.company ?? "")}${row("Email", b.email)}${row("Phone", b.phone ?? "")}${row("Enquiry type", b.enquiryType)}
</table>
${b.message ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Message</h2><p style="white-space:pre-wrap;margin:0;">${escapeHtml(b.message)}</p>` : ""}`;
  return { subject, html: layout(subject, body) };
}

export type BookingRequestData = Omit<BookingEmailData, "when" | "location" | "meetingLink" | "durationMinutes"> & {
  preferredDates: string[];
  timeOfDay: string;
};

export function bookingRequestAcknowledgementEmail(b: BookingRequestData): { subject: string; html: string } {
  const subject = "We've received your discovery call request — Reckonwell";
  const body = `<p style="margin-top:0;">Hello ${escapeHtml(b.name.split(" ")[0])},</p>
<p>Thank you for asking to speak with us. <strong>Your call is not booked yet</strong> — we'll reply by email to confirm a time from your preferences:</p>
<ul style="font-size:15px;">${b.preferredDates.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
<p>Preferred time of day: <strong>${escapeHtml(b.timeOfDay)}</strong> (UK time)</p>
<p style="font-size:13px;color:#66605c;">Your reference: <strong>${escapeHtml(b.reference)}</strong></p>
<p style="margin-bottom:0;">Kind regards,<br>The Reckonwell team</p>`;
  return { subject, html: layout(subject, body) };
}

export function bookingRequestInternalEmail(b: BookingRequestData): { subject: string; html: string } {
  const subject = `Discovery call REQUEST ${b.reference} — ${b.name} (please confirm a time)`;
  const body = `<h1 style="font-size:20px;color:#12233f;margin:0 0 16px;">Discovery call request — needs a time</h1>
<p style="color:#8c3d2b;">Live scheduling is not switched on, so this is a request. Please reply to the customer to confirm a time.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;">
${row("Reference", b.reference)}${row("Preferred dates", b.preferredDates.join("; "))}${row("Time of day", b.timeOfDay)}
${row("Name", b.name)}${row("Company", b.company ?? "")}${row("Email", b.email)}${row("Phone", b.phone ?? "")}${row("Enquiry type", b.enquiryType)}
</table>
${b.message ? `<h2 style="font-size:15px;color:#12233f;margin:20px 0 6px;">Message</h2><p style="white-space:pre-wrap;margin:0;">${escapeHtml(b.message)}</p>` : ""}`;
  return { subject, html: layout(subject, body) };
}
