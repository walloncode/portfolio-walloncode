import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { OrbitalJourney } from "@/components/orbital-journey";
import { journey } from "@/content/journey";

export function JourneySection() {
  return (
    <section id="journey" className="relative py-24 md:py-28">
      <Container>
        <div className="mx-auto mb-6 max-w-xl text-center">
          <AnimatedText text="Percurso" textClassName="text-foreground" />
          <Reveal delay={0.2}>
            <p className="subtext-std mt-8 text-foreground-muted">
              Da base aos produtos no ar
            </p>
          </Reveal>
        </div>
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
