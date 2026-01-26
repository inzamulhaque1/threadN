import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AccessCode from "@/models/AccessCode";
import { generateCode } from "@/lib/utils";

const CreateCodeSchema = z.object({
  code: z.string().optional(),
  type: z.enum(["subscription", "coins", "trial"]),
  value: z.number().min(1),
  plan: z.enum(["starter", "pro", "enterprise"]).optional(),
  maxUses: z.number().min(1).default(1),
  expiresAt: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type") || "";
    const active = searchParams.get("active");

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (type) {
      query.type = type;
    }

    if (active !== null) {
      query.isActive = active === "true";
    }

    // Get codes
    const [codes, total] = await Promise.all([
      AccessCode.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AccessCode.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        codes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin codes error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch codes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const body = await request.json();
    const validation = CreateCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate code if not provided
    const codeString = data.code || generateCode();

    // Check if code exists
    const existing = await AccessCode.findOne({ code: codeString.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Code already exists" },
        { status: 400 }
      );
    }

    // Create code
    const code = await AccessCode.create({
      code: codeString.toUpperCase(),
      type: data.type,
      value: data.value,
      plan: data.plan,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      createdBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: { code },
      message: "Code created successfully",
    });
  } catch (error) {
    console.error("Admin create code error:", error);
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create code" },
      { status: 500 }
    );
  }
}
