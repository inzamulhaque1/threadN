import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import Generation from "@/models/Generation";

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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // "hooks" | "thread" | null

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id };
    if (type) {
      query.type = type;
    }

    // Get generations
    const [generations, total] = await Promise.all([
      Generation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Generation.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        generations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
