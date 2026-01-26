const API_BASE = "/api";

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const { method = "GET", body, headers = {} } = options;

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Request failed",
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api("/auth/register", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    api("/auth/login", { method: "POST", body: data }),

  logout: () => api("/auth/logout", { method: "POST" }),

  me: () => api("/auth/me"),
};

// Generate API
export const generateApi = {
  hooks: (transcript: string) =>
    api("/generate", { method: "POST", body: { transcript, mode: "hooks" } }),

  thread: (transcript: string, selectedHook: string, cta?: string) =>
    api("/generate", {
      method: "POST",
      body: { transcript, mode: "thread", selectedHook, cta },
    }),

  contentFromTopic: (topic: string, style: string, tone?: string, audience?: string) =>
    api("/generate", {
      method: "POST",
      body: { topic, style, tone, audience, mode: "content" },
    }),

  extractFromUrl: (url: string) =>
    api("/generate", {
      method: "POST",
      body: { url, mode: "url" },
    }),
};

// Codes API
export const codesApi = {
  redeem: (code: string) =>
    api("/codes/redeem", { method: "POST", body: { code } }),
};

// User API
export const userApi = {
  history: (page = 1, limit = 20, type?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set("type", type);
    return api(`/users/history?${params}`);
  },
};

// Admin API
export const adminApi = {
  stats: (query = "") => api(`/admin/stats${query}`),

  users: {
    list: (page = 1, limit = 20, search?: string, plan?: string) => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (plan) params.set("plan", plan);
      return api(`/admin/users?${params}`);
    },
    get: (id: string) => api(`/admin/users/${id}`),
    update: (id: string, data: Record<string, unknown>) =>
      api(`/admin/users/${id}`, { method: "PATCH", body: data }),
    delete: (id: string) => api(`/admin/users/${id}`, { method: "DELETE" }),
  },

  codes: {
    list: (page = 1, limit = 20, type?: string, active?: boolean) => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (type) params.set("type", type);
      if (active !== undefined) params.set("active", String(active));
      return api(`/admin/codes?${params}`);
    },
    create: (data: {
      code?: string;
      type: string;
      value: number;
      plan?: string;
      maxUses?: number;
      expiresAt?: string;
    }) => api("/admin/codes", { method: "POST", body: data }),
    update: (id: string, data: Record<string, unknown>) =>
      api(`/admin/codes/${id}`, { method: "PATCH", body: data }),
    delete: (id: string) => api(`/admin/codes/${id}`, { method: "DELETE" }),
  },

  generations: {
    list: (page = 1, limit = 20, type?: string, userId?: string) => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (type) params.set("type", type);
      if (userId) params.set("userId", userId);
      return api(`/admin/generations?${params}`);
    },
  },

  settings: {
    get: () => api("/admin/settings"),
    update: (data: Record<string, unknown>) =>
      api("/admin/settings", { method: "PATCH", body: data }),
  },

  // Quick actions
  actions: {
    resetUserUsage: (userId: string) =>
      api(`/admin/users/${userId}/reset-usage`, { method: "POST" }),
    banUser: (userId: string) =>
      api(`/admin/users/${userId}`, { method: "PATCH", body: { banned: true } }),
    unbanUser: (userId: string) =>
      api(`/admin/users/${userId}`, { method: "PATCH", body: { banned: false } }),
  },
};

// Scheduler API
export const schedulerApi = {
  list: (status?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const query = params.toString();
    return api(`/scheduler${query ? `?${query}` : ""}`);
  },

  get: (id: string) => api(`/scheduler/${id}`),

  create: (data: {
    content: { hook: string; thread: string; platforms: string[] };
    scheduledAt: string;
    recurrence?: "none" | "daily" | "weekly";
  }) => api("/scheduler", { method: "POST", body: data }),

  update: (id: string, data: {
    content?: { hook: string; thread: string; platforms: string[] };
    scheduledAt?: string;
    recurrence?: "none" | "daily" | "weekly";
  }) => api(`/scheduler/${id}`, { method: "PATCH", body: data }),

  delete: (id: string) => api(`/scheduler/${id}`, { method: "DELETE" }),

  publish: (id: string) => api(`/scheduler/${id}/publish`, { method: "POST" }),
};

// Templates API
export const templatesApi = {
  list: (category?: string, type?: "my" | "public" | "all") => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    const query = params.toString();
    return api(`/templates${query ? `?${query}` : ""}`);
  },

  get: (id: string) => api(`/templates/${id}`),

  create: (data: {
    name: string;
    description?: string;
    category: "hook" | "thread" | "full";
    content: {
      hookTemplate?: string;
      threadTemplate?: string;
      variables?: Array<{ name: string; description?: string; defaultValue?: string }>;
    };
    isPublic?: boolean;
  }) => api("/templates", { method: "POST", body: data }),

  update: (id: string, data: {
    name?: string;
    description?: string;
    category?: "hook" | "thread" | "full";
    content?: {
      hookTemplate?: string;
      threadTemplate?: string;
      variables?: Array<{ name: string; description?: string; defaultValue?: string }>;
    };
    isPublic?: boolean;
  }) => api(`/templates/${id}`, { method: "PATCH", body: data }),

  delete: (id: string) => api(`/templates/${id}`, { method: "DELETE" }),

  use: (id: string, variables?: Record<string, string>) =>
    api(`/templates/${id}/use`, { method: "POST", body: { variables } }),
};

// Favorites API
export const favoritesApi = {
  list: (collectionId?: string, tag?: string) => {
    const params = new URLSearchParams();
    if (collectionId) params.set("collectionId", collectionId);
    if (tag) params.set("tag", tag);
    const query = params.toString();
    return api(`/favorites${query ? `?${query}` : ""}`);
  },

  add: (data: {
    generationId: string;
    collectionId?: string | null;
    notes?: string;
    tags?: string[];
  }) => api("/favorites", { method: "POST", body: data }),

  update: (id: string, data: {
    collectionId?: string | null;
    notes?: string;
    tags?: string[];
  }) => api(`/favorites/${id}`, { method: "PATCH", body: data }),

  remove: (id: string) => api(`/favorites/${id}`, { method: "DELETE" }),
};

// Collections API
export const collectionsApi = {
  list: () => api("/collections"),

  get: (id: string) => api(`/collections/${id}`),

  create: (data: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  }) => api("/collections", { method: "POST", body: data }),

  update: (id: string, data: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }) => api(`/collections/${id}`, { method: "PATCH", body: data }),

  delete: (id: string) => api(`/collections/${id}`, { method: "DELETE" }),
};

// Achievements API
export const achievementsApi = {
  list: () => api("/achievements"),

  getStreak: () => api("/streak"),
};
