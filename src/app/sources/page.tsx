import { getSources } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Newspaper,
} from "lucide-react";
import { SOURCE_COLORS } from "@/types";
import { getTimeAgo } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sources — DevOpsPulse",
  description: "Manage and view all news sources feeding your DevOps dashboard.",
};

export default async function SourcesPage() {
  const sourcesData = await getSources();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Sources
            </span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {sourcesData.length} data sources powering your news feed.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sourcesData.map((source) => {
          const sourceColor =
            SOURCE_COLORS[source.slug] || "bg-zinc-500/15 text-zinc-400";
          const lastFetched = source.lastFetchedAt
            ? getTimeAgo(new Date(source.lastFetchedAt))
            : "Never";

          return (
            <Card
              key={source.id}
              className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg"
            >
              <div className="p-5">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className={`${sourceColor} border-0 text-xs font-medium`}
                    >
                      {source.type.toUpperCase()}
                    </Badge>
                    <h3 className="text-base font-semibold text-foreground">
                      {source.name}
                    </h3>
                  </div>
                  {source.isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                </div>

                {/* Stats Row */}
                <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Newspaper className="h-3 w-3" />
                    {source.articleCount} articles
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last fetched: {lastFetched}
                  </span>
                </div>

                {/* Error */}
                {source.lastError && (
                  <p className="mb-3 rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                    ⚠️ {source.lastError}
                  </p>
                )}

                {/* Link */}
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-indigo-400"
                >
                  <ExternalLink className="h-3 w-3" />
                  {source.url}
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

