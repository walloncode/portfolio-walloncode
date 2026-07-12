import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ShaderField, BRANCHES_FRAG } from "@/components/background/shader-field";

/**
 * One continuous "space branches" backdrop shared by the main home sections.
 * Instead of a boxed shader per section (which left hard seams), a single
 * fixed field sits behind the wrapped sections and its hue transitions as you
 * scroll from one section to the next — the background morphs, it doesn't
 * restart. Fades in/out at the region's edges and respects reduced motion.
 *
 * Perf: the shader canvas is fixed, so it can never pause itself when the
 * region scrolls away — instead we unmount it entirely outside the region so
 * it stops consuming the GPU while you're reading the hero/footer.
 */

// hue washes laid over the shader, interpolated across the scrolled region
const STOPS = [0, 0.34, 0.68, 1];
const TINTS = [
  "rgba(91,108,255,0.22)", // indigo
  "rgba(150,90,255,0.22)", // violet
  "rgba(60,200,220,0.20)", // cyan
  "rgba(120,95,255,0.20)", // back toward violet
];

export function ScrollAtmosphere({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const tint = useTransform(scrollYProgress, STOPS, TINTS);

  // only render (and animate) the shader while the wrapped region is on screen
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const inView = v > 0.02 && v < 0.98;
    setActive((prev) => (prev === inView ? prev : inView));
  });

  // resolve the initial state too (e.g. refreshing while already scrolled in)
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const v = scrollYProgress.get();
      setActive(v > 0.02 && v < 0.98);
    });
    return () => cancelAnimationFrame(id);
  }, [scrollYProgress]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[8] overflow-hidden"
        style={{ opacity: reduce ? 0.5 : opacity }}
      >
        {(active || reduce) && (
          <ShaderField frag={BRANCHES_FRAG} className="h-full w-full opacity-60" />
        )}
        {/* the transitioning hue wash */}
        <motion.div className="absolute inset-0" style={{ background: reduce ? TINTS[0] : tint }} />
        {/* soft dark veil so the shader never fights the copy */}
        <div className="absolute inset-0 bg-canvas/35" />
        {/* readability + blend into the neighbouring (hero/about, footer) areas */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_50%,transparent_32%,var(--color-canvas)_94%)]" />
      </motion.div>
      {children}
    </div>
  );
}
