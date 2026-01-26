import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/next-auth";
import User from "@/models/User";
import AccessCode from "@/models/AccessCode";

const RedeemSchema = z.object({
  code: z.string().min(1, "Code is required"),
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

    await dbConnect();

    const body = await request.json();
    const validation = RedeemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { code } = validation.data;

    // Find code
    const accessCode = await AccessCode.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!accessCode) {
      return NextResponse.json(
        { success: false, error: "Invalid code" },
        { status: 404 }
      );
    }

    // Check if code is valid
    const validity = accessCode.isValid(session.user.id);
    if (!validity.valid) {
      return NextResponse.json(
        { success: false, error: validity.reason },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Apply code benefits
    let message = "";

    switch (accessCode.type) {
      case "subscription":
        user.plan = accessCode.plan || "pro";
        user.subscription.status = "active";
        user.subscription.plan = accessCode.plan || "pro";
        user.subscription.expiresAt = new Date(
          Date.now() + accessCode.value * 24 * 60 * 60 * 1000
        ); // value = days
        message = `Subscription activated! You now have ${accessCode.plan || "pro"} plan for ${accessCode.value} days.`;
        break;

      case "coins":
        user.coins += accessCode.value;
        message = `Added ${accessCode.value} coins to your account!`;
        break;

      case "trial":
        if (user.plan === "free") {
          user.plan = "starter";
          user.subscription.status = "active";
          user.subscription.plan = "starter";
          user.subscription.expiresAt = new Date(
            Date.now() + accessCode.value * 24 * 60 * 60 * 1000
          );
          message = `Trial activated! You have ${accessCode.value} days of starter plan.`;
        } else {
          return NextResponse.json(
            { success: false, error: "Trial only available for free users" },
            { status: 400 }
          );
        }
        break;
    }

    // Update code usage
    accessCode.usedCount += 1;
    accessCode.usedBy.push(session.user.id);

    // Save
    await Promise.all([user.save(), accessCode.save()]);

    return NextResponse.json({
      success: true,
      data: {
        type: accessCode.type,
        value: accessCode.value,
        user: user.toPublic(),
      },
      message,
    });
  } catch (error) {
    console.error("Redeem error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to redeem code" },
      { status: 500 }
    );
  }
}
