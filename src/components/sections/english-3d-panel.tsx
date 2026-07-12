import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { english } from "@/content/english";
import { cn } from "@/lib/utils";

/** Resting tilt so the panel reads as 3D even before the cursor arrives. */
const REST_X = 7;
const REST_Y = -5;
const RANGE = 18;

/** Per-card ambient glow — subtle indigo/violet family, one per competence. */
const GLOWS = [
  "radial-gradient(120% 120% at 30% 25%, rgba(91,108,255,0.42), rgba(91,108,255,0.05) 55%, transparent 72%)",
  "radial-gradient(120% 120% at 70% 25%, rgba(124,92,255,0.42), rgba(124,92,255,0.05) 55%, transparent 72%)",
  "radial-gradient(120% 120% at 30% 75%, rgba(56,120,255,0.40), rgba(56,120,255,0.05) 55%, transparent 72%)",
  "radial-gradient(120% 120% at 70% 75%, rgba(150,92,255,0.40), rgba(150,92,255,0.05) 55%, transparent 72%)",
];

export function English3DPanel() {
  const reduce = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  // Only enable the 3D tilt/parallax for fine pointers (mouse). On touch the
  // resting tilt would push the panel past the viewport, and there's no cursor
  // to drive the effect — so we render a flat, static grid instead.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  const setVars = (x: number, y: number) => {
    const el = sceneRef.current;
    if (!el) return;
    el.style.setProperty("--en-x", x.toFixed(2));
    el.style.setProperty("--en-y", y.toFixed(2));
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      setVars(px * RANGE - RANGE / 2, py * RANGE - RANGE / 2);
    });
  };

  const onLeave = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setVars(REST_X, REST_Y);
  };

  return (
    <div
      ref={sceneRef}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? onLeave : undefined}
      className={cn("relative", enabled && "en3d-scene")}
      style={
        {
          "--en-x": enabled ? REST_X : 0,
          "--en-y": enabled ? REST_Y : 0,
        } as React.CSSProperties
      }
    >
      {/* soft floor shadow that grounds the floating panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-2 -z-10 h-16 rounded-[50%] bg-black/50 blur-2xl"
      />

      <div
        className={cn(
          "rounded-[1.75rem] border border-white/[0.1] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6",
          enabled && "en3d-stage",
        )}
      >
        {/* panel header — floats above the surface */}
        <div className={cn("mb-5 flex items-center justify-between px-1", enabled && "en3d-pop")}>
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-accent-soft font-mono text-[10px] font-bold text-accent-hover">
              EN
            </span>
            <span className="font-mono text-xs font-medium tracking-tight text-foreground">
              CEFR B2
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            practicing daily
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          {english.skills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.label}
                className={cn(
                  "group relative h-[150px] overflow-hidden rounded-2xl border border-white/[0.08] bg-canvas-elevated/60 sm:h-[168px]",
                  enabled && "en3d-card",
                )}
              >
                {/* deep glow layer (parallax with cursor) */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -inset-8",
                    enabled && "en3d-card__bg",
                  )}
                  style={{ background: GLOWS[i % GLOWS.length] }}
                />
                {/* foreground subject (parallax against cursor) */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 grid place-items-center",
                    enabled && "en3d-card__fg",
                  )}
                >
                  <Icon
                    className="size-11 text-white/95 [filter:drop-shadow(0_8px_16px_rgba(0,0,0,0.55))] sm:size-12"
                    aria-hidden="true"
                  />
                </div>
                {/* label */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3.5 pt-8">
                  <p className="text-sm font-semibold tracking-tight text-white">{skill.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {enabled && (
        <p className="mt-5 text-center text-xs text-foreground-subtle md:text-right">
          mova o cursor sobre o painel
        </p>
      )}
    </div>
  );
}
