/**
 * Discovery-call availability rules. All times are UK local time
 * (Europe/London), so British Summer Time is handled correctly.
 *
 * Confirmed by Reckonwell (22 Nov 2026): Google Calendar for live booking;
 * calls start between 09:30 and 16:30 (the last call runs 16:30–17:00).
 * Still defaults, awaiting confirmation: 30-minute calls, 15-minute buffer,
 * 24 hours' notice, 3 weeks ahead.
 */
export const BOOKING = {
  timeZone: "Europe/London",
  durationMinutes: 30,
  /** Working days, 1 = Monday … 5 = Friday. */
  days: [1, 2, 3, 4, 5],
  /** First and last possible start times, inclusive (24h, local time). */
  firstStart: "09:30",
  lastStart: "16:30",
  /** Spacing between slot start times. */
  stepMinutes: 30,
  /** Free time required before/after each existing meeting. */
  bufferMinutes: 15,
  /** Earliest bookable time from now. */
  minNoticeHours: 24,
  /** How far ahead visitors can book. */
  horizonDays: 21,
  meetingLabel: "Discovery call with Reckonwell",
} as const;

/** Bank holidays in England and Wales (GOV.UK), as local dates. Extend each year. */
export const BANK_HOLIDAYS = new Set([
  // 2026
  "2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25", "2026-08-31", "2026-12-25", "2026-12-28",
  // 2027
  "2027-01-01", "2027-03-26", "2027-03-29", "2027-05-03", "2027-05-31", "2027-08-30", "2027-12-27", "2027-12-28",
]);
