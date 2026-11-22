import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { GoogleCalendar, eventIdForSlot } from "./calendar";
import { buildIcs } from "./ics";

const env = { clientId: "id", clientSecret: "secret", refreshToken: "rt", calendarId: "vadim@example.com", createMeet: true };
const slot = { slotStart: new Date("2026-07-14T08:30:00Z"), slotEnd: new Date("2026-07-14T09:00:00Z") };
const input = { ...slot, summary: "Discovery call", description: "Hello", attendee: { email: "c@example.com", name: "Client" } };

function mockFetch(handler: (url: string, init?: RequestInit) => { status: number; body?: unknown }) {
  return vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    if (u.includes("oauth2.googleapis.com")) return new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }), { status: 200 });
    const r = handler(u, init);
    return new Response(r.body === undefined ? null : JSON.stringify(r.body), { status: r.status });
  }) as unknown as typeof fetch;
}

describe("Google Calendar provider", () => {
  it("derives a valid base32hex event ID from the slot", () => {
    expect(eventIdForSlot(slot.slotStart)).toBe("rc202607140830");
    expect(eventIdForSlot(slot.slotStart)).toMatch(/^[a-v0-9]{5,1024}$/);
    expect(eventIdForSlot(slot.slotStart, 1)).toBe("rc202607140830a");
  });

  it("reads busy periods", async () => {
    const f = mockFetch(() => ({ status: 200, body: { calendars: { [env.calendarId]: { busy: [{ start: "2026-07-14T10:00:00Z", end: "2026-07-14T11:00:00Z" }] } } } }));
    const busy = await new GoogleCalendar(env, f).busy(new Date("2026-07-14T00:00:00Z"), new Date("2026-07-15T00:00:00Z"));
    expect(busy[0].start.toISOString()).toBe("2026-07-14T10:00:00.000Z");
  });

  it("creates an event with a Meet link and invites the attendee", async () => {
    let sent: Record<string, unknown> = {};
    let url = "";
    const f = mockFetch((u, init) => {
      url = u;
      sent = JSON.parse(String(init?.body));
      return { status: 200, body: { id: "rc202607140830", iCalUID: "rc202607140830@google.com", hangoutLink: "https://meet.google.com/abc-defg-hij" } };
    });
    const r = await new GoogleCalendar(env, f).createEvent(input);
    expect(r.ok && r.event.meetingLink).toBe("https://meet.google.com/abc-defg-hij");
    expect(url).toContain("sendUpdates=all");
    expect(sent.id).toBe("rc202607140830");
  });

  it("treats a retried submission for the same person as a duplicate, not a new booking", async () => {
    const f = mockFetch((u, init) =>
      init?.method === "POST" ? { status: 409 } : { status: 200, body: { id: "rc202607140830", iCalUID: "x", status: "confirmed", attendees: [{ email: "C@example.com" }] } },
    );
    const r = await new GoogleCalendar(env, f).createEvent(input);
    expect(r.ok && r.duplicate).toBe(true);
  });

  it("reports a conflict when someone else holds the slot", async () => {
    const f = mockFetch((u, init) =>
      init?.method === "POST" ? { status: 409 } : { status: 200, body: { id: "rc202607140830", iCalUID: "x", status: "confirmed", attendees: [{ email: "other@example.com" }] } },
    );
    expect(await new GoogleCalendar(env, f).createEvent(input)).toEqual({ ok: false, reason: "conflict" });
  });

  it("moves past a cancelled event that still holds the ID", async () => {
    let posts = 0;
    const f = mockFetch((u, init) => {
      if (init?.method === "POST") return ++posts === 1 ? { status: 409 } : { status: 200, body: { id: "rc202607140830a", iCalUID: "y" } };
      return { status: 200, body: { id: "rc202607140830", status: "cancelled" } };
    });
    const r = await new GoogleCalendar(env, f).createEvent(input);
    expect(r.ok && r.event.eventId).toBe("rc202607140830a");
  });
});

describe("ICS file", () => {
  it("produces a valid, escaped VEVENT with CRLF line endings", () => {
    const ics = buildIcs({
      uid: "rc202607140830@google.com",
      ...{ start: slot.slotStart, end: slot.slotEnd },
      summary: "Discovery call, Reckonwell",
      description: "Line one\nLine two; with semicolon",
      organizer: { name: "Reckonwell", email: "vadim.s@reckonwell.com" },
      attendee: { name: "Client", email: "c@example.com" },
    });
    expect(ics).toContain("DTSTART:20260714T083000Z");
    expect(ics).toContain("SUMMARY:Discovery call\\, Reckonwell");
    expect(ics).toContain("Line one\\nLine two\; with semicolon");
    expect(ics.split("\r\n").every((l) => Buffer.byteLength(l) <= 75)).toBe(true);
  });
});
