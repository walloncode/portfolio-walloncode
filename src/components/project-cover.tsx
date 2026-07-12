import type { Project } from "@/content/projects";
import { ProjectVisual } from "@/components/project-visual";
import { cn } from "@/lib/utils";

export function ProjectCover({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (!project.image) {
    return <ProjectVisual theme={project.theme} title={project.title} className={className} />;
  }

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-lg)] border border-white/[0.06] bg-canvas-elevated",
        className,
      )}
    >
      <img
        src={project.image}
        alt={`Interface de ${project.title}`}
        loading="lazy"
        className="h-full w-full object-cover object-top"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </div>
  );
}
