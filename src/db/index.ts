import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get the database instance (lazy-initialized singleton).
 * Reads DATABASE_URL only on first call, not at import time.
 */
export function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Please check your .env.local file."
      );
    }
    const client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}
