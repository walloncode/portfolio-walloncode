import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Container } from "@/components/ui/container";
import { skillGroups, type SkillGroup } from "@/content/skills";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Measure how far the track must slide so the last card rests at the right edge.
  useLayoutEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [prefersReducedMotion, isMobile]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  if (prefersReducedMotion || isMobile) {
    return <SkillsGrid />;
  }

  return (
    <section ref={sectionRef} id="skills" className="relative h-[320vh]">
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

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-stretch gap-6 pl-6 pr-[10vw] will-change-transform md:gap-8 md:pl-10"
        >
          {/* Intro panel — slides out to the left as the cards arrive from the right */}
          <div className="flex w-[80vw] shrink-0 flex-col justify-center sm:w-[30rem]">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
              Capacidades
            </p>
            <h2 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[3.25rem] lg:text-[3.5rem]">
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
