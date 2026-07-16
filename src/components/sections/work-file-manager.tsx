import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MorphingCardStack, type MorphCard } from "@/components/ui/morphing-card-stack";
import { StatusBadge } from "@/components/project-card";
import { featuredProjects, secondaryProjects } from "@/content/projects";
import { elasticSlide } from "@/lib/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const orderedProjects = [...featuredProjects, ...secondaryProjects];

const cards: MorphCard[] = orderedProjects.map((p) => ({
  id: p.slug,
  title: p.title,
  description: p.tagline,
  image: p.image,
  meta: p.year,
  href: `/projects/${p.slug}`,
  badge: <StatusBadge status={p.status} />,
}));

/** Work section — the opening question rises in, and the card pile lands right
 *  after it in the same space. */
export function WorkFileManager() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="relative overflow-hidden py-24 md:py-28">
      {/* ambient glow behind the headline */}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.3, ease: EASE }}
        className="pointer-events-none absolute left-1/2 top-16 -z-10 size-[60vmin] -translate-x-1/2 rounded-full blur-[55px] sm:blur-[100px]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(91,108,255,0.55),transparent_70%)]" />
      </motion.div>

      <Container>
        <div className="mx-auto max-w-xl text-center">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="title-std text-foreground [text-shadow:0_8px_40px_rgba(91,108,255,0.4)]"
          >
            Quer ver meus trabalhos?
          </motion.h2>

          <Reveal variants={elasticSlide} delay={0.15}>
            <p className="mx-auto mt-6 max-w-sm text-sm text-foreground-subtle">
              Alterne entre pilha, grade e lista. Na pilha, arraste o card para navegar.
            </p>
          </Reveal>
        </div>

        {/* the pile lands in the same space, just after the line */}
        <Reveal variants={elasticSlide} delay={0.3} className="mt-14">
          <MorphingCardStack cards={cards} />
        </Reveal>
      </Container>
    </section>
  );
}
