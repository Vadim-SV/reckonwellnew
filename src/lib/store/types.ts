export type EnquiryRecord = {
  reference: string;
  /** Client-generated key: a repeated submission returns the original reference. */
  idempotencyKey?: string;
  kind: "enquiry" | "partner" | "booking-request";
  source: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  calculatorKey?: string;
  calculatorInputs?: unknown;
  /** Server-calculated estimate or scope summary. */
  result?: unknown;
};

export type EmailStatus = { tag: string; ok: boolean; provider?: string; messageId?: string; reason?: string; at: string };

export type BookingInput = {
  reference: string;
  idempotencyKey: string;
  slotStart: Date;
  slotEnd: Date;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  enquiryType: string;
  message?: string;
};

export type BookingRecord = BookingInput & {
  status: "pending" | "confirmed" | "failed";
  calendarEventId?: string;
  meetingLink?: string;
  emails: EmailStatus[];
};

export type ReserveResult =
  | { status: "reserved"; booking: BookingRecord }
  /** Same idempotency key seen before: return the earlier booking, send nothing again. */
  | { status: "duplicate"; booking: BookingRecord }
  /** Someone else already holds this slot. */
  | { status: "taken" };

export interface Store {
  readonly kind: "postgres" | "memory" | "none";
  /** Saves the enquiry, or returns the earlier reference if this idempotency key was already used. */
  saveEnquiry(record: EnquiryRecord): Promise<{ duplicate: boolean; reference: string }>;
  addEnquiryEmailStatus(reference: string, status: EmailStatus): Promise<void>;
  reserveBooking(input: BookingInput): Promise<ReserveResult>;
  confirmBooking(reference: string, calendarEventId: string | undefined, meetingLink: string | undefined): Promise<void>;
  failBooking(reference: string): Promise<void>;
  addBookingEmailStatus(reference: string, status: EmailStatus): Promise<void>;
  /** Slots held by pending or confirmed bookings in [from, to). */
  heldSlots(from: Date, to: Date): Promise<{ start: Date; end: Date }[]>;
}
