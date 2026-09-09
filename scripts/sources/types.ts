/**
 * Shared types for the ingestion pipeline.
 */
export interface RawArticle {
  externalId: string;
  title: string;
  url: string;
  content?: string;
  author?: string;
  imageUrl?: string;
  publishedAt?: Date;
  sourceId: string;
}

export interface IngestionResult {
  sourceName: string;
  articles: RawArticle[];
}

export interface IngestionReport {
  totalSources: number;
  successfulSources: number;
  failedSources: number;
  totalArticles: number;
  newArticles: number;
  duplicatesSkipped: number;
  errors: string[];
  durationMs: number;
}
