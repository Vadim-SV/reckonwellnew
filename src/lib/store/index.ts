import "server-only";
import { MemoryStore, NoStore } from "./memory";
import { PostgresStore } from "./postgres";
import type { Store } from "./types";

export type { Store } from "./types";

let store: Store | undefined;

/**
 * DATABASE_URL set → Postgres (durable; enquiries and bookings recorded,
 * double bookings blocked by a unique index).
 * Otherwise → in-memory in development, or no storage in production
 * (enquiries are still emailed; a warning is logged once).
 */
export function getStore(): Store {
  if (store) return store;
  if (process.env.DATABASE_URL) store = new PostgresStore(process.env.DATABASE_URL);
  else if (process.env.NODE_ENV === "production") {
    console.warn("[store] DATABASE_URL is not set — enquiries and bookings are emailed but not recorded.");
    store = new NoStore();
  } else store = new MemoryStore();
  return store;
}
