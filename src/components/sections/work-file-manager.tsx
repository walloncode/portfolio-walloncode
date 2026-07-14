import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionStyle,
} from "motion/react";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Search,
  Clock,
  Star,
  Code2,
  House,
  LayoutGrid,
  MousePointer2,
  FileCode2,
} from "lucide-react";
import { featuredProjects, secondaryProjects } from "@/content/projects";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const projectFiles = [...featuredProjects, ...secondaryProjects].map((p) => ({
  name: p.title,
  img: p.image as string | undefined,
  meta: p.year,
}));

interface FolderItem {
  name: string;
  target?: boolean;
}

interface View {
  crumb: string[];
  folders: FolderItem[];
}

// The scripted navigation: Início → Documentos → Meus Projetos.
const VIEWS: View[] = [
  {
    crumb: ["Início"],
    folders: [
      { name: "Documentos", target: true },
      { name: "Imagens" },
      { name: "Código" },
      { name: "Downloads" },
    ],
  },
  {
    crumb: ["Início", "Documentos"],
    folders: [
      { name: "Faculdade" },
      { name: "Meus Projetos", target: true },
      { name: "Notas" },
      { name: "Contratos" },
    ],
  },
];

const SIDEBAR = [
  { name: "Recentes", icon: Clock },
  { name: "Favoritos", icon: Star },
  { name: "Documentos", icon: Folder },
  { name: "Código", icon: Code2 },
  { name: "Área de trabalho", icon: House },
] as const;

/** The Finder-style window. Given the current `phase` (0,1 = folder views,
 *  2 = the opened "Meus Projetos"), it animates a cursor to the folder that
 *  gets opened next and plays a click ripple on each navigation. */
