import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { getDb } from "../src/db"
import { tools, snippets } from "../src/db/schema"

async function seed() {
  console.log("🌱 Seeding dummy data...")
  const db = getDb()

  try {
    // Seed Tools
    await db.insert(tools).values([
      {
        name: "K8sGpt",
        url: "https://k8sgpt.ai/",
        description: "A tool for scanning your Kubernetes clusters, diagnosing, and triaging issues in simple English using AI.",
        category: "SRE Agent",
        sdlcPhase: "Monitoring",
        upvotes: 45,
      },
      {
        name: "CodiumAI",
        url: "https://www.codium.ai/",
        description: "AI-powered test generation and code analysis to catch bugs before you deploy.",
        category: "Testing Agent",
        sdlcPhase: "Testing",
        upvotes: 120,
      },
      {
        name: "Pulumi AI",
        url: "https://www.pulumi.com/ai/",
        description: "Generate Infrastructure as Code using natural language prompts.",
        category: "IaC Generator",
        sdlcPhase: "Planning",
        upvotes: 89,
      }
    ])
    console.log("✅ Seeded AI Tools")

    // Seed Snippets (Tip of the Day)
    await db.insert(snippets).values([
      {
        title: "Terraform State Locking",
        content: "Always use state locking (e.g., DynamoDB with S3 backend) when working in a team to prevent concurrent modifications that could corrupt your infrastructure state.",
        author: "Platform Team"
      },
      {
        title: "Docker Layer Caching",
        content: "Order your Dockerfile instructions from least likely to change to most likely to change. Copying package.json before your source code allows Docker to cache the 'npm install' step.",
        author: "DevOps Best Practices"
      }
    ])
    console.log("✅ Seeded Tips of the Day")

    console.log("🎉 Seeding complete!")
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

seed().catch(console.error).finally(() => process.exit(0))
