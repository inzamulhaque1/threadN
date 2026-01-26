import mongoose, { Schema, Document } from "mongoose";
import type { ISetting } from "@/types";

export interface ISettingDocument extends Omit<ISetting, "_id">, Document {}

const SettingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ["pricing", "limits", "features", "ai", "cost", "rate", "maintenance"],
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Default settings
export const DEFAULT_SETTINGS = {
  // Pricing
  "pricing.starter.monthly": 9,
  "pricing.pro.monthly": 19,
  "pricing.enterprise.monthly": 49,
  "pricing.coins.100": 5,
  "pricing.coins.500": 20,

  // Limits
  "limits.free.dailyThreads": 1,
  "limits.starter.dailyThreads": 10,
  "limits.pro.dailyThreads": 25,
  "limits.enterprise.dailyThreads": 100,
  "limits.free.hooksPreview": 5,

  // Features
  "features.registration": true,
  "features.codeRedemption": true,
  "features.paddle": false,

  // AI
  "ai.model": "gpt-4o-mini",
  "ai.temperature": 0.7,
  "ai.maxTokens": 1500,
};

// Get setting with default fallback
export async function getSetting<T>(key: string): Promise<T> {
  const setting = await (mongoose.models.Setting || mongoose.model("Setting", SettingSchema)).findOne({ key });
  if (setting) {
    return setting.value as T;
  }
  return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] as T;
}

// Update or create setting
export async function setSetting(key: string, value: unknown, category: string, updatedBy: string): Promise<void> {
  const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
  await Setting.findOneAndUpdate(
    { key },
    { value, category, updatedBy },
    { upsert: true }
  );
}

export default mongoose.models.Setting ||
  mongoose.model<ISettingDocument>("Setting", SettingSchema);
