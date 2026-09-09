import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ============================================
// SOURCES TABLE
// ============================================
export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  url: text("url").notNull(),
  type: text("type").notNull(), // 'rss' | 'github' | 'api'
  iconUrl: text("icon_url"),
  config: jsonb("config").default({}),
  isActive: boolean("is_active").default(true),
  fetchIntervalHours: integer("fetch_interval_hours").default(6),
  lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// ARTICLES TABLE
// ============================================
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    externalId: text("external_id"),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    summary: text("summary"),
    contentSnippet: text("content_snippet"),
    author: text("author"),
    imageUrl: text("image_url"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    tags: text("tags")
      .array()
      .default(sql`'{}'`),
    category: text("category"),
    isRead: boolean("is_read").default(false),
    isBookmarked: boolean("is_bookmarked").default(false),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    // search_vector is a GENERATED column — managed by Postgres, not Drizzle
  },
  (table) => [
    index("idx_articles_published").on(table.publishedAt),
    index("idx_articles_source").on(table.sourceId),
    index("idx_articles_category").on(table.category),
  ]
);

// ============================================
// TYPE EXPORTS
// ============================================
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
