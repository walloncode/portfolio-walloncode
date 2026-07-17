import { Suspense, lazy } from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedText } from "@/components/ui/animated-text";
import { OrbitalJourney } from "@/components/orbital-journey";
import { journey } from "@/content/journey";

// Heavy WebGL (three) nebula — below the fold, so load it lazily and keep three
// out of the initial bundle.
const CelestialSphere = lazy(() =>
  import("@/components/ui/celestial-sphere").then((m) => ({ default: m.CelestialSphere })),
);

export function JourneySection() {
  const reduce = useReducedMotion();
  return (
    <section id="journey" className="relative overflow-hidden py-24 md:py-28">
      {/* Nebula backdrop — WebGL shader behind the orbital map */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {!reduce && (
          <Suspense fallback={null}>
            <CelestialSphere
              hue={248}
              speed={0.3}
              zoom={1.3}
              particleSize={3.2}
              className="absolute inset-0 h-full w-full"
            />
          </Suspense>
        )}
        {/* scrim keeps the copy readable, gradient blends into the sections
            above and below */}
        <div className="absolute inset-0 bg-canvas/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas" />
      </div>

      <Container className="relative z-10">
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
