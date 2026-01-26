import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AccessCode from "@/models/AccessCode";

const UpdateCodeSchema = z.object({
  isActive: z.boolean().optional(),
  maxUses: z.number().min(1).optional(),
  expiresAt: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const validation = UpdateCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    const data = validation.data;

    if (data.isActive !== undefined) updates.isActive = data.isActive;
    if (data.maxUses !== undefined) updates.maxUses = data.maxUses;
    if (data.expiresAt !== undefined) {
      updates.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    }

    const code = await AccessCode.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).lean();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { code },
      message: "Code updated successfully",
    });
  } catch (error) {
    console.error("Admin update code error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update code" },
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
    const code = await AccessCode.findByIdAndDelete(id);

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete code error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete code" },
      { status: 500 }
    );
  }
}
