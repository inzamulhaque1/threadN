"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  History,
  Crown,
  Coins,
  TrendingUp,
  FileText,
  ArrowRight,
  Ticket,
  Flame,
  Trophy,
  Calendar,
  Heart,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  GitBranch,
  Share2,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
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
    <div className="w-full">
      {/* Welcome Header with Streak */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(" ")[0] || "Creator"}!
          </h1>
          <p className="text-gray-400 mt-1">
            Here's your content creation dashboard
          </p>
        </div>

        {/* Streak Badge */}
        {streak && (
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${
              streak.isActive
                ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
                : "bg-white/5 border border-white/10"
            }`}>
              <Flame className={`w-8 h-8 ${streak.isActive ? "text-orange-400 animate-pulse" : "text-gray-500"}`} />
              <div>
                <p className="text-2xl font-bold text-white">{streak.currentStreak}</p>
                <p className="text-xs text-gray-400">day streak</p>
              </div>
            </div>
            {streak.currentStreak > 0 && streak.currentStreak === streak.longestStreak && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
                Personal Best!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="col-span-1">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 rounded-xl bg-purple-500/20 mb-3">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{dailyUsed}/{limits.dailyThreads}</p>
            <p className="text-xs text-gray-400">Daily Threads</p>
            <div className="w-full mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="col-span-1">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 rounded-xl bg-yellow-500/20 mb-3">
              <Coins className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold">{user?.coins ?? 0}</p>
            <p className="text-xs text-gray-400">Coins</p>
          </div>
        </Card>

        <Card className="col-span-1">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 rounded-xl bg-green-500/20 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold">{user?.usage?.totalThreads ?? 0}</p>
            <p className="text-xs text-gray-400">Total Threads</p>
          </div>
        </Card>

        <Card className="col-span-1">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 rounded-xl bg-cyan-500/20 mb-3">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold">{user?.usage?.totalHooks ?? 0}</p>
            <p className="text-xs text-gray-400">Total Hooks</p>
          </div>
        </Card>

        <Card className="col-span-1">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 rounded-xl bg-pink-500/20 mb-3">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-2xl font-bold">{favoritesCount}</p>
            <p className="text-xs text-gray-400">Favorites</p>
          </div>
        </Card>

        <Card className="col-span-1">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 rounded-xl bg-indigo-500/20 mb-3">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold">{templatesCount}</p>
            <p className="text-xs text-gray-400">Templates</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/dashboard/generate">
              <Card className="hover-lift cursor-pointer group h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Generate Content</h3>
                    <p className="text-sm text-gray-400">Create viral hooks and threads</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/scheduler">
              <Card className="hover-lift cursor-pointer group h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Schedule Posts</h3>
                    <p className="text-sm text-gray-400">Plan your content calendar</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/templates">
              <Card className="hover-lift cursor-pointer group h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Templates</h3>
                    <p className="text-sm text-gray-400">Use or create templates</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/favorites">
              <Card className="hover-lift cursor-pointer group h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-red-500/20 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Favorites</h3>
                    <p className="text-sm text-gray-400">Access saved content</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Achievements Progress */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Achievements
          </h2>

          <Card className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20">
            {achievementProgress ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-yellow-400">{achievementProgress.totalXP}</p>
                    <p className="text-xs text-gray-400">Total XP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{achievementProgress.unlockedCount}/{achievementProgress.totalCount}</p>
                    <p className="text-xs text-gray-400">Unlocked</p>
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: `${(achievementProgress.unlockedCount / achievementProgress.totalCount) * 100}%` }}
                  />
                </div>

                {achievementProgress.recentUnlocks.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Recent Unlocks:</p>
                    <div className="space-y-2">
                      {achievementProgress.recentUnlocks.map((unlock) => (
                        <div key={unlock.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{unlock.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/dashboard/achievements">
                  <Button variant="glass" size="sm" className="w-full mt-4">
                    View All Achievements
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-yellow-500 mx-auto" />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Scheduled Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Upcoming Posts
            </h2>
            <Link href="/dashboard/scheduler" className="text-sm text-purple-400 hover:text-purple-300">
              View all
            </Link>
          </div>

          <Card>
            {upcomingPosts.length > 0 ? (
              <div className="space-y-3">
                {upcomingPosts.map((post) => (
                  <div key={post._id} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{post.content.hook}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.scheduledAt).toLocaleDateString()} at {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No scheduled posts</p>
                <Link href="/dashboard/scheduler">
                  <Button variant="ghost" size="sm" className="mt-2">
                    Schedule your first post
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            New Features
          </h2>

          <Card>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">A/B Hook Variations</p>
                  <p className="text-xs text-gray-500">Test different hook angles</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Multi-Platform Format</p>
                  <p className="text-xs text-gray-500">Facebook, Twitter, LinkedIn, Instagram</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Streak System</p>
                  <p className="text-xs text-gray-500">Build daily habits, earn achievements</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Content Templates</p>
                  <p className="text-xs text-gray-500">Save and reuse your best formats</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Plan Info & Redeem Code */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Redeem Code */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pink-500/20">
              <Ticket className="w-6 h-6 text-pink-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Have an access code?</h3>
              <p className="text-sm text-gray-400">
                Redeem for coins, features, or plan upgrades
              </p>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="glass" size="sm">
                Redeem
              </Button>
            </Link>
          </div>
        </Card>

        {/* Plan Upgrade */}
        {user?.plan === "free" && (
          <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-cyan-500/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-400">Upgrade Your Plan</h3>
                <p className="text-sm text-gray-400">
                  Get more threads, full history, and premium features
                </p>
              </div>
              <Link href="/#pricing">
                <Button size="sm">
                  View Plans
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {user?.plan !== "free" && (
          <Card className="border-green-500/30 bg-gradient-to-r from-green-500/5 to-cyan-500/5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Crown className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-400 capitalize">{user?.plan} Plan</h3>
                <p className="text-sm text-gray-400">
                  {limits.dailyThreads} threads/day • {limits.historyDays} days history
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
