import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { UserAchievement, UserStreak, User, Generation, Template, Collection, ScheduledPost } from "@/models";
import { ACHIEVEMENTS } from "@/types";

// GET - Get user's achievements and progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to continue" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get unlocked achievements
    const unlockedAchievements = await UserAchievement.find({
      userId: session.user.id,
    }).lean();

    const unlockedMap = new Map(
      unlockedAchievements.map(a => [a.achievementId, a])
    );

    // Get user stats for progress calculation
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get streak info
    const streak = await UserStreak.findOne({ userId: session.user.id });

    // Get counts for various achievements
    const [templateCount, collectionCount, scheduledCount] = await Promise.all([
      Template.countDocuments({ userId: session.user.id }),
      Collection.countDocuments({ userId: session.user.id }),
      ScheduledPost.countDocuments({ userId: session.user.id }),
    ]);

    // Build progress for each achievement
    const achievementsWithProgress = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
      const unlocked = unlockedMap.get(id);
      let progress = 0;

      // Calculate progress based on achievement type
      switch (id) {
        case "first_hook":
        case "hooks_10":
        case "hooks_100":
          progress = Math.min(user.usage.totalHooks, achievement.requirement);
          break;
        case "first_thread":
        case "threads_10":
          progress = Math.min(user.usage.totalThreads, achievement.requirement);
          break;
        case "streak_3":
        case "streak_7":
        case "streak_30":
          progress = Math.min(streak?.currentStreak || 0, achievement.requirement);
          break;
        case "first_template":
          progress = Math.min(templateCount, achievement.requirement);
          break;
        case "first_collection":
          progress = Math.min(collectionCount, achievement.requirement);
          break;
        case "first_schedule":
          progress = Math.min(scheduledCount, achievement.requirement);
          break;
        default:
          progress = unlocked ? achievement.requirement : 0;
      }

      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt || null,
        progress,
        progressPercent: Math.round((progress / achievement.requirement) * 100),
      };
    });

    // Calculate total XP
    const totalXP = achievementsWithProgress
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xp, 0);

    // Group by category
    const byCategory = {
      generation: achievementsWithProgress.filter(a => a.category === "generation"),
      streaks: achievementsWithProgress.filter(a => a.category === "streaks"),
      engagement: achievementsWithProgress.filter(a => a.category === "engagement"),
      milestones: achievementsWithProgress.filter(a => a.category === "milestones"),
    };

    return NextResponse.json({
      success: true,
      data: {
        achievements: achievementsWithProgress,
        byCategory,
        totalXP,
        unlockedCount: unlockedAchievements.length,
        totalCount: Object.keys(ACHIEVEMENTS).length,
      },
    });
  } catch (error) {
    console.error("Get achievements error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
