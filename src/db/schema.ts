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
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
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
// AUTHENTICATION TABLES (NextAuth / Auth.js)
// ============================================
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

// ============================================
// TOOLS TABLE
// ============================================
export const tools = pgTable("tools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., 'SRE Agent', 'AIOps'
  sdlcPhase: text("sdlc_phase").notNull(), // e.g., 'Coding', 'Monitoring'
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// SNIPPETS TABLE
// ============================================
export const snippets = pgTable("snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// MAPPING TABLES (User Data)
// ============================================
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.articleId] }),
    index("idx_bookmarks_user").on(table.userId),
  ]
);

export const toolUpvotes = pgTable(
  "tool_upvotes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    toolId: uuid("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.toolId] }),
  ]
);

// ============================================
// TRACKED REPOS TABLE (GitHub Tracker)
// ============================================
export const trackedRepos = pgTable(
  "tracked_repos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    owner: text("owner").notNull(),
    repo: text("repo").notNull(),
    displayName: text("display_name").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    stars: integer("stars").default(0),
    language: text("language"),
    latestReleaseTag: text("latest_release_tag"),
    latestReleaseDate: timestamp("latest_release_date", { withTimezone: true }),
    latestReleaseUrl: text("latest_release_url"),
    openIssuesCount: integer("open_issues_count").default(0),
    openPrsCount: integer("open_prs_count").default(0),
    recentMergedPrs: jsonb("recent_merged_prs").default([]),
    milestones: jsonb("milestones").default([]),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_tracked_repos_owner_repo").on(table.owner, table.repo),
    index("idx_tracked_repos_category").on(table.category),
  ]
);

// ============================================
// TYPE EXPORTS
// ============================================
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
export type Snippet = typeof snippets.$inferSelect;
export type NewSnippet = typeof snippets.$inferInsert;
export type TrackedRepo = typeof trackedRepos.$inferSelect;
export type NewTrackedRepo = typeof trackedRepos.$inferInsert;
