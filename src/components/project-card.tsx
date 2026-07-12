import { Link } from "react-router-dom";
import { ArrowUpRight, GitBranch, Lock } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectCover } from "@/components/project-cover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block rounded-[var(--radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
    >
      <ProjectCover
        project={project}
        className="transition-transform duration-500 ease-[var(--ease-out-quart)] group-hover:scale-[1.015]"
      />

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {project.title}
            </h3>
            <span className="text-sm text-foreground-subtle">{project.year}</span>
          </div>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-foreground-muted">
            {project.tagline}
          </p>
        </div>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-foreground-subtle transition-all duration-300 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-hover" aria-hidden="true" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} />
        {project.tech.slice(0, 4).map((t) => (
          <Badge key={t} variant="outline">
            {t}
          </Badge>
        ))}
        {project.isPrivateRepo && (
          <span className="inline-flex items-center gap-1 text-xs text-foreground-subtle">
            <Lock className="size-3" aria-hidden="true" />
            Repo privado
          </span>
        )}
        {project.githubUrl && !project.isPrivateRepo && (
          <span className="inline-flex items-center gap-1 text-xs text-foreground-subtle">
            <GitBranch className="size-3" aria-hidden="true" />
            Público
          </span>
        )}
      </div>
    </Link>
  );
}

export function StatusBadge({ status }: { status: Project["status"] }) {
  const isLive = status === "Em produção";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        isLive
          ? "border-accent-border bg-accent-soft text-accent-hover"
          : "border-border-strong bg-surface text-foreground-muted",
      )}
    >
      {isLive && <span className="size-1.5 rounded-full bg-accent" />}
      {status}
    </span>
  );
}
