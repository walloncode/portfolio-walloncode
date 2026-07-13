import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "motion/react";
import { Lock, ArrowRight, Sparkles, Palette, Rocket } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import wkcodeHero from "@/assets/projects/wkcode-hero.webp";

const URL_PREFIX = "https://";
const URL_TYPED = "www.wkcode.com.br";
const AGENCY_URL = profile.agencyUrl;

const HIGHLIGHTS = [
  { icon: Rocket, label: "Sites em produção", desc: "Do protótipo ao ar, para clientes reais." },
  { icon: Palette, label: "Design + Engenharia", desc: "Identidade visual e código na mesma casa." },
  { icon: Sparkles, label: "Feito sob medida", desc: "Cada projeto nasce do negócio do cliente." },
] as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** The reusable browser window mockup. `typed` controls how much of the URL is
 *  written into the address bar; `loaded` reveals the rendered page inside it. */
function BrowserWindow({ typed, loaded }: { typed: string; loaded: boolean }) {
  const caretVisible = typed.length < URL_TYPED.length;
  return (
    <div className="w-[min(760px,90vw)] overflow-hidden rounded-[var(--radius-lg)] border border-white/[0.1] bg-canvas-elevated shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
      {/* chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-surface/70 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        {/* address bar */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-canvas/80 px-3.5 py-1.5">
          <Lock className="size-3.5 shrink-0 text-[#28c840]" aria-hidden="true" />
          <span className="truncate font-mono text-xs sm:text-sm">
            <span className="text-foreground-subtle">{URL_PREFIX}</span>
            <span className="text-foreground">{typed}</span>
            {caretVisible && (
              <span className="ml-0.5 inline-block h-[1em] w-[1.5px] translate-y-[2px] animate-pulse bg-accent-hover align-middle" />
            )}
          </span>
        </div>
      </div>

      {/* viewport — the "loaded" wkcode landing (real screenshot) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-canvas">
        <motion.img
          src={wkcodeHero}
          alt="Página inicial da WKCODE"
          initial={false}
          animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.05 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 size-full object-cover object-top"
          draggable={false}
        />

        {/* pre-load "blank tab" state */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-foreground-subtle">
            <span className="font-mono">nova aba</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** The company pitch revealed once the parallax completes. */
function AgencyPitch() {
  return (
    <div className="mx-auto w-[min(920px,92vw)] text-center">
      <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
        WKCODE
      </p>
      <h3 className="mx-auto mt-3 max-w-2xl font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-3xl">
        A agência por trás do código
      </h3>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground-muted">
        A WKCODE é a minha agência de desenvolvimento — sites e sistemas sob medida, do design
        à produção. Já entregamos projetos reais para clientes como a Kiuseven Energia Solar,
        com foco em performance, identidade visual e código que sustenta o negócio.
      </p>

      <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className="rounded-[var(--radius-md)] border border-border bg-surface/50 p-4 text-left"
            >
              <Icon className="size-4 text-accent-hover" aria-hidden="true" />
              <p className="mt-2.5 text-sm font-medium text-foreground">{h.label}</p>
              <p className="mt-1 text-xs leading-snug text-foreground-subtle">{h.desc}</p>
            </div>
          );
        })}
      </div>

      <Button variant="accent" asChild className="mt-8">
        <a href={AGENCY_URL} target="_blank" rel="noreferrer">
          Visitar wkcode.com.br
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </Button>
    </div>
  );
}

/** Scroll-driven typing parallax: a browser types out the WKCODE address as you
 *  scroll; when the URL lands, the page "loads" and the agency pitch rises up. */
function WkPortal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [typedCount, setTypedCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [pitchActive, setPitchActive] = useState(false);

  // Manual, viewport-agnostic scroll progress (same approach as the GitHub
  // portal): a linear (-rect.top) / (height - viewportHeight).
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

  // Characters typed track scroll across the "typing" window.
  const charProgress = useTransform(scrollYProgress, [0.06, 0.46], [0, URL_TYPED.length]);
  useMotionValueEvent(charProgress, "change", (v) => {
    setTypedCount(clamp(Math.round(v), 0, URL_TYPED.length));
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setLoaded(v > 0.5);
    setPitchActive(v > 0.64);
  });

  // The computer eases up and fades out, handing the stage to the pitch —
  // a crossfade avoids the two ever overlapping.
  const computerScale = useTransform(scrollYProgress, [0, 0.5, 0.85], [0.94, 1, 0.86]);
  const computerY = useTransform(scrollYProgress, [0.5, 0.85], [0, -48]);
  const computerOpacity = useTransform(scrollYProgress, [0.6, 0.76], [1, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 0.55], [0.9, 1.5]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.75], [0.35, 0.6, 0.22]);

  // Pitch rises into the center as the computer clears.
  const pitchOpacity = useTransform(scrollYProgress, [0.64, 0.82], [0, 1]);
  const pitchY = useTransform(scrollYProgress, [0.64, 0.9], [48, 0]);

  // Hint fades once typing begins.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);

  const typed = URL_TYPED.slice(0, typedCount);

  return (
    <section ref={sectionRef} id="wk" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* ambient glow */}
        <motion.div
          aria-hidden="true"
          style={{ scale: glowScale, opacity: glowOpacity }}
          className="pointer-events-none absolute size-[46vmin] rounded-full blur-[90px]"
        >
          <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(91,108,255,0.85),rgba(124,92,255,0.2)_55%,transparent_72%)]" />
        </motion.div>

        {/* the computer */}
        <motion.div
          style={{ scale: computerScale, y: computerY, opacity: computerOpacity }}
          className="relative z-10 flex flex-col items-center will-change-transform"
        >
          <BrowserWindow typed={typed} loaded={loaded} />
          {/* laptop base */}
          <div className="relative -mt-px h-3 w-[min(820px,96vw)] rounded-b-xl bg-gradient-to-b from-surface to-canvas-elevated shadow-[0_18px_30px_-16px_rgba(0,0,0,0.8)]">
            <div className="absolute left-1/2 top-0 h-1.5 w-24 -translate-x-1/2 rounded-b-lg bg-canvas/80" />
          </div>
        </motion.div>

        {/* scroll hint */}
        {!pitchActive && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-10 z-20 flex flex-col items-center gap-2 text-foreground-subtle"
          >
            <span className="font-mono text-xs uppercase tracking-wider">role para digitar o endereço</span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-lg"
            >
              ↓
            </motion.span>
          </motion.div>
        )}

        {/* agency pitch — revealed by the resolved URL */}
        <motion.div
          style={{ opacity: pitchOpacity, y: pitchY, pointerEvents: pitchActive ? "auto" : "none" }}
          className="absolute inset-0 z-20 flex items-center justify-center px-4 will-change-transform"
        >
          <AgencyPitch />
        </motion.div>
      </div>
    </section>
  );
}

/** Calm, non-pinned fallback for reduced-motion users. */
function WkStatic() {
  return (
    <section id="wk" className="relative py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto mb-10 max-w-xl text-center">
          <SectionHeading
            eyebrow="WKCODE"
            title="A agência por trás do código"
            className="md:static"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <GlassPanel className="mx-auto max-w-3xl overflow-hidden p-1.5">
            <BrowserWindow typed={URL_TYPED} loaded />
          </GlassPanel>
        </Reveal>

        <div className="mt-10">
          <Reveal delay={0.1}>
            <AgencyPitch />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function WkSection() {
  const reduce = useReducedMotion();
  if (reduce) return <WkStatic />;
  return <WkPortal />;
}
