"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Globe,
  RefreshCw,
  ExternalLink,
  Flame,
  Search,
  Clock,
  BarChart3,
  Hash,
  Sparkles,
  ArrowUpRight,
  Loader2,
  MessageCircle,
  ArrowUp,
  Zap,
  Code,
  Play,
  Eye,
  Users,
  Filter,
} from "lucide-react";
import { Button, Input, Card } from "@/components/ui";

interface TrendItem {
  title: string;
  traffic?: string;
  image?: string | null;
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

interface TrendsData {
  googleTrends: TrendItem[];
  youtubeTrends: TrendItem[];
  redditTrends: TrendItem[];
  hackerNews: TrendItem[];
  lastUpdated: string;
}

interface RelatedQueries {
  top: { query: string; value: number }[];
  rising: { query: string; growth: string }[];
}

interface KeywordData {
  keyword: string;
  relatedQueries: RelatedQueries;
  interestOverTime: { time: string; value: number }[];
}

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
];

const CATEGORIES = [
  { id: "all", name: "All", icon: "🌐" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "health", name: "Health", icon: "🏥" },
  { id: "science", name: "Science", icon: "🔬" },
];

const NICHES = [
  "Marketing", "AI & Tech", "Entrepreneurship", "Finance", "Fitness",
  "Crypto", "E-commerce", "Social Media", "Productivity", "Self-improvement",
];

