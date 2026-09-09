import { Newspaper, BookOpen, Bookmark, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

const statItems = [
  {
    key: "totalArticles" as const,
    label: "Total Articles",
    icon: Newspaper,
    gradient: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20",
  },
  {
    key: "unreadArticles" as const,
    label: "Unread",
    icon: BookOpen,
    gradient: "from-sky-500 to-cyan-600",
    shadow: "shadow-sky-500/20",
  },
  {
    key: "bookmarkedArticles" as const,
    label: "Bookmarked",
    icon: Bookmark,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    key: "activeSources" as const,
    label: "Active Sources",
    icon: Radio,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {statItems.map((item) => (
        <Card
          key={item.key}
          className="group relative overflow-hidden border-border/30 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-border/50 hover:shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} ${item.shadow} shadow-lg`}
            >
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stats[item.key]}
              </p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
          {/* Subtle gradient overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03]`}
          />
        </Card>
      ))}
    </div>
  );
}
