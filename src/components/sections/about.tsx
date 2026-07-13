import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { Compass, LayoutTemplate, Lock, Rocket, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

interface Step {
  icon: LucideIcon;
  label: string;
  body: string;
  /** absolute position + width on the desktop 3D scene */
  scene: string;
  anim: string;
}

const STEPS: Step[] = [
  {
    icon: Compass,
    label: "Entender",
    body: "Modelo o problema antes da primeira linha — quem usa e em que condição, inclusive sem internet.",
    scene: "top-[11%] left-[8%] w-52",
    anim: "anim-float",
  },
  {
    icon: LayoutTemplate,
    label: "Arquitetar",
    body: "Separo o que precisa ser determinístico do que se beneficia de IA. Decisões explícitas e auditáveis.",
    scene: "top-[39%] left-[31%] w-60",
    anim: "anim-float-delayed",
  },
  {
    icon: Lock,
    label: "Blindar",
    body: "Segurança no escopo inicial: isolamento, brute-force, headers. Nunca como adendo.",
    scene: "top-[60%] right-[7%] w-56",
    anim: "anim-float-slow",
  },
  {
    icon: Rocket,
    label: "Entregar",
    body: "Produto no ar para cliente real, mensurável. O que não roda, não sobe.",
    scene: "bottom-[8%] left-[15%] w-52",
    anim: "anim-drift",
  },
];

const TAGS = ["Arquitetura auditável", "Segurança no escopo", "Offline-first", "IA sob gate"];

const GLASS =
  "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]";

const SPOT_REST = "radial-gradient(650px circle at 20% 30%, rgba(255,255,255,0.06), transparent 40%)";

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
        <Icon className="size-3.5 text-accent-hover" aria-hidden="true" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-hover">
        {step.label}
      </span>
    </div>
  );
}

export function About() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(255,255,255,0.09), transparent 45%)`;
    }
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    if (groupRef.current) {
      groupRef.current.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
    }
  };

  const onLeave = () => {
    if (spotRef.current) spotRef.current.style.background = SPOT_REST;
    if (groupRef.current) groupRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <section id="about" className="relative py-28 md:py-36">
      <Container>
        <Reveal>
          <div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.07] bg-canvas-elevated shadow-[var(--shadow-elevated)]"
          >
            {/* Static ambient background — no moving shader */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_18%_20%,rgba(91,108,255,0.14),transparent_60%)]" />
              <div className="absolute inset-0 bg-canvas-elevated/55" />
              <div className="absolute inset-0 bg-[radial-gradient(130%_130%_at_12%_35%,var(--color-canvas-elevated)_18%,transparent_65%)]" />
            </div>

            <div
              ref={spotRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 opacity-70 transition-[background] duration-200 ease-out"
              style={{ background: SPOT_REST }}
            />

            <div className="relative z-10 flex flex-col md:min-h-[520px] md:flex-row">
              {/* Left — copy */}
              <div className="flex flex-1 flex-col justify-center p-8 md:p-12 lg:p-16">
                <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    Processo
                  </span>
                </div>

                <h2
                  className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem] md:text-[3rem]"
                  style={{
                    backgroundImage: "linear-gradient(180deg, #ffffff 0%, #a3a3ad 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  Como eu trabalho
                </h2>

                <p className="mt-6 max-w-md text-2xl font-normal leading-relaxed text-foreground-muted">
                  Do problema à entrega, cada decisão passa por modelagem, arquitetura e
                  segurança — priorizando o que é auditável sobre o que é mágico.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="cursor-default rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm text-foreground-muted transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-accent-border hover:bg-accent-soft hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — 3D floating scene (desktop) */}
              <div className="relative hidden flex-1 overflow-hidden [perspective:1200px] md:block">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                  }}
                />

                <div
                  ref={groupRef}
                  className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-150 ease-out"
                >
                  {STEPS.map((step) => (
                    <div key={step.label} className={cn("absolute p-4", GLASS, step.scene, reduce ? "" : step.anim)}>
                      <div className="mb-3">
                        <StepCard step={step} />
                      </div>
                      <p className="text-sm leading-snug text-foreground-muted">{step.body}</p>
                    </div>
                  ))}

                  {/* central cursor */}
                  <div className="pointer-events-none absolute left-[56%] top-[47%] -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-sm",
                          reduce ? "" : "anim-float",
                        )}
                      >
                        <div className="size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      </div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-foreground-subtle opacity-70">
                        compilando…
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile — stacked steps (readable, no absolute scene) */}
              <div className="space-y-3 px-8 pb-10 md:hidden">
                {STEPS.map((step) => (
                  <div key={step.label} className={cn("p-4", GLASS)}>
                    <div className="mb-2">
                      <StepCard step={step} />
                    </div>
                    <p className="text-sm leading-snug text-foreground-muted">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* at-a-glance facts */}
        <Reveal delay={0.1}>
          <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            {profile.atAGlance.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-foreground-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
