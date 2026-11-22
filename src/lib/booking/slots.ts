import { BANK_HOLIDAYS, BOOKING } from "./config";
import { localDateKey, zonedParts, zonedTimeToUtc } from "./time";

export type Interval = { start: Date; end: Date };
export type Slot = { start: string; end: string };

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Every candidate slot (before checking the calendar) for one local date "YYYY-MM-DD". */
export function candidateSlots(dateKey: string, now: Date, cfg = BOOKING): Interval[] {
  const [y, m, d] = dateKey.split("-").map(Number);
  const noonUtc = zonedTimeToUtc(y, m, d, 12, 0, cfg.timeZone);
  const weekday = zonedParts(noonUtc, cfg.timeZone).weekday;
  if (!(cfg.days as readonly number[]).includes(weekday) || BANK_HOLIDAYS.has(dateKey)) return [];

  const earliest = now.getTime() + cfg.minNoticeHours * 3_600_000;
  const out: Interval[] = [];
  for (let t = minutes(cfg.firstStart); t <= minutes(cfg.lastStart); t += cfg.stepMinutes) {
    const start = zonedTimeToUtc(y, m, d, Math.floor(t / 60), t % 60, cfg.timeZone);
    if (start.getTime() < earliest) continue;
    out.push({ start, end: new Date(start.getTime() + cfg.durationMinutes * 60_000) });
  }
  return out;
}

/** Remove slots that clash with busy periods (calendar events or held bookings), allowing a buffer. */
export function freeSlots(candidates: Interval[], busy: Interval[], bufferMinutes: number = BOOKING.bufferMinutes): Interval[] {
  const pad = bufferMinutes * 60_000;
  return candidates.filter(
    (s) => !busy.some((b) => s.start.getTime() < b.end.getTime() + pad && s.end.getTime() > b.start.getTime() - pad),
  );
}

/** Local dates (YYYY-MM-DD) from today through the booking horizon. */
export function bookableDates(now: Date, cfg = BOOKING): string[] {
  const out: string[] = [];
  for (let i = 0; i <= cfg.horizonDays; i++) out.push(localDateKey(new Date(now.getTime() + i * 86_400_000), cfg.timeZone));
  return [...new Set(out)];
}

/** Is `start` a valid slot start under the rules (ignores calendar busy time)? */
export function isValidSlotStart(start: Date, now: Date, cfg = BOOKING): boolean {
  const key = localDateKey(start, cfg.timeZone);
  if (!bookableDates(now, cfg).includes(key)) return false;
  return candidateSlots(key, now, cfg).some((s) => s.start.getTime() === start.getTime());
}

export const toSlot = (i: Interval): Slot => ({ start: i.start.toISOString(), end: i.end.toISOString() });
