import mongoose, { Schema, Document } from "mongoose";
import type { ITemplate } from "@/types";

export interface ITemplateDocument extends Omit<ITemplate, "_id">, Document {}

const TemplateSchema = new Schema<ITemplateDocument>(
  {
    userId: {
      type: String,
      default: null, // null for system templates
      index: true,
      sparse: true,
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
    category: {
      type: String,
      enum: ["hook", "thread", "full"],
      required: true,
    },
    content: {
      hookTemplate: {
        type: String,
        default: "",
      },
      threadTemplate: {
        type: String,
        default: "",
      },
      variables: [{
        name: { type: String, required: true },
        description: { type: String, default: "" },
        defaultValue: { type: String, default: "" },
      }],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
TemplateSchema.index({ userId: 1, category: 1 });
TemplateSchema.index({ isPublic: 1, category: 1 });
TemplateSchema.index({ usageCount: -1 });

export default mongoose.models.Template ||
  mongoose.model<ITemplateDocument>("Template", TemplateSchema);
