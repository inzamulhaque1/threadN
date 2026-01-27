"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Upload,
  Type,
  Palette,
  Image as ImageIcon,
  Move,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  Copy,
  Square,
  Circle,
  RectangleHorizontal,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { toPng } from "html-to-image";
import { userApi } from "@/lib/api";

// Template Categories
const TEMPLATE_CATEGORIES = [
  { id: "basic", name: "Basic" },
  { id: "bold", name: "Bold" },
  { id: "minimal", name: "Minimal" },
  { id: "neon", name: "Neon" },
  { id: "nature", name: "Nature" },
  { id: "floral", name: "Floral" },
  { id: "tech", name: "Tech" },
  { id: "business", name: "Business" },
];

// Templates with actual designs (80 templates - 10 per category)
const CARD_TEMPLATES = [
  // === BASIC (10) ===
  { id: "basic-1", category: "basic", name: "Classic Dark",
    config: { background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)", textColor: "#ffffff", accentColor: "#6366f1" },
    decorations: [{ type: "circle", x: -200, y: -200, size: 500, color: "#6366f1", opacity: 0.1 }],
    watermark: { position: "bottom-right", color: "#6366f1" } },
  { id: "basic-2", category: "basic", name: "Ocean Blue",
    config: { background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)", textColor: "#ffffff", accentColor: "#fbbf24" },
    decorations: [{ type: "wave", y: 850, color: "#ffffff", opacity: 0.15 }],
    watermark: { position: "top-right", color: "#ffffff" } },
  { id: "basic-3", category: "basic", name: "Forest Green",
    config: { background: "linear-gradient(135deg, #059669 0%, #047857 100%)", textColor: "#ffffff", accentColor: "#fbbf24" },
    decorations: [{ type: "circle", x: 800, y: -100, size: 400, color: "#10b981", opacity: 0.2 }],
    watermark: { position: "bottom-left", color: "#a7f3d0" } },
  { id: "basic-4", category: "basic", name: "Sunset Orange",
    config: { background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)", textColor: "#ffffff", accentColor: "#fef3c7" },
    decorations: [{ type: "circle", x: 400, y: -150, size: 500, color: "#ffffff", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#fef3c7" } },
  { id: "basic-5", category: "basic", name: "Purple Dream",
    config: { background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)", textColor: "#ffffff", accentColor: "#c4b5fd" },
    decorations: [{ type: "circle", x: -100, y: 700, size: 500, color: "#a78bfa", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#c4b5fd" } },
  { id: "basic-6", category: "basic", name: "Rose Pink",
    config: { background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)", textColor: "#ffffff", accentColor: "#fce7f3" },
    decorations: [{ type: "circle", x: 700, y: 600, size: 600, color: "#ffffff", opacity: 0.1 }],
    watermark: { position: "bottom-left", color: "#fce7f3" } },
  { id: "basic-7", category: "basic", name: "Sky Light",
    config: { background: "linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)", textColor: "#ffffff", accentColor: "#1e3a5f" },
    decorations: [{ type: "circle", x: 800, y: 50, size: 200, color: "#ffffff", opacity: 0.3 }],
    watermark: { position: "bottom-left", color: "#e0f2fe" } },
  { id: "basic-8", category: "basic", name: "Warm Amber",
    config: { background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)", textColor: "#1f2937", accentColor: "#78350f" },
    decorations: [{ type: "circle", x: -150, y: -150, size: 450, color: "#ffffff", opacity: 0.2 }],
    watermark: { position: "bottom-right", color: "#78350f" } },
  { id: "basic-9", category: "basic", name: "Cool Gray",
    config: { background: "linear-gradient(180deg, #4b5563 0%, #1f2937 100%)", textColor: "#f3f4f6", accentColor: "#9ca3af" },
    decorations: [{ type: "line", x: 60, y: 100, width: 120, height: 4, color: "#9ca3af" }],
    watermark: { position: "bottom-right", color: "#9ca3af" } },
  { id: "basic-10", category: "basic", name: "Midnight",
    config: { background: "linear-gradient(180deg, #1e1b4b 0%, #0f0a1e 100%)", textColor: "#e0e7ff", accentColor: "#818cf8" },
    decorations: [{ type: "dots", x: 850, y: 50, color: "#818cf8", opacity: 0.4 }, { type: "dots", x: 50, y: 850, color: "#818cf8", opacity: 0.3 }],
    watermark: { position: "bottom-center", color: "#818cf8" } },

  // === BOLD (10) ===
  { id: "bold-1", category: "bold", name: "Fire Gradient",
    config: { background: "linear-gradient(135deg, #f97316 0%, #dc2626 50%, #7c2d12 100%)", textColor: "#ffffff", accentColor: "#fef3c7" },
    decorations: [{ type: "circle", x: -150, y: -150, size: 500, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: 750, y: 650, size: 600, color: "#ffffff", opacity: 0.08 }],
    watermark: { position: "bottom-center", color: "#fef3c7" } },
  { id: "bold-2", category: "bold", name: "Electric Purple",
    config: { background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", textColor: "#ffffff", accentColor: "#fbbf24" },
    decorations: [{ type: "circle", x: -100, y: -100, size: 400, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: 800, y: 700, size: 500, color: "#ffffff", opacity: 0.08 }, { type: "circle", x: 400, y: 400, size: 300, color: "#ffffff", opacity: 0.05 }],
    watermark: { position: "bottom-right", color: "#e0e7ff" } },
  { id: "bold-3", category: "bold", name: "Ocean Depth",
    config: { background: "linear-gradient(180deg, #0ea5e9 0%, #1e40af 50%, #1e1b4b 100%)", textColor: "#ffffff", accentColor: "#38bdf8" },
    decorations: [{ type: "wave", y: 750, color: "#ffffff", opacity: 0.08 }, { type: "wave", y: 820, color: "#ffffff", opacity: 0.12 }, { type: "wave", y: 890, color: "#ffffff", opacity: 0.18 }],
    watermark: { position: "top-right", color: "#38bdf8" } },
  { id: "bold-4", category: "bold", name: "Toxic Green",
    config: { background: "linear-gradient(135deg, #22c55e 0%, #15803d 50%, #14532d 100%)", textColor: "#ffffff", accentColor: "#86efac" },
    decorations: [{ type: "circle", x: 400, y: -100, size: 350, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: -100, y: 600, size: 400, color: "#86efac", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#86efac" } },
  { id: "bold-5", category: "bold", name: "Sunset Blaze",
    config: { background: "linear-gradient(180deg, #fbbf24 0%, #f97316 30%, #dc2626 60%, #7c2d12 100%)", textColor: "#ffffff", accentColor: "#fef3c7" },
    decorations: [{ type: "circle", x: 440, y: -250, size: 700, color: "#ffffff", opacity: 0.15 }, { type: "circle", x: 200, y: 800, size: 300, color: "#ffffff", opacity: 0.08 }],
    watermark: { position: "bottom-right", color: "#fef3c7" } },
  { id: "bold-6", category: "bold", name: "Cyber Pink",
    config: { background: "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)", textColor: "#ffffff", accentColor: "#fce7f3" },
    decorations: [{ type: "circle", x: -80, y: 700, size: 400, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: 800, y: -100, size: 350, color: "#fce7f3", opacity: 0.12 }],
    watermark: { position: "bottom-right", color: "#fce7f3" } },
  { id: "bold-7", category: "bold", name: "Aurora",
    config: { background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)", textColor: "#ffffff", accentColor: "#e0e7ff" },
    decorations: [{ type: "circle", x: -100, y: -100, size: 400, color: "#ffffff", opacity: 0.15 }, { type: "circle", x: 800, y: 800, size: 400, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: 400, y: 300, size: 250, color: "#ffffff", opacity: 0.08 }],
    watermark: { position: "bottom-center", color: "#e0e7ff" } },
  { id: "bold-8", category: "bold", name: "Magma",
    config: { background: "linear-gradient(135deg, #fbbf24 0%, #f97316 30%, #dc2626 70%, #450a0a 100%)", textColor: "#ffffff", accentColor: "#fef3c7" },
    decorations: [{ type: "circle", x: 300, y: 300, size: 500, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: 700, y: 700, size: 400, color: "#ff6b35", opacity: 0.15 }],
    watermark: { position: "bottom-left", color: "#fef3c7" } },
  { id: "bold-9", category: "bold", name: "Deep Space",
    config: { background: "linear-gradient(180deg, #312e81 0%, #1e1b4b 50%, #0c0a1d 100%)", textColor: "#ffffff", accentColor: "#a5b4fc" },
    decorations: [{ type: "dots", x: 100, y: 100, color: "#ffffff", opacity: 0.3 }, { type: "dots", x: 800, y: 300, color: "#a5b4fc", opacity: 0.4 }, { type: "dots", x: 500, y: 800, color: "#ffffff", opacity: 0.2 }],
    watermark: { position: "bottom-right", color: "#a5b4fc" } },
  { id: "bold-10", category: "bold", name: "Tropical",
    config: { background: "linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #1e40af 100%)", textColor: "#ffffff", accentColor: "#5eead4" },
    decorations: [{ type: "circle", x: -150, y: -150, size: 500, color: "#ffffff", opacity: 0.12 }, { type: "wave", y: 850, color: "#ffffff", opacity: 0.15 }],
    watermark: { position: "top-right", color: "#5eead4" } },

  // === MINIMAL (10) ===
  { id: "minimal-1", category: "minimal", name: "Clean White",
    config: { background: "#ffffff", textColor: "#111827", accentColor: "#6366f1" },
    decorations: [{ type: "line", x: 440, y: 880, width: 200, height: 3, color: "#6366f1" }],
    watermark: { position: "bottom-right", color: "#9ca3af" } },
  { id: "minimal-2", category: "minimal", name: "Soft Gray",
    config: { background: "#f9fafb", textColor: "#1f2937", accentColor: "#6b7280" },
    decorations: [{ type: "border", x: 50, y: 50, width: 980, height: 980, color: "#e5e7eb", thickness: 1 }],
    watermark: { position: "bottom-right", color: "#6b7280" } },
  { id: "minimal-3", category: "minimal", name: "Paper",
    config: { background: "#fffbeb", textColor: "#78350f", accentColor: "#b45309" },
    decorations: [{ type: "line", x: 60, y: 120, width: 80, height: 3, color: "#b45309" }, { type: "line", x: 940, y: 920, width: 80, height: 3, color: "#b45309" }],
    watermark: { position: "bottom-center", color: "#b45309" } },
  { id: "minimal-4", category: "minimal", name: "Slate",
    config: { background: "#f1f5f9", textColor: "#0f172a", accentColor: "#475569" },
    decorations: [{ type: "corner", position: "top-left", size: 40, color: "#475569" }, { type: "corner", position: "bottom-right", size: 40, color: "#475569" }],
    watermark: { position: "bottom-left", color: "#475569" } },
  { id: "minimal-5", category: "minimal", name: "Ivory",
    config: { background: "#fefce8", textColor: "#365314", accentColor: "#65a30d" },
    decorations: [{ type: "border", x: 40, y: 40, width: 1000, height: 1000, color: "#d9f99d", thickness: 2 }],
    watermark: { position: "bottom-right", color: "#65a30d" } },
  { id: "minimal-6", category: "minimal", name: "Cloud",
    config: { background: "#f0f9ff", textColor: "#0c4a6e", accentColor: "#0284c7" },
    decorations: [{ type: "circle", x: 800, y: -100, size: 300, color: "#bae6fd", opacity: 0.5 }],
    watermark: { position: "bottom-left", color: "#0284c7" } },
  { id: "minimal-7", category: "minimal", name: "Cream",
    config: { background: "#fef7ed", textColor: "#7c2d12", accentColor: "#c2410c" },
    decorations: [{ type: "line", x: 440, y: 100, width: 200, height: 2, color: "#c2410c" }, { type: "line", x: 440, y: 950, width: 200, height: 2, color: "#c2410c" }],
    watermark: { position: "bottom-right", color: "#c2410c" } },
  { id: "minimal-8", category: "minimal", name: "Snow",
    config: { background: "#ffffff", textColor: "#1e3a5f", accentColor: "#0ea5e9" },
    decorations: [{ type: "corner", position: "top-left", size: 50, color: "#0ea5e9" }, { type: "corner", position: "bottom-right", size: 50, color: "#0ea5e9" }],
    watermark: { position: "bottom-left", color: "#0ea5e9" } },
  { id: "minimal-9", category: "minimal", name: "Lavender",
    config: { background: "#faf5ff", textColor: "#581c87", accentColor: "#9333ea" },
    decorations: [{ type: "circle", x: -150, y: -150, size: 400, color: "#e9d5ff", opacity: 0.5 }],
    watermark: { position: "bottom-right", color: "#9333ea" } },
  { id: "minimal-10", category: "minimal", name: "Mint",
    config: { background: "#f0fdf4", textColor: "#14532d", accentColor: "#22c55e" },
    decorations: [{ type: "circle", x: 750, y: 750, size: 400, color: "#bbf7d0", opacity: 0.4 }],
    watermark: { position: "bottom-left", color: "#22c55e" } },

  // === NEON (10) ===
  { id: "neon-1", category: "neon", name: "Cyber Green",
    config: { background: "#0a0a0a", textColor: "#ffffff", accentColor: "#00ff88" },
    decorations: [{ type: "glow-border", x: 30, y: 30, width: 1020, height: 1020, color: "#00ff88", opacity: 0.5 }, { type: "corner", position: "top-left", size: 80, color: "#00ff88" }, { type: "corner", position: "bottom-right", size: 80, color: "#00ff88" }],
    watermark: { position: "bottom-left", color: "#00ff88" } },
  { id: "neon-2", category: "neon", name: "Hot Pink",
    config: { background: "#0f0f0f", textColor: "#ffffff", accentColor: "#ff00ff" },
    decorations: [{ type: "glow-border", x: 40, y: 40, width: 1000, height: 1000, color: "#ff00ff", opacity: 0.4 }, { type: "circle", x: 800, y: -100, size: 300, color: "#ff00ff", opacity: 0.15 }],
    watermark: { position: "bottom-left", color: "#ff00ff" } },
  { id: "neon-3", category: "neon", name: "Electric Blue",
    config: { background: "#050505", textColor: "#ffffff", accentColor: "#00d4ff" },
    decorations: [{ type: "glow-border", x: 30, y: 30, width: 1020, height: 1020, color: "#00d4ff", opacity: 0.5 }, { type: "grid", x: 0, y: 0, color: "#00d4ff", opacity: 0.08 }],
    watermark: { position: "bottom-center", color: "#00d4ff" } },
  { id: "neon-4", category: "neon", name: "Sunset Neon",
    config: { background: "#0a0a0a", textColor: "#ffffff", accentColor: "#ff6b00" },
    decorations: [{ type: "corner", position: "top-left", size: 100, color: "#ff6b00" }, { type: "corner", position: "bottom-right", size: 100, color: "#ff00ff" }, { type: "glow-border", x: 50, y: 50, width: 980, height: 980, color: "#ff6b00", opacity: 0.3 }],
    watermark: { position: "bottom-left", color: "#ff6b00" } },
  { id: "neon-5", category: "neon", name: "Matrix",
    config: { background: "#000000", textColor: "#00ff00", accentColor: "#00ff00" },
    decorations: [{ type: "grid", x: 0, y: 0, color: "#00ff00", opacity: 0.15 }, { type: "line", x: 60, y: 100, width: 3, height: 200, color: "#00ff00" }],
    watermark: { position: "bottom-right", color: "#00ff00" } },
  { id: "neon-6", category: "neon", name: "Purple Rain",
    config: { background: "#0a0010", textColor: "#ffffff", accentColor: "#bf00ff" },
    decorations: [{ type: "glow-border", x: 35, y: 35, width: 1010, height: 1010, color: "#bf00ff", opacity: 0.45 }, { type: "circle", x: 700, y: -100, size: 400, color: "#bf00ff", opacity: 0.1 }],
    watermark: { position: "bottom-left", color: "#bf00ff" } },
  { id: "neon-7", category: "neon", name: "Tron",
    config: { background: "#000814", textColor: "#ffffff", accentColor: "#00b4d8" },
    decorations: [{ type: "border", x: 40, y: 40, width: 1000, height: 1000, color: "#00b4d8", thickness: 2 }, { type: "corner", position: "top-left", size: 60, color: "#00b4d8" }, { type: "corner", position: "bottom-right", size: 60, color: "#00b4d8" }],
    watermark: { position: "bottom-left", color: "#00b4d8" } },
  { id: "neon-8", category: "neon", name: "Vapor Wave",
    config: { background: "linear-gradient(180deg, #1a0030 0%, #2d1b4e 50%, #1a0030 100%)", textColor: "#ff71ce", accentColor: "#01cdfe" },
    decorations: [{ type: "line", x: 0, y: 540, width: 1080, height: 2, color: "#ff71ce" }, { type: "circle", x: 400, y: -200, size: 500, color: "#ff71ce", opacity: 0.1 }, { type: "grid", x: 0, y: 0, color: "#01cdfe", opacity: 0.05 }],
    watermark: { position: "bottom-right", color: "#01cdfe" } },
  { id: "neon-9", category: "neon", name: "Laser Red",
    config: { background: "#0a0000", textColor: "#ffffff", accentColor: "#ff0040" },
    decorations: [{ type: "glow-border", x: 30, y: 30, width: 1020, height: 1020, color: "#ff0040", opacity: 0.5 }, { type: "circle", x: -100, y: 700, size: 400, color: "#ff0040", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#ff0040" } },
  { id: "neon-10", category: "neon", name: "Dual Neon",
    config: { background: "#050505", textColor: "#ffffff", accentColor: "#00ff88" },
    decorations: [{ type: "corner", position: "top-left", size: 100, color: "#00ff88" }, { type: "corner", position: "top-right", size: 100, color: "#ff00ff" }, { type: "corner", position: "bottom-left", size: 100, color: "#ff00ff" }, { type: "corner", position: "bottom-right", size: 100, color: "#00ff88" }, { type: "circle", x: 400, y: 400, size: 300, color: "#00ff88", opacity: 0.05 }],
    watermark: { position: "bottom-center", color: "#00ff88" } },

  // === NATURE (10) ===
  { id: "nature-1", category: "nature", name: "Forest Dawn",
    config: { background: "linear-gradient(180deg, #fef3c7 0%, #a7f3d0 50%, #065f46 100%)", textColor: "#064e3b", accentColor: "#fbbf24" },
    decorations: [{ type: "circle", x: 440, y: -300, size: 600, color: "#fef08a", opacity: 0.4 }, { type: "leaf", x: 50, y: 800, size: 150, color: "#10b981", opacity: 0.3 }, { type: "leaf", x: 900, y: 750, size: 120, color: "#059669", opacity: 0.25, rotate: 45 }],
    watermark: { position: "bottom-center", color: "#d9f99d" } },
  { id: "nature-2", category: "nature", name: "Ocean Sunset",
    config: { background: "linear-gradient(180deg, #fcd34d 0%, #fb923c 30%, #0ea5e9 60%, #0369a1 100%)", textColor: "#ffffff", accentColor: "#fef3c7" },
    decorations: [{ type: "circle", x: 440, y: -200, size: 500, color: "#ffffff", opacity: 0.3 }, { type: "wave", y: 700, color: "#0c4a6e", opacity: 0.2 }, { type: "wave", y: 780, color: "#0c4a6e", opacity: 0.3 }],
    watermark: { position: "top-right", color: "#fef3c7" } },
  { id: "nature-3", category: "nature", name: "Mountain Mist",
    config: { background: "linear-gradient(180deg, #e0f2fe 0%, #94a3b8 50%, #475569 100%)", textColor: "#1e293b", accentColor: "#0284c7" },
    decorations: [{ type: "triangle", x: 100, y: 600, size: 400, color: "#64748b", opacity: 0.3 }, { type: "triangle", x: 500, y: 500, size: 500, color: "#475569", opacity: 0.4 }, { type: "triangle", x: 700, y: 650, size: 350, color: "#94a3b8", opacity: 0.3 }],
    watermark: { position: "top-right", color: "#475569" } },
  { id: "nature-4", category: "nature", name: "Spring Garden",
    config: { background: "linear-gradient(135deg, #d9f99d 0%, #86efac 50%, #4ade80 100%)", textColor: "#14532d", accentColor: "#166534" },
    decorations: [{ type: "circle", x: -100, y: -100, size: 400, color: "#ffffff", opacity: 0.3 }, { type: "leaf", x: 850, y: 100, size: 100, color: "#22c55e", opacity: 0.4 }, { type: "leaf", x: 100, y: 800, size: 120, color: "#16a34a", opacity: 0.35, rotate: -30 }],
    watermark: { position: "bottom-right", color: "#166534" } },
  { id: "nature-5", category: "nature", name: "Desert Sand",
    config: { background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 30%, #d97706 70%, #92400e 100%)", textColor: "#78350f", accentColor: "#fef3c7" },
    decorations: [{ type: "circle", x: 800, y: 50, size: 200, color: "#fef08a", opacity: 0.5 }, { type: "wave", y: 800, color: "#b45309", opacity: 0.2 }],
    watermark: { position: "top-right", color: "#fef3c7" } },
  { id: "nature-6", category: "nature", name: "Northern Lights",
    config: { background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 30%, #134e4a 60%, #065f46 100%)", textColor: "#a7f3d0", accentColor: "#5eead4" },
    decorations: [{ type: "wave", y: 200, color: "#22d3ee", opacity: 0.15 }, { type: "wave", y: 350, color: "#a78bfa", opacity: 0.12 }, { type: "wave", y: 500, color: "#34d399", opacity: 0.1 }, { type: "dots", x: 100, y: 50, color: "#ffffff", opacity: 0.4 }],
    watermark: { position: "bottom-right", color: "#5eead4" } },
  { id: "nature-7", category: "nature", name: "Autumn Leaves",
    config: { background: "linear-gradient(135deg, #fef3c7 0%, #fdba74 30%, #ea580c 70%, #7c2d12 100%)", textColor: "#ffffff", accentColor: "#fef3c7" },
    decorations: [{ type: "leaf", x: 50, y: 50, size: 100, color: "#dc2626", opacity: 0.3 }, { type: "leaf", x: 900, y: 100, size: 80, color: "#ea580c", opacity: 0.35, rotate: 45 }, { type: "leaf", x: 800, y: 850, size: 120, color: "#b91c1c", opacity: 0.25, rotate: -20 }],
    watermark: { position: "bottom-center", color: "#fef3c7" } },
  { id: "nature-8", category: "nature", name: "Deep Ocean",
    config: { background: "linear-gradient(180deg, #0ea5e9 0%, #0369a1 30%, #1e3a8a 60%, #0f172a 100%)", textColor: "#e0f2fe", accentColor: "#38bdf8" },
    decorations: [{ type: "circle", x: 100, y: 700, size: 150, color: "#38bdf8", opacity: 0.2 }, { type: "circle", x: 800, y: 800, size: 100, color: "#22d3ee", opacity: 0.15 }, { type: "wave", y: 850, color: "#0369a1", opacity: 0.2 }],
    watermark: { position: "top-right", color: "#38bdf8" } },
  { id: "nature-9", category: "nature", name: "Rainforest",
    config: { background: "linear-gradient(180deg, #86efac 0%, #22c55e 30%, #15803d 60%, #14532d 100%)", textColor: "#f0fdf4", accentColor: "#bbf7d0" },
    decorations: [{ type: "leaf", x: 50, y: 100, size: 150, color: "#4ade80", opacity: 0.3 }, { type: "leaf", x: 880, y: 50, size: 130, color: "#22c55e", opacity: 0.35, rotate: 60 }, { type: "leaf", x: 900, y: 800, size: 140, color: "#16a34a", opacity: 0.25, rotate: 180 }],
    watermark: { position: "bottom-center", color: "#bbf7d0" } },
  { id: "nature-10", category: "nature", name: "Cherry Blossom",
    config: { background: "linear-gradient(180deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)", textColor: "#831843", accentColor: "#be185d" },
    decorations: [{ type: "circle", x: 100, y: 100, size: 80, color: "#ec4899", opacity: 0.3 }, { type: "circle", x: 850, y: 150, size: 60, color: "#f472b6", opacity: 0.35 }, { type: "circle", x: 750, y: 800, size: 100, color: "#db2777", opacity: 0.25 }, { type: "circle", x: 200, y: 850, size: 70, color: "#ec4899", opacity: 0.3 }],
    watermark: { position: "bottom-center", color: "#be185d" } },

  // === FLORAL (10) ===
  { id: "floral-1", category: "floral", name: "Rose Garden",
    config: { background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)", textColor: "#831843", accentColor: "#be185d" },
    decorations: [{ type: "circle", x: 50, y: 50, size: 150, color: "#ec4899", opacity: 0.25 }, { type: "circle", x: 880, y: 80, size: 120, color: "#f472b6", opacity: 0.3 }, { type: "circle", x: 800, y: 850, size: 180, color: "#db2777", opacity: 0.2 }, { type: "circle", x: 100, y: 800, size: 140, color: "#ec4899", opacity: 0.25 }],
    watermark: { position: "bottom-center", color: "#be185d" } },
  { id: "floral-2", category: "floral", name: "Lavender Field",
    config: { background: "linear-gradient(180deg, #e9d5ff 0%, #c4b5fd 50%, #a78bfa 100%)", textColor: "#4c1d95", accentColor: "#7c3aed" },
    decorations: [{ type: "circle", x: 100, y: 100, size: 60, color: "#8b5cf6", opacity: 0.35 }, { type: "circle", x: 300, y: 50, size: 40, color: "#a78bfa", opacity: 0.4 }, { type: "circle", x: 800, y: 120, size: 70, color: "#8b5cf6", opacity: 0.3 }, { type: "circle", x: 900, y: 900, size: 80, color: "#a78bfa", opacity: 0.3 }],
    watermark: { position: "bottom-left", color: "#7c3aed" } },
  { id: "floral-3", category: "floral", name: "Sunflower",
    config: { background: "linear-gradient(180deg, #fef9c3 0%, #fde047 50%, #facc15 100%)", textColor: "#713f12", accentColor: "#a16207" },
    decorations: [{ type: "circle", x: 440, y: -100, size: 400, color: "#fbbf24", opacity: 0.4 }, { type: "circle", x: 440, y: -100, size: 300, color: "#f59e0b", opacity: 0.3 }, { type: "leaf", x: 50, y: 800, size: 120, color: "#65a30d", opacity: 0.3 }],
    watermark: { position: "bottom-right", color: "#a16207" } },
  { id: "floral-4", category: "floral", name: "Tulip",
    config: { background: "linear-gradient(180deg, #fef2f2 0%, #fecaca 50%, #fca5a5 100%)", textColor: "#7f1d1d", accentColor: "#dc2626" },
    decorations: [{ type: "circle", x: 100, y: 100, size: 100, color: "#ef4444", opacity: 0.25 }, { type: "circle", x: 850, y: 150, size: 120, color: "#f87171", opacity: 0.3 }, { type: "leaf", x: 50, y: 800, size: 100, color: "#22c55e", opacity: 0.25 }],
    watermark: { position: "bottom-right", color: "#dc2626" } },
  { id: "floral-5", category: "floral", name: "Orchid",
    config: { background: "linear-gradient(135deg, #fdf4ff 0%, #f5d0fe 50%, #e879f9 100%)", textColor: "#701a75", accentColor: "#a21caf" },
    decorations: [{ type: "circle", x: 800, y: 100, size: 200, color: "#d946ef", opacity: 0.2 }, { type: "circle", x: 100, y: 750, size: 180, color: "#c026d3", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#a21caf" } },
  { id: "floral-6", category: "floral", name: "Daisy",
    config: { background: "linear-gradient(180deg, #ffffff 0%, #fef9c3 50%, #fde68a 100%)", textColor: "#78350f", accentColor: "#b45309" },
    decorations: [{ type: "circle", x: 100, y: 100, size: 80, color: "#ffffff", opacity: 0.8 }, { type: "circle", x: 100, y: 100, size: 30, color: "#fbbf24", opacity: 0.9 }, { type: "circle", x: 850, y: 800, size: 100, color: "#ffffff", opacity: 0.7 }, { type: "circle", x: 850, y: 800, size: 40, color: "#fbbf24", opacity: 0.9 }],
    watermark: { position: "bottom-center", color: "#b45309" } },
  { id: "floral-7", category: "floral", name: "Peony",
    config: { background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fda4af 100%)", textColor: "#881337", accentColor: "#e11d48" },
    decorations: [{ type: "circle", x: 50, y: 50, size: 200, color: "#fb7185", opacity: 0.25 }, { type: "circle", x: 800, y: 100, size: 150, color: "#f43f5e", opacity: 0.2 }, { type: "circle", x: 750, y: 800, size: 220, color: "#e11d48", opacity: 0.15 }],
    watermark: { position: "bottom-center", color: "#e11d48" } },
  { id: "floral-8", category: "floral", name: "Lotus",
    config: { background: "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 30%, #6ee7b7 70%, #34d399 100%)", textColor: "#064e3b", accentColor: "#059669" },
    decorations: [{ type: "circle", x: 440, y: 750, size: 350, color: "#10b981", opacity: 0.2 }, { type: "circle", x: 440, y: 800, size: 250, color: "#34d399", opacity: 0.25 }, { type: "wave", y: 900, color: "#059669", opacity: 0.15 }],
    watermark: { position: "top-right", color: "#059669" } },
  { id: "floral-9", category: "floral", name: "Hydrangea",
    config: { background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 30%, #93c5fd 60%, #60a5fa 100%)", textColor: "#1e3a8a", accentColor: "#2563eb" },
    decorations: [{ type: "circle", x: 50, y: 50, size: 100, color: "#3b82f6", opacity: 0.3 }, { type: "circle", x: 200, y: 100, size: 80, color: "#60a5fa", opacity: 0.35 }, { type: "circle", x: 800, y: 800, size: 120, color: "#2563eb", opacity: 0.25 }, { type: "circle", x: 900, y: 700, size: 90, color: "#3b82f6", opacity: 0.3 }],
    watermark: { position: "bottom-center", color: "#2563eb" } },
  { id: "floral-10", category: "floral", name: "Wildflower",
    config: { background: "linear-gradient(180deg, #fef3c7 0%, #d9f99d 50%, #86efac 100%)", textColor: "#365314", accentColor: "#65a30d" },
    decorations: [{ type: "circle", x: 100, y: 150, size: 50, color: "#ec4899", opacity: 0.4 }, { type: "circle", x: 300, y: 80, size: 40, color: "#a855f7", opacity: 0.45 }, { type: "circle", x: 800, y: 100, size: 60, color: "#f472b6", opacity: 0.35 }, { type: "circle", x: 850, y: 850, size: 55, color: "#8b5cf6", opacity: 0.4 }, { type: "leaf", x: 50, y: 800, size: 100, color: "#22c55e", opacity: 0.3 }],
    watermark: { position: "bottom-center", color: "#65a30d" } },

  // === TECH (10) ===
  { id: "tech-1", category: "tech", name: "Circuit Board",
    config: { background: "#0a1929", textColor: "#4fc3f7", accentColor: "#00e676" },
    decorations: [{ type: "grid", x: 0, y: 0, color: "#1e3a5f", opacity: 0.5 }, { type: "line", x: 60, y: 100, width: 200, height: 2, color: "#00e676" }, { type: "line", x: 800, y: 900, width: 200, height: 2, color: "#4fc3f7" }, { type: "dots", x: 850, y: 50, color: "#00e676", opacity: 0.5 }],
    watermark: { position: "bottom-left", color: "#00e676" } },
  { id: "tech-2", category: "tech", name: "Data Stream",
    config: { background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)", textColor: "#38bdf8", accentColor: "#22d3ee" },
    decorations: [{ type: "line", x: 100, y: 0, width: 2, height: 1080, color: "#0ea5e9", opacity: 0.15 }, { type: "line", x: 300, y: 0, width: 2, height: 1080, color: "#22d3ee", opacity: 0.1 }, { type: "line", x: 700, y: 0, width: 2, height: 1080, color: "#0ea5e9", opacity: 0.12 }, { type: "line", x: 900, y: 0, width: 2, height: 1080, color: "#22d3ee", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#22d3ee" } },
  { id: "tech-3", category: "tech", name: "Hologram",
    config: { background: "linear-gradient(135deg, #0c0a1d 0%, #1a1333 50%, #0f172a 100%)", textColor: "#e0e7ff", accentColor: "#818cf8" },
    decorations: [{ type: "circle", x: 440, y: 440, size: 400, color: "#6366f1", opacity: 0.1 }, { type: "circle", x: 440, y: 440, size: 300, color: "#818cf8", opacity: 0.08 }, { type: "circle", x: 440, y: 440, size: 200, color: "#a5b4fc", opacity: 0.06 }, { type: "grid", x: 0, y: 0, color: "#4f46e5", opacity: 0.1 }],
    watermark: { position: "bottom-right", color: "#818cf8" } },
  { id: "tech-4", category: "tech", name: "Binary",
    config: { background: "#000000", textColor: "#22c55e", accentColor: "#4ade80" },
    decorations: [{ type: "grid", x: 0, y: 0, color: "#166534", opacity: 0.2 }, { type: "line", x: 60, y: 60, width: 3, height: 100, color: "#22c55e" }, { type: "line", x: 1000, y: 900, width: 3, height: 100, color: "#22c55e" }],
    watermark: { position: "bottom-center", color: "#22c55e" } },
  { id: "tech-5", category: "tech", name: "AI Neural",
    config: { background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)", textColor: "#e0e7ff", accentColor: "#a5b4fc" },
    decorations: [{ type: "dots", x: 100, y: 100, color: "#818cf8", opacity: 0.5 }, { type: "dots", x: 500, y: 300, color: "#a5b4fc", opacity: 0.4 }, { type: "dots", x: 800, y: 600, color: "#818cf8", opacity: 0.45 }, { type: "line", x: 150, y: 150, width: 400, height: 2, color: "#6366f1", opacity: 0.3 }],
    watermark: { position: "bottom-right", color: "#a5b4fc" } },
  { id: "tech-6", category: "tech", name: "Cyber Grid",
    config: { background: "#030712", textColor: "#f0abfc", accentColor: "#e879f9" },
    decorations: [{ type: "grid", x: 0, y: 0, color: "#701a75", opacity: 0.3 }, { type: "glow-border", x: 50, y: 50, width: 980, height: 980, color: "#d946ef", opacity: 0.3 }],
    watermark: { position: "bottom-left", color: "#e879f9" } },
  { id: "tech-7", category: "tech", name: "Quantum",
    config: { background: "linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e293b 100%)", textColor: "#67e8f9", accentColor: "#22d3ee" },
    decorations: [{ type: "circle", x: 200, y: 200, size: 100, color: "#06b6d4", opacity: 0.2 }, { type: "circle", x: 700, y: 300, size: 150, color: "#22d3ee", opacity: 0.15 }, { type: "circle", x: 400, y: 700, size: 120, color: "#67e8f9", opacity: 0.18 }, { type: "line", x: 250, y: 250, width: 500, height: 2, color: "#06b6d4", opacity: 0.2 }],
    watermark: { position: "bottom-right", color: "#22d3ee" } },
  { id: "tech-8", category: "tech", name: "Blockchain",
    config: { background: "#0d1117", textColor: "#58a6ff", accentColor: "#1f6feb" },
    decorations: [{ type: "border", x: 100, y: 100, width: 200, height: 200, color: "#1f6feb", thickness: 2 }, { type: "border", x: 400, y: 300, width: 200, height: 200, color: "#58a6ff", thickness: 2 }, { type: "border", x: 700, y: 700, width: 200, height: 200, color: "#1f6feb", thickness: 2 }, { type: "line", x: 200, y: 200, width: 300, height: 2, color: "#1f6feb", opacity: 0.3 }],
    watermark: { position: "bottom-left", color: "#1f6feb" } },
  { id: "tech-9", category: "tech", name: "Neon Code",
    config: { background: "#0a0a0a", textColor: "#f472b6", accentColor: "#ec4899" },
    decorations: [{ type: "line", x: 60, y: 100, width: 300, height: 2, color: "#ec4899" }, { type: "line", x: 60, y: 130, width: 200, height: 2, color: "#f472b6", opacity: 0.6 }, { type: "line", x: 60, y: 160, width: 250, height: 2, color: "#ec4899", opacity: 0.4 }, { type: "glow-border", x: 40, y: 40, width: 1000, height: 1000, color: "#ec4899", opacity: 0.2 }],
    watermark: { position: "bottom-right", color: "#ec4899" } },
  { id: "tech-10", category: "tech", name: "Futuristic",
    config: { background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)", textColor: "#ffffff", accentColor: "#00d9ff" },
    decorations: [{ type: "corner", position: "top-left", size: 120, color: "#00d9ff" }, { type: "corner", position: "bottom-right", size: 120, color: "#00d9ff" }, { type: "line", x: 0, y: 540, width: 1080, height: 1, color: "#00d9ff", opacity: 0.3 }, { type: "grid", x: 0, y: 0, color: "#00d9ff", opacity: 0.05 }],
    watermark: { position: "bottom-left", color: "#00d9ff" } },

  // === BUSINESS (10) ===
  { id: "business-1", category: "business", name: "Corporate Blue",
    config: { background: "linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)", textColor: "#ffffff", accentColor: "#93c5fd" },
    decorations: [{ type: "circle", x: 750, y: -100, size: 400, color: "#3b82f6", opacity: 0.2 }, { type: "line", x: 60, y: 100, width: 120, height: 4, color: "#93c5fd" }],
    watermark: { position: "bottom-right", color: "#93c5fd" } },
  { id: "business-2", category: "business", name: "Executive",
    config: { background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)", textColor: "#f9fafb", accentColor: "#fbbf24" },
    decorations: [{ type: "line", x: 60, y: 100, width: 100, height: 4, color: "#fbbf24" }, { type: "line", x: 920, y: 950, width: 100, height: 4, color: "#fbbf24" }],
    watermark: { position: "bottom-center", color: "#fbbf24" } },
  { id: "business-3", category: "business", name: "Startup",
    config: { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)", textColor: "#ffffff", accentColor: "#e0e7ff" },
    decorations: [{ type: "circle", x: -100, y: -100, size: 400, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: 800, y: 700, size: 450, color: "#ffffff", opacity: 0.08 }],
    watermark: { position: "bottom-right", color: "#e0e7ff" } },
  { id: "business-4", category: "business", name: "Finance",
    config: { background: "linear-gradient(180deg, #064e3b 0%, #065f46 50%, #047857 100%)", textColor: "#ecfdf5", accentColor: "#34d399" },
    decorations: [{ type: "line", x: 60, y: 100, width: 150, height: 4, color: "#34d399" }, { type: "circle", x: 800, y: -50, size: 300, color: "#10b981", opacity: 0.15 }],
    watermark: { position: "bottom-right", color: "#34d399" } },
  { id: "business-5", category: "business", name: "Consulting",
    config: { background: "#ffffff", textColor: "#1f2937", accentColor: "#2563eb" },
    decorations: [{ type: "border", x: 40, y: 40, width: 1000, height: 1000, color: "#2563eb", thickness: 3 }, { type: "line", x: 60, y: 100, width: 80, height: 4, color: "#2563eb" }],
    watermark: { position: "bottom-right", color: "#2563eb" } },
  { id: "business-6", category: "business", name: "Law Firm",
    config: { background: "linear-gradient(180deg, #292524 0%, #1c1917 100%)", textColor: "#fafaf9", accentColor: "#b45309" },
    decorations: [{ type: "line", x: 60, y: 100, width: 100, height: 3, color: "#b45309" }, { type: "border", x: 50, y: 50, width: 980, height: 980, color: "#44403c", thickness: 1 }],
    watermark: { position: "bottom-center", color: "#b45309" } },
  { id: "business-7", category: "business", name: "Real Estate",
    config: { background: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)", textColor: "#fef3c7", accentColor: "#fbbf24" },
    decorations: [{ type: "circle", x: 700, y: -100, size: 400, color: "#fbbf24", opacity: 0.15 }, { type: "line", x: 60, y: 950, width: 150, height: 4, color: "#fbbf24" }],
    watermark: { position: "bottom-right", color: "#fbbf24" } },
  { id: "business-8", category: "business", name: "Healthcare",
    config: { background: "linear-gradient(180deg, #0891b2 0%, #0e7490 50%, #155e75 100%)", textColor: "#ecfeff", accentColor: "#67e8f9" },
    decorations: [{ type: "circle", x: -100, y: 700, size: 400, color: "#22d3ee", opacity: 0.15 }, { type: "line", x: 60, y: 100, width: 120, height: 4, color: "#67e8f9" }],
    watermark: { position: "bottom-right", color: "#67e8f9" } },
  { id: "business-9", category: "business", name: "Marketing",
    config: { background: "linear-gradient(135deg, #dc2626 0%, #e11d48 50%, #be185d 100%)", textColor: "#ffffff", accentColor: "#fecdd3" },
    decorations: [{ type: "circle", x: 800, y: 800, size: 500, color: "#ffffff", opacity: 0.1 }, { type: "circle", x: -100, y: -100, size: 400, color: "#ffffff", opacity: 0.08 }],
    watermark: { position: "bottom-center", color: "#fecdd3" } },
  { id: "business-10", category: "business", name: "Education",
    config: { background: "linear-gradient(180deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)", textColor: "#dbeafe", accentColor: "#fbbf24" },
    decorations: [{ type: "circle", x: 800, y: 50, size: 250, color: "#3b82f6", opacity: 0.2 }, { type: "line", x: 60, y: 100, width: 100, height: 4, color: "#fbbf24" }, { type: "line", x: 60, y: 950, width: 100, height: 4, color: "#fbbf24" }],
    watermark: { position: "bottom-center", color: "#93c5fd" } },
];

const CARD_SIZES = [
  { id: "square", name: "Square 1:1", width: 1080, height: 1080 },
  { id: "portrait", name: "Portrait 4:5", width: 1080, height: 1350 },
  { id: "story", name: "Story 9:16", width: 1080, height: 1920 },
  { id: "landscape", name: "Landscape 16:9", width: 1920, height: 1080 },
  { id: "twitter", name: "Twitter", width: 1200, height: 675 },
];

const IMAGE_FIT_OPTIONS = [
  { id: "cover", name: "Cover", desc: "Fill area, crop" },
  { id: "contain", name: "Contain", desc: "Fit inside" },
  { id: "fill", name: "Fill", desc: "Stretch" },
  { id: "none", name: "Original", desc: "No resize" },
];

interface CanvasElement {
  id: string;
  type: "text" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  borderRadius?: number;
  shadow?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none";
  // Image zoom and position
  zoom?: number;
  imageX?: number;
  imageY?: number;
}

interface Decoration {
  type: string;
  x?: number;
  y?: number;
  size?: number;
  width?: number;
  height?: number;
  color: string;
  opacity?: number;
  thickness?: number;
  position?: string;
  rotate?: number;
}

interface RecentHook {
  _id: string;
  text: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  // Canvas elements
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: "hook-text",
      type: "text",
      x: 60,
      y: 200,
      width: 960,
      height: 450,
      content: "Your viral hook goes here.\n\nMake it impactful!",
      fontSize: 58,
      fontWeight: "700",
      textAlign: "center",
      color: "#ffffff",
    },
    {
      id: "author-text",
      type: "text",
      x: 380,
      y: 720,
      width: 320,
      height: 60,
      content: "@yourhandle",
      fontSize: 28,
      fontWeight: "500",
      textAlign: "center",
      color: "#8b5cf6",
    },
  ]);

  // Decorations from template
  const [decorations, setDecorations] = useState<Decoration[]>(CARD_TEMPLATES[0].decorations || []);

  // Watermark from template (non-removable)
  const [watermark, setWatermark] = useState<{ position: string; color: string }>(CARD_TEMPLATES[0].watermark || { position: "bottom-right", color: "#ffffff" });

  // Selected element
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0, elemW: 0, elemH: 0 });

  // Card design state
  const [selectedCategory, setSelectedCategory] = useState("basic");
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0]);
  const [selectedSize, setSelectedSize] = useState(CARD_SIZES[0]);
  const [bgColor, setBgColor] = useState(CARD_TEMPLATES[0].config.background);
  const [textColor, setTextColor] = useState(CARD_TEMPLATES[0].config.textColor);
  const [accentColor, setAccentColor] = useState(CARD_TEMPLATES[0].config.accentColor);

  // Filter templates by category
  const filteredTemplates = CARD_TEMPLATES.filter(t => t.category === selectedCategory);

  // Background image
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState(30);

  // Recent hooks
  const [recentHooks, setRecentHooks] = useState<RecentHook[]>([]);
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [showRecentHooks, setShowRecentHooks] = useState(true);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);

  // Export
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Preview dimensions
  const previewMaxWidth = 400;
  const aspectRatio = selectedSize.height / selectedSize.width;
  const previewWidth = previewMaxWidth;
  const previewHeight = Math.min(previewMaxWidth * aspectRatio, 520);
  const scale = previewWidth / selectedSize.width;

  useEffect(() => {
    fetchRecentHooks();
  }, []);

  const fetchRecentHooks = async () => {
    setLoadingHooks(true);
    try {
      const result = await userApi.history(1, 10, "hooks");
      if (result.success && result.data) {
        const data = result.data as { generations: Array<{ _id: string; output: { hooks: Array<{ text: string }> }; createdAt: string }> };
        const hooks: RecentHook[] = [];
        data.generations.forEach((gen) => {
          if (gen.output?.hooks) {
            gen.output.hooks.forEach((hook, index) => {
              hooks.push({
                _id: `${gen._id}-${index}`,
                text: hook.text,
                createdAt: gen.createdAt,
              });
            });
          }
        });
        setRecentHooks(hooks.slice(0, 15));
      }
    } catch (err) {
      console.error("Failed to fetch hooks:", err);
    }
    setLoadingHooks(false);
  };

  const handleUseHook = (text: string, id: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === "hook-text" ? { ...el, content: text } : el))
    );
    setCopiedHookId(id);
    setTimeout(() => setCopiedHookId(null), 2000);
  };

  const handleTemplateSelect = (template: typeof CARD_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setSelectedCategory(template.category);
    setBgColor(template.config.background);
    setTextColor(template.config.textColor);
    setAccentColor(template.config.accentColor);
    setDecorations(template.decorations || []);
    setWatermark(template.watermark || { position: "bottom-right", color: "#ffffff" });
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === "hook-text") return { ...el, color: template.config.textColor };
        if (el.id === "author-text") return { ...el, color: template.config.accentColor };
        return el;
      })
    );
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleContentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage: CanvasElement = {
          id: `image-${Date.now()}`,
          type: "image",
          x: 340,
          y: 100,
          width: 400,
          height: 400,
          content: reader.result as string,
          borderRadius: 8,
          shadow: true,
          objectFit: "cover",
          zoom: 100,
          imageX: 50,
          imageY: 50,
        };
        setElements((prev) => [...prev, newImage]);
        setSelectedId(newImage.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string, handle?: string) => {
      e.stopPropagation();
      e.preventDefault();

      const element = elements.find((el) => el.id === elementId);
      if (!element) return;

      setSelectedId(elementId);

      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
      } else {
        setIsDragging(true);
      }

      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elemX: element.x,
        elemY: element.y,
        elemW: element.width,
        elemH: element.height,
      });
    },
    [elements]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!selectedId || (!isDragging && !isResizing)) return;

      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;

      setElements((prev) =>
        prev.map((el) => {
          if (el.id !== selectedId) return el;

          if (isDragging) {
            return {
              ...el,
              x: Math.max(0, Math.min(selectedSize.width - el.width, dragStart.elemX + dx)),
              y: Math.max(0, Math.min(selectedSize.height - el.height, dragStart.elemY + dy)),
            };
          }

          if (isResizing && resizeHandle) {
            let newX = dragStart.elemX;
            let newY = dragStart.elemY;
            let newW = dragStart.elemW;
            let newH = dragStart.elemH;

            if (resizeHandle.includes("e")) newW = Math.max(80, dragStart.elemW + dx);
            if (resizeHandle.includes("w")) {
              newW = Math.max(80, dragStart.elemW - dx);
              newX = dragStart.elemX + dragStart.elemW - newW;
            }
            if (resizeHandle.includes("s")) newH = Math.max(40, dragStart.elemH + dy);
            if (resizeHandle.includes("n")) {
              newH = Math.max(40, dragStart.elemH - dy);
              newY = dragStart.elemY + dragStart.elemH - newH;
            }

            return { ...el, x: Math.max(0, newX), y: Math.max(0, newY), width: newW, height: newH };
          }

          return el;
        })
      );
    },
    [selectedId, isDragging, isResizing, resizeHandle, dragStart, scale, selectedSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteElement = (id: string) => {
    if (id === "hook-text" || id === "author-text") return;
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  const handleExport = async () => {
    if (!cardRef.current) return;

    const prevSelected = selectedId;
    setSelectedId(null);
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const exportScale = selectedSize.width / cardRef.current.offsetWidth;

      const dataUrl = await toPng(cardRef.current, {
        width: selectedSize.width,
        height: selectedSize.height,
        style: {
          transform: `scale(${exportScale})`,
          transformOrigin: "top left",
        },
        pixelRatio: 1,
      });

      const link = document.createElement("a");
      link.download = `social-card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("Export failed:", err);
    }

    setIsExporting(false);
    setSelectedId(prevSelected);
  };

  // Render decorations
  const renderDecoration = (dec: Decoration, index: number) => {
    const s = scale;
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      pointerEvents: "none",
    };

    switch (dec.type) {
      case "quote":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              fontSize: (dec.size || 100) * s,
              color: dec.color,
              opacity: dec.opacity || 0.3,
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            "
          </div>
        );

      case "circle":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              width: (dec.size || 100) * s,
              height: (dec.size || 100) * s,
              borderRadius: "50%",
              background: dec.color,
              opacity: dec.opacity || 0.1,
            }}
          />
        );

      case "line":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              width: (dec.width || 100) * s,
              height: (dec.height || 4) * s,
              background: dec.color,
              borderRadius: (dec.height || 4) * s,
            }}
          />
        );

      case "border":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              width: (dec.width || 100) * s,
              height: (dec.height || 100) * s,
              border: `${(dec.thickness || 2) * s}px solid ${dec.color}`,
              borderRadius: 4 * s,
            }}
          />
        );

      case "glow-border":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              width: (dec.width || 100) * s,
              height: (dec.height || 100) * s,
              border: `${2 * s}px solid ${dec.color}`,
              boxShadow: `0 0 ${20 * s}px ${dec.color}`,
              opacity: dec.opacity || 0.5,
              borderRadius: 4 * s,
            }}
          />
        );

      case "corner":
        const cornerSize = (dec.size || 60) * s;
        const isTopLeft = dec.position === "top-left";
        const isTopRight = dec.position === "top-right";
        const isBottomRight = dec.position === "bottom-right";
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              ...(isTopLeft && { top: 20 * s, left: 20 * s }),
              ...(isTopRight && { top: 20 * s, right: 20 * s }),
              ...(isBottomRight && { bottom: 20 * s, right: 20 * s }),
              ...(!isTopLeft && !isTopRight && !isBottomRight && { bottom: 20 * s, left: 20 * s }),
              width: cornerSize,
              height: cornerSize,
              borderTop: isTopLeft || isTopRight ? `${3 * s}px solid ${dec.color}` : "none",
              borderBottom: !isTopLeft && !isTopRight ? `${3 * s}px solid ${dec.color}` : "none",
              borderLeft: isTopLeft || (!isTopRight && !isBottomRight) ? `${3 * s}px solid ${dec.color}` : "none",
              borderRight: isTopRight || isBottomRight ? `${3 * s}px solid ${dec.color}` : "none",
            }}
          />
        );

      case "wave":
        return (
          <svg
            key={index}
            style={{
              ...baseStyle,
              left: 0,
              top: (dec.y || 800) * s,
              width: "100%",
              height: 150 * s,
              opacity: dec.opacity || 0.1,
            }}
            viewBox="0 0 1080 150"
            preserveAspectRatio="none"
          >
            <path
              d={`M0,50 Q270,0 540,50 T1080,50 L1080,150 L0,150 Z`}
              fill={dec.color}
            />
          </svg>
        );

      case "leaf":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              width: (dec.size || 80) * s,
              height: (dec.size || 80) * s,
              transform: `rotate(${dec.rotate || 0}deg)`,
              opacity: dec.opacity || 0.3,
            }}
          >
            <svg viewBox="0 0 100 100" fill={dec.color}>
              <path d="M50,0 Q80,30 80,60 Q80,90 50,100 Q20,90 20,60 Q20,30 50,0" />
            </svg>
          </div>
        );

      case "dots":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              opacity: dec.opacity || 0.3,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8 * s,
            }}
          >
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6 * s,
                  height: 6 * s,
                  borderRadius: "50%",
                  background: dec.color,
                }}
              />
            ))}
          </div>
        );

      case "grid":
        return (
          <div
            key={index}
            style={{
              ...baseStyle,
              inset: 0,
              opacity: dec.opacity || 0.1,
              backgroundImage: `linear-gradient(${dec.color} 1px, transparent 1px), linear-gradient(90deg, ${dec.color} 1px, transparent 1px)`,
              backgroundSize: `${40 * s}px ${40 * s}px`,
            }}
          />
        );

      case "triangle":
        const triSize = (dec.size || 200) * s;
        return (
          <svg
            key={index}
            style={{
              ...baseStyle,
              left: (dec.x || 0) * s,
              top: (dec.y || 0) * s,
              width: triSize,
              height: triSize * 0.866,
              opacity: dec.opacity || 0.3,
            }}
            viewBox="0 0 100 87"
            preserveAspectRatio="none"
          >
            <polygon points="50,0 100,87 0,87" fill={dec.color} />
          </svg>
        );

      default:
        return null;
    }
  };

  const ResizeHandles = ({ elementId }: { elementId: string }) => {
    const handles = ["nw", "ne", "se", "sw"];
    const cursorMap: Record<string, string> = {
      nw: "nwse-resize", ne: "nesw-resize", se: "nwse-resize", sw: "nesw-resize",
    };

    return (
      <>
        {handles.map((handle) => {
          const style: React.CSSProperties = {
            position: "absolute",
            width: 8,
            height: 8,
            background: "#8b5cf6",
            border: "1px solid white",
            borderRadius: 2,
            cursor: cursorMap[handle],
            zIndex: 100,
          };

          if (handle === "nw") { style.top = -4; style.left = -4; }
          if (handle === "ne") { style.top = -4; style.right = -4; }
          if (handle === "se") { style.bottom = -4; style.right = -4; }
          if (handle === "sw") { style.bottom = -4; style.left = -4; }

          return (
            <div
              key={handle}
              style={style}
              onMouseDown={(e) => handleMouseDown(e, elementId, handle)}
            />
          );
        })}
      </>
    );
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Card Designer</h1>
          <p className="text-gray-400 text-sm">Click to select, drag to move, corners to resize</p>
        </div>
        <Button
          onClick={handleExport}
          isLoading={isExporting}
          className={exportSuccess ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {exportSuccess ? <><Check className="w-4 h-4" /> Downloaded!</> : <><Download className="w-4 h-4" /> Download PNG</>}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr,440px] gap-6">
        {/* Left Controls */}
        <div className="space-y-4 lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          {/* Recent Hooks */}
          <Card className="p-4">
            <button onClick={() => setShowRecentHooks(!showRecentHooks)} className="w-full flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Your Recent Hooks
              </h3>
              {showRecentHooks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRecentHooks && (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {loadingHooks ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-purple-500" />
                  </div>
                ) : recentHooks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No hooks yet. Generate some!</p>
                ) : (
                  recentHooks.map((hook) => (
                    <div
                      key={hook._id}
                      className="group p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
                      onClick={() => handleUseHook(hook.text, hook._id)}
                    >
                      <p className="text-sm text-gray-300 line-clamp-2">{hook.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{new Date(hook.createdAt).toLocaleDateString()}</span>
                        <span className={`text-xs flex items-center gap-1 ${copiedHookId === hook._id ? "text-green-400" : "text-purple-400 opacity-0 group-hover:opacity-100"}`}>
                          {copiedHookId === hook._id ? <><Check className="w-3 h-3" /> Used!</> : <><Copy className="w-3 h-3" /> Use</>}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          {/* Templates */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Design Templates
            </h3>

            {/* Category Tabs */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Template Grid - Real Previews */}
            <div className="grid grid-cols-5 gap-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedTemplate.id === template.id ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900" : "hover:scale-105"
                  }`}
                  title={template.name}
                  style={{ background: template.config.background }}
                >
                  {/* Mini decorations preview */}
                  {template.decorations?.map((dec, i) => {
                    const miniScale = 0.05;
                    if (dec.type === "circle") {
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            left: (dec.x || 0) * miniScale,
                            top: (dec.y || 0) * miniScale,
                            width: (dec.size || 100) * miniScale,
                            height: (dec.size || 100) * miniScale,
                            background: dec.color,
                            opacity: dec.opacity || 0.2,
                          }}
                        />
                      );
                    }
                    if (dec.type === "line") {
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: (dec.x || 0) * miniScale,
                            top: (dec.y || 0) * miniScale,
                            width: (dec.width || 100) * miniScale,
                            height: Math.max(1, (dec.height || 4) * miniScale),
                            background: dec.color,
                          }}
                        />
                      );
                    }
                    if (dec.type === "corner") {
                      const size = (dec.size || 60) * miniScale;
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            ...(dec.position === "top-left" && { top: 2, left: 2 }),
                            ...(dec.position === "top-right" && { top: 2, right: 2 }),
                            ...(dec.position === "bottom-right" && { bottom: 2, right: 2 }),
                            ...(dec.position === "bottom-left" && { bottom: 2, left: 2 }),
                            width: size,
                            height: size,
                            borderTop: (dec.position === "top-left" || dec.position === "top-right") ? `1px solid ${dec.color}` : "none",
                            borderBottom: (dec.position === "bottom-left" || dec.position === "bottom-right") ? `1px solid ${dec.color}` : "none",
                            borderLeft: (dec.position === "top-left" || dec.position === "bottom-left") ? `1px solid ${dec.color}` : "none",
                            borderRight: (dec.position === "top-right" || dec.position === "bottom-right") ? `1px solid ${dec.color}` : "none",
                          }}
                        />
                      );
                    }
                    if (dec.type === "border" || dec.type === "glow-border") {
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: (dec.x || 0) * miniScale,
                            top: (dec.y || 0) * miniScale,
                            width: (dec.width || 100) * miniScale,
                            height: (dec.height || 100) * miniScale,
                            border: `1px solid ${dec.color}`,
                            opacity: dec.opacity || 0.5,
                            boxShadow: dec.type === "glow-border" ? `0 0 4px ${dec.color}` : "none",
                          }}
                        />
                      );
                    }
                    if (dec.type === "wave") {
                      return (
                        <div
                          key={i}
                          className="absolute left-0 right-0"
                          style={{
                            top: (dec.y || 800) * miniScale,
                            height: 4,
                            background: dec.color,
                            opacity: dec.opacity || 0.2,
                            borderRadius: 2,
                          }}
                        />
                      );
                    }
                    if (dec.type === "dots") {
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: (dec.x || 0) * miniScale,
                            top: (dec.y || 0) * miniScale,
                            width: 4,
                            height: 4,
                            background: dec.color,
                            borderRadius: "50%",
                            opacity: dec.opacity || 0.4,
                          }}
                        />
                      );
                    }
                    if (dec.type === "grid") {
                      return (
                        <div
                          key={i}
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `linear-gradient(${dec.color} 1px, transparent 1px), linear-gradient(90deg, ${dec.color} 1px, transparent 1px)`,
                            backgroundSize: "4px 4px",
                            opacity: dec.opacity || 0.15,
                          }}
                        />
                      );
                    }
                    if (dec.type === "leaf") {
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            left: (dec.x || 0) * miniScale,
                            top: (dec.y || 0) * miniScale,
                            width: (dec.size || 80) * miniScale * 0.5,
                            height: (dec.size || 80) * miniScale,
                            background: dec.color,
                            opacity: dec.opacity || 0.3,
                            transform: `rotate(${dec.rotate || 0}deg)`,
                            borderRadius: "50% 0 50% 0",
                          }}
                        />
                      );
                    }
                    if (dec.type === "triangle") {
                      const triMiniSize = (dec.size || 200) * miniScale;
                      return (
                        <div
                          key={i}
                          className="absolute"
                          style={{
                            left: (dec.x || 0) * miniScale,
                            top: (dec.y || 0) * miniScale,
                            width: 0,
                            height: 0,
                            borderLeft: `${triMiniSize / 2}px solid transparent`,
                            borderRight: `${triMiniSize / 2}px solid transparent`,
                            borderBottom: `${triMiniSize * 0.866}px solid ${dec.color}`,
                            opacity: dec.opacity || 0.3,
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                  {/* Text preview lines */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                    <div className="w-3/4 h-0.5 rounded mb-0.5" style={{ background: template.config.textColor, opacity: 0.6 }} />
                    <div className="w-1/2 h-0.5 rounded" style={{ background: template.config.textColor, opacity: 0.4 }} />
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{selectedTemplate.name}</p>
          </Card>

          {/* Size */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Move className="w-4 h-4 text-cyan-400" />
              Card Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {CARD_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    selectedSize.id === size.id ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Selected Element */}
          {selectedElement && (
            <Card className="p-4 border-2 border-purple-500/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  {selectedElement.type === "text" ? <Type className="w-4 h-4 text-green-400" /> : <ImageIcon className="w-4 h-4 text-pink-400" />}
                  {selectedElement.id === "hook-text" ? "Hook Text" : selectedElement.id === "author-text" ? "Author" : selectedElement.type === "image" ? "Image" : "Text"}
                </h3>
                {selectedElement.id !== "hook-text" && selectedElement.id !== "author-text" && (
                  <Button variant="ghost" size="sm" onClick={() => deleteElement(selectedElement.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>

              {selectedElement.type === "text" && (
                <div className="space-y-4">
                  <Textarea
                    label="Text"
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="min-h-[80px]"
                  />
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Size: {selectedElement.fontSize}px</label>
                    <div className="flex items-center gap-2">
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { fontSize: Math.max(12, (selectedElement.fontSize || 24) - 4) })}><Minus className="w-4 h-4" /></Button>
                      <input type="range" min="12" max="120" value={selectedElement.fontSize || 24} onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })} className="flex-1 accent-purple-500" />
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { fontSize: Math.min(120, (selectedElement.fontSize || 24) + 4) })}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(["left", "center", "right"] as const).map((align) => (
                      <Button key={align} variant={selectedElement.textAlign === align ? "primary" : "glass"} size="sm" onClick={() => updateElement(selectedElement.id, { textAlign: align })}>
                        {align === "left" ? <AlignLeft className="w-4 h-4" /> : align === "center" ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["400", "500", "600", "700", "800"].map((w) => (
                      <button key={w} onClick={() => updateElement(selectedElement.id, { fontWeight: w })} className={`px-2 py-1 rounded text-xs ${selectedElement.fontWeight === w ? "bg-purple-500 text-white" : "bg-white/5"}`} style={{ fontWeight: w }}>{w === "400" ? "Reg" : w === "700" ? "Bold" : w}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={selectedElement.color || "#fff"} onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })} className="w-8 h-8 rounded" />
                    <Input value={selectedElement.color || "#fff"} onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })} className="flex-1 text-xs" />
                  </div>
                </div>
              )}

              {selectedElement.type === "image" && (
                <div className="space-y-4">
                  {/* Zoom Control */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Zoom: {selectedElement.zoom || 100}%</label>
                    <div className="flex items-center gap-2">
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { zoom: Math.max(100, (selectedElement.zoom || 100) - 10) })}><Minus className="w-4 h-4" /></Button>
                      <input type="range" min="100" max="300" value={selectedElement.zoom || 100} onChange={(e) => updateElement(selectedElement.id, { zoom: Number(e.target.value) })} className="flex-1 accent-purple-500" />
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { zoom: Math.min(300, (selectedElement.zoom || 100) + 10) })}><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  {/* Position Controls - only show when zoomed */}
                  {(selectedElement.zoom || 100) > 100 && (
                    <div className="space-y-3 p-3 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400 font-medium">Position (drag to adjust)</p>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Horizontal: {selectedElement.imageX || 50}%</label>
                        <input type="range" min="0" max="100" value={selectedElement.imageX || 50} onChange={(e) => updateElement(selectedElement.id, { imageX: Number(e.target.value) })} className="w-full accent-purple-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Vertical: {selectedElement.imageY || 50}%</label>
                        <input type="range" min="0" max="100" value={selectedElement.imageY || 50} onChange={(e) => updateElement(selectedElement.id, { imageY: Number(e.target.value) })} className="w-full accent-purple-500" />
                      </div>
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { imageX: 50, imageY: 50 })} className="w-full text-xs">Center Image</Button>
                    </div>
                  )}

                  {/* Fit Options */}
                  <div className="grid grid-cols-2 gap-2">
                    {IMAGE_FIT_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => updateElement(selectedElement.id, { objectFit: opt.id as "cover" | "contain" | "fill" | "none" })} className={`p-2 rounded text-left text-xs ${selectedElement.objectFit === opt.id ? "bg-purple-500 text-white" : "bg-white/5"}`}>
                        <div className="font-medium">{opt.name}</div>
                        <div className="text-[10px] opacity-70">{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Border Radius */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateElement(selectedElement.id, { borderRadius: 0 })} className={`p-2 rounded ${selectedElement.borderRadius === 0 ? "bg-purple-500" : "bg-white/5"}`}><Square className="w-4 h-4" /></button>
                    <input type="range" min="0" max="50" value={selectedElement.borderRadius || 0} onChange={(e) => updateElement(selectedElement.id, { borderRadius: Number(e.target.value) })} className="flex-1 accent-purple-500" />
                    <button onClick={() => updateElement(selectedElement.id, { borderRadius: 50 })} className={`p-2 rounded ${selectedElement.borderRadius === 50 ? "bg-purple-500" : "bg-white/5"}`}><Circle className="w-4 h-4" /></button>
                  </div>

                  {/* Shadow */}
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" checked={selectedElement.shadow || false} onChange={(e) => updateElement(selectedElement.id, { shadow: e.target.checked })} className="rounded" />
                    Shadow
                  </label>
                </div>
              )}
            </Card>
          )}

          {/* Add Elements */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-400" /> Add</h3>
            <input ref={contentImageInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
            <div className="flex gap-2">
              <Button variant="glass" onClick={() => contentImageInputRef.current?.click()} className="flex-1"><ImageIcon className="w-4 h-4" /> Image</Button>
              <Button variant="glass" onClick={() => { const t: CanvasElement = { id: `text-${Date.now()}`, type: "text", x: 200, y: 400, width: 680, height: 100, content: "New text", fontSize: 40, fontWeight: "600", textAlign: "center", color: textColor }; setElements((p) => [...p, t]); setSelectedId(t.id); }} className="flex-1"><Type className="w-4 h-4" /> Text</Button>
            </div>
          </Card>

          {/* Background */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><RectangleHorizontal className="w-4 h-4 text-blue-400" /> Background</h3>
            <input ref={bgImageInputRef} type="file" accept="image/*" onChange={handleBgImageUpload} className="hidden" />
            {bgImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                  <img src={bgImage} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setBgImage(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500"><Trash2 className="w-4 h-4 text-white" /></button>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Opacity: {bgOpacity}%</label>
                  <input type="range" min="10" max="100" value={bgOpacity} onChange={(e) => setBgOpacity(Number(e.target.value))} className="w-full accent-purple-500" />
                </div>
              </div>
            ) : (
              <Button variant="glass" onClick={() => bgImageInputRef.current?.click()} className="w-full"><Upload className="w-4 h-4" /> Upload</Button>
            )}
          </Card>

          <Button variant="glass" onClick={() => { handleTemplateSelect(CARD_TEMPLATES[0]); setBgImage(null); setSelectedId(null); setElements([{ id: "hook-text", type: "text", x: 60, y: 200, width: 960, height: 450, content: "Your viral hook goes here.\n\nMake it impactful!", fontSize: 58, fontWeight: "700", textAlign: "center", color: CARD_TEMPLATES[0].config.textColor }, { id: "author-text", type: "text", x: 380, y: 720, width: 320, height: 60, content: "@yourhandle", fontSize: 28, fontWeight: "500", textAlign: "center", color: CARD_TEMPLATES[0].config.accentColor }]); }} className="w-full"><RotateCcw className="w-4 h-4" /> Reset</Button>
        </div>

        {/* Canvas */}
        <div className="lg:sticky lg:top-0">
          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-center">Preview</h3>
            <p className="text-xs text-gray-500 text-center mb-3">{selectedSize.width} × {selectedSize.height}px</p>

            <div className="flex justify-center overflow-hidden">
              <div
                ref={cardRef}
                className="relative overflow-hidden rounded-lg shadow-2xl select-none"
                style={{ width: previewWidth, height: previewHeight, background: bgColor }}
                onClick={handleCanvasClick}
              >
                {/* Background Image */}
                {bgImage && (
                  <>
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity / 100 }}>
                      <img src={bgImage} alt="" className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))" }} />
                  </>
                )}

                {/* Decorations */}
                {decorations.map((dec, i) => renderDecoration(dec, i))}

                {/* Elements */}
                {elements.map((el) => {
                  const isSelected = selectedId === el.id;
                  return (
                    <div
                      key={el.id}
                      className={`absolute ${isSelected ? "ring-2 ring-purple-500" : ""}`}
                      style={{
                        left: el.x * scale,
                        top: el.y * scale,
                        width: el.width * scale,
                        height: el.height * scale,
                        cursor: isDragging && isSelected ? "grabbing" : "grab",
                        zIndex: isSelected ? 50 : el.type === "image" ? 10 : 20,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, el.id)}
                    >
                      {el.type === "text" ? (
                        <div
                          className="w-full h-full flex items-center justify-center overflow-hidden"
                          style={{
                            color: el.color,
                            fontSize: (el.fontSize || 24) * scale,
                            fontWeight: el.fontWeight || "600",
                            textAlign: el.textAlign || "center",
                            lineHeight: 1.2,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            userSelect: "none",
                          }}
                        >
                          {el.content}
                        </div>
                      ) : (
                        <div
                          className="w-full h-full overflow-hidden"
                          style={{
                            borderRadius: `${el.borderRadius || 0}%`,
                            boxShadow: el.shadow ? "0 10px 30px rgba(0,0,0,0.4)" : "none",
                          }}
                        >
                          <img
                            src={el.content}
                            alt=""
                            style={{
                              width: `${el.zoom || 100}%`,
                              height: `${el.zoom || 100}%`,
                              objectFit: el.objectFit || "cover",
                              objectPosition: `${el.imageX || 50}% ${el.imageY || 50}%`,
                              transform: `translate(-${((el.zoom || 100) - 100) * (el.imageX || 50) / 100}%, -${((el.zoom || 100) - 100) * (el.imageY || 50) / 100}%)`,
                              userSelect: "none",
                              pointerEvents: "none",
                            }}
                            draggable={false}
                          />
                        </div>
                      )}
                      {isSelected && <ResizeHandles elementId={el.id} />}
                    </div>
                  );
                })}

                {/* Watermark - Non-removable */}
                <div
                  className="absolute pointer-events-none select-none"
                  style={{
                    bottom: 25 * scale,
                    right: 25 * scale,
                    ...(watermark.position === "bottom-left" && { right: "auto", left: 25 * scale }),
                    ...(watermark.position === "bottom-center" && { right: "auto", left: "50%", transform: "translateX(-50%)" }),
                    ...(watermark.position === "top-right" && { bottom: "auto", top: 25 * scale }),
                    fontSize: 20 * scale,
                    color: watermark.color,
                    opacity: 0.85,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    zIndex: 100,
                  }}
                >
                  made by threadn.launchory.org
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400"><strong>Click</strong> select • <strong>Drag</strong> move • <strong>Corners</strong> resize</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
