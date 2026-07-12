import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { english, CEFR_SCALE, CEFR_CURRENT, CEFR_LABEL } from "@/content/english";
import { cardReveal, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const currentIndex = CEFR_SCALE.indexOf(CEFR_CURRENT);

/** CEFR ladder — levels up to and including the current one are filled. */
function CefrScale() {
  return (
    <div>
      <div className="flex items-end gap-1.5">
        {CEFR_SCALE.map((level, i) => {
          const reached = i <= currentIndex;
          const isCurrent = level === CEFR_CURRENT;
          return (
            <div key={level} className="flex flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium tabular-nums transition-colors",
                  isCurrent
                    ? "text-accent-hover"
                    : reached
                      ? "text-foreground-muted"
                      : "text-foreground-subtle/60",
                )}
              >
                {level}
              </span>
              <span
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  isCurrent
                    ? "bg-accent shadow-[0_0_16px_var(--color-accent)]"
                    : reached
                      ? "bg-accent/40"
                      : "bg-white/[0.06]",
                )}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-foreground-subtle">
        <span className="font-medium text-accent-hover">{CEFR_CURRENT}</span> — {CEFR_LABEL}
      </p>
    </div>
  );
}

export function EnglishSection() {
  const reduce = useReducedMotion();
  return (
    <section id="english" className="relative py-24 md:py-28">
      <Container className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Left — heading + level scale */}
        <div>
          <Reveal direction="left">
            <SectionHeading eyebrow={english.eyebrow} title={english.title} />
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground-muted">
              {english.lead}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 max-w-md rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <CefrScale />
            </div>
          </Reveal>
        </div>

        {/* Right — capability cards (staggered pop-in) */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={reduce ? undefined : staggerContainer(0.12, 0.05)}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={viewportOnce}
        >
          {english.skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.label}
                variants={reduce ? undefined : cardReveal}
                whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-md transition-colors hover:border-accent-border hover:bg-white/[0.06] hover:shadow-[0_24px_60px_-24px_rgba(91,108,255,0.55)]"
              >
                <span className="mb-4 flex size-9 items-center justify-center rounded-xl bg-accent-soft transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                  <Icon className="size-4 text-accent-hover" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold text-foreground">{skill.label}</h3>
                <p className="mt-1.5 text-sm leading-snug text-foreground-muted">{skill.body}</p>
              </motion.div>
            );
          })}
          <motion.p
            variants={reduce ? undefined : cardReveal}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-sm leading-relaxed text-foreground-subtle sm:col-span-2"
          >
            {english.note}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
