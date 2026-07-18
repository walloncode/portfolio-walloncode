import * as React from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Grid3X3, Layers, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

export type LayoutMode = "stack" | "grid" | "list";

export interface MorphCard {
  id: string;
  title: string;
  description: string;
  /** Cover image (screenshot). Falls back to the logo, then a monogram tile. */
  image?: string;
  /** Brand logo shown centered when there's no screenshot cover. */
  logo?: string;
  /** Small pill rendered above the title (e.g. a status badge). */
  badge?: React.ReactNode;
  /** Short meta line shown next to the badge (e.g. the year). */
  meta?: string;
  /** Internal route the card links to (case study, etc.). */
  href?: string;
}

export interface MorphingCardStackProps {
  cards?: MorphCard[];
  className?: string;
  defaultLayout?: LayoutMode;
}

const layoutIcons: Record<LayoutMode, typeof Layers> = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
};

const layoutLabels: Record<LayoutMode, string> = {
  stack: "Pilha",
  grid: "Grade",
  list: "Lista",
};

const SWIPE_THRESHOLD = 60;
/** How many cards to keep rendered behind the top card in stack mode. */
const STACK_DEPTH = 3;

/** Pilha (arrastável) por padrão — fica centralizada na viewport como os
 *  mockups das seções de parallax. Grade/Lista continuam disponíveis no toggle. */
