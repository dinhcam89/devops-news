import Parser from "rss-parser";
import type { RawArticle } from "./types";

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "DevOpsNewsAggregator/1.0" },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

/**
 * Fetch and parse an RSS/Atom feed, returning normalized articles.
 */
export async function fetchRSSFeed(
  sourceId: string,
  feedUrl: string
): Promise<RawArticle[]> {
  const feed = await parser.parseURL(feedUrl);

  return (feed.items || []).map((item) => ({
    externalId: item.guid || item.link || "",
    title: (item.title || "Untitled").trim(),
    url: normalizeUrl(item.link || ""),
    content: item.contentSnippet || item.content || "",
    author: item.creator || (item as any).author || undefined,
    imageUrl: extractImageUrl(item),
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    sourceId,
  }));
}

/**
 * Normalize a URL by stripping common tracking parameters.
 */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "ref",
      "source",
      "fbclid",
      "gclid",
    ];
    trackingParams.forEach((p) => u.searchParams.delete(p));
    // Remove trailing hash if empty
    if (u.hash === "#") u.hash = "";
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Try to extract an image URL from various RSS feed formats.
 */
function extractImageUrl(item: any): string | undefined {
  // Check enclosure (standard RSS)
  const enclosure = item.enclosure as
    | { url?: string; type?: string }
    | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image")) {
    return enclosure.url;
  }

  // Check media:content
  const mediaContent = item.mediaContent as
    | { $?: { url?: string } }
    | undefined;
  if (mediaContent?.$?.url) {
    return mediaContent.$.url;
  }

  // Check media:thumbnail
  const mediaThumbnail = item.mediaThumbnail as
    | { $?: { url?: string } }
    | undefined;
  if (mediaThumbnail?.$?.url) {
    return mediaThumbnail.$.url;
  }

  return undefined;
}
