import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { UserStreak } from "@/models";

// GET - Get current streak info
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

    let streak = await UserStreak.findOne({ userId: session.user.id });

    // Create streak record if doesn't exist
    if (!streak) {
      streak = await UserStreak.create({
        userId: session.user.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        totalDaysActive: 0,
      });
    }

    // Check if streak is broken (more than 24 hours since last activity)
    let isActive = false;
    if (streak.lastActivityDate) {
      const now = new Date();
      const lastActivity = new Date(streak.lastActivityDate);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastActivityDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
      const daysDiff = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));

      isActive = daysDiff <= 1;

      // If streak is broken but not yet updated
      if (daysDiff > 1 && streak.currentStreak > 0) {
        streak.currentStreak = 0;
        await streak.save();
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        totalDaysActive: streak.totalDaysActive,
        isActive,
      },
    });
  } catch (error) {
    console.error("Get streak error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch streak info" },
      { status: 500 }
    );
  }
}
