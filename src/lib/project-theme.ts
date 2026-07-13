import type { CSSProperties } from "react";
import type { ProjectTheme } from "@/content/projects";

/**
 * Per-theme accent palette. Each project tab overrides the global accent
 * tokens (`--color-accent*`) with a palette that matches its background scene,
 * so every accent-driven element — bullets, buttons, badges, links, focus
 * rings, the contact menu — re-colors to fit the project without touching the
 * components themselves. Kiuseven (solar) reads gold on its blue sky; RotaRural
 * (topography) reads leaf-green; WKCODE (aurora) reads ocean blue; and so on.
 */
interface AccentPalette {
  accent: string;
  accentHover: string;
  accentSolid: string;
  accentSolidHover: string;
  accentForeground: string;
  accentSoft: string;
  accentBorder: string;
  /** Optional text overrides — e.g. Kiuseven wants white copy, never gray. */
  foregroundMuted?: string;
  foregroundSubtle?: string;
}

const PALETTES: Record<ProjectTheme, AccentPalette> = {
  // RotaRural — real brand palette: green #017B3D, blue #0089DA, gray #BFBFBF.
  // Blue drives the visible marks (readable on the dark forest scene), green the
  // buttons, gray the secondary copy — matching the logo's tagline underline.
  topography: {
    accent: "#0089da", // blue — bullets, underlines, fills (bg-accent)
    accentHover: "#2ba3e8", // lighter blue — section labels & links
    accentSolid: "#017b3d", // green — buttons
    accentSolidHover: "#016430",
    accentForeground: "#ffffff", // white text on green button
    accentSoft: "rgba(0, 137, 218, 0.15)",
    accentBorder: "rgba(1, 123, 61, 0.42)",
    foregroundSubtle: "#bfbfbf", // brand gray for meta/subtle copy
  },
  // NetManager — route indigo/blue
  route: {
    accent: "#6d8bff",
    accentHover: "#8ea6ff",
    accentSolid: "#4f6bf0",
    accentSolidHover: "#3f57cf",
    accentForeground: "#ffffff",
    accentSoft: "rgba(109, 139, 255, 0.13)",
    accentBorder: "rgba(109, 139, 255, 0.34)",
  },
  // Bonaire — real brand palette: orange #E8542B, dark green #1A3825, cream
  // #FFF0D3. Orange drives marks/buttons, cream is the warm body copy (no gray),
  // matching the restaurant's cozy identity.
  diner: {
    accent: "#e8542b", // orange — bullets, underlines, fills
    accentHover: "#f2724a", // lighter orange — section labels & links
    accentSolid: "#e8542b", // orange buttons
    accentSolidHover: "#cf4420",
    accentForeground: "#fff0d3", // cream text on orange button
    accentSoft: "rgba(232, 84, 43, 0.15)",
    accentBorder: "rgba(232, 84, 43, 0.38)",
    foregroundMuted: "#fff0d3", // warm cream body copy
    foregroundSubtle: "rgba(255, 240, 211, 0.66)",
  },
  // BarberPro — grid violet
  grid: {
    accent: "#a78bfa",
    accentHover: "#c4b0ff",
    accentSolid: "#8b5cf6",
    accentSolidHover: "#7644e6",
    accentForeground: "#ffffff",
    accentSoft: "rgba(167, 139, 250, 0.13)",
    accentBorder: "rgba(167, 139, 250, 0.34)",
  },
  // Agente IXC — signal cyan
  signal: {
    accent: "#34d6e6",
    accentHover: "#65e6f2",
    accentSolid: "#16b3c4",
    accentSolidHover: "#1195a4",
    accentForeground: "#04161a",
    accentSoft: "rgba(52, 214, 230, 0.13)",
    accentBorder: "rgba(52, 214, 230, 0.34)",
  },
  // WKCODE — aurora ocean blue
  aurora: {
    accent: "#38bdf8",
    accentHover: "#6fd2fb",
    accentSolid: "#1a9fe0",
    accentSolidHover: "#1483bd",
    accentForeground: "#04121c",
    accentSoft: "rgba(56, 189, 248, 0.13)",
    accentBorder: "rgba(56, 189, 248, 0.34)",
  },
  // Kiuseven — real brand palette: blue #008EC4, green #7CD600, yellow #F0C900,
  // white copy (never gray). Green drives fills/underlines, yellow the labels,
  // blue the buttons.
  solar: {
    accent: "#7cd600", // green — bullets, underlines, fills (bg-accent)
    accentHover: "#f0c900", // yellow — section labels & links (text-accent-hover)
    accentSolid: "#008ec4", // blue — buttons
    accentSolidHover: "#0b7aa6",
    accentForeground: "#ffffff", // white text on blue button
    accentSoft: "rgba(0, 142, 196, 0.16)",
    accentBorder: "rgba(124, 214, 0, 0.42)",
    foregroundMuted: "#ffffff",
    foregroundSubtle: "rgba(255, 255, 255, 0.74)",
  },
  // Phishing — shield rose/red
  shield: {
    accent: "#ff6e8c",
    accentHover: "#ff92a8",
    accentSolid: "#ec4d6e",
    accentSolidHover: "#d43a5a",
    accentForeground: "#1c060b",
    accentSoft: "rgba(255, 110, 140, 0.13)",
    accentBorder: "rgba(255, 110, 140, 0.34)",
  },
};

/**
 * CSS custom-property overrides for a project theme, to spread onto a wrapper's
 * `style`. Everything below it that reads `--color-accent*` re-themes.
 */
export function projectAccentVars(theme: ProjectTheme): CSSProperties {
  const p = PALETTES[theme];
  return {
    "--color-accent": p.accent,
    "--color-accent-hover": p.accentHover,
    "--color-accent-solid": p.accentSolid,
    "--color-accent-solid-hover": p.accentSolidHover,
    "--color-accent-foreground": p.accentForeground,
    "--color-accent-soft": p.accentSoft,
    "--color-accent-border": p.accentBorder,
    ...(p.foregroundMuted ? { "--color-foreground-muted": p.foregroundMuted } : {}),
    ...(p.foregroundSubtle ? { "--color-foreground-subtle": p.foregroundSubtle } : {}),
  } as CSSProperties;
}
