import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { ScheduledPost } from "@/models";

const UpdateScheduledPostSchema = z.object({
  content: z.object({
    hook: z.string().min(1, "Hook is required"),
    thread: z.string().min(1, "Thread content is required"),
    platforms: z.array(z.enum(["facebook", "twitter", "linkedin", "instagram"])).min(1, "Select at least one platform"),
  }).optional(),
  scheduledAt: z.string().transform((val) => new Date(val)).optional(),
  recurrence: z.enum(["none", "daily", "weekly"]).optional(),
});

// GET - Get single scheduled post
export async function GET(
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

    return NextResponse.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error("Get scheduled post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scheduled post" },
      { status: 500 }
    );
  }
}

// PATCH - Update scheduled post
export async function PATCH(
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

    const body = await request.json();
    const validation = UpdateScheduledPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

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

    // Only allow updates to pending posts
    if (post.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Cannot update a post that has been published or failed" },
        { status: 400 }
      );
    }

    const { content, scheduledAt, recurrence } = validation.data;

    if (content) post.content = content;
    if (scheduledAt) {
      if (scheduledAt <= new Date()) {
        return NextResponse.json(
          { success: false, error: "Scheduled time must be in the future" },
          { status: 400 }
        );
      }
      post.scheduledAt = scheduledAt;
    }
    if (recurrence) post.recurrence = recurrence;

    await post.save();

    return NextResponse.json({
      success: true,
      data: { post },
      message: "Scheduled post updated",
    });
  } catch (error) {
    console.error("Update scheduled post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update scheduled post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete scheduled post
export async function DELETE(
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

    const post = await ScheduledPost.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Scheduled post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Scheduled post deleted",
    });
  } catch (error) {
    console.error("Delete scheduled post error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete scheduled post" },
      { status: 500 }
    );
  }
}
