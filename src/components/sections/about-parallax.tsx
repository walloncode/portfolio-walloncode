import { motion, useReducedMotion, type Variants } from "motion/react";
import { Container } from "@/components/ui/container";
import { AuroraBackground } from "@/components/ui/aurora-hero-bg";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { About, STEPS, TAGS, GLASS, StepCard, type Step } from "@/components/sections/about";

const HEADING_GRADIENT = {
  color: "#ffffff",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

/** The assembly beats. Children read their delay from `custom`, which keeps the
 *  original scroll choreography's order while running on its own clock. */
const shell: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  }),
};

/** One floating step card. The reveal lives on the positioned wrapper so the
 *  inner card keeps its idle float animation. */
function SceneCard({ step, delay }: { step: Step; delay: number }) {
  return (
    <motion.div
      variants={pop}
      custom={delay}
      className={cn("absolute will-change-transform", step.scene)}
    >
      <div className={cn("p-4", GLASS, step.anim)}>
        <div className="mb-3">
          <StepCard step={step} />
        </div>
        <p className="text-sm leading-snug text-foreground-muted">{step.body}</p>
      </div>
    </motion.div>
  );
}

/** Self-assembling scene: the shell appears first, then the step cards inside it
 *  (staggered), then the copy, the tags, and finally the facts. */
function AboutPortal() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32">
      {/* Aurora backdrop — sits behind the card, not inside it */}
      <AuroraBackground className="opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]" />

      <Container className="relative z-10 w-full">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <motion.div
            variants={shell}
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
                <motion.div variants={rise} custom={0.9}>
                  <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                      Processo
                    </span>
                  </div>
                  <h2 className="title-std" style={HEADING_GRADIENT}>
                    Como eu trabalho
                  </h2>
                  <p className="subtext-std mt-6 max-w-md text-foreground-muted">
                    Do problema à entrega, cada decisão passa por modelagem, arquitetura e
                    segurança — priorizando o que é auditável sobre o que é mágico.
                  </p>
                </motion.div>

                <motion.div variants={rise} custom={1.05} className="mt-8 flex flex-wrap gap-3">
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
                  <SceneCard key={step.label} step={step} delay={0.35 + i * 0.12} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* at-a-glance facts */}
          <motion.dl
            variants={rise}
            custom={1.2}
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
        </motion.div>
      </Container>
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
