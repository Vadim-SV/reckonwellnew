import postgres from "postgres";
import type { BookingInput, BookingRecord, EmailStatus, EnquiryRecord, ReserveResult, Store } from "./types";

export const SCHEMA = `
create table if not exists enquiries (
  id bigserial primary key,
  reference text not null unique,
  idempotency_key text unique,
  kind text not null,
  source text not null,
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  calculator_key text,
  calculator_inputs jsonb,
  result jsonb,
  emails jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id bigserial primary key,
  reference text not null unique,
  idempotency_key text not null unique,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  name text not null,
  email text not null,
  phone text,
  company text,
  enquiry_type text not null,
  message text,
  status text not null check (status in ('pending', 'confirmed', 'failed')),
  calendar_event_id text,
  meeting_link text,
  emails jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Double-booking prevention: one live booking per slot start.
create unique index if not exists bookings_one_live_per_slot
  on bookings (slot_start) where status in ('pending', 'confirmed');
`;

type Row = Record<string, unknown>;

const toBooking = (r: Row): BookingRecord => ({
  reference: r.reference as string,
  idempotencyKey: r.idempotency_key as string,
  slotStart: new Date(r.slot_start as string),
  slotEnd: new Date(r.slot_end as string),
  name: r.name as string,
  email: r.email as string,
  phone: (r.phone as string) ?? undefined,
  company: (r.company as string) ?? undefined,
  enquiryType: r.enquiry_type as string,
  message: (r.message as string) ?? undefined,
  status: r.status as BookingRecord["status"],
  calendarEventId: (r.calendar_event_id as string) ?? undefined,
  meetingLink: (r.meeting_link as string) ?? undefined,
  emails: (r.emails as EmailStatus[]) ?? [],
});

export class PostgresStore implements Store {
  readonly kind = "postgres" as const;
  private sql: postgres.Sql;
  private ready: Promise<void> | undefined;

  constructor(url: string) {
    this.sql = postgres(url, { max: 3, idle_timeout: 20, onnotice: () => {} });
  }

  private migrate() {
    this.ready ??= this.sql.unsafe(SCHEMA).then(() => undefined);
    return this.ready;
  }

  async saveEnquiry(e: EnquiryRecord) {
    await this.migrate();
    const rows = await this.sql`
      insert into enquiries (reference, idempotency_key, kind, source, name, email, phone, company, message, calculator_key, calculator_inputs, result)
      values (${e.reference}, ${e.idempotencyKey ?? null}, ${e.kind}, ${e.source}, ${e.name}, ${e.email}, ${e.phone ?? null},
              ${e.company ?? null}, ${e.message ?? null}, ${e.calculatorKey ?? null},
              ${this.sql.json((e.calculatorInputs ?? null) as never)}, ${this.sql.json((e.result ?? null) as never)})
      on conflict (idempotency_key) do nothing
      returning reference`;
    if (rows.length) return { duplicate: false, reference: e.reference };
    const existing = await this.sql`select reference from enquiries where idempotency_key = ${e.idempotencyKey ?? null}`;
    return { duplicate: true, reference: (existing[0]?.reference as string) ?? e.reference };
  }

  async addEnquiryEmailStatus(reference: string, status: EmailStatus) {
    await this.migrate();
    await this.sql`update enquiries set emails = emails || ${this.sql.json([status] as never)} where reference = ${reference}`;
  }

  async reserveBooking(b: BookingInput): Promise<ReserveResult> {
    await this.migrate();
    const existing = await this.sql`select * from bookings where idempotency_key = ${b.idempotencyKey}`;
    if (existing.length) return { status: "duplicate", booking: toBooking(existing[0]) };
    try {
      const rows = await this.sql`
        insert into bookings (reference, idempotency_key, slot_start, slot_end, name, email, phone, company, enquiry_type, message, status)
        values (${b.reference}, ${b.idempotencyKey}, ${b.slotStart}, ${b.slotEnd}, ${b.name}, ${b.email}, ${b.phone ?? null},
                ${b.company ?? null}, ${b.enquiryType}, ${b.message ?? null}, 'pending')
        returning *`;
      return { status: "reserved", booking: toBooking(rows[0]) };
    } catch (err) {
      const e = err as { code?: string; constraint_name?: string };
      if (e.code === "23505") {
        // Unique violation: either the same request raced in, or the slot is held by someone else.
        const again = await this.sql`select * from bookings where idempotency_key = ${b.idempotencyKey}`;
        if (again.length) return { status: "duplicate", booking: toBooking(again[0]) };
        return { status: "taken" };
      }
      throw err;
    }
  }

  async confirmBooking(reference: string, calendarEventId?: string, meetingLink?: string) {
    await this.migrate();
    await this.sql`update bookings set status = 'confirmed', calendar_event_id = ${calendarEventId ?? null},
                   meeting_link = ${meetingLink ?? null} where reference = ${reference}`;
  }

  async failBooking(reference: string) {
    await this.migrate();
    await this.sql`update bookings set status = 'failed' where reference = ${reference}`;
  }

  async addBookingEmailStatus(reference: string, status: EmailStatus) {
    await this.migrate();
    await this.sql`update bookings set emails = emails || ${this.sql.json([status] as never)} where reference = ${reference}`;
  }

  async heldSlots(from: Date, to: Date) {
    await this.migrate();
    const rows = await this.sql`select slot_start, slot_end from bookings
      where status in ('pending', 'confirmed') and slot_start < ${to} and slot_end > ${from}`;
    return rows.map((r) => ({ start: new Date(r.slot_start as string), end: new Date(r.slot_end as string) }));
  }

  async end() {
    await this.sql.end({ timeout: 2 });
  }
}
