import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import type { IUser } from "@/types";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data directly (no save needed here)
    const publicUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      plan: user.plan,
      coins: user.coins,
      subscription: user.subscription,
      usage: user.usage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: { user: publicUser },
    });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get user" },
      { status: 500 }
    );
  }
}
