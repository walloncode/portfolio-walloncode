import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { Container } from "@/components/ui/container";
import { skillGroups, type SkillGroup } from "@/content/skills";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

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

/** Extra width (px) the card grows to when hovered on the looping track. */
const CARD_EXPAND = 50;

function GroupCard({
  group,
  index,
  layout = "track",
  expanded = false,
  reveal = true,
  onMouseEnter,
  onMouseLeave,
}: {
  group: SkillGroup;
  index: number;
  layout?: "track" | "grid";
  /** track only — hovered card grows and its text scales up */
  expanded?: boolean;
  /** grid uses the whileInView stagger; the looping track renders statically */
  reveal?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const Icon = group.icon;
  const isTrack = layout === "track";
  const revealProps = reveal
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: cardViewport,
        variants: staggerContainer(0.06, 0.05),
      }
    : {};

  const itemClass = cn(
    "rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-foreground-muted transition-all duration-200 hover:border-accent-border hover:bg-accent-soft hover:text-foreground",
    expanded ? "text-base" : "text-sm",
  );

  return (
    <motion.article
      {...revealProps}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={isTrack && expanded ? { width: `calc(26rem + ${CARD_EXPAND}px)` } : undefined}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border bg-white/[0.03] p-8 backdrop-blur-md",
        "shadow-[var(--shadow-glass)] transition-[width,border-color,box-shadow] duration-300 ease-out md:p-10",
        expanded ? "border-accent-border shadow-[0_30px_80px_-20px_rgba(124,92,255,0.35)]" : "border-white/[0.08]",
        isTrack ? "w-[78vw] shrink-0 sm:w-[26rem]" : "w-full",
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

        <h3
          className={cn(
            "mt-6 font-display font-semibold tracking-tight text-foreground transition-all duration-300",
            expanded ? "text-3xl md:text-[2.15rem]" : "text-2xl md:text-[1.75rem]",
          )}
        >
          {group.title}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-foreground-subtle transition-all duration-300",
            expanded ? "text-base" : "text-sm",
          )}
        >
          {group.caption}
        </p>
      </div>

      <ul className="relative mt-8 flex flex-wrap gap-2.5">
        {group.items.map((item) =>
          reveal ? (
            <motion.li key={item} variants={fadeUp} className={itemClass}>
              {item}
            </motion.li>
          ) : (
            <li key={item} className={itemClass}>
              {item}
            </li>
          ),
        )}
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
        <h2 className="title-std mt-3 text-foreground">
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

/** Base loop speed (px/s) once the mouse is far from the track. */
const LOOP_SPEED = 55;
/** Within this distance (px) from the track the loop starts slowing down. */
const PROXIMITY_RANGE = 280;
/** Slowest the loop crawls while the mouse hovers the band (never fully stops
 *  until a card is hovered). Kept high enough that it still turns at a decent
 *  pace when the pointer is near — only a hovered card brings it to a halt. */
const MIN_FACTOR = 0.45;

