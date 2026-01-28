"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Activity,
  RefreshCw,
  Download,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Button } from "@/components/ui";
import { adminApi } from "@/lib/api";

interface ChartData {
  userSignups: Array<{ date: string; users: number }>;
  generations: Array<{ date: string; generations: number; cost: number; tokens: number }>;
  costs: Array<{ date: string; cost: number }>;
}

interface Stats {
  users: {
    total: number;
    today: number;
    thisMonth: number;
    lastMonth: number;
    growth: string;
    activeSubscriptions: number;
    plans: Record<string, number>;
  };
  generations: {
    total: number;
    today: number;
    thisMonth: number;
    lastMonth: number;
    growth: string;
    byType: Record<string, { count: number; tokens: number; cost: number }>;
  };
  costs: {
    total: string;
    tokens: number;
    thisMonth: string;
    lastMonth: string;
  };
  topUsers: Array<{
    _id: string;
    name: string;
    email: string;
    plan: string;
    usage: { totalThreads: number; totalHooks: number };
  }>;
  charts: ChartData;
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
const PLAN_COLORS: Record<string, string> = {
  free: "#6b7280",
  starter: "#8b5cf6",
  pro: "#06b6d4",
  enterprise: "#f59e0b",
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setIsLoading(true);
    const result = await adminApi.stats("?charts=true");
    if (result.success && result.data) {
      setStats(result.data as Stats);
    }
    setIsLoading(false);
  };

  const exportCSV = (data: unknown[], filename: string) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0] as object);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => (row as Record<string, unknown>)[h]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 h-80 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-32 mb-4" />
              <div className="h-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const planData = Object.entries(stats.users.plans).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: PLAN_COLORS[name] || "#6b7280",
  }));

  const typeData = Object.entries(stats.generations.byType || {}).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: data.count,
    cost: parseFloat(data.cost.toFixed(4)),
    tokens: data.tokens,
  }));

  const costGrowth = parseFloat(stats.costs.lastMonth) > 0
    ? ((parseFloat(stats.costs.thisMonth) - parseFloat(stats.costs.lastMonth)) / parseFloat(stats.costs.lastMonth) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
            Analytics
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mt-1">Detailed insights and reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-dark w-auto text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="glass" size="sm" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">User Growth</p>
              <p className="text-2xl font-bold mt-1">{stats.users.thisMonth}</p>
              <div className="flex items-center gap-1 mt-1">
                {parseFloat(stats.users.growth) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={parseFloat(stats.users.growth) >= 0 ? "text-green-400" : "text-red-400"}>
                  {stats.users.growth}%
                </span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Generation Growth</p>
              <p className="text-2xl font-bold mt-1">{stats.generations.thisMonth}</p>
              <div className="flex items-center gap-1 mt-1">
                {parseFloat(stats.generations.growth) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={parseFloat(stats.generations.growth) >= 0 ? "text-green-400" : "text-red-400"}>
                  {stats.generations.growth}%
                </span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/20">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Monthly Cost</p>
              <p className="text-2xl font-bold mt-1">${stats.costs.thisMonth}</p>
              <div className="flex items-center gap-1 mt-1">
                {parseFloat(costGrowth) <= 0 ? (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                )}
                <span className={parseFloat(costGrowth) <= 0 ? "text-green-400" : "text-yellow-400"}>
                  {costGrowth}%
                </span>
                <span className="text-gray-500 text-sm">vs last month</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold mt-1">
                {((stats.users.activeSubscriptions / stats.users.total) * 100).toFixed(1)}%
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {stats.users.activeSubscriptions} paid users
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Signups Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              User Signups
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportCSV(stats.charts.userSignups, "user-signups")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.charts.userSignups}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Generations Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Generations
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportCSV(stats.charts.generations, "generations")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.generations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="generations" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution Pie */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Plan Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cost Trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              API Costs
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportCSV(stats.charts.costs, "costs")}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.charts.costs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toFixed(4)}`, "Cost"]}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Generation Types */}
        <Card>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            By Type
          </h2>
          <div className="space-y-4">
            {typeData.map((type, index) => (
              <div key={type.name} className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{type.name}</span>
                  <span className="text-sm text-gray-400">{type.count} total</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{type.tokens.toLocaleString()} tokens</span>
                  <span className="text-yellow-400">${type.cost.toFixed(4)}</span>
                </div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(type.count / stats.generations.total) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Users Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Top Users by Activity
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportCSV(stats.topUsers.map(u => ({
              name: u.name,
              email: u.email,
              plan: u.plan,
              threads: u.usage.totalThreads,
              hooks: u.usage.totalHooks,
            })), "top-users")}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Plan</th>
                <th>Threads</th>
                <th>Hooks</th>
                <th>Total Activity</th>
              </tr>
            </thead>
            <tbody>
              {stats.topUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>
                    <span className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                      ${index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                        index === 1 ? "bg-gray-400/20 text-gray-300" :
                        index === 2 ? "bg-orange-500/20 text-orange-400" :
                        "bg-white/10 text-gray-400"}
                    `}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`chip ${
                      user.plan === "enterprise" ? "bg-yellow-500/20 text-yellow-400" :
                      user.plan === "pro" ? "bg-cyan-500/20 text-cyan-400" :
                      user.plan === "starter" ? "bg-purple-500/20 text-purple-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td>{user.usage.totalThreads}</td>
                  <td>{user.usage.totalHooks}</td>
                  <td className="font-medium text-purple-400">
                    {user.usage.totalThreads + user.usage.totalHooks}
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
