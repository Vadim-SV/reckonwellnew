import { NextResponse } from "next/server";
import { labelForSource } from "@/content/labels";
import { enquiryAcknowledgementEmail, enquiryInternalEmail } from "@/lib/email/templates";
import { internalRecipient } from "@/lib/email/send";
import { deliver, pdfAttachment } from "@/lib/forms/deliver";
import { enquirySchema, fieldErrors } from "@/lib/forms/schemas";
import { clientIp, rateLimited } from "@/lib/forms/rate-limit";
import { buildEnquiryPdf } from "@/lib/pdf/estimate-pdf";
import { INSTANT_QUOTE_RATES } from "@/lib/pricing/instant-quote";
import { safeEstimate, type Estimate } from "@/lib/pricing/registry";
import { safeScope, type ScopeSummary } from "@/lib/scoping/registry";
import { getStore } from "@/lib/store";
import { makeReference } from "@/lib/store/reference";

/**
 * Enquiry (contact form, calculators, requirements tools, Instant Quote).
 *
 * 1. Validate and rate-limit.            5. Build the PDF (estimate or summary).
 * 2. Recalculate on the server.          6. Email Reckonwell (with PDF).
 * 3. Create a reference.                 7. Email the customer (PDF + booking link).
 * 4. Record the enquiry (idempotent).    8. Record each email's outcome.
 */
export async function POST(request: Request) {
  if (rateLimited(`enquiry:${clientIp(request.headers)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const { contact, source, calculator, website, idempotencyKey } = parsed.data;

  // Honeypot filled in: pretend success, do nothing.
  if (website) return NextResponse.json({ ok: true });

  // Never trust a price from the browser — recalculate (or re-summarise) from the inputs.
  let estimate: Estimate | undefined;
  let scope: ScopeSummary | undefined;
  let calculatorInputs: Record<string, unknown> | undefined;
  if (calculator) {
    const priced = safeEstimate(calculator.key, calculator.inputs);
    if (priced.ok) {
      estimate = priced.estimate;
      calculatorInputs = priced.inputs as Record<string, unknown>;
    } else {
      const scoped = safeScope(calculator.key, calculator.inputs);
      if (scoped.ok) {
        scope = scoped.summary;
        calculatorInputs = scoped.inputs as Record<string, unknown>;
      }
    }
  }

  const store = getStore();
  const sourceLabel = labelForSource(source);
  const saved = await store.saveEnquiry({
    reference: makeReference("RW"),
    idempotencyKey,
    kind: "enquiry",
    source,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    message: contact.message,
    calculatorKey: calculator?.key,
    calculatorInputs,
    result: estimate ?? scope,
  });
  // A repeated submission (double click, retry): don't send the emails again.
  if (saved.duplicate) return NextResponse.json({ ok: true, reference: saved.reference, duplicate: true });
  const reference = saved.reference;

  let pdf: Uint8Array | undefined;
  if (estimate || scope) {
    try {
      pdf = await buildEnquiryPdf({
        reference,
        issuedAt: new Date(),
        serviceLabel: sourceLabel,
        customer: { name: contact.name, email: contact.email, company: contact.company },
        estimate,
        scope,
        inputs: calculatorInputs,
        validDays: calculator?.key === "instant-quote" ? INSTANT_QUOTE_RATES.quoteValidityDays : undefined,
      });
    } catch (err) {
      console.error("[enquiry] PDF generation failed:", err instanceof Error ? err.message : err);
    }
  }
  const attachments = pdf ? [pdfAttachment(`Reckonwell-${reference}.pdf`, pdf)] : undefined;

  const internal = enquiryInternalEmail({ contact, sourceLabel, estimate, scope, calculatorInputs, reference, hasPdf: Boolean(pdf) });
  const internalStatus = await deliver({
    to: { email: internalRecipient(), name: "Reckonwell" },
    subject: internal.subject,
    html: internal.html,
    replyTo: { email: contact.email, name: contact.name },
    attachments,
    tag: "enquiry.internal",
  });
  await store.addEnquiryEmailStatus(reference, internalStatus).catch(() => {});

  if (!internalStatus.ok && store.kind === "none") {
    // Not recorded anywhere and not emailed: tell the visitor so the enquiry isn't lost.
    return NextResponse.json(
      { error: "Sorry, we couldn't send your enquiry. Please email vadim.s@reckonwell.com or call 020 3818 6205." },
      { status: 503 },
    );
  }

  const ack = enquiryAcknowledgementEmail({ contact, sourceLabel, estimate, scope, reference, hasPdf: Boolean(pdf) });
  const ackStatus = await deliver({ to: { email: contact.email, name: contact.name }, subject: ack.subject, html: ack.html, attachments, tag: "enquiry.customer" });
  await store.addEnquiryEmailStatus(reference, ackStatus).catch(() => {});

  return NextResponse.json({ ok: true, reference, emailed: ackStatus.ok });
}
