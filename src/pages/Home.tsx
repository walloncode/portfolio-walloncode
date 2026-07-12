import { Helmet } from "react-helmet-async";
import { Hero } from "@/components/sections/hero";
import { ProjectsParallax } from "@/components/sections/projects-parallax";
import { SelectedWork } from "@/components/sections/selected-work";
import { About } from "@/components/sections/about";
import { JourneySection } from "@/components/sections/journey-section";
import { EnglishSection } from "@/components/sections/english-section";
import { GithubSection } from "@/components/sections/github-section";
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
      <ProjectsParallax />
      <SelectedWork />
      <About />
      <ScrollAtmosphere>
        <JourneySection />
        <EnglishSection />
        <GithubSection />
        <Contact />
      </ScrollAtmosphere>
    </>
  );
}
