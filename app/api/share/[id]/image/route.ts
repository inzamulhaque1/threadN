import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SharedCard } from "@/models";

// GET - Get shared card image (for OG meta tags)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    const sharedCard = await SharedCard.findOne({ uniqueId: id }).select("imageData");

    if (!sharedCard || !sharedCard.imageData) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    // Extract base64 data (remove data:image/png;base64, prefix)
    const base64Data = sharedCard.imageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Determine content type from the data URL
    const contentType = sharedCard.imageData.startsWith("data:image/jpeg")
      ? "image/jpeg"
      : "image/png";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Get shared card image error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
