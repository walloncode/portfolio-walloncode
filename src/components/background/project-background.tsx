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
    "radial-gradient(120% 100% at 50% 14%, #bfe6ff 0%, #7cc0f0 32%, #4a97d8 58%, #2b6aa8 80%, var(--color-canvas) 100%)",
  aurora:
    "radial-gradient(125% 95% at 50% 6%, #072b41 0%, #04121f 52%, var(--color-canvas) 100%)",
  route:
    "radial-gradient(125% 95% at 50% 8%, #0d1533 0%, #070a1a 52%, var(--color-canvas) 100%)",
  garage:
    "radial-gradient(120% 92% at 50% 0%, #1b2450 0%, #0d1230 46%, #070a1a 74%, var(--color-canvas) 100%)",
  grid: "radial-gradient(125% 95% at 50% 8%, #170d2e 0%, #0a0716 52%, var(--color-canvas) 100%)",
  diner:
    "radial-gradient(120% 95% at 50% 6%, #21432e 0%, #14291c 46%, #0b1710 74%, var(--color-canvas) 100%)",
  signal:
    "radial-gradient(125% 95% at 50% 8%, #062d31 0%, #04141a 52%, var(--color-canvas) 100%)",
  solar:
    "radial-gradient(120% 100% at 50% 16%, #aee0ff 0%, #6fb7ee 34%, #3f8fd6 60%, #245e9e 82%, var(--color-canvas) 100%)",
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

