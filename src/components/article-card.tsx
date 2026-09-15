"use client";

import { ExternalLink, Bookmark, BookmarkCheck, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toggleBookmark, markAsRead } from "@/lib/actions";
import { CATEGORY_COLORS, SOURCE_COLORS } from "@/types";
import type { ArticleView } from "@/types";
import { getTimeAgo } from "@/lib/utils";
import { useTransition } from "react";

interface ArticleCardProps {
  article: ArticleView;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isPending, startTransition] = useTransition();

  const timeAgo = article.publishedAt
    ? getTimeAgo(new Date(article.publishedAt))
    : "Unknown";

  const categoryColor =
    CATEGORY_COLORS[article.category || "General DevOps"] ||
    CATEGORY_COLORS["General DevOps"];

  const sourceColor =
    SOURCE_COLORS[article.sourceSlug] || "bg-zinc-500/15 text-zinc-400";

  function handleBookmark() {
    startTransition(async () => {
      try {
        await toggleBookmark(article.id);
      } catch (error: any) {
        if (error.message.includes("Unauthorized")) {
          alert("Please sign in to bookmark articles.");
        } else {
          console.error("Failed to bookmark", error);
        }
      }
    });
  }

  function handleClick() {
    if (!article.isRead) {
      startTransition(() => {
        markAsRead(article.id);
      });
    }
  }

  return (
    <Card
      className={`group relative overflow-hidden border-border/50 bg-card transition-colors duration-300 hover:border-indigo-500/30 hover:bg-accent/5 hover:shadow-md hover:shadow-indigo-500/5 ${
        article.isRead ? "opacity-60" : ""
      }`}
    >
      <div className="p-5">
        {/* Top Row: Source + Category + Time */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`${sourceColor} border-0 text-xs font-medium`}
          >
            {article.sourceName}
          </Badge>
          {article.category && (
            <Badge
              variant="outline"
              className={`${categoryColor} text-xs font-medium`}
            >
              {article.category}
            </Badge>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        </div>

        {/* Title */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="group/link mb-2 flex items-start gap-2"
        >
          <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover/link:text-indigo-400">
            {article.title}
          </h3>
          <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/link:opacity-100" />
        </a>

        {/* Summary */}
        {article.summary && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
        )}

        {/* Bottom Row: Tags + Author + Bookmark */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tags */}
          {article.tags &&
            article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent/50 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}

          <div className="ml-auto flex items-center gap-2">
            {/* Author */}
            {article.author && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {article.author}
              </span>
            )}

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-indigo-400"
              onClick={handleBookmark}
              disabled={isPending}
              title={article.isBookmarked ? "Remove bookmark" : "Bookmark"}
              aria-label={
                article.isBookmarked
                  ? "Remove bookmark"
                  : "Bookmark article"
              }
            >
              {article.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-indigo-400" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Accent line on hover */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-hover:w-full" />
    </Card>
  );
}

