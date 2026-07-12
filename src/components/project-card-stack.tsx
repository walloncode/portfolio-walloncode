import * as React from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/content/projects";
import { StatusBadge } from "@/components/project-card";
import { cn } from "@/lib/utils";

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active to i, wrapping for the loop feel. */
function signedOffset(i: number, active: number, len: number) {
  const raw = i - active;
  if (len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function ProjectCardStack({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();
  const len = projects.length;

  const [active, setActive] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = React.useState(500);
  const [isMobile, setIsMobile] = React.useState(false);

  // Responsive card sizing — keeps the fan inside the viewport
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const mobile = w < 640;
      setIsMobile(mobile);
      // On phones use most of the width so cards read large; on desktop cap it.
      setCardWidth(
        mobile
          ? Math.round(Math.min(400, w * 0.9))
          : Math.round(Math.min(500, Math.max(320, w * 0.72))),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Taller, near-portrait cards on mobile; landscape on desktop.
  const cardHeight = Math.round(cardWidth * (isMobile ? 1.15 : 0.64));
  const maxOffset = isMobile ? 1 : 2; // fewer side cards on phones
  const overlap = isMobile ? 0.6 : 0.46;
  const spreadDeg = isMobile ? 30 : 42;
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = spreadDeg / maxOffset;

  const prev = React.useCallback(() => setActive((a) => wrapIndex(a - 1, len)), [len]);
  const next = React.useCallback(() => setActive((a) => wrapIndex(a + 1, len)), [len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (reduceMotion) return;
    const threshold = Math.min(150, cardWidth * 0.22);
    if (info.offset.x > threshold || info.velocity.x > 600) prev();
    else if (info.offset.x < -threshold || info.velocity.x < -600) next();
  };

  if (!len) return null;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[var(--radius-xl)] border border-white/10"
        style={{ height: cardHeight + 96 }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="carrossel de projetos"
      >
        <div
          className="absolute inset-0 flex items-end justify-center pb-6"
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence initial={false}>
            {projects.map((project, i) => {
              const off = signedOffset(i, active, len);
              const abs = Math.abs(off);
              if (abs > maxOffset) return null;

              const isActive = off === 0;
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 12;
              const z = -abs * 130;
              const scale = isActive ? 1.02 : 0.92;
              const lift = isActive ? -20 : 0;
              const rotateX = isActive ? 0 : 10;

              return (
                <motion.div
                  key={project.slug}
                  className={cn(
                    "absolute bottom-0 overflow-hidden rounded-[var(--radius-lg)] border border-white/10 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]",
                    "will-change-transform select-none bg-canvas-elevated",
                    isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                  )}
                  style={{ width: cardWidth, height: cardHeight, zIndex: 100 - abs, transformStyle: "preserve-3d" }}
                  initial={reduceMotion ? false : { opacity: 0, x, y: y + 40, rotateZ, rotateX, scale }}
                  animate={{ opacity: abs === maxOffset ? 0.55 : 1, x, y: y + lift, rotateZ, rotateX, scale }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  onClick={() => !isActive && setActive(i)}
                  {...(isActive && !reduceMotion
                    ? {
                        drag: "x" as const,
                        dragConstraints: { left: 0, right: 0 },
                        dragElastic: 0.16,
                        onDragEnd,
                      }
                    : {})}
                >
                  <div className="h-full w-full" style={{ transform: `translateZ(${z}px)` }}>
                    <ProjectFanCard project={project} active={isActive} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Projeto anterior"
          className="flex size-9 items-center justify-center rounded-full border border-border-strong text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {projects.map((p, idx) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Ir para ${p.title}`}
              aria-current={idx === active}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === active ? "w-6 bg-accent" : "w-2 bg-foreground/25 hover:bg-foreground/50",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Próximo projeto"
          className="flex size-9 items-center justify-center rounded-full border border-border-strong text-foreground-muted transition-colors hover:border-foreground-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function ProjectFanCard({ project, active }: { project: Project; active: boolean }) {
  const monogram = project.title.trim().charAt(0).toUpperCase();

  return (
    <div className="relative h-full w-full">
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          draggable={false}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas-elevated">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,var(--color-accent-soft),transparent_70%)]" />
          <span className="font-mono text-[7rem] font-semibold leading-none text-white/[0.06]">
            {monogram}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="mb-2 flex items-center gap-2">
          <StatusBadge status={project.status} />
          <span className="text-xs text-white/60">{project.year}</span>
        </div>
        <h3 className="truncate text-lg font-semibold tracking-tight text-white">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/75">{project.tagline}</p>

        <div
          className={cn(
            "mt-4 flex items-center gap-3 transition-all duration-300",
            active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Link
            to={`/projects/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-white px-3.5 py-2 text-sm font-medium text-canvas transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Ver case study
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          {project.isPrivateRepo && (
            <span className="inline-flex items-center gap-1 text-xs text-white/60">
              <Lock className="size-3" aria-hidden="true" />
              Repo privado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
