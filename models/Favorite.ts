import mongoose, { Schema, Document } from "mongoose";
import type { IFavorite } from "@/types";

export interface IFavoriteDocument extends Omit<IFavorite, "_id">, Document {}

const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    generationId: {
      type: String,
      required: true,
    },
    collectionId: {
      type: String,
      default: null, // null means uncategorized
      sparse: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
FavoriteSchema.index({ userId: 1, collectionId: 1 });
FavoriteSchema.index({ userId: 1, generationId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1, tags: 1 });

export default mongoose.models.Favorite ||
  mongoose.model<IFavoriteDocument>("Favorite", FavoriteSchema);
