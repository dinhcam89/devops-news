import { Suspense } from "react";
import { getLatestArticles, getCategories, getStats } from "@/lib/queries";
import { ArticleList } from "@/components/article-list";
import { CategoryTabs } from "@/components/category-tabs";
import { StatsCards } from "@/components/stats-cards";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleListSkeleton } from "@/components/article-list-skeleton";

// force-dynamic: DB queries must run at request time, not at build time
// (Supabase free tier has statement timeouts that break static prerendering)
export const dynamic = "force-dynamic";

export default async function HomePage(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const category =
    typeof searchParams?.category === "string"
      ? searchParams.category
      : undefined;

  const [categories, stats] = await Promise.all([
    getCategories(),
    getStats(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DevOps Feed
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Stay current with the latest from the cloud native ecosystem.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsCards stats={stats} />
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar />
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <CategoryTabs categories={categories} />
        </Suspense>
      </div>

      {/* Article List with Suspense for immediate navigation feedback */}
      <Suspense key={category || "all"} fallback={<ArticleListSkeleton />}>
        <FeedArticles category={category} />
      </Suspense>
    </div>
  );
}

/**
 * Extracted into a separate component so we can wrap it in Suspense.
 * This prevents Next.js from blocking the entire page render during navigation.
 */
async function FeedArticles({ category }: { category?: string }) {
  const articles = await getLatestArticles({ limit: 30, category });

  return (
    <ArticleList
      articles={articles}
      emptyMessage={
        category
          ? `No articles found in "${category}". Try a different category.`
          : "No articles yet. Run the ingestion script to fetch news!"
      }
    />
  );
}
