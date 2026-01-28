"use client";

import { Settings, User, Crown, Coins, Calendar } from "lucide-react";
import { Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import { PLAN_LIMITS } from "@/types";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  const limits = PLAN_LIMITS[user.plan];

  return (
    <div className="max-w-2xl mx-auto font-body">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
          <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
          Settings
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-accent mt-1">Manage your account</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <h2 className="text-lg sm:text-xl font-heading font-semibold mb-4 flex items-center gap-2 text-white">
            <User className="w-5 h-5 text-purple-400" />
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Member since</label>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </Card>

        {/* Subscription */}
        <Card>
          <h2 className="text-lg sm:text-xl font-heading font-semibold mb-4 flex items-center gap-2 text-white">
            <Crown className="w-5 h-5 text-yellow-400" />
            Subscription
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-400">Current Plan</label>
                <p className="font-medium capitalize">{user.plan}</p>
              </div>
              <span
                className={`chip ${
                  user.subscription.status === "active"
                    ? "chip-success"
                    : "chip-neon"
                }`}
              >
                {user.subscription.status === "active" ? "Active" : "Free"}
              </span>
            </div>

            {user.subscription.expiresAt && (
              <div>
                <label className="text-sm text-gray-400">Expires</label>
                <p className="font-medium">
                  {formatDate(user.subscription.expiresAt)}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-medium mb-2">Plan Limits</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Daily Threads</span>
                  <p className="font-medium">{limits.dailyThreads}</p>
                </div>
                <div>
                  <span className="text-gray-400">Hooks per Generation</span>
                  <p className="font-medium">{limits.hooksPerGeneration}</p>
                </div>
                <div>
                  <span className="text-gray-400">History</span>
                  <p className="font-medium">{limits.historyDays} days</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage */}
        <Card>
          <h2 className="text-lg sm:text-xl font-heading font-semibold mb-4 flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Usage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400 font-accent">Today&apos;s Threads</p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-white">
                {user.usage.dailyThreads}
                <span className="text-sm text-gray-400 font-normal font-accent">
                  {" "}
                  / {limits.dailyThreads}
                </span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400 font-accent">Total Threads</p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-white">{user.usage.totalThreads}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400 font-accent">Total Hooks</p>
              <p className="text-xl sm:text-2xl font-mono font-bold text-white">{user.usage.totalHooks}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 flex items-center gap-3">
              <Coins className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400 font-accent">Coins</p>
                <p className="text-xl sm:text-2xl font-mono font-bold text-white">{user.coins}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
