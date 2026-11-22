#!/usr/bin/env node
/**
 * One-off helper: obtain a Google Calendar refresh token for live booking.
 *
 * Run on your own computer (it opens a browser sign-in):
 *   GOOGLE_OAUTH_CLIENT_ID=… GOOGLE_OAUTH_CLIENT_SECRET=… node scripts/google-calendar-auth.mjs
 *   (or: node --env-file=.env.local scripts/google-calendar-auth.mjs)
 *
 * Sign in as the account that owns the calendar used for discovery calls.
 * The refresh token is printed to this terminal only — copy it into your
 * hosting provider's environment variables as GOOGLE_OAUTH_REFRESH_TOKEN.
 * Nothing is written to disk. Requires an OAuth client of type "Desktop app".
 */
import http from "node:http";
import { randomBytes } from "node:crypto";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET first.");
  process.exit(1);
}

// Only what the site needs: read free/busy times, and create/read discovery-call events.
const scopes = ["https://www.googleapis.com/auth/calendar.freebusy", "https://www.googleapis.com/auth/calendar.events"];
const port = Number(process.env.PORT ?? 53682);
const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
const state = randomBytes(16).toString("hex");

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: scopes.join(" "),
  access_type: "offline", // needed for a refresh token
  prompt: "consent", // always return a refresh token
  state,
}).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", redirectUri);
  if (url.pathname !== "/oauth2callback") return void res.writeHead(404).end();
  const fail = (msg) => {
    res.writeHead(400, { "Content-Type": "text/plain" }).end(msg);
    console.error(`\n✗ ${msg}`);
    server.close();
    process.exitCode = 1;
  };
  if (url.searchParams.get("state") !== state) return fail("State mismatch — please run the script again.");
  if (url.searchParams.get("error")) return fail(`Google returned: ${url.searchParams.get("error")}`);
  const code = url.searchParams.get("code");
  if (!code) return fail("No authorisation code received.");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  const data = await tokenRes.json();
  if (!tokenRes.ok || !data.refresh_token) return fail(`Token exchange failed: ${JSON.stringify(data)}`);

  res.writeHead(200, { "Content-Type": "text/plain" }).end("Done — you can close this tab and return to the terminal.");
  console.log("\n✓ Success. Add this to your hosting provider's environment variables (keep it secret):\n");
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${data.refresh_token}\n`);
  console.log("Granted scopes:", data.scope);
  server.close();
});

server.listen(port, "127.0.0.1", () => {
  console.log("Open this link in your browser and sign in as the calendar owner:\n");
  console.log(authUrl.toString());
  console.log(`\nWaiting for Google to redirect to ${redirectUri} …`);
});
