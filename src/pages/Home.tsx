import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { IntroGate } from "@/components/sections/intro-gate";
import { Hero } from "@/components/sections/hero";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { WorkFileManager } from "@/components/sections/work-file-manager";
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

export function Home() {
  const [introDone, setIntroDone] = useState(false);

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

      <Hero />
      <LogoMarquee />
      <WorkFileManager />
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
