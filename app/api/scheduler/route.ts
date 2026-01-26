import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { ScheduledPost } from "@/models";
import { checkAndUnlockAchievement } from "@/lib/achievements";

const CreateScheduledPostSchema = z.object({
  content: z.object({
    hook: z.string().min(1, "Hook is required"),
    thread: z.string().min(1, "Thread content is required"),
    platforms: z.array(z.enum(["facebook", "twitter", "linkedin", "instagram"])).min(1, "Select at least one platform"),
  }),
  scheduledAt: z.string().transform((val) => new Date(val)),
  recurrence: z.enum(["none", "daily", "weekly"]).optional().default("none"),
});

// GET - List scheduled posts
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.scheduledAt = {};
      if (startDate) {
        (query.scheduledAt as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.scheduledAt as Record<string, Date>).$lte = new Date(endDate);
      }
    }

    const posts = await ScheduledPost.find(query)
      .sort({ scheduledAt: 1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    console.error("Get scheduled posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scheduled posts" },
      { status: 500 }
    );
  }
}

// POST - Create scheduled post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to continue" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validation = CreateScheduledPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { content, scheduledAt, recurrence } = validation.data;

    // Validate scheduled time is in the future
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { success: false, error: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    const post = await ScheduledPost.create({
      userId: session.user.id,
      content,
      scheduledAt,
      recurrence,
      status: "pending",
    });

    // Check for first schedule achievement
    await checkAndUnlockAchievement(session.user.id, "first_schedule");

    return NextResponse.json({
      success: true,
      data: { post },
      message: "Post scheduled successfully",
    });
  } catch (error) {
    console.error("Create scheduled post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to schedule post" },
      { status: 500 }
    );
  }
}
