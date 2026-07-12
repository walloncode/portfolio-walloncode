import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/project-card";

export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex flex-col gap-3 border-b border-border py-6 outline-none transition-colors duration-200 first:pt-0 last:border-b-0 hover:border-border-strong focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-medium text-foreground">{project.title}</h3>
          <span className="text-xs text-foreground-subtle">{project.year}</span>
        </div>
        <p className="mt-1 max-w-lg truncate text-sm text-foreground-muted">
          {project.tagline}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <StatusBadge status={project.status} />
        <ArrowUpRight className="size-4 text-foreground-subtle transition-all duration-300 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-hover" aria-hidden="true" />
      </div>
    </Link>
  );
}
