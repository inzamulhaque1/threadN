"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
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
  Menu,
  X,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="ThreadN"
            width={120}
            height={35}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center gap-3">
          {streak && streak.currentStreak > 0 && (
            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${streak.isActive ? "bg-orange-500/20 text-orange-400" : "bg-gray-500/20 text-gray-400"}`}>
              <Flame className={`w-4 h-4 ${streak.isActive ? "animate-pulse" : ""}`} />
              {streak.currentStreak}
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-white/10 p-5 flex flex-col transition-transform duration-300 lg:translate-x-0 font-body",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Link href="/" className="hidden lg:block mb-6">
          <Image
            src="/logo.png"
            alt="ThreadN"
            width={130}
            height={38}
            className="h-9 w-auto"
          />
        </Link>

        {/* Mobile close button area */}
        <div className="lg:hidden h-14" />

        {/* User Info */}
        <div className="mb-5 p-4 rounded-xl bg-white/5">
          <p className="font-heading font-semibold truncate text-base text-white">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate font-accent">{user?.email}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {user?.subscription.status === "active" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400">
                <Crown className="w-3.5 h-3.5" />
                {user.plan.toUpperCase()}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-400">FREE</span>
            )}
            {(user?.coins ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-400">
                <Coins className="w-3.5 h-3.5" />
                {user?.coins}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Link */}
        {user?.role === "admin" && (
          <div className="pt-4 border-t border-white/10">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 transition-all"
            >
              <Crown className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>
        )}

        {/* Logout */}
        <div className="pt-4 border-t border-white/10 mt-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
