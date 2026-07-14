import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import wallonMark from "@/assets/walloncode-mark.png";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Mobile GPUs choke on big blurs / hundreds of animated nodes — we dial the
 *  scene down on small screens. Read once at mount (cheap, stable enough). */
const isMobileViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
  min: number;
}

/** A field of twinkling stars, concentrated in the upper sky above the planet. */
function useStars(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        top: Math.random() * 74,
        left: Math.random() * 100,
        size: Math.random() * 1.8 + 0.6,
        dur: Math.random() * 3 + 2.4,
        delay: Math.random() * 5,
        min: Math.random() * 0.3 + 0.12,
      })),
    [count],
  );
}

function Starfield({ stars }: { stars: Star[] }) {
  return (
    <>
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            // @ts-expect-error — custom prop consumed by the twinkle keyframe
            "--star-min": s.min,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/** The purple planet — a giant sphere anchored at the bottom, so only its top
 *  half arcs across the screen like a horizon. */
function Planet({ simplified }: { simplified?: boolean }) {
  return (
    <div
      className="size-[150vmin] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 50% 8%, #c4b5fd 0%, #8b5cf6 22%, #6d28d9 42%, #3b0f75 66%, #1a0740 100%)",
        boxShadow: simplified
          ? "inset 0 18px 48px -12px rgba(221,214,254,0.7)"
          : "0 -30px 120px -20px rgba(167,139,250,0.55), inset 0 22px 60px -10px rgba(221,214,254,0.75)",
      }}
    >
      {/* subtle surface banding — the mix-blend is costly on mobile, so skip it */}
      {!simplified && (
        <div
          className="absolute inset-0 rounded-full opacity-40 mix-blend-soft-light"
          style={{
            background:
              "repeating-radial-gradient(circle at 50% 8%, transparent 0 22px, rgba(0,0,0,0.18) 22px 46px)",
          }}
        />
      )}
    </div>
  );
}

/** Shared cosmic scene: starfield, planet, spinning mark, and headline.
 *  Motion values drive the scroll choreography; the static fallback passes
 *  fixed "resolved" values. */
function CosmicScene({
  starsY,
  planetY,
  markStyle,
  headline1Style,
  headline2Style,
}: {
  starsY?: MotionValue<string>;
  planetY?: MotionValue<string>;
  markStyle: MotionStyle;
  headline1Style: MotionStyle;
  headline2Style: MotionStyle;
}) {
  const mobile = isMobileViewport();
  const stars = useStars(mobile ? 48 : 140);

  return (
    <>
      {/* starfield */}
      <motion.div style={{ y: starsY }} className="pointer-events-none absolute inset-0">
        <Starfield stars={stars} />
      </motion.div>

      {/* nebula glow behind the mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[55px] sm:blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4), rgba(91,108,255,0.14) 55%, transparent 72%)",
        }}
      />

      {/* the planet — centered, pushed down so only the top half shows */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[54%]">
        <motion.div style={{ y: planetY }} className="will-change-transform">
          <div className="relative">
            <Planet simplified={mobile} />
          </div>
        </motion.div>
      </div>

      {/* center content — spinning mark + headline.
          No z-index / isolation here: the mark's mix-blend-screen must blend
          against the planet + starfield backdrop to drop out its black. */}
      <div className="relative flex w-[min(1150px,92vw)] flex-col items-center px-6 text-center">
        <motion.img
          src={wallonMark}
          alt="walloncode"
          style={markStyle}
          className="size-[26vmin] max-w-none select-none mix-blend-screen will-change-transform [-webkit-mask-image:radial-gradient(circle,#000_56%,transparent_72%)] [mask-image:radial-gradient(circle,#000_56%,transparent_72%)]"
          draggable={false}
        />
        {/* two-beat headline: the question, then the invitation. Both are
            absolutely stacked so they crossfade in the same spot. */}
        <div className="relative mt-6 w-full">
          <motion.h2
            style={headline1Style}
            className="absolute inset-x-0 top-0 font-display font-extrabold leading-[1.02] tracking-[-0.03em] text-foreground [text-shadow:0_8px_40px_rgba(139,92,246,0.45)] will-change-transform"
          >
            <span className="block text-[clamp(2.5rem,10vw,7rem)]">Tem algo em mente?</span>
          </motion.h2>
          <motion.h2
            style={headline2Style}
            className="absolute inset-x-0 top-0 font-display font-extrabold leading-[1.02] tracking-[-0.03em] text-foreground [text-shadow:0_8px_40px_rgba(139,92,246,0.45)] will-change-transform"
          >
            <span className="block text-[clamp(2.5rem,10vw,7rem)]">Então vamos conversar</span>
          </motion.h2>
        </div>
      </div>
    </>
  );
}

/** Scroll-driven cosmic intro to the contact section. */
function CosmosPortal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headlineActive, setHeadlineActive] = useState(false);

  // Manual, viewport-agnostic scroll progress (same approach as the other
  // sticky portals on this page).
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      scrollYProgress.set(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (v) => setHeadlineActive(v > 0.5));

  // The mark falls from the top while spinning and growing, then drifts up a
  // touch to make room for the headline.
  const markY = useTransform(scrollYProgress, [0, 0.5, 0.85], ["-54vh", "-4vh", "-11vh"]);
  const markRotate = useTransform(scrollYProgress, [0, 0.5], [0, 720]);
  const markScale = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // Two-beat headline: "Tem algo em mente?" rises first, then hands off to
  // "Então vamos conversar" with a brief crossfade.
  const head1Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.72, 0.8], [0, 1, 1, 0]);
  const head1Y = useTransform(scrollYProgress, [0.5, 0.62], [52, 0]);
  const head2Opacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const head2Y = useTransform(scrollYProgress, [0.78, 0.94], [52, 0]);

  // Parallax drift for depth.
  const planetY = useTransform(scrollYProgress, [0, 1], ["9vh", "-5vh"]);
  const starsY = useTransform(scrollYProgress, [0, 1], ["0vh", "-7vh"]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]);

  return (
    <section ref={sectionRef} id="contact-intro" className="relative h-[180vh] md:h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-canvas">
        <CosmicScene
          starsY={starsY}
          planetY={planetY}
          markStyle={{ y: markY, rotate: markRotate, scale: markScale, opacity: markOpacity }}
          headline1Style={{ opacity: head1Opacity, y: head1Y }}
          headline2Style={{ opacity: head2Opacity, y: head2Y }}
        />

        {/* scroll hint */}
        {!headlineActive && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-10 z-20 flex flex-col items-center gap-2 text-foreground-subtle"
          >
            <span className="font-mono text-xs uppercase tracking-wider">role para pousar</span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-lg"
            >
              ↓
            </motion.span>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Calm, non-scrolling fallback for reduced-motion users. */
function CosmosStatic() {
  return (
    <section id="contact-intro" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-canvas py-24">
      <CosmicScene
        markStyle={{ opacity: 1 }}
        headline1Style={{ opacity: 0 }}
        headline2Style={{ opacity: 1 }}
      />
    </section>
  );
}

export function ContactCosmos() {
  const reduce = useReducedMotion();
  if (reduce) return <CosmosStatic />;
  return <CosmosPortal />;
}
