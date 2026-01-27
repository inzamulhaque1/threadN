"use client";

import { useState, useRef } from "react";
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
  Bold,
  Check,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { toPng } from "html-to-image";

// Pre-designed card templates
const CARD_TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    preview: "bg-gradient-to-br from-gray-900 to-gray-800",
    config: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      textColor: "#ffffff",
      accentColor: "#8b5cf6",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "vibrant",
    name: "Vibrant",
    preview: "bg-gradient-to-br from-purple-600 to-pink-500",
    config: {
      background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontSize: 26,
      fontWeight: "700",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    preview: "bg-gradient-to-br from-cyan-500 to-blue-600",
    config: {
      background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    preview: "bg-gradient-to-br from-orange-500 to-red-600",
    config: {
      background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
      textColor: "#ffffff",
      accentColor: "#fef3c7",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "forest",
    name: "Forest",
    preview: "bg-gradient-to-br from-green-600 to-emerald-700",
    config: {
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "dark",
    name: "Dark Pro",
    preview: "bg-gradient-to-br from-zinc-900 to-neutral-900",
    config: {
      background: "linear-gradient(135deg, #18181b 0%, #0a0a0a 100%)",
      textColor: "#ffffff",
      accentColor: "#22d3ee",
      fontSize: 24,
      fontWeight: "500",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "light",
    name: "Light Clean",
    preview: "bg-gradient-to-br from-gray-100 to-white",
    config: {
      background: "linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)",
      textColor: "#111827",
      accentColor: "#8b5cf6",
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center" as const,
      padding: 40,
    },
  },
  {
    id: "neon",
    name: "Neon",
    preview: "bg-black",
    config: {
      background: "#000000",
      textColor: "#00ff88",
      accentColor: "#ff00ff",
      fontSize: 26,
      fontWeight: "700",
      textAlign: "center" as const,
      padding: 40,
    },
  },
];

const CARD_SIZES = [
  { id: "square", name: "Square (1:1)", width: 1080, height: 1080 },
  { id: "portrait", name: "Portrait (4:5)", width: 1080, height: 1350 },
  { id: "story", name: "Story (9:16)", width: 1080, height: 1920 },
  { id: "landscape", name: "Landscape (16:9)", width: 1920, height: 1080 },
  { id: "twitter", name: "Twitter (16:9)", width: 1200, height: 675 },
];

interface CardConfig {
  background: string;
  textColor: string;
  accentColor: string;
  fontSize: number;
  fontWeight: string;
  textAlign: "left" | "center" | "right";
  padding: number;
}

export default function TemplatesPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Card content state
  const [hookText, setHookText] = useState("Your viral hook goes here.\n\nMake it impactful!");
  const [authorName, setAuthorName] = useState("@yourhandle");
  const [showAuthor, setShowAuthor] = useState(true);

  // Card design state
  const [selectedTemplate, setSelectedTemplate] = useState(CARD_TEMPLATES[0]);
  const [selectedSize, setSelectedSize] = useState(CARD_SIZES[0]);
  const [config, setConfig] = useState<CardConfig>(CARD_TEMPLATES[0].config);

  // Image state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(30);
  const [imagePosition, setImagePosition] = useState<"cover" | "contain" | "top" | "bottom">("cover");

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleTemplateSelect = (template: typeof CARD_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setConfig(template.config);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      // Create a clone for export with actual pixel dimensions
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

      // Download
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
  };

  const updateConfig = (key: keyof CardConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Calculate preview dimensions maintaining aspect ratio
  const previewMaxWidth = 400;
  const aspectRatio = selectedSize.height / selectedSize.width;
  const previewWidth = previewMaxWidth;
  const previewHeight = previewMaxWidth * aspectRatio;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Card Designer</h1>
          <p className="text-gray-400 text-sm">Create stunning social media cards from your hooks</p>
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

      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        {/* Left Side - Controls */}
        <div className="space-y-4 lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          {/* Template Selection */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Choose Template
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {CARD_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`aspect-square rounded-lg ${template.preview} transition-all ${
                    selectedTemplate.id === template.id
                      ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900"
                      : "hover:opacity-80"
                  }`}
                  title={template.name}
                />
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
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-green-400" />
              Text Content
            </h3>
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
              {/* Font Size */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Font Size: {config.fontSize}px</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => updateConfig("fontSize", Math.max(16, config.fontSize - 2))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={config.fontSize}
                    onChange={(e) => updateConfig("fontSize", Number(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => updateConfig("fontSize", Math.min(48, config.fontSize + 2))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Text Alignment</label>
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

              {/* Font Weight */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Font Weight</label>
                <div className="flex items-center gap-2">
                  {["400", "500", "600", "700", "800"].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => updateConfig("fontWeight", weight)}
                      className={`px-3 py-1.5 rounded text-xs transition-all ${
                        config.fontWeight === weight
                          ? "bg-purple-500 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                      style={{ fontWeight: weight }}
                    >
                      {weight === "400" ? "Regular" : weight === "700" ? "Bold" : weight}
                    </button>
                  ))}
                </div>
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
                  <Input
                    value={config.textColor}
                    onChange={(e) => updateConfig("textColor", e.target.value)}
                    className="flex-1 text-xs"
                  />
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
                  <Input
                    value={config.accentColor}
                    onChange={(e) => updateConfig("accentColor", e.target.value)}
                    className="flex-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Background Image */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-400" />
              Background Image
            </h3>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      Image Opacity: {imageOpacity}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={imageOpacity}
                      onChange={(e) => setImageOpacity(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Image Position</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "cover", label: "Cover" },
                        { value: "contain", label: "Contain" },
                        { value: "top", label: "Top" },
                        { value: "bottom", label: "Bottom" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setImagePosition(value as typeof imagePosition)}
                          className={`px-3 py-1.5 rounded text-xs transition-all ${
                            imagePosition === value
                              ? "bg-purple-500 text-white"
                              : "bg-white/5 text-gray-400 hover:bg-white/10"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="glass"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
              )}
            </div>
          </Card>

          {/* Reset */}
          <Button
            variant="glass"
            onClick={() => {
              setConfig(selectedTemplate.config);
              setUploadedImage(null);
              setImageOpacity(30);
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
            <h3 className="font-semibold mb-3 text-center">Preview</h3>
            <p className="text-xs text-gray-500 text-center mb-3">
              {selectedSize.width} × {selectedSize.height}px
            </p>

            {/* Card Preview */}
            <div className="flex justify-center">
              <div
                ref={cardRef}
                className="relative overflow-hidden rounded-lg shadow-2xl"
                style={{
                  width: previewWidth,
                  height: previewHeight,
                  background: config.background,
                }}
              >
                {/* Background Image */}
                {uploadedImage && (
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: imageOpacity / 100,
                    }}
                  >
                    <img
                      src={uploadedImage}
                      alt=""
                      className="w-full h-full"
                      style={{
                        objectFit: imagePosition === "contain" ? "contain" : "cover",
                        objectPosition: imagePosition === "top" ? "top" : imagePosition === "bottom" ? "bottom" : "center",
                      }}
                    />
                  </div>
                )}

                {/* Overlay gradient for readability */}
                {uploadedImage && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))`,
                    }}
                  />
                )}

                {/* Content */}
                <div
                  className="relative h-full flex flex-col justify-center"
                  style={{ padding: config.padding }}
                >
                  {/* Decorative accent line */}
                  <div
                    className="w-12 h-1 rounded-full mb-4"
                    style={{
                      background: config.accentColor,
                      marginLeft: config.textAlign === "center" ? "auto" : config.textAlign === "right" ? "auto" : 0,
                      marginRight: config.textAlign === "center" ? "auto" : config.textAlign === "left" ? "auto" : 0,
                    }}
                  />

                  {/* Hook Text */}
                  <p
                    className="whitespace-pre-wrap leading-tight"
                    style={{
                      color: config.textColor,
                      fontSize: `${config.fontSize}px`,
                      fontWeight: config.fontWeight,
                      textAlign: config.textAlign,
                    }}
                  >
                    {hookText}
                  </p>

                  {/* Author */}
                  {showAuthor && authorName && (
                    <p
                      className="mt-6 text-sm opacity-80"
                      style={{
                        color: config.accentColor,
                        textAlign: config.textAlign,
                      }}
                    >
                      {authorName}
                    </p>
                  )}
                </div>

                {/* Corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-20 h-20"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${config.accentColor}20 50%)`,
                  }}
                />
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">
                💡 <strong>Tip:</strong> Copy a hook from the Generate page and paste it here to create a shareable image.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
