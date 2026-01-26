import dbConnect from "@/lib/db";
import { UserAchievement, UserStreak, User, Template, Collection, ScheduledPost } from "@/models";
import { ACHIEVEMENTS } from "@/types";

export interface AchievementUnlockResult {
  unlocked: boolean;
  achievement?: typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS];
  isNew?: boolean;
}

/**
 * Check if a user qualifies for an achievement and unlock it if so
 */
export async function checkAndUnlockAchievement(
  userId: string,
  achievementId: string
): Promise<AchievementUnlockResult> {
  await dbConnect();

  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) {
    return { unlocked: false };
  }

  // Check if already unlocked
  const existing = await UserAchievement.findOne({
    userId,
    achievementId,
  });

  if (existing) {
    return { unlocked: true, achievement, isNew: false };
  }

  // Create new achievement
  await UserAchievement.create({
    userId,
    achievementId,
    unlockedAt: new Date(),
    progress: achievement.requirement,
  });

  return { unlocked: true, achievement, isNew: true };
}

/**
 * Check all achievements for a user based on their current stats
 */
export async function checkAllAchievements(userId: string): Promise<AchievementUnlockResult[]> {
  await dbConnect();

  const results: AchievementUnlockResult[] = [];

  // Get user stats
  const user = await User.findById(userId);
  if (!user) return results;

  const streak = await UserStreak.findOne({ userId });

  // Get counts
  const [templateCount, collectionCount, scheduledCount] = await Promise.all([
    Template.countDocuments({ userId }),
    Collection.countDocuments({ userId }),
    ScheduledPost.countDocuments({ userId }),
  ]);

  // Check generation achievements
  if (user.usage.totalHooks >= 1) {
    results.push(await checkAndUnlockAchievement(userId, "first_hook"));
  }
  if (user.usage.totalHooks >= 10) {
    results.push(await checkAndUnlockAchievement(userId, "hooks_10"));
  }
  if (user.usage.totalHooks >= 100) {
    results.push(await checkAndUnlockAchievement(userId, "hooks_100"));
  }
  if (user.usage.totalThreads >= 1) {
    results.push(await checkAndUnlockAchievement(userId, "first_thread"));
  }
  if (user.usage.totalThreads >= 10) {
    results.push(await checkAndUnlockAchievement(userId, "threads_10"));
  }

  // Check streak achievements
  if (streak) {
    if (streak.currentStreak >= 3) {
      results.push(await checkAndUnlockAchievement(userId, "streak_3"));
    }
    if (streak.currentStreak >= 7) {
      results.push(await checkAndUnlockAchievement(userId, "streak_7"));
    }
    if (streak.currentStreak >= 30) {
      results.push(await checkAndUnlockAchievement(userId, "streak_30"));
    }
  }

  // Check feature achievements
  if (templateCount >= 1) {
    results.push(await checkAndUnlockAchievement(userId, "first_template"));
  }
  if (collectionCount >= 1) {
    results.push(await checkAndUnlockAchievement(userId, "first_collection"));
  }
  if (scheduledCount >= 1) {
    results.push(await checkAndUnlockAchievement(userId, "first_schedule"));
  }

  return results.filter(r => r.isNew);
}

/**
 * Record activity and update streak
 */
export async function recordActivityAndUpdateStreak(userId: string): Promise<{
  streak: { currentStreak: number; longestStreak: number };
  isNewDay: boolean;
  streakBroken: boolean;
  newAchievements: AchievementUnlockResult[];
}> {
  await dbConnect();

  // Get or create streak record
  let streak = await UserStreak.findOne({ userId });
  if (!streak) {
    streak = await UserStreak.create({
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      totalDaysActive: 0,
    });
  }

  // Record activity
  const result = streak.recordActivity();
  await streak.save();

  // Check streak achievements if it's a new day
  const newAchievements: AchievementUnlockResult[] = [];
  if (result.isNewDay) {
    if (streak.currentStreak >= 3) {
      const r = await checkAndUnlockAchievement(userId, "streak_3");
      if (r.isNew) newAchievements.push(r);
    }
    if (streak.currentStreak >= 7) {
      const r = await checkAndUnlockAchievement(userId, "streak_7");
      if (r.isNew) newAchievements.push(r);
    }
    if (streak.currentStreak >= 30) {
      const r = await checkAndUnlockAchievement(userId, "streak_30");
      if (r.isNew) newAchievements.push(r);
    }
  }

  return {
    streak: {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
    },
    isNewDay: result.isNewDay,
    streakBroken: result.streakBroken,
    newAchievements,
  };
}

/**
 * Get user's total XP from achievements
 */
export async function getUserXP(userId: string): Promise<number> {
  await dbConnect();

  const unlockedAchievements = await UserAchievement.find({ userId });

  return unlockedAchievements.reduce((sum, ua) => {
    const achievement = ACHIEVEMENTS[ua.achievementId];
    return sum + (achievement?.xp || 0);
  }, 0);
}
