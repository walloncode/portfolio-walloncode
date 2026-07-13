import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Shared ambient backdrop for the main home sections after the hero.
 * The moving shader ("labaredas") was removed on request — only the static
 * background remains: a soft hue wash that transitions as you scroll from one
 * section to the next, over the global BackgroundField blobs. Fades in/out at
 * the region's edges and respects reduced motion.
 */

// hue washes interpolated across the scrolled region
const STOPS = [0, 0.34, 0.68, 1];
const TINTS = [
  "rgba(91,108,255,0.16)", // indigo
  "rgba(150,90,255,0.16)", // violet
  "rgba(60,200,220,0.14)", // cyan
  "rgba(120,95,255,0.14)", // back toward violet
];

export function ScrollAtmosphere({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const tint = useTransform(scrollYProgress, STOPS, TINTS);

  return (
    <div ref={ref} className="relative">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[8] overflow-hidden"
        style={{ opacity: reduce ? 0.5 : opacity }}
      >
        {/* the transitioning hue wash (static — no shader) */}
        <motion.div className="absolute inset-0" style={{ background: reduce ? TINTS[0] : tint }} />
        {/* soft dark veil so the wash never fights the copy */}
        <div className="absolute inset-0 bg-canvas/35" />
        {/* fade into the neighbouring (about, footer) areas */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_50%,transparent_32%,var(--color-canvas)_94%)]" />
      </motion.div>
      {children}
    </div>
  );
}
