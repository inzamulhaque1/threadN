import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Favorite, Generation } from "@/models";

const CreateFavoriteSchema = z.object({
  generationId: z.string().min(1, "Generation ID is required"),
  collectionId: z.string().nullable().optional().default(null),
  notes: z.string().max(500, "Notes too long").optional().default(""),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
});

// GET - List favorites
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
    const collectionId = searchParams.get("collectionId");
    const tag = searchParams.get("tag");

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id };

    if (collectionId) {
      query.collectionId = collectionId === "uncategorized" ? null : collectionId;
    }

    if (tag) {
      query.tags = tag;
    }

    const favorites = await Favorite.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Get generation details for each favorite
    const generationIds = favorites.map(f => f.generationId);
    const generations = await Generation.find({
      _id: { $in: generationIds },
    }).lean();

    const generationMap = new Map(generations.map(g => [g._id.toString(), g]));

    const favoritesWithGenerations = favorites.map(f => ({
      ...f,
      generation: generationMap.get(f.generationId) || null,
    }));

    return NextResponse.json({
      success: true,
      data: { favorites: favoritesWithGenerations },
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
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
    const validation = CreateFavoriteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { generationId, collectionId, notes, tags } = validation.data;

    // Verify generation exists and belongs to user
    const generation = await Generation.findOne({
      _id: generationId,
      userId: session.user.id,
    });

    if (!generation) {
      return NextResponse.json(
        { success: false, error: "Generation not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: session.user.id,
      generationId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await Favorite.create({
      userId: session.user.id,
      generationId,
      collectionId,
      notes,
      tags,
    });

    return NextResponse.json({
      success: true,
      data: { favorite },
      message: "Added to favorites",
    });
  } catch (error) {
    console.error("Create favorite error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}
