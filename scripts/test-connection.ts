import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import postgres from "postgres";

const url = process.env.DATABASE_URL!;
console.log("Attempting connection to:", url.replace(/:[^:@]+@/, ":****@"));

const sql = postgres(url, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 5,
});

async function test() {
  try {
    const result = await sql`SELECT version()`;
    console.log("✅ Connected successfully!");
    console.log("PostgreSQL version:", result[0].version);

    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log("\n📋 Tables found:", tables.map((t: any) => t.table_name));
  } catch (err: any) {
    console.error("❌ Connection failed:", err.message);
    if (err.code) console.error("   Error code:", err.code);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

test();
