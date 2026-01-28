import mongoose, { Schema, Document } from "mongoose";

export interface ISharedCard {
  _id: string;
  uniqueId: string;
  userId: string | null; // null for anonymous shares
  imageData: string; // base64 encoded image
  title: string;
  description: string; // short description for OG meta
  threadBody: string; // full thread content
  templateName: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISharedCardDocument extends Omit<ISharedCard, "_id">, Document {}

const SharedCardSchema = new Schema<ISharedCardDocument>(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    imageData: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    threadBody: {
      type: String,
      default: "",
    },
    templateName: {
      type: String,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
SharedCardSchema.index({ createdAt: -1 });
SharedCardSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SharedCard ||
  mongoose.model<ISharedCardDocument>("SharedCard", SharedCardSchema);
