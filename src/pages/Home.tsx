import { Suspense, lazy, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Helmet } from "react-helmet-async";
import { IntroGate } from "@/components/sections/intro-gate";
import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { WorkFileManager } from "@/components/sections/work-file-manager";

// Heavy ogl raymarch backdrop — deferred so its shader/code stays out of the
// initial payload; it sits behind below-the-fold sections.
const PrismaticBurst = lazy(() => import("@/components/ui/prismatic-burst"));
import { WkSection } from "@/components/sections/wk-section";
import { AboutParallax } from "@/components/sections/about-parallax";
import { SkillsSection } from "@/components/sections/skills-section";
import { JourneySection } from "@/components/sections/journey-section";
import { EnglishParallax } from "@/components/sections/english-parallax";
import { GithubSection } from "@/components/sections/github-section";
import { ContactCosmos } from "@/components/sections/contact-cosmos";
import { Contact } from "@/components/sections/contact";
import { ScrollAtmosphere } from "@/components/background/scroll-atmosphere";
import { profile } from "@/content/profile";

const TITLE = "Wellyson Caetano — Software Engineer";
const DESCRIPTION = profile.heroTagline;

/** Coarse pointer or few CPU cores ≈ a phone/low-power laptop, where the
 *  full-viewport raymarch backdrop is what makes the work section stutter.
 *  Detected once so those devices get the static gradient instead of WebGL. */
function detectLowPower(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const cores = navigator.hardwareConcurrency ?? 8;
  return coarse || cores <= 4;
}

export function Home() {
  const [introDone, setIntroDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [lowPower] = useState(detectLowPower);
  const useStaticBackdrop = prefersReducedMotion || lowPower;

  // The gate owns the viewport until it hands over — scrolling underneath it
  // would leave the visitor mid-page when the black hole opens.
  useEffect(() => {
    if (introDone) return;
    window.scrollTo(0, 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [introDone]);

  return (
    <>
      {!introDone && <IntroGate onFinish={() => setIntroDone(true)} />}

      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero introDone={introDone} />

      {/* Prismatic burst backdrop — spans from below the hero through the work
          section, behind the marquee and the card pile */}
      <div className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {useStaticBackdrop ? (
            // Static stand-in for reduced-motion / low-power devices — no WebGL
            <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,rgba(77,61,255,0.18),transparent_70%)]" />
          ) : (
            <Suspense fallback={null}>
              <PrismaticBurst
                animationType="rotate3d"
                intensity={1.8}
                speed={0.5}
                distort={1.0}
                rayCount={24}
                mixBlendMode="lighten"
                resolutionScale={0.5}
                colors={["#ff007a", "#4d3dff", "#ffffff"]}
              />
            </Suspense>
          )}
          {/* scrim keeps the marquee, copy and cards readable over the burst */}
          <div className="absolute inset-0 bg-canvas/55" />
        </div>

        <LogoMarquee />
        <WorkFileManager />
      </div>

      <WkSection />
      <AboutParallax />
      <SkillsSection />
      <ScrollAtmosphere>
        <JourneySection />
        <EnglishParallax />
        <GithubSection />
        <ContactCosmos />
        <Contact />
      </ScrollAtmosphere>
    </>
  );
}
