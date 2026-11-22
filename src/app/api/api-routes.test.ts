import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// A fake calendar we can control per test.
const fake = {
  kind: "google" as const,
  busyPeriods: [] as { start: Date; end: Date }[],
  created: [] as { slotStart: Date; attendee: { email: string } }[],
  conflict: false,
  async busy() {
    return this.busyPeriods;
  },
  async createEvent(input: { slotStart: Date; attendee: { email: string; name: string } }) {
    if (this.conflict) return { ok: false as const, reason: "conflict" as const };
    this.created.push(input);
    return { ok: true as const, duplicate: false, event: { eventId: "rc1", iCalUID: "rc1@google.com", meetingLink: "https://meet.google.com/abc-defg-hij" } };
  },
};
let calendarOn = false;
vi.mock("@/lib/booking/calendar", async (orig) => ({
  ...(await orig<typeof import("@/lib/booking/calendar")>()),
  getCalendar: () => (calendarOn ? fake : null),
}));

const { POST: bookingPOST } = await import("./booking/route");
const { GET: availabilityGET } = await import("./booking/availability/route");
const { POST: enquiryPOST } = await import("./enquiry/route");
const { clearAvailabilityCache } = await import("@/lib/booking/service");

const req = (body: unknown, ip = "10.0.0.1") =>
  new Request("http://localhost/api", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) });
const contact = { name: "Jane Smith", email: "jane@example.com", phone: "", company: "Acme Ltd", enquiryType: "Bookkeeping", message: "", consent: true };
let ipCounter = 0;
const ip = () => `10.1.0.${++ipCounter}`;

describe("booking API — request mode (no calendar configured)", () => {
  beforeEach(() => {
    calendarOn = false;
  });

  it("offers request mode with real working days and records the request once", async () => {
    const avail = await (await availabilityGET()).json();
    expect(avail.mode).toBe("request");
    expect(avail.days.length).toBeGreaterThan(5);
    const key = crypto.randomUUID();
    const body = { mode: "request", preferredDates: avail.days.slice(0, 2), timeOfDay: "Morning", ...contact, idempotencyKey: key };
    const first = await (await bookingPOST(req(body, ip()))).json();
    expect(first.ok).toBe(true);
    expect(first.reference).toMatch(/^RWB-/);
    const again = await (await bookingPOST(req(body, ip()))).json();
    expect(again).toMatchObject({ ok: true, duplicate: true, reference: first.reference });
  });

  it("rejects days outside the rules", async () => {
    const res = await bookingPOST(req({ mode: "request", preferredDates: ["2020-01-01"], timeOfDay: "Morning", ...contact, idempotencyKey: crypto.randomUUID() }, ip()));
    expect(res.status).toBe(422);
  });

  it("refuses live bookings when no calendar is configured", async () => {
    const res = await bookingPOST(req({ mode: "live", slotStart: new Date().toISOString(), ...contact, idempotencyKey: crypto.randomUUID() }, ip()));
    expect(res.status).toBe(409);
    expect((await res.json()).fallback).toBe("request");
  });
});

describe("booking API — live mode (calendar configured)", () => {
  beforeEach(() => {
    calendarOn = true;
    fake.busyPeriods = [];
    fake.created = [];
    fake.conflict = false;
    clearAvailabilityCache();
  });

  it("shows only free slots", async () => {
    const before = await (await availabilityGET()).json();
    const first = before.days[0].slots[0];
    clearAvailabilityCache();
    fake.busyPeriods = [{ start: new Date(first.start), end: new Date(first.end) }];
    const after = await (await availabilityGET()).json();
    expect(after.days.flatMap((d: { slots: { start: string }[] }) => d.slots.map((s) => s.start))).not.toContain(first.start);
  });

  it("books a slot, creates the calendar event first, then emails; repeats and clashes are handled", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const avail = await (await availabilityGET()).json();
    const slotStart = avail.days[1].slots[2].start;
    const key = crypto.randomUUID();

    const res = await bookingPOST(req({ mode: "live", slotStart, ...contact, idempotencyKey: key }, ip()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toMatchObject({ ok: true, mode: "live", meetingLink: "https://meet.google.com/abc-defg-hij" });
    expect(data.when).toMatch(/\((GMT|BST)\)$/);
    expect(fake.created).toHaveLength(1);
    const emails = log.mock.calls.map((c) => String(c[0])).filter((l) => l.startsWith("[email:dev]"));
    expect(emails.some((l) => l.includes("Your Discovery Call with Reckonwell is Confirmed") && l.includes(".ics"))).toBe(true);
    expect(emails.some((l) => l.includes("New discovery call"))).toBe(true);

    // Same submission again: no second event, no more emails.
    log.mockClear();
    const repeat = await (await bookingPOST(req({ mode: "live", slotStart, ...contact, idempotencyKey: key }, ip()))).json();
    expect(repeat).toMatchObject({ ok: true, duplicate: true, reference: data.reference });
    expect(fake.created).toHaveLength(1);
    expect(log.mock.calls.filter((c) => String(c[0]).startsWith("[email:dev]"))).toHaveLength(0);

    // Someone else, same slot: refused.
    const clash = await bookingPOST(req({ mode: "live", slotStart, ...contact, email: "b@example.com", idempotencyKey: crypto.randomUUID() }, ip()));
    expect(clash.status).toBe(409);
    log.mockRestore();
  });

  it("releases the slot and sends nothing if the calendar reports a conflict", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const avail = await (await availabilityGET()).json();
    const slotStart = avail.days[2].slots[0].start;
    fake.conflict = true;
    const res = await bookingPOST(req({ mode: "live", slotStart, ...contact, idempotencyKey: crypto.randomUUID() }, ip()));
    expect(res.status).toBe(409);
    expect(log.mock.calls.filter((c) => String(c[0]).startsWith("[email:dev]"))).toHaveLength(0);
    // Slot is free again for the next person once the calendar allows it.
    fake.conflict = false;
    const retry = await bookingPOST(req({ mode: "live", slotStart, ...contact, idempotencyKey: crypto.randomUUID() }, ip()));
    expect(retry.status).toBe(200);
    log.mockRestore();
  });

  it("rejects slots that are not on the booking grid", async () => {
    const res = await bookingPOST(req({ mode: "live", slotStart: "2026-12-26T03:07:00.000Z", ...contact, idempotencyKey: crypto.randomUUID() }, ip()));
    expect(res.status).toBe(422);
  });
});

describe("enquiry API", () => {
  it("recalculates, attaches the PDF and sends each email once", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const key = crypto.randomUUID();
    const body = {
      source: "payroll-services",
      calculator: { key: "payroll", inputs: { employees: 10 } },
      contact: { name: "Jane Smith", email: "jane@example.com", consent: true },
      idempotencyKey: key,
    };
    const first = await (await enquiryPOST(req(body, ip()))).json();
    expect(first.reference).toMatch(/^RW-/);
    const lines = log.mock.calls.map((c) => String(c[0])).filter((l) => l.startsWith("[email:dev]"));
    expect(lines).toHaveLength(2);
    expect(lines.every((l) => l.includes(`Reckonwell-${first.reference}.pdf`))).toBe(true);

    log.mockClear();
    const again = await (await enquiryPOST(req(body, ip()))).json();
    expect(again).toMatchObject({ duplicate: true, reference: first.reference });
    expect(log.mock.calls.filter((c) => String(c[0]).startsWith("[email:dev]"))).toHaveLength(0);
    log.mockRestore();
  });
});
