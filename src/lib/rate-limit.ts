type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

/**
 * Lightweight in-memory rate limit (per serverless instance).
 * Enough to blunt casual abuse; not a substitute for edge WAF.
 */
export function checkRateLimit(
  key: string,
  { limit = 8, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { ok: true };
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimitResponse(retryAfterSec: number) {
  return Response.json(
    { error: "Too many requests. Please wait a moment and try again." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}
