import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getDb } from "./src/db/index";
import { sql } from "drizzle-orm";

async function main() {
  const db = getDb();
  
  const explain = await db.execute(sql`
    EXPLAIN ANALYZE
    SELECT "articles"."id", "articles"."title" 
    FROM "articles" 
    INNER JOIN "sources" ON "articles"."source_id" = "sources"."id" 
    WHERE "articles"."category" = 'General DevOps' 
    ORDER BY "articles"."published_at" DESC 
    LIMIT 30 OFFSET 0
  `);

  console.log("EXPLAIN ANALYZE Result:");
  explain.forEach((row: any) => {
    console.log(row["QUERY PLAN"]);
  });
  
  process.exit(0);
}

main().catch(console.error);
