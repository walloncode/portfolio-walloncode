import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Continuity beat between the hero and the work showcase — just the question,
 *  on an ambient glow. */
export function WorkFileManager() {
  const reduce = useReducedMotion();

  return (
    <section
      id="work-intro"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24"
    >
      {/* ambient glow */}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.3, ease: EASE }}
        className="pointer-events-none absolute size-[60vmin] rounded-full blur-[55px] sm:blur-[100px]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(91,108,255,0.55),transparent_70%)]" />
      </motion.div>

      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="title-std relative z-10 px-6 text-center text-foreground [text-shadow:0_8px_40px_rgba(91,108,255,0.4)]"
      >
        Quer ver meus trabalhos?
      </motion.h2>
    </section>
  );
}
