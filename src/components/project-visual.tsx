import type { ProjectTheme } from "@/content/projects";
import { cn } from "@/lib/utils";

const PATTERNS: Record<ProjectTheme, string> = {
  topography:
    "repeating-radial-gradient(circle at 30% 40%, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 14px), repeating-radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 22px)",
  route:
    "repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1.5px, transparent 1.5px, transparent 34px)",
  grid: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
  signal:
    "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 24px, rgba(255,255,255,0.07) 25px, transparent 26px)",
  aurora:
    "radial-gradient(60% 60% at 20% 20%, rgba(91,108,255,0.35), transparent), radial-gradient(50% 50% at 80% 70%, rgba(255,255,255,0.12), transparent)",
  solar:
    "repeating-conic-gradient(from 0deg at 50% 120%, rgba(255,255,255,0.08) 0deg 3deg, transparent 3deg 18deg)",
  shield:
    "repeating-linear-gradient(60deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(-60deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 24px)",
};

const SIZES: Partial<Record<ProjectTheme, string>> = {
  grid: "20px 20px",
};

export function ProjectVisual({
  theme,
  title,
  className,
}: {
  theme: ProjectTheme;
  title: string;
  className?: string;
}) {
  const monogram = title.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-white/[0.06] bg-canvas-elevated",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: PATTERNS[theme],
          backgroundSize: SIZES[theme],
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none font-mono text-[9rem] font-semibold leading-none text-white/[0.06] sm:text-[11rem]"
      >
        {monogram}
      </div>
    </div>
  );
}
