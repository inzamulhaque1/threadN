import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Collection, Favorite } from "@/models";
import { checkAndUnlockAchievement } from "@/lib/achievements";

const CreateCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  description: z.string().max(200, "Description too long").optional().default(""),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional().default("#8b5cf6"),
  icon: z.string().max(30).optional().default("folder"),
});

// GET - List collections
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

    const collections = await Collection.find({ userId: session.user.id })
      .sort({ name: 1 })
      .lean();

    // Get favorite counts for each collection
    const collectionIds = collections.map(c => c._id.toString());
    const favoriteCounts = await Favorite.aggregate([
      {
        $match: {
          userId: session.user.id,
          collectionId: { $in: collectionIds },
        },
      },
      {
        $group: {
          _id: "$collectionId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(favoriteCounts.map(c => [c._id, c.count]));

    // Get uncategorized count
    const uncategorizedCount = await Favorite.countDocuments({
      userId: session.user.id,
      collectionId: null,
    });

    const collectionsWithCounts = collections.map(c => ({
      ...c,
      favoriteCount: countMap.get(c._id.toString()) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        collections: collectionsWithCounts,
        uncategorizedCount,
      },
    });
  } catch (error) {
    console.error("Get collections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

// POST - Create collection
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
    const validation = CreateCollectionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, color, icon } = validation.data;

    // Check for duplicate name
    const existing = await Collection.findOne({
      userId: session.user.id,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Collection with this name already exists" },
        { status: 400 }
      );
    }

    const collection = await Collection.create({
      userId: session.user.id,
      name,
      description,
      color,
      icon,
    });

    // Check for first collection achievement
    await checkAndUnlockAchievement(session.user.id, "first_collection");

    return NextResponse.json({
      success: true,
      data: { collection },
      message: "Collection created",
    });
  } catch (error) {
    console.error("Create collection error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
