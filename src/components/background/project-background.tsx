import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ProjectTheme } from "@/content/projects";

/**
 * Per-project themed backdrop. Each project's `theme` maps to a bespoke
 * animated scene (forest, ocean, radar, …) with a staged entrance animation.
 * Fixed behind all content, keyed by the project slug so the entrance replays
 * on every navigation. Respects prefers-reduced-motion (static, no loops).
 */

const EASE = [0.16, 1, 0.3, 1] as const;

const THEME_BG: Record<ProjectTheme, string> = {
  topography:
    "radial-gradient(125% 95% at 50% 8%, #0c241a 0%, #06120c 52%, var(--color-canvas) 100%)",
  aurora:
    "radial-gradient(125% 95% at 50% 6%, #072b41 0%, #04121f 52%, var(--color-canvas) 100%)",
  route:
    "radial-gradient(125% 95% at 50% 8%, #0d1533 0%, #070a1a 52%, var(--color-canvas) 100%)",
  grid: "radial-gradient(125% 95% at 50% 8%, #170d2e 0%, #0a0716 52%, var(--color-canvas) 100%)",
  signal:
    "radial-gradient(125% 95% at 50% 8%, #062d31 0%, #04141a 52%, var(--color-canvas) 100%)",
  solar:
    "radial-gradient(115% 90% at 50% 12%, #3a1f06 0%, #180b05 52%, var(--color-canvas) 100%)",
  shield:
    "radial-gradient(125% 95% at 50% 8%, #2e0b14 0%, #16060a 52%, var(--color-canvas) 100%)",
};

/* ----------------------------- geometry helpers ---------------------------- */

