import "server-only";
import type { Interval } from "./slots";

export type CreatedEvent = { eventId: string; iCalUID: string; meetingLink?: string; htmlLink?: string };
export type CreateResult = { ok: true; event: CreatedEvent; duplicate: boolean } | { ok: false; reason: "conflict" | "error"; detail?: string };

export interface CalendarProvider {
  readonly kind: "google" | "none";
  busy(from: Date, to: Date): Promise<Interval[]>;
  createEvent(input: {
    slotStart: Date;
    slotEnd: Date;
    summary: string;
    description: string;
    attendee: { email: string; name: string };
    location?: string;
  }): Promise<CreateResult>;
}

/** Google event IDs use base32hex (0-9, a-v). Derived from the slot start, so one slot = one event ID. */
export function eventIdForSlot(slotStart: Date, attempt = 0): string {
  const iso = slotStart.toISOString(); // 2026-07-14T08:30:00.000Z
  const digits = iso.slice(0, 16).replace(/[-T:]/g, ""); // 202607140830
  return `rc${digits}${attempt ? "abcdefghij"[attempt - 1] : ""}`;
}

type Env = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
  createMeet: boolean;
};

export class GoogleCalendar implements CalendarProvider {
  readonly kind = "google" as const;
  private token: { value: string; expires: number } | undefined;

  constructor(
    private env: Env,
    private fetchImpl: typeof fetch = fetch,
  ) {}

  private async accessToken(): Promise<string> {
    if (this.token && this.token.expires > Date.now() + 60_000) return this.token.value;
    const res = await this.fetchImpl("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: this.env.clientId,
        client_secret: this.env.clientSecret,
        refresh_token: this.env.refreshToken,
      }).toString(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Google token error ${res.status}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.token = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 };
    return data.access_token;
  }

  private calendarUrl(path = "") {
    return `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.env.calendarId)}${path}`;
  }

  async busy(from: Date, to: Date): Promise<Interval[]> {
    const token = await this.accessToken();
    const res = await this.fetchImpl("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id: this.env.calendarId }] }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Google freeBusy error ${res.status}`);
    const data = (await res.json()) as { calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }> };
    const cal = data.calendars?.[this.env.calendarId];
    if (!cal || cal.errors?.length) throw new Error("Google freeBusy returned an error for the calendar");
    return (cal.busy ?? []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
  }

  async createEvent(input: Parameters<CalendarProvider["createEvent"]>[0]): Promise<CreateResult> {
    const token = await this.accessToken();
    for (let attempt = 0; attempt < 4; attempt++) {
      const id = eventIdForSlot(input.slotStart, attempt);
      const body = {
        id,
        summary: input.summary,
        description: input.description,
        location: input.location,
        start: { dateTime: input.slotStart.toISOString(), timeZone: "Europe/London" },
        end: { dateTime: input.slotEnd.toISOString(), timeZone: "Europe/London" },
        attendees: [{ email: input.attendee.email, displayName: input.attendee.name }],
        reminders: { useDefault: true },
        ...(this.env.createMeet ? { conferenceData: { createRequest: { requestId: id, conferenceSolutionKey: { type: "hangoutsMeet" } } } } : {}),
      };
      const res = await this.fetchImpl(
        this.calendarUrl(`/events?sendUpdates=all${this.env.createMeet ? "&conferenceDataVersion=1" : ""}`),
        { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) },
      );
      if (res.ok) return { ok: true, duplicate: false, event: toCreated(await res.json()) };
      if (res.status !== 409) return { ok: false, reason: "error", detail: `insert ${res.status}` };

      // The ID already exists: same booking retried, a cancelled event, or someone else's booking.
      const existingRes = await this.fetchImpl(this.calendarUrl(`/events/${id}`), { headers: { Authorization: `Bearer ${token}` } });
      if (!existingRes.ok) return { ok: false, reason: "error", detail: `get ${existingRes.status}` };
      const existing = (await existingRes.json()) as GoogleEvent;
      if (existing.status === "cancelled") continue; // a cancelled event keeps its ID — try the next suffix
      const sameAttendee = existing.attendees?.some((a) => a.email?.toLowerCase() === input.attendee.email.toLowerCase());
      if (sameAttendee) return { ok: true, duplicate: true, event: toCreated(existing) };
      return { ok: false, reason: "conflict" };
    }
    return { ok: false, reason: "conflict" };
  }
}

type GoogleEvent = {
  id: string;
  iCalUID: string;
  status?: string;
  htmlLink?: string;
  hangoutLink?: string;
  attendees?: { email?: string }[];
  conferenceData?: { entryPoints?: { entryPointType?: string; uri?: string }[] };
};

const toCreated = (e: GoogleEvent): CreatedEvent => ({
  eventId: e.id,
  iCalUID: e.iCalUID ?? `${e.id}@google.com`,
  htmlLink: e.htmlLink,
  meetingLink: e.hangoutLink ?? e.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video")?.uri,
});

/** Google Calendar when fully configured; otherwise null (the site uses request mode). */
export function getCalendar(): CalendarProvider | null {
  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, GOOGLE_CALENDAR_ID } = process.env;
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REFRESH_TOKEN || !GOOGLE_CALENDAR_ID) return null;
  return new GoogleCalendar({
    clientId: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: GOOGLE_OAUTH_REFRESH_TOKEN,
    calendarId: GOOGLE_CALENDAR_ID,
    createMeet: process.env.BOOKING_CREATE_GOOGLE_MEET !== "false",
  });
}
