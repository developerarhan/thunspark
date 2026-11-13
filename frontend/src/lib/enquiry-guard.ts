import { createHash } from 'node:crypto';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/**
 * Durable Enquiry Protection & Rate Limiting Guard
 *
 * Provides a resilient multi-tier protection layer:
 * Tier 1: In-memory (zero cost, immediate block for spam/floods).
 * Tier 2: Durable Upstash Redis (distributed rate limiting & 5m atomic deduplication).
 *
 * Critical Resilience Rule:
 * Under NO circumstances does an Upstash Redis outage, bad token, timeout, or quota
 * error take down the contact form. All Redis operations are wrapped in an 800ms
 * hard timeout with an automatic circuit breaker that degrades to in-memory mode.
 */

export type BackendState = 'redis' | 'degraded' | 'memory';

export type EnquiryGuardResult =
  | { allowed: true; fallback?: boolean }
  | { allowed: false; reason: 'rate_limited'; retryAfter: number; message: string }
  | { allowed: false; reason: 'already_received'; message: string };

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory fallback cache limits
const IN_MEMORY_DEDUPE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const IN_MEMORY_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const IN_MEMORY_MAX_REQUESTS_PER_IP = 10;
const IN_MEMORY_MAX_CACHE_ENTRIES = 1000;

// Circuit breaker settings
const CIRCUIT_BREAKER_FAIL_THRESHOLD = 3;
const CIRCUIT_BREAKER_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const REDIS_TIMEOUT_MS = 800; // 800ms hard ceiling

// Module-level in-memory stores
const inMemoryDedupeCache = new Map<string, number>();
const inMemoryIpRateLimitCache = new Map<string, RateLimitEntry>();

// Circuit breaker module state
let backendState: BackendState = 'memory';
let consecutiveFailures = 0;
let circuitOpenUntil = 0;
let warnedAboutSalt = false;
let redisInitialized = false;

let redisClient: Redis | null = null;
let ipRatelimit: Ratelimit | null = null;
let emailRatelimit: Ratelimit | null = null;

const DEFAULT_HASH_SALT = 'thunspark_enquiry_guard_default_salt_2026';

function logBackendStateTransition(newState: BackendState, reason?: string): void {
  if (backendState !== newState) {
    backendState = newState;
    if (newState === 'redis') {
      console.info('[EnquiryGuard] Backend state: redis (distributed protection active)');
    } else if (newState === 'degraded') {
      console.warn(
        `[EnquiryGuard] Backend state: degraded (circuit breaker tripped for 10m; using memory fallback${
          reason ? `: ${reason}` : ''
        })`
      );
    } else if (newState === 'memory') {
      console.info('[EnquiryGuard] Backend state: memory (memory-only tier active)');
    }
  }
}

function getHashSalt(): string {
  const envSalt = process.env.ENQUIRY_HASH_SALT?.trim();
  if (!envSalt) {
    if (!warnedAboutSalt) {
      warnedAboutSalt = true;
      console.warn(
        '[EnquiryGuard] Warning: ENQUIRY_HASH_SALT is not set. Using default salt for identifier hashing.'
      );
    }
    return DEFAULT_HASH_SALT;
  }
  return envSalt;
}

/**
 * SHA-256 hash using the configured salt.
 * Guarantees that neither raw IP addresses nor raw email addresses are stored in Redis or logged.
 */
export function hashIdentifier(value: string): string {
  const salt = getHashSalt();
  return createHash('sha256')
    .update(`${salt}::${value.trim().toLowerCase()}`)
    .digest('hex');
}

/**
 * Safe client initialization without throwing at import time.
 */
function initializeRedis(): void {
  if (redisInitialized) return;
  redisInitialized = true;

  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim();

  if (!url || !token) {
    logBackendStateTransition('memory');
    return;
  }

  try {
    redisClient = new Redis({
      url,
      token,
    });

    // Per-IP limit: 10 requests per 15 minutes (fixedWindow costs 1 Redis command)
    ipRatelimit = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.fixedWindow(10, '15 m'),
      prefix: 'ts:enq:ip',
    });

    // Per-Email limit: 3 submissions per hour (fixedWindow costs 1 Redis command)
    emailRatelimit = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.fixedWindow(3, '1 h'),
      prefix: 'ts:enq:email',
    });

    logBackendStateTransition('redis');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Initialization error';
    console.error('[EnquiryGuard] Failed to configure Upstash Redis client:', message);
    redisClient = null;
    ipRatelimit = null;
    emailRatelimit = null;
    logBackendStateTransition('memory');
  }
}

