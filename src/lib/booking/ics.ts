/** Minimal RFC 5545 calendar file for a confirmed meeting (attached to the confirmation email). */
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Fold lines to 75 octets as the spec requires. */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut)) > 75) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out.join("\r\n");
}

export function buildIcs(e: {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  location?: string;
  organizer: { name: string; email: string };
  attendee: { name: string; email: string };
}): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Reckonwell//Discovery call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${escape(e.summary)}`,
    `DESCRIPTION:${escape(e.description)}`,
    ...(e.location ? [`LOCATION:${escape(e.location)}`] : []),
    `ORGANIZER;CN=${escape(e.organizer.name)}:mailto:${e.organizer.email}`,
    `ATTENDEE;CN=${escape(e.attendee.name)};ROLE=REQ-PARTICIPANT:mailto:${e.attendee.email}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
