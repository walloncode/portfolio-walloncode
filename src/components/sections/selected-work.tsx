import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCardStack } from "@/components/project-card-stack";
import { featuredProjects, secondaryProjects } from "@/content/projects";

const orderedProjects = [...featuredProjects, ...secondaryProjects];

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
            Arraste o card, use as setas ou as teclas ← → para navegar.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ProjectCardStack projects={orderedProjects} />
        </Reveal>
      </Container>
    </section>
  );
}
