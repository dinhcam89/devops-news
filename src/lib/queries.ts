import { getDb } from "@/db";
import { articles, sources } from "@/db/schema";
import { desc, eq, sql, and, count, inArray } from "drizzle-orm";

// ============================================
// ARTICLE QUERIES
// ============================================

/**
 * Fetch the latest articles with source info, optionally filtered by category.
 */
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
      isBookmarked: articles.isBookmarked,
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

/**
 * Full-text search using Postgres tsvector with ranking.
 * Fix #8: removed duplicate ts_rank computation — rank is only in ORDER BY.
 */
export async function searchArticles(query: string, limit = 20) {
  if (!query.trim()) return [];

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
      isBookmarked: articles.isBookmarked,
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

/**
 * Get bookmarked articles.
 */
export async function getBookmarkedArticles(limit = 50) {
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
      isBookmarked: articles.isBookmarked,
      sourceName: sources.name,
      sourceSlug: sources.slug,
    })
    .from(articles)
    .innerJoin(sources, eq(articles.sourceId, sources.id))
    .where(eq(articles.isBookmarked, true))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

/**
 * Get articles from a specific source.
 */
export async function getArticlesBySource(sourceSlug: string, limit = 30) {
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
      isBookmarked: articles.isBookmarked,
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

/**
 * Get all sources with their article counts.
 * Fix #6: Use a subquery for the count instead of an expensive LEFT JOIN + GROUP BY.
 */
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

/**
 * Get all distinct categories with counts.
 */
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

/**
 * Get counts for the dashboard.
 * Fix #1: Combined 4 sequential queries into a single SQL statement.
 */
export async function getStats() {
  const db = getDb();
  const result = await db.execute<{
    total: string;
    unread: string;
    bookmarked: string;
    active_sources: string;
  }>(sql`
    SELECT
      (SELECT count(*) FROM articles)::text AS total,
      (SELECT count(*) FROM articles WHERE is_read = false)::text AS unread,
      (SELECT count(*) FROM articles WHERE is_bookmarked = true)::text AS bookmarked,
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
