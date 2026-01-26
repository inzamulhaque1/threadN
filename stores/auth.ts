"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUserPublic } from "@/types";

interface AuthState {
  user: IUserPublic | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: IUserPublic | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<IUserPublic>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "threadn-auth",
      partialize: (state) => ({ token: state.token }),
    }
  )
);
