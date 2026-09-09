import { getBookmarkedArticles } from "@/lib/queries";
import { ArticleList } from "@/components/article-list";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bookmarks — DevOpsPulse",
  description: "Your saved DevOps articles for later reading.",
};

export default async function BookmarksPage() {
  const articles = await getBookmarkedArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <Bookmark className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Bookmarks
            </span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length !== 1 ? "s" : ""} saved for
          later.
        </p>
      </div>

      {/* Article List */}
      <ArticleList
        articles={articles}
        emptyMessage="No bookmarked articles yet. Click the bookmark icon on any article to save it here."
      />
    </div>
  );
}
