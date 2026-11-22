import type { BookingInput, BookingRecord, EmailStatus, EnquiryRecord, ReserveResult, Store } from "./types";

/** In-memory store for development and tests. Not durable; one per server instance. */
export class MemoryStore implements Store {
  readonly kind = "memory" as const;
  enquiries = new Map<string, EnquiryRecord & { emails: EmailStatus[] }>();
  bookings = new Map<string, BookingRecord>();

  async saveEnquiry(record: EnquiryRecord) {
    if (record.idempotencyKey) {
      for (const e of this.enquiries.values()) {
        if (e.idempotencyKey === record.idempotencyKey) return { duplicate: true, reference: e.reference };
      }
    }
    this.enquiries.set(record.reference, { ...record, emails: [] });
    return { duplicate: false, reference: record.reference };
  }
  async addEnquiryEmailStatus(reference: string, status: EmailStatus) {
    this.enquiries.get(reference)?.emails.push(status);
  }
  async reserveBooking(input: BookingInput): Promise<ReserveResult> {
    for (const b of this.bookings.values()) {
      if (b.idempotencyKey === input.idempotencyKey) return { status: "duplicate", booking: b };
    }
    for (const b of this.bookings.values()) {
      if (b.status !== "failed" && b.slotStart.getTime() === input.slotStart.getTime()) return { status: "taken" };
    }
    const booking: BookingRecord = { ...input, status: "pending", emails: [] };
    this.bookings.set(input.reference, booking);
    return { status: "reserved", booking };
  }
  async confirmBooking(reference: string, calendarEventId?: string, meetingLink?: string) {
    const b = this.bookings.get(reference);
    if (b) Object.assign(b, { status: "confirmed", calendarEventId, meetingLink });
  }
  async failBooking(reference: string) {
    const b = this.bookings.get(reference);
    if (b) b.status = "failed";
  }
  async addBookingEmailStatus(reference: string, status: EmailStatus) {
    this.bookings.get(reference)?.emails.push(status);
  }
  async heldSlots(from: Date, to: Date) {
    return [...this.bookings.values()]
      .filter((b) => b.status !== "failed" && b.slotStart < to && b.slotEnd > from)
      .map((b) => ({ start: b.slotStart, end: b.slotEnd }));
  }
}

/** Production without a database: nothing is stored (enquiries are still emailed). */
export class NoStore implements Store {
  readonly kind = "none" as const;
  async saveEnquiry(record: EnquiryRecord) {
    return { duplicate: false, reference: record.reference };
  }
  async addEnquiryEmailStatus() {}
  async reserveBooking(input: BookingInput): Promise<ReserveResult> {
    return { status: "reserved", booking: { ...input, status: "pending", emails: [] } };
  }
  async confirmBooking() {}
  async failBooking() {}
  async addBookingEmailStatus() {}
  async heldSlots() {
    return [];
  }
}
