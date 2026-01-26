"use client";

import { create } from "zustand";
import type { IHook, IThread } from "@/types";

interface GenerationState {
  transcript: string;
  cta: string;
  hooks: IHook[];
  selectedHook: IHook | null;
  thread: IThread | null;
  isGeneratingHooks: boolean;
  isGeneratingThread: boolean;
  error: string | null;
  setTranscript: (transcript: string) => void;
  setCta: (cta: string) => void;
  setHooks: (hooks: IHook[]) => void;
  setSelectedHook: (hook: IHook | null) => void;
  setThread: (thread: IThread | null) => void;
  setGeneratingHooks: (loading: boolean) => void;
  setGeneratingThread: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  transcript: "",
  cta: "Follow for more tips like this!",
  hooks: [],
  selectedHook: null,
  thread: null,
  isGeneratingHooks: false,
  isGeneratingThread: false,
  error: null,
  setTranscript: (transcript) => set({ transcript }),
  setCta: (cta) => set({ cta }),
  setHooks: (hooks) => set({ hooks, selectedHook: null, thread: null }),
  setSelectedHook: (selectedHook) => set({ selectedHook, thread: null }),
  setThread: (thread) => set({ thread }),
  setGeneratingHooks: (isGeneratingHooks) => set({ isGeneratingHooks }),
  setGeneratingThread: (isGeneratingThread) => set({ isGeneratingThread }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      transcript: "",
      hooks: [],
      selectedHook: null,
      thread: null,
      error: null,
    }),
}));
