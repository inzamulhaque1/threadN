import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Generation from "@/models/Generation";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type") || "";
    const userId = searchParams.get("userId") || "";

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }

    if (userId) {
      query.userId = userId;
    }

    // Get generations with user info
    const [generations, total] = await Promise.all([
      Generation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Generation.countDocuments(query),
    ]);

    // Get user info for each generation
    const userIds = [...new Set(generations.map((g) => g.userId))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();

    const userMap: Record<string, { name: string; email: string }> = {};
    for (const user of users) {
      const u = user as unknown as { _id: unknown; name: string; email: string };
      userMap[String(u._id)] = { name: u.name, email: u.email };
    }

    // Attach user info to generations
    const generationsWithUser = generations.map((g) => ({
      ...g,
      user: userMap[g.userId] || { name: "Unknown", email: "unknown" },
    }));

    // Calculate totals
    const costTotal = await Generation.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$cost" }, tokens: { $sum: "$tokens" } } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        generations: generationsWithUser,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        totals: costTotal[0] || { total: 0, tokens: 0 },
      },
    });
  } catch (error) {
    console.error("Admin generations error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch generations" },
      { status: 500 }
    );
  }
}
