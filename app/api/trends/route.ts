import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/next-auth";
import { withRateLimit, getClientIp, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

// Validation schemas
const GetTrendsSchema = z.object({
  country: z.string().length(2).regex(/^[A-Z]{2}$/).default("US"),
  category: z.enum(["all", "entertainment", "sports", "business", "technology", "health", "science"]).default("all"),
});

const PostTrendsSchema = z.object({
  keyword: z.string().min(2).max(100).regex(/^[\w\s\-.,!?]+$/i, "Invalid characters in keyword"),
  country: z.string().length(2).regex(/^[A-Z]{2}$/).default("US"),
});

// Request timeout in milliseconds
const FETCH_TIMEOUT = 10000;

// Simple in-memory cache
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// Fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Categories for filtering
const CATEGORIES: Record<string, string> = {
  all: "",
  entertainment: "entertainment",
  sports: "sports",
  business: "business",
  technology: "technology",
  health: "health",
  science: "science",
};

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimit = withRateLimit(clientIp, "trends-get", RATE_LIMIT_CONFIGS.api);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests", code: "RATE_LIMITED" },
        { status: 429, headers: rateLimit.headers }
      );
    }

    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to access trends" },
        { status: 401 }
      );
    }

    // Validate input
    const { searchParams } = new URL(request.url);
    const validation = GetTrendsSchema.safeParse({
      country: searchParams.get("country") || "US",
      category: searchParams.get("category") || "all",
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { country, category } = validation.data;

    // Check cache first
    const cacheKey = `trends:${country}:${category}`;
    const cached = getCached<{
      googleTrends: TrendResult[];
      youtubeTrends: TrendResult[];
      redditTrends: TrendResult[];
      hackerNews: TrendResult[];
    }>(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        data: {
          ...cached,
          lastUpdated: new Date().toISOString(),
          cached: true,
        },
      });
    }

    // Fetch all trends in parallel with timeout protection
    const [googleTrends, youtubeTrends, redditTrends, hackerNews] = await Promise.all([
      fetchGoogleTrendsRSS(country),
      fetchYouTubeTrending(country),
      fetchRedditTrends(category),
      fetchHackerNewsTrends(),
    ]);

    // Filter Google trends by category if specified
    const filteredGoogle = category !== "all"
      ? filterByCategory(googleTrends, category)
      : googleTrends;

    // Cache the results
    const resultData = {
      googleTrends: filteredGoogle,
      youtubeTrends,
      redditTrends,
      hackerNews,
    };
    setCache(cacheKey, resultData);

    return NextResponse.json({
      success: true,
      data: {
        ...resultData,
        lastUpdated: new Date().toISOString(),
        cached: false,
      },
    });
  } catch (error) {
    console.error("Trends error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}

// Filter trends by category based on keywords
function filterByCategory(trends: TrendResult[], category: string): TrendResult[] {
  const categoryKeywords: Record<string, string[]> = {
    entertainment: ["movie", "film", "show", "music", "actor", "singer", "celebrity", "netflix", "disney", "hulu", "tv", "series", "album", "concert"],
    sports: ["game", "nfl", "nba", "mlb", "soccer", "football", "basketball", "baseball", "team", "player", "championship", "super bowl", "match", "score"],
    business: ["stock", "market", "company", "ceo", "business", "economy", "trade", "investment", "earnings", "ipo", "merger"],
    technology: ["ai", "tech", "apple", "google", "microsoft", "software", "app", "phone", "computer", "robot", "crypto", "bitcoin"],
    health: ["health", "covid", "vaccine", "doctor", "hospital", "disease", "medical", "treatment", "drug", "fda"],
    science: ["science", "space", "nasa", "research", "study", "discovery", "climate", "planet", "species"],
  };

  const keywords = categoryKeywords[category] || [];
  if (keywords.length === 0) return trends;

  return trends.filter(trend => {
    const text = (trend.title + " " + (trend.articles?.map(a => a.title).join(" ") || "")).toLowerCase();
    return keywords.some(kw => text.includes(kw));
  });
}

// Google Trends via RSS
async function fetchGoogleTrendsRSS(country: string): Promise<TrendResult[]> {
  try {
    const response = await fetchWithTimeout(`https://trends.google.com/trending/rss?geo=${country}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Google RSS status:", response.status);
      return [];
    }

    const xml = await response.text();
    const trends: TrendResult[] = [];
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const item of items.slice(0, 25)) {
      const title = extractCDATA(item, "title") || extractTag(item, "title");
      const traffic = extractTag(item, "ht:approx_traffic");
      const picture = extractTag(item, "ht:picture");

      const newsItems = item.match(/<ht:news_item>([\s\S]*?)<\/ht:news_item>/g) || [];
      const articles = newsItems.slice(0, 2).map(news => ({
        title: extractCDATA(news, "ht:news_item_title") || extractTag(news, "ht:news_item_title"),
        url: extractCDATA(news, "ht:news_item_url") || extractTag(news, "ht:news_item_url"),
        source: extractTag(news, "ht:news_item_source"),
      })).filter(a => a.title && a.url);

      if (title) {
        trends.push({
          title: title.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
          traffic: traffic || "",
          image: picture || null,
          articles,
          source: "google",
        });
      }
    }

    return trends;
  } catch (error) {
    console.error("Google Trends error:", error);
    return [];
  }
}

// YouTube Trending - scrape trending page directly
async function fetchYouTubeTrending(country: string): Promise<TrendResult[]> {
  try {
    const response = await fetchWithTimeout(`https://www.youtube.com/feed/trending?gl=${country}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("YouTube trending status:", response.status);
      return [];
    }

    const html = await response.text();
    const trends: TrendResult[] = [];

    // Extract video data from ytInitialData
    const dataMatch = html.match(/ytInitialData\s*=\s*({[\s\S]*?});\s*<\/script>/);
    if (dataMatch) {
      try {
        const data = JSON.parse(dataMatch[1]);
        const tabs = data.contents?.twoColumnBrowseResultsRenderer?.tabs || [];

        for (const tab of tabs) {
          const contents = tab.tabRenderer?.content?.sectionListRenderer?.contents || [];
          for (const section of contents) {
            const items = section.itemSectionRenderer?.contents || [];
            for (const item of items) {
              const video = item.videoRenderer;
              if (video) {
                trends.push({
                  title: video.title?.runs?.[0]?.text || "",
                  url: `https://www.youtube.com/watch?v=${video.videoId}`,
                  image: `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
                  author: video.ownerText?.runs?.[0]?.text || "",
                  views: parseViews(video.viewCountText?.simpleText || ""),
                  source: "youtube",
                });
              }
            }
          }
        }
      } catch {
        // JSON parse failed
      }
    }

    return trends.slice(0, 15);
  } catch (error) {
    console.error("YouTube Trends error:", error);
    return [];
  }
}

function parseViews(text: string): number {
  const match = text.match(/([\d,.]+)/);
  if (!match) return 0;
  return parseInt(match[1].replace(/[,.]/g, ""), 10) || 0;
}

// Reddit Trending - use RSS feed (JSON API requires OAuth now)
async function fetchRedditTrends(category: string): Promise<TrendResult[]> {
  try {
    const subreddits: Record<string, string> = {
      all: "popular",
      entertainment: "entertainment+movies+television+Music",
      sports: "sports+nfl+nba+soccer",
      business: "business+stocks+wallstreetbets+finance",
      technology: "technology+programming+gadgets",
      health: "health+fitness+nutrition",
      science: "science+space+environment",
    };

    const sub = subreddits[category] || "popular";

    const response = await fetchWithTimeout(`https://www.reddit.com/r/${sub}/.rss?limit=20`, {
      headers: {
        "User-Agent": "ThreadSmith/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Reddit RSS status:", response.status);
      return [];
    }

    const xml = await response.text();
    const trends: TrendResult[] = [];

    // Parse Atom feed entries
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];

    for (const entry of entries.slice(0, 20)) {
      const title = extractTag(entry, "title");
      const link = entry.match(/<link[^>]*href="([^"]+)"[^>]*\/>/)?.[1] || "";
      const author = entry.match(/<name>([^<]+)<\/name>/)?.[1]?.replace("/u/", "") || "";
      const subreddit = entry.match(/label="r\/([^"]+)"/)?.[1] || "";
      const thumbnail = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] || null;

      if (title) {
        trends.push({
          title,
          subreddit,
          author,
          url: link,
          image: thumbnail,
          source: "reddit",
        });
      }
    }

    return trends;
  } catch (error) {
    console.error("Reddit error:", error);
    return [];
  }
}

// Hacker News
async function fetchHackerNewsTrends(): Promise<TrendResult[]> {
  try {
    const idsResponse = await fetchWithTimeout("https://hacker-news.firebaseio.com/v0/topstories.json", {
      cache: "no-store",
    });

    if (!idsResponse.ok) return [];

    const ids = await idsResponse.json();
    const topIds = ids.slice(0, 15); // Reduced from 20 to limit parallel requests

    const stories = await Promise.all(
      topIds.map(async (id: number) => {
        try {
          const res = await fetchWithTimeout(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return res.json();
        } catch {
          return null;
        }
      })
    );

    return stories
      .filter((s): s is NonNullable<typeof s> => s !== null && s.title)
      .map((story) => ({
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        points: story.score || 0,
        author: story.by || "unknown",
        comments: story.descendants || 0,
        image: null,
        source: "hackernews",
      }));
  } catch (error) {
    console.error("Hacker News error:", error);
    return [];
  }
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractCDATA(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

interface TrendResult {
  title: string;
  traffic?: string;
  image: string | null;
  articles?: { title: string; url: string; source: string }[];
  source: string;
  points?: number;
  author?: string;
  comments?: number;
  url?: string;
  subreddit?: string;
  score?: number;
  views?: number;
}

// POST - Search keyword/niche trends
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (stricter for keyword search)
    const clientIp = getClientIp(request.headers);
    const rateLimit = withRateLimit(clientIp, "trends-search", {
      windowMs: 60 * 1000,
      maxRequests: 10, // 10 searches per minute
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests", code: "RATE_LIMITED" },
        { status: 429, headers: rateLimit.headers }
      );
    }

    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to search trends" },
        { status: 401 }
      );
    }

    // Validate and sanitize input
    const body = await request.json();
    const validation = PostTrendsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { keyword, country } = validation.data;

    // Check cache
    const cacheKey = `keyword:${keyword.toLowerCase()}:${country}`;
    const cached = getCached<{
      relatedQueries: { top: unknown[]; rising: unknown[] };
      interestOverTime: unknown[];
    }>(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        data: {
          keyword,
          ...cached,
          cached: true,
        },
      });
    }

    const [relatedQueries, interestOverTime] = await Promise.all([
      fetchRelatedQueries(keyword, country),
      fetchInterestOverTime(keyword, country),
    ]);

    // Cache results
    const resultData = { relatedQueries, interestOverTime };
    setCache(cacheKey, resultData);

    return NextResponse.json({
      success: true,
      data: {
        keyword,
        relatedQueries,
        interestOverTime,
        cached: false,
      },
    });
  } catch (error) {
    console.error("Keyword trends error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch keyword trends" },
      { status: 500 }
    );
  }
}

async function fetchRelatedQueries(keyword: string, country: string) {
  try {
    const googleTrends = await import("google-trends-api");
    const results = await googleTrends.default.relatedQueries({
      keyword,
      geo: country,
    });

    const parsed = JSON.parse(results);
    const defaultData = parsed.default;

    return {
      top: (defaultData?.rankedList?.[0]?.rankedKeyword || []).slice(0, 10).map((item: { query: string; value: number }) => ({
        query: item.query,
        value: item.value,
      })),
      rising: (defaultData?.rankedList?.[1]?.rankedKeyword || []).slice(0, 10).map((item: { query: string; formattedValue: string }) => ({
        query: item.query,
        growth: item.formattedValue,
      })),
    };
  } catch (error) {
    console.error("Related queries error:", error);
    return { top: [], rising: [] };
  }
}

async function fetchInterestOverTime(keyword: string, country: string) {
  try {
    const googleTrends = await import("google-trends-api");
    const results = await googleTrends.default.interestOverTime({
      keyword,
      geo: country,
    });

    const parsed = JSON.parse(results);
    const timeline = parsed.default?.timelineData || [];

    return timeline.slice(-30).map((point: { formattedTime: string; value: number[] }) => ({
      time: point.formattedTime,
      value: point.value?.[0] || 0,
    }));
  } catch (error) {
    console.error("Interest over time error:", error);
    return [];
  }
}
