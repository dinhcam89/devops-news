import { Skeleton } from "@/components/ui/skeleton";

export default function SourcesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[160px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
