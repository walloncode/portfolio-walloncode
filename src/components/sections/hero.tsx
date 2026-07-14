import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { FloatingLines } from "@/components/background/floating-lines";
import { profile } from "@/content/profile";
import portrait from "@/assets/portrait-cut.webp";

const NAME = "Wellyson";

const NAME_STYLE = {
  backgroundImage: "linear-gradient(180deg, #f5f5f7 0%, #6b6b74 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
} as const;

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const shaderOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const textStyle = prefersReducedMotion ? undefined : { y: textY, opacity: fade };

  const scrollTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden"
    >
      {/* Flowing-lines background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={prefersReducedMotion ? undefined : { opacity: shaderOpacity }}
      >
        <FloatingLines
          className="pointer-events-auto h-full w-full"
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[10, 15, 20]}
          lineDistance={[8, 6, 4]}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={!prefersReducedMotion}
          parallax={!prefersReducedMotion}
          animationSpeed={prefersReducedMotion ? 0 : 1}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_0%,transparent_45%,var(--color-canvas)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
      </motion.div>

      <Container className="relative z-30 flex min-h-[100svh] flex-col pb-8 pt-24">
        {/* Top meta row */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: fade }}
          className="flex items-start justify-between"
        >
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
        </motion.div>

        {/* Main split — text left, portrait right */}
        <div className="grid flex-1 items-end gap-6 md:grid-cols-2 md:items-center">
          {/* Left: name + role + info */}
          <motion.div
            style={textStyle}
            className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left"
          >
            <motion.h1
              aria-label={NAME}
              initial={prefersReducedMotion ? undefined : { x: -60, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="select-none font-sans text-6xl font-extrabold leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-8xl xl:text-[6.5rem]"
              style={NAME_STYLE}
            >
              {NAME}
            </motion.h1>

            <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-accent-hover sm:text-base">
              {profile.role}
            </p>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground-muted sm:text-base">
              Ariquemes, RO — sistemas de ponta a ponta, do agente de automação ao
              produto no ar.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-foreground-muted transition-colors hover:text-foreground"
              >
                github.com/{profile.handle}
              </a>
              <a
                href={profile.agencyUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-foreground-subtle transition-colors hover:text-foreground"
              >
                wkcode.com.br
              </a>
            </div>
          </motion.div>

          {/* Right: portrait */}
          <motion.div
            style={prefersReducedMotion ? undefined : { y: portraitY }}
            className="pointer-events-none order-1 flex h-full items-end justify-center md:order-2 md:justify-end"
          >
            <img
              src={portrait}
              alt="Wellyson Caetano"
              fetchPriority="high"
              className="h-[52vh] max-h-[720px] w-auto object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] md:h-[76vh]"
            />
          </motion.div>
        </div>
      </Container>

      {/* ground the figure into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-canvas to-transparent"
      />

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
