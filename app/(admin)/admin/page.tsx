"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Ticket,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

interface Stats {
  users: {
    total: number;
    today: number;
    thisMonth: number;
    activeSubscriptions: number;
    plans: Record<string, number>;
  };
  generations: {
    total: number;
    today: number;
    thisMonth: number;
  };
  costs: {
    total: string;
    tokens: number;
  };
  codes: {
    total: number;
  };
  recentGenerations: Array<{
    _id: string;
    type: string;
    createdAt: string;
    userId: { name: string; email: string };
  }>;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const result = await adminApi.stats();
    if (result.success && result.data) {
      setStats(result.data as Stats);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-8 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Users",
      value: stats.users.total,
      change: `+${stats.users.today} today`,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      label: "Active Subscriptions",
      value: stats.users.activeSubscriptions,
      change: `${((stats.users.activeSubscriptions / stats.users.total) * 100).toFixed(1)}% of users`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
    {
      label: "Total Generations",
      value: stats.generations.total,
      change: `+${stats.generations.today} today`,
      icon: FileText,
      color: "text-cyan-400",
      bg: "bg-cyan-500/20",
    },
    {
      label: "API Costs",
      value: `$${stats.costs.total}`,
      change: `${stats.costs.tokens.toLocaleString()} tokens`,
      icon: DollarSign,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Admin Overview</h1>
        <p className="text-gray-400 text-sm sm:text-base font-accent mt-1">Monitor your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Plan Distribution */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Plan Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.users.plans).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="capitalize font-medium">{plan}</span>
                  <span className="text-sm text-gray-400">
                    ({((count / stats.users.total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                      style={{
                        width: `${(count / stats.users.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-xl font-bold">{stats.users.thisMonth}</p>
              <p className="text-xs text-gray-500">new users</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-xl font-bold">{stats.generations.thisMonth}</p>
              <p className="text-xs text-gray-500">generations</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400">Access Codes</p>
              <p className="text-xl font-bold">{stats.codes.total}</p>
              <p className="text-xs text-gray-500">total created</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-400">Avg Cost/Gen</p>
              <p className="text-xl font-bold">
                ${(parseFloat(stats.costs.total) / (stats.generations.total || 1)).toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">per generation</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
          Recent Generations
        </h2>
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Type</th>
                <th>User</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentGenerations.map((gen) => (
                <tr key={gen._id}>
                  <td>
                    <span
                      className={`chip ${
                        gen.type === "hooks" ? "chip-neon" : "chip-success"
                      }`}
                    >
                      {gen.type}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">
                        {(gen.userId as { name: string })?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {(gen.userId as { email: string })?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td className="text-gray-400">
                    {formatDateTime(gen.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
