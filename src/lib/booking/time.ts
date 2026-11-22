/**
 * Time-zone helpers built on Intl (no extra dependency).
 * Converts between UTC instants and wall-clock time in a named zone,
 * handling daylight-saving changes correctly.
 */

type Parts = { year: number; month: number; day: number; hour: number; minute: number; weekday: number };

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function formatter(timeZone: string) {
  let f = fmtCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
    fmtCache.set(timeZone, f);
  }
  return f;
}

const WEEKDAYS: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

/** Wall-clock parts of a UTC instant in `timeZone`. */
export function zonedParts(date: Date, timeZone: string): Parts {
  const out: Record<string, string> = {};
  for (const p of formatter(timeZone).formatToParts(date)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour),
    minute: Number(out.minute),
    weekday: WEEKDAYS[out.weekday],
  };
}

/** The UTC instant at which the wall clock in `timeZone` shows the given local date and time. */
export function zonedTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  // Offset = how far the zone's wall clock is ahead of UTC at that moment; refine twice for DST edges.
  let ts = guess;
  for (let i = 0; i < 2; i++) {
    const p = zonedParts(new Date(ts), timeZone);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
    ts = guess - (asUtc - ts);
  }
  return new Date(ts);
}

/** YYYY-MM-DD for a UTC instant, in `timeZone`. */
export function localDateKey(date: Date, timeZone: string): string {
  const p = zonedParts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

export function formatLondon(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", ...options }).format(date);
}

/** e.g. "Tuesday 14 April 2026 at 10:30 (BST)". */
export function describeSlot(date: Date): string {
  const day = formatLondon(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "");
  const time = formatLondon(date, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const zone = formatLondon(date, { timeZoneName: "short" }).split(" ").pop();
  return `${day} at ${time} (${zone === "GMT+1" ? "BST" : zone})`;
}
