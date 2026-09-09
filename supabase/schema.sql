-- ============================================
-- DevOps News Aggregator — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- SOURCES TABLE
-- Stores configuration for each data source
-- ============================================
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rss', 'github', 'api')),
  icon_url TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  fetch_interval_hours INTEGER DEFAULT 6,
  last_fetched_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ARTICLES TABLE
-- Stores fetched and processed articles
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  external_id TEXT,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  summary TEXT,
  content_snippet TEXT,
  author TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  is_read BOOLEAN DEFAULT false,
  is_bookmarked BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_articles_published ON articles(published_at DESC);
CREATE INDEX idx_articles_source ON articles(source_id);
CREATE INDEX idx_articles_unread ON articles(is_read, published_at DESC) WHERE is_read = false;
CREATE INDEX idx_articles_bookmarked ON articles(is_bookmarked, published_at DESC) WHERE is_bookmarked = true;
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- ============================================
-- FULL-TEXT SEARCH
-- Weighted: title (A) > summary (B) > category (C)
-- ============================================
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C')
  ) STORED;

CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sources_updated_at
  BEFORE UPDATE ON sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED INITIAL SOURCES
-- ============================================
INSERT INTO sources (name, slug, url, type, config) VALUES
  ('CNCF Blog',         'cncf-blog',        'https://www.cncf.io/blog/',                    'rss',    '{"feedUrl": "https://www.cncf.io/blog/feed/"}'),
  ('Kubernetes Blog',   'k8s-blog',         'https://kubernetes.io/blog/',                   'rss',    '{"feedUrl": "https://kubernetes.io/feed.xml"}'),
  ('Azure Updates',     'azure-updates',    'https://azure.microsoft.com/en-us/updates/',    'rss',    '{"feedUrl": "https://azurecomcdn.azureedge.net/en-us/updates/feed/"}'),
  ('Azure Blog',        'azure-blog',       'https://azure.microsoft.com/en-us/blog/',       'rss',    '{"feedUrl": "https://azure.microsoft.com/en-us/blog/feed/"}'),
  ('GitHub Changelog',  'github-changelog', 'https://github.blog/changelog/',                'rss',    '{"feedUrl": "https://github.blog/changelog/feed/"}'),
  ('HashiCorp Blog',    'hashicorp-blog',   'https://www.hashicorp.com/blog',                'rss',    '{"feedUrl": "https://www.hashicorp.com/blog/feed.xml"}'),
  ('DevOps Reddit',     'devops-reddit',    'https://www.reddit.com/r/devops/',              'rss',    '{"feedUrl": "https://www.reddit.com/r/devops/.rss"}'),
  ('CNCF Landscape',    'cncf-landscape',   'https://landscape.cncf.io/',                    'github', '{"owner": "cncf", "repo": "landscape"}');
