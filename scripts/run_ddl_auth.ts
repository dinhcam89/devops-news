import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import postgres from "postgres"

async function runDDL() {
  const sql = postgres(process.env.DATABASE_URL!)

  try {
    // 1. Create account table
    await sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "type" text NOT NULL,
        "provider" text NOT NULL,
        "providerAccountId" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "token_type" text,
        "scope" text,
        "id_token" text,
        "session_state" text,
        PRIMARY KEY ("provider", "providerAccountId")
      );
    `
    console.log("✅ Created account table")

    // 2. Create session table
    await sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sessionToken" text PRIMARY KEY,
        "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "expires" timestamp NOT NULL
      );
    `
    console.log("✅ Created session table")

    // 3. Create verificationToken table
    await sql`
      CREATE TABLE IF NOT EXISTS "verificationToken" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        PRIMARY KEY ("identifier", "token")
      );
    `
    console.log("✅ Created verificationToken table")

    console.log("✅ Auth tables created successfully.")
  } catch (error) {
    console.error("DDL error:", error)
  } finally {
    await sql.end()
  }
}

runDDL()
