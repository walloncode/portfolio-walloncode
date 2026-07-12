import { useQuery } from "@tanstack/react-query";
import { fetchGithubUser, fetchGithubRepos, type GithubRepo } from "@/features/github/api";

// Class exercises, empty scaffolds and superseded repos — not representative
// of real engineering work, so they're excluded from the live feed even
// though the GitHub API still returns them.
const EXCLUDED_REPOS = new Set([
  "portfolio-aula",
  "aplica-o",
  "jogo-educativo",
  "site-de-tarefas",
  "projeto-tarefas-3a",
  "cadastro-alunos",
  "projeto-flask",
  "typescript",
  "tela-do-starbucks",
  "ifrogram-testee",
  "primeiro-projeto-program-1",
  "ifro-3a-2025-progweb-facebookloginprototype",
  "portfolio",
]);

export function useGithubUser() {
  return useQuery({
    queryKey: ["github", "user"],
    queryFn: fetchGithubUser,
  });
}

export function useGithubRepos() {
  return useQuery({
    queryKey: ["github", "repos"],
    queryFn: fetchGithubRepos,
    select: (repos) =>
      repos
        .filter((r) => !r.fork && !r.archived && !EXCLUDED_REPOS.has(r.name.toLowerCase()))
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
  });
}

export function useGithubLanguages(repos: GithubRepo[] | undefined) {
  if (!repos) return [];
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
