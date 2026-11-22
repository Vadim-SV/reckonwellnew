import "server-only";
import { getStore } from "@/lib/store";
import { getCalendar, type CalendarProvider } from "./calendar";
import { BOOKING } from "./config";
import { bookableDates, candidateSlots, freeSlots, toSlot, type Interval, type Slot } from "./slots";

export type Availability =
  | { mode: "live"; timeZone: string; durationMinutes: number; days: { date: string; slots: Slot[] }[] }
  | { mode: "request"; timeZone: string; durationMinutes: number; days: string[]; reason: "not-configured" | "calendar-error" };

let cache: { at: number; value: Availability } | undefined;
const TTL_MS = 60_000;

export const clearAvailabilityCache = () => {
  cache = undefined;
};

/** Days a visitor may request in request mode: working days within the horizon that have bookable hours. */
function requestDays(now: Date): string[] {
  return bookableDates(now).filter((d) => candidateSlots(d, now).length > 0);
}

export async function getAvailability(now = new Date(), calendar: CalendarProvider | null = getCalendar()): Promise<Availability> {
  const base = { timeZone: BOOKING.timeZone, durationMinutes: BOOKING.durationMinutes };
  if (!calendar) return { mode: "request", reason: "not-configured", days: requestDays(now), ...base };
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;

  try {
    const dates = bookableDates(now);
    const candidates = dates.map((date) => ({ date, slots: candidateSlots(date, now) }));
    const all = candidates.flatMap((c) => c.slots);
    if (!all.length) return { mode: "live", days: [], ...base };
    const from = all[0].start;
    const to = all[all.length - 1].end;
    const [busy, held] = await Promise.all([calendar.busy(from, to), getStore().heldSlots(from, to)]);
    const blocked: Interval[] = [...busy, ...held];
    const days = candidates
      .map((c) => ({ date: c.date, slots: freeSlots(c.slots, blocked).map(toSlot) }))
      .filter((d) => d.slots.length > 0);
    const value: Availability = { mode: "live", days, ...base };
    cache = { at: Date.now(), value };
    return value;
  } catch (err) {
    console.error("[booking] availability failed, falling back to request mode:", err instanceof Error ? err.message : err);
    return { mode: "request", reason: "calendar-error", days: requestDays(now), ...base };
  }
}

/** Is the slot still free in the calendar (with buffer)? Checked again just before creating the event. */
export async function slotStillFree(calendar: CalendarProvider, slot: Interval): Promise<boolean> {
  const pad = BOOKING.bufferMinutes * 60_000;
  const busy = await calendar.busy(new Date(slot.start.getTime() - pad), new Date(slot.end.getTime() + pad));
  return freeSlots([slot], busy).length === 1;
}

/** Where the call happens: the Meet link if one was created, else the configured location. */
export function meetingLocation(meetingLink: string | undefined, phone: string | undefined): string {
  if (meetingLink) return meetingLink;
  if (process.env.BOOKING_LOCATION) return process.env.BOOKING_LOCATION;
  return phone ? `Phone call — we'll call you on ${phone}` : "Video call — we'll email you the link before the call";
}

export { requestDays };
