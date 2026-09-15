"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ExternalLinkIcon } from "lucide-react"
import { useTransition } from "react"
import { toggleToolUpvote } from "@/lib/actions"
import type { ToolView } from "@/types"

export function ToolCard({ id, name, description, url, category, sdlcPhase, upvotes, isUpvoted }: ToolView) {
  const [isPending, startTransition] = useTransition();

  function handleUpvote() {
    startTransition(async () => {
      try {
        await toggleToolUpvote(id);
      } catch (error: any) {
        if (error.message.includes("Unauthorized")) {
          alert("Please sign in to upvote tools.");
        } else {
          console.error("Failed to upvote", error);
        }
      }
    });
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">
            <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
              {name}
              <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
            </a>
          </CardTitle>
          <button 
            onClick={handleUpvote}
            disabled={isPending}
            className={`flex items-center gap-1 text-sm border rounded-md px-2 py-1 transition-colors ${
              isUpvoted 
                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/30 hover:bg-indigo-500/20" 
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            <ArrowUpIcon className="h-4 w-4" />
            {/* Note: since upvotes are currently denormalized and we don't update them in the toggle action, 
                we might just show the raw number, or increment/decrement locally. 
                For now we just show it. + (isUpvoted ? 1 : 0) could be a hack, but let's stick to simple display. */}
            <span>{upvotes}</span>
          </button>
        </div>
        <CardDescription className="line-clamp-2 mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary">{category}</Badge>
          <Badge variant="outline">{sdlcPhase}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
