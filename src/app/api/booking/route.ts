import { NextResponse } from "next/server";
import { getCalendar } from "@/lib/booking/calendar";
import { BOOKING } from "@/lib/booking/config";
import { buildIcs } from "@/lib/booking/ics";
import { clearAvailabilityCache, meetingLocation, requestDays, slotStillFree } from "@/lib/booking/service";
import { isValidSlotStart } from "@/lib/booking/slots";
import { describeSlot, formatLondon } from "@/lib/booking/time";
import {
  bookingConfirmationEmail,
  bookingInternalEmail,
  bookingRequestAcknowledgementEmail,
  bookingRequestInternalEmail,
} from "@/lib/email/templates";
import { internalRecipient } from "@/lib/email/send";
import { deliver } from "@/lib/forms/deliver";
import { anyBookingSchema, fieldErrors } from "@/lib/forms/schemas";
import { clientIp, rateLimited } from "@/lib/forms/rate-limit";
import { site } from "@/lib/site";
import { getStore } from "@/lib/store";
import { makeReference } from "@/lib/store/reference";

const error = (message: string, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error: message, ...extra }, { status });

export async function POST(request: Request) {
  if (rateLimited(`booking:${clientIp(request.headers)}`, 6)) return error("Too many requests. Please try again later.", 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request.", 400);
  }
  const parsed = anyBookingSchema.safeParse(body);
  if (!parsed.success) return error("Please check the form.", 422, { fields: fieldErrors(parsed.error) });
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  const store = getStore();
  const now = new Date();

  // ── Request mode: no live calendar ───────────────────────────────────────────
  if (data.mode === "request") {
    const allowed = new Set(requestDays(now));
    if (!data.preferredDates.every((d) => allowed.has(d))) return error("Please choose from the available days.", 422);
    const saved = await store.saveEnquiry({
      reference: makeReference("RWB"),
      idempotencyKey: data.idempotencyKey,
      kind: "booking-request",
      source: "book",
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      result: { preferredDates: data.preferredDates, timeOfDay: data.timeOfDay, enquiryType: data.enquiryType },
    });
    if (saved.duplicate) return NextResponse.json({ ok: true, mode: "request", reference: saved.reference, duplicate: true });

    const pretty = data.preferredDates.map((d) => {
      const [y, m, day] = d.split("-").map(Number);
      return formatLondon(new Date(Date.UTC(y, m - 1, day, 12)), { weekday: "long", day: "numeric", month: "long" }).replace(",", "");
    });
    const emailData = { reference: saved.reference, ...data, preferredDates: pretty };
    const internal = bookingRequestInternalEmail(emailData);
    const internalStatus = await deliver({
      to: { email: internalRecipient(), name: "Reckonwell" },
      subject: internal.subject,
      html: internal.html,
      replyTo: { email: data.email, name: data.name },
      tag: "booking-request.internal",
    });
    await store.addEnquiryEmailStatus(saved.reference, internalStatus).catch(() => {});
    if (!internalStatus.ok && store.kind === "none") {
      return error("Sorry, we couldn't send your request. Please call 020 3818 6205 or email vadim.s@reckonwell.com.", 503);
    }
    const ack = bookingRequestAcknowledgementEmail(emailData);
    const ackStatus = await deliver({ to: { email: data.email, name: data.name }, subject: ack.subject, html: ack.html, tag: "booking-request.customer" });
    await store.addEnquiryEmailStatus(saved.reference, ackStatus).catch(() => {});
    return NextResponse.json({ ok: true, mode: "request", reference: saved.reference, emailed: ackStatus.ok });
  }

  // ── Live mode: real calendar slot ────────────────────────────────────────────
  const calendar = getCalendar();
  if (!calendar) return error("Live booking isn't available right now. Please request a call instead.", 409, { fallback: "request" });

  const start = new Date(data.slotStart);
  if (!isValidSlotStart(start, now)) return error("That time isn't available. Please choose another.", 422, { retry: true });
  const end = new Date(start.getTime() + BOOKING.durationMinutes * 60_000);

  const reserved = await store.reserveBooking({
    reference: makeReference("RWB"),
    idempotencyKey: data.idempotencyKey,
    slotStart: start,
    slotEnd: end,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    enquiryType: data.enquiryType,
    message: data.message,
  });
  if (reserved.status === "taken") return error("Sorry — that time has just been taken. Please choose another.", 409, { retry: true });
  if (reserved.status === "duplicate") {
    const b = reserved.booking;
    if (b.status === "confirmed")
      return NextResponse.json({ ok: true, mode: "live", reference: b.reference, when: describeSlot(b.slotStart), meetingLink: b.meetingLink, duplicate: true });
    if (b.status === "pending") return error("We're still confirming this booking. Please wait a moment.", 409);
    return error("That booking didn't go through. Please choose a time again.", 409, { retry: true });
  }
  const { reference } = reserved.booking;

  try {
    if (!(await slotStillFree(calendar, { start, end }))) {
      await store.failBooking(reference);
      return error("Sorry — that time has just been taken. Please choose another.", 409, { retry: true });
    }
    const description = [
      `Discovery call booked through ${site.url.replace(/^https?:\/\//, "")}.`,
      `Reference: ${reference}`,
      `Enquiry: ${data.enquiryType}`,
      data.company ? `Company: ${data.company}` : "",
      data.phone ? `Phone: ${data.phone}` : "",
      data.message ? `\nMessage:\n${data.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const created = await calendar.createEvent({
      slotStart: start,
      slotEnd: end,
      summary: `${BOOKING.meetingLabel} — ${data.name}${data.company ? ` (${data.company})` : ""}`,
      description,
      attendee: { email: data.email, name: data.name },
      location: process.env.BOOKING_LOCATION,
    });
    if (!created.ok) {
      await store.failBooking(reference);
      return created.reason === "conflict"
        ? error("Sorry — that time has just been taken. Please choose another.", 409, { retry: true })
        : error("We couldn't create the booking. Please try again or request a call instead.", 502, { retry: true });
    }
    await store.confirmBooking(reference, created.event.eventId, created.event.meetingLink);
    clearAvailabilityCache();

    // Emails only after the appointment exists in the calendar.
    const when = describeSlot(start);
    const location = meetingLocation(created.event.meetingLink, data.phone);
    const emailData = { reference, ...data, when, durationMinutes: BOOKING.durationMinutes, location, meetingLink: created.event.meetingLink };
    const ics = buildIcs({
      uid: created.event.iCalUID,
      start,
      end,
      summary: BOOKING.meetingLabel,
      description: `Reference ${reference}. ${location}`,
      location,
      organizer: { name: "Reckonwell", email: internalRecipient() },
      attendee: { name: data.name, email: data.email },
    });
    const icsAttachment = { filename: "Reckonwell-discovery-call.ics", content: Buffer.from(ics).toString("base64"), contentType: "text/calendar" };

    const confirmation = bookingConfirmationEmail(emailData);
    const customerStatus = await deliver({
      to: { email: data.email, name: data.name },
      subject: confirmation.subject,
      html: confirmation.html,
      attachments: [icsAttachment],
      tag: "booking.customer",
    });
    const internal = bookingInternalEmail(emailData);
    const internalStatus = await deliver({
      to: { email: internalRecipient(), name: "Reckonwell" },
      subject: internal.subject,
      html: internal.html,
      replyTo: { email: data.email, name: data.name },
      tag: "booking.internal",
    });
    await store.addBookingEmailStatus(reference, customerStatus).catch(() => {});
    await store.addBookingEmailStatus(reference, internalStatus).catch(() => {});

    return NextResponse.json({ ok: true, mode: "live", reference, when, meetingLink: created.event.meetingLink, emailed: customerStatus.ok });
  } catch (err) {
    console.error("[booking] failed:", err instanceof Error ? err.message : err);
    await store.failBooking(reference).catch(() => {});
    return error("We couldn't create the booking. Please try again or request a call instead.", 502, { retry: true });
  }
}
