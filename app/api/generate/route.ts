import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import { generateHooks, generateThread, generateContentFromTopic, extractContentFromUrl, calculateCost } from "@/lib/ai";
import User from "@/models/User";
import Generation from "@/models/Generation";
import { PLAN_LIMITS } from "@/types";
import { withRateLimit, getClientIp, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

const GenerateSchema = z.object({
  transcript: z.string().min(20, "Content must be at least 20 characters").optional(),
  topic: z.string().min(5, "Topic must be at least 5 characters").optional(),
  style: z.string().optional().default("informative"),
  tone: z.string().optional().default("professional"),
  audience: z.string().optional().default("general"),
  url: z.string().url("Please enter a valid URL").optional(),
  mode: z.enum(["hooks", "thread", "content", "url"]).default("hooks"),
  selectedHook: z.string().optional(),
  cta: z.string().optional().default("Follow for more tips like this!"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request.headers);
    const rateLimit = withRateLimit(clientIp, "generate", RATE_LIMIT_CONFIGS.generation);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
          code: "RATE_LIMITED"
        },
        {
          status: 429,
          headers: rateLimit.headers
        }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to continue" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validation = GenerateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { transcript, topic, style, tone, audience, url, mode, selectedHook, cta } = validation.data;

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check and reset daily usage and cost tracking
    user.checkDailyReset();
    user.checkCostReset();

    // Get plan limits
    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

    // Check cost limits before allowing generation
    if (user.usage.dailyCost >= limits.dailyCostLimit) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily cost limit reached. Please try again tomorrow or upgrade your plan.",
          code: "DAILY_COST_LIMIT",
        },
        { status: 403 }
      );
    }

    if (user.usage.monthlyCost >= limits.monthlyCostLimit) {
      return NextResponse.json(
        {
          success: false,
          error: "Monthly cost limit reached. Please upgrade your plan for additional usage.",
          code: "MONTHLY_COST_LIMIT",
        },
        { status: 403 }
      );
    }

    // Check thread generation limits (hooks and content are unlimited)
    if (mode === "thread") {
      const canGenerate =
        user.coins > 0 ||
        user.subscription.status === "active" ||
        user.usage.dailyThreads < limits.dailyThreads;

      if (!canGenerate) {
        return NextResponse.json(
          {
            success: false,
            error: "Daily limit reached. Upgrade your plan or add coins.",
            code: "LIMIT_REACHED",
          },
          { status: 403 }
        );
      }

      if (!selectedHook) {
        return NextResponse.json(
          { success: false, error: "Please select a hook for thread generation" },
          { status: 400 }
        );
      }
    }

    let result;
    let tokens = 0;

    if (mode === "url") {
      // Extract content from URL
      if (!url) {
        return NextResponse.json(
          { success: false, error: "URL is required" },
          { status: 400 }
        );
      }

      try {
        const urlResult = await extractContentFromUrl(url);
        result = { content: urlResult.content };
        tokens = urlResult.tokens;
      } catch (urlError) {
        const errorMsg = urlError instanceof Error ? urlError.message : "Unknown error";

        if (errorMsg.includes("INVALID_URL")) {
          return NextResponse.json(
            { success: false, error: "Invalid YouTube URL. Please check the link and try again." },
            { status: 400 }
          );
        }

        if (errorMsg.includes("TRANSCRIPT_FAILED")) {
          return NextResponse.json(
            { success: false, error: "Could not extract transcript. This video may have captions disabled or be restricted." },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { success: false, error: `Failed to extract content: ${errorMsg}` },
          { status: 400 }
        );
      }

    } else if (mode === "content") {
      // Generate content from topic
      if (!topic) {
        return NextResponse.json(
          { success: false, error: "Topic is required for content generation" },
          { status: 400 }
        );
      }

      const contentResult = await generateContentFromTopic(topic, style!, tone!, audience!);
      result = { content: contentResult.content };
      tokens = contentResult.tokens;

    } else if (mode === "hooks") {
      // Generate hooks
      if (!transcript) {
        return NextResponse.json(
          { success: false, error: "Content is required for hooks generation" },
          { status: 400 }
        );
      }

      const hookResult = await generateHooks(transcript);
      result = { hooks: hookResult.hooks };
      tokens = hookResult.tokens;

      // Update usage
      user.usage.totalHooks += hookResult.hooks.length;

    } else {
      // Generate thread
      if (!transcript) {
        return NextResponse.json(
          { success: false, error: "Content is required for thread generation" },
          { status: 400 }
        );
      }

      const threadResult = await generateThread(selectedHook!, transcript, cta!);
      result = { thread: threadResult.thread };
      tokens = threadResult.tokens;

      // Deduct coins or increment daily usage
      if (user.coins > 0 && user.subscription.status !== "active") {
        user.coins -= 1;
      } else {
        user.usage.dailyThreads += 1;
      }
      user.usage.totalThreads += 1;
    }

    // Calculate cost and update user cost tracking
    const cost = calculateCost(tokens);
    user.usage.dailyCost = (user.usage.dailyCost || 0) + cost;
    user.usage.monthlyCost = (user.usage.monthlyCost || 0) + cost;

    // Save generation (skip for content/url modes as they're intermediate)
    if (mode !== "content" && mode !== "url") {
      await Generation.create({
        userId: user._id.toString(),
        type: mode,
        input: {
          transcript: transcript?.slice(0, 1000),
          cta,
          selectedHook,
        },
        output: result,
        tokens,
        cost,
      });
    }

    // Save user
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        usage: {
          dailyThreads: user.usage.dailyThreads,
          dailyLimit: limits.dailyThreads,
          coins: user.coins,
          // Cost tracking info
          dailyCost: user.usage.dailyCost,
          dailyCostLimit: limits.dailyCostLimit,
          monthlyCost: user.usage.monthlyCost,
          monthlyCostLimit: limits.monthlyCostLimit,
        },
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { success: false, error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}
