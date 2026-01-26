/**
 * In-memory rate limiter for API protection
 * Tracks requests by IP address with sliding window
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
}

// In-memory store (consider Redis for production with multiple instances)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Default configs for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // Strict limit for AI generation (expensive operations)
  generation: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 10,      // 10 requests per minute
  },
  // Auth endpoints (prevent brute force)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,          // 10 attempts per 15 minutes
  },
  // General API endpoints
  api: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 60,      // 60 requests per minute
  },
  // Admin endpoints
  admin: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 100,     // 100 requests per minute
  },
} as const;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP + endpoint)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success status and headers info
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No existing entry or window expired - create new
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Within window - check limit
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
  // Check common proxy headers
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback
  return "unknown";
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
  };
}

/**
 * Middleware helper for API routes
 * Returns null if allowed, or Response if rate limited
 */
export function withRateLimit(
  ip: string,
  endpoint: string,
  config: RateLimitConfig
): { allowed: boolean; headers: Record<string, string>; retryAfter?: number } {
  const identifier = `${ip}:${endpoint}`;
  const result = checkRateLimit(identifier, config);
  const headers = getRateLimitHeaders(result);

  if (!result.success) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    return {
      allowed: false,
      headers,
      retryAfter,
    };
  }

  return {
    allowed: true,
    headers,
  };
}
