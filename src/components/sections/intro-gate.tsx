import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { DarkVeil } from "@/components/ui/dark-veil";
import { SpecularButton } from "@/components/ui/specular-button";
import { SplitText } from "@/components/ui/split-text";
import { profile } from "@/content/profile";

type Phase = "idle" | "welcome" | "collapse";

const MARQUEE_REPEATS = 6;

/** Name repeated across a seamless horizontal loop, white, split by a violet dash. */
function NameMarquee() {
  const items = Array.from({ length: MARQUEE_REPEATS }, (_, i) => (
    <span key={i} className="flex shrink-0 items-center">
      <span className="text-white">{profile.name}</span>
      <span className="px-8 text-[#a855f7]">-</span>
    </span>
  ));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden"
    >
      {/* Two identical tracks side by side: the pair scrolls exactly one track
          width, so the seam never lands inside the viewport. */}
      <div className="flex w-max animate-[marquee-x_38s_linear_infinite] whitespace-nowrap font-display text-[72px] font-bold leading-none tracking-tight will-change-transform">
        <div className="flex shrink-0 items-center">{items}</div>
        <div className="flex shrink-0 items-center">{items}</div>
      </div>
    </div>
  );
}

export function IntroGate({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // The black hole: everything on stage spirals into a point, the singularity
  // blooms open, and the swallow flash hands the viewport to the portfolio.
  useGSAP(
    () => {
      if (phase !== "collapse") return;

      if (prefersReducedMotion) {
        gsap.to(rootRef.current, { opacity: 0, duration: 0.4, onComplete: onFinish });
        return;
      }

      const tl = gsap.timeline({ onComplete: onFinish });

      tl.set(holeRef.current, { scale: 0, opacity: 1 })
        .to(stageRef.current, {
          scale: 0.05,
          rotate: 260,
          opacity: 0,
          filter: "blur(14px)",
          duration: 1.5,
          ease: "power3.in",
        })
        .to(holeRef.current, { scale: 1, duration: 1.1, ease: "power2.out" }, "<0.25")
        .to(holeRef.current, { scale: 42, duration: 1.1, ease: "power3.in" }, ">-0.1")
        .to(rootRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, ">-0.45");
    },
    { dependencies: [phase, prefersReducedMotion], scope: rootRef },
  );

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200] overflow-hidden bg-canvas">
      <div className="absolute inset-0">
        {/* Half-res: the CPPN shader is heavy per-pixel and the pattern is soft
            enough that upscaling it costs nothing visually. */}
        <DarkVeil speed={0.4} warpAmount={0.6} noiseIntensity={0.02} resolutionScale={0.5} />
      </div>

      {/* Keeps the veil from washing out the name and the label */}
      <div aria-hidden="true" className="absolute inset-0 bg-canvas/45" />

      <div ref={stageRef} className="absolute inset-0 grid place-items-center">
        {phase === "idle" && <NameMarquee />}

        <div className="relative z-10 px-6 text-center">
          {phase === "idle" ? (
            <SpecularButton
              size="lg"
              radius={999}
              // Dark glass, not clear: the name sweeps directly behind the
              // button, and a clear tint left the label unreadable against it.
              tint="#08080a"
              tintOpacity={0.62}
              blur={6}
              lineColor="#c4b5fd"
              baseColor="#4c1d95"
              proximity={320}
              // The only control on the gate: keep the rim lit so it reads as
              // clickable before the pointer ever comes near it.
              autoAnimate
              onClick={() => setPhase("welcome")}
            >
              Seja bem vindo
            </SpecularButton>
          ) : (
            <SplitText
              key="welcome"
              tag="h1"
              text="Bem vindo ao meu portfólio"
              className="title-std max-w-[16ch] text-white"
              delay={45}
              duration={0.9}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 60, rotateX: -80 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              playOnMount
              onLetterAnimationComplete={() => setPhase("collapse")}
            />
          )}
        </div>
      </div>

      {/* Singularity: black core, violet accretion ring, lensing halo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          ref={holeRef}
          // No `scale-*` class here: Tailwind sets the standalone `scale`
          // property, which multiplies with the `transform` GSAP animates and
          // would pin the hole at zero. The timeline's set() owns the scale;
          // opacity-0 keeps it hidden until then.
          className="relative size-40 rounded-full opacity-0"
          style={{
            background: "radial-gradient(circle, #000 0 46%, rgba(168,85,247,0.85) 55%, rgba(91,108,255,0.5) 68%, transparent 74%)",
            boxShadow: "0 0 90px 20px rgba(168,85,247,0.45), inset 0 0 60px 10px #000",
          }}
        >
          <div
            className="absolute -inset-4 animate-[bh-spin_2.4s_linear_infinite] rounded-full opacity-80 blur-[6px]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, #a855f7 70deg, #ffffff 110deg, #5b6cff 160deg, transparent 240deg, transparent 360deg)",
              mask: "radial-gradient(circle, transparent 0 48%, #000 56% 72%, transparent 78%)",
              WebkitMask:
                "radial-gradient(circle, transparent 0 48%, #000 56% 72%, transparent 78%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
