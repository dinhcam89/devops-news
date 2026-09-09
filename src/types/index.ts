/**
 * Shared application types for the frontend.
 */

export interface ArticleView {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  author: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
  tags: string[] | null;
  category: string | null;
  isRead: boolean | null;
  isBookmarked: boolean | null;
  sourceName: string;
  sourceSlug: string;
  rank?: number;
}

export interface SourceView {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: string;
  iconUrl: string | null;
  isActive: boolean | null;
  lastFetchedAt: Date | null;
  lastError: string | null;
  articleCount: number;
}

export interface CategoryCount {
  category: string | null;
  count: number;
}

export interface DashboardStats {
  totalArticles: number;
  unreadArticles: number;
  bookmarkedArticles: number;
  activeSources: number;
}

// Category color mapping for consistent UI
export const CATEGORY_COLORS: Record<string, string> = {
  "Cloud Native": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  "Cloud Platforms": "bg-sky-500/15 text-sky-400 border-sky-500/20",
  "CI/CD & Automation": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Security: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  Observability: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Infrastructure: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Networking: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "General DevOps": "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

// Source color mapping
export const SOURCE_COLORS: Record<string, string> = {
  "cncf-blog": "bg-purple-500/15 text-purple-400",
  "k8s-blog": "bg-blue-500/15 text-blue-400",
  "azure-updates": "bg-sky-500/15 text-sky-400",
  "azure-blog": "bg-sky-500/15 text-sky-400",
  "github-changelog": "bg-zinc-500/15 text-zinc-300",
  "hashicorp-blog": "bg-emerald-500/15 text-emerald-400",
  "devops-reddit": "bg-orange-500/15 text-orange-400",
  "cncf-landscape": "bg-purple-500/15 text-purple-400",
};
