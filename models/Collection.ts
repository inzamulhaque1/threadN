import mongoose, { Schema, Document } from "mongoose";
import type { ICollection } from "@/types";

export interface ICollectionDocument extends Omit<ICollection, "_id">, Document {}

const CollectionSchema = new Schema<ICollectionDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      default: "#8b5cf6", // Purple default
    },
    icon: {
      type: String,
      default: "folder",
    },
  },
  {
    timestamps: true,
  }
);

// Index for user's collections
CollectionSchema.index({ userId: 1, name: 1 });

export default mongoose.models.Collection ||
  mongoose.model<ICollectionDocument>("Collection", CollectionSchema);
