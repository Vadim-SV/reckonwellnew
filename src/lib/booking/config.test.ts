import { describe, expect, it } from "vitest";
import { BOOKING } from "./config";

/** Locks the booking rules Reckonwell confirmed on 22 November 2026. */
describe("confirmed booking rules", () => {
  it("matches what Reckonwell agreed", () => {
    expect(BOOKING.timeZone).toBe("Europe/London");
    expect(BOOKING.days).toEqual([1, 2, 3, 4, 5]);
    expect(BOOKING.firstStart).toBe("09:30");
    expect(BOOKING.lastStart).toBe("16:30");
    expect(BOOKING.durationMinutes).toBe(30);
    expect(BOOKING.minNoticeHours).toBe(24);
    expect(BOOKING.bufferMinutes).toBe(15);
  });
});
