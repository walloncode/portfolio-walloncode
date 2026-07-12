import { GitBranch, Star, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { useGithubUser, useGithubRepos, useGithubLanguages } from "@/features/github/use-github";
import { profile } from "@/content/profile";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { motion } from "motion/react";

export function GithubSection() {
  const { data: user, isLoading: userLoading } = useGithubUser();
  const { data: repos, isLoading: reposLoading } = useGithubRepos();
  const languages = useGithubLanguages(repos);
  const recentRepos = repos?.slice(0, 4);

  const memberSince = user ? new Date(user.created_at).getFullYear() : null;

  return (
    <section id="github" className="relative py-28 md:py-36">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal direction="left">
            <SectionHeading eyebrow="GitHub" title="Direto do código-fonte" />
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <Button variant="outline" asChild>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                <GitBranch className="size-4" aria-hidden="true" />
                @{profile.handle}
              </a>
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <GlassPanel className="flex flex-col gap-6 p-6">
              <Stat label="Repositórios públicos" value={user?.public_repos} loading={userLoading} />
              <Stat label="Seguidores" value={user?.followers} loading={userLoading} />
              <Stat label="No GitHub desde" value={memberSince ?? undefined} loading={userLoading} />

              {languages.length > 0 && (
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                    Linguagens ativas
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {languages.map((l) => (
                      <span
                        key={l.language}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted"
                      >
                        {l.language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassPanel>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px 0px -80px 0px" }}
            variants={staggerContainer(0.08)}
            className="grid gap-4 sm:grid-cols-2"
          >
            {reposLoading &&
              ["a", "b", "c", "d"].map((key) => (
                <div
                  key={key}
                  className="h-[132px] animate-pulse rounded-[var(--radius-md)] border border-border bg-surface/40"
                />
              ))}

            {recentRepos?.map((repo) => (
              <motion.a
                key={repo.id}
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-border bg-surface/40 p-5 transition-colors duration-200 ease-[var(--ease-out-quart)] hover:border-accent-border hover:bg-surface hover:shadow-[0_24px_60px_-24px_rgba(91,108,255,0.5)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-mono text-sm font-medium text-foreground">{repo.name}</h3>
                    <ArrowUpRight className="size-3.5 shrink-0 text-foreground-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground-muted">
                    {repo.description ?? "Sem descrição."}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-foreground-subtle">
                  {repo.language && <span>{repo.language}</span>}
                  {repo.stargazers_count > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3" aria-hidden="true" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Stat({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | number | undefined;
  loading: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
        {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded bg-surface" /> : value}
      </p>
    </div>
  );
}
