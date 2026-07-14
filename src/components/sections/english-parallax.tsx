import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "motion/react";
import { Languages } from "lucide-react";
import { English3DPanel } from "@/components/sections/english-3d-panel";
import { EnglishSection, CefrScale } from "@/components/sections/english-section";
import { english } from "@/content/english";
import { cn } from "@/lib/utils";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** The translator glyph — a big translate mark with an ambient glow. */
function TranslatorGlyph({ className }: { className?: string }) {
  return (
    <div className={cn("relative grid place-items-center", className)}>
      <div className="absolute inset-[-30%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(91,108,255,0.45),rgba(124,92,255,0.12)_55%,transparent_72%)] blur-2xl" />
      <Languages
        className="size-full text-accent-hover [filter:drop-shadow(0_12px_32px_rgba(91,108,255,0.55))]"
        aria-hidden="true"
      />
    </div>
  );
}

/** The level card + interactive panel that settle on the right. */
function EnglishBoard() {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <CefrScale />
      </div>
      <div className="mt-6">
        <English3DPanel flat />
      </div>
    </div>
  );
}

/** Scroll-driven English intro: the translator glyph appears centered, slides
 *  to the left (and stays pinned there), while the level card + interactive
 *  panel resolve on the right. */
function EnglishPortal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [boardActive, setBoardActive] = useState(false);

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

  useMotionValueEvent(scrollYProgress, "change", (v) => setBoardActive(v > 0.6));

  // Glyph: pops in centered, then slides to the left slot and holds.
  const glyphOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const glyphScale = useTransform(scrollYProgress, [0, 0.14, 0.5], [0.4, 1, 0.88]);
  const glyphRotate = useTransform(scrollYProgress, [0, 0.16], [-28, 0]);
  const glyphX = useTransform(scrollYProgress, [0.24, 0.5], ["0vw", "-30vw"]);
  const glyphY = useTransform(scrollYProgress, [0.24, 0.5], ["0vh", "-6vh"]);

  // Left title block fades in below the glyph once it lands.
  const titleOpacity = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.5, 0.7], [28, 0]);

  // Right board slides in.
  const boardOpacity = useTransform(scrollYProgress, [0.44, 0.66], [0, 1]);
  const boardX = useTransform(scrollYProgress, [0.44, 0.7], [64, 0]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]);

  return (
    <section ref={sectionRef} id="english" className="relative h-[140vh] md:h-[240vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* translator glyph — center → left */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            style={{ x: glyphX, y: glyphY, scale: glyphScale, rotate: glyphRotate, opacity: glyphOpacity }}
            className="will-change-transform"
          >
            <TranslatorGlyph className="size-[24vmin]" />
          </motion.div>
        </div>

        {/* left title, under the glyph */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute left-[7vw] top-[58%] w-[34vw] max-w-md"
        >
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
            {english.eyebrow}
          </p>
          <h2 className="title-std mt-2 text-foreground">
            {english.title}
          </h2>
          <p className="subtext-std mt-3 text-foreground-muted">{english.lead}</p>
        </motion.div>

        {/* right board — level card + interactive panel */}
        <motion.div
          style={{ opacity: boardOpacity, x: boardX, pointerEvents: boardActive ? "auto" : "none" }}
          className="absolute right-[4vw] top-1/2 w-[52vw] max-w-[620px] -translate-y-1/2 will-change-transform"
        >
          <EnglishBoard />
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-foreground-subtle"
        >
          <span className="font-mono text-xs uppercase tracking-wider">role para traduzir</span>
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

export function EnglishParallax() {
  const reduce = useReducedMotion();
  const isNarrow =
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;

  // The center→left / right split needs width; on narrow screens (and for
  // reduced motion) fall back to the calm stacked section.
  if (reduce || isNarrow) return <EnglishSection />;
  return <EnglishPortal />;
}
