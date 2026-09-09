"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORY_COLORS } from "@/types";
import type { CategoryCount } from "@/types";
import { useTransition } from "react";

interface CategoryTabsProps {
  categories: CategoryCount[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || null;
  const [isPending, startTransition] = useTransition();

  const handleNavigate = (category: string | null) => {
    if (activeCategory === category) return;
    
    startTransition(() => {
      if (category) {
        router.push(`/?category=${encodeURIComponent(category)}`);
      } else {
        router.push("/");
      }
    });
  };

  return (
    <div className={`flex flex-wrap gap-2 transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* All */}
      <button
        onClick={() => handleNavigate(null)}
        disabled={isPending}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
          !activeCategory
            ? "bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10"
            : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        All
      </button>

      {categories.map(({ category, count }) => {
        if (!category) return null;
        const isActive = activeCategory === category;
        const colors =
          CATEGORY_COLORS[category] || CATEGORY_COLORS["General DevOps"];
        const activeColors = colors.split(" ").slice(0, 2).join(" ");

        return (
          <button
            key={category}
            onClick={() => handleNavigate(category)}
            disabled={isPending}
            className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? `${activeColors} shadow-sm`
                : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {category}
            <span className="ml-1.5 text-xs opacity-60">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
