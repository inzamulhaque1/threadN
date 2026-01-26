"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Play,
  Globe,
  Lock,
  Sparkles,
  Search,
} from "lucide-react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import { templatesApi } from "@/lib/api";
import type { ITemplate } from "@/types";

interface TemplateData {
  _id: string;
  userId: string | null;
  name: string;
  description: string;
  category: "hook" | "thread" | "full";
  content: {
    hookTemplate: string;
    threadTemplate: string;
    variables: Array<{ name: string; description: string; defaultValue: string }>;
  };
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  const [usingTemplate, setUsingTemplate] = useState<TemplateData | null>(null);
  const [viewType, setViewType] = useState<"my" | "public" | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<"hook" | "thread" | "full">("hook");
  const [formHookTemplate, setFormHookTemplate] = useState("");
  const [formThreadTemplate, setFormThreadTemplate] = useState("");
  const [formVariables, setFormVariables] = useState<Array<{ name: string; description: string; defaultValue: string }>>([]);
  const [formIsPublic, setFormIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use template form state
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<{ hook: string; thread: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [viewType, categoryFilter]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    const result = await templatesApi.list(categoryFilter || undefined, viewType);
    if (result.success && result.data) {
      setTemplates((result.data as { templates: TemplateData[] }).templates || []);
    } else {
      setError(result.error || "Failed to fetch templates");
    }
    setIsLoading(false);
  };

  const handleCreateOrUpdate = async () => {
    if (!formName.trim()) {
      setError("Please enter a template name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const data = {
      name: formName,
      description: formDescription,
      category: formCategory,
      content: {
        hookTemplate: formHookTemplate,
        threadTemplate: formThreadTemplate,
        variables: formVariables,
      },
      isPublic: formIsPublic,
    };

    let result;
    if (editingTemplate) {
      result = await templatesApi.update(editingTemplate._id, data);
    } else {
      result = await templatesApi.create(data);
    }

    if (result.success) {
      setShowCreateModal(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } else {
      setError(result.error || "Failed to save template");
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    const result = await templatesApi.delete(id);
    if (result.success) {
      fetchTemplates();
    } else {
      setError(result.error || "Failed to delete");
    }
  };

  const handleUseTemplate = async () => {
    if (!usingTemplate) return;

    setIsGenerating(true);
    setError(null);

    const result = await templatesApi.use(usingTemplate._id, variableValues);
    if (result.success && result.data) {
      const data = result.data as { hook: string; thread: string };
      setGeneratedContent({ hook: data.hook, thread: data.thread });
    } else {
      setError(result.error || "Failed to generate from template");
    }

    setIsGenerating(false);
  };

  const openEditModal = (template: TemplateData) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormDescription(template.description);
    setFormCategory(template.category);
    setFormHookTemplate(template.content.hookTemplate);
    setFormThreadTemplate(template.content.threadTemplate);
    setFormVariables(template.content.variables);
    setFormIsPublic(template.isPublic);
    setShowCreateModal(true);
  };

  const openUseModal = (template: TemplateData) => {
    setUsingTemplate(template);
    setGeneratedContent(null);
    const initialValues: Record<string, string> = {};
    template.content.variables.forEach((v) => {
      initialValues[v.name] = v.defaultValue || "";
    });
    setVariableValues(initialValues);
    setShowUseModal(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormCategory("hook");
    setFormHookTemplate("");
    setFormThreadTemplate("");
    setFormVariables([]);
    setFormIsPublic(false);
  };

  const addVariable = () => {
    setFormVariables([...formVariables, { name: "", description: "", defaultValue: "" }]);
  };

  const updateVariable = (index: number, field: string, value: string) => {
    const updated = [...formVariables];
    updated[index] = { ...updated[index], [field]: value };
    setFormVariables(updated);
  };

  const removeVariable = (index: number) => {
    setFormVariables(formVariables.filter((_, i) => i !== index));
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "hook":
        return "bg-purple-500/20 text-purple-400";
      case "thread":
        return "bg-cyan-500/20 text-cyan-400";
      case "full":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredTemplates = templates.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-gray-400 text-sm">Create and use content templates</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingTemplate(null); setShowCreateModal(true); }}>
          <Plus className="w-4 h-4" />
          Create Template
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
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {(["all", "my", "public"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                viewType === type
                  ? "bg-purple-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {type === "all" ? "All" : type === "my" ? "My Templates" : "Community"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {["", "hook", "thread", "full"].map((cat) => (
            <button
              key={cat || "all"}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                categoryFilter === cat
                  ? "bg-cyan-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat || "All Types"}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No templates found</p>
          <p className="text-gray-500 text-sm mt-1">Create your first template to get started</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template._id} className="p-4 hover:border-purple-500/30 transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryBadge(template.category)}`}>
                    {template.category}
                  </span>
                  {template.isPublic ? (
                    <Globe className="w-3 h-3 text-green-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-500" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{template.usageCount} uses</span>
              </div>

              <h3 className="font-semibold text-white mb-1 truncate">{template.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{template.description || "No description"}</p>

              {template.content.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.content.variables.map((v) => (
                    <span
                      key={v.name}
                      className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded"
                    >
                      {`{{${v.name}}}`}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                <Button size="sm" onClick={() => openUseModal(template)} className="flex-1">
                  <Play className="w-3 h-3" />
                  Use
                </Button>
                {template.userId && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(template)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(template._id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Template Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="My Awesome Template"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as "hook" | "thread" | "full")}
                    className="input-dark w-full"
                  >
                    <option value="hook">Hook Only</option>
                    <option value="thread">Thread Only</option>
                    <option value="full">Full (Hook + Thread)</option>
                  </select>
                </div>
              </div>

              <Textarea
                label="Description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe what this template is for..."
                className="min-h-[60px]"
              />

              {(formCategory === "hook" || formCategory === "full") && (
                <Textarea
                  label="Hook Template"
                  value={formHookTemplate}
                  onChange={(e) => setFormHookTemplate(e.target.value)}
                  placeholder="Use {{variable_name}} for dynamic content..."
                  className="min-h-[80px]"
                />
              )}

              {(formCategory === "thread" || formCategory === "full") && (
                <Textarea
                  label="Thread Template"
                  value={formThreadTemplate}
                  onChange={(e) => setFormThreadTemplate(e.target.value)}
                  placeholder="Use {{variable_name}} for dynamic content..."
                  className="min-h-[120px]"
                />
              )}

              {/* Variables */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-400">Variables</label>
                  <Button variant="ghost" size="sm" onClick={addVariable}>
                    <Plus className="w-3 h-3" />
                    Add Variable
                  </Button>
                </div>
                {formVariables.length === 0 ? (
                  <p className="text-sm text-gray-500">No variables. Add variables to make your template dynamic.</p>
                ) : (
                  <div className="space-y-2">
                    {formVariables.map((v, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <Input
                          placeholder="name"
                          value={v.name}
                          onChange={(e) => updateVariable(i, "name", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="default value"
                          value={v.defaultValue}
                          onChange={(e) => updateVariable(i, "defaultValue", e.target.value)}
                          className="flex-1"
                        />
                        <button onClick={() => removeVariable(i)}>
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formIsPublic}
                  onChange={(e) => setFormIsPublic(e.target.checked)}
                  className="rounded border-gray-600"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-400">
                  Make this template public (visible to all users)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button variant="glass" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateOrUpdate} isLoading={isSubmitting} className="flex-1">
                  {editingTemplate ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseModal && usingTemplate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Use Template</h2>
                <p className="text-sm text-gray-400">{usingTemplate.name}</p>
              </div>
              <button onClick={() => setShowUseModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {usingTemplate.content.variables.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-400">Fill in the variables:</p>
                {usingTemplate.content.variables.map((v) => (
                  <Input
                    key={v.name}
                    label={v.name}
                    placeholder={v.description || `Enter ${v.name}...`}
                    value={variableValues[v.name] || ""}
                    onChange={(e) => setVariableValues({ ...variableValues, [v.name]: e.target.value })}
                  />
                ))}
              </div>
            )}

            <Button onClick={handleUseTemplate} isLoading={isGenerating} className="w-full mb-6">
              <Sparkles className="w-4 h-4" />
              Generate Content
            </Button>

            {generatedContent && (
              <div className="space-y-4">
                {generatedContent.hook && (
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Generated Hook:</p>
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <p className="text-white">{generatedContent.hook}</p>
                    </div>
                  </div>
                )}
                {generatedContent.thread && (
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-2">Generated Thread:</p>
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg max-h-[300px] overflow-y-auto">
                      <p className="text-white whitespace-pre-wrap">{generatedContent.thread}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
