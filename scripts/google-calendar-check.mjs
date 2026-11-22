#!/usr/bin/env node
/**
 * Check the Google Calendar setup used by /book, without touching real bookings.
 *
 *   node --env-file=.env.local scripts/google-calendar-check.mjs           # read-only check
 *   node --env-file=.env.local scripts/google-calendar-check.mjs --write   # also create + delete a test event
 *
 * The --write test creates a private event far in the future with NO invitations
 * sent, then deletes it immediately.
 */
const { GOOGLE_OAUTH_CLIENT_ID: id, GOOGLE_OAUTH_CLIENT_SECRET: secret, GOOGLE_OAUTH_REFRESH_TOKEN: refresh, GOOGLE_CALENDAR_ID: calendar } = process.env;
const missing = Object.entries({ GOOGLE_OAUTH_CLIENT_ID: id, GOOGLE_OAUTH_CLIENT_SECRET: secret, GOOGLE_OAUTH_REFRESH_TOKEN: refresh, GOOGLE_CALENDAR_ID: calendar })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`✗ Missing: ${missing.join(", ")}`);
  process.exit(1);
}

const step = (ok, msg) => console.log(`${ok ? "✓" : "✗"} ${msg}`);
const cal = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar)}`;

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "refresh_token", client_id: id, client_secret: secret, refresh_token: refresh }),
});
const token = await tokenRes.json();
step(tokenRes.ok, tokenRes.ok ? "Refresh token works" : `Token refresh failed: ${JSON.stringify(token)}`);
if (!tokenRes.ok) {
  if (token.error === "invalid_grant") console.log("  Tip: if the OAuth app is in 'Testing' mode, tokens expire after 7 days — publish it, then run calendar:auth again.");
  process.exit(1);
}
const auth = { Authorization: `Bearer ${token.access_token}` };

const now = new Date();
const week = new Date(now.getTime() + 7 * 86_400_000);
const fb = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
  method: "POST",
  headers: { ...auth, "Content-Type": "application/json" },
  body: JSON.stringify({ timeMin: now.toISOString(), timeMax: week.toISOString(), items: [{ id: calendar }] }),
});
const fbData = await fb.json();
const calInfo = fbData.calendars?.[calendar];
const fbOk = fb.ok && calInfo && !calInfo.errors?.length;
step(fbOk, fbOk ? `Free/busy readable — ${calInfo.busy.length} busy period(s) in the next 7 days` : `Free/busy failed: ${JSON.stringify(calInfo?.errors ?? fbData)}`);
if (!fbOk) process.exit(1);

if (process.argv.includes("--write")) {
  const start = new Date(Date.UTC(now.getUTCFullYear() + 2, 0, 3, 12, 0));
  const ins = await fetch(`${cal}/events?sendUpdates=none`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: "Reckonwell website — setup test (safe to ignore)",
      visibility: "private",
      start: { dateTime: start.toISOString() },
      end: { dateTime: new Date(start.getTime() + 30 * 60_000).toISOString() },
    }),
  });
  const ev = await ins.json();
  step(ins.ok, ins.ok ? "Can create events" : `Create failed: ${JSON.stringify(ev)}`);
  if (ins.ok) {
    const del = await fetch(`${cal}/events/${ev.id}?sendUpdates=none`, { method: "DELETE", headers: auth });
    step(del.ok, del.ok ? "Test event deleted" : `Could not delete test event ${ev.id} — please remove it manually`);
  }
  if (!ins.ok) process.exit(1);
}
console.log("\nGoogle Calendar is ready for live booking.");
