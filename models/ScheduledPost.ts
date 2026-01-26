import mongoose, { Schema, Document } from "mongoose";
import type { IScheduledPost } from "@/types";

export interface IScheduledPostDocument extends Omit<IScheduledPost, "_id">, Document {}

const ScheduledPostSchema = new Schema<IScheduledPostDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      hook: {
        type: String,
        required: true,
      },
      thread: {
        type: String,
        required: true,
      },
      platforms: [{
        type: String,
        enum: ["facebook", "twitter", "linkedin", "instagram"],
      }],
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "published", "failed"],
      default: "pending",
    },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly"],
      default: "none",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
ScheduledPostSchema.index({ userId: 1, status: 1 });
ScheduledPostSchema.index({ scheduledAt: 1, status: 1 });
ScheduledPostSchema.index({ userId: 1, scheduledAt: 1 });

export default mongoose.models.ScheduledPost ||
  mongoose.model<IScheduledPostDocument>("ScheduledPost", ScheduledPostSchema);
