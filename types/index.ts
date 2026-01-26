// User Types
export interface IUser {
  _id: string;
  email: string;
  password: string | null;
  name: string;
  image: string | null;
  authProvider: "credentials" | "google";
  googleId: string | null;
  role: "user" | "admin";
  plan: "free" | "starter" | "pro" | "enterprise";
  coins: number;
  subscription: {
    status: "none" | "active" | "cancelled" | "expired";
    plan: string | null;
    expiresAt: Date | null;
    paddleCustomerId: string | null;
    paddleSubscriptionId: string | null;
  };
  usage: {
    totalHooks: number;
    totalThreads: number;
    dailyThreads: number;
    lastResetAt: Date;
    // Cost tracking for OpenAI usage caps
    dailyCost: number;
    monthlyCost: number;
    lastDailyCostResetAt: Date;
    lastMonthlyCostResetAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic {
  id: string;
  email: string;
  name: string;
  image: string | null;
  authProvider: "credentials" | "google";
  role: "user" | "admin";
  plan: "free" | "starter" | "pro" | "enterprise";
  coins: number;
  subscription: {
    status: "none" | "active" | "cancelled" | "expired";
    plan: string | null;
    expiresAt: Date | null;
  };
  usage: {
    totalHooks: number;
    totalThreads: number;
    dailyThreads: number;
    lastResetAt: Date;
    dailyCost: number;
    monthlyCost: number;
    lastDailyCostResetAt: Date;
    lastMonthlyCostResetAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Generation Types
export interface IHook {
  text: string;
  score: number;
  reason: string;
  evidence: string[];
}

export interface IThread {
  title: string;
  body: string;
}

export interface IGeneration {
  _id: string;
  userId: string;
  type: "hooks" | "thread";
  input: {
    transcript: string;
    cta?: string;
    selectedHook?: string;
  };
  output: {
    hooks?: IHook[];
    thread?: IThread;
  };
  tokens: number;
  cost: number;
  createdAt: Date;
}

// Access Code Types
export interface IAccessCode {
  _id: string;
  code: string;
  type: "subscription" | "coins" | "trial";
  value: number;
  plan?: "starter" | "pro" | "enterprise";
  maxUses: number;
  usedCount: number;
  usedBy: string[];
  isActive: boolean;
  expiresAt: Date | null;
  createdBy: string;
  createdAt: Date;
}

// Settings Types
export interface ISetting {
  _id: string;
  key: string;
  value: unknown;
  category: "pricing" | "limits" | "features" | "ai";
  updatedBy: string;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Plan Limits
export interface PlanLimits {
  dailyThreads: number;
  hooksPerGeneration: number;
  historyDays: number;
  // Cost caps in USD
  dailyCostLimit: number;
  monthlyCostLimit: number;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    dailyThreads: 1,
    hooksPerGeneration: 5,
    historyDays: 7,
    dailyCostLimit: 0.10,    // $0.10/day
    monthlyCostLimit: 1.00,  // $1.00/month
  },
  starter: {
    dailyThreads: 10,
    hooksPerGeneration: 10,
    historyDays: 30,
    dailyCostLimit: 0.50,    // $0.50/day
    monthlyCostLimit: 10.00, // $10/month
  },
  pro: {
    dailyThreads: 25,
    hooksPerGeneration: 10,
    historyDays: 90,
    dailyCostLimit: 2.00,    // $2/day
    monthlyCostLimit: 50.00, // $50/month
  },
  enterprise: {
    dailyThreads: 100,
    hooksPerGeneration: 10,
    historyDays: 365,
    dailyCostLimit: 10.00,   // $10/day
    monthlyCostLimit: 200.00, // $200/month
  },
};

// Platform Types
export type Platform = "facebook" | "twitter" | "linkedin" | "instagram";

// Scheduled Post Types
export interface IScheduledPost {
  _id: string;
  userId: string;
  content: {
    hook: string;
    thread: string;
    platforms: Platform[];
  };
  scheduledAt: Date;
  status: "pending" | "published" | "failed";
  recurrence: "none" | "daily" | "weekly";
  publishedAt: Date | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Template Types
export interface ITemplateVariable {
  name: string;
  description: string;
  defaultValue: string;
}

export interface ITemplate {
  _id: string;
  userId: string | null; // null for system templates
  name: string;
  description: string;
  category: "hook" | "thread" | "full";
  content: {
    hookTemplate: string;
    threadTemplate: string;
    variables: ITemplateVariable[];
  };
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Collection Types
export interface ICollection {
  _id: string;
  userId: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

// Favorite Types
export interface IFavorite {
  _id: string;
  userId: string;
  generationId: string;
  collectionId: string | null;
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Achievement Types
export interface IAchievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  category: "generation" | "streaks" | "engagement" | "milestones";
  icon: string;
  requirement: number;
}

export interface IUserAchievement {
  _id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// User Streak Types
export interface IUserStreak {
  _id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  totalDaysActive: number;
  createdAt: Date;
  updatedAt: Date;
}

// Achievement Definitions
export const ACHIEVEMENTS: Record<string, IAchievement> = {
  // Generation Achievements
  first_hook: {
    id: "first_hook",
    name: "Hook Master",
    description: "Generate your first hook",
    xp: 10,
    category: "generation",
    icon: "zap",
    requirement: 1,
  },
  first_thread: {
    id: "first_thread",
    name: "Thread Weaver",
    description: "Generate your first thread",
    xp: 20,
    category: "generation",
    icon: "edit-3",
    requirement: 1,
  },
  hooks_10: {
    id: "hooks_10",
    name: "Hook Collector",
    description: "Generate 10 hooks",
    xp: 50,
    category: "generation",
    icon: "layers",
    requirement: 10,
  },
  threads_10: {
    id: "threads_10",
    name: "Story Teller",
    description: "Generate 10 threads",
    xp: 100,
    category: "generation",
    icon: "book-open",
    requirement: 10,
  },
  hooks_100: {
    id: "hooks_100",
    name: "Hook Legend",
    description: "Generate 100 hooks",
    xp: 500,
    category: "generation",
    icon: "award",
    requirement: 100,
  },

  // Streak Achievements
  streak_3: {
    id: "streak_3",
    name: "Getting Started",
    description: "Maintain a 3-day streak",
    xp: 30,
    category: "streaks",
    icon: "flame",
    requirement: 3,
  },
  streak_7: {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    xp: 100,
    category: "streaks",
    icon: "flame",
    requirement: 7,
  },
  streak_30: {
    id: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    xp: 500,
    category: "streaks",
    icon: "flame",
    requirement: 30,
  },

  // Feature Achievements
  first_schedule: {
    id: "first_schedule",
    name: "Planner",
    description: "Schedule your first post",
    xp: 25,
    category: "engagement",
    icon: "calendar",
    requirement: 1,
  },
  first_template: {
    id: "first_template",
    name: "Template Creator",
    description: "Create your first template",
    xp: 25,
    category: "engagement",
    icon: "file-text",
    requirement: 1,
  },
  first_collection: {
    id: "first_collection",
    name: "Curator",
    description: "Create your first collection",
    xp: 15,
    category: "engagement",
    icon: "folder",
    requirement: 1,
  },
  ab_tester: {
    id: "ab_tester",
    name: "A/B Tester",
    description: "Generate A/B hook variations",
    xp: 30,
    category: "engagement",
    icon: "git-branch",
    requirement: 1,
  },
  multi_platform: {
    id: "multi_platform",
    name: "Cross-Platform",
    description: "Format content for 3+ platforms",
    xp: 50,
    category: "milestones",
    icon: "share-2",
    requirement: 3,
  },
};

// Platform Content Types
export interface IPlatformContent {
  platform: Platform;
  content: string;
  characterCount: number;
  isWithinLimit: boolean;
}

export interface IMultiPlatformContent {
  facebook: IPlatformContent;
  twitter: IPlatformContent[];
  linkedin: IPlatformContent;
  instagram: IPlatformContent;
}
