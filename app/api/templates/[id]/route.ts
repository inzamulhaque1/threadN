import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Template } from "@/models";

const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(["hook", "thread", "full"]).optional(),
  content: z.object({
    hookTemplate: z.string().optional(),
    threadTemplate: z.string().optional(),
    variables: z.array(z.object({
      name: z.string(),
      description: z.string().optional().default(""),
      defaultValue: z.string().optional().default(""),
    })).optional(),
  }).optional(),
  isPublic: z.boolean().optional(),
});

// GET - Get single template
export async function GET(
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

    const template = await Template.findOne({
      _id: id,
      $or: [
        { userId: session.user.id },
        { isPublic: true },
      ],
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { template },
    });
  } catch (error) {
    console.error("Get template error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// PATCH - Update template
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
    const validation = UpdateTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Only owner can update
    const template = await Template.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    const { name, description, category, content, isPublic } = validation.data;

    if (name !== undefined) template.name = name;
    if (description !== undefined) template.description = description;
    if (category !== undefined) template.category = category;
    if (content !== undefined) {
      if (content.hookTemplate !== undefined) template.content.hookTemplate = content.hookTemplate;
      if (content.threadTemplate !== undefined) template.content.threadTemplate = content.threadTemplate;
      if (content.variables !== undefined) template.content.variables = content.variables;
    }
    if (isPublic !== undefined) template.isPublic = isPublic;

    await template.save();

    return NextResponse.json({
      success: true,
      data: { template },
      message: "Template updated",
    });
  } catch (error) {
    console.error("Update template error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete template
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

    // Only owner can delete
    const template = await Template.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted",
    });
  } catch (error) {
    console.error("Delete template error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
