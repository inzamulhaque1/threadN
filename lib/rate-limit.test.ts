import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  withRateLimit,
  getClientIp,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "./rate-limit";

describe("Rate Limiting", () => {
  describe("checkRateLimit", () => {
    const testConfig = { windowMs: 1000, maxRequests: 3 };

    it("should allow first request", () => {
      const result = checkRateLimit("test-new-1", testConfig);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(2);
      expect(result.limit).toBe(3);
    });

    it("should track multiple requests", () => {
      const identifier = "test-multi-" + Date.now();

      const r1 = checkRateLimit(identifier, testConfig);
      expect(r1.success).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit(identifier, testConfig);
      expect(r2.success).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit(identifier, testConfig);
      expect(r3.success).toBe(true);
      expect(r3.remaining).toBe(0);
    });

    it("should block requests over limit", () => {
      const identifier = "test-block-" + Date.now();

      // Use up all requests
      for (let i = 0; i < 3; i++) {
        checkRateLimit(identifier, testConfig);
      }

      // Should be blocked
      const result = checkRateLimit(identifier, testConfig);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should have valid resetAt timestamp", () => {
      const result = checkRateLimit("test-reset-" + Date.now(), testConfig);
      expect(result.resetAt).toBeGreaterThan(Date.now());
      expect(result.resetAt).toBeLessThanOrEqual(Date.now() + testConfig.windowMs + 100);
    });
  });

  describe("withRateLimit", () => {
    it("should return allowed true for new requests", () => {
      const result = withRateLimit("127.0.0.1", "test-endpoint-" + Date.now(), {
        windowMs: 60000,
        maxRequests: 10,
      });
      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it("should return headers object", () => {
      const result = withRateLimit("127.0.0.1", "test-headers-" + Date.now(), {
        windowMs: 60000,
        maxRequests: 10,
      });
      expect(result.headers).toBeDefined();
      expect(result.headers["X-RateLimit-Limit"]).toBe("10");
    });

    it("should include retryAfter when blocked", () => {
      const identifier = "blocked-" + Date.now();
      const config = { windowMs: 60000, maxRequests: 1 };

      // Use up the limit
      withRateLimit("127.0.0.1", identifier, config);

      // Should be blocked
      const result = withRateLimit("127.0.0.1", identifier, config);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
    });
  });

  describe("getClientIp", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "203.0.113.195, 70.41.3.18, 150.172.238.178");
      expect(getClientIp(headers)).toBe("203.0.113.195");
    });

    it("should extract IP from x-real-ip header", () => {
      const headers = new Headers();
      headers.set("x-real-ip", "203.0.113.195");
      expect(getClientIp(headers)).toBe("203.0.113.195");
    });

    it("should return 'unknown' when no headers", () => {
      const headers = new Headers();
      expect(getClientIp(headers)).toBe("unknown");
    });

    it("should prefer x-forwarded-for over x-real-ip", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "1.1.1.1");
      headers.set("x-real-ip", "2.2.2.2");
      expect(getClientIp(headers)).toBe("1.1.1.1");
    });
  });

  describe("getRateLimitHeaders", () => {
    it("should return correct header format", () => {
      const result = {
        success: true,
        limit: 100,
        remaining: 50,
        resetAt: Date.now() + 60000,
      };
      const headers = getRateLimitHeaders(result);

      expect(headers["X-RateLimit-Limit"]).toBe("100");
      expect(headers["X-RateLimit-Remaining"]).toBe("50");
      expect(headers["X-RateLimit-Reset"]).toBeDefined();
    });
  });

  describe("RATE_LIMIT_CONFIGS", () => {
    it("should have all required config types", () => {
      expect(RATE_LIMIT_CONFIGS.generation).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.auth).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.api).toBeDefined();
      expect(RATE_LIMIT_CONFIGS.admin).toBeDefined();
    });

    it("should have auth config more restrictive than api", () => {
      expect(RATE_LIMIT_CONFIGS.auth.maxRequests).toBeLessThanOrEqual(
        RATE_LIMIT_CONFIGS.api.maxRequests
      );
    });

    it("should have generation config restrictive for expensive ops", () => {
      expect(RATE_LIMIT_CONFIGS.generation.maxRequests).toBeLessThanOrEqual(20);
    });
  });
});
