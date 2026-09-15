import { getTrackedRepos } from "@/lib/queries";
import {
  Star,
  GitPullRequest,
  CircleDot,
  Tag,
  Clock,
  ExternalLink,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddRepoForm } from "@/components/add-repo-form";

interface MergedPr {
  title: string;
  url: string;
  merged_at: string;
  author: string;
}

interface Milestone {
  title: string;
  due_on: string | null;
  open_issues: number;
  closed_issues: number;
  url: string;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function timeAgo(date: Date | string | null): string {
  if (!date) return "never";
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default async function TrackerPage() {
  const repos = await getTrackedRepos();

  // Group by category
  const grouped = repos.reduce(
    (acc, repo) => {
      const cat = repo.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(repo);
      return acc;
    },
    {} as Record<string, typeof repos>
  );

  const categoryOrder = [
    "Orchestration",
    "Cloud / Azure",
    "Cloud / AWS",
    "CI/CD",
    "CI/CD / GitOps",
    "IaC",
    "Containers",
    "Observability",
    "Package Management",
    "Networking / Security",
  ];

  const sortedCategories = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Repository Tracker
          </h1>
          <p className="text-muted-foreground">
            Live activity from key DevOps open-source projects. Releases, PRs,
            milestones — all in one place.
          </p>
        </div>
        <AddRepoForm />
      </div>

      {/* Repo cards by category */}
      <div className="space-y-12">
        {sortedCategories.map((category) => (
          <section key={category}>
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Target className="h-4 w-4" />
              </span>
              {category}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[category].map((repo) => {
                const mergedPrs = (repo.recentMergedPrs || []) as MergedPr[];
                const milestones = (repo.milestones || []) as Milestone[];

                return (
                  <div
                    key={repo.id}
                    className="group flex flex-col rounded-2xl border border-border/50 bg-background/50 p-5 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`https://github.com/${repo.owner}/${repo.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-base font-bold hover:text-indigo-400 transition-colors"
                        >
                          {repo.displayName}
                          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {repo.owner}/{repo.repo}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500" />
                          {formatNumber(repo.stars || 0)}
                        </span>
                        {repo.language && (
                          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                            {repo.language}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {repo.description && (
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}

                    {/* Latest Release */}
                    {repo.latestReleaseTag && (
                      <div className="mb-3 flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-emerald-400" />
                        <Link
                          href={repo.latestReleaseUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-emerald-400 hover:underline"
                        >
                          {repo.latestReleaseTag}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(repo.latestReleaseDate)}
                        </span>
                      </div>
                    )}

                    {/* Stats Row */}
                    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CircleDot className="h-3.5 w-3.5 text-orange-400" />
                        {repo.openIssuesCount || 0} issues
                      </span>
                      <span className="flex items-center gap-1">
                        <GitPullRequest className="h-3.5 w-3.5 text-blue-400" />
                        {repo.openPrsCount || 0} open PRs
                      </span>
                    </div>

                    {/* Recent Merged PRs */}
                    {mergedPrs.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Recently Merged
                        </h4>
                        <ul className="space-y-1.5">
                          {mergedPrs.slice(0, 3).map((pr, i) => (
                            <li key={i}>
                              <Link
                                href={pr.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate text-xs text-muted-foreground hover:text-foreground transition-colors"
                                title={pr.title}
                              >
                                <span className="text-purple-400">•</span>{" "}
                                {pr.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Milestones */}
                    {milestones.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Milestones
                        </h4>
                        {milestones.slice(0, 2).map((ms, i) => {
                          const total = ms.open_issues + ms.closed_issues;
                          const progress =
                            total > 0
                              ? Math.round((ms.closed_issues / total) * 100)
                              : 0;
                          return (
                            <div key={i} className="mb-2">
                              <div className="flex items-center justify-between text-xs">
                                <Link
                                  href={ms.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium hover:text-indigo-400 transition-colors truncate"
                                >
                                  {ms.title}
                                </Link>
                                <span className="text-muted-foreground ml-2 shrink-0">
                                  {progress}%
                                </span>
                              </div>
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border/50">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-3 border-t border-border/30 flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                      <Clock className="h-3 w-3" />
                      Synced {timeAgo(repo.lastSyncedAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {repos.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground">
            No repositories tracked yet. Add one to get started!
          </p>
        </div>
      )}
    </div>
  );
}
