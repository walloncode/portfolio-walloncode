import { Helmet } from "react-helmet-async";
import { Hero } from "@/components/sections/hero";
import { WorkFileManager } from "@/components/sections/work-file-manager";
import { SelectedWork } from "@/components/sections/selected-work";
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
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero />
      <WorkFileManager />
      <SelectedWork />
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
