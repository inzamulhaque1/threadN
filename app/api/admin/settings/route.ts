import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Setting from "@/models/Setting";

// Default settings
const DEFAULT_SETTINGS = {
  // Plan Pricing (monthly USD)
  pricing_free: 0,
  pricing_starter: 9.99,
  pricing_pro: 29.99,
  pricing_enterprise: 99.99,

  // Plan Limits
  limits_free_daily_threads: 1,
  limits_starter_daily_threads: 10,
  limits_pro_daily_threads: 25,
  limits_enterprise_daily_threads: 100,

  // Cost Limits (USD)
  cost_free_daily: 0.10,
  cost_free_monthly: 1.00,
  cost_starter_daily: 0.50,
  cost_starter_monthly: 10.00,
  cost_pro_daily: 2.00,
  cost_pro_monthly: 50.00,
  cost_enterprise_daily: 10.00,
  cost_enterprise_monthly: 200.00,

  // AI Settings
  ai_model: "gpt-4o-mini",
  ai_temperature_hooks: 0.7,
  ai_temperature_threads: 0.7,
  ai_max_tokens_hooks: 1500,
  ai_max_tokens_threads: 1200,

  // Rate Limits
  rate_limit_generation: 10,
  rate_limit_auth: 10,
  rate_limit_api: 60,

  // Feature Flags
  feature_youtube_extraction: true,
  feature_url_extraction: true,
  feature_trends: true,
  feature_google_auth: true,
  feature_registration: true,

  // Maintenance
  maintenance_mode: false,
  maintenance_message: "We're currently performing maintenance. Please check back soon.",
};

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();

    // Get all settings from database
    const dbSettings = await Setting.find().lean();

    // Merge with defaults
    const settings = { ...DEFAULT_SETTINGS };
    for (const setting of dbSettings) {
      if (setting.key in settings) {
        (settings as Record<string, unknown>)[setting.key] = setting.value;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        settings,
        categories: {
          pricing: ["pricing_free", "pricing_starter", "pricing_pro", "pricing_enterprise"],
          limits: [
            "limits_free_daily_threads",
            "limits_starter_daily_threads",
            "limits_pro_daily_threads",
            "limits_enterprise_daily_threads",
          ],
          costs: [
            "cost_free_daily", "cost_free_monthly",
            "cost_starter_daily", "cost_starter_monthly",
            "cost_pro_daily", "cost_pro_monthly",
            "cost_enterprise_daily", "cost_enterprise_monthly",
          ],
          ai: [
            "ai_model",
            "ai_temperature_hooks",
            "ai_temperature_threads",
            "ai_max_tokens_hooks",
            "ai_max_tokens_threads",
          ],
          rate_limits: ["rate_limit_generation", "rate_limit_auth", "rate_limit_api"],
          features: [
            "feature_youtube_extraction",
            "feature_url_extraction",
            "feature_trends",
            "feature_google_auth",
            "feature_registration",
          ],
          maintenance: ["maintenance_mode", "maintenance_message"],
        },
      },
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const updates = await request.json();

    // Validate keys
    const validKeys = Object.keys(DEFAULT_SETTINGS);
    const invalidKeys = Object.keys(updates).filter((key) => !validKeys.includes(key));

    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid settings: ${invalidKeys.join(", ")}` },
        { status: 400 }
      );
    }

    // Update each setting
    const bulkOps = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: {
          $set: {
            key,
            value,
            category: key.split("_")[0],
            updatedBy: session.user?.id,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await Setting.bulkWrite(bulkOps);

    // Get updated settings
    const dbSettings = await Setting.find().lean();
    const settings = { ...DEFAULT_SETTINGS };
    for (const setting of dbSettings) {
      if (setting.key in settings) {
        (settings as Record<string, unknown>)[setting.key] = setting.value;
      }
    }

    return NextResponse.json({
      success: true,
      data: { settings },
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
