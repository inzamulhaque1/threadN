import mongoose, { Schema, Document } from "mongoose";
import type { IUser } from "@/types";

export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    coins: {
      type: Number,
      default: 0,
    },
    subscription: {
      status: {
        type: String,
        enum: ["none", "active", "cancelled", "expired"],
        default: "none",
      },
      plan: { type: String, default: null },
      expiresAt: { type: Date, default: null },
      paddleCustomerId: { type: String, default: null },
      paddleSubscriptionId: { type: String, default: null },
    },
    usage: {
      totalHooks: { type: Number, default: 0 },
      totalThreads: { type: Number, default: 0 },
      dailyThreads: { type: Number, default: 0 },
      lastResetAt: { type: Date, default: Date.now },
      // Cost tracking for OpenAI usage caps
      dailyCost: { type: Number, default: 0 },
      monthlyCost: { type: Number, default: 0 },
      lastDailyCostResetAt: { type: Date, default: Date.now },
      lastMonthlyCostResetAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

// Reset daily usage if needed
UserSchema.methods.checkDailyReset = function () {
  const now = new Date();
  const lastReset = new Date(this.usage.lastResetAt);

  if (
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    this.usage.dailyThreads = 0;
    this.usage.lastResetAt = now;
    return true;
  }
  return false;
};

// Reset cost tracking if needed
UserSchema.methods.checkCostReset = function () {
  const now = new Date();
  let resetOccurred = false;

  // Check daily cost reset
  const lastDailyReset = new Date(this.usage.lastDailyCostResetAt || now);
  if (
    now.getDate() !== lastDailyReset.getDate() ||
    now.getMonth() !== lastDailyReset.getMonth() ||
    now.getFullYear() !== lastDailyReset.getFullYear()
  ) {
    this.usage.dailyCost = 0;
    this.usage.lastDailyCostResetAt = now;
    resetOccurred = true;
  }

  // Check monthly cost reset
  const lastMonthlyReset = new Date(this.usage.lastMonthlyCostResetAt || now);
  if (
    now.getMonth() !== lastMonthlyReset.getMonth() ||
    now.getFullYear() !== lastMonthlyReset.getFullYear()
  ) {
    this.usage.monthlyCost = 0;
    this.usage.lastMonthlyCostResetAt = now;
    resetOccurred = true;
  }

  return resetOccurred;
};

// Get public user data (without password)
UserSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    image: this.image,
    authProvider: this.authProvider,
    role: this.role,
    plan: this.plan,
    coins: this.coins,
    subscription: {
      status: this.subscription.status,
      plan: this.subscription.plan,
      expiresAt: this.subscription.expiresAt,
    },
    usage: this.usage,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