function Finder({ phase, showCursor }: { phase: number; showCursor: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const [cursor, setCursor] = useState({ x: 120, y: 120 });
  const [clickKey, setClickKey] = useState(0);
  const firstRun = useRef(true);

  // On each phase change, point the cursor at the current view's target and
  // fire a click ripple (skipping the very first mount).
  useEffect(() => {
    if (!showCursor) return;
    const raf = requestAnimationFrame(() => {
      const c = contentRef.current;
      const t = targetRef.current;
      if (!c || !t) return;
      const cb = c.getBoundingClientRect();
      const tb = t.getBoundingClientRect();
      setCursor({
        x: tb.left - cb.left + tb.width * 0.5,
        y: tb.top - cb.top + tb.height * 0.42,
      });
      if (!firstRun.current) setClickKey((k) => k + 1);
      firstRun.current = false;
    });
    return () => cancelAnimationFrame(raf);
  }, [phase, showCursor]);

  const openedProjects = phase >= 2;
  const view = VIEWS[Math.min(phase, VIEWS.length - 1)];
  const crumb = openedProjects ? ["Início", "Documentos", "Meus Projetos"] : view.crumb;

  return (
    <div className="flex h-[min(620px,80vh)] w-[min(940px,92vw)] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/[0.1] bg-canvas-elevated shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]">
      {/* title bar */}
      <div className="flex items-center gap-3 border-b border-border bg-surface/70 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 flex items-center gap-1 text-foreground-subtle">
          <ArrowLeft className="size-4" aria-hidden="true" />
          <ArrowRight className="size-4 opacity-40" aria-hidden="true" />
        </div>
        {/* breadcrumb */}
        <div className="ml-1 flex min-w-0 items-center gap-1.5 text-xs font-medium">
          {crumb.map((c, i) => (
            <span key={c} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3 text-foreground-subtle" aria-hidden="true" />}
              <span className={i === crumb.length - 1 ? "text-foreground" : "text-foreground-subtle"}>{c}</span>
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-foreground-subtle">
          <LayoutGrid className="size-4" aria-hidden="true" />
          <Search className="size-4" aria-hidden="true" />
        </div>
      </div>

      {/* body */}
      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="hidden w-44 shrink-0 border-r border-border bg-surface/40 p-3 sm:block">
          <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
            Favoritos
          </p>
          <ul className="space-y-0.5">
            {SIDEBAR.map((s) => {
              const Icon = s.icon;
              const active = s.name === "Documentos" && phase >= 1;
              return (
                <li
                  key={s.name}
                  className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] ${
                    active ? "bg-accent-soft text-foreground" : "text-foreground-muted"
                  }`}
                >
                  <Icon className={`size-4 ${active ? "text-accent-hover" : "text-foreground-subtle"}`} aria-hidden="true" />
                  {s.name}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* content */}
        <div ref={contentRef} className="relative min-w-0 flex-1 overflow-hidden p-5">
          {/* folder views */}
          {!openedProjects && (
            <motion.div
              key={`folders-${phase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            >
              {view.folders.map((f) => (
                <button
                  key={f.name}
                  ref={f.target ? targetRef : undefined}
                  type="button"
                  className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 transition-colors ${
                    f.target
                      ? "border-accent-border bg-accent-soft"
                      : "border-transparent hover:bg-surface/60"
                  }`}
                >
                  {f.target ? (
                    <FolderOpen className="size-10 text-accent-hover" aria-hidden="true" />
                  ) : (
                    <Folder className="size-10 text-accent" aria-hidden="true" />
                  )}
                  <span className="truncate text-xs font-medium text-foreground">{f.name}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* opened "Meus Projetos" — real project thumbnails */}
          {openedProjects && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            >
              {projectFiles.map((p, i) => (
                <button
                  key={p.name}
                  ref={i === 0 ? targetRef : undefined}
                  type="button"
                  className="group flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-transparent p-2 hover:bg-surface/60"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-white/10">
                    {p.img ? (
                      <img src={p.img} alt={p.name} loading="lazy" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent-soft to-surface">
                        <FileCode2 className="size-8 text-accent-hover" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <span className="w-full truncate text-center text-[11px] font-medium text-foreground">{p.name}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* cursor + click ripple */}
          {showCursor && (
            <>
              {clickKey > 0 && (
                <motion.span
                  key={clickKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute z-20 size-8 rounded-full border border-accent-hover"
                  style={{ left: cursor.x, top: cursor.y, translateX: "-50%", translateY: "-50%" }}
                  initial={{ scale: 0.2, opacity: 0.7 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-30"
                animate={{ x: cursor.x, y: cursor.y }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                <MousePointer2 className="size-6 -translate-x-1 -translate-y-1 fill-white text-canvas drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* status bar */}
      <div className="border-t border-border bg-surface/50 px-4 py-2 text-[11px] text-foreground-subtle">
        {openedProjects ? `Meus Projetos — ${projectFiles.length} itens` : "Navegando pelos arquivos…"}
      </div>
    </div>
  );
}

/** Scroll-driven file-manager intro that opens "Meus Projetos". */
function FileManagerPortal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

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

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPhase(v < 0.52 ? 0 : v < 0.72 ? 1 : 2);
  });

  // Opening line — "Quer ver meus trabalhos?" — rises in first, then clears
  // to hand off to the Finder demo below it.
  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.18, 0.26], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.1, 0.26], [44, 0, -40]);

  // Window enters after the intro clears, holds through the navigation, fades.
  const windowScale = useTransform(scrollYProgress, [0.28, 0.4, 0.86, 0.98], [0.92, 1, 1, 1.04]);
  const windowOpacity = useTransform(scrollYProgress, [0.28, 0.36, 0.9, 1], [0, 1, 1, 0]);
  const windowY = useTransform(scrollYProgress, [0.9, 1], ["0vh", "-6vh"]);
  const glowOpacity = useTransform(scrollYProgress, [0.28, 0.5, 1], [0.25, 0.5, 0.2]);

  const hintOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.56, 0.64], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} id="work-intro" className="relative h-[180vh] md:h-[320vh]">
      {/* Seam bridge — an indigo wash (hero palette) straddling the boundary so
          the hero's animated background dissolves into this section instead of
          cutting hard into flat canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[45vh] -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(91,108,255,0.16),transparent_72%)]"
      />
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* ambient glow */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute size-[60vmin] rounded-full blur-[55px] sm:blur-[100px]"
        >
          <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(91,108,255,0.55),transparent_70%)]" />
        </motion.div>

        {/* continuity headline */}
        <motion.h2
          style={{ opacity: introOpacity, y: introY }}
          className="title-std pointer-events-none absolute z-20 px-6 text-center text-foreground [text-shadow:0_8px_40px_rgba(91,108,255,0.4)]"
        >
          Quer ver meus trabalhos?
        </motion.h2>

        <motion.div
          style={{ scale: windowScale, opacity: windowOpacity, y: windowY } as MotionStyle}
          className="relative z-10 will-change-transform"
        >
          <Finder phase={phase} showCursor />
        </motion.div>

        {/* scroll hint */}
        {phase < 2 && (
          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-10 z-20 flex flex-col items-center gap-2 text-foreground-subtle"
          >
            <span className="font-mono text-xs uppercase tracking-wider">role para abrir os projetos</span>
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

/** Calm, non-pinned fallback for reduced-motion users. */
function FileManagerStatic() {
  return (
    <section id="work-intro" className="relative flex min-h-[70vh] items-center justify-center py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[40vh] -translate-y-1/2 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(91,108,255,0.16),transparent_72%)]"
      />
      <div className="px-4">
        <Finder phase={2} showCursor={false} />
      </div>
    </section>
  );
}

export function WorkFileManager() {
  const reduce = useReducedMotion();
  if (reduce) return <FileManagerStatic />;
  return <FileManagerPortal />;
}
