import { nowIso } from "@/lib/utils";

type RateBucket = {
  timestamps: number[];
};

const buckets = new Map<string, RateBucket>();

export function assertRateLimit(key: string, maxRequests = 20, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  const active = bucket.timestamps.filter((t) => now - t < windowMs);

  if (active.length >= maxRequests) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((windowMs - (now - active[0])) / 1000),
      at: nowIso()
    };
  }

  active.push(now);
  buckets.set(key, { timestamps: active });
  return { ok: true, at: nowIso() };
}
