// Best-effort, in-process rate limiting.
//
// Mirrors the cooldown Map already used in the avatar upload route: it lives
// in one server process, so it does not hold across instances on a
// horizontally scaled or serverless deployment. That's fine here — the goal
// is to blunt casual brute-forcing and scripted signup spam, not to be a
// hardened rate limiter. Move this to a shared store (Redis, etc.) before
// relying on it at real scale.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the map doesn't grow unbounded; runs at most once
// a minute, triggered by traffic rather than a timer.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Fixed-window limiter. Returns `true` when the call is allowed (and counts
 * it), `false` when the caller is over the limit for the current window.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): boolean {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) return false;
  existing.count += 1;
  return true;
}

/** Best-effort client IP from the headers a reverse proxy typically sets. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
