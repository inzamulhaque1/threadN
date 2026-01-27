"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Coins,
  Crown,
  Wand2,
  TrendingUp,
  Calendar,
  Layers,
  Heart,
  Trophy,
  Flame,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { achievementsApi } from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/generate", label: "Generate", icon: Wand2 },
  { href: "/dashboard/scheduler", label: "Scheduler", icon: Calendar },
  { href: "/dashboard/templates", label: "Card Designer", icon: Layers },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/trends", label: "Trends", icon: TrendingUp },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [streak, setStreak] = useState<{ currentStreak: number; isActive: boolean } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch streak data
  useEffect(() => {
    if (isAuthenticated) {
      achievementsApi.getStreak().then((result) => {
        if (result.success && result.data) {
          const data = result.data as { currentStreak: number; isActive: boolean };
          setStreak(data);
        }
      });
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold text-neon-gradient">ThreadN</span>
        </Link>

        {/* User Info */}
        <div className="mb-6 p-3 rounded-xl bg-white/5">
          <p className="font-medium truncate">{user?.name}</p>
          <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {user?.subscription.status === "active" ? (
              <span className="chip chip-success flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {user.plan.toUpperCase()}
              </span>
            ) : (
              <span className="chip chip-neon">FREE</span>
            )}
            {(user?.coins ?? 0) > 0 && (
              <span className="chip chip-warning flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {user?.coins}
              </span>
            )}
            {streak && streak.currentStreak > 0 && (
              <span className={`chip flex items-center gap-1 ${streak.isActive ? "chip-danger" : "bg-gray-500/20 text-gray-400"}`}>
                <Flame className={`w-3 h-3 ${streak.isActive ? "animate-pulse" : ""}`} />
                {streak.currentStreak}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                (item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)) && "active"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Admin Link */}
        {user?.role === "admin" && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link href="/admin" className="sidebar-link">
              <Crown className="w-5 h-5 text-yellow-500" />
              Admin Panel
            </Link>
          </div>
        )}

        {/* Logout */}
        <div className="mt-auto pt-4">
          <button onClick={logout} className="sidebar-link w-full text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-with-sidebar flex-1 p-8">{children}</main>
    </div>
  );
}
