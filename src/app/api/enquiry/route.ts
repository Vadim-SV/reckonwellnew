import { NextResponse } from "next/server";
import { labelForSource } from "@/content/labels";
import { enquiryAcknowledgementEmail, enquiryInternalEmail } from "@/lib/email/templates";
import { internalRecipient, sendEmail } from "@/lib/email/send";
import { enquirySchema, fieldErrors } from "@/lib/forms/schemas";
import { clientIp, rateLimited } from "@/lib/forms/rate-limit";
import { safeEstimate, type Estimate } from "@/lib/pricing/registry";
import { safeScope, type ScopeSummary } from "@/lib/scoping/registry";

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
  const { contact, source, calculator, website } = parsed.data;

  // Honeypot filled in: pretend success, send nothing.
  if (website) return NextResponse.json({ ok: true });

  // Never trust a price from the browser — recalculate from the inputs.
  // Scoping tools (services without approved pricing) are validated the same way.
  let estimate: Estimate | undefined;
  let scope: ScopeSummary | undefined;
  let calculatorInputs: unknown;
  if (calculator) {
    const result = safeEstimate(calculator.key, calculator.inputs);
    if (result.ok) {
      estimate = result.estimate;
      calculatorInputs = result.inputs;
    } else {
      const scoped = safeScope(calculator.key, calculator.inputs);
      if (scoped.ok) {
        scope = scoped.summary;
        calculatorInputs = scoped.inputs;
      }
    }
  }

  const sourceLabel = labelForSource(source);
  const internal = enquiryInternalEmail({ contact, sourceLabel, estimate, scope, calculatorInputs });
  const sent = await sendEmail({
    to: { email: internalRecipient(), name: "Reckonwell" },
    subject: internal.subject,
    html: internal.html,
    replyTo: { email: contact.email, name: contact.name },
  });
  if (!sent.ok) {
    console.error("[enquiry] internal email failed:", sent.reason);
    return NextResponse.json(
      { error: "Sorry, we couldn't send your enquiry. Please email vadim.s@reckonwell.com or call 020 3818 6205." },
      { status: 503 },
    );
  }

  const ack = enquiryAcknowledgementEmail({ contact, sourceLabel, estimate, scope });
  const ackSent = await sendEmail({ to: { email: contact.email, name: contact.name }, subject: ack.subject, html: ack.html });
  if (!ackSent.ok) console.error("[enquiry] acknowledgement failed:", ackSent.reason);

  return NextResponse.json({ ok: true });
}
