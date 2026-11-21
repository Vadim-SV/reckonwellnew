import { NextResponse } from "next/server";
import { partnerAcknowledgementEmail, partnerInternalEmail } from "@/lib/email/templates";
import { internalRecipient, sendEmail } from "@/lib/email/send";
import { fieldErrors, partnerSchema } from "@/lib/forms/schemas";
import { clientIp, rateLimited } from "@/lib/forms/rate-limit";

export async function POST(request: Request) {
  if (rateLimited(`partner:${clientIp(request.headers)}`)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  const internal = partnerInternalEmail(data);
  const sent = await sendEmail({
    to: { email: internalRecipient(), name: "Reckonwell" },
    subject: internal.subject,
    html: internal.html,
    replyTo: { email: data.email, name: `${data.firstName} ${data.lastName}` },
  });
  if (!sent.ok) {
    console.error("[partner] internal email failed:", sent.reason);
    return NextResponse.json(
      { error: "Sorry, we couldn't send your enquiry. Please email vadim.s@reckonwell.com." },
      { status: 503 },
    );
  }

  const ack = partnerAcknowledgementEmail(data);
  const ackSent = await sendEmail({ to: { email: data.email, name: data.firstName }, subject: ack.subject, html: ack.html });
  if (!ackSent.ok) console.error("[partner] acknowledgement failed:", ackSent.reason);

  return NextResponse.json({ ok: true });
}
