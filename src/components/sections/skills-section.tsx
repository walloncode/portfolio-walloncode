import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { Container } from "@/components/ui/container";
import { skillGroups, type SkillGroup } from "@/content/skills";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HandoffTarget {
  x: number;
  y: number;
  scale: number;
}

/** Intro beat: a big "S" becomes three S-words (Skills / Software / System),
 *  they fuse back into "Skills", and it slides to land exactly on the track's
 *  "Skills" heading (measured via `target`). */
function SkillsIntro({
  progress,
  target,
  skillsRef,
}: {
  progress: MotionValue<number>;
  target: HandoffTarget;
  skillsRef: React.RefObject<HTMLSpanElement | null>;
}) {
  // the single S pops in, then dissolves as the three words arrive
  const sOpacity = useTransform(progress, [0, 0.04, 0.1, 0.15], [0, 1, 1, 0]);
  const sScale = useTransform(progress, [0, 0.08], [0.35, 1]);

  // the three-word block fades in
  const blockOpacity = useTransform(progress, [0.1, 0.16], [0, 1]);

  // fuse: Software + System collapse up into Skills
  const softOpacity = useTransform(progress, [0.18, 0.26], [1, 0]);
  const softY = useTransform(progress, [0.18, 0.26], ["0%", "-100%"]);
  const sysOpacity = useTransform(progress, [0.18, 0.25], [1, 0]);
  const sysY = useTransform(progress, [0.18, 0.26], ["0%", "-200%"]);

  // Skills slides to sit exactly on the measured heading slot (while the track
  // is still stationary), then the overlay crossfades into the real heading.
  const skillsX = useTransform(progress, [0.28, 0.4], [0, target.x]);
  const skillsY = useTransform(progress, [0.28, 0.4], [0, target.y]);
  const skillsScale = useTransform(progress, [0.28, 0.4], [1, target.scale]);

  const overlayOpacity = useTransform(progress, [0.42, 0.5], [1, 0]);

  return (
    <motion.div
      style={{ opacity: overlayOpacity }}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      {/* single S */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.span
          style={{ opacity: sOpacity, scale: sScale }}
          className="block font-display text-[26vw] font-extrabold leading-none tracking-[-0.04em] text-foreground [text-shadow:0_10px_60px_rgba(124,92,255,0.5)]"
        >
          S
        </motion.span>
      </div>

      {/* three words → fuse to Skills */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          style={{ opacity: blockOpacity }}
          className="flex flex-col items-start font-display text-[9vw] font-extrabold leading-[0.98] tracking-[-0.03em]"
        >
          <motion.span
            ref={skillsRef}
            style={{ x: skillsX, y: skillsY, scale: skillsScale }}
            className="origin-top-left text-foreground [text-shadow:0_10px_50px_rgba(124,92,255,0.45)]"
          >
            Skills
          </motion.span>
          <motion.span style={{ opacity: softOpacity, y: softY }} className="text-foreground-muted">
            Software
          </motion.span>
          <motion.span style={{ opacity: sysOpacity, y: sysY }} className="text-foreground-muted">
            System
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

const cardViewport = { once: false, amount: 0.35 } as const;

function GroupCard({
  group,
  index,
  layout = "track",
}: {
  group: SkillGroup;
  index: number;
  layout?: "track" | "grid";
}) {
  const Icon = group.icon;
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={cardViewport}
      variants={staggerContainer(0.06, 0.05)}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md",
        "shadow-[var(--shadow-glass)] md:p-10",
        layout === "track" ? "w-[78vw] shrink-0 sm:w-[26rem]" : "w-full",
      )}
    >
      {/* soft glow that echoes the accent, stronger on the first cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,255,0.28), rgba(91,108,255,0.10) 45%, transparent 70%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl border border-accent-border bg-accent-soft">
            <Icon className="size-5 text-accent-hover" aria-hidden="true" />
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-accent-hover">
            0{index + 1}
          </span>
        </div>

        <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
          {group.title}
        </h3>
        <p className="mt-1.5 text-sm text-foreground-subtle">{group.caption}</p>
      </div>

      <ul className="relative mt-8 flex flex-wrap gap-2.5">
        {group.items.map((item) => (
          <motion.li
            key={item}
            variants={fadeUp}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-sm text-foreground-muted transition-colors duration-200 hover:border-accent-border hover:bg-accent-soft hover:text-foreground"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.article>
  );
}

/** Static fallback for mobile / reduced-motion — no pinning, calm vertical grid. */
function SkillsGrid() {
  return (
    <section id="skills" className="relative py-24">
      <Container>
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
          Capacidades
        </p>
        <h2 className="mt-3 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[2.5rem] md:text-[3rem]">
          Skills
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <GroupCard key={group.title} group={group} index={i} layout="grid" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SkillsSection() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);
  const [target, setTarget] = useState<HandoffTarget>({ x: 0, y: 0, scale: 0.42 });
  // Once the intro has handed off to the card track, unmount the overlay
  // completely — leaving it mounted let the big words linger as ghosts behind
  // the cards for the rest of the section.
  const [introMounted, setIntroMounted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.52;
    setIntroMounted((prev) => (prev === next ? prev : next));
  });

  // Measure the track slide distance + where the intro "Skills" must land so it
  // sits exactly on the track's "Skills" heading (measured at rest, progress≈0).
  useLayoutEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
      const h = headingRef.current;
      const s = skillsRef.current;
      if (h && s) {
        const hr = h.getBoundingClientRect();
        const sr = s.getBoundingClientRect();
        if (sr.height > 0) {
          setTarget({
            x: hr.left - sr.left,
            y: hr.top - sr.top,
            scale: hr.height / sr.height,
          });
        }
      }
    };
    measure();
    // re-measure once the display font is ready so the handoff lands precisely
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [prefersReducedMotion, isMobile]);

  // The track fades in under the landed "Skills" (still stationary), then only
  // starts sliding once the intro has fully handed off.
  const x = useTransform(scrollYProgress, [0.5, 1], [0, -distance]);
  const trackOpacity = useTransform(scrollYProgress, [0.36, 0.46], [0, 1]);

  if (prefersReducedMotion || isMobile) {
    return <SkillsGrid />;
  }

  return (
    <section ref={sectionRef} id="skills" className="relative h-[280vh] md:h-[520vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* purple ambient glow, echoing the reference panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,92,255,0.22), rgba(91,108,255,0.08) 40%, transparent 68%)",
          }}
        />

        {/* intro: S → 3 words → Skills → lands on the track heading */}
        {introMounted && (
          <SkillsIntro progress={scrollYProgress} target={target} skillsRef={skillsRef} />
        )}

        <motion.div
          ref={trackRef}
          style={{ x, opacity: trackOpacity }}
          className="flex items-stretch gap-6 pl-6 pr-[10vw] will-change-transform md:gap-8 md:pl-10"
        >
          {/* Intro panel — slides out to the left as the cards arrive from the right */}
          <div className="flex w-[80vw] shrink-0 flex-col justify-center sm:w-[30rem]">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
              Capacidades
            </p>
            <h2
              ref={headingRef}
              className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[3.25rem] lg:text-[3.5rem]"
            >
              Skills
            </h2>
            <p className="mt-5 max-w-sm text-2xl font-normal leading-relaxed text-foreground-muted">
              Role para a lateral — as capacidades entram da direita, do técnico ao
              humano.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-foreground-subtle">
              <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
              <span className="font-mono text-xs uppercase tracking-wider">
                {skillGroups.length} áreas
              </span>
            </div>
          </div>

          {skillGroups.map((group, i) => (
            <GroupCard key={group.title} group={group} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
