import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import postgres from "postgres"

const DEFAULT_REPOS = [
  { owner: "kubernetes", repo: "kubernetes", display_name: "Kubernetes", category: "Orchestration" },
  { owner: "Azure", repo: "AKS", display_name: "Azure AKS", category: "Cloud / Azure" },
  { owner: "aws", repo: "eks-anywhere", display_name: "AWS EKS Anywhere", category: "Cloud / AWS" },
  { owner: "actions", repo: "runner", display_name: "GitHub Actions Runner", category: "CI/CD" },
  { owner: "hashicorp", repo: "terraform", display_name: "Terraform", category: "IaC" },
  { owner: "docker", repo: "cli", display_name: "Docker CLI", category: "Containers" },
  { owner: "prometheus", repo: "prometheus", display_name: "Prometheus", category: "Observability" },
  { owner: "grafana", repo: "grafana", display_name: "Grafana", category: "Observability" },
  { owner: "argoproj", repo: "argo-cd", display_name: "Argo CD", category: "CI/CD / GitOps" },
  { owner: "helm", repo: "helm", display_name: "Helm", category: "Package Management" },
  { owner: "open-telemetry", repo: "opentelemetry-collector", display_name: "OpenTelemetry Collector", category: "Observability" },
  { owner: "cilium", repo: "cilium", display_name: "Cilium", category: "Networking / Security" },
]

async function runDDL() {
  const sql = postgres(process.env.DATABASE_URL!)

  try {
    // 1. Create tracked_repos table
    await sql`
      CREATE TABLE IF NOT EXISTS "tracked_repos" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "owner" text NOT NULL,
        "repo" text NOT NULL,
        "display_name" text NOT NULL,
        "description" text,
        "category" text NOT NULL,
        "stars" integer DEFAULT 0,
        "language" text,
        "latest_release_tag" text,
        "latest_release_date" timestamp with time zone,
        "latest_release_url" text,
        "open_issues_count" integer DEFAULT 0,
        "open_prs_count" integer DEFAULT 0,
        "recent_merged_prs" jsonb DEFAULT '[]',
        "milestones" jsonb DEFAULT '[]',
        "last_synced_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now()
      );
    `
    console.log("✅ Created tracked_repos table")

    // 2. Create unique index
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_tracked_repos_owner_repo"
        ON "tracked_repos" ("owner", "repo");
    `
    console.log("✅ Created unique index on (owner, repo)")

    // 3. Create category index
    await sql`
      CREATE INDEX IF NOT EXISTS "idx_tracked_repos_category"
        ON "tracked_repos" ("category");
    `
    console.log("✅ Created category index")

    // 4. Seed default repos
    for (const r of DEFAULT_REPOS) {
      await sql`
        INSERT INTO "tracked_repos" ("owner", "repo", "display_name", "category")
        VALUES (${r.owner}, ${r.repo}, ${r.display_name}, ${r.category})
        ON CONFLICT ("owner", "repo") DO NOTHING;
      `
    }
    console.log(`✅ Seeded ${DEFAULT_REPOS.length} default tracked repos`)

    console.log("✅ All done.")
  } catch (error) {
    console.error("DDL error:", error)
  } finally {
    await sql.end()
  }
}

runDDL()
