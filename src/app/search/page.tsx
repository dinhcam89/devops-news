import { searchArticles } from "@/lib/queries";
import { ArticleList } from "@/components/article-list";
import { SearchBar } from "@/components/search-bar";
import { Search as SearchIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search — DevOpsPulse",
  description: "Search through all collected DevOps and cloud native articles.",
};

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const query =
    typeof searchParams?.q === "string" ? searchParams.q.trim() : "";

  const results = query ? await searchArticles(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
            Search
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Full-text search across all articles using Postgres tsvector.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-lg">
        <SearchBar
          defaultValue={query}
          placeholder="Search for kubernetes, azure, terraform..."
          navigateOnSubmit={true}
        />
      </div>

      {/* Results */}
      {query ? (
        <>
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <SearchIcon className="h-4 w-4" />
            <span>
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
            </span>
          </div>
          <ArticleList
            articles={results}
            emptyMessage={`No results found for "${query}". Try different keywords.`}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10">
            <SearchIcon className="h-8 w-8 text-sky-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-foreground">
            Search articles
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Type a query above to search through all your collected DevOps
            articles. Try &ldquo;kubernetes&rdquo;, &ldquo;azure&rdquo;, or &ldquo;CI/CD&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
