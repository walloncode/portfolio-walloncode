import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Oscillating keyframes (not a single monotonic drift) so the motion reads
// as continuous "breathing" through every section, not just a slow crawl
// diluted across the whole document height.
const PROGRESS = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84, 1];

export function BackgroundField() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const blobOneY = useTransform(scrollYProgress, PROGRESS, [
    "-8%", "18%", "-4%", "22%", "0%", "26%", "-6%", "16%", "6%",
  ]);
  const blobOneX = useTransform(scrollYProgress, PROGRESS, [
    "0%", "10%", "-6%", "8%", "-4%", "12%", "0%", "-8%", "4%",
  ]);
  const blobOneScale = useTransform(scrollYProgress, PROGRESS, [
    1, 1.12, 0.95, 1.15, 1, 1.1, 0.96, 1.08, 1,
  ]);

  const blobTwoY = useTransform(scrollYProgress, PROGRESS, [
    "6%", "-16%", "10%", "-22%", "0%", "-14%", "12%", "-20%", "-4%",
  ]);
  const blobTwoX = useTransform(scrollYProgress, PROGRESS, [
    "0%", "-8%", "6%", "-12%", "2%", "-10%", "0%", "8%", "-2%",
  ]);

  const blobThreeOpacity = useTransform(scrollYProgress, PROGRESS, [
    0.55, 0.85, 0.5, 0.9, 0.55, 0.8, 0.5, 0.88, 0.6,
  ]);
  const blobThreeX = useTransform(scrollYProgress, PROGRESS, [
    "0%", "6%", "-8%", "4%", "-6%", "8%", "-4%", "6%", "0%",
  ]);

  const hazeY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
    >
      {/* slow-drifting wide haze, deepest layer */}
      <motion.div
        className="absolute -top-[20%] left-[-10%] h-[900px] w-[900px] rounded-full opacity-[0.16] blur-[160px]"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          y: prefersReducedMotion ? undefined : hazeY,
        }}
      />

      <motion.div
        className="absolute -top-[8%] left-[6%] h-[620px] w-[620px] rounded-full opacity-[0.6] blur-[110px]"
        style={
          prefersReducedMotion
            ? { background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }
            : {
                background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
                y: blobOneY,
                x: blobOneX,
                scale: blobOneScale,
              }
        }
      />
      <motion.div
        className="absolute bottom-[-18%] right-[2%] h-[680px] w-[680px] rounded-full opacity-[0.28] blur-[130px]"
        style={
          prefersReducedMotion
            ? { background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }
            : {
                background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
                y: blobTwoY,
                x: blobTwoX,
              }
        }
      />
      <motion.div
        className="absolute left-[38%] top-[34%] h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--color-accent) 0%, transparent 72%)",
          opacity: prefersReducedMotion ? 0.35 : blobThreeOpacity,
          x: prefersReducedMotion ? undefined : blobThreeX,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-canvas)_92%)]" />
    </div>
  );
}
