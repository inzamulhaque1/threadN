import mongoose, { Schema, Document } from "mongoose";
import type { IAccessCode } from "@/types";

export interface IAccessCodeDocument extends Omit<IAccessCode, "_id">, Document {}

const AccessCodeSchema = new Schema<IAccessCodeDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["subscription", "coins", "trial"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      enum: ["starter", "pro", "enterprise"],
    },
    maxUses: {
      type: Number,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if code is valid for use
AccessCodeSchema.methods.isValid = function (userId: string): { valid: boolean; reason?: string } {
  if (!this.isActive) {
    return { valid: false, reason: "Code is inactive" };
  }

  if (this.expiresAt && new Date() > this.expiresAt) {
    return { valid: false, reason: "Code has expired" };
  }

  if (this.usedCount >= this.maxUses) {
    return { valid: false, reason: "Code has reached maximum uses" };
  }

  if (this.usedBy.includes(userId)) {
    return { valid: false, reason: "You have already used this code" };
  }

  return { valid: true };
};

// Index for efficient queries
AccessCodeSchema.index({ isActive: 1, expiresAt: 1 });

export default mongoose.models.AccessCode ||
  mongoose.model<IAccessCodeDocument>("AccessCode", AccessCodeSchema);