export default function TrendsPage() {
  const [country, setCountry] = useState("US");
  const [category, setCategory] = useState("all");
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [keywordData, setKeywordData] = useState<KeywordData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"google" | "youtube" | "reddit" | "hackernews" | "niche">("google");

  useEffect(() => {
    fetchTrends();
  }, [country, category]);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trends?country=${country}&category=${category}`);
      const data = await res.json();
      if (data.success) {
        setTrends(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch trends:", error);
    }
    setIsLoading(false);
  };

  const refreshTrends = async () => {
    setIsRefreshing(true);
    await fetchTrends();
    setIsRefreshing(false);
  };

  const searchNiche = async (keyword: string) => {
    if (!keyword.trim()) return;

    setIsSearching(true);
    setActiveTab("niche");

    try {
      const res = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, country }),
      });
      const data = await res.json();
      if (data.success) {
        setKeywordData(data.data);
        setSelectedNiche(keyword);
      }
    } catch (error) {
      console.error("Failed to search niche:", error);
    }
    setIsSearching(false);
  };

  const handleNicheClick = (niche: string) => {
    setSearchKeyword(niche);
    searchNiche(niche);
  };

  const getSelectedCountry = () => COUNTRIES.find(c => c.code === country);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Live Trends
          </h1>
          <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3" />
            Real-time from Google, YouTube, Reddit & Hacker News
            {trends?.lastUpdated && (
              <span className="text-gray-500">
                • {new Date(trends.lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={refreshTrends}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            <Globe className="w-3 h-3 inline mr-1" />
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input-dark text-sm"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            <Filter className="w-3 h-3 inline mr-1" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-dark text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Niche Search */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            <Search className="w-3 h-3 inline mr-1" />
            Search Niche
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., AI, Crypto..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchNiche(searchKeyword)}
              className="text-sm"
            />
            <Button
              size="sm"
              onClick={() => searchNiche(searchKeyword)}
              disabled={isSearching || !searchKeyword.trim()}
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Niches */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => (
            <button
              key={niche}
              onClick={() => handleNicheClick(niche)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedNiche === niche
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {niche}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/10 pb-2 overflow-x-auto">
        <TabButton
          active={activeTab === "google"}
          onClick={() => setActiveTab("google")}
          icon={<Flame className="w-4 h-4" />}
          label="Google"
          count={trends?.googleTrends?.length}
          color="blue"
        />
        <TabButton
          active={activeTab === "youtube"}
          onClick={() => setActiveTab("youtube")}
          icon={<Play className="w-4 h-4" />}
          label="YouTube"
          count={trends?.youtubeTrends?.length}
          color="red"
        />
        <TabButton
          active={activeTab === "reddit"}
          onClick={() => setActiveTab("reddit")}
          icon={<Users className="w-4 h-4" />}
          label="Reddit"
          count={trends?.redditTrends?.length}
          color="orange"
        />
        <TabButton
          active={activeTab === "hackernews"}
          onClick={() => setActiveTab("hackernews")}
          icon={<Code className="w-4 h-4" />}
          label="HN"
          count={trends?.hackerNews?.length}
          color="amber"
        />
        {keywordData && (
          <TabButton
            active={activeTab === "niche"}
            onClick={() => setActiveTab("niche")}
            icon={<Hash className="w-4 h-4" />}
            label={selectedNiche || "Niche"}
            color="purple"
          />
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState country={getSelectedCountry()} />
      ) : (
        <>
          {activeTab === "google" && <GoogleTrends trends={trends?.googleTrends || []} country={getSelectedCountry()?.name} />}
          {activeTab === "youtube" && <YouTubeTrends trends={trends?.youtubeTrends || []} />}
          {activeTab === "reddit" && <RedditTrends trends={trends?.redditTrends || []} />}
          {activeTab === "hackernews" && <HackerNewsTrends trends={trends?.hackerNews || []} />}
          {activeTab === "niche" && keywordData && <NicheAnalysis data={keywordData} onSearch={searchNiche} setSearchKeyword={setSearchKeyword} />}
        </>
      )}

      {/* CTA */}
      <Card className="mt-6 p-4 border-purple-500/30 bg-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <div>
              <p className="font-semibold">Create Content from Trends</p>
              <p className="text-sm text-gray-400">Generate viral hooks from trending topics</p>
            </div>
          </div>
          <Button size="sm" onClick={() => window.location.href = "/dashboard/generate"}>
            Generate
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Tab Button
function TabButton({ active, onClick, icon, label, count, color }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: active ? "bg-blue-500/20 text-blue-400 border-blue-500" : "",
    red: active ? "bg-red-500/20 text-red-400 border-red-500" : "",
    orange: active ? "bg-orange-500/20 text-orange-400 border-orange-500" : "",
    amber: active ? "bg-amber-500/20 text-amber-400 border-amber-500" : "",
    purple: active ? "bg-purple-500/20 text-purple-400 border-purple-500" : "",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
        active ? `${colors[color]} border-b-2` : "text-gray-400 hover:text-white"
      }`}
    >
      {icon}
      {label}
      {count !== undefined && count > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${active ? `bg-${color}-500/30` : "bg-white/10"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// Loading State
function LoadingState({ country }: { country?: { flag: string; name: string } }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-green-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
        <TrendingUp className="w-6 h-6 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-gray-400 mt-4">Fetching live trends...</p>
      {country && <p className="text-gray-500 text-sm">{country.flag} {country.name}</p>}
    </div>
  );
}

// Google Trends
function GoogleTrends({ trends, country }: { trends: TrendItem[]; country?: string }) {
  if (trends.length === 0) {
    return (
      <Card className="p-8 text-center">
        <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No Google trends found{country ? ` for ${country}` : ""}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {trends.map((trend, i) => (
        <Card key={i} className="p-4 hover:border-blue-500/30 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-blue-400">#{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">{trend.title}</h3>
                  {trend.traffic && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-sm font-bold rounded-full mt-1">
                      <ArrowUp className="w-3 h-3" />
                      {trend.traffic}
                    </span>
                  )}
                </div>
                {trend.image && (
                  <img src={trend.image} alt="" className="w-20 h-14 rounded-lg object-cover shrink-0" onError={(e) => e.currentTarget.style.display = "none"} />
                )}
              </div>
              {trend.articles && trend.articles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                  {trend.articles.map((a, j) => (
                    <a key={j} href={a.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{a.title}</span>
                      <span className="text-gray-600 shrink-0">({a.source})</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// YouTube Trends
function YouTubeTrends({ trends }: { trends: TrendItem[] }) {
  if (trends.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Play className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No YouTube trends available</p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trends.map((trend, i) => (
        <a key={i} href={trend.url} target="_blank" rel="noopener noreferrer" className="block">
          <Card className="p-0 overflow-hidden hover:border-red-500/30 transition-all group">
            <div className="relative">
              {trend.image && (
                <img src={trend.image} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-white text-sm line-clamp-2">{trend.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="text-red-400">{trend.author}</span>
                {trend.views !== undefined && trend.views > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViews(trend.views)}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
  return views.toString();
}

// Reddit Trends
function RedditTrends({ trends }: { trends: TrendItem[] }) {
  if (trends.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No Reddit trends available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {trends.map((trend, i) => (
        <Card key={i} className="p-4 hover:border-orange-500/30 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0 w-12">
              <ArrowUp className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold text-orange-500">
                {trend.score ? (trend.score >= 1000 ? `${(trend.score / 1000).toFixed(1)}k` : trend.score) : 0}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <a href={trend.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-orange-400 line-clamp-2">
                {trend.title}
              </a>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="text-orange-400">r/{trend.subreddit}</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {trend.comments}
                </span>
              </div>
            </div>
            {trend.image && (
              <img src={trend.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" onError={(e) => e.currentTarget.style.display = "none"} />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// Hacker News Trends
function HackerNewsTrends({ trends }: { trends: TrendItem[] }) {
  if (trends.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Code className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No Hacker News trends available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {trends.map((trend, i) => (
        <Card key={i} className="p-4 hover:border-amber-500/30 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0 w-12">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">{trend.points}</span>
            </div>
            <div className="flex-1 min-w-0">
              <a href={trend.url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-amber-400 line-clamp-2">
                {trend.title}
              </a>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="text-amber-400">by {trend.author}</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {trend.comments}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Niche Analysis
function NicheAnalysis({ data, onSearch, setSearchKeyword }: {
  data: KeywordData;
  onSearch: (keyword: string) => void;
  setSearchKeyword: (keyword: string) => void;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="font-semibold text-green-400 flex items-center gap-2 mb-4">
          <ArrowUpRight className="w-5 h-5" />
          Rising Searches
        </h3>
        {data.relatedQueries.rising.length > 0 ? (
          <div className="space-y-2">
            {data.relatedQueries.rising.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                onClick={() => { setSearchKeyword(item.query); onSearch(item.query); }}
              >
                <span className="text-sm">{item.query}</span>
                <span className="text-xs text-green-400 font-bold">{item.growth}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No rising queries</p>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-purple-400 flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" />
          Top Searches
        </h3>
        {data.relatedQueries.top.length > 0 ? (
          <div className="space-y-2">
            {data.relatedQueries.top.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                onClick={() => { setSearchKeyword(item.query); onSearch(item.query); }}
              >
                <span className="text-sm">{item.query}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No top queries</p>
        )}
      </Card>

      {data.interestOverTime.length > 0 && (
        <Card className="p-4 lg:col-span-2">
          <h3 className="font-semibold text-cyan-400 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            Interest Over Time - "{data.keyword}"
          </h3>
          <div className="flex items-end gap-1 h-32">
            {data.interestOverTime.map((point, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-t relative group"
                style={{ height: `${point.value}%` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 z-10">
                  <div className="bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap border border-white/10">
                    {point.time}: {point.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
