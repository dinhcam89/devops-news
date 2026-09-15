import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // optional, raises rate limit from 60→5000/hr
});

interface MergedPr {
  title: string;
  url: string;
  merged_at: string;
  author: string;
}

interface Milestone {
  title: string;
  due_on: string | null;
  open_issues: number;
  closed_issues: number;
  url: string;
}

export interface TrackerData {
  description: string | null;
  stars: number;
  language: string | null;
  openIssuesCount: number;
  openPrsCount: number;
  latestReleaseTag: string | null;
  latestReleaseDate: Date | null;
  latestReleaseUrl: string | null;
  recentMergedPrs: MergedPr[];
  milestones: Milestone[];
}

/**
 * Fetch comprehensive tracking data for a single GitHub repository.
 */
export async function fetchRepoTrackerData(
  owner: string,
  repo: string
): Promise<TrackerData> {
  // 1. Basic repo info (stars, language, description, open_issues)
  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });

  // 2. Latest release
  let latestReleaseTag: string | null = null;
  let latestReleaseDate: Date | null = null;
  let latestReleaseUrl: string | null = null;
  try {
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner,
      repo,
      per_page: 1,
    });
    if (releases.length > 0) {
      const latest = releases[0];
      latestReleaseTag = latest.tag_name;
      latestReleaseDate = new Date(latest.published_at || latest.created_at);
      latestReleaseUrl = latest.html_url;
    }
  } catch {
    // Some repos may not have releases
  }

  // 3. Open PRs count
  let openPrsCount = 0;
  try {
    const { data: prs } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "open",
      per_page: 1,
    });
    // Use the total_count from search for accuracy, or just the header
    // For simplicity, use a search query
    const { data: searchResult } = await octokit.rest.search.issuesAndPullRequests({
      q: `repo:${owner}/${repo} is:pr is:open`,
      per_page: 1,
    });
    openPrsCount = searchResult.total_count;
  } catch {
    openPrsCount = 0;
  }

  // 4. Recently merged PRs (last 5)
  let recentMergedPrs: MergedPr[] = [];
  try {
    const { data: mergedPrs } = await octokit.rest.pulls.list({
      owner,
      repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 10,
    });
    recentMergedPrs = mergedPrs
      .filter((pr) => pr.merged_at !== null)
      .slice(0, 5)
      .map((pr) => ({
        title: pr.title,
        url: pr.html_url,
        merged_at: pr.merged_at!,
        author: pr.user?.login || "unknown",
      }));
  } catch {
    // ignore
  }

  // 5. Open milestones
  let milestones: Milestone[] = [];
  try {
    const { data: msData } = await octokit.rest.issues.listMilestones({
      owner,
      repo,
      state: "open",
      sort: "due_on",
      direction: "asc",
      per_page: 5,
    });
    milestones = msData.map((ms) => ({
      title: ms.title,
      due_on: ms.due_on,
      open_issues: ms.open_issues,
      closed_issues: ms.closed_issues,
      url: ms.html_url,
    }));
  } catch {
    // ignore
  }

  return {
    description: repoData.description,
    stars: repoData.stargazers_count,
    language: repoData.language,
    openIssuesCount: repoData.open_issues_count, // GitHub counts issues + PRs here
    openPrsCount,
    latestReleaseTag,
    latestReleaseDate,
    latestReleaseUrl,
    recentMergedPrs,
    milestones,
  };
}
