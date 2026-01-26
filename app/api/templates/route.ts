import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Template } from "@/models";
import { checkAndUnlockAchievement } from "@/lib/achievements";

const CreateTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional().default(""),
  category: z.enum(["hook", "thread", "full"]),
  content: z.object({
    hookTemplate: z.string().optional().default(""),
    threadTemplate: z.string().optional().default(""),
    variables: z.array(z.object({
      name: z.string(),
      description: z.string().optional().default(""),
      defaultValue: z.string().optional().default(""),
    })).optional().default([]),
  }),
  isPublic: z.boolean().optional().default(false),
});

// GET - List templates
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
    const category = searchParams.get("category");
    const type = searchParams.get("type"); // "my" | "public" | "all"

    // Build query for user's templates and public templates
    let query: Record<string, unknown> = {};

    if (type === "my") {
      query.userId = session.user.id;
    } else if (type === "public") {
      query.isPublic = true;
    } else {
      // Default: user's templates + public templates
      query.$or = [
        { userId: session.user.id },
        { isPublic: true },
      ];
    }

    if (category) {
      query.category = category;
    }

    const templates = await Template.find(query)
      .sort({ usageCount: -1, createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      data: { templates },
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST - Create template
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
    const validation = CreateTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, category, content, isPublic } = validation.data;

    // Check for duplicate name for this user
    const existing = await Template.findOne({
      userId: session.user.id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "You already have a template with this name" },
        { status: 400 }
      );
    }

    const template = await Template.create({
      userId: session.user.id,
      name,
      description,
      category,
      content,
      isPublic,
      usageCount: 0,
    });

    // Check for first template achievement
    await checkAndUnlockAchievement(session.user.id, "first_template");

    return NextResponse.json({
      success: true,
      data: { template },
      message: "Template created successfully",
    });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    );
  }
}
