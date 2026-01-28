import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { SharedCard } from "@/models";

const CreateShareSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(500, "Description too long").optional().default(""),
  threadBody: z.string().optional().default(""),
  templateName: z.string().optional().default(""),
});

// POST - Create shared card
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    // Allow sharing without login, but track userId if logged in
    const userId = session?.user?.id || null;

    await dbConnect();

    const body = await request.json();
    const validation = CreateShareSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { imageData, title, description, threadBody, templateName } = validation.data;

    // Generate unique ID for the share link
    const uniqueId = nanoid(10);

    const sharedCard = await SharedCard.create({
      uniqueId,
      userId,
      imageData,
      title,
      description,
      threadBody,
      templateName,
      views: 0,
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://threadn.launchory.org"}/share/${uniqueId}`;

    return NextResponse.json({
      success: true,
      data: {
        shareId: uniqueId,
        shareUrl,
        card: {
          _id: sharedCard._id,
          uniqueId: sharedCard.uniqueId,
          title: sharedCard.title,
          description: sharedCard.description,
          createdAt: sharedCard.createdAt,
        },
      },
      message: "Card shared successfully",
    });
  } catch (error) {
    console.error("Create share error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to share card" },
      { status: 500 }
    );
  }
}

// GET - List user's shared cards
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to view your shared cards" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [sharedCards, total] = await Promise.all([
      SharedCard.find({ userId: session.user.id })
        .select("-imageData") // Don't send large image data in list
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SharedCard.countDocuments({ userId: session.user.id }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        sharedCards,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get shared cards error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shared cards" },
      { status: 500 }
    );
  }
}
