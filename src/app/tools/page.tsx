import { Suspense } from "react"
import { getTools } from "@/lib/queries"
import { ToolCard } from "@/components/tool-card"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

export default async function ToolsPage({ searchParams }: { searchParams: { phase?: string; category?: string } }) {
  const phase = searchParams?.phase
  const category = searchParams?.category

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">AI DevOps Tools</h1>
        <p className="text-sm text-muted-foreground">
          Discover and track the latest AI-powered tools for the Software Development Life Cycle.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {/* Simple mock tabs for phase filtering - in a real app these would be actual links/buttons updating URL params */}
        <a href="/tools" className={`px-3 py-1 text-sm border rounded-full ${!phase ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>All</a>
        <a href="/tools?phase=Coding" className={`px-3 py-1 text-sm border rounded-full ${phase === 'Coding' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Coding</a>
        <a href="/tools?phase=Testing" className={`px-3 py-1 text-sm border rounded-full ${phase === 'Testing' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Testing</a>
        <a href="/tools?phase=Monitoring" className={`px-3 py-1 text-sm border rounded-full ${phase === 'Monitoring' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Monitoring</a>
      </div>

      <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>}>
        <ToolList phase={phase} category={category} />
      </Suspense>
    </div>
  )
}

async function ToolList({ phase, category }: { phase?: string; category?: string }) {
  const tools = await getTools({ phase, category })

  if (tools.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg bg-muted/20">
        <h3 className="text-lg font-semibold mb-2">No tools found</h3>
        <p className="text-muted-foreground">We haven't added any AI tools in this category yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          id={tool.id}
          name={tool.name}
          description={tool.description}
          url={tool.url}
          category={tool.category}
          sdlcPhase={tool.sdlcPhase}
          upvotes={tool.upvotes || 0}
          isUpvoted={tool.isUpvoted}
        />
      ))}
    </div>
  )
}
