"use server";

import { getDb } from "@/db";
import { articles, sources } from "@/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Toggle the bookmark status of an article.
 * Fix #2: Single atomic UPDATE using SQL NOT instead of SELECT + UPDATE.
 */
export async function toggleBookmark(articleId: string) {
  const db = getDb();
  const [result] = await db
    .update(articles)
    .set({ isBookmarked: sql`NOT is_bookmarked` })
    .where(eq(articles.id, articleId))
    .returning({ isBookmarked: articles.isBookmarked });

  if (!result) {
    throw new Error("Article not found");
  }

  revalidatePath("/");
  revalidatePath("/bookmarks");

  return { isBookmarked: result.isBookmarked };
}

/**
 * Mark an article as read.
 */
export async function markAsRead(articleId: string) {
  const db = getDb();
  await db
    .update(articles)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(articles.id, articleId));

  revalidatePath("/");
}

/**
 * Mark all articles as read, optionally filtered by source.
 * Fix #3: Replaced raw SQL string interpolation with Drizzle query builder
 * to eliminate SQL injection vulnerability.
 */
export async function markAllAsRead(sourceSlug?: string) {
  const db = getDb();
  if (sourceSlug) {
    // Use a type-safe subquery instead of string interpolation
    const sourceIds = db
      .select({ id: sources.id })
      .from(sources)
      .where(eq(sources.slug, sourceSlug));

    await db
      .update(articles)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(articles.isRead, false),
          inArray(articles.sourceId, sourceIds)
        )
      );
  } else {
    await db
      .update(articles)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(articles.isRead, false));
  }

  revalidatePath("/");
}
