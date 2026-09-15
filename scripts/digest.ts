import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getDb } from "../src/db"
import { articles, tools } from "../src/db/schema"
import { desc, gte } from "drizzle-orm"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

async function main() {
  console.log("🚀 Starting Weekly Digest Generation...")
  const db = getDb()

  // Get articles from the last 7 days
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const recentArticles = await db.select()
    .from(articles)
    .where(gte(articles.publishedAt, oneWeekAgo))
    .orderBy(desc(articles.publishedAt))
    .limit(20)

  const recentTools = await db.select()
    .from(tools)
    .where(gte(tools.createdAt, oneWeekAgo))
    .orderBy(desc(tools.createdAt))
    .limit(5)

  if (recentArticles.length === 0 && recentTools.length === 0) {
    console.log("No new content this week.")
    return
  }

  const articlesContext = recentArticles.map(a => `- ${a.title}: ${a.summary}`).join("\n")
  const toolsContext = recentTools.map(t => `- ${t.name}: ${t.description}`).join("\n")

  const prompt = `
You are an expert DevOps engineer and technical writer. 
Generate a "Weekly DevOps & AI Digest" newsletter.

Recent Articles:
${articlesContext}

New AI Tools added:
${toolsContext}

Format the output as a clean, engaging Markdown email with:
1. A catchy title and short intro.
2. "Top Stories" (pick the 3 most impactful articles and summarize them).
3. "AI Tools Spotlight" (highlight the new tools).
4. A brief closing thought.
`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    
    console.log("\n================ DIGEST ================\n")
    console.log(response.text())
    console.log("\n========================================\n")
    
    // In a real scenario, we would use an email API (like Resend) 
    // or a webhook (Discord/Slack) to send this text.
    console.log("✅ Digest generated successfully. (Sending logic can be implemented here)")
  } catch (error) {
    console.error("Failed to generate digest:", error)
  }
}

main().catch(console.error).finally(() => process.exit(0))