export function SkillsSection() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLSpanElement>(null);
  const [target, setTarget] = useState<HandoffTarget>({ x: 0, y: 0, scale: 0.42 });
  // Once the intro has handed off to the card track, unmount the overlay
  // completely — leaving it mounted let the big words linger as ghosts behind
  // the cards for the rest of the section.
  const [introMounted, setIntroMounted] = useState(true);

  // The intro used to be scrubbed by the scrollbar across a 520vh section. It
  // now runs on its own clock over the same 0→0.5 range, so every beat below
  // keeps its original timing relative to the others.
  const introProgress = useMotionValue(0);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });
  useEffect(() => {
    if (prefersReducedMotion || isMobile || !inView) return;
    const controls = animate(introProgress, 0.56, { duration: 3.4, ease: "linear" });
    return () => controls.stop();
  }, [inView, introProgress, prefersReducedMotion, isMobile]);

  useMotionValueEvent(introProgress, "change", (v) => {
    const next = v < 0.52;
    setIntroMounted((prev) => (prev === next ? prev : next));
  });

  // Measure where the intro "Skills" must land so it sits exactly on the track's
  // "Skills" heading (measured at rest, before the track is scrolled).
  useLayoutEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const measure = () => {
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

  // The track fades in under the landed "Skills". From there the cards loop on
  // their own clock: they crawl left forever, ease slower as the mouse nears,
  // and freeze on the hovered card (which grows + scales its text).
  const trackOpacity = useTransform(introProgress, [0.36, 0.46], [0, 1]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const setWidthRef = useRef(0);
  const speedRef = useRef(0); // eased current speed (px/s)
  const factorRef = useRef(1); // proximity multiplier (1 far → MIN_FACTOR near)
  const hoveredRef = useRef(false);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  // Measure the width of one card set so the second copy can seamlessly wrap.
  useLayoutEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const measure = () => {
      if (setRef.current) setWidthRef.current = setRef.current.offsetWidth;
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [prefersReducedMotion, isMobile]);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isMobile) return;
    // hold still until the intro has handed off to the track
    if (introProgress.get() < 0.46) return;
    const setW = setWidthRef.current;
    if (!setW) return;

    const dt = Math.min(delta, 64) / 1000;
    const targetSpeed = hoveredRef.current ? 0 : LOOP_SPEED * factorRef.current;
    // ease the current speed toward the target so slow-downs/stops feel smooth
    speedRef.current += (targetSpeed - speedRef.current) * Math.min(1, dt * 6);

    let next = x.get() - speedRef.current * dt;
    if (next <= -setW) next += setW;
    x.set(next);
  });

  // Mouse proximity → slower loop. Distance is measured to the track band, so
  // the closer the pointer gets the more it eases off.
  const onSectionMouseMove = (e: React.MouseEvent) => {
    const el = viewportRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = clamp(e.clientX, r.left, r.right);
    const ny = clamp(e.clientY, r.top, r.bottom);
    const dist = Math.hypot(e.clientX - nx, e.clientY - ny);
    factorRef.current = clamp(dist / PROXIMITY_RANGE, MIN_FACTOR, 1);
  };
  const onSectionMouseLeave = () => {
    factorRef.current = 1;
  };

  const onCardEnter = (title: string) => {
    hoveredRef.current = true;
    setHoveredTitle(title);
  };
  const onCardLeave = () => {
    hoveredRef.current = false;
    setHoveredTitle(null);
  };

  if (prefersReducedMotion || isMobile) {
    return <SkillsGrid />;
  }

  const renderSet = (dup: boolean) =>
    skillGroups.map((group, i) => (
      <GroupCard
        key={dup ? `${group.title}-dup` : group.title}
        group={group}
        index={i}
        reveal={false}
        expanded={hoveredTitle === group.title}
        onMouseEnter={() => onCardEnter(group.title)}
        onMouseLeave={onCardLeave}
      />
    ));

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative h-screen"
      onMouseMove={onSectionMouseMove}
      onMouseLeave={onSectionMouseLeave}
    >
      <div className="flex h-full flex-col justify-center overflow-hidden">
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
          <SkillsIntro progress={introProgress} target={target} skillsRef={skillsRef} />
        )}

        <motion.div
          style={{ opacity: trackOpacity }}
          className="relative flex items-center gap-6 pl-6 md:gap-10 md:pl-10"
        >
          {/* Heading panel — stays put; the intro "Skills" lands on it. */}
          <div className="flex w-[20rem] shrink-0 flex-col justify-center sm:w-[22rem]">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
              Capacidades
            </p>
            <h2 ref={headingRef} className="title-std mt-4 text-foreground">
              Skills
            </h2>
            <p className="subtext-std mt-5 max-w-sm text-foreground-muted">
              As áreas giram sozinhas — aproxime o mouse para desacelerar e passe sobre um card
              para pausar.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-foreground-subtle">
              <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
              <span className="font-mono text-xs uppercase tracking-wider">
                {skillGroups.length} áreas
              </span>
            </div>
          </div>

          {/* Looping card track — infinite horizontal marquee, two seamless copies. */}
          <div
            ref={viewportRef}
            className="relative min-w-0 flex-1 overflow-hidden py-4"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent, #000 3%, #000 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 3%, #000 92%, transparent)",
            }}
          >
            <motion.div style={{ x }} className="flex w-max items-stretch">
              <div ref={setRef} className="flex items-stretch gap-6 pr-6 md:gap-8 md:pr-8">
                {renderSet(false)}
              </div>
              <div aria-hidden="true" className="flex items-stretch gap-6 pr-6 md:gap-8 md:pr-8">
                {renderSet(true)}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
