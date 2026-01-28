"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Flame,
  Zap,
  Edit3,
  Layers,
  BookOpen,
  Award,
  Calendar,
  FileText,
  Folder,
  GitBranch,
  Share2,
  Lock,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { Card } from "@/components/ui";
import { achievementsApi } from "@/lib/api";

interface AchievementData {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: string;
  icon: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  progressPercent: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalDaysActive: number;
  isActive: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  "edit-3": Edit3,
  layers: Layers,
  "book-open": BookOpen,
  award: Award,
  flame: Flame,
  calendar: Calendar,
  "file-text": FileText,
  folder: Folder,
  "git-branch": GitBranch,
  "share-2": Share2,
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [achievementsResult, streakResult] = await Promise.all([
      achievementsApi.list(),
      achievementsApi.getStreak(),
    ]);

    if (achievementsResult.success && achievementsResult.data) {
      const data = achievementsResult.data as {
        achievements: AchievementData[];
        totalXP: number;
        unlockedCount: number;
        totalCount: number;
      };
      setAchievements(data.achievements || []);
      setTotalXP(data.totalXP || 0);
      setUnlockedCount(data.unlockedCount || 0);
      setTotalCount(data.totalCount || 0);
    } else {
      setError(achievementsResult.error || "Failed to fetch achievements");
    }

    if (streakResult.success && streakResult.data) {
      setStreak(streakResult.data as StreakData);
    }

    setIsLoading(false);
  };

  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);

  const categories = [
    { id: "all", name: "All", icon: Trophy },
    { id: "generation", name: "Generation", icon: Zap },
    { id: "streaks", name: "Streaks", icon: Flame },
    { id: "engagement", name: "Engagement", icon: Award },
    { id: "milestones", name: "Milestones", icon: Share2 },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "generation":
        return "text-purple-400";
      case "streaks":
        return "text-orange-400";
      case "engagement":
        return "text-cyan-400";
      case "milestones":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="h-full font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Achievements</h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mt-1">Track your progress and earn rewards</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-mono font-bold text-purple-400">{totalXP}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-accent">Total XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400">{unlockedCount}/{totalCount}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-accent">Unlocked</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Streak Card */}
          <div className="lg:col-span-3">
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Flame className={`w-7 h-7 sm:w-8 sm:h-8 ${streak?.isActive ? "text-orange-400 animate-pulse" : "text-gray-500"}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                      <span className="font-mono">{streak?.currentStreak || 0}</span>
                      <span className="text-base sm:text-lg text-gray-400 ml-2 font-accent">day streak</span>
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base font-accent">
                      {streak?.isActive
                        ? "Keep it going! Generate content today."
                        : "Start a new streak by generating content today!"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:gap-8 text-center">
                  <div>
                    <p className="text-xl sm:text-2xl font-mono font-bold text-orange-400">{streak?.longestStreak || 0}</p>
                    <p className="text-xs sm:text-sm text-gray-500 font-accent">Longest Streak</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-mono font-bold text-cyan-400">{streak?.totalDaysActive || 0}</p>
                    <p className="text-xs sm:text-sm text-gray-500 font-accent">Total Days Active</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? "bg-purple-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Achievements Grid */}
          {filteredAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Trophy;
            return (
              <Card
                key={achievement.id}
                className={`p-4 transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border-purple-500/30"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.unlocked
                        ? "bg-purple-500/20"
                        : "bg-gray-800"
                    }`}
                  >
                    {achievement.unlocked ? (
                      <Icon className={`w-6 h-6 ${getCategoryColor(achievement.category)}`} />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{achievement.name}</h3>
                      <span className="text-sm font-bold text-purple-400">+{achievement.xp} XP</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>

                    {/* Progress Bar */}
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.requirement}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                            style={{ width: `${achievement.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Unlocked Date */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="flex items-center gap-1 text-xs text-green-400 mt-2">
                        <Check className="w-3 h-3" />
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
