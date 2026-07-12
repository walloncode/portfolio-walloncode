import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "motion/react";
import { GitBranch, Star, ArrowUpRight, FolderGit2, Activity } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import {
  useGithubUser,
  useGithubRepos,
  useGithubLanguages,
} from "@/features/github/use-github";
import type { GithubRepo } from "@/features/github/api";
import { profile } from "@/content/profile";
import { staggerContainer, fadeUp } from "@/lib/motion";
import githubMark from "@/assets/github-mark.png";

const REPO_COUNT = 6;
const USERNAME = profile.handle;

/** White GitHub mark on the dark canvas (source PNG is black). */
const MARK_WHITE = "invert(1)";

// Dark-themed contribution activity graph over time.
const CONTRIB_CHART =
  `https://github-readme-activity-graph.vercel.app/graph?username=${USERNAME}` +
  "&bg_color=0e0e11&color=f5f5f7&line=5b6cff&point=7385ff&area=true&area_color=5b6cff&hide_border=true&custom_title=";
// The animated commit "snake": produced by .github/workflows/snake.yml and
// published to the repo's `output` branch — renders once that workflow has run.
const SNAKE_SVG =
  "https://raw.githubusercontent.com/walloncode/portfolio-walloncode/output/github-snake-dark.svg";

/** External image that swaps to a fallback if the source fails to load. */
function ExternalImage({
  src,
  alt,
  className,
  fallback = null,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function useGithubData() {
  const { data: user, isLoading: userLoading } = useGithubUser();
  const { data: repos, isLoading: reposLoading } = useGithubRepos();
  const languages = useGithubLanguages(repos);
  const menuRepos = repos?.slice(0, REPO_COUNT);
  const memberSince = user ? new Date(user.created_at).getFullYear() : undefined;
  return { user, userLoading, repos: menuRepos, reposLoading, languages, memberSince };
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <motion.a
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-border bg-surface/50 p-4 transition-colors duration-200 hover:border-accent-border hover:bg-surface hover:shadow-[0_20px_50px_-24px_rgba(91,108,255,0.5)]"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-mono text-sm font-medium text-foreground">{repo.name}</h3>
          <ArrowUpRight
            className="size-3.5 shrink-0 text-foreground-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-foreground-muted">
          {repo.description ?? "Sem descrição."}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] text-foreground-subtle">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-3" aria-hidden="true" />
            {repo.stargazers_count}
          </span>
        )}
      </div>
    </motion.a>
  );
}

function StatInline({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold tabular-nums leading-none text-foreground">{value ?? "—"}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
        {label}
      </p>
    </div>
  );
}

interface MenuData extends ReturnType<typeof useGithubData> {}

/** The interactive menu revealed once the zoom passes through the logo. */
function GithubMenu({ data, active }: { data: MenuData; active: boolean }) {
  const { user, memberSince } = data;
  return (
    <div className="max-h-[86vh] w-[min(1040px,92vw)] overflow-y-auto rounded-[1.75rem] border border-white/[0.1] bg-canvas-elevated/85 p-5 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-7">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <img
            src={githubMark}
            alt=""
            aria-hidden="true"
            className="size-9"
            style={{ filter: MARK_WHITE }}
          />
          <div>
            <p className="font-mono text-sm text-foreground">@{profile.handle}</p>
            <p className="text-xs text-foreground-subtle">Direto do código-fonte</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <StatInline label="repos" value={user?.public_repos} />
          <StatInline label="seguidores" value={user?.followers} />
          <StatInline label="desde" value={memberSince} />
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
              <GitBranch className="size-4" aria-hidden="true" />
              Ver no GitHub
            </a>
          </Button>
        </div>
      </div>

      {/* interactive tabs — repos / contributions */}
      <GithubTabs data={data} active={active} />
    </div>
  );
}

const TABS = [
  { id: "repos", label: "Repositórios", icon: FolderGit2 },
  { id: "contrib", label: "Contribuições", icon: Activity },
] as const;

type TabId = (typeof TABS)[number]["id"];