// Filled hill ridge across the 1440-wide rural scene, from `baseY` down to the
// bottom, with a gentle sine roll. Stacked back-to-front for depth.
function ridge(baseY: number, amp: number, period: number, phase = 0) {
  const W = 1440;
  const B = 600;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 20) {
    const y = baseY + amp * Math.sin((x / period) * Math.PI * 2 + phase);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${B} L${pts.join(" L")} L${W},${B} Z`;
}

const BUBBLES = Array.from({ length: 12 }, (_, i) => {
  const r = Math.abs(Math.sin((i + 3) * 45.164) * 43758.5453) % 1;
  const r2 = Math.abs(Math.sin((i + 3) * 91.113) * 43758.5453) % 1;
  return { left: 5 + r * 90, size: 3 + r2 * 6, delay: r2 * 6, dur: 7 + r * 6 };
});

// Slow-drifting sky clouds for the solar scene. Negative delays offset each
// cloud so the loop is already in progress on mount (no synchronized start).
const CLOUDS = [
  { top: "20%", scale: 1.15, dur: 52, delay: 0, op: 0.92 },
  { top: "40%", scale: 0.78, dur: 66, delay: -22, op: 0.72 },
  { top: "12%", scale: 0.62, dur: 58, delay: -38, op: 0.66 },
  { top: "52%", scale: 0.98, dur: 74, delay: -55, op: 0.8 },
  { top: "30%", scale: 0.5, dur: 44, delay: -14, op: 0.58 },
];

// A single cloud built from overlapping soft white puffs.
function Cloud() {
  const puffs = [
    { l: 0, t: 22, s: 62 },
    { l: 30, t: 2, s: 82 },
    { l: 70, t: 18, s: 68 },
    { l: 44, t: 32, s: 58 },
  ];
  return (
    <div className="relative h-20 w-44">
      {puffs.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.l,
            top: p.t,
            width: p.s,
            height: p.s,
            background:
              "radial-gradient(circle at 35% 30%, #ffffff, rgba(255,255,255,0.9) 55%, rgba(232,244,255,0.55) 80%, transparent)",
            filter: "blur(4px)",
          }}
        />
      ))}
    </div>
  );
}

/* --------------------------------- scenes --------------------------------- */

function RuralScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      {/* warm sun glow, upper right */}
      <motion.div
        className="absolute left-[70%] top-[9%] h-72 w-72 rounded-full blur-[64px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,244,196,0.6), rgba(255,214,120,0.24) 45%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={reduce ? { opacity: 0.85, scale: 1 } : { opacity: [0.7, 0.9, 0.7], scale: 1 }}
        transition={{
          opacity: reduce ? { duration: 1.4 } : { duration: 6, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 1.4, ease: EASE },
        }}
      />

      {/* drifting clouds */}
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: c.top, opacity: c.op }}
          initial={{ x: reduce ? `${8 + i * 18}vw` : "-30vw" }}
          animate={reduce ? { x: `${8 + i * 18}vw` } : { x: ["-30vw", "125vw"] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: reduce ? 0 : Infinity, ease: "linear" }}
        >
          <div style={{ transform: `scale(${c.scale})`, transformOrigin: "left center" }}>
            <Cloud />
          </div>
        </motion.div>
      ))}

      {/* rural landscape: rolling hills + winding river + a viaduct bridge */}
      <motion.svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[76%] w-full"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <defs>
          <linearGradient id="rr-river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ad5f7" />
            <stop offset="100%" stopColor="#2f7fc0" />
          </linearGradient>
          <linearGradient id="rr-hill-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#74ad6c" />
            <stop offset="100%" stopColor="#528f54" />
          </linearGradient>
        </defs>

        {/* far + mid rolling hills */}
        <path d={ridge(324, 24, 780)} fill="url(#rr-hill-far)" opacity="0.9" />
        <path d={ridge(372, 30, 520, 1.2)} fill="#3f8248" />

        {/* winding river coming down from the hills */}
        <path
          d="M712,356 C704,420 640,458 660,524 C670,566 616,584 600,600 L884,600 C872,576 832,560 822,522 C808,474 766,430 742,356 Z"
          fill="url(#rr-river)"
          opacity="0.92"
        />

        {/* bridge arches (behind the deck) */}
        <g fill="none" stroke="#c3c9d0" strokeWidth="7">
          <path d="M560,387 Q618,432 676,387" />
          <path d="M666,387 Q720,438 774,387" />
          <path d="M764,387 Q822,432 880,387" />
        </g>
        {/* bridge deck, railing posts and piers */}
        <g fill="#dbe0e6">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={498 + i * 40} y="364" width="4" height="9" />
          ))}
          <rect x="486" y="372" width="470" height="15" rx="2" />
          <rect x="612" y="387" width="13" height="66" />
          <rect x="714" y="387" width="13" height="72" />
          <rect x="816" y="387" width="13" height="66" />
        </g>

        {/* near banks (front), framing the river */}
        <path d="M0,600 L0,444 C130,454 270,488 372,538 C438,570 476,588 486,600 Z" fill="#2b6238" />
        <path d="M1440,600 L1440,444 C1310,454 1170,488 1068,538 C1002,570 964,588 954,600 Z" fill="#265a33" />

        {/* a couple of roadside trees on the banks */}
        <g>
          <rect x="112" y="470" width="7" height="26" fill="#3a2a18" />
          <circle cx="115" cy="466" r="20" fill="#24623a" />
          <rect x="1322" y="474" width="7" height="24" fill="#3a2a18" />
          <circle cx="1325" cy="470" r="18" fill="#20573380" />
          <circle cx="1325" cy="470" r="18" fill="#245e37" />
        </g>
      </motion.svg>
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
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,224,130,0.28) 0deg 2.4deg, transparent 2.4deg 15deg)",
          maskImage: "radial-gradient(circle, transparent 12%, black 22%, transparent 60%)",
        }}
        initial={{ opacity: 0, rotate: -20 }}
        animate={reduce ? { opacity: 0.85, rotate: 0 } : { opacity: 0.85, rotate: 360 }}
        transition={{
          opacity: { duration: 1.4 },
          rotate: reduce ? { duration: 1.4 } : { duration: 90, repeat: Infinity, ease: "linear" },
        }}
      />
      {/* the vibrant sun core */}
      <motion.div
        className="absolute left-1/2 top-[16%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[55px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,252,235,0.98), rgba(255,214,90,0.8) 38%, rgba(255,160,50,0.3) 62%, transparent 74%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={reduce ? { opacity: 0.95, scale: 1 } : { opacity: [0.85, 1, 0.85], scale: 1 }}
        transition={{
          opacity: reduce ? { duration: 1.4 } : { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 1.4, ease: EASE },
        }}
      />
      {/* drifting sky clouds */}
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: c.top, opacity: c.op }}
          initial={{ x: reduce ? `${8 + i * 18}vw` : "-30vw" }}
          animate={reduce ? { x: `${8 + i * 18}vw` } : { x: ["-30vw", "125vw"] }}
          transition={{
            duration: c.dur,
            delay: c.delay,
            repeat: reduce ? 0 : Infinity,
            ease: "linear",
          }}
        >
          <div style={{ transform: `scale(${c.scale})`, transformOrigin: "left center" }}>
            <Cloud />
          </div>
        </motion.div>
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

// Warm ambient bokeh + hanging pendant lights for the restaurant scene.
const BOKEH = Array.from({ length: 16 }, (_, i) => {
  const r = Math.abs(Math.sin((i + 2) * 51.17) * 43758.5453) % 1;
  const r2 = Math.abs(Math.sin((i + 2) * 24.31) * 43758.5453) % 1;
  return { left: 4 + r * 92, top: 8 + r2 * 66, size: 6 + r2 * 16, delay: r * 5, dur: 5 + r * 5 };
});

const PENDANTS = [
  { left: "27%", drop: 118, glow: 150 },
  { left: "50%", drop: 88, glow: 200 },
  { left: "73%", drop: 138, glow: 150 },
];

function DinerScene({ reduce }: { reduce: boolean | null }) {
  const CREAM = "#fff0d3";
  const ORANGE = "#e8542b";
  return (
    <>
      {/* hanging pendant lights casting a warm glow */}
      {PENDANTS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: p.left }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: EASE }}
        >
          <div className="mx-auto w-px bg-white/15" style={{ height: p.drop }} />
          <motion.div
            className="relative mx-auto h-3 w-3 -translate-y-1 rounded-full"
            style={{ background: ORANGE, boxShadow: `0 0 26px 7px ${ORANGE}` }}
            animate={reduce ? undefined : { opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-b-full"
            style={{
              top: p.drop,
              width: p.glow,
              height: p.glow * 1.5,
              background: "radial-gradient(60% 80% at 50% 0%, rgba(232,84,43,0.26), transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        </motion.div>
      ))}

      {/* warm ambient bokeh */}
      {!reduce &&
        BOKEH.map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: b.size,
              height: b.size,
              background: i % 3 === 0 ? ORANGE : CREAM,
              filter: "blur(2px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -12, 0] }}
            transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

      {/* a steaming plate at center-bottom */}
      <motion.div
        className="absolute bottom-[13%] left-1/2 h-[170px] w-[240px] -translate-x-1/2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
      >
        {/* rising steam */}
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: 96 + i * 24,
                bottom: 66,
                width: 9,
                height: 84,
                background:
                  "linear-gradient(to top, rgba(255,240,211,0), rgba(255,240,211,0.5), rgba(255,240,211,0))",
                filter: "blur(6px)",
              }}
              initial={{ opacity: 0, y: 0, scaleY: 0.7 }}
              animate={{ opacity: [0, 0.7, 0], y: [-6, -84], scaleY: [0.7, 1.25] }}
              transition={{ duration: 5 + i, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
        {/* plate + food */}
        <svg viewBox="0 0 240 96" className="absolute bottom-0 h-auto w-full">
          <ellipse cx="120" cy="66" rx="116" ry="26" fill="#0f2116" opacity="0.7" />
          <ellipse cx="120" cy="60" rx="116" ry="26" fill={CREAM} />
          <ellipse cx="120" cy="60" rx="78" ry="16" fill="#ecdfc0" />
          <path d="M74,60 Q120,26 166,60 Z" fill={ORANGE} />
          <ellipse cx="120" cy="60" rx="46" ry="9" fill="#c8431f" />
        </svg>
      </motion.div>
    </>
  );
}

/* --------------------------------- garage --------------------------------- */

// A single side-view car drawn in local coords (~248 wide), so the parent
// <motion.g> owns its placement (translate/scale) and staged entrance.
function Car({ color, glass = "#141b34" }: { color: string; glass?: string }) {
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx="124" cy="98" rx="126" ry="12" fill="#000" opacity="0.4" />
      {/* body */}
      <path
        d="M8,70 C6,52 16,48 34,46 L62,46 C80,26 110,20 140,20 L172,20 C196,20 214,32 228,50 L240,54 C250,58 252,66 250,76 L250,84 C250,90 246,92 240,92 L22,92 C12,92 6,84 8,70 Z"
        fill={color}
      />
      {/* greenhouse / windows */}
      <path d="M72,46 C86,30 110,26 138,26 L160,26 C180,26 196,34 208,46 Z" fill={glass} />
      {/* door seam */}
      <line x1="140" y1="30" x2="140" y2="88" stroke="#00000033" strokeWidth="2" />
      {/* wheels */}
      <g>
        <circle cx="74" cy="92" r="19" fill="#0a0e1b" />
        <circle cx="74" cy="92" r="8" fill="#333d5e" />
        <circle cx="198" cy="92" r="19" fill="#0a0e1b" />
        <circle cx="198" cy="92" r="8" fill="#333d5e" />
      </g>
      {/* headlight */}
      <circle cx="246" cy="70" r="4" fill="#fff6cc" />
    </g>
  );
}

// Parked fleet — varied indigo tones and slight depth offsets so the row reads
// as several vehicles bay-parked rather than one shape repeated.
const GARAGE_CARS = [
  { x: 20, y: 402, scale: 1.02, color: "#3c4a86" },
  { x: 360, y: 420, scale: 1.16, color: "#5566c4" },
  { x: 728, y: 406, scale: 1.06, color: "#2f3d72" },
  { x: 1040, y: 424, scale: 1.2, color: "#46589f" },
];

// Overhead fluorescent light bars.
const GARAGE_LIGHTS = [
  { left: "20%", dur: 6 },
  { left: "50%", dur: 7.5 },
  { left: "80%", dur: 5 },
];

function GarageScene({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      {/* ceiling light bars, each casting a soft cone onto the floor */}
      {GARAGE_LIGHTS.map((g, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: g.left, transform: "translateX(-50%)" }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
        >
          <motion.div
            className="h-2 w-28 rounded-full sm:w-40"
            style={{ background: "#cfe0ff", boxShadow: "0 0 24px 6px rgba(160,190,255,0.6)" }}
            animate={reduce ? undefined : { opacity: [0.75, 1, 0.85, 1] }}
            transition={{ duration: g.dur, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute left-1/2 top-2 -translate-x-1/2"
            style={{
              width: 260,
              height: 340,
              background:
                "radial-gradient(60% 80% at 50% 0%, rgba(150,180,255,0.18), transparent 72%)",
              filter: "blur(6px)",
            }}
          />
        </motion.div>
      ))}

      {/* garage interior: back wall, roll-up door, floor + parking bays + fleet */}
      <motion.svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[82%] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <defs>
          <linearGradient id="gg-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2143" />
            <stop offset="100%" stopColor="#0a0e20" />
          </linearGradient>
          <linearGradient id="gg-door" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#232c52" />
            <stop offset="100%" stopColor="#161d3a" />
          </linearGradient>
        </defs>

        {/* floor plane */}
        <rect x="0" y="470" width="1440" height="130" fill="url(#gg-floor)" />

        {/* roll-up door on the back wall */}
        <g opacity="0.55">
          <rect x="470" y="250" width="500" height="220" rx="6" fill="url(#gg-door)" />
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1="470"
              x2="970"
              y1={278 + i * 27}
              y2={278 + i * 27}
              stroke="#0b1024"
              strokeWidth="3"
            />
          ))}
        </g>

        {/* perspective parking-bay stripes on the floor */}
        <g stroke="#7f93d8" strokeWidth="3" opacity="0.3">
          {[220, 560, 900, 1240].map((x, i) => (
            <line key={i} x1={x} y1="472" x2={x + (x - 720) * 0.5} y2="600" />
          ))}
        </g>

        {/* the parked fleet */}
        {GARAGE_CARS.map((c, i) => (
          <motion.g
            key={i}
            initial={
              reduce
                ? { opacity: 1, x: c.x, y: c.y, scale: c.scale }
                : { opacity: 0, x: c.x, y: c.y + 70, scale: c.scale }
            }
            animate={{ opacity: 1, x: c.x, y: c.y, scale: c.scale }}
            transition={{ duration: 1, delay: 0.25 + i * 0.14, ease: EASE }}
          >
            <Car color={c.color} />
          </motion.g>
        ))}
      </motion.svg>
    </>
  );
}

const SCENES: Record<ProjectTheme, ComponentType<{ reduce: boolean | null }>> = {
  topography: RuralScene,
  diner: DinerScene,
  aurora: OceanScene,
  route: RouteScene,
  garage: GarageScene,
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
