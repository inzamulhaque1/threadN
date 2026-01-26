import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Generation from "@/models/Generation";
import AccessCode from "@/models/AccessCode";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeCharts = searchParams.get("charts") === "true";

    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Parallel queries for stats
    const [
      totalUsers,
      newUsersToday,
      newUsersMonth,
      newUsersLastMonth,
      totalGenerations,
      generationsToday,
      generationsMonth,
      generationsLastMonth,
      totalCodes,
      activeSubscriptions,
      activeCodes,
      planDistribution,
      recentGenerations,
      recentUsers,
      topUsers,
      generationTypes,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: thisMonth } }),
      User.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      Generation.countDocuments(),
      Generation.countDocuments({ createdAt: { $gte: today } }),
      Generation.countDocuments({ createdAt: { $gte: thisMonth } }),
      Generation.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      AccessCode.countDocuments(),
      User.countDocuments({ "subscription.status": "active" }),
      AccessCode.countDocuments({ isActive: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] }),
      User.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } },
      ]),
      Generation.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "name email")
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email plan createdAt")
        .lean(),
      User.find()
        .sort({ "usage.totalThreads": -1 })
        .limit(5)
        .select("name email plan usage.totalThreads usage.totalHooks")
        .lean(),
      Generation.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 }, tokens: { $sum: "$tokens" }, cost: { $sum: "$cost" } } },
      ]),
    ]);

    // Calculate API costs
    const costAggregation = await Generation.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: "$cost" },
          totalTokens: { $sum: "$tokens" },
        },
      },
    ]);

    const costs = costAggregation[0] || { totalCost: 0, totalTokens: 0 };

    // Cost this month vs last month
    const costThisMonth = await Generation.aggregate([
      { $match: { createdAt: { $gte: thisMonth } } },
      { $group: { _id: null, cost: { $sum: "$cost" } } },
    ]);
    const costLastMonth = await Generation.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: thisMonth } } },
      { $group: { _id: null, cost: { $sum: "$cost" } } },
    ]);

    // Format plan distribution
    const plans = planDistribution.reduce(
      (acc: Record<string, number>, item: { _id: string; count: number }) => {
        acc[item._id] = item.count;
        return acc;
      },
      {}
    );

    // Format generation types
    const typeStats = generationTypes.reduce(
      (acc: Record<string, { count: number; tokens: number; cost: number }>, item: { _id: string; count: number; tokens: number; cost: number }) => {
        acc[item._id] = { count: item.count, tokens: item.tokens, cost: item.cost };
        return acc;
      },
      {}
    );

    // Calculate growth percentages
    const userGrowth = newUsersLastMonth > 0
      ? ((newUsersMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
      : "100";
    const generationGrowth = generationsLastMonth > 0
      ? ((generationsMonth - generationsLastMonth) / generationsLastMonth * 100).toFixed(1)
      : "100";

    let chartData = {};

    // Include chart data if requested
    if (includeCharts) {
      // User signups over last 30 days
      const userSignupsByDay = await User.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Generations over last 30 days
      const generationsByDay = await Generation.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            cost: { $sum: "$cost" },
            tokens: { $sum: "$tokens" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Costs over last 30 days
      const costsByDay = await Generation.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            cost: { $sum: "$cost" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      chartData = {
        userSignups: userSignupsByDay.map((d: { _id: string; count: number }) => ({
          date: d._id,
          users: d.count,
        })),
        generations: generationsByDay.map((d: { _id: string; count: number; cost: number; tokens: number }) => ({
          date: d._id,
          generations: d.count,
          cost: parseFloat(d.cost.toFixed(4)),
          tokens: d.tokens,
        })),
        costs: costsByDay.map((d: { _id: string; cost: number }) => ({
          date: d._id,
          cost: parseFloat(d.cost.toFixed(4)),
        })),
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          today: newUsersToday,
          thisMonth: newUsersMonth,
          lastMonth: newUsersLastMonth,
          growth: userGrowth,
          activeSubscriptions,
          plans,
        },
        generations: {
          total: totalGenerations,
          today: generationsToday,
          thisMonth: generationsMonth,
          lastMonth: generationsLastMonth,
          growth: generationGrowth,
          byType: typeStats,
        },
        costs: {
          total: costs.totalCost.toFixed(4),
          tokens: costs.totalTokens,
          thisMonth: (costThisMonth[0]?.cost || 0).toFixed(4),
          lastMonth: (costLastMonth[0]?.cost || 0).toFixed(4),
        },
        codes: {
          total: totalCodes,
          active: activeCodes,
        },
        recentGenerations,
        recentUsers,
        topUsers,
        charts: chartData,
        systemHealth: {
          status: "healthy",
          database: "connected",
          lastUpdated: now.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if ((error as Error).message === "Forbidden") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