function GithubTabs({ data, active }: { data: MenuData; active: boolean }) {
  const { repos, reposLoading, languages } = data;
  const [tab, setTab] = useState<TabId>("repos");

  return (
    <div className="mt-5">
      {/* tab bar */}
      <div className="flex items-center gap-1 rounded-full border border-border bg-surface/40 p-1 w-fit">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="gh-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-accent-soft ring-1 ring-accent-border"
                />
              )}
              <Icon className={`relative size-3.5 ${isActive ? "text-accent-hover" : "text-foreground-subtle"}`} aria-hidden="true" />
              <span className={`relative ${isActive ? "text-foreground" : "text-foreground-muted"}`}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* tab content */}
      <div className="mt-4 min-h-[248px]">
        <AnimatePresence mode="wait">
          {tab === "repos" ? (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                variants={staggerContainer(0.06)}
                initial="hidden"
                animate={active ? "visible" : "hidden"}
                className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {reposLoading &&
                  ["a", "b", "c", "d", "e", "f"].map((k) => (
                    <div key={k} className="h-[116px] animate-pulse rounded-[var(--radius-md)] border border-border bg-surface/40" />
                  ))}
                {repos?.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </motion.div>

              {languages.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                    Linguagens
                  </span>
                  {languages.map((l) => (
                    <span key={l.language} className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted">
                      {l.language}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="contrib"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* commit snake — the animated contribution grid */}
              <div className="rounded-[var(--radius-md)] border border-border bg-surface/40 p-4">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                  Cobrinha de commits
                </p>
                <div className="overflow-x-auto">
                  <ExternalImage
                    src={SNAKE_SVG}
                    alt="Animação da cobrinha percorrendo o gráfico de contribuições"
                    className="h-auto w-full min-w-[520px]"
                    fallback={
                      <div className="flex h-[120px] items-center justify-center rounded-lg border border-dashed border-border px-4 text-center text-xs text-foreground-subtle">
                        A cobrinha é gerada pelo workflow do repositório e aparece após a
                        primeira execução (Actions → “Gera a cobrinha de contribuições”).
                      </div>
                    }
                  />
                </div>
              </div>

              {/* contribution calendar heatmap */}
              <div className="rounded-[var(--radius-md)] border border-border bg-surface/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                    Gráfico de contribuições
                  </p>
                  <span className="text-[10px] text-foreground-subtle">último ano</span>
                </div>
                <div className="overflow-x-auto">
                  <ExternalImage
                    src={CONTRIB_CHART}
                    alt="Calendário de contribuições do último ano"
                    className="h-auto w-full min-w-[560px]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Scroll-driven zoom portal: the GitHub mark zooms into its center and, as it
 *  engulfs the viewport, reveals the interactive repository menu. */
function GithubPortal({ data }: { data: MenuData }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [menuActive, setMenuActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setMenuActive(v > 0.55);
  });

  // Logo zooms toward the viewer and fades as it swallows the screen.
  const logoScale = useTransform(scrollYProgress, [0, 0.55], [1, 6.5]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.32, 0.52], [1, 1, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 0.55], [1, 3.4]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [0.5, 0.7, 0]);

  // Menu emerges from the center as the logo clears.
  const menuScale = useTransform(scrollYProgress, [0.42, 0.82], [0.82, 1]);
  const menuOpacity = useTransform(scrollYProgress, [0.44, 0.66], [0, 1]);

  // Hint fades out once the zoom begins.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12, 0.24], [1, 1, 0]);

  return (
    <section ref={sectionRef} id="github" className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* ambient glow that grows with the zoom */}
        <motion.div
          aria-hidden="true"
          style={{ scale: glowScale, opacity: glowOpacity }}
          className="pointer-events-none absolute size-[42vmin] rounded-full blur-[80px]"
        >
          <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.85),rgba(91,108,255,0.25)_55%,transparent_72%)]" />
        </motion.div>

        {/* the zooming GitHub mark */}
        <motion.img
          src={githubMark}
          alt="GitHub"
          style={{ scale: logoScale, opacity: logoOpacity, filter: MARK_WHITE }}
          className="pointer-events-none absolute z-10 size-[34vmin] max-w-none select-none will-change-transform [transform-origin:50%_50%]"
          draggable={false}
        />

        {/* scroll hint — only before the menu takes over */}
        {!menuActive && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-10 z-20 flex flex-col items-center gap-2 text-foreground-subtle"
          >
            <span className="font-mono text-xs uppercase tracking-wider">role para entrar no código</span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-lg"
            >
              ↓
            </motion.span>
          </motion.div>
        )}

        {/* the interactive menu — revealed by the zoom */}
        <motion.div
          style={{ scale: menuScale, opacity: menuOpacity, pointerEvents: menuActive ? "auto" : "none" }}
          className="absolute z-20 flex w-full justify-center will-change-transform"
        >
          <GithubMenu data={data} active={menuActive} />
        </motion.div>
      </div>
    </section>
  );
}

/** Calm, non-pinned fallback for mobile / reduced-motion. */
function GithubStatic({ data }: { data: MenuData }) {
  const { user, userLoading, languages, memberSince } = data;
  return (
    <section id="github" className="relative py-24 md:py-32">
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

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <GlassPanel className="flex flex-col gap-5 p-6">
              <div className="flex items-center gap-3">
                <img src={githubMark} alt="" aria-hidden="true" className="size-8" style={{ filter: MARK_WHITE }} />
                <p className="font-mono text-sm text-foreground">@{profile.handle}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <StatInline label="repos" value={user?.public_repos} />
                <StatInline label="seguidores" value={user?.followers} />
                <StatInline label="desde" value={userLoading ? undefined : memberSince} />
              </div>
              {languages.length > 0 && (
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                    Linguagens ativas
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {languages.map((l) => (
                      <span key={l.language} className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted">
                        {l.language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassPanel>
          </Reveal>

          <div>
            <GithubTabs data={data} active />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function GithubSection() {
  const reduce = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const data = useGithubData();

  if (reduce || isMobile) return <GithubStatic data={data} />;
  return <GithubPortal data={data} />;
}
