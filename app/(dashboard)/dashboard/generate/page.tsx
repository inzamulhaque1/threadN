"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Layout,
  Quote,
  FileText,
  Type,
  Bot,
  Link,
  Heart,
  GitBranch,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Save,
} from "lucide-react";
import { Button, Textarea, Input, Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { generateApi, favoritesApi, templatesApi } from "@/lib/api";
import { PLAN_LIMITS, type IHook, type IThread, type Platform } from "@/types";

export default function GeneratePage() {
  const { user, refreshUser } = useAuth();
  const [inputMode, setInputMode] = useState<"text" | "ai" | "url">("text");
  const [transcript, setTranscript] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("informative");
  const [aiTone, setAiTone] = useState("professional");
  const [aiAudience, setAiAudience] = useState("general");
  const [urlInput, setUrlInput] = useState("");
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [cta, setCta] = useState("Follow for more tips like this!");
  const [hooks, setHooks] = useState<IHook[]>([]);
  const [thread, setThread] = useState<IThread | null>(null);
  const [activeHook, setActiveHook] = useState<IHook | null>(null);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatingThreadFor, setGeneratingThreadFor] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // A/B Variations state
  const [abVariations, setAbVariations] = useState<Array<{ text: string; angle: string; format: string }>>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [selectedHookForVariations, setSelectedHookForVariations] = useState<IHook | null>(null);

  // Platform formatting state
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["facebook"]);
  const [showPlatformPreview, setShowPlatformPreview] = useState(false);

  // Favorites state
  const [lastGenerationId, setLastGenerationId] = useState<string | null>(null);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Template state
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const limits = PLAN_LIMITS[user?.plan || "free"];
  const dailyRemaining = limits.dailyThreads - (user?.usage?.dailyThreads || 0);
  const canGenerate = dailyRemaining > 0 || (user?.coins || 0) > 0;

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-400";
    if (score >= 3.5) return "text-yellow-400";
    if (score >= 2.5) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 4.5) return "bg-green-500/20 border-green-500/30";
    if (score >= 3.5) return "bg-yellow-500/20 border-yellow-500/30";
    if (score >= 2.5) return "bg-orange-500/20 border-orange-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  const handleGenerateHooks = async () => {
    if (transcript.length < 20) {
      setError("Please enter at least 20 characters of content");
      return;
    }

    setError(null);
    setIsGeneratingHooks(true);
    setHooks([]);
    setThread(null);
    setActiveHook(null);

    try {
      const result = await generateApi.hooks(transcript);

      if (result.success && result.data) {
        const data = result.data as { hooks: IHook[] };
        setHooks(data.hooks);
      } else {
        setError(result.error || "Failed to generate hooks");
      }
    } catch (err) {
      setError("Failed to generate hooks. Please try again.");
    }

    setIsGeneratingHooks(false);
  };

  const handleAiGenerate = async () => {
    if (aiTopic.length < 5) {
      setError("Please enter a topic (at least 5 characters)");
      return;
    }

    setError(null);
    setIsGeneratingContent(true);
    setHooks([]);
    setThread(null);
    setActiveHook(null);

    try {
      // First generate content from topic
      const contentResult = await generateApi.contentFromTopic(aiTopic, aiStyle, aiTone, aiAudience);

      if (contentResult.success && contentResult.data) {
        const data = contentResult.data as { content: string };
        setTranscript(data.content);

        // Then generate hooks from the content
        setIsGeneratingContent(false);
        setIsGeneratingHooks(true);

        const hooksResult = await generateApi.hooks(data.content);

        if (hooksResult.success && hooksResult.data) {
          const hooksData = hooksResult.data as { hooks: IHook[] };
          setHooks(hooksData.hooks);
        } else {
          setError(hooksResult.error || "Failed to generate hooks");
        }
      } else {
        setError(contentResult.error || "Failed to generate content");
      }
    } catch (err) {
      setError("Failed to generate. Please try again.");
    }

    setIsGeneratingContent(false);
    setIsGeneratingHooks(false);
  };

  const handleUrlExtract = async () => {
    if (!urlInput.trim()) {
      setError("Please enter a URL");
      return;
    }

    setError(null);
    setIsExtractingUrl(true);
    setHooks([]);
    setThread(null);
    setActiveHook(null);

    try {
      const result = await generateApi.extractFromUrl(urlInput);

      if (result.success && result.data) {
        const data = result.data as { content: string };
        setTranscript(data.content);

        // Then generate hooks
        setIsExtractingUrl(false);
        setIsGeneratingHooks(true);

        const hooksResult = await generateApi.hooks(data.content);

        if (hooksResult.success && hooksResult.data) {
          const hooksData = hooksResult.data as { hooks: IHook[] };
          setHooks(hooksData.hooks);
        } else {
          setError(hooksResult.error || "Failed to generate hooks");
        }
      } else {
        setError(result.error || "Failed to extract content from URL");
      }
    } catch (err) {
      setError("Failed to extract content. Please try again.");
    }

    setIsExtractingUrl(false);
    setIsGeneratingHooks(false);
  };

  const handleMakeThread = async (hook: IHook, index: number) => {
    if (!canGenerate) {
      setError("Daily limit reached. Upgrade your plan to continue.");
      return;
    }

    setGeneratingThreadFor(index);
    setError(null);
    setLastGenerationId(null);
    setIsFavorited(false);

    try {
      const result = await generateApi.thread(transcript, hook.text, cta);

      if (result.success && result.data) {
        const data = result.data as { thread: IThread; generationId?: string };
        setThread(data.thread);
        setActiveHook(hook);
        if (data.generationId) {
          setLastGenerationId(data.generationId);
        }
        await refreshUser();
      } else {
        if (result.error?.includes("LIMIT_REACHED")) {
          setError("Daily limit reached. Upgrade your plan to continue.");
        } else {
          setError(result.error || "Failed to generate thread");
        }
      }
    } catch (err) {
      setError("Failed to generate thread. Please try again.");
    }

    setGeneratingThreadFor(null);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateVariations = async (hook: IHook) => {
    setIsGeneratingVariations(true);
    setSelectedHookForVariations(hook);
    setAbVariations([]);
    setError(null);

    try {
      const response = await fetch("/api/generate/variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          originalHook: hook.text,
          count: 3,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setAbVariations(result.data.variations || []);
      } else {
        setError(result.error || "Failed to generate variations");
      }
    } catch (err) {
      setError("Failed to generate variations. Please try again.");
    }

    setIsGeneratingVariations(false);
  };

  const handleAddToFavorites = async () => {
    if (!lastGenerationId) {
      setError("No generation to save");
      return;
    }

    if (isFavorited) {
      setError("Already in favorites!");
      return;
    }

    setIsSavingFavorite(true);
    setError(null);

    const result = await favoritesApi.add({
      generationId: lastGenerationId,
      notes: "",
      tags: [],
    });

    if (result.success) {
      setIsFavorited(true);
      setSuccessMessage("Added to favorites!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      if (result.error?.includes("Already in favorites")) {
        setIsFavorited(true);
      }
      setError(result.error || "Failed to add to favorites");
    }

    setIsSavingFavorite(false);
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim() || !thread) {
      setError("Please enter a template name");
      return;
    }

    setIsSavingTemplate(true);
    setError(null);

    const result = await templatesApi.create({
      name: templateName,
      description: `Generated from: ${activeHook?.text?.slice(0, 50)}...`,
      category: "full",
      content: {
        hookTemplate: activeHook?.text || "",
        threadTemplate: thread.body,
        variables: [],
      },
      isPublic: false,
    });

    if (result.success) {
      setShowSaveTemplateModal(false);
      setTemplateName("");
      setSuccessMessage("Template saved!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(result.error || "Failed to save template");
    }

    setIsSavingTemplate(false);
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const platformIcons: Record<Platform, React.ElementType> = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
  };

  const platformColors: Record<Platform, string> = {
    facebook: "text-blue-400",
    twitter: "text-sky-400",
    linkedin: "text-blue-500",
    instagram: "text-pink-400",
  };

  return (
    <div className="h-full font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Generate Content</h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mt-1">Transform ideas into viral threads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 text-sm font-accent">Daily: </span>
            <span className={`font-mono font-bold text-base ${dailyRemaining > 0 ? "text-green-400" : "text-red-400"}`}>
              {user?.usage?.dailyThreads || 0}/{limits.dailyThreads}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - Content Input + Hooks */}
        <div className="space-y-4 lg:h-[calc(100vh-180px)] lg:overflow-y-auto lg:pr-2">
          {/* Content Input */}
          <Card className="p-4">
            {/* Toggle */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg mb-4">
              <button
                onClick={() => setInputMode("text")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                  inputMode === "text"
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                Text
              </button>
              <button
                onClick={() => setInputMode("url")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                  inputMode === "url"
                    ? "bg-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                YouTube
              </button>
              <button
                onClick={() => setInputMode("ai")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all ${
                  inputMode === "ai"
                    ? "bg-cyan-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                AI
              </button>
            </div>

            {inputMode === "text" ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Paste your content</span>
                  <span className="text-xs text-gray-500">{transcript.length} chars</span>
                </div>
                <Textarea
                  placeholder="Paste your transcript, notes, or content ideas here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[120px] text-sm mb-3"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    <span className="text-green-400">Hooks = FREE</span>
                  </span>
                  <Button
                    onClick={handleGenerateHooks}
                    isLoading={isGeneratingHooks}
                    disabled={transcript.length < 20}
                    size="sm"
                  >
                    <Zap className="w-4 h-4" />
                    Generate Hooks
                  </Button>
                </div>
              </>
            ) : inputMode === "url" ? (
              <>
                <div className="mb-2">
                  <span className="text-xs text-gray-500">Paste YouTube video URL</span>
                </div>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="mb-3"
                />
                <p className="text-[11px] text-gray-600 mb-3">
                  Extracts transcript from YouTube video and generates viral hooks
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    <span className="text-red-400">YouTube Transcript</span>
                  </span>
                  <Button
                    onClick={handleUrlExtract}
                    isLoading={isExtractingUrl || isGeneratingHooks}
                    disabled={!urlInput.trim()}
                    size="sm"
                  >
                    <Zap className="w-4 h-4" />
                    Extract & Generate
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <Input
                    label="Topic / Idea"
                    placeholder="e.g., 5 tips for productivity, How to start a business..."
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Content Style
                      </label>
                      <select
                        value={aiStyle}
                        onChange={(e) => setAiStyle(e.target.value)}
                        className="input-dark text-sm"
                      >
                        <option value="informative">Informative</option>
                        <option value="motivational">Motivational</option>
                        <option value="storytelling">Storytelling</option>
                        <option value="controversial">Controversial</option>
                        <option value="humorous">Humorous</option>
                        <option value="educational">Educational</option>
                        <option value="inspirational">Inspirational</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Tone
                      </label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                        className="input-dark text-sm"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="friendly">Friendly</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="conversational">Conversational</option>
                        <option value="bold">Bold & Direct</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Target Audience
                    </label>
                    <select
                      value={aiAudience}
                      onChange={(e) => setAiAudience(e.target.value)}
                      className="input-dark text-sm"
                    >
                      <option value="general">General Audience</option>
                      <option value="entrepreneurs">Entrepreneurs</option>
                      <option value="professionals">Working Professionals</option>
                      <option value="students">Students</option>
                      <option value="creators">Content Creators</option>
                      <option value="marketers">Marketers</option>
                      <option value="developers">Developers/Tech</option>
                      <option value="beginners">Beginners</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="text-xs text-gray-500">
                    <span className="text-cyan-400">AI powered</span>
                  </span>
                  <Button
                    onClick={handleAiGenerate}
                    isLoading={isGeneratingContent || isGeneratingHooks}
                    disabled={aiTopic.length < 5}
                    size="sm"
                  >
                    <Bot className="w-4 h-4" />
                    Generate Content
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* CTA Input */}
          <Card className="p-4">
            <Input
              label="Call to Action (CTA)"
              placeholder="Follow for more tips like this!"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
            />
          </Card>

          {/* Hooks List */}
          {isExtractingUrl ? (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
                  <Link className="w-6 h-6 text-red-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-400 mt-4 font-medium">Extracting from YouTube...</p>
                <p className="text-gray-500 text-sm">Getting video transcript</p>
              </div>
            </Card>
          ) : isGeneratingContent ? (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"></div>
                  <Bot className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-400 mt-4 font-medium">AI generating content...</p>
                <p className="text-gray-500 text-sm">Creating from your topic</p>
              </div>
            </Card>
          ) : isGeneratingHooks ? (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                  <Wand2 className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-400 mt-4 font-medium">Analyzing content...</p>
                <p className="text-gray-500 text-sm">Generating viral hooks</p>
              </div>
            </Card>
          ) : hooks.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">Hooks</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                  {hooks.length}
                </span>
              </div>

              <div className="space-y-3">
                {hooks.map((hook, index) => (
                  <Card
                    key={index}
                    className={`p-3 transition-all cursor-pointer ${
                      activeHook === hook
                        ? "border-green-500/50 bg-green-500/5"
                        : "hover:border-purple-500/30"
                    }`}
                  >
                    {/* Hook Text + Score */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-white leading-relaxed flex-1">
                        {hook.text}
                      </p>
                      <div className={`px-2 py-0.5 rounded border text-xs font-bold shrink-0 ${getScoreBg(hook.score)}`}>
                        <span className={getScoreColor(hook.score)}>
                          {(hook.score || 0).toFixed(1)}/5
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    {hook.reason && (
                      <p className="text-xs text-gray-500 italic mb-2 pl-2 border-l-2 border-purple-500/30">
                        {hook.reason}
                      </p>
                    )}

                    {/* Evidence */}
                    {hook.evidence && hook.evidence.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Evidence:</p>
                        {hook.evidence.slice(0, 2).map((ev, j) => (
                          <p key={j} className="text-[11px] text-gray-500 pl-2 border-l border-cyan-500/30 mb-1 truncate">
                            "{ev}"
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(hook.text, `hook-${index}`)}
                          className="text-[11px] text-gray-500 hover:text-white flex items-center gap-1"
                        >
                          {copiedId === `hook-${index}` ? (
                            <><Check className="w-3 h-3" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                          )}
                        </button>
                        <button
                          onClick={() => handleGenerateVariations(hook)}
                          disabled={isGeneratingVariations}
                          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <GitBranch className="w-3 h-3" />
                          A/B Variations
                        </button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleMakeThread(hook, index)}
                        isLoading={generatingThreadFor === index}
                        disabled={generatingThreadFor !== null}
                      >
                        <Layout className="w-3 h-3" />
                        Make Thread
                      </Button>
                    </div>

                    {/* A/B Variations Display */}
                    {selectedHookForVariations === hook && (isGeneratingVariations || abVariations.length > 0) && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-purple-400 mb-2 flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          A/B Variations
                        </p>
                        {isGeneratingVariations ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-purple-500 mx-auto" />
                            <p className="text-xs text-gray-500 mt-2">Generating variations...</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {abVariations.map((variation, vIndex) => (
                              <div key={vIndex} className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <p className="text-sm text-white">{variation.text}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                                    {variation.angle}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">
                                    {variation.format}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(variation.text, `var-${vIndex}`)}
                                    className="ml-auto text-[10px] text-gray-500 hover:text-white"
                                  >
                                    {copiedId === `var-${vIndex}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <FileText className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Enter content above and click "Generate Hooks"
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT SIDE - Generated Thread Result */}
        <div className="lg:h-[calc(100vh-180px)] lg:overflow-y-auto">
          {generatingThreadFor !== null ? (
            <Card className="p-8 h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"></div>
                  <Sparkles className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-400 mt-4 font-medium">Creating thread...</p>
                <p className="text-gray-500 text-sm">This may take a moment</p>
              </div>
            </Card>
          ) : thread ? (
            <Card className="p-4 border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-bold uppercase">
                    Generated
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2">{thread.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={handleAddToFavorites}
                    isLoading={isSavingFavorite}
                    disabled={!lastGenerationId || isFavorited}
                    className={isFavorited ? "border-red-500/50 bg-red-500/10" : ""}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setShowSaveTemplateModal(true)}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => handleCopy(thread.body, "thread")}
                  >
                    {copiedId === "thread" ? (
                      <><Check className="w-4 h-4 text-green-400" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Platform Selector */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Format for platforms:</p>
                <div className="flex items-center gap-2">
                  {(["facebook", "twitter", "linkedin", "instagram"] as Platform[]).map((platform) => {
                    const Icon = platformIcons[platform];
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                          isSelected
                            ? "bg-purple-500/20 border border-purple-500/50"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? platformColors[platform] : "text-gray-500"}`} />
                        <span className="capitalize">{platform}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 whitespace-pre-wrap text-sm leading-relaxed text-gray-200 max-h-[60vh] overflow-y-auto">
                {thread.body}
              </div>

              {activeHook && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-start gap-2">
                    <Quote className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase">From hook:</p>
                      <p className="text-xs text-gray-400 italic">{activeHook.text}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8 h-full min-h-[400px] flex items-center justify-center border-dashed border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10 mx-auto mb-4 flex items-center justify-center">
                  <Layout className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">Thread Result</p>
                <p className="text-gray-600 text-sm mt-1">
                  Select a hook and click "Make Thread"
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Save as Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Save as Template</h2>
              <button onClick={() => setShowSaveTemplateModal(false)}>
                <span className="text-gray-400 hover:text-white">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Template Name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My Viral Template"
              />

              <p className="text-sm text-gray-500">
                This will save the current hook and thread as a reusable template.
              </p>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="glass"
                  onClick={() => setShowSaveTemplateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAsTemplate}
                  isLoading={isSavingTemplate}
                  className="flex-1"
                >
                  <Save className="w-4 h-4" />
                  Save Template
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
