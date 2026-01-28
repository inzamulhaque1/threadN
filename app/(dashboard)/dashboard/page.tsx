"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Crown,
  Coins,
  TrendingUp,
  FileText,
  Ticket,
  Flame,
  Trophy,
  Calendar,
  Heart,
  Zap,
  Target,
  Clock,
  CheckCircle,
  GitBranch,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { PLAN_LIMITS, ACHIEVEMENTS } from "@/types";
import { achievementsApi, schedulerApi, favoritesApi, templatesApi } from "@/lib/api";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  isActive: boolean;
}

interface ScheduledPostData {
  _id: string;
  content: { hook: string };
  scheduledAt: string;
  status: string;
}

interface AchievementProgress {
  unlockedCount: number;
  totalCount: number;
  totalXP: number;
  recentUnlocks: Array<{ id: string; name: string; unlockedAt: string }>;
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const limits = PLAN_LIMITS[user?.plan || "free"];
  const dailyUsed = user?.usage?.dailyThreads || 0;
  const dailyRemaining = limits.dailyThreads - dailyUsed;
  const usagePercent = (dailyUsed / limits.dailyThreads) * 100;

  const [streak, setStreak] = useState<StreakData | null>(null);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress | null>(null);
  const [upcomingPosts, setUpcomingPosts] = useState<ScheduledPostData[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    const [streakRes, achievementsRes, schedulerRes, favoritesRes, templatesRes] = await Promise.all([
      achievementsApi.getStreak(),
      achievementsApi.list(),
      schedulerApi.list("pending"),
      favoritesApi.list(),
      templatesApi.list(undefined, "my"),
    ]);

    if (streakRes.success && streakRes.data) {
      setStreak(streakRes.data as StreakData);
    }

    if (achievementsRes.success && achievementsRes.data) {
      const data = achievementsRes.data as {
        unlockedCount: number;
        totalCount: number;
        totalXP: number;
        achievements: Array<{ id: string; name: string; unlocked: boolean; unlockedAt: string | null }>;
      };
      const recentUnlocks = data.achievements
        .filter((a) => a.unlocked && a.unlockedAt)
        .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
        .slice(0, 3)
        .map((a) => ({ id: a.id, name: a.name, unlockedAt: a.unlockedAt! }));

      setAchievementProgress({
        unlockedCount: data.unlockedCount,
        totalCount: data.totalCount,
        totalXP: data.totalXP,
        recentUnlocks,
      });
    }

    if (schedulerRes.success && schedulerRes.data) {
      const posts = (schedulerRes.data as { posts: ScheduledPostData[] }).posts || [];
      setUpcomingPosts(posts.slice(0, 3));
    }

    if (favoritesRes.success && favoritesRes.data) {
      const favorites = (favoritesRes.data as { favorites: unknown[] }).favorites || [];
      setFavoritesCount(favorites.length);
    }

    if (templatesRes.success && templatesRes.data) {
      const templates = (templatesRes.data as { templates: unknown[] }).templates || [];
      setTemplatesCount(templates.length);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full font-body">
      {/* Welcome Header with Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Creator"}!
          </h1>
          <p className="text-gray-400 text-base mt-1 font-accent">
            Here's your content creation dashboard
          </p>
        </div>

        {/* Streak Badge */}
        {streak && (
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${
              streak.isActive
                ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
                : "bg-white/5 border border-white/10"
            }`}>
              <Flame className={`w-7 h-7 ${streak.isActive ? "text-orange-400 animate-pulse" : "text-gray-500"}`} />
              <div>
                <p className="text-2xl font-bold font-mono text-white">{streak.currentStreak}</p>
                <p className="text-xs text-gray-400 -mt-0.5">day streak</p>
              </div>
            </div>
            {streak.currentStreak > 0 && streak.currentStreak === streak.longestStreak && (
              <span className="hidden sm:inline px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">
                Best!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-purple-500/20 mb-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">{dailyUsed}/{limits.dailyThreads}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-accent">Daily</p>
            <div className="w-full mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-yellow-500/20 mb-3">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">{user?.coins ?? 0}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-accent">Coins</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-green-500/20 mb-3">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">{user?.usage?.totalThreads ?? 0}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-accent">Threads</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-cyan-500/20 mb-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">{user?.usage?.totalHooks ?? 0}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-accent">Hooks</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-pink-500/20 mb-3">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">{favoritesCount}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-accent">Favorites</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-500/20 mb-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">{templatesCount}</p>
            <p className="text-xs sm:text-sm text-gray-400 font-accent">Templates</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-heading font-semibold text-gray-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Link href="/dashboard/generate">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/[0.05] hover:border-purple-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/20 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-base text-white">Generate</h3>
                    <p className="text-sm text-gray-500 font-accent hidden sm:block">Create viral content</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/scheduler">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20 group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-base text-white">Schedule</h3>
                    <p className="text-sm text-gray-500 font-accent hidden sm:block">Plan your posts</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/templates">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-base text-white">Templates</h3>
                    <p className="text-sm text-gray-500 font-accent hidden sm:block">Saved formats</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/favorites">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/[0.05] hover:border-pink-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-pink-500/20 group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-base text-white">Favorites</h3>
                    <p className="text-sm text-gray-500 font-accent hidden sm:block">Saved content</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Achievements Progress */}
        <div className="space-y-4">
          <h2 className="text-base font-heading font-semibold text-gray-300 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Achievements
          </h2>

          <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-xl p-5">
            {achievementProgress ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold font-mono text-yellow-400">{achievementProgress.totalXP}</p>
                    <p className="text-xs text-gray-500 font-accent">Total XP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold font-mono text-white">{achievementProgress.unlockedCount}/{achievementProgress.totalCount}</p>
                    <p className="text-xs text-gray-500 font-accent">Unlocked</p>
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: `${(achievementProgress.unlockedCount / achievementProgress.totalCount) * 100}%` }}
                  />
                </div>

                {achievementProgress.recentUnlocks.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-accent mb-2">Recent:</p>
                    <div className="space-y-1.5">
                      {achievementProgress.recentUnlocks.slice(0, 2).map((unlock) => (
                        <div key={unlock.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 truncate font-accent">{unlock.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/dashboard/achievements">
                  <Button variant="glass" size="sm" className="w-full h-10">
                    View All
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-yellow-500 mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Upcoming Scheduled Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-semibold text-gray-300 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Upcoming Posts
            </h2>
            <Link href="/dashboard/scheduler" className="text-sm text-purple-400 hover:text-purple-300 font-accent">
              View all
            </Link>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            {upcomingPosts.length > 0 ? (
              <div className="space-y-3">
                {upcomingPosts.map((post) => (
                  <div key={post._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate font-accent">{post.content.hook}</p>
                      <p className="text-xs text-gray-500 font-accent">
                        {new Date(post.scheduledAt).toLocaleDateString()} at {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded font-medium">
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm font-accent">No scheduled posts</p>
                <Link href="/dashboard/scheduler">
                  <Button variant="ghost" size="sm" className="mt-3">
                    Schedule post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <h2 className="text-base font-heading font-semibold text-gray-300 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Features
          </h2>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <GitBranch className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-300 font-accent">A/B Hooks</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-gray-300 font-accent">Multi-Platform</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-gray-300 font-accent">Streaks</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-gray-300 font-accent">Templates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Info & Redeem Code */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Redeem Code */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pink-500/20">
              <Ticket className="w-6 h-6 text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-base text-white">Have a code?</h3>
              <p className="text-sm text-gray-500 font-accent">Redeem for coins or upgrades</p>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="glass" size="sm">
                Redeem
              </Button>
            </Link>
          </div>
        </div>

        {/* Plan Info */}
        {user?.plan === "free" ? (
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-base text-purple-400">Upgrade Plan</h3>
                <p className="text-sm text-gray-500 font-accent">Get more features</p>
              </div>
              <Link href="/#pricing">
                <Button size="sm">
                  Upgrade
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Crown className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-base text-green-400 capitalize">{user?.plan} Plan</h3>
                <p className="text-sm text-gray-500 font-accent">{limits.dailyThreads}/day • {limits.historyDays}d history</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
