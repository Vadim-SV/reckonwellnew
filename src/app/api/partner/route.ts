import { NextResponse } from "next/server";
import { partnerAcknowledgementEmail, partnerInternalEmail } from "@/lib/email/templates";
import { internalRecipient } from "@/lib/email/send";
import { deliver } from "@/lib/forms/deliver";
import { fieldErrors, partnerSchema } from "@/lib/forms/schemas";
import { clientIp, rateLimited } from "@/lib/forms/rate-limit";
import { getStore } from "@/lib/store";
import { makeReference } from "@/lib/store/reference";

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

  const store = getStore();
  const saved = await store.saveEnquiry({
    reference: makeReference("RWP"),
    idempotencyKey: data.idempotencyKey,
    kind: "partner",
    source: "partners",
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: data.phone,
    company: data.organisation,
    message: data.message,
    result: { partnerType: data.partnerType },
  });
  if (saved.duplicate) return NextResponse.json({ ok: true, reference: saved.reference, duplicate: true });
  const reference = saved.reference;

  const internal = partnerInternalEmail(data, reference);
  const internalStatus = await deliver({
    to: { email: internalRecipient(), name: "Reckonwell" },
    subject: internal.subject,
    html: internal.html,
    replyTo: { email: data.email, name: `${data.firstName} ${data.lastName}` },
    tag: "partner.internal",
  });
  await store.addEnquiryEmailStatus(reference, internalStatus).catch(() => {});
  if (!internalStatus.ok && store.kind === "none") {
    return NextResponse.json({ error: "Sorry, we couldn't send your enquiry. Please email vadim.s@reckonwell.com." }, { status: 503 });
  }

  const ack = partnerAcknowledgementEmail(data);
  const ackStatus = await deliver({ to: { email: data.email, name: data.firstName }, subject: ack.subject, html: ack.html, tag: "partner.customer" });
  await store.addEnquiryEmailStatus(reference, ackStatus).catch(() => {});

  return NextResponse.json({ ok: true, reference });
}
