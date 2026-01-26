import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { Template } from "@/models";
import { generateFromTemplate } from "@/lib/ai";

const UseTemplateSchema = z.object({
  variables: z.record(z.string()).optional().default({}),
});

// POST - Generate content from template
export async function POST(
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
    const validation = UseTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { variables } = validation.data;

    // Find template (user's own or public)
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

    // Generate content from template
    const result = await generateFromTemplate(template.toObject(), variables);

    // Increment usage count
    template.usageCount += 1;
    await template.save();

    return NextResponse.json({
      success: true,
      data: {
        hook: result.hook,
        thread: result.thread,
        tokens: result.tokens,
      },
    });
  } catch (error) {
    console.error("Use template error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate from template" },
      { status: 500 }
    );
  }
}
