import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { SharedCard } from "@/models";

const UpdateShareSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(500, "Description too long").optional().default(""),
  threadBody: z.string().optional().default(""),
  templateName: z.string().optional().default(""),
});

// GET - Get shared card by uniqueId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    const sharedCard = await SharedCard.findOne({ uniqueId: id });

    if (!sharedCard) {
      return NextResponse.json(
        { success: false, error: "Shared card not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await SharedCard.updateOne(
      { uniqueId: id },
      { $inc: { views: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: {
        card: {
          uniqueId: sharedCard.uniqueId,
          imageData: sharedCard.imageData,
          title: sharedCard.title,
          description: sharedCard.description,
          threadBody: sharedCard.threadBody || "",
          templateName: sharedCard.templateName,
          views: sharedCard.views + 1,
          createdAt: sharedCard.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get shared card error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch shared card" },
      { status: 500 }
    );
  }
}

// PUT - Update shared card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    await dbConnect();

    // Find the shared card
    const sharedCard = await SharedCard.findOne({ uniqueId: id });

    if (!sharedCard) {
      return NextResponse.json(
        { success: false, error: "Shared card not found" },
        { status: 404 }
      );
    }

    // Check if user owns this share (if they were logged in when creating)
    if (sharedCard.userId && session?.user?.id !== sharedCard.userId) {
      return NextResponse.json(
        { success: false, error: "You don't have permission to update this share" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = UpdateShareSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { imageData, title, description, threadBody, templateName } = validation.data;

    // Update the shared card
    await SharedCard.updateOne(
      { uniqueId: id },
      {
        $set: {
          imageData,
          title,
          description,
          threadBody,
          templateName,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Share updated successfully",
    });
  } catch (error) {
    console.error("Update shared card error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update shared card" },
      { status: 500 }
    );
  }
}
