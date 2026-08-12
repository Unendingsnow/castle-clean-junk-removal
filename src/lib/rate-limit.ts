import {
  DUPLICATE_WINDOW_MS,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "./constants";

/**
 * Dead-simple in-memory sliding-window rate limit.
 *
 * Caveat worth knowing before you rely on it: this is per-process. On a
 * platform that runs several instances (or serverless functions that scale out
 * and cold-start), each instance keeps its own counter, so the effective limit
 * is the configured one times the number of live instances. It stops casual
 * form spam, not a determined attacker. Swap in Redis/Upstash if you need a
 * real guarantee -- the call sites below are the only two places to change.
 */

type Store = Map<string, number[]>;

// Survives dev-server hot reloads, which would otherwise reset the counters on
// every file save.
const globalStore = globalThis as unknown as {
  __leadRateLimit?: Store;
  __leadPhoneSeen?: Store;
};
const hits: Store = (globalStore.__leadRateLimit ??= new Map());
const phoneSeen: Store = (globalStore.__leadPhoneSeen ??= new Map());

let lastSweep = 0;

/** Drop expired entries so the maps can't grow without bound. */
function sweep(now: number) {
  if (now - lastSweep < RATE_LIMIT_WINDOW_MS) return;
  lastSweep = now;

  for (const [key, timestamps] of hits) {
    const live = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (live.length) hits.set(key, live);
    else hits.delete(key);
  }
  for (const [key, timestamps] of phoneSeen) {
    const live = timestamps.filter((t) => now - t < DUPLICATE_WINDOW_MS);
    if (live.length) phoneSeen.set(key, live);
    else phoneSeen.delete(key);
  }
}

function live(store: Store, key: string, now: number, windowMs: number) {
  return (store.get(key) ?? []).filter((t) => now - t < windowMs);
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the caller may retry. Zero when `ok` is true. */
  retryAfter: number;
};

/** Check the limit without spending an attempt. */
export function peekRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const timestamps = live(hits, key, now, RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    const oldest = Math.min(...timestamps);
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(
        1,
        Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000),
      ),
    };
  }

  return {
    ok: true,
    remaining: RATE_LIMIT_MAX - timestamps.length,
    retryAfter: 0,
  };
}

/**
 * Spend one attempt.
 *
 * Called only after validation passes, so a customer who fluffs the form and
 * gets a 400 back doesn't burn one of their three tries.
 */
export function consumeRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const timestamps = live(hits, key, now, RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    hits.set(key, timestamps);
    return peekRateLimit(key);
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return {
    ok: true,
    remaining: RATE_LIMIT_MAX - timestamps.length,
    retryAfter: 0,
  };
}

/**
 * Record a submission against a phone number and report how many have arrived
 * from it recently, including this one.
 *
 * Repeats are flagged in the Telegram message rather than blocked -- somebody
 * remembering an extra detail is not abuse, but two near-identical leads
 * arriving as if they were separate jobs is confusing. Same per-process caveat
 * as the rate limit: on a scaled-out deployment a repeat can land on a
 * different instance and go unnoticed. It's a helpful hint, not a guarantee.
 */
export function noteSubmission(phoneDigits: string): number {
  if (!phoneDigits) return 1;
  const now = Date.now();
  const timestamps = live(phoneSeen, phoneDigits, now, DUPLICATE_WINDOW_MS);
  timestamps.push(now);
  phoneSeen.set(phoneDigits, timestamps);
  return timestamps.length;
}

/**
 * Best-effort client IP.
 *
 * `x-forwarded-for` is client-controlled unless a trusted proxy overwrites it,
 * which Vercel/Cloudflare/nginx-with-real_ip all do. Behind anything else,
 * treat this as advisory.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
