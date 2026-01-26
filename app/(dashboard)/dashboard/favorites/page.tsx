"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Folder,
  FolderPlus,
  Tag,
  Copy,
  Check,
  MoreVertical,
  Calendar,
  Repeat,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { favoritesApi, collectionsApi, schedulerApi } from "@/lib/api";

interface FavoriteData {
  _id: string;
  userId: string;
  generationId: string;
  collectionId: string | null;
  notes: string;
  tags: string[];
  createdAt: string;
  generation: {
    _id: string;
    type: string;
    input: { transcript: string; selectedHook?: string };
    output: { hooks?: Array<{ text: string }>; thread?: { title: string; body: string } };
    createdAt: string;
  } | null;
}

interface CollectionData {
  _id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  favoriteCount: number;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteData[]>([]);
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [uncategorizedCount, setUncategorizedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionData | null>(null);
  const [editingFavorite, setEditingFavorite] = useState<FavoriteData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collection form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColor, setFormColor] = useState("#8b5cf6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Favorite edit form state
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editCollectionId, setEditCollectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedCollection]);

  const fetchData = async () => {
    setIsLoading(true);
    const [favResult, collResult] = await Promise.all([
      favoritesApi.list(selectedCollection || undefined),
      collectionsApi.list(),
    ]);

    if (favResult.success && favResult.data) {
      setFavorites((favResult.data as { favorites: FavoriteData[] }).favorites || []);
    }

    if (collResult.success && collResult.data) {
      const data = collResult.data as { collections: CollectionData[]; uncategorizedCount: number };
      setCollections(data.collections || []);
      setUncategorizedCount(data.uncategorizedCount || 0);
    }

    setIsLoading(false);
  };

  const handleCreateOrUpdateCollection = async () => {
    if (!formName.trim()) {
      setError("Please enter a collection name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = { name: formName, description: formDescription, color: formColor };

    let result;
    if (editingCollection) {
      result = await collectionsApi.update(editingCollection._id, data);
    } else {
      result = await collectionsApi.create(data);
    }

    if (result.success) {
      setShowCollectionModal(false);
      setEditingCollection(null);
      resetCollectionForm();
      fetchData();
    } else {
      setError(result.error || "Failed to save collection");
    }

    setIsSubmitting(false);
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm("Delete this collection? Favorites will be moved to Uncategorized.")) return;

    const result = await collectionsApi.delete(id);
    if (result.success) {
      if (selectedCollection === id) setSelectedCollection(null);
      fetchData();
    } else {
      setError(result.error || "Failed to delete");
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    if (!confirm("Remove from favorites?")) return;

    const result = await favoritesApi.remove(id);
    if (result.success) {
      fetchData();
    } else {
      setError(result.error || "Failed to remove");
    }
  };

  const handleUpdateFavorite = async () => {
    if (!editingFavorite) return;

    const result = await favoritesApi.update(editingFavorite._id, {
      notes: editNotes,
      tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
      collectionId: editCollectionId,
    });

    if (result.success) {
      setEditingFavorite(null);
      fetchData();
    } else {
      setError(result.error || "Failed to update");
    }
  };

  const openEditCollectionModal = (collection: CollectionData) => {
    setEditingCollection(collection);
    setFormName(collection.name);
    setFormDescription(collection.description);
    setFormColor(collection.color);
    setShowCollectionModal(true);
  };

  const openEditFavoriteModal = (favorite: FavoriteData) => {
    setEditingFavorite(favorite);
    setEditNotes(favorite.notes);
    setEditTags(favorite.tags.join(", "));
    setEditCollectionId(favorite.collectionId);
  };

  const resetCollectionForm = () => {
    setFormName("");
    setFormDescription("");
    setFormColor("#8b5cf6");
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleScheduleFavorite = async (favorite: FavoriteData) => {
    if (!favorite.generation) return;

    const hook = favorite.generation.output.hooks?.[0]?.text || favorite.generation.input.selectedHook || "";
    const thread = favorite.generation.output.thread?.body || "";

    if (!hook || !thread) {
      setError("Cannot schedule: missing hook or thread content");
      return;
    }

    // Set schedule time to 1 hour from now
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const result = await schedulerApi.create({
      content: { hook, thread, platforms: ["facebook"] },
      scheduledAt,
      recurrence: "none",
    });

    if (result.success) {
      setError(null);
      alert("Scheduled! Check the Scheduler page.");
    } else {
      setError(result.error || "Failed to schedule");
    }
  };

  const getContentPreview = (favorite: FavoriteData): string => {
    if (!favorite.generation) return "Content not available";
    if (favorite.generation.output.thread) {
      return favorite.generation.output.thread.body.slice(0, 150) + "...";
    }
    if (favorite.generation.output.hooks?.[0]) {
      return favorite.generation.output.hooks[0].text;
    }
    return favorite.generation.input.selectedHook || "No content";
  };

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar - Collections */}
      <div className="w-64 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Collections</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { resetCollectionForm(); setEditingCollection(null); setShowCollectionModal(true); }}
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setSelectedCollection(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
              selectedCollection === null
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              All Favorites
            </span>
          </button>

          <button
            onClick={() => setSelectedCollection("uncategorized")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
              selectedCollection === "uncategorized"
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Uncategorized
            </span>
            <span className="text-xs">{uncategorizedCount}</span>
          </button>

          {collections.map((collection) => (
            <div
              key={collection._id}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                selectedCollection === collection._id
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setSelectedCollection(collection._id)}
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4" style={{ color: collection.color }} />
                <span className="truncate">{collection.name}</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs">{collection.favoriteCount}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); openEditCollectionModal(collection); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteCollection(collection._id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Favorites */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Favorites</h1>
            <p className="text-gray-400 text-sm">
              {selectedCollection === null
                ? "All your saved content"
                : selectedCollection === "uncategorized"
                ? "Uncategorized favorites"
                : collections.find((c) => c._id === selectedCollection)?.name || ""}
            </p>
          </div>
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

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
          </div>
        ) : favorites.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No favorites yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Save content from the Generate page to see it here
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card key={favorite._id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Type & Tags */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        favorite.generation?.type === "hooks"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}>
                        {favorite.generation?.type || "unknown"}
                      </span>
                      {favorite.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Content Preview */}
                    <p className="text-white text-sm mb-2">{getContentPreview(favorite)}</p>

                    {/* Notes */}
                    {favorite.notes && (
                      <p className="text-xs text-gray-500 italic mb-2">Note: {favorite.notes}</p>
                    )}

                    {/* Date */}
                    <p className="text-xs text-gray-600">
                      Saved {new Date(favorite.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(getContentPreview(favorite), favorite._id)}
                    >
                      {copiedId === favorite._id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleScheduleFavorite(favorite)}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditFavoriteModal(favorite)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFavorite(favorite._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingCollection ? "Edit Collection" : "Create Collection"}
              </h2>
              <button onClick={() => setShowCollectionModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="My Collection"
              />

              <Textarea
                label="Description (optional)"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="What's this collection for?"
                className="min-h-[60px]"
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
                <div className="flex items-center gap-2">
                  {["#8b5cf6", "#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#ec4899"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        formColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button variant="glass" onClick={() => setShowCollectionModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdateCollection} isLoading={isSubmitting} className="flex-1">
                  {editingCollection ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Favorite Modal */}
      {editingFavorite && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Edit Favorite</h2>
              <button onClick={() => setEditingFavorite(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Collection</label>
                <select
                  value={editCollectionId || ""}
                  onChange={(e) => setEditCollectionId(e.target.value || null)}
                  className="input-dark w-full"
                >
                  <option value="">Uncategorized</option>
                  {collections.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about this content..."
                className="min-h-[60px]"
              />

              <Input
                label="Tags (comma-separated)"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />

              <div className="flex items-center gap-3 pt-4">
                <Button variant="glass" onClick={() => setEditingFavorite(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleUpdateFavorite} className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
