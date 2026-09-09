import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getDb } from "./src/db/index";
import { articles, sources } from "./src/db/schema";
import { desc, eq, and } from "drizzle-orm";

async function main() {
  const db = getDb();
  const category = "General DevOps";
  
  console.time("Query execution time");
  
  const conditions = category
    ? and(eq(articles.category, category))
    : undefined;

  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(conditions)
    .orderBy(desc(articles.publishedAt))
    .limit(30)
    .offset(0);

  console.timeEnd("Query execution time");
  console.log(`Found ${result.length} articles.`);
  
  process.exit(0);
}

main().catch(console.error);
