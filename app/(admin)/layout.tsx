"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Ticket,
  FileText,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/codes", label: "Access Codes", icon: Ticket },
  { href: "/admin/generations", label: "Generations", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <span className="text-xl font-bold text-neon-gradient">ThreadN</span>
        </Link>
        <p className="text-xs text-yellow-400 mb-6 pl-1">Admin Panel</p>

        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Admin Info */}
        <div className="mb-6 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="font-medium text-yellow-400">{user?.name}</p>
          <p className="text-sm text-gray-400">Administrator</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                pathname === item.href && "active"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

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
