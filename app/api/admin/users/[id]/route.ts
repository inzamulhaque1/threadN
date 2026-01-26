import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import User from "@/models/User";

const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["user", "admin"]).optional(),
  plan: z.enum(["free", "starter", "pro", "enterprise"]).optional(),
  coins: z.number().min(0).optional(),
  subscriptionStatus: z.enum(["none", "active", "cancelled", "expired"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await dbConnect();

    const { id } = await params;
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Admin get user error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const validation = UpdateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    const data = validation.data;

    if (data.name) updates.name = data.name;
    if (data.role) updates.role = data.role;
    if (data.plan) updates.plan = data.plan;
    if (data.coins !== undefined) updates.coins = data.coins;
    if (data.subscriptionStatus) {
      updates["subscription.status"] = data.subscriptionStatus;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await dbConnect();

    const { id } = await params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
