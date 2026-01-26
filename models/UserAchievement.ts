import mongoose, { Schema, Document } from "mongoose";
import type { IUserAchievement } from "@/types";

export interface IUserAchievementDocument extends Omit<IUserAchievement, "_id">, Document {}

const UserAchievementSchema = new Schema<IUserAchievementDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate achievements
UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.models.UserAchievement ||
  mongoose.model<IUserAchievementDocument>("UserAchievement", UserAchievementSchema);
