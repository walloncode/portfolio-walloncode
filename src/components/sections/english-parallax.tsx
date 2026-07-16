import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Languages } from "lucide-react";
import { English3DPanel } from "@/components/sections/english-3d-panel";
import { EnglishSection, CefrScale } from "@/components/sections/english-section";
import { english } from "@/content/english";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

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

/** Pops in centered, holds a beat, then travels to its left slot and shrinks.
 *  Same journey the scrollbar used to scrub, now on its own clock. */
const glyph: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -28, x: "0vw", y: "0vh" },
  show: {
    opacity: 1,
    rotate: 0,
    scale: [0.4, 1, 0.88],
    x: ["0vw", "0vw", "-30vw"],
    y: ["0vh", "0vh", "-6vh"],
    transition: {
      opacity: { duration: 0.4, ease: "easeOut" },
      rotate: { duration: 0.7, ease: EASE },
      default: { duration: 1.7, times: [0, 0.38, 1], ease: EASE },
    },
  },
};

const title: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 1.35, ease: EASE } },
};

const board: Variants = {
  hidden: { opacity: 0, x: 64 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 1.1, ease: EASE } },
};

/** Self-running English intro: the translator glyph appears centered, slides to
 *  the left (and stays there), while the level card + interactive panel resolve
 *  on the right. */
function EnglishPortal() {
  const [boardActive, setBoardActive] = useState(false);

  return (
    <section id="english" className="relative overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative h-screen"
      >
        {/* translator glyph — center → left */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div variants={glyph} className="will-change-transform">
            <TranslatorGlyph className="size-[24vmin]" />
          </motion.div>
        </div>

        {/* left title, under the glyph */}
        <motion.div variants={title} className="absolute left-[7vw] top-[58%] w-[34vw] max-w-md">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
            {english.eyebrow}
          </p>
          <h2 className="title-std mt-2 text-foreground">{english.title}</h2>
          <p className="subtext-std mt-3 text-foreground-muted">{english.lead}</p>
        </motion.div>

        {/* right board — level card + interactive panel. Stays inert until it
            has finished travelling, so clicks can't land on a moving target. */}
        <motion.div
          variants={board}
          onAnimationComplete={() => setBoardActive(true)}
          style={{ pointerEvents: boardActive ? "auto" : "none" }}
          className="absolute right-[4vw] top-1/2 w-[52vw] max-w-[620px] -translate-y-1/2 will-change-transform"
        >
          <EnglishBoard />
        </motion.div>
      </motion.div>
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
