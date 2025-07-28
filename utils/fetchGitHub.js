import fetch from 'node-fetch';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

export async function fetchGitHubStats(username) {
  const query = `
    query {
      user(login: "${username}") {
        name
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
        }
        repositories(first: 100, privacy: PUBLIC) {
          totalCount
        }
        starredRepositories {
          totalCount
        }
        pullRequests {
          totalCount
        }
        issues {
          totalCount
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data;
}

// Separate query for private repositories
export async function fetchPrivateRepos(username) {
  const query = `
    query {
      user(login: "${username}") {
        repositories(first: 100, privacy: PRIVATE) {
          totalCount
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data;
}