// Filled wave path across a 2880-wide viewBox holding two identical periods,
// so translating the layer by -50% loops seamlessly.
function wavePath(amp: number, baseY: number, period: number) {
  const W = 2880;
  const H = 260;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 24) {
    const y = baseY + amp * Math.sin((x / period) * Math.PI * 2);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${H} L${pts.join(" L")} L${W},${H} Z`;
}

// A single pine as overlapping triangles (silhouette) + trunk.
function pine(cx: number, ground: number, h: number, w: number) {
  const t = (dy: number, hw: number, tipY: number) =>
    `${cx - hw},${ground - dy} ${cx + hw},${ground - dy} ${cx},${tipY}`;
  return [
    t(0, w, ground - h * 0.55),
    t(h * 0.32, w * 0.82, ground - h * 0.8),
    t(h * 0.58, w * 0.6, ground - h),
  ];
}

function pineRow(count: number, seed: number, ground = 320) {
  const rows: { pts: string[]; cx: number; trunk: [number, number] }[] = [];
  const step = 1440 / count;
  for (let i = 0; i < count; i++) {
    const r = Math.abs(Math.sin((i + seed) * 12.9898) * 43758.5453) % 1;
    const cx = i * step + step * (0.3 + r * 0.4);
    const h = 150 + r * 90;
    const w = 34 + r * 18;
    rows.push({ pts: pine(cx, ground, h, w), cx, trunk: [w * 0.16, h] });
  }
  return rows;
}

const FIREFLIES = Array.from({ length: 14 }, (_, i) => {
  const r = Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
  const r2 = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
  return { left: 6 + r * 88, top: 24 + r2 * 60, delay: r * 5, dur: 4 + r2 * 4 };
});

const BUBBLES = Array.from({ length: 12 }, (_, i) => {
  const r = Math.abs(Math.sin((i + 3) * 45.164) * 43758.5453) % 1;
  const r2 = Math.abs(Math.sin((i + 3) * 91.113) * 43758.5453) % 1;
  return { left: 5 + r * 90, size: 3 + r2 * 6, delay: r2 * 6, dur: 7 + r * 6 };
});

/* --------------------------------- scenes --------------------------------- */

function ForestScene({ reduce }: { reduce: boolean | null }) {
  const layers = [
    { seed: 1, fill: "#0a2b1c", y: 250, scale: 1.15, blur: 3, op: 0.9, d: 0.15, sway: 1.2 },
    { seed: 7, fill: "#0f3a26", y: 285, scale: 1, blur: 1.5, op: 0.95, d: 0.32, sway: 1.8 },
    { seed: 13, fill: "#155235", y: 320, scale: 0.9, blur: 0, op: 1, d: 0.5, sway: 2.6 },
  ];
  return (
    <>
      {/* moon glow */}
      <motion.div
        className="absolute left-[62%] top-[8%] h-72 w-72 rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(180,255,214,0.5), transparent 65%)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      {/* drifting fog */}
      {!reduce &&
        [0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-x-0"
            style={{
              bottom: `${8 + i * 14}%`,
              height: 120,
              background:
                "linear-gradient(90deg, transparent, rgba(120,220,170,0.10), transparent)",
              filter: "blur(20px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: i % 2 ? [0, 60, 0] : [0, -60, 0] }}
            transition={{
              opacity: { duration: 1.6, delay: 0.4 },
              x: { duration: 16 + i * 6, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      {/* tree layers */}
      {layers.map((l) => (
        <motion.svg
          key={l.seed}
          viewBox="0 0 1440 340"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-x-0 bottom-0 h-[70%] w-full"
          style={{ filter: l.blur ? `blur(${l.blur}px)` : undefined, opacity: l.op }}
          initial={{ y: 160, opacity: 0 }}
          animate={{ y: 0, opacity: l.op }}
          transition={{ duration: 1.1, delay: l.d, ease: EASE }}
        >
          <motion.g
            animate={reduce ? undefined : { rotate: [-l.sway * 0.15, l.sway * 0.15, -l.sway * 0.15] }}
            transition={{ duration: 7 + l.seed * 0.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50% 100%" }}
          >
            {pineRow(9, l.seed).map((p, idx) => (
              <g key={idx} fill={l.fill}>
                <rect x={p.cx - p.trunk[0]} y={320} width={p.trunk[0] * 2} height={26} />
                {p.pts.map((pts, k) => (
                  <polygon key={k} points={pts} />
                ))}
              </g>
            ))}
          </motion.g>
        </motion.svg>
      ))}
      {/* fireflies */}
      {!reduce &&
        FIREFLIES.map((f, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#c6ffdd]"
            style={{ left: `${f.left}%`, top: `${f.top}%`, boxShadow: "0 0 8px 2px rgba(150,255,200,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0], y: [0, -30, -60] }}
            transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </>
  );
}

function OceanScene({ reduce }: { reduce: boolean | null }) {
  const waves = [
    { amp: 26, base: 70, period: 1440, fill: "#0a3a55", op: 0.55, dur: 26, d: 0.2 },
    { amp: 20, base: 110, period: 720, fill: "#0f5677", op: 0.6, dur: 18, d: 0.34 },
    { amp: 15, base: 150, period: 480, fill: "#1b7ea0", op: 0.75, dur: 12, d: 0.48 },
    { amp: 11, base: 190, period: 360, fill: "#33a7c4", op: 0.9, dur: 8, d: 0.62 },
  ];
  return (
    <>
      {/* horizon sun/moon glow */}
      <motion.div
        className="absolute left-1/2 top-[6%] h-80 w-[36rem] -translate-x-1/2 rounded-full blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(120,220,255,0.45), transparent 65%)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.75, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      {/* shimmer band on the water surface */}
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 top-[30%] h-24"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(150,235,255,0.14), transparent)",
            filter: "blur(14px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [-80, 80, -80] }}
          transition={{ opacity: { duration: 1.6 }, x: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
        />
      )}
      {/* stacked waves */}
      {waves.map((w, i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 bottom-0 h-[62%]"
          initial={{ y: 130, opacity: 0 }}
          animate={{ y: 0, opacity: w.op }}
          transition={{ duration: 1.1, delay: w.d, ease: EASE }}
        >
          <motion.svg
            viewBox="0 0 2880 260"
            preserveAspectRatio="none"
            className="absolute bottom-0 h-full w-[200%]"
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: w.dur, repeat: Infinity, ease: "linear" }}
          >
            <path d={wavePath(w.amp, w.base, w.period)} fill={w.fill} />
          </motion.svg>
        </motion.div>
      ))}
      {/* rising bubbles */}
      {!reduce &&
        BUBBLES.map((b, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 rounded-full border border-cyan-200/40 bg-cyan-100/10"
            style={{ left: `${b.left}%`, width: b.size, height: b.size }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: [0, -260] }}
            transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeIn" }}
          />
        ))}
    </>
  );
}

function RouteScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(120,140,255,0.18) 0 2px, transparent 2px 40px)",
            maskImage: `radial-gradient(80% 60% at ${20 + i * 30}% ${30 + i * 20}%, black, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.5 } : { opacity: 0.5, backgroundPositionX: [0, 400] }}
          transition={{
            opacity: { duration: 1.2, delay: i * 0.15 },
            backgroundPositionX: { duration: 6 + i * 2, repeat: Infinity, ease: "linear" },
          }}
        />
      ))}
      {[["18%", "28%"], ["70%", "40%"], ["44%", "66%"], ["82%", "72%"]].map(([l, t], i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-accent"
          style={{ left: l, top: t, boxShadow: "0 0 16px 3px rgba(91,108,255,0.7)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={reduce ? { scale: 1, opacity: 1 } : { scale: [0.6, 1.3, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.6, delay: 0.3 + i * 0.2, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function GridScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      <motion.div
        className="absolute inset-x-0 bottom-0 top-1/3 origin-bottom"
        style={{
          backgroundImage:
            "linear-gradient(rgba(150,110,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(150,110,255,0.22) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(420px) rotateX(62deg)",
          maskImage: "linear-gradient(to top, black 10%, transparent 85%)",
        }}
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 0.7 } : { opacity: 0.7, backgroundPositionY: [0, 60] }}
        transition={{
          opacity: { duration: 1.3 },
          backgroundPositionY: { duration: 2.2, repeat: Infinity, ease: "linear" },
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-64 w-[40rem] -translate-x-1/2 rounded-full blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(160,120,255,0.4), transparent 65%)" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </>
  );
}

function SignalScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[34%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25"
          initial={{ scale: 0.15, opacity: 0 }}
          animate={
            reduce
              ? { scale: 0.4 + i * 0.25, opacity: 0.25 }
              : { scale: [0.15, 1.2], opacity: [0.5, 0] }
          }
          transition={{ duration: 4, delay: i * 1, repeat: reduce ? 0 : Infinity, ease: "easeOut" }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-[34%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px]"
        style={{ background: "radial-gradient(circle, rgba(80,230,240,0.5), transparent 65%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.4 }}
      />
    </>
  );
}

function SolarScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      {/* rotating sun rays, anchored high so they fill the empty hero area */}
      <motion.div
        className="absolute left-1/2 top-[16%] h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,190,90,0.15) 0deg 2.4deg, transparent 2.4deg 15deg)",
          maskImage: "radial-gradient(circle, transparent 12%, black 22%, transparent 60%)",
        }}
        initial={{ opacity: 0, rotate: -20 }}
        animate={reduce ? { opacity: 0.8, rotate: 0 } : { opacity: 0.8, rotate: 360 }}
        transition={{
          opacity: { duration: 1.4 },
          rotate: reduce ? { duration: 1.4 } : { duration: 90, repeat: Infinity, ease: "linear" },
        }}
      />
      {/* the sun core */}
      <motion.div
        className="absolute left-1/2 top-[16%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
        style={{ background: "radial-gradient(circle, rgba(255,180,70,0.7), rgba(255,120,40,0.25) 45%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={reduce ? { opacity: 0.9, scale: 1 } : { opacity: [0.75, 0.95, 0.75], scale: 1 }}
        transition={{
          opacity: reduce ? { duration: 1.4 } : { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 1.4, ease: EASE },
        }}
      />
      {/* warm dust drifting up */}
      {!reduce &&
        BUBBLES.slice(0, 9).map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-amber-300/70"
            style={{ left: `${b.left}%`, top: `${20 + (i % 4) * 12}%`, width: b.size * 0.7, height: b.size * 0.7 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: [0, -40, -80] }}
            transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </>
  );
}

function ShieldScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, rgba(255,110,140,0.10) 0 1px, transparent 1px 26px), repeating-linear-gradient(-60deg, rgba(255,110,140,0.10) 0 1px, transparent 1px 26px)",
          maskImage: "radial-gradient(80% 70% at 50% 30%, black, transparent 75%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.3 }}
      />
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(255,120,150,0.18), transparent)",
            filter: "blur(6px)",
          }}
          initial={{ top: "-10%" }}
          animate={{ top: ["-10%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </>
  );
}

const SCENES: Record<ProjectTheme, ComponentType<{ reduce: boolean | null }>> = {
  topography: ForestScene,
  aurora: OceanScene,
  route: RouteScene,
  grid: GridScene,
  signal: SignalScene,
  solar: SolarScene,
  shield: ShieldScene,
};

export function ProjectBackground({
  theme,
  sceneKey,
}: {
  theme: ProjectTheme;
  sceneKey: string;
}) {
  const reduce = useReducedMotion();
  const Scene = SCENES[theme];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[9] overflow-hidden">
      {/* keyed so the whole scene remounts + replays its entrance per project */}
      <motion.div
        key={sceneKey}
        className="absolute inset-0"
        style={{ background: THEME_BG[theme] }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Scene reduce={reduce} />
        {/* soft dark veil so the scene never fights the copy */}
        <div className="absolute inset-0 bg-canvas/30" />
      </motion.div>

      {/* readability scrims */}
      <div className="absolute inset-0 bg-[radial-gradient(140%_110%_at_50%_-10%,transparent_42%,var(--color-canvas)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas/85 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
