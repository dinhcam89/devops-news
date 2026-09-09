import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <Skeleton className="mb-2 h-9 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="mb-8 max-w-lg">
        <Skeleton className="h-11 rounded-xl" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
