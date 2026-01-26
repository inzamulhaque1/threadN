import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/next-auth";
import { generateABHookVariations } from "@/lib/ai";
import { checkAndUnlockAchievement } from "@/lib/achievements";

const VariationsSchema = z.object({
  transcript: z.string().min(20, "Transcript must be at least 20 characters"),
  originalHook: z.string().min(5, "Original hook is required"),
  count: z.number().min(1).max(5).optional().default(3),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to continue" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = VariationsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { transcript, originalHook, count } = validation.data;

    // Generate A/B variations
    const result = await generateABHookVariations(transcript, originalHook, count);

    // Check for A/B tester achievement
    await checkAndUnlockAchievement(session.user.id, "ab_tester");

    return NextResponse.json({
      success: true,
      data: {
        variations: result.variations,
        tokens: result.tokens,
      },
    });
  } catch (error) {
    console.error("Generate variations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate variations. Please try again." },
      { status: 500 }
    );
  }
}
