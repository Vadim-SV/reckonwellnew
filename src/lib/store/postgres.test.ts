import { afterAll, describe, expect, it } from "vitest";
import { PostgresStore } from "./postgres";
import { makeReference } from "./reference";

/**
 * Runs against a real Postgres when TEST_DATABASE_URL is set
 * (e.g. postgres://postgres@127.0.0.1:55432/reckonwell_test); skipped otherwise.
 */
const url = process.env.TEST_DATABASE_URL;
const suite = url ? describe : describe.skip;

suite("PostgresStore", () => {
  const store = new PostgresStore(url ?? "postgres://unused");
  afterAll(() => store.end());
  const slot = new Date(Date.UTC(2031, 0, 14, 10, 0) + Math.floor(Math.random() * 1e6) * 60_000);
  const base = { slotStart: slot, slotEnd: new Date(slot.getTime() + 30 * 60_000), name: "A", email: "a@example.com", enquiryType: "General" };

  it("records an enquiry once, even if it is submitted twice", async () => {
    const reference = makeReference("RW");
    const key = `enq-${reference}`;
    const first = await store.saveEnquiry({ reference, idempotencyKey: key, kind: "enquiry", source: "home", name: "A", email: "a@example.com", result: { monthly: 10 } });
    expect(first).toEqual({ duplicate: false, reference });
    const again = await store.saveEnquiry({ reference: makeReference("RW"), idempotencyKey: key, kind: "enquiry", source: "home", name: "A", email: "a@example.com" });
    expect(again).toEqual({ duplicate: true, reference });
    await store.addEnquiryEmailStatus(reference, { tag: "enquiry.internal", ok: true, provider: "brevo", at: new Date().toISOString() });
  });

  it("prevents double booking and recognises repeated submissions", async () => {
    const first = await store.reserveBooking({ ...base, reference: makeReference("RWB"), idempotencyKey: `k-${slot.getTime()}-1` });
    expect(first.status).toBe("reserved");
    const repeat = await store.reserveBooking({ ...base, reference: makeReference("RWB"), idempotencyKey: `k-${slot.getTime()}-1` });
    expect(repeat.status).toBe("duplicate");
    const other = await store.reserveBooking({ ...base, reference: makeReference("RWB"), idempotencyKey: `k-${slot.getTime()}-2` });
    expect(other.status).toBe("taken");
    if (first.status !== "reserved") return;
    // A failed booking frees the slot again.
    await store.failBooking(first.booking.reference);
    const retry = await store.reserveBooking({ ...base, reference: makeReference("RWB"), idempotencyKey: `k-${slot.getTime()}-3` });
    expect(retry.status).toBe("reserved");
    const held = await store.heldSlots(new Date(slot.getTime() - 1), new Date(slot.getTime() + 1));
    expect(held).toHaveLength(1);
  });

  it("is safe under concurrent requests for the same slot", async () => {
    const s = new Date(slot.getTime() + 7 * 86_400_000);
    const attempts = await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        store.reserveBooking({ ...base, slotStart: s, slotEnd: new Date(s.getTime() + 1_800_000), reference: makeReference("RWB"), idempotencyKey: `c-${s.getTime()}-${i}` }),
      ),
    );
    expect(attempts.filter((a) => a.status === "reserved")).toHaveLength(1);
    expect(attempts.filter((a) => a.status === "taken")).toHaveLength(7);
  });
});
