"use client";

import { useState, useRef, useEffect } from "react";
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
  GripVertical,
  Lock,
  Unlock,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { toPng } from "html-to-image";
import { userApi } from "@/lib/api";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

// Pre-designed card templates with actual designs
const CARD_TEMPLATES = [
  {
    id: "quote-elegant",
    name: "Elegant Quote",
    config: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      textColor: "#ffffff",
      accentColor: "#8b5cf6",
      fontSize: 24,
      fontWeight: "500",
      textAlign: "center" as const,
      showQuoteIcon: true,
      showAccentLine: true,
      borderStyle: "none",
    },
  },
  {
    id: "bold-statement",
    name: "Bold Statement",
    config: {
      background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontSize: 28,
      fontWeight: "800",
      textAlign: "center" as const,
      showQuoteIcon: false,
      showAccentLine: false,
      borderStyle: "none",
    },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    config: {
      background: "#ffffff",
      textColor: "#111827",
      accentColor: "#8b5cf6",
      fontSize: 22,
      fontWeight: "600",
      textAlign: "left" as const,
      showQuoteIcon: false,
      showAccentLine: true,
      borderStyle: "subtle",
    },
  },
  {
    id: "dark-neon",
    name: "Dark Neon",
    config: {
      background: "#000000",
      textColor: "#00ff88",
      accentColor: "#ff00ff",
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center" as const,
      showQuoteIcon: false,
      showAccentLine: false,
      borderStyle: "glow",
    },
  },
  {
    id: "ocean-wave",
    name: "Ocean Wave",
    config: {
      background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      showQuoteIcon: true,
      showAccentLine: false,
      borderStyle: "none",
    },
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    config: {
      background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
      textColor: "#ffffff",
      accentColor: "#fef3c7",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      showQuoteIcon: false,
      showAccentLine: true,
      borderStyle: "none",
    },
  },
  {
    id: "forest-calm",
    name: "Forest Calm",
    config: {
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontSize: 24,
      fontWeight: "500",
      textAlign: "center" as const,
      showQuoteIcon: true,
      showAccentLine: false,
      borderStyle: "none",
    },
  },
  {
    id: "professional",
    name: "Professional",
    config: {
      background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
      textColor: "#f3f4f6",
      accentColor: "#3b82f6",
      fontSize: 22,
      fontWeight: "500",
      textAlign: "left" as const,
      showQuoteIcon: false,
      showAccentLine: true,
      borderStyle: "subtle",
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

interface CardConfig {
  background: string;
  textColor: string;
  accentColor: string;
  fontSize: number;
  fontWeight: string;
  textAlign: "left" | "center" | "right";
  showQuoteIcon: boolean;
  showAccentLine: boolean;
  borderStyle: "none" | "subtle" | "glow";
}

interface DraggableElement {
  x: number;
  y: number;
  locked: boolean;
}

interface ContentImageConfig {
  url: string | null;
  size: number;
  borderRadius: number;
  shadow: boolean;
  position: DraggableElement;
}

interface TextConfig {
  position: DraggableElement;
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
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Card content state
  const [hookText, setHookText] = useState("Your viral hook goes here.\n\nMake it impactful!");
  const [authorName, setAuthorName] = useState("@yourhandle");
  const [showAuthor, setShowAuthor] = useState(true);

  // Card design state
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0]);
  const [selectedSize, setSelectedSize] = useState(CARD_SIZES[0]);
  const [config, setConfig] = useState<CardConfig>(CARD_TEMPLATES[0].config);

  // Background image state
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState(30);

  // Content image state with position
  const [contentImage, setContentImage] = useState<ContentImageConfig>({
    url: null,
    size: 100,
    borderRadius: 12,
    shadow: true,
    position: { x: 140, y: 30, locked: false },
  });

  // Text position state
  const [textPosition, setTextPosition] = useState<TextConfig>({
    position: { x: 20, y: 150, locked: false },
  });

  // Recent hooks state
  const [recentHooks, setRecentHooks] = useState<RecentHook[]>([]);
  const [loadingHooks, setLoadingHooks] = useState(false);
  const [showRecentHooks, setShowRecentHooks] = useState(true);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Edit mode
  const [editMode, setEditMode] = useState(true);

  // Fetch recent hooks on mount
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
    setHookText(text);
    setCopiedHookId(id);
    setTimeout(() => setCopiedHookId(null), 2000);
  };

  const handleTemplateSelect = (template: typeof CARD_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setConfig(template.config);
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
        setContentImage((prev) => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (!textPosition.position.locked) {
      setTextPosition((prev) => ({
        ...prev,
        position: { ...prev.position, x: data.x, y: data.y },
      }));
    }
  };

  const handleImageDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (!contentImage.position.locked) {
      setContentImage((prev) => ({
        ...prev,
        position: { ...prev.position, x: data.x, y: data.y },
      }));
    }
  };

  const handleExport = async () => {
    if (!cardRef.current) return;

    setEditMode(false);
    setIsExporting(true);

    // Wait for re-render without edit handles
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const scale = selectedSize.width / cardRef.current.offsetWidth;

      const dataUrl = await toPng(cardRef.current, {
        width: selectedSize.width,
        height: selectedSize.height,
        style: {
          transform: `scale(${scale})`,
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
    setEditMode(true);
  };

  const updateConfig = (key: keyof CardConfig, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateContentImage = (key: keyof Omit<ContentImageConfig, "position">, value: string | number | boolean | null) => {
    setContentImage((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate preview dimensions
  const previewMaxWidth = 380;
  const aspectRatio = selectedSize.height / selectedSize.width;
  const previewWidth = previewMaxWidth;
  const previewHeight = Math.min(previewMaxWidth * aspectRatio, 500);

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Card Designer</h1>
          <p className="text-gray-400 text-sm">Drag elements to position them freely</p>
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

          {/* Recent Hooks Section */}
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
                    {template.config.showQuoteIcon && (
                      <Quote className="w-3 h-3 mb-1" style={{ color: template.config.accentColor }} />
                    )}
                    {template.config.showAccentLine && (
                      <div className="w-4 h-0.5 rounded mb-1" style={{ background: template.config.accentColor }} />
                    )}
                    <div className="w-full space-y-0.5">
                      <div className="h-1 rounded" style={{ background: template.config.textColor, opacity: 0.8 }} />
                      <div className="h-1 rounded w-3/4 mx-auto" style={{ background: template.config.textColor, opacity: 0.5 }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{selectedTemplate.name}</p>
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

          {/* Text Content */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Type className="w-4 h-4 text-green-400" />
                Text Content
              </h3>
              <button
                onClick={() => setTextPosition((prev) => ({
                  ...prev,
                  position: { ...prev.position, locked: !prev.position.locked },
                }))}
                className={`p-1.5 rounded ${textPosition.position.locked ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-400"}`}
                title={textPosition.position.locked ? "Unlock position" : "Lock position"}
              >
                {textPosition.position.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-3">
              <Textarea
                label="Hook Text"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                placeholder="Enter your hook text..."
                className="min-h-[100px]"
              />
              <div className="flex items-center gap-3">
                <Input
                  label="Author/Handle"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="@yourhandle"
                  className="flex-1"
                />
                <div className="pt-6">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAuthor}
                      onChange={(e) => setShowAuthor(e.target.checked)}
                      className="rounded border-gray-600"
                    />
                    Show
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Text Styling */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Text Styling</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Font Size: {config.fontSize}px</label>
                <div className="flex items-center gap-2">
                  <Button variant="glass" size="sm" onClick={() => updateConfig("fontSize", Math.max(14, config.fontSize - 2))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="range"
                    min="14"
                    max="48"
                    value={config.fontSize}
                    onChange={(e) => updateConfig("fontSize", Number(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
                  <Button variant="glass" size="sm" onClick={() => updateConfig("fontSize", Math.min(48, config.fontSize + 2))}>
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
                      variant={config.textAlign === value ? "primary" : "glass"}
                      size="sm"
                      onClick={() => updateConfig("textAlign", value)}
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
                      onClick={() => updateConfig("fontWeight", weight)}
                      className={`px-3 py-1.5 rounded text-xs transition-all ${
                        config.fontWeight === weight ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                      style={{ fontWeight: weight }}
                    >
                      {weight === "400" ? "Regular" : weight === "700" ? "Bold" : weight}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <input type="checkbox" checked={config.showQuoteIcon} onChange={(e) => updateConfig("showQuoteIcon", e.target.checked)} className="rounded border-gray-600" />
                  <Quote className="w-3 h-3" />
                  <span className="text-xs">Quote</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                  <input type="checkbox" checked={config.showAccentLine} onChange={(e) => updateConfig("showAccentLine", e.target.checked)} className="rounded border-gray-600" />
                  <span className="text-xs">Accent Line</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Colors */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => updateConfig("textColor", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <Input value={config.textColor} onChange={(e) => updateConfig("textColor", e.target.value)} className="flex-1 text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => updateConfig("accentColor", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <Input value={config.accentColor} onChange={(e) => updateConfig("accentColor", e.target.value)} className="flex-1 text-xs" />
                </div>
              </div>
            </div>
          </Card>

          {/* Content Image */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                Content Image
              </h3>
              {contentImage.url && (
                <button
                  onClick={() => setContentImage((prev) => ({
                    ...prev,
                    position: { ...prev.position, locked: !prev.position.locked },
                  }))}
                  className={`p-1.5 rounded ${contentImage.position.locked ? "bg-red-500/20 text-red-400" : "bg-white/5 text-gray-400"}`}
                  title={contentImage.position.locked ? "Unlock position" : "Lock position"}
                >
                  {contentImage.position.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              )}
            </div>
            <input ref={contentImageInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />

            {contentImage.url ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                  <img src={contentImage.url} alt="Content" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setContentImage((prev) => ({ ...prev, url: null }))}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Size: {contentImage.size}px</label>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={contentImage.size}
                    onChange={(e) => updateContentImage("size", Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">Border Radius: {contentImage.borderRadius}%</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateContentImage("borderRadius", 0)} className={`p-2 rounded ${contentImage.borderRadius === 0 ? "bg-purple-500" : "bg-white/5"}`}>
                      <Square className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={contentImage.borderRadius}
                      onChange={(e) => updateContentImage("borderRadius", Number(e.target.value))}
                      className="flex-1 accent-purple-500"
                    />
                    <button onClick={() => updateContentImage("borderRadius", 50)} className={`p-2 rounded ${contentImage.borderRadius === 50 ? "bg-purple-500" : "bg-white/5"}`}>
                      <Circle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={contentImage.shadow} onChange={(e) => updateContentImage("shadow", e.target.checked)} className="rounded border-gray-600" />
                  <span className="text-sm text-gray-400">Drop Shadow</span>
                </label>
              </div>
            ) : (
              <Button variant="glass" onClick={() => contentImageInputRef.current?.click()} className="w-full">
                <Upload className="w-4 h-4" />
                Upload Content Image
              </Button>
            )}
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
              setConfig(selectedTemplate.config);
              setBgImage(null);
              setContentImage({ url: null, size: 100, borderRadius: 12, shadow: true, position: { x: 140, y: 30, locked: false } });
              setTextPosition({ position: { x: 20, y: 150, locked: false } });
            }}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>

        {/* Right Side - Preview */}
        <div className="lg:sticky lg:top-0">
          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-center">Preview</h3>
            <p className="text-xs text-gray-500 text-center mb-3">{selectedSize.width} × {selectedSize.height}px • Drag to reposition</p>

            {/* Card Preview */}
            <div className="flex justify-center overflow-hidden">
              <div
                ref={cardRef}
                className="relative overflow-hidden rounded-lg shadow-2xl"
                style={{
                  width: previewWidth,
                  height: previewHeight,
                  background: config.background,
                  border: config.borderStyle === "subtle" ? "1px solid rgba(255,255,255,0.1)" : config.borderStyle === "glow" ? `2px solid ${config.accentColor}` : "none",
                  boxShadow: config.borderStyle === "glow" ? `0 0 20px ${config.accentColor}40` : undefined,
                }}
              >
                {/* Background Image */}
                {bgImage && (
                  <>
                    <div className="absolute inset-0" style={{ opacity: bgOpacity / 100 }}>
                      <img src={bgImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))" }} />
                  </>
                )}

                {/* Draggable Content Image */}
                {contentImage.url && (
                  <Draggable
                    position={{ x: contentImage.position.x, y: contentImage.position.y }}
                    onDrag={handleImageDrag}
                    disabled={contentImage.position.locked}
                    bounds="parent"
                    nodeRef={imageRef}
                  >
                    <div
                      ref={imageRef}
                      className={`absolute cursor-move ${editMode && !contentImage.position.locked ? "ring-2 ring-pink-500 ring-offset-2 ring-offset-transparent" : ""}`}
                      style={{ zIndex: 10 }}
                    >
                      {editMode && !contentImage.position.locked && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <GripVertical className="w-3 h-3" /> Image
                        </div>
                      )}
                      <img
                        src={contentImage.url}
                        alt=""
                        style={{
                          width: contentImage.size,
                          height: contentImage.size,
                          objectFit: "cover",
                          borderRadius: `${contentImage.borderRadius}%`,
                          boxShadow: contentImage.shadow ? "0 10px 30px rgba(0,0,0,0.4)" : "none",
                        }}
                      />
                    </div>
                  </Draggable>
                )}

                {/* Draggable Text */}
                <Draggable
                  position={{ x: textPosition.position.x, y: textPosition.position.y }}
                  onDrag={handleTextDrag}
                  disabled={textPosition.position.locked}
                  bounds="parent"
                  nodeRef={textRef}
                >
                  <div
                    ref={textRef}
                    className={`absolute cursor-move ${editMode && !textPosition.position.locked ? "ring-2 ring-green-500 ring-offset-2 ring-offset-transparent" : ""}`}
                    style={{ zIndex: 20, maxWidth: previewWidth - 40 }}
                  >
                    {editMode && !textPosition.position.locked && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <GripVertical className="w-3 h-3" /> Text
                      </div>
                    )}

                    {config.showQuoteIcon && (
                      <Quote className="w-6 h-6 mb-2" style={{ color: config.accentColor }} />
                    )}

                    {config.showAccentLine && (
                      <div className="w-10 h-1 rounded-full mb-3" style={{ background: config.accentColor }} />
                    )}

                    <p
                      className="whitespace-pre-wrap leading-tight"
                      style={{
                        color: config.textColor,
                        fontSize: `${config.fontSize * 0.6}px`,
                        fontWeight: config.fontWeight,
                        textAlign: config.textAlign,
                      }}
                    >
                      {hookText}
                    </p>

                    {showAuthor && authorName && (
                      <p className="mt-3 text-sm opacity-80" style={{ color: config.accentColor, textAlign: config.textAlign }}>
                        {authorName}
                      </p>
                    )}
                  </div>
                </Draggable>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">
                💡 <strong>Drag</strong> the text and image to position them anywhere. Use <Lock className="w-3 h-3 inline" /> to lock position.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
