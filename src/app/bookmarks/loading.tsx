import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-9 w-44" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
