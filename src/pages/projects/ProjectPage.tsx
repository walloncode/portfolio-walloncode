import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, GitBranch, Lock, TriangleAlert } from "lucide-react";
import { getProjectBySlug, projects } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProjectBackground } from "@/components/background/project-background";
import { ProjectVisual } from "@/components/project-visual";
import { ProjectCover } from "@/components/project-cover";
import { ProjectGallery } from "@/components/project-gallery";
import { StatusBadge } from "@/components/project-card";
import { Reveal } from "@/components/ui/reveal";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { NotFound } from "@/pages/NotFound";

function CaseSection({ title, body }: { title: string; body: string }) {
  return (
    <Reveal>
      <div className="py-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-foreground-subtle">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-foreground-muted">{body}</p>
      </div>
    </Reveal>
  );
}

export function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug ?? "");

  if (!project) return <NotFound />;

  const { caseStudy } = project;
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <Helmet>
        <title>{project.title} — Wellyson Caetano</title>
        <meta name="description" content={project.tagline} />
        <meta property="og:title" content={`${project.title} — Wellyson Caetano`} />
        <meta property="og:description" content={project.tagline} />
        <meta property="og:type" content="article" />
      </Helmet>

      <ProjectBackground theme={project.theme} sceneKey={project.slug} />

      <article className="pb-28 pt-32">
        <Container>
          <Reveal>
            <Link
              to="/#work"
              className="inline-flex items-center gap-1.5 text-sm text-foreground-subtle transition-colors duration-200 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Trabalho selecionado
            </Link>
          </Reveal>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.08)}
            className="mt-8 max-w-3xl"
          >
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={project.status} />
              <span className="text-sm text-foreground-subtle">{project.year}</span>
              <span className="text-sm text-foreground-subtle">·</span>
              <span className="text-sm text-foreground-subtle">{project.role}</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            >
              {project.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg text-foreground-muted">
              {project.tagline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {project.githubUrl && (
                <Button variant="outline" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    <GitBranch className="size-4" aria-hidden="true" />
                    Repositório
                  </a>
                </Button>
              )}
              {project.isPrivateRepo && (
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong px-4 py-2.5 text-sm text-foreground-muted">
                  <Lock className="size-3.5" aria-hidden="true" />
                  Repositório privado
                </span>
              )}
              {project.demoUrl && (
                <Button variant="accent" asChild>
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    Ver ao vivo
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              )}
              {project.extraLinks?.map((link) => (
                <Button key={link.url} variant="ghost" asChild>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </Button>
              ))}
            </motion.div>
          </motion.div>

          {project.disclaimer && (
            <Reveal>
              <div className="mt-10 flex max-w-3xl gap-3 rounded-[var(--radius-md)] border border-accent-border bg-accent-soft px-5 py-4">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-accent-hover" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {project.disclaimer}
                </p>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-14">
            {project.gallery && project.gallery.length > 0 ? (
              <ProjectGallery images={project.gallery} title={project.title} />
            ) : project.image ? (
              <ProjectCover project={project} className="aspect-[16/9]" />
            ) : (
              <ProjectVisual theme={project.theme} title={project.title} className="aspect-[16/9]" />
            )}
          </Reveal>

          <div className="mt-8 grid gap-16 md:grid-cols-[1fr_300px]">
            <div className="divide-y divide-border">
              <CaseSection title="Visão geral" body={caseStudy.overview} />
              <CaseSection title="Problema" body={caseStudy.problem} />
              <CaseSection title="Solução" body={caseStudy.solution} />
              <CaseSection title="Arquitetura" body={caseStudy.architecture} />
              <CaseSection title="Desafios" body={caseStudy.challenges} />
              <CaseSection title="Resultado" body={caseStudy.results} />
              <CaseSection title="Aprendizados" body={caseStudy.learnings} />
            </div>

            <aside className="space-y-10 md:pt-8">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-subtle">
                  Destaques técnicos
                </h3>
                <ul className="mt-4 space-y-3">
                  {caseStudy.highlights.map((h) => (
                    <li key={h.slice(0, 24)} className="flex gap-2.5 text-sm leading-relaxed text-foreground-muted">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-subtle">
                  Stack
                </h3>
                <div className="mt-4 space-y-4">
                  {caseStudy.stackDetail.map((group) => (
                    <div key={group.area}>
                      <p className="text-xs font-medium text-foreground-subtle">{group.area}</p>
                      <p className="mt-1 text-sm text-foreground-muted">{group.items.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </div>

              {project.team && (
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-foreground-subtle">
                    Equipe
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {project.team.map((member) => (
                      <li key={member.name} className="text-sm">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-foreground-muted">{member.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          <Separator className="my-16" />

          <Reveal className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                Próximo projeto
              </p>
              <Link
                to={`/projects/${nextProject.slug}`}
                className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-accent-hover"
              >
                {nextProject.title}
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </article>
    </>
  );
}
