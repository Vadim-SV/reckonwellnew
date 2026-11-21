/**
 * Best-effort in-memory rate limit per IP. Each server instance keeps its own
 * window, so this deters casual abuse; add a shared store (e.g. Upstash) or
 * Turnstile before launch for stronger protection.
 */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit = 5, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return recent.length > limit;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
