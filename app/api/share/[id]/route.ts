import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SharedCard } from "@/models";

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
