import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { ScheduledPost } from "@/models";

// POST - Manually publish a scheduled post now
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to continue" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const post = await ScheduledPost.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    if (post.status === "published") {
      return NextResponse.json(
        { success: false, error: "Post has already been published" },
        { status: 400 }
      );
    }

    // Mark as published
    // Note: Actual publishing to platforms would require platform API integrations
    post.status = "published";
    post.publishedAt = new Date();
    await post.save();

    // If recurring, create the next scheduled post
    if (post.recurrence !== "none") {
      const nextDate = new Date(post.scheduledAt);
      if (post.recurrence === "daily") {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (post.recurrence === "weekly") {
        nextDate.setDate(nextDate.getDate() + 7);
      }

      await ScheduledPost.create({
        userId: post.userId,
        content: post.content,
        scheduledAt: nextDate,
        recurrence: post.recurrence,
        status: "pending",
      });
    }

    return NextResponse.json({
      success: true,
      data: { post },
      message: "Post published successfully",
    });
  } catch (error) {
    console.error("Publish post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish post" },
      { status: 500 }
    );
  }
}
