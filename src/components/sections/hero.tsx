import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ShaderField } from "@/components/background/shader-field";
import { profile } from "@/content/profile";
import portrait from "@/assets/portrait-cut.webp";

const NAME = "Wellyson";
// Central glyphs that sit over the figure → rendered as outline so he shows
// through them; the outer glyphs stay solid. (l, l, y, s)
const OUTLINE = new Set([2, 3, 4, 5]);

const SOLID_STYLE = {
  backgroundImage: "linear-gradient(180deg, #f5f5f7 0%, #6b6b74 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
} as const;

const OUTLINE_STYLE = {
  WebkitTextFillColor: "transparent",
  color: "transparent",
  WebkitTextStroke: "2px rgba(245,245,247,0.55)",
} as const;

/** The name, sitting in front of the figure: outer glyphs solid, the central
 *  glyphs that overlap him rendered as transparent outlines. */
function Wordmark() {
  return (
    <>
      {NAME.split("").map((ch, i) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={OUTLINE.has(i) ? OUTLINE_STYLE : SOLID_STYLE}
        >
          {ch}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const wordY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const shaderOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const wordStyle = prefersReducedMotion ? undefined : { y: wordY, opacity: fade };

  const scrollTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  const wordClasses =
    "absolute bottom-[19%] left-0 right-0 select-none px-2 text-center font-sans text-[23vw] font-extrabold leading-[0.8] tracking-[-0.04em] md:text-[16vw] lg:text-[15rem]";

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-8 pt-24"
    >
      {/* Waves background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={prefersReducedMotion ? undefined : { opacity: shaderOpacity }}
      >
        <ShaderField className="h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_0%,transparent_45%,var(--color-canvas)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
      </motion.div>

      {/* Top meta row */}
      <motion.div style={prefersReducedMotion ? undefined : { opacity: fade }} className="relative z-30">
        <Container className="flex items-start justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1.5 text-xs font-medium text-foreground-muted backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Aberto a novos projetos
          </div>
          <a
            href="#work"
            onClick={scrollTo("work")}
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground-muted transition-colors hover:text-foreground"
          >
            Ver projetos
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </Container>
      </motion.div>

      {/* Center stage */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        {/* the figure */}
        <motion.img
          src={portrait}
          alt="Wellyson Caetano"
          fetchPriority="high"
          style={prefersReducedMotion ? undefined : { y: portraitY }}
          className="relative z-20 h-[78%] max-h-[780px] w-auto object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        />

        {/* the name — in front of the figure; central glyphs outlined so he
            shows through them */}
        <motion.h1
          aria-label={NAME}
          style={wordStyle}
          initial={prefersReducedMotion ? undefined : { x: "-100%" }}
          animate={prefersReducedMotion ? undefined : { x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`z-30 ${wordClasses}`}
        >
          <Wordmark />
        </motion.h1>

        {/* ground the figure into the page */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-t from-canvas to-transparent"
        />
      </div>

      {/* Bottom meta row */}
      <motion.div style={prefersReducedMotion ? undefined : { opacity: fade }} className="relative z-30">
        <Container className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-accent-hover">{profile.role}</p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-foreground-muted">
              Ariquemes, RO — sistemas de ponta a ponta, do agente de automação ao produto no ar.
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="block font-mono text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              github.com/{profile.handle}
            </a>
            <a
              href={profile.agencyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block font-mono text-sm text-foreground-subtle transition-colors hover:text-foreground"
            >
              wkcode.com.br
            </a>
          </div>
        </Container>
      </motion.div>

      {!prefersReducedMotion && (
        <motion.div
          style={{ opacity: fade }}
          className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 text-foreground-subtle"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="size-4" aria-hidden="true" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
