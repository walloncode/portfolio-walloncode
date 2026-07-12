import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Link } from "react-router-dom";
import {
  rotaruralBanner,
  rotaruralMapa,
  rotaruralGestaoPainel,
  bonaireMenu,
  bonaireLogin,
  kiusevenHero,
  wkcodeHero,
} from "@/assets/projects";

interface Geometry {
  width: string;
  height: string;
  top?: string;
  left?: string;
}

interface Layer {
  slug: string;
  img: string;
  title: string;
  tag: string;
  scaleMax: number;
  desktop: Geometry;
  mobile: Geometry;
}

// Ported from the reference sketch: a center tile (scales gently, stays put)
// with six tiles arranged around it that scale faster and sweep off-screen,
// producing the "zoom through" depth effect. Images are real project screens.
const LAYERS: Layer[] = [
  {
    slug: "rotarural",
    img: rotaruralBanner,
    title: "RotaRural",
    tag: "Trafegabilidade preditiva",
    scaleMax: 4,
    desktop: { width: "25vw", height: "25vh" },
    mobile: { width: "58vw", height: "20vh" },
  },
  {
    slug: "bonaire-delivery",
    img: bonaireMenu,
    title: "Bonaire Delivery",
    tag: "Cardápio digital",
    scaleMax: 5,
    desktop: { width: "35vw", height: "30vh", top: "-30vh", left: "5vw" },
    mobile: { width: "62vw", height: "24vh", top: "-22vh", left: "3vw" },
  },
  {
    slug: "kiuseven",
    img: kiusevenHero,
    title: "Kiuseven",
    tag: "Energia solar",
    scaleMax: 6,
    desktop: { width: "22vw", height: "42vh", top: "-8vh", left: "-25vw" },
    mobile: { width: "42vw", height: "34vh", top: "-6vh", left: "-16vw" },
  },
  {
    slug: "wkcode",
    img: wkcodeHero,
    title: "WKCODE",
    tag: "Agência digital",
    scaleMax: 5,
    desktop: { width: "25vw", height: "25vh", left: "27.5vw" },
    mobile: { width: "46vw", height: "20vh", left: "16vw" },
  },
  {
    slug: "rotarural",
    img: rotaruralMapa,
    title: "RotaRural",
    tag: "Mapa de risco",
    scaleMax: 6,
    desktop: { width: "20vw", height: "25vh", top: "27.5vh", left: "5vw" },
    mobile: { width: "40vw", height: "20vh", top: "20vh", left: "3vw" },
  },
  {
    slug: "bonaire-delivery",
    img: bonaireLogin,
    title: "Bonaire",
    tag: "Painel de gestão",
    scaleMax: 8,
    desktop: { width: "30vw", height: "25vh", top: "27.5vh", left: "-22.5vw" },
    mobile: { width: "54vw", height: "20vh", top: "20vh", left: "-13vw" },
  },
  {
    slug: "rotarural",
    img: rotaruralGestaoPainel,
    title: "RotaRural",
    tag: "Painel da prefeitura",
    scaleMax: 9,
    desktop: { width: "16vw", height: "16vh", top: "22.5vh", left: "25vw" },
    mobile: { width: "32vw", height: "13vh", top: "18vh", left: "15vw" },
  },
];

function ParallaxLayer({
  layer,
  progress,
  isMobile,
}: {
  layer: Layer;
  progress: MotionValue<number>;
  isMobile: boolean;
}) {
  const scale = useTransform(progress, [0, 1], [1, layer.scaleMax]);
  const geo = isMobile ? layer.mobile : layer.desktop;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center will-change-transform"
      style={{ scale }}
    >
      <Link
        to={`/projects/${layer.slug}`}
        className="pointer-events-auto group relative block overflow-hidden rounded-[10px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-accent"
        style={{
          width: geo.width,
          height: geo.height,
          top: geo.top,
          left: geo.left,
          position: "relative",
        }}
      >
        <img
          src={layer.img}
          alt={`${layer.title} — ${layer.tag}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
          <p className="text-xs font-semibold tracking-tight text-white sm:text-sm">
            {layer.title}
          </p>
          <p className="text-[10px] text-white/70 sm:text-xs">{layer.tag}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectsParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Reduced motion / no-JS-friendly fallback: a calm responsive grid
  if (prefersReducedMotion) {
    return (
      <section id="showcase" className="relative py-24">
        <div className="mx-auto w-full max-w-[1180px] px-6 md:px-10">
          <p className="mb-8 text-center font-mono text-xs font-medium uppercase tracking-wider text-accent-hover">
            Em movimento
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {LAYERS.map((layer, i) => (
              <Link
                key={`${layer.slug}-${i}`}
                to={`/projects/${layer.slug}`}
                className="group relative aspect-video overflow-hidden rounded-[10px] ring-1 ring-white/10"
              >
                <img src={layer.img} alt={`${layer.title} — ${layer.tag}`} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-sm font-semibold text-white">{layer.title}</p>
                  <p className="text-xs text-white/70">{layer.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="showcase" ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {LAYERS.map((layer, i) => (
          <ParallaxLayer
            key={`${layer.slug}-${i}`}
            layer={layer}
            progress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}
