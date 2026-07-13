import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { MorphingCardStack, type MorphCard } from "@/components/ui/morphing-card-stack";
import { StatusBadge } from "@/components/project-card";
import { featuredProjects, secondaryProjects } from "@/content/projects";

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

export function SelectedWork() {
  return (
    <section id="work" className="relative py-28 md:py-36">
      <Container>
        <Reveal className="mx-auto mb-4 max-w-xl text-center">
          <SectionHeading
            eyebrow="Trabalho selecionado"
            title="Projetos que carregam uma decisão de arquitetura"
            className="md:static"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mb-12 max-w-sm text-center text-sm text-foreground-subtle">
            Alterne entre pilha, grade e lista. Na pilha, arraste o card para navegar.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <MorphingCardStack cards={cards} />
        </Reveal>
      </Container>
    </section>
  );
}
