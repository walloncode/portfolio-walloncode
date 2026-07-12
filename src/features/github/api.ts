const GITHUB_API = "https://api.github.com";
const USERNAME = "walloncode";

export interface GithubUser {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  homepage: string | null;
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchGithubUser() {
  return githubFetch<GithubUser>(`/users/${USERNAME}`);
}

export function fetchGithubRepos() {
  return githubFetch<GithubRepo[]>(`/users/${USERNAME}/repos?per_page=100&sort=updated`);
}
