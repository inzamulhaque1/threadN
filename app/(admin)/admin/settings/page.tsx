"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  DollarSign,
  Gauge,
  Cpu,
  Shield,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  AlertTriangle,
  Zap,
  Check,
} from "lucide-react";
import { Card, Button, Input } from "@/components/ui";
import { adminApi } from "@/lib/api";

interface SettingsData {
  settings: Record<string, unknown>;
  categories: Record<string, string[]>;
}

export default function AdminSettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, unknown>>({});
  const [activeTab, setActiveTab] = useState("pricing");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const result = await adminApi.settings.get();
    if (result.success && result.data) {
      setData(result.data as SettingsData);
    }
    setIsLoading(false);
  };

  const handleChange = (key: string, value: unknown) => {
    setChanges((prev) => ({ ...prev, [key]: value }));
  };

  const getValue = (key: string) => {
    if (key in changes) return changes[key];
    return data?.settings[key];
  };

  const hasChanges = Object.keys(changes).length > 0;

  const handleSave = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    setSaveMessage(null);

    const result = await adminApi.settings.update(changes);
    if (result.success) {
      setChanges({});
      setSaveMessage("Settings saved successfully!");
      fetchSettings();
      setTimeout(() => setSaveMessage(null), 3000);
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    setChanges({});
  };

  const tabs = [
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "limits", label: "Plan Limits", icon: Gauge },
    { id: "costs", label: "Cost Caps", icon: AlertTriangle },
    { id: "ai", label: "AI Config", icon: Cpu },
    { id: "rate_limits", label: "Rate Limits", icon: Shield },
    { id: "features", label: "Features", icon: Zap },
    { id: "maintenance", label: "Maintenance", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse" />
        <div className="glass-card p-6 animate-pulse">
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const renderPricing = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {["free", "starter", "pro", "enterprise"].map((plan) => (
        <Card key={plan} className="text-center">
          <h3 className="text-lg font-semibold capitalize mb-4">{plan}</h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <Input
              type="number"
              step="0.01"
              value={getValue(`pricing_${plan}`) as number}
              onChange={(e) => handleChange(`pricing_${plan}`, parseFloat(e.target.value) || 0)}
              className="pl-8 text-center text-xl font-bold"
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">per month</p>
        </Card>
      ))}
    </div>
  );

  const renderLimits = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {["free", "starter", "pro", "enterprise"].map((plan) => (
        <Card key={plan}>
          <h3 className="text-lg font-semibold capitalize mb-4">{plan}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily Threads</label>
              <Input
                type="number"
                value={getValue(`limits_${plan}_daily_threads`) as number}
                onChange={(e) =>
                  handleChange(`limits_${plan}_daily_threads`, parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderCosts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {["free", "starter", "pro", "enterprise"].map((plan) => (
        <Card key={plan}>
          <h3 className="text-lg font-semibold capitalize mb-4">{plan}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily Cost Limit ($)</label>
              <Input
                type="number"
                step="0.01"
                value={getValue(`cost_${plan}_daily`) as number}
                onChange={(e) =>
                  handleChange(`cost_${plan}_daily`, parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Monthly Cost Limit ($)</label>
              <Input
                type="number"
                step="0.01"
                value={getValue(`cost_${plan}_monthly`) as number}
                onChange={(e) =>
                  handleChange(`cost_${plan}_monthly`, parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderAI = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">AI Model</h3>
        <select
          value={getValue("ai_model") as string}
          onChange={(e) => handleChange("ai_model", e.target.value)}
          className="input-dark w-full"
        >
          <option value="gpt-4o-mini">GPT-4o Mini (Recommended)</option>
          <option value="gpt-4o">GPT-4o (Higher Quality)</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
        </select>
        <p className="text-sm text-gray-400 mt-2">
          Model used for all AI generations. Higher models = better quality but higher cost.
        </p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Temperature Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Hooks Temperature ({getValue("ai_temperature_hooks")})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={getValue("ai_temperature_hooks") as number}
              onChange={(e) => handleChange("ai_temperature_hooks", parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Threads Temperature ({getValue("ai_temperature_threads")})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={getValue("ai_temperature_threads") as number}
              onChange={(e) => handleChange("ai_temperature_threads", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Token Limits</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Tokens for Hooks</label>
            <Input
              type="number"
              value={getValue("ai_max_tokens_hooks") as number}
              onChange={(e) =>
                handleChange("ai_max_tokens_hooks", parseInt(e.target.value) || 1500)
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Tokens for Threads</label>
            <Input
              type="number"
              value={getValue("ai_max_tokens_threads") as number}
              onChange={(e) =>
                handleChange("ai_max_tokens_threads", parseInt(e.target.value) || 1200)
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRateLimits = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          Generation
        </h3>
        <Input
          type="number"
          value={getValue("rate_limit_generation") as number}
          onChange={(e) => handleChange("rate_limit_generation", parseInt(e.target.value) || 10)}
        />
        <p className="text-sm text-gray-400 mt-2">Requests per minute per IP</p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Authentication
        </h3>
        <Input
          type="number"
          value={getValue("rate_limit_auth") as number}
          onChange={(e) => handleChange("rate_limit_auth", parseInt(e.target.value) || 10)}
        />
        <p className="text-sm text-gray-400 mt-2">Requests per 15 minutes per IP</p>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          General API
        </h3>
        <Input
          type="number"
          value={getValue("rate_limit_api") as number}
          onChange={(e) => handleChange("rate_limit_api", parseInt(e.target.value) || 60)}
        />
        <p className="text-sm text-gray-400 mt-2">Requests per minute per IP</p>
      </Card>
    </div>
  );

  const renderFeatures = () => {
    const features = [
      { key: "feature_youtube_extraction", label: "YouTube Extraction", description: "Extract transcripts from YouTube videos" },
      { key: "feature_url_extraction", label: "URL Extraction", description: "Extract content from web pages" },
      { key: "feature_trends", label: "Trends Discovery", description: "Access to trending topics feature" },
      { key: "feature_google_auth", label: "Google OAuth", description: "Allow sign in with Google" },
      { key: "feature_registration", label: "New Registrations", description: "Allow new users to register" },
    ];

    return (
      <div className="space-y-4">
        {features.map(({ key, label, description }) => (
          <Card key={key} className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{label}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
            <button
              onClick={() => handleChange(key, !getValue(key))}
              className={`p-2 rounded-lg transition-colors ${
                getValue(key) ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {getValue(key) ? (
                <ToggleRight className="w-8 h-8" />
              ) : (
                <ToggleLeft className="w-8 h-8" />
              )}
            </button>
          </Card>
        ))}
      </div>
    );
  };

  const renderMaintenance = () => (
    <div className="space-y-6">
      <Card className={getValue("maintenance_mode") ? "border-2 border-red-500/50" : ""}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className={getValue("maintenance_mode") ? "text-red-400" : "text-gray-400"} />
              Maintenance Mode
            </h3>
            <p className="text-sm text-gray-400">
              When enabled, all users will see the maintenance message
            </p>
          </div>
          <button
            onClick={() => handleChange("maintenance_mode", !getValue("maintenance_mode"))}
            className={`p-2 rounded-lg transition-colors ${
              getValue("maintenance_mode")
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {getValue("maintenance_mode") ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {getValue("maintenance_mode") && (
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-red-400 font-medium">
              Maintenance mode is ACTIVE. Users cannot access the platform.
            </p>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Maintenance Message</h3>
        <textarea
          value={getValue("maintenance_message") as string}
          onChange={(e) => handleChange("maintenance_message", e.target.value)}
          className="input-dark w-full h-32 resize-none"
          placeholder="Enter the message users will see during maintenance..."
        />
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "pricing":
        return renderPricing();
      case "limits":
        return renderLimits();
      case "costs":
        return renderCosts();
      case "ai":
        return renderAI();
      case "rate_limits":
        return renderRateLimits();
      case "features":
        return renderFeatures();
      case "maintenance":
        return renderMaintenance();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            Settings
          </h1>
          <p className="text-gray-400 mt-1">Configure application settings</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-green-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {saveMessage}
            </span>
          )}
          {hasChanges && (
            <>
              <Button variant="ghost" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-400">
            You have unsaved changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
