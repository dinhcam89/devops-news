import { ArticleCard } from "@/components/article-card";
import type { ArticleView } from "@/types";
import { Inbox } from "lucide-react";

interface ArticleListProps {
  articles: ArticleView[];
  emptyMessage?: string;
}

export function ArticleList({
  articles,
  emptyMessage = "No articles found.",
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/50">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-foreground">
          Nothing here yet
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
