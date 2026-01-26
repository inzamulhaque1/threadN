import mongoose, { Schema, Document } from "mongoose";
import type { IGeneration } from "@/types";

export interface IGenerationDocument extends Omit<IGeneration, "_id">, Document {}

const GenerationSchema = new Schema<IGenerationDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["hooks", "thread"],
      required: true,
    },
    input: {
      transcript: { type: String, required: true },
      cta: { type: String },
      selectedHook: { type: String },
    },
    output: {
      hooks: [
        {
          text: String,
          score: Number,
          reason: String,
          evidence: [String],
        },
      ],
      thread: {
        title: String,
        body: String,
      },
    },
    tokens: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
GenerationSchema.index({ userId: 1, createdAt: -1 });
GenerationSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.Generation ||
  mongoose.model<IGenerationDocument>("Generation", GenerationSchema);
