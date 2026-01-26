"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { IUserPublic } from "@/types";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<IUserPublic | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  // Use session role directly for faster admin check
  const isAdmin = session?.user?.role === "admin";

  // Fetch full user data from database
  const fetchUser = useCallback(async () => {
    if (!session?.user?.id) return;

    setIsLoadingUser(true);
    try {
      const response = await api("/auth/me");
      if (response.success && response.data) {
        setUser((response.data as { user: IUserPublic }).user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }, [session?.user?.id]);

  // Fetch user data when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id && !user) {
      fetchUser();
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [status, session?.user?.id, user, fetchUser]);

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push("/");
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const refreshSession = async () => {
    await update();
  };

  return {
    user,
    session,
    isLoading,
    isLoadingUser,
    isAuthenticated,
    isAdmin,
    logout,
    refreshUser,
    refreshSession,
  };
}
