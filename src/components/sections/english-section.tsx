import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/section-heading";
import { English3DPanel } from "@/components/sections/english-3d-panel";
import { english, CEFR_SCALE, CEFR_CURRENT, CEFR_LABEL } from "@/content/english";
import { cn } from "@/lib/utils";

const currentIndex = CEFR_SCALE.indexOf(CEFR_CURRENT);

/** CEFR ladder — levels up to and including the current one are filled. */
export function CefrScale() {
  return (
    <div>
      <div className="flex items-end gap-1.5">
        {CEFR_SCALE.map((level, i) => {
          const reached = i <= currentIndex;
          const isCurrent = level === CEFR_CURRENT;
          return (
            <div key={level} className="flex flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium tabular-nums transition-colors",
                  isCurrent
                    ? "text-accent-hover"
                    : reached
                      ? "text-foreground-muted"
                      : "text-foreground-subtle/60",
                )}
              >
                {level}
              </span>
              <span
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  isCurrent
                    ? "bg-accent shadow-[0_0_16px_var(--color-accent)]"
                    : reached
                      ? "bg-accent/40"
                      : "bg-white/[0.06]",
                )}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-foreground-subtle">
        <span className="font-medium text-accent-hover">{CEFR_CURRENT}</span> — {CEFR_LABEL}
      </p>
    </div>
  );
}

export function EnglishSection() {
  return (
    <section id="english" className="relative py-24 md:py-28">
      <Container className="grid items-center gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16">
        {/* Left — heading + level scale */}
        <div>
          <Reveal direction="left">
            <SectionHeading eyebrow={english.eyebrow} title={english.title} />
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 max-w-md text-2xl font-normal leading-relaxed text-foreground-muted">
              {english.lead}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 max-w-md rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <CefrScale />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground-subtle">
              {english.note}
            </p>
          </Reveal>
        </div>

        {/* Right — 3D depth panel (mousemove parallax) */}
        <Reveal direction="right" delay={0.05}>
          <English3DPanel />
        </Reveal>
      </Container>
    </section>
  );
}
