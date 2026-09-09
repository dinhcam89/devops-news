import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-9 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats skeleton */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[76px] rounded-xl" />
        ))}
      </div>

      {/* Search skeleton */}
      <div className="mb-6 max-w-md">
        <Skeleton className="h-11 rounded-xl" />
      </div>

      {/* Category tabs skeleton */}
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Article cards skeleton */}
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
