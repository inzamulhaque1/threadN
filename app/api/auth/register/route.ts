import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import User from "@/models/User";
import { withRateLimit, getClientIp, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for auth endpoints (prevent brute force)
    const clientIp = getClientIp(request.headers);
    const rateLimit = withRateLimit(clientIp, "auth", RATE_LIMIT_CONFIGS.auth);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many attempts. Please try again in ${Math.ceil((rateLimit.retryAfter || 0) / 60)} minutes.`,
          code: "RATE_LIMITED"
        },
        {
          status: 429,
          headers: rateLimit.headers
        }
      );
    }

    await dbConnect();

    const body = await request.json();
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      authProvider: "credentials",
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
