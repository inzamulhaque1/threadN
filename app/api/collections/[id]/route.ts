import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Collection, Favorite } from "@/models";

const UpdateCollectionSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(30).optional(),
});

// GET - Get single collection
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

    const collection = await Collection.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    // Get favorite count
    const favoriteCount = await Favorite.countDocuments({
      userId: session.user.id,
      collectionId: id,
    });

    return NextResponse.json({
      success: true,
      data: {
        collection: {
          ...collection.toObject(),
          favoriteCount,
        },
      },
    });
  } catch (error) {
    console.error("Get collection error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

// PATCH - Update collection
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
    const validation = UpdateCollectionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const collection = await Collection.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    const { name, description, color, icon } = validation.data;

    // Check for duplicate name if name is being changed
    if (name && name !== collection.name) {
      const existing = await Collection.findOne({
        userId: session.user.id,
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: "Collection with this name already exists" },
          { status: 400 }
        );
      }
    }

    if (name !== undefined) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (color !== undefined) collection.color = color;
    if (icon !== undefined) collection.icon = icon;

    await collection.save();

    return NextResponse.json({
      success: true,
      data: { collection },
      message: "Collection updated",
    });
  } catch (error) {
    console.error("Update collection error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

// DELETE - Delete collection
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

    const collection = await Collection.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    // Move favorites from this collection to uncategorized
    await Favorite.updateMany(
      { userId: session.user.id, collectionId: id },
      { collectionId: null }
    );

    return NextResponse.json({
      success: true,
      message: "Collection deleted",
    });
  } catch (error) {
    console.error("Delete collection error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
