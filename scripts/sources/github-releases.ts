import { Octokit } from "@octokit/rest";
import type { RawArticle } from "./types";

// No auth token needed for public repos (60 requests/hour unauthenticated)
const octokit = new Octokit();

/**
 * Fetch the latest releases from a GitHub repository.
 */
export async function fetchGitHubReleases(
  sourceId: string,
  owner: string,
  repo: string
): Promise<RawArticle[]> {
  const { data: releases } = await octokit.rest.repos.listReleases({
    owner,
    repo,
    per_page: 10,
  });

  return releases.map((release) => ({
    externalId: `github-${owner}-${repo}-${release.id}`,
    title: `${repo}: ${release.name || release.tag_name}`,
    url: release.html_url,
    content: (release.body || "").slice(0, 1000),
    author: release.author?.login || undefined,
    imageUrl: release.author?.avatar_url || undefined,
    publishedAt: new Date(release.published_at || release.created_at),
    sourceId,
  }));
}
