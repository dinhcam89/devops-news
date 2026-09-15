import { Metadata } from "next";
import {
  Server,
  Database,
  Code,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About — DevOpsPulse",
  description: "Learn about the DevOpsPulse project, architecture, and features.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          About{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DevOpsPulse
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          An automated news aggregator designed to keep engineers up to date with the rapidly evolving Cloud Native and DevOps ecosystem.
        </p>
      </div>

      <div className="space-y-12">
        {/* The Project Section */}
        <section>
          <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold">The Project</h2>
          </div>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="mb-4 leading-relaxed">
              Keeping up with the Cloud Native ecosystem is exhausting. With dozens of projects, blogs, and release notes updating daily, it's easy to miss critical updates. DevOpsPulse solves this by automatically crawling the most important sources in the industry and aggregating them into a single, clean dashboard.
            </p>
            <p className="leading-relaxed">
              Originally built as a personal learning project and daily digest tool, it is designed to be fully automated, heavily optimized, and capable of running indefinitely on zero-cost infrastructure tiers.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section>
          <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold">Key Features</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Automated data ingestion via GitHub Actions cron jobs.",
              "Smart rule-based tagging and categorization.",
              "PostgreSQL Full-Text Search (tsvector) for instant results.",
              "Read / Unread tracking with one-click 'Mark All As Read'.",
              "Personal bookmarks for saving important articles.",
              "Aggregated dashboard with source health monitoring.",
              "Responsive, dark-mode first UI using glassmorphism.",
              "Optimized batch database inserts for lightning-fast scraping.",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                <p className="text-sm text-card-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section>
          <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold">Technologies Used</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Frontend */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-400" />
                <h3 className="font-medium text-foreground">Frontend</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Next.js 14 (App Router)</li>
                <li>React Server Components</li>
                <li>Tailwind CSS</li>
                <li>shadcn/ui & Lucide Icons</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-purple-400" />
                <h3 className="font-medium text-foreground">Backend</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Next.js Server Actions</li>
                <li>Node.js Ingestion Script</li>
                <li>rss-parser</li>
                <li>Octokit (GitHub API)</li>
              </ul>
            </div>

            {/* Database & Infra */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                <h3 className="font-medium text-foreground">Infrastructure</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Supabase (PostgreSQL)</li>
                <li>Drizzle ORM</li>
                <li>Vercel Edge Network</li>
                <li>GitHub Actions (Cron)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Open Source / Footer */}
        <section className="mt-12 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-8 text-center">
          <svg viewBox="0 0 24 24" className="mx-auto mb-4 h-8 w-8 text-indigo-400" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <h2 className="mb-2 text-xl font-semibold">Open Source</h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground">
            The entire codebase is open source and designed to be easily deployable on free-tier infrastructure.
          </p>
          <a
            href="https://github.com/dinhcam89/devops-news"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </section>
      </div>
    </div>
  );
}
