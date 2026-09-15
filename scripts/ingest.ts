/**
 * Main ingestion script.
 *
 * Fetches articles from all active sources, deduplicates by URL,
 * generates rule-based summaries and tags, then upserts to Supabase.
 *
 * Run with: npm run ingest
 * Designed to run inside GitHub Actions (cron every 6h).
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getDb } from "../src/db";
import { sources, articles, trackedRepos } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { fetchRSSFeed } from "./sources/rss";
import { fetchGitHubReleases } from "./sources/github-releases";
import { fetchRepoTrackerData } from "./sources/github-tracker";
import { generateSummary, extractTags, categorize } from "./summarizer";
import type { RawArticle, IngestionReport } from "./sources/types";
import type { NewArticle } from "../src/db/schema";

async function main(): Promise<void> {
  console.log("🚀 Starting ingestion...");
  console.log(`📅 ${new Date().toISOString()}`);
  const startTime = Date.now();

  const db = getDb();

  const report: IngestionReport = {
    totalSources: 0,
    successfulSources: 0,
    failedSources: 0,
    totalArticles: 0,
    newArticles: 0,
    duplicatesSkipped: 0,
    errors: [],
    durationMs: 0,
  };

  // 1. Get all active sources
  const activeSources = await db
    .select()
    .from(sources)
    .where(eq(sources.isActive, true));

  report.totalSources = activeSources.length;
  console.log(`📡 Found ${activeSources.length} active sources\n`);

  // 2. Fetch from all sources in parallel
  const fetchResults = await Promise.allSettled(
    activeSources.map(async (source) => {
      const config = source.config as Record<string, string>;
      let rawArticles: RawArticle[] = [];

      try {
        if (source.type === "rss" && config.feedUrl) {
          rawArticles = await fetchRSSFeed(source.id, config.feedUrl);
        } else if (source.type === "github" && config.owner && config.repo) {
          rawArticles = await fetchGitHubReleases(
            source.id,
            config.owner,
            config.repo
          );
        } else {
          console.warn(
            `⚠️  ${source.name}: Unknown type "${source.type}" or missing config`
          );
          return { sourceName: source.name, articles: [] };
        }

        // Update last_fetched_at on success
        await db
          .update(sources)
          .set({ lastFetchedAt: new Date(), lastError: null })
          .where(eq(sources.id, source.id));

        return { sourceName: source.name, articles: rawArticles };
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error";

        // Record error in sources table
        await db
          .update(sources)
          .set({ lastError: errorMsg })
          .where(eq(sources.id, source.id));

        throw new Error(`${source.name}: ${errorMsg}`);
      }
    })
  );

  // 3. Process results
  for (const result of fetchResults) {
    if (result.status === "rejected") {
      report.failedSources++;
      const errorMsg = result.reason?.message || "Unknown error";
      report.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
      continue;
    }

    report.successfulSources++;
    const { sourceName, articles: rawArticles } = result.value;
    console.log(`📰 ${sourceName}: ${rawArticles.length} articles fetched`);
    report.totalArticles += rawArticles.length;

    // 4. Batch process articles per source (Fix #4: eliminates N+1 inserts)
    const batch: NewArticle[] = [];
    for (const raw of rawArticles) {
      if (!raw.url || raw.url.trim().length === 0) continue;

      try {
        const tags = extractTags(raw.title, raw.content || "");
        const category = categorize(tags);
        const summary = await generateSummary(raw.title, raw.content || "");

        batch.push({
          sourceId: raw.sourceId,
          externalId: raw.externalId,
          title: raw.title,
          url: raw.url,
          summary,
          contentSnippet: (raw.content || "").replace(/<[^>]*>/g, "").slice(0, 500),
          author: raw.author || null,
          imageUrl: raw.imageUrl || null,
          publishedAt: raw.publishedAt || new Date(),
          tags,
          category,
        });
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error";
        console.error(
          `  ⚠️  Error preparing "${raw.title.slice(0, 50)}...": ${errorMsg}`
        );
        report.errors.push(`Prepare: ${raw.title.slice(0, 50)} - ${errorMsg}`);
      }
    }

    // Insert entire batch for this source in one query
    if (batch.length > 0) {
      try {
        const inserted = await db
          .insert(articles)
          .values(batch)
          .onConflictDoNothing({ target: articles.url })
          .returning({ id: articles.id });

        report.newArticles += inserted.length;
        report.duplicatesSkipped += batch.length - inserted.length;
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error";
        console.error(`  ⚠️  Batch insert failed for ${sourceName}: ${errorMsg}`);
        report.errors.push(`Batch: ${sourceName} - ${errorMsg}`);
      }
    }
  }

  // 5. Print report
  report.durationMs = Date.now() - startTime;
  console.log("\n" + "=".repeat(50));
  console.log("📊 INGESTION REPORT");
  console.log("=".repeat(50));
  console.log(
    `Sources:     ${report.successfulSources}/${report.totalSources} succeeded, ${report.failedSources} failed`
  );
  console.log(
    `Articles:    ${report.totalArticles} fetched, ${report.newArticles} new, ${report.duplicatesSkipped} duplicates`
  );
  console.log(
    `Duration:    ${(report.durationMs / 1000).toFixed(1)}s`
  );
  if (report.errors.length > 0) {
    console.log(`\n⚠️  ${report.errors.length} errors:`);
    report.errors.forEach((e) => console.log(`   - ${e}`));
  }
  console.log("=".repeat(50));

  // 6. Sync tracked repos
  await syncTrackedRepos(db);
}

async function syncTrackedRepos(db: ReturnType<typeof getDb>) {
  console.log("\n🔍 Syncing tracked repositories...");
  const repos = await db.select().from(trackedRepos);
  console.log(`   Found ${repos.length} tracked repos`);

  let synced = 0;
  let failed = 0;

  for (const tracked of repos) {
    try {
      const data = await fetchRepoTrackerData(tracked.owner, tracked.repo);
      await db
        .update(trackedRepos)
        .set({
          description: data.description,
          stars: data.stars,
          language: data.language,
          openIssuesCount: data.openIssuesCount,
          openPrsCount: data.openPrsCount,
          latestReleaseTag: data.latestReleaseTag,
          latestReleaseDate: data.latestReleaseDate,
          latestReleaseUrl: data.latestReleaseUrl,
          recentMergedPrs: data.recentMergedPrs,
          milestones: data.milestones,
          lastSyncedAt: new Date(),
        })
        .where(eq(trackedRepos.id, tracked.id));
      synced++;
      console.log(`   ✅ ${tracked.owner}/${tracked.repo}`);
    } catch (err: unknown) {
      failed++;
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error(`   ❌ ${tracked.owner}/${tracked.repo}: ${msg}`);
    }
  }

  console.log(`\n🔍 Tracker sync: ${synced} synced, ${failed} failed`);
}

main()
  .catch((err) => {
    console.error("💥 Fatal error:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
