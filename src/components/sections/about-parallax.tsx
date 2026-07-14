import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Container } from "@/components/ui/container";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { About, STEPS, TAGS, GLASS, StepCard, type Step } from "@/components/sections/about";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const HEADING_GRADIENT = {
  backgroundImage: "linear-gradient(180deg, #ffffff 0%, #a3a3ad 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
} as const;

/** One floating step card, revealed on its own scroll beat. The reveal lives on
 *  the positioned wrapper so the inner card keeps its idle float animation. */
function SceneCard({
  step,
  progress,
  start,
}: {
  step: Step;
  progress: MotionValue<number>;
  start: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.12], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.12], [0.82, 1]);
  const y = useTransform(progress, [start, start + 0.12], [18, 0]);
  return (
    <motion.div style={{ opacity, scale, y }} className={cn("absolute will-change-transform", step.scene)}>
      <div className={cn("p-4", GLASS, step.anim)}>
        <div className="mb-3">
          <StepCard step={step} />
        </div>
        <p className="text-sm leading-snug text-foreground-muted">{step.body}</p>
      </div>
    </motion.div>
  );
}

/** Scroll-driven assembly: the container appears first, then the step cards
 *  inside it (staggered), and the copy last. */
function AboutPortal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      scrollYProgress.set(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollYProgress]);

  // 1. the container shell
  const containerOpacity = useTransform(scrollYProgress, [0.03, 0.18], [0, 1]);
  const containerScale = useTransform(scrollYProgress, [0.03, 0.2], [0.93, 1]);
  // 2. the central cursor appears with the first cards
  const cursorOpacity = useTransform(scrollYProgress, [0.22, 0.32], [0, 1]);
  // 3. the copy (badge + heading + paragraph), then tags, then the facts
  const textOpacity = useTransform(scrollYProgress, [0.56, 0.72], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.56, 0.74], [26, 0]);
  const tagsOpacity = useTransform(scrollYProgress, [0.66, 0.8], [0, 1]);
  const tagsY = useTransform(scrollYProgress, [0.66, 0.82], [18, 0]);
  const factsOpacity = useTransform(scrollYProgress, [0.76, 0.9], [0, 1]);
  const factsY = useTransform(scrollYProgress, [0.76, 0.92], [22, 0]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]);

  return (
    <section ref={sectionRef} id="about" className="relative h-[140vh] md:h-[240vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container className="w-full">
          <motion.div
            style={{ opacity: containerOpacity, scale: containerScale }}
            className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.07] bg-canvas-elevated shadow-[var(--shadow-elevated)] will-change-transform"
          >
            {/* ambient background */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_20%,rgba(91,108,255,0.14),transparent_60%)]" />
              <div className="absolute inset-0 bg-canvas-elevated/55" />
              <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_12%_35%,var(--color-canvas-elevated)_18%,transparent_65%)]" />
            </div>

            <div className="relative z-10 flex min-h-[520px] flex-row">
              {/* Left — copy (revealed last) */}
              <div className="flex flex-1 flex-col justify-center p-8 md:p-12 lg:p-16">
                <motion.div style={{ opacity: textOpacity, y: textY }}>
                  <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                      Processo
                    </span>
                  </div>
                  <h2
                    className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem] md:text-[3rem]"
                    style={HEADING_GRADIENT}
                  >
                    Como eu trabalho
                  </h2>
                  <p className="mt-6 max-w-md text-2xl font-normal leading-relaxed text-foreground-muted">
                    Do problema à entrega, cada decisão passa por modelagem, arquitetura e
                    segurança — priorizando o que é auditável sobre o que é mágico.
                  </p>
                </motion.div>

                <motion.div
                  style={{ opacity: tagsOpacity, y: tagsY }}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="cursor-default rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm text-foreground-muted transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent-border hover:bg-accent-soft hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right — floating scene (revealed second, staggered) */}
              <div className="relative flex-1 overflow-hidden [perspective:1200px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                  }}
                />
                {STEPS.map((step, i) => (
                  <SceneCard key={step.label} step={step} progress={scrollYProgress} start={0.22 + i * 0.06} />
                ))}

                {/* central cursor */}
                <motion.div
                  style={{ opacity: cursorOpacity }}
                  className="pointer-events-none absolute left-[56%] top-[47%] -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative">
                    <div className="anim-float flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-sm">
                      <div className="size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-foreground-subtle opacity-70">
                      compilando…
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* at-a-glance facts */}
          <motion.dl
            style={{ opacity: factsOpacity, y: factsY }}
            className="mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {profile.atAGlance.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </Container>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground-subtle"
        >
          <span className="font-mono text-xs uppercase tracking-wider">role para montar</span>
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-lg"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

export function AboutParallax() {
  const reduce = useReducedMotion();
  const isNarrow =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  // The floating-card scene needs width; on narrow screens (and reduced motion)
  // fall back to the calm stacked About section.
  if (reduce || isNarrow) return <About />;
  return <AboutPortal />;
}
