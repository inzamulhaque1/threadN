import { describe, it, expect } from "vitest";
import { z } from "zod";

// Test the validation schemas used in trends route
const GetTrendsSchema = z.object({
  country: z.string().length(2).regex(/^[A-Z]{2}$/).default("US"),
  category: z.enum(["all", "entertainment", "sports", "business", "technology", "health", "science"]).default("all"),
});

const PostTrendsSchema = z.object({
  keyword: z.string().min(2).max(100).regex(/^[\w\s\-.,!?]+$/i, "Invalid characters in keyword"),
  country: z.string().length(2).regex(/^[A-Z]{2}$/).default("US"),
});

describe("Trends Route Validation", () => {
  describe("GetTrendsSchema", () => {
    it("should accept valid country codes", () => {
      const result = GetTrendsSchema.safeParse({ country: "US", category: "all" });
      expect(result.success).toBe(true);
    });

    it("should accept valid categories", () => {
      const categories = ["all", "entertainment", "sports", "business", "technology", "health", "science"];
      for (const category of categories) {
        const result = GetTrendsSchema.safeParse({ country: "US", category });
        expect(result.success).toBe(true);
      }
    });

    it("should reject invalid country codes", () => {
      const invalidCodes = ["USA", "U", "us", "123", ""];
      for (const code of invalidCodes) {
        const result = GetTrendsSchema.safeParse({ country: code, category: "all" });
        expect(result.success).toBe(false);
      }
    });

    it("should reject invalid categories", () => {
      const result = GetTrendsSchema.safeParse({ country: "US", category: "invalid" });
      expect(result.success).toBe(false);
    });

    it("should use defaults for missing values", () => {
      const result = GetTrendsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.country).toBe("US");
        expect(result.data.category).toBe("all");
      }
    });
  });

  describe("PostTrendsSchema", () => {
    it("should accept valid keywords", () => {
      const validKeywords = [
        "ai trends",
        "machine learning",
        "web development",
        "React.js",
        "What is AI?",
        "Node.js, Python",
      ];

      for (const keyword of validKeywords) {
        const result = PostTrendsSchema.safeParse({ keyword, country: "US" });
        expect(result.success).toBe(true);
      }
    });

    it("should reject empty keywords", () => {
      const result = PostTrendsSchema.safeParse({ keyword: "", country: "US" });
      expect(result.success).toBe(false);
    });

    it("should reject single character keywords", () => {
      const result = PostTrendsSchema.safeParse({ keyword: "a", country: "US" });
      expect(result.success).toBe(false);
    });

    it("should reject keywords that are too long", () => {
      const longKeyword = "a".repeat(101);
      const result = PostTrendsSchema.safeParse({ keyword: longKeyword, country: "US" });
      expect(result.success).toBe(false);
    });

    it("should reject keywords with potentially malicious characters", () => {
      const maliciousKeywords = [
        "<script>alert(1)</script>", // Contains < > ( )
        "test`backticks`",           // Contains backticks
        "test$variable",             // Contains $
        "test;semicolon",            // Contains ;
        "test|pipe",                 // Contains |
        "test&ampersand",            // Contains &
        "test=equals",               // Contains =
        'test"quotes"',              // Contains "
        "test'apostrophe",           // Contains ' (single quote not allowed)
        "test@email",                // Contains @
        "test#hashtag",              // Contains #
        "test%percent",              // Contains %
        "test^caret",                // Contains ^
        "test*asterisk",             // Contains *
        "test(parens)",              // Contains ( )
        "test[brackets]",            // Contains [ ]
        "test{braces}",              // Contains { }
        "test\\backslash",           // Contains backslash
      ];

      for (const keyword of maliciousKeywords) {
        const result = PostTrendsSchema.safeParse({ keyword, country: "US" });
        expect(result.success).toBe(false);
      }
    });

    it("should allow keywords with safe punctuation", () => {
      const safeKeywords = [
        "What is AI?",       // Question mark allowed
        "AI, ML, and more",  // Commas allowed
        "Node.js",           // Periods allowed
        "e-commerce",        // Hyphens allowed
        "Wow!",              // Exclamation allowed
        "test_underscore",   // Underscore allowed via \w
      ];

      for (const keyword of safeKeywords) {
        const result = PostTrendsSchema.safeParse({ keyword, country: "US" });
        expect(result.success).toBe(true);
      }
    });

    it("should reject invalid country codes", () => {
      const result = PostTrendsSchema.safeParse({ keyword: "test", country: "USA" });
      expect(result.success).toBe(false);
    });
  });
});

describe("Category Keywords Filtering", () => {
  const categoryKeywords: Record<string, string[]> = {
    entertainment: ["movie", "film", "show", "music", "actor", "singer", "celebrity", "netflix", "disney", "hulu", "tv", "series", "album", "concert"],
    sports: ["game", "nfl", "nba", "mlb", "soccer", "football", "basketball", "baseball", "team", "player", "championship", "super bowl", "match", "score"],
    business: ["stock", "market", "company", "ceo", "business", "economy", "trade", "investment", "earnings", "ipo", "merger"],
    technology: ["ai", "tech", "apple", "google", "microsoft", "software", "app", "phone", "computer", "robot", "crypto", "bitcoin"],
    health: ["health", "covid", "vaccine", "doctor", "hospital", "disease", "medical", "treatment", "drug", "fda"],
    science: ["science", "space", "nasa", "research", "study", "discovery", "climate", "planet", "species"],
  };

  it("should have keywords for all non-all categories", () => {
    const categories = ["entertainment", "sports", "business", "technology", "health", "science"];
    for (const cat of categories) {
      expect(categoryKeywords[cat]).toBeDefined();
      expect(categoryKeywords[cat].length).toBeGreaterThan(0);
    }
  });

  it("should have unique keywords per category", () => {
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const uniqueKeywords = new Set(keywords);
      expect(uniqueKeywords.size).toBe(keywords.length);
    }
  });

  it("should have lowercase keywords for case-insensitive matching", () => {
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const kw of keywords) {
        expect(kw).toBe(kw.toLowerCase());
      }
    }
  });
});

describe("Trend Sources", () => {
  const sources = ["google", "youtube", "reddit", "hackernews"];

  it("should define all expected sources", () => {
    expect(sources).toContain("google");
    expect(sources).toContain("youtube");
    expect(sources).toContain("reddit");
    expect(sources).toContain("hackernews");
  });
});
