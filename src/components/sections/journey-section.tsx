import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { OrbitalJourney } from "@/components/orbital-journey";
import { journey } from "@/content/journey";

export function JourneySection() {
  return (
    <section id="journey" className="relative py-24 md:py-28">
      <Container>
        <Reveal className="mx-auto mb-4 max-w-xl text-center">
          <SectionHeading
            eyebrow="Percurso"
            title="Da base aos produtos no ar"
            className="md:static"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mb-6 max-w-md text-center text-sm text-foreground-subtle">
            Clique em um nó para explorar. Cada ponto se conecta ao próximo — da
            formação e do inglês ao craft e à entrega.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <OrbitalJourney nodes={journey} />
        </Reveal>
      </Container>
    </section>
  );
}
