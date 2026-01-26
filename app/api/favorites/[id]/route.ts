import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Favorite } from "@/models";

const UpdateFavoriteSchema = z.object({
  collectionId: z.string().nullable().optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

// PATCH - Update favorite
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
    const validation = UpdateFavoriteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const favorite = await Favorite.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: "Favorite not found" },
        { status: 404 }
      );
    }

    const { collectionId, notes, tags } = validation.data;

    if (collectionId !== undefined) favorite.collectionId = collectionId;
    if (notes !== undefined) favorite.notes = notes;
    if (tags !== undefined) favorite.tags = tags;

    await favorite.save();

    return NextResponse.json({
      success: true,
      data: { favorite },
      message: "Favorite updated",
    });
  } catch (error) {
    console.error("Update favorite error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update favorite" },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
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

    const favorite = await Favorite.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Delete favorite error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