function responsiveDefaultLayout(): LayoutMode {
  return "stack";
}

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout,
}: MorphingCardStackProps) {
  const reduceMotion = useReducedMotion();
  const [layout, setLayout] = React.useState<LayoutMode>(
    () => defaultLayout ?? responsiveDefaultLayout(),
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const draggingRef = React.useRef(false);

  if (!cards || cards.length === 0) return null;

  const len = cards.length;

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;
    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % len);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + len) % len);
    }
    // Defer clearing so the click fired after a drag is ignored.
    setTimeout(() => (draggingRef.current = false), 0);
  };

  // Stack: reorder so the active card sits on top (rendered last).
  const stackCards = Array.from({ length: Math.min(STACK_DEPTH + 1, len) }, (_, i) => ({
    ...cards[(activeIndex + i) % len],
    stackPosition: i,
  })).reverse();

  const containerStyles: Record<LayoutMode, string> = {
    stack:
      "relative mx-auto h-[420px] w-[300px] sm:h-[460px] sm:w-[340px] md:h-[500px] md:w-[420px] lg:h-[560px] lg:w-[500px]",
    grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",
    list: "flex flex-col gap-3",
  };

  const displayCards =
    layout === "stack" ? stackCards : cards.map((c, i) => ({ ...c, stackPosition: i }));

  return (
    <div className={cn("space-y-8", className)}>
      {/* Layout toggle */}
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-surface/60 p-1">
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode];
          const isActive = layout === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setLayout(mode)}
              aria-pressed={isActive}
              aria-label={`Visualização em ${layoutLabels[mode].toLowerCase()}`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{layoutLabels[mode]}</span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <LayoutGroup>
        <motion.div layout className={containerStyles[layout]}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const isTopCard = layout === "stack" && card.stackPosition === 0;
              const stackStyle =
                layout === "stack"
                  ? {
                      top: card.stackPosition * 26,
                      left: card.stackPosition * 22,
                      rotate: card.stackPosition * -4,
                      scale: 1 - card.stackPosition * 0.05,
                      zIndex: STACK_DEPTH + 1 - card.stackPosition,
                    }
                  : { top: 0, left: 0, rotate: 0, scale: 1, zIndex: 1 };

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: layout === "stack" ? 1 - card.stackPosition * 0.12 : 1,
                    x: 0,
                    ...stackStyle,
                  }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.85, x: -220 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  drag={isTopCard && !reduceMotion ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragStart={() => (draggingRef.current = true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                  className={cn(
                    "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-canvas-elevated transition-colors hover:border-accent-border",
                    layout === "stack" && "absolute h-full w-full",
                    layout === "stack" && isTopCard && "cursor-grab active:cursor-grabbing",
                    layout === "grid" && "aspect-[4/3] w-full",
                    layout === "list" && "w-full",
                  )}
                >
                  <CardFace
                    card={card}
                    layout={layout}
                    isTopCard={isTopCard}
                    onNavigateGuard={() => draggingRef.current}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Stack pagination dots */}
      {layout === "stack" && len > 1 && (
        <div className="flex justify-center gap-1.5">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir para ${cards[index].title}`}
              aria-current={index === activeIndex}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === activeIndex
                  ? "w-5 bg-accent"
                  : "w-1.5 bg-foreground/25 hover:bg-foreground/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardFace({
  card,
  layout,
  isTopCard,
  onNavigateGuard,
}: {
  card: MorphCard;
  layout: LayoutMode;
  isTopCard: boolean;
  onNavigateGuard: () => boolean;
}) {
  const monogram = card.title.trim().charAt(0).toUpperCase();

  // List layout: horizontal row with a thumbnail.
  if (layout === "list") {
    const body = (
      <div className="flex items-center gap-4 p-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-md)]">
          <Cover image={card.image} logo={card.logo} monogram={monogram} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {card.badge}
            {card.meta && <span className="text-xs text-foreground-subtle">{card.meta}</span>}
          </div>
          <h3 className="mt-1 truncate font-semibold tracking-tight text-foreground">
            {card.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-foreground-muted">{card.description}</p>
        </div>
        <ArrowUpRight
          className="size-4 shrink-0 text-foreground-subtle transition-colors group-hover:text-accent-hover"
          aria-hidden="true"
        />
      </div>
    );
    return card.href ? (
      <Link to={card.href} className="group block outline-none">
        {body}
      </Link>
    ) : (
      body
    );
  }

  // Stack + grid: image cover with content anchored to the bottom.
  const overlay = (
    <>
      <Cover image={card.image} logo={card.logo} monogram={monogram} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          {card.badge}
          {card.meta && <span className="text-xs text-white/60">{card.meta}</span>}
        </div>
        <h3 className="truncate text-lg font-semibold tracking-tight text-white">{card.title}</h3>
        <p
          className={cn(
            "mt-1 text-sm text-white/75",
            layout === "stack" ? "line-clamp-3" : "line-clamp-2",
          )}
        >
          {card.description}
        </p>
        {isTopCard && card.href && (
          <Link
            to={card.href}
            onClick={(e) => {
              if (onNavigateGuard()) e.preventDefault();
              e.stopPropagation();
            }}
            className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-sm)] bg-white px-3.5 py-2 text-sm font-medium text-canvas transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Ver case study
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </>
  );

  // Grid cards navigate on click via a Link wrapper; stack cards use the
  // inner button (drag handles the card body).
  if (layout === "grid" && card.href) {
    return (
      <Link to={card.href} className="group relative block h-full w-full outline-none">
        {overlay}
      </Link>
    );
  }
  return <div className="relative h-full w-full select-none">{overlay}</div>;
}

function Cover({ image, logo, monogram }: { image?: string; logo?: string; monogram: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    );
  }
  // No screenshot: show the brand logo contained (never cropped) over a themed
  // backdrop, so logo-only projects (PulseID, Agente IXC) read as a brand card
  // instead of a bare monogram.
  if (logo) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-canvas-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_42%,var(--color-accent-soft),transparent_72%)]" />
        <img
          src={logo}
          alt=""
          draggable={false}
          loading="lazy"
          className="relative max-h-[74%] max-w-[82%] object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
        />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-canvas-elevated">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_20%,var(--color-accent-soft),transparent_70%)]" />
      <span className="font-mono text-[6rem] font-semibold leading-none text-white/[0.06]">
        {monogram}
      </span>
    </div>
  );
}
