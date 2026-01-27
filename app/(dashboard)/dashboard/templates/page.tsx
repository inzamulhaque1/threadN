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
  Quote,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { toPng } from "html-to-image";
import { userApi } from "@/lib/api";

// Pre-designed card templates
const CARD_TEMPLATES = [
  {
    id: "quote-elegant",
    name: "Elegant Quote",
    config: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      textColor: "#ffffff",
      accentColor: "#8b5cf6",
    },
  },
  {
    id: "bold-statement",
    name: "Bold Statement",
    config: {
      background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    config: {
      background: "#ffffff",
      textColor: "#111827",
      accentColor: "#8b5cf6",
    },
  },
  {
    id: "dark-neon",
    name: "Dark Neon",
    config: {
      background: "#000000",
      textColor: "#00ff88",
      accentColor: "#ff00ff",
    },
  },
  {
    id: "ocean-wave",
    name: "Ocean Wave",
    config: {
      background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    config: {
      background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
      textColor: "#ffffff",
      accentColor: "#fef3c7",
    },
  },
  {
    id: "forest-calm",
    name: "Forest Calm",
    config: {
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
  },
  {
    id: "professional",
    name: "Professional",
    config: {
      background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
      textColor: "#f3f4f6",
      accentColor: "#3b82f6",
    },
  },
];

const CARD_SIZES = [
  { id: "square", name: "Square 1:1", width: 1080, height: 1080 },
  { id: "portrait", name: "Portrait 4:5", width: 1080, height: 1350 },
  { id: "story", name: "Story 9:16", width: 1080, height: 1920 },
  { id: "landscape", name: "Landscape 16:9", width: 1920, height: 1080 },
  { id: "twitter", name: "Twitter", width: 1200, height: 675 },
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
      x: 40,
      y: 80,
      width: 300,
      height: 150,
      content: "Your viral hook goes here.\n\nMake it impactful!",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center",
      color: "#ffffff",
    },
    {
      id: "author-text",
      type: "text",
      x: 140,
      y: 280,
      width: 120,
      height: 30,
      content: "@yourhandle",
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
      color: "#8b5cf6",
    },
  ]);

  // Selected element
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elemX: 0, elemY: 0, elemW: 0, elemH: 0 });

  // Card design state
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0]);
  const [selectedSize, setSelectedSize] = useState(CARD_SIZES[0]);
  const [bgColor, setBgColor] = useState(CARD_TEMPLATES[0].config.background);
  const [textColor, setTextColor] = useState(CARD_TEMPLATES[0].config.textColor);
  const [accentColor, setAccentColor] = useState(CARD_TEMPLATES[0].config.accentColor);

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
  const previewMaxWidth = 380;
  const aspectRatio = selectedSize.height / selectedSize.width;
  const previewWidth = previewMaxWidth;
  const previewHeight = Math.min(previewMaxWidth * aspectRatio, 500);

  // Scale factor for coordinates
  const scale = previewWidth / selectedSize.width;

  // Fetch recent hooks
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
    setBgColor(template.config.background);
    setTextColor(template.config.textColor);
    setAccentColor(template.config.accentColor);
    // Update text colors
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
          x: 120,
          y: 20,
          width: 150,
          height: 150,
          content: reader.result as string,
          borderRadius: 12,
          shadow: true,
        };
        setElements((prev) => [...prev, newImage]);
        setSelectedId(newImage.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mouse handlers for drag and resize
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
    (e: React.MouseEvent) => {
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
            let newX = el.x;
            let newY = el.y;
            let newW = el.width;
            let newH = el.height;

            if (resizeHandle.includes("e")) {
              newW = Math.max(50, dragStart.elemW + dx);
            }
            if (resizeHandle.includes("w")) {
              const widthChange = dx;
              newW = Math.max(50, dragStart.elemW - widthChange);
              newX = dragStart.elemX + (dragStart.elemW - newW);
            }
            if (resizeHandle.includes("s")) {
              newH = Math.max(30, dragStart.elemH + dy);
            }
            if (resizeHandle.includes("n")) {
              const heightChange = dy;
              newH = Math.max(30, dragStart.elemH - heightChange);
              newY = dragStart.elemY + (dragStart.elemH - newH);
            }

            return { ...el, x: newX, y: newY, width: newW, height: newH };
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteElement = (id: string) => {
    if (id === "hook-text" || id === "author-text") return; // Don't delete main text
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
          width: `${cardRef.current.offsetWidth}px`,
          height: `${cardRef.current.offsetHeight}px`,
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

  // Resize handles component
  const ResizeHandles = ({ element }: { element: CanvasElement }) => {
    const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
    const cursorMap: Record<string, string> = {
      nw: "nw-resize",
      n: "n-resize",
      ne: "ne-resize",
      e: "e-resize",
      se: "se-resize",
      s: "s-resize",
      sw: "sw-resize",
      w: "w-resize",
    };

    return (
      <>
        {handles.map((handle) => {
          let style: React.CSSProperties = {
            position: "absolute",
            width: 10,
            height: 10,
            background: "#8b5cf6",
            border: "2px solid white",
            borderRadius: 2,
            cursor: cursorMap[handle],
            zIndex: 100,
          };

          if (handle.includes("n")) style.top = -5;
          if (handle.includes("s")) style.bottom = -5;
          if (handle.includes("w")) style.left = -5;
          if (handle.includes("e")) style.right = -5;
          if (handle === "n" || handle === "s") {
            style.left = "50%";
            style.transform = "translateX(-50%)";
          }
          if (handle === "w" || handle === "e") {
            style.top = "50%";
            style.transform = "translateY(-50%)";
          }

          return (
            <div
              key={handle}
              style={style}
              onMouseDown={(e) => handleMouseDown(e, element.id, handle)}
            />
          );
        })}
      </>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
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
          {exportSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Downloaded!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PNG
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr,420px] gap-6">
        {/* Left Side - Controls */}
        <div className="space-y-4 lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          {/* Recent Hooks */}
          <Card className="p-4">
            <button
              onClick={() => setShowRecentHooks(!showRecentHooks)}
              className="w-full flex items-center justify-between mb-2"
            >
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
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hooks yet. Generate some from the Generate page!
                  </p>
                ) : (
                  recentHooks.map((hook) => (
                    <div
                      key={hook._id}
                      className="group p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => handleUseHook(hook.text, hook._id)}
                    >
                      <p className="text-sm text-gray-300 line-clamp-2">{hook.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(hook.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs flex items-center gap-1 ${copiedHookId === hook._id ? "text-green-400" : "text-purple-400 opacity-0 group-hover:opacity-100"}`}>
                          {copiedHookId === hook._id ? <><Check className="w-3 h-3" /> Used!</> : <><Copy className="w-3 h-3" /> Click to use</>}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          {/* Template Selection */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Choose Design
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {CARD_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedTemplate.id === template.id
                      ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900"
                      : "hover:opacity-80"
                  }`}
                  title={template.name}
                  style={{ background: template.config.background }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <div className="w-full space-y-0.5">
                      <div className="h-1 rounded" style={{ background: template.config.textColor, opacity: 0.8 }} />
                      <div className="h-1 rounded w-3/4 mx-auto" style={{ background: template.config.textColor, opacity: 0.5 }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Size Selection */}
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
                    selectedSize.id === size.id
                      ? "bg-purple-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Selected Element Controls */}
          {selectedElement && (
            <Card className="p-4 border-2 border-purple-500/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  {selectedElement.type === "text" ? (
                    <Type className="w-4 h-4 text-green-400" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-pink-400" />
                  )}
                  {selectedElement.id === "hook-text" ? "Hook Text" : selectedElement.id === "author-text" ? "Author" : "Content Image"}
                </h3>
                {selectedElement.type === "image" && (
                  <Button variant="ghost" size="sm" onClick={() => deleteElement(selectedElement.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>

              {selectedElement.type === "text" && (
                <div className="space-y-4">
                  <Textarea
                    label="Text Content"
                    value={selectedElement.content}
                    onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    className="min-h-[80px]"
                  />

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Font Size: {selectedElement.fontSize}px</label>
                    <div className="flex items-center gap-2">
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { fontSize: Math.max(10, (selectedElement.fontSize || 24) - 2) })}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <input
                        type="range"
                        min="10"
                        max="72"
                        value={selectedElement.fontSize || 24}
                        onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                        className="flex-1 accent-purple-500"
                      />
                      <Button variant="glass" size="sm" onClick={() => updateElement(selectedElement.id, { fontSize: Math.min(72, (selectedElement.fontSize || 24) + 2) })}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Alignment</label>
                    <div className="flex items-center gap-2">
                      {[
                        { value: "left", icon: AlignLeft },
                        { value: "center", icon: AlignCenter },
                        { value: "right", icon: AlignRight },
                      ].map(({ value, icon: Icon }) => (
                        <Button
                          key={value}
                          variant={selectedElement.textAlign === value ? "primary" : "glass"}
                          size="sm"
                          onClick={() => updateElement(selectedElement.id, { textAlign: value as "left" | "center" | "right" })}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Font Weight</label>
                    <div className="flex flex-wrap gap-2">
                      {["400", "500", "600", "700", "800"].map((weight) => (
                        <button
                          key={weight}
                          onClick={() => updateElement(selectedElement.id, { fontWeight: weight })}
                          className={`px-3 py-1.5 rounded text-xs transition-all ${
                            selectedElement.fontWeight === weight ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                          }`}
                          style={{ fontWeight: weight }}
                        >
                          {weight === "400" ? "Regular" : weight === "700" ? "Bold" : weight}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.color || "#ffffff"}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <Input
                        value={selectedElement.color || "#ffffff"}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedElement.type === "image" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Border Radius: {selectedElement.borderRadius || 0}%</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateElement(selectedElement.id, { borderRadius: 0 })}
                        className={`p-2 rounded ${selectedElement.borderRadius === 0 ? "bg-purple-500" : "bg-white/5"}`}
                      >
                        <Square className="w-4 h-4" />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={selectedElement.borderRadius || 0}
                        onChange={(e) => updateElement(selectedElement.id, { borderRadius: Number(e.target.value) })}
                        className="flex-1 accent-purple-500"
                      />
                      <button
                        onClick={() => updateElement(selectedElement.id, { borderRadius: 50 })}
                        className={`p-2 rounded ${selectedElement.borderRadius === 50 ? "bg-purple-500" : "bg-white/5"}`}
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedElement.shadow || false}
                      onChange={(e) => updateElement(selectedElement.id, { shadow: e.target.checked })}
                      className="rounded border-gray-600"
                    />
                    <span className="text-sm text-gray-400">Drop Shadow</span>
                  </label>
                </div>
              )}
            </Card>
          )}

          {/* Add Elements */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Add Elements
            </h3>
            <input ref={contentImageInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
            <div className="flex gap-2">
              <Button variant="glass" onClick={() => contentImageInputRef.current?.click()} className="flex-1">
                <ImageIcon className="w-4 h-4" />
                Add Image
              </Button>
              <Button
                variant="glass"
                onClick={() => {
                  const newText: CanvasElement = {
                    id: `text-${Date.now()}`,
                    type: "text",
                    x: 100,
                    y: 200,
                    width: 200,
                    height: 60,
                    content: "New text",
                    fontSize: 20,
                    fontWeight: "500",
                    textAlign: "center",
                    color: textColor,
                  };
                  setElements((prev) => [...prev, newText]);
                  setSelectedId(newText.id);
                }}
                className="flex-1"
              >
                <Type className="w-4 h-4" />
                Add Text
              </Button>
            </div>
          </Card>

          {/* Background Image */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <RectangleHorizontal className="w-4 h-4 text-blue-400" />
              Background Image
            </h3>
            <input ref={bgImageInputRef} type="file" accept="image/*" onChange={handleBgImageUpload} className="hidden" />

            {bgImage ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                  <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
                  <button onClick={() => setBgImage(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500">
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Opacity: {bgOpacity}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            ) : (
              <Button variant="glass" onClick={() => bgImageInputRef.current?.click()} className="w-full">
                <Upload className="w-4 h-4" />
                Upload Background
              </Button>
            )}
          </Card>

          {/* Reset */}
          <Button
            variant="glass"
            onClick={() => {
              setElements([
                {
                  id: "hook-text",
                  type: "text",
                  x: 40,
                  y: 80,
                  width: 300,
                  height: 150,
                  content: "Your viral hook goes here.\n\nMake it impactful!",
                  fontSize: 24,
                  fontWeight: "600",
                  textAlign: "center",
                  color: textColor,
                },
                {
                  id: "author-text",
                  type: "text",
                  x: 140,
                  y: 280,
                  width: 120,
                  height: 30,
                  content: "@yourhandle",
                  fontSize: 14,
                  fontWeight: "500",
                  textAlign: "center",
                  color: accentColor,
                },
              ]);
              setBgImage(null);
              setSelectedId(null);
            }}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </Button>
        </div>

        {/* Right Side - Canvas Preview */}
        <div className="lg:sticky lg:top-0">
          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-center">Preview</h3>
            <p className="text-xs text-gray-500 text-center mb-3">{selectedSize.width} × {selectedSize.height}px</p>

            {/* Canvas */}
            <div className="flex justify-center overflow-hidden">
              <div
                ref={cardRef}
                className="relative overflow-hidden rounded-lg shadow-2xl select-none"
                style={{
                  width: previewWidth,
                  height: previewHeight,
                  background: bgColor,
                  cursor: isDragging ? "grabbing" : "default",
                }}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Background Image */}
                {bgImage && (
                  <>
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: bgOpacity / 100 }}>
                      <img src={bgImage} alt="" className="w-full h-full object-cover" draggable={false} />
                    </div>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))" }} />
                  </>
                )}

                {/* Elements */}
                {elements.map((element) => {
                  const isSelected = selectedId === element.id;
                  const scaledX = element.x * scale;
                  const scaledY = element.y * scale;
                  const scaledW = element.width * scale;
                  const scaledH = element.height * scale;

                  return (
                    <div
                      key={element.id}
                      className={`absolute ${isSelected ? "ring-2 ring-purple-500" : ""}`}
                      style={{
                        left: scaledX,
                        top: scaledY,
                        width: scaledW,
                        height: scaledH,
                        cursor: isDragging && isSelected ? "grabbing" : "grab",
                        zIndex: isSelected ? 50 : element.type === "image" ? 10 : 20,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                    >
                      {element.type === "text" ? (
                        <div
                          className="w-full h-full flex items-center justify-center overflow-hidden"
                          style={{
                            color: element.color,
                            fontSize: (element.fontSize || 24) * scale,
                            fontWeight: element.fontWeight || "600",
                            textAlign: element.textAlign || "center",
                            lineHeight: 1.3,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            userSelect: "none",
                          }}
                        >
                          {element.content}
                        </div>
                      ) : (
                        <img
                          src={element.content}
                          alt=""
                          className="w-full h-full object-cover"
                          style={{
                            borderRadius: `${element.borderRadius || 0}%`,
                            boxShadow: element.shadow ? "0 10px 30px rgba(0,0,0,0.4)" : "none",
                            userSelect: "none",
                            pointerEvents: "none",
                          }}
                          draggable={false}
                        />
                      )}

                      {/* Resize Handles */}
                      {isSelected && <ResizeHandles element={element} />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">
                <strong>Click</strong> to select • <strong>Drag</strong> to move • <strong>Corners</strong> to resize
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
