import { getDb } from "@/db";
import { articles, sources, tools, snippets, bookmarks, toolUpvotes, trackedRepos } from "@/db/schema";
import { desc, eq, sql, and, count, inArray } from "drizzle-orm";
import { auth } from "@/auth";

async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}

function getIsBookmarkedSql(userId?: string) {
  if (!userId) return sql<boolean>`false`.as("isBookmarked");
  return sql<boolean>`EXISTS(SELECT 1 FROM bookmarks WHERE bookmarks.article_id = articles.id AND bookmarks.user_id = ${userId})`.as("isBookmarked");
}

function getIsUpvotedSql(userId?: string) {
  if (!userId) return sql<boolean>`false`.as("isUpvoted");
  return sql<boolean>`EXISTS(SELECT 1 FROM tool_upvotes WHERE tool_upvotes.tool_id = tools.id AND tool_upvotes.user_id = ${userId})`.as("isUpvoted");
}

// ============================================
// ARTICLE QUERIES
// ============================================

export async function getLatestArticles({
  limit = 20,
  offset = 0,
  category,
}: {
  limit?: number;
  offset?: number;
  category?: string;
} = {}) {
  const db = getDb();
  const userId = await getUserId();
  const conditions = category
    ? and(eq(articles.category, category))
    : undefined;

  return db
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      summary: articles.summary,
      author: articles.author,
      imageUrl: articles.imageUrl,
      publishedAt: articles.publishedAt,
      tags: articles.tags,
      category: articles.category,
      isRead: articles.isRead,
      isBookmarked: getIsBookmarkedSql(userId),
      sourceName: sources.name,
      sourceSlug: sources.slug,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(conditions)
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function searchArticles(query: string, limit = 20) {
  if (!query.trim()) return [];

  const db = getDb();
  const userId = await getUserId();
  return db
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      summary: articles.summary,
      author: articles.author,
      imageUrl: articles.imageUrl,
      publishedAt: articles.publishedAt,
      tags: articles.tags,
      category: articles.category,
      isRead: articles.isRead,
      isBookmarked: getIsBookmarkedSql(userId),
      sourceName: sources.name,
      sourceSlug: sources.slug,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(
      sql`search_vector @@ plainto_tsquery('english', ${query})`
    )
    .orderBy(
      sql`ts_rank(search_vector, plainto_tsquery('english', ${query})) DESC`
    )
    .limit(limit);
}

export async function getBookmarkedArticles(limit = 50) {
  const userId = await getUserId();
  if (!userId) return [];

  const db = getDb();
  return db
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      summary: articles.summary,
      author: articles.author,
      imageUrl: articles.imageUrl,
      publishedAt: articles.publishedAt,
      tags: articles.tags,
      category: articles.category,
      isRead: articles.isRead,
      isBookmarked: sql<boolean>`true`.as("isBookmarked"),
      sourceName: sources.name,
      sourceSlug: sources.slug,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .innerJoin(bookmarks, eq(bookmarks.articleId, articles.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit);
}

export async function getArticlesBySource(sourceSlug: string, limit = 30) {
  const db = getDb();
  const userId = await getUserId();
  return db
    .select({
      id: articles.id,
      title: articles.title,
      url: articles.url,
      summary: articles.summary,
      author: articles.author,
      imageUrl: articles.imageUrl,
      publishedAt: articles.publishedAt,
      tags: articles.tags,
      category: articles.category,
      isRead: articles.isRead,
      isBookmarked: getIsBookmarkedSql(userId),
      sourceName: sources.name,
      sourceSlug: sources.slug,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(eq(sources.slug, sourceSlug))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

// ============================================
// SOURCE QUERIES
// ============================================

export async function getSources() {
  const db = getDb();
  return db
    .select({
      id: sources.id,
      name: sources.name,
      slug: sources.slug,
      url: sources.url,
      type: sources.type,
      iconUrl: sources.iconUrl,
      isActive: sources.isActive,
      lastFetchedAt: sources.lastFetchedAt,
      lastError: sources.lastError,
      articleCount:
        sql<number>`(SELECT count(*) FROM articles WHERE source_id = ${sources.id})`.as(
          "article_count"
        ),
    })
    .from(sources)
    .orderBy(sources.name);
}

export async function getCategories() {
  const db = getDb();
  return db
    .select({
      category: articles.category,
      count: count(articles.id),
    })
    .from(articles)
    .groupBy(articles.category)
    .orderBy(desc(count(articles.id)));
}

export async function getStats() {
  const db = getDb();
  const userId = await getUserId();
  const bookmarkedQuery = userId 
    ? sql`(SELECT count(*) FROM bookmarks WHERE user_id = ${userId})::text` 
    : sql`'0'::text`;

  const result = await db.execute<{
    total: string;
    unread: string;
    bookmarked: string;
    active_sources: string;
  }>(sql`
    SELECT
      (SELECT count(*) FROM articles)::text AS total,
      (SELECT count(*) FROM articles WHERE is_read = false)::text AS unread,
      ${bookmarkedQuery} AS bookmarked,
      (SELECT count(*) FROM sources WHERE is_active = true)::text AS active_sources
  `);

  const row = result[0];
  return {
    totalArticles: Number(row.total),
    unreadArticles: Number(row.unread),
    bookmarkedArticles: Number(row.bookmarked),
    activeSources: Number(row.active_sources),
  };
}

// ============================================
// TOOL QUERIES
// ============================================

export async function getTools({ category, phase }: { category?: string; phase?: string } = {}) {
  const db = getDb();
  const userId = await getUserId();
  
  const conditions = and(
    category ? eq(tools.category, category) : undefined,
    phase ? eq(tools.sdlcPhase, phase) : undefined
  );

  return db
    .select({
      id: tools.id,
      name: tools.name,
      url: tools.url,
      description: tools.description,
      category: tools.category,
      sdlcPhase: tools.sdlcPhase,
      upvotes: tools.upvotes,
      isUpvoted: getIsUpvotedSql(userId),
    })
    .from(tools)
    .where(conditions)
    .orderBy(desc(tools.upvotes));
}

// ============================================
// SNIPPET QUERIES
// ============================================

export async function getRandomSnippet() {
  const db = getDb();
  const result = await db.execute<{
    id: string;
    title: string;
    content: string;
    author: string | null;
  }>(sql`SELECT id, title, content, author FROM snippets ORDER BY random() LIMIT 1`);
  
  if (result.length === 0) return null;
  return result[0];
}

// ============================================
// TRACKED REPO QUERIES
// ============================================

export async function getTrackedRepos() {
  const db = getDb();
  return db
    .select()
    .from(trackedRepos)
    .orderBy(trackedRepos.category, desc(trackedRepos.stars));
}
