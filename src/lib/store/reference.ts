import { randomBytes } from "node:crypto";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32: no I, L, O, U

/** Unique, readable reference, e.g. RW-261122-7KQ3MZ (enquiries) or RWB-… (bookings). */
export function makeReference(prefix: "RW" | "RWB" | "RWP", date = new Date()): string {
  const ymd = `${String(date.getUTCFullYear()).slice(2)}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (b) => ALPHABET[b % 32]).join("");
  return `${prefix}-${ymd}-${code}`;
}
