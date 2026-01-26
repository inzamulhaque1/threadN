import mongoose, { Schema, Document } from "mongoose";
import type { IUserStreak } from "@/types";

export interface IUserStreakDocument extends Omit<IUserStreak, "_id">, Document {}

const UserStreakSchema = new Schema<IUserStreakDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },
    totalDaysActive: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to update streak on activity
UserStreakSchema.methods.recordActivity = function () {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!this.lastActivityDate) {
    // First activity ever
    this.currentStreak = 1;
    this.longestStreak = 1;
    this.totalDaysActive = 1;
    this.lastActivityDate = today;
    return { isNewDay: true, streakBroken: false };
  }

  const lastActivity = new Date(this.lastActivityDate);
  const lastActivityDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());

  const daysDiff = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no change
    return { isNewDay: false, streakBroken: false };
  } else if (daysDiff === 1) {
    // Consecutive day - continue streak
    this.currentStreak += 1;
    this.totalDaysActive += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
    this.lastActivityDate = today;
    return { isNewDay: true, streakBroken: false };
  } else {
    // Streak broken - reset
    const previousStreak = this.currentStreak;
    this.currentStreak = 1;
    this.totalDaysActive += 1;
    this.lastActivityDate = today;
    return { isNewDay: true, streakBroken: true, previousStreak };
  }
};

export default mongoose.models.UserStreak ||
  mongoose.model<IUserStreakDocument>("UserStreak", UserStreakSchema);