/**
 * Timeout promise wrapper (800ms hard ceiling).
 */
async function withTimeout<T>(promise: Promise<T>, ms: number = REDIS_TIMEOUT_MS): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Redis timeout exceeded (${ms}ms)`)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

function isQuotaOrLimitError(err: unknown): boolean {
  if (!err) return false;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes('quota') ||
    msg.includes('limit exceeded') ||
    msg.includes('daily limit') ||
    msg.includes('rate limit') ||
    msg.includes('exceeded your') ||
    msg.includes('429') ||
    msg.includes('403') ||
    msg.includes('401')
  );
}

function handleRedisError(err: unknown): void {
  const isQuota = isQuotaOrLimitError(err);
  if (isQuota) {
    // Immediately trip circuit breaker on quota or authentication errors
    consecutiveFailures = CIRCUIT_BREAKER_FAIL_THRESHOLD;
    circuitOpenUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
    logBackendStateTransition('degraded', 'Upstash quota or authentication limit encountered');
    return;
  }

  consecutiveFailures += 1;
  if (consecutiveFailures >= CIRCUIT_BREAKER_FAIL_THRESHOLD) {
    circuitOpenUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
    logBackendStateTransition(
      'degraded',
      `${consecutiveFailures} consecutive Redis failures; cooling down for 10m`
    );
  }
}

function recordRedisSuccess(): void {
  consecutiveFailures = 0;
  if (circuitOpenUntil > 0) {
    circuitOpenUntil = 0;
    logBackendStateTransition('redis');
  }
}

/* ========================================================================== */
/* IN-MEMORY PROTECTION TIER (Free, Local, Safe Fallback)                     */
/* ========================================================================== */

function pruneExpiredCaches(now: number): void {
  if (inMemoryDedupeCache.size > IN_MEMORY_MAX_CACHE_ENTRIES) {
    for (const [key, expiresAt] of inMemoryDedupeCache.entries()) {
      if (expiresAt <= now) {
        inMemoryDedupeCache.delete(key);
      }
    }
  }
  if (inMemoryIpRateLimitCache.size > IN_MEMORY_MAX_CACHE_ENTRIES) {
    for (const [ip, entry] of inMemoryIpRateLimitCache.entries()) {
      if (entry.resetAt <= now) {
        inMemoryIpRateLimitCache.delete(ip);
      }
    }
  }
}

export function checkInMemoryRateLimit(clientIp: string): boolean {
  if (clientIp === 'unknown') return true;

  const now = Date.now();
  pruneExpiredCaches(now);

  const existing = inMemoryIpRateLimitCache.get(clientIp);
  if (!existing || existing.resetAt <= now) {
    inMemoryIpRateLimitCache.set(clientIp, {
      count: 1,
      resetAt: now + IN_MEMORY_RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (existing.count >= IN_MEMORY_MAX_REQUESTS_PER_IP) {
    return false;
  }

  existing.count += 1;
  return true;
}

export function checkInMemoryDedupe(email: string, businessChallenge: string): boolean {
  const now = Date.now();
  pruneExpiredCaches(now);

  const key = hashIdentifier(`${email.trim().toLowerCase()}::${businessChallenge.trim().toLowerCase()}`);
  const existingExpiry = inMemoryDedupeCache.get(key);
  return Boolean(existingExpiry && existingExpiry > now);
}

export function recordInMemoryDedupe(email: string, businessChallenge: string): void {
  const now = Date.now();
  const key = hashIdentifier(`${email.trim().toLowerCase()}::${businessChallenge.trim().toLowerCase()}`);
  inMemoryDedupeCache.set(key, now + IN_MEMORY_DEDUPE_TTL_MS);
}

/* ========================================================================== */
/* DURABLE REDIS TIER WITH CIRCUIT BREAKER                                     */
/* ========================================================================== */

export interface EnquiryGuardParams {
  clientIp: string;
  email: string;
  businessChallenge: string;
}

/**
 * Checks distributed rate limits and atomic deduplication.
 *
 * Command Cost Analysis:
 * - Blocked by IP limit: 1 Redis command
 * - Blocked by Email limit: 2 Redis commands
 * - Dedupe hit: 3 Redis commands (or 2 if IP unknown)
 * - Accepted submission: 3 Redis commands total (1 IP eval + 1 Email eval + 1 atomic SET NX EX 300)
 *
 * Resilience:
 * - If Redis is unavailable, credentials unset, timed out (>800ms), or circuit open,
 *   this function gracefully returns `{ allowed: true, fallback: true }`, allowing
 *   the request to proceed using the in-memory tier.
 */
export async function checkDurableEnquiryGuard(
  params: EnquiryGuardParams
): Promise<EnquiryGuardResult> {
  initializeRedis();

  // If no Redis configured, stay in memory mode
  if (!redisClient || !ipRatelimit || !emailRatelimit) {
    return { allowed: true, fallback: true };
  }

  const now = Date.now();

  // Circuit breaker: skip Redis if cooldown window is active
  if (circuitOpenUntil > now) {
    return { allowed: true, fallback: true };
  }

  try {
    const executeChecks = async (): Promise<EnquiryGuardResult> => {
      // 1. IP Rate Limiter (skip if IP is "unknown" to avoid shared-bucket starvation)
      if (params.clientIp !== 'unknown') {
        const hashedIp = hashIdentifier(params.clientIp);
        const ipRes = await ipRatelimit!.limit(hashedIp);
        if (!ipRes.success) {
          const retryAfter = Math.ceil((ipRes.reset - Date.now()) / 1000) || 60;
          return {
            allowed: false,
            reason: 'rate_limited',
            retryAfter,
            message: 'Too many requests from your network. Please wait a few minutes or email us directly below.',
          };
        }
      }

      // 2. Email Rate Limiter (3 submissions per hour per hashed email)
      const hashedEmail = hashIdentifier(params.email);
      const emailRes = await emailRatelimit!.limit(hashedEmail);
      if (!emailRes.success) {
        const retryAfter = Math.ceil((emailRes.reset - Date.now()) / 1000) || 60;
        return {
          allowed: false,
          reason: 'rate_limited',
          retryAfter,
          message:
            'Too many requests for this email address. Please wait before submitting again or email us directly below.',
        };
      }

      // 3. Atomic Dedupe Check: SET NX with 5-minute expiry (300 seconds)
      const dedupePayload = `${params.email.trim().toLowerCase()}::${params.businessChallenge.trim().toLowerCase()}`;
      const hashedDedupe = hashIdentifier(dedupePayload);
      const dedupeKey = `ts:enq:dedupe:${hashedDedupe}`;

      // SET key value EX 300 NX -> returns "OK" if set, null if already exists
      const setOutcome = await redisClient!.set(dedupeKey, '1', {
        ex: 300,
        nx: true,
      });

      if (!setOutcome) {
        return {
          allowed: false,
          reason: 'already_received',
          message:
            'We have already received your enquiry within the last few minutes. Our team is reviewing it and will reply shortly.',
        };
      }

      return { allowed: true };
    };

    const result = await withTimeout(executeChecks(), REDIS_TIMEOUT_MS);
    recordRedisSuccess();
    return result;
  } catch (err: unknown) {
    handleRedisError(err);
    // CRITICAL: Fail-open to in-memory tier. Never take down the contact form.
    return { allowed: true, fallback: true };
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  return realIp || 'unknown';
}

export function getEnquiryGuardState(): {
  backendState: BackendState;
  consecutiveFailures: number;
  circuitOpenUntil: number;
} {
  return {
    backendState,
    consecutiveFailures,
    circuitOpenUntil,
  };
}

/**
 * Testing hook to reset module state between test cases.
 */
export function _resetEnquiryGuardForTesting(): void {
  inMemoryDedupeCache.clear();
  inMemoryIpRateLimitCache.clear();
  consecutiveFailures = 0;
  circuitOpenUntil = 0;
  warnedAboutSalt = false;
  redisInitialized = false;
  redisClient = null;
  ipRatelimit = null;
  emailRatelimit = null;
  backendState = 'memory';
}
