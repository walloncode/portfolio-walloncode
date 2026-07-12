import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import type { JourneyNode } from "@/content/journey";
import { cn } from "@/lib/utils";

/**
 * Interactive orbital map of the journey. Adapted from the radial-orbital
 * pattern but rebuilt in the site's identity: single indigo accent, Geist,
 * no "energy %" bars, no sci-fi status labels. Auto-rotates gently, pauses
 * when a node is open, when scrolled offscreen, or under prefers-reduced-motion.
 */
export function OrbitalJourney({ nodes }: { nodes: JourneyNode[] }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [radius, setRadius] = useState(200);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const reducedRef = useRef(false);

  // Responsive orbit radius — keeps everything inside the viewport (no h-scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      // fit within both width and height so the full orbit stays on screen
      setRadius(Math.max(92, Math.min(190, w / 2 - 92, h / 2 - 96)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-rotation, paused when a node is open / offscreen / reduced-motion
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) return;

    const el = containerRef.current;
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), {
        threshold: 0,
      });
      io.observe(el);
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (autoRotate && visibleRef.current) {
        setRotation((r) => (r + dt * 0.006) % 360);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [autoRotate]);

  const centerOnNode = useCallback(
    (id: number) => {
      const index = nodes.findIndex((n) => n.id === id);
      if (index < 0) return;
      const target = (index / nodes.length) * 360;
      setRotation(270 - target); // bring the opened node to top-center
    },
    [nodes],
  );

  const toggle = useCallback(
    (id: number) => {
      setActiveId((prev) => {
        const next = prev === id ? null : id;
        if (next === null) {
          setAutoRotate(true);
        } else {
          setAutoRotate(false);
          centerOnNode(id);
        }
        return next;
      });
    },
    [centerOnNode],
  );

  const reset = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === stageRef.current) {
      setActiveId(null);
      setAutoRotate(true);
    }
  };

  const relatedIds = activeId ? (nodes.find((n) => n.id === activeId)?.relatedIds ?? []) : [];

  const nodePosition = (index: number) => {
    const angle = ((index / nodes.length) * 360 + rotation) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
    const z = Math.round(100 + 40 * Math.cos(rad));
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(rad)) / 2)));
    return { x, y, z, opacity };
  };

  return (
    <div
      ref={containerRef}
      onClick={reset}
      className="relative mx-auto flex h-[500px] w-full max-w-4xl items-center justify-center sm:h-[560px]"
    >
      <div ref={stageRef} className="absolute inset-0 flex items-center justify-center">
        {/* Core */}
        <div className="pointer-events-none absolute z-10 flex h-16 w-16 items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full border border-accent/30 opacity-70" />
          <div
            className="absolute h-24 w-24 animate-ping rounded-full border border-accent/15 opacity-50"
            style={{ animationDelay: "0.6s" }}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-border bg-accent-soft backdrop-blur-md">
            <span className="font-mono text-sm font-semibold text-accent-hover">W</span>
          </div>
        </div>

        {/* Orbit ring */}
        <div
          className="absolute rounded-full border border-white/[0.08]"
          style={{ width: radius * 2, height: radius * 2 }}
        />

        {nodes.map((node, index) => {
          const pos = nodePosition(index);
          const isActive = activeId === node.id;
          const isRelated = relatedIds.includes(node.id);
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              className="absolute transition-all duration-700 ease-[var(--ease-out-quart)]"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                zIndex: isActive ? 200 : pos.z,
                opacity: isActive ? 1 : pos.opacity,
              }}
            >
              <button
                type="button"
                aria-expanded={isActive}
                aria-label={`${node.title} — ${node.meta}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(node.id);
                }}
                className="group relative flex flex-col items-center outline-none"
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border-2 transition-all duration-300",
                    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                    isActive
                      ? "scale-125 border-accent bg-accent-solid text-white shadow-[0_0_24px_-4px_var(--color-accent)]"
                      : isRelated
                        ? "border-accent bg-accent-soft text-accent-hover"
                        : "border-white/25 bg-surface text-foreground-muted group-hover:border-accent-border group-hover:text-foreground",
                  )}
                >
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "absolute top-13 whitespace-nowrap text-xs font-medium tracking-wide transition-all duration-300",
                    isActive ? "text-foreground" : "text-foreground-subtle group-hover:text-foreground-muted",
                  )}
                >
                  {node.title}
                </span>
              </button>

              {isActive && (
                <div className="absolute left-1/2 top-20 w-[min(17rem,82vw)] -translate-x-1/2 rounded-[var(--radius-lg)] border border-white/[0.1] bg-canvas-elevated/90 p-5 text-left shadow-[var(--shadow-elevated)] backdrop-blur-xl">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-accent-border" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-accent-border bg-accent-soft px-2.5 py-1 text-[11px] font-medium leading-none text-accent-hover">
                      {node.meta}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
                      {node.category}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                    {node.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                    {node.content}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-2 py-0.5 text-[11px] text-foreground-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {node.relatedIds.length > 0 && (
                    <div className="mt-4 border-t border-border pt-3">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                        Conecta com
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {node.relatedIds.map((rid) => {
                          const rel = nodes.find((n) => n.id === rid);
                          if (!rel) return null;
                          return (
                            <button
                              key={rid}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggle(rid);
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-border-strong px-2.5 py-1 text-[11px] text-foreground-muted transition-colors duration-200 hover:border-accent-border hover:text-foreground"
                            >
                              {rel.title}
                              <ArrowUpRight size={11} aria-hidden="true" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
