"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Play,
  X,
  AlertCircle,
  Check,
  Repeat,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { schedulerApi } from "@/lib/api";
import type { IScheduledPost, Platform } from "@/types";

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

interface ScheduledPostData {
  _id: string;
  content: {
    hook: string;
    thread: string;
    platforms: Platform[];
  };
  scheduledAt: string;
  status: "pending" | "published" | "failed";
  recurrence: "none" | "daily" | "weekly";
  publishedAt: string | null;
  error: string | null;
  createdAt: string;
}

export default function SchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPostData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Form state
  const [formHook, setFormHook] = useState("");
  const [formThread, setFormThread] = useState("");
  const [formPlatforms, setFormPlatforms] = useState<Platform[]>(["facebook"]);
  const [formScheduledAt, setFormScheduledAt] = useState("");
  const [formRecurrence, setFormRecurrence] = useState<"none" | "daily" | "weekly">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const result = await schedulerApi.list(statusFilter || undefined);
    if (result.success && result.data) {
      setPosts((result.data as { posts: ScheduledPostData[] }).posts || []);
    } else {
      setError(result.error || "Failed to fetch scheduled posts");
    }
    setIsLoading(false);
  };

  const handleCreateOrUpdate = async () => {
    if (!formHook.trim() || !formThread.trim() || !formScheduledAt || formPlatforms.length === 0) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = {
      content: {
        hook: formHook,
        thread: formThread,
        platforms: formPlatforms,
      },
      scheduledAt: formScheduledAt,
      recurrence: formRecurrence,
    };

    let result;
    if (editingPost) {
      result = await schedulerApi.update(editingPost._id, data);
    } else {
      result = await schedulerApi.create(data);
    }

    if (result.success) {
      setShowCreateModal(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } else {
      setError(result.error || "Failed to save scheduled post");
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheduled post?")) return;

    const result = await schedulerApi.delete(id);
    if (result.success) {
      fetchPosts();
    } else {
      setError(result.error || "Failed to delete");
    }
  };

  const handlePublishNow = async (id: string) => {
    const result = await schedulerApi.publish(id);
    if (result.success) {
      fetchPosts();
    } else {
      setError(result.error || "Failed to publish");
    }
  };

  const openEditModal = (post: ScheduledPostData) => {
    setEditingPost(post);
    setFormHook(post.content.hook);
    setFormThread(post.content.thread);
    setFormPlatforms(post.content.platforms);
    setFormScheduledAt(new Date(post.scheduledAt).toISOString().slice(0, 16));
    setFormRecurrence(post.recurrence);
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormHook("");
    setFormThread("");
    setFormPlatforms(["facebook"]);
    setFormScheduledAt("");
    setFormRecurrence("none");
  };

  const togglePlatform = (platform: Platform) => {
    setFormPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "published":
        return "bg-green-500/20 text-green-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Scheduler</h1>
          <p className="text-gray-400 text-sm">Schedule and manage your content posts</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingPost(null); setShowCreateModal(true); }}>
          <Plus className="w-4 h-4" />
          Schedule Post
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-400">Filter:</span>
        {["", "pending", "published", "failed"].map((status) => (
          <button
            key={status || "all"}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              statusFilter === status
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {status || "All"}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No scheduled posts yet</p>
          <p className="text-gray-500 text-sm mt-1">Click "Schedule Post" to create your first one</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post._id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Status & Platforms */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                    {post.recurrence !== "none" && (
                      <span className="flex items-center gap-1 text-xs text-purple-400">
                        <Repeat className="w-3 h-3" />
                        {post.recurrence}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      {post.content.platforms.map((platform) => {
                        const Icon = platformIcons[platform];
                        return (
                          <Icon
                            key={platform}
                            className={`w-4 h-4 ${platformColors[platform]}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Hook */}
                  <p className="text-white font-medium truncate">{post.content.hook}</p>

                  {/* Schedule Time */}
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {new Date(post.scheduledAt).toLocaleString()}
                  </div>

                  {/* Error message */}
                  {post.error && (
                    <p className="text-xs text-red-400 mt-2">{post.error}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {post.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublishNow(post._id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingPost ? "Edit Scheduled Post" : "Schedule New Post"}
              </h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Hook</label>
                <Input
                  value={formHook}
                  onChange={(e) => setFormHook(e.target.value)}
                  placeholder="Enter your hook..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Thread Content</label>
                <Textarea
                  value={formThread}
                  onChange={(e) => setFormThread(e.target.value)}
                  placeholder="Enter your thread content..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Platforms</label>
                <div className="flex items-center gap-2">
                  {(["facebook", "twitter", "linkedin", "instagram"] as Platform[]).map((platform) => {
                    const Icon = platformIcons[platform];
                    const isSelected = formPlatforms.includes(platform);
                    return (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          isSelected
                            ? "bg-purple-500/20 border border-purple-500/50"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? platformColors[platform] : "text-gray-500"}`} />
                        {isSelected && <Check className="w-3 h-3 text-green-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Schedule Date & Time</label>
                <Input
                  type="datetime-local"
                  value={formScheduledAt}
                  onChange={(e) => setFormScheduledAt(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Recurrence</label>
                <select
                  value={formRecurrence}
                  onChange={(e) => setFormRecurrence(e.target.value as "none" | "daily" | "weekly")}
                  className="input-dark w-full"
                >
                  <option value="none">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  variant="glass"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateOrUpdate}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  {editingPost ? "Update" : "Schedule"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
