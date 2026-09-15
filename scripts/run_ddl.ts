import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import postgres from "postgres"

async function runDDL() {
  const sql = postgres(process.env.DATABASE_URL!)

  try {
    // 1. Remove global is_bookmarked from articles
    await sql`ALTER TABLE "articles" DROP COLUMN IF EXISTS "is_bookmarked";`
    console.log("✅ Removed global is_bookmarked")

    // 2. Create Auth.js users table (minimal for this)
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY,
        "name" text,
        "email" text UNIQUE,
        "emailVerified" timestamp,
        "image" text
      );
    `
    console.log("✅ Created user table")

    // 3. Create mapping tables
    await sql`
      CREATE TABLE IF NOT EXISTS "bookmarks" (
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "article_id" uuid NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE,
        "created_at" timestamp with time zone DEFAULT now(),
        PRIMARY KEY ("user_id", "article_id")
      );
    `
    console.log("✅ Created bookmarks table")

    await sql`
      CREATE TABLE IF NOT EXISTS "tool_upvotes" (
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "tool_id" uuid NOT NULL REFERENCES "tools"("id") ON DELETE CASCADE,
        "created_at" timestamp with time zone DEFAULT now(),
        PRIMARY KEY ("user_id", "tool_id")
      );
    `
    console.log("✅ Created tool_upvotes table")

    console.log("✅ DDL executed successfully.")
  } catch (error) {
    console.error("DDL error:", error)
  } finally {
    await sql.end()
  }
}

runDDL()
