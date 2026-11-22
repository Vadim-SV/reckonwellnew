import { describe, expect, it } from "vitest";
import { candidateSlots, freeSlots, isValidSlotStart } from "./slots";
import { describeSlot, zonedTimeToUtc } from "./time";

const now = new Date("2026-01-01T00:00:00Z");

describe("Europe/London time handling", () => {
  it("maps winter (GMT) and summer (BST) wall-clock times to the right UTC instants", () => {
    expect(zonedTimeToUtc(2026, 1, 15, 9, 30, "Europe/London").toISOString()).toBe("2026-01-15T09:30:00.000Z");
    expect(zonedTimeToUtc(2026, 7, 15, 9, 30, "Europe/London").toISOString()).toBe("2026-07-15T08:30:00.000Z");
  });

  it("handles the days the clocks change", () => {
    // Clocks go forward 29 March 2026 (Sunday); Monday 30 March is BST.
    expect(zonedTimeToUtc(2026, 3, 27, 10, 0, "Europe/London").toISOString()).toBe("2026-03-27T10:00:00.000Z");
    expect(zonedTimeToUtc(2026, 3, 30, 10, 0, "Europe/London").toISOString()).toBe("2026-03-30T09:00:00.000Z");
    // Clocks go back 25 October 2026; Monday 26 October is GMT again.
    expect(zonedTimeToUtc(2026, 10, 23, 10, 0, "Europe/London").toISOString()).toBe("2026-10-23T09:00:00.000Z");
    expect(zonedTimeToUtc(2026, 10, 26, 10, 0, "Europe/London").toISOString()).toBe("2026-10-26T10:00:00.000Z");
  });

  it("describes slots in UK time with the right zone label", () => {
    expect(describeSlot(new Date("2026-07-14T09:30:00Z"))).toBe("Tuesday 14 July 2026 at 10:30 (BST)");
    expect(describeSlot(new Date("2026-01-13T09:30:00Z"))).toBe("Tuesday 13 January 2026 at 09:30 (GMT)");
  });
});

describe("slot generation", () => {
  it("offers 30-minute slots from 09:30 to 16:30 on working days", () => {
    const slots = candidateSlots("2026-07-14", now);
    expect(slots).toHaveLength(15);
    expect(slots[0].start.toISOString()).toBe("2026-07-14T08:30:00.000Z"); // 09:30 BST
    expect(slots.at(-1)?.start.toISOString()).toBe("2026-07-14T15:30:00.000Z"); // 16:30 BST
  });

  it("offers nothing at weekends or on bank holidays", () => {
    expect(candidateSlots("2026-07-18", now)).toHaveLength(0); // Saturday
    expect(candidateSlots("2026-08-31", now)).toHaveLength(0); // Summer bank holiday
    expect(candidateSlots("2026-12-28", now)).toHaveLength(0); // Boxing Day (substitute)
  });

  it("respects the 24-hour minimum notice", () => {
    const at = new Date("2026-07-13T12:00:00Z"); // Monday 13:00 BST
    const tuesday = candidateSlots("2026-07-14", at);
    expect(tuesday[0].start.toISOString()).toBe("2026-07-14T12:00:00.000Z"); // 13:00 BST, exactly 24h later
  });

  it("removes slots that clash with busy time, including the buffer", () => {
    const slots = candidateSlots("2026-07-14", now);
    const busy = [{ start: new Date("2026-07-14T10:00:00Z"), end: new Date("2026-07-14T11:00:00Z") }]; // 11:00–12:00 BST
    const free = freeSlots(slots, busy).map((s) => s.start.toISOString());
    expect(free).not.toContain("2026-07-14T09:30:00.000Z"); // 10:30 ends 11:00 → inside buffer
    expect(free).not.toContain("2026-07-14T10:30:00.000Z");
    expect(free).not.toContain("2026-07-14T11:00:00.000Z"); // 12:00 starts at end → inside buffer
    expect(free).toContain("2026-07-14T09:00:00.000Z"); // 10:00–10:30, buffer ends 10:45 < 11:00
    expect(free).toContain("2026-07-14T11:30:00.000Z");
  });

  it("validates a requested slot start", () => {
    const at = new Date("2026-07-10T08:00:00Z");
    expect(isValidSlotStart(new Date("2026-07-14T08:30:00Z"), at)).toBe(true);
    expect(isValidSlotStart(new Date("2026-07-14T08:45:00Z"), at)).toBe(false); // not on the grid
    expect(isValidSlotStart(new Date("2026-07-18T08:30:00Z"), at)).toBe(false); // Saturday
    expect(isValidSlotStart(new Date("2026-09-30T08:30:00Z"), at)).toBe(false); // beyond horizon
  });
});
