import { Skeleton } from "@/components/ui/skeleton";

export function ArticleListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[140px] rounded-xl" />
      ))}
    </div>
  );
}
