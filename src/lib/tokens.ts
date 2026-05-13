// closer-gym — TS-side design tokens.
// CSS-side tokens live in src/app/globals.css (CSS variables). This file is for
// non-CSS values: ELO bands, layout pixels read by JS, animation timings,
// title-tier definitions.

export const ELO_BANDS = {
  PATZER: { min: 0,    max: 1199, label: "Patzer",                   tier: "low" as const },
  D:      { min: 1200, max: 1399, label: "Class D Closer",           tier: "low" as const },
  C:      { min: 1400, max: 1599, label: "Class C Closer",           tier: "low" as const },
  B:      { min: 1600, max: 1799, label: "Class B Closer",           tier: "low" as const },
  A:      { min: 1800, max: 1999, label: "Class A Closer",           tier: "exp" as const },
  EXPERT: { min: 2000, max: 2199, label: "Expert",                   tier: "exp" as const },
  MASTER: { min: 2200, max: 2299, label: "Master",                   tier: "m"   as const },
  IM:     { min: 2300, max: 2399, label: "International Master",     tier: "im"  as const },
  GM:     { min: 2400, max: 9999, label: "Grandmaster Closer",       tier: "gm"  as const },
};

export function titleForRating(rating: number): { label: string; tier: "low" | "exp" | "m" | "im" | "gm" } {
  for (const band of Object.values(ELO_BANDS)) {
    if (rating >= band.min && rating <= band.max) return { label: band.label, tier: band.tier };
  }
  return { label: "Patzer", tier: "low" };
}

// Initial Glicko-2 state for a brand-new account.
export const INITIAL_RATING = 1200;
export const INITIAL_RD = 350;       // rating deviation — high until calibrated
export const INITIAL_VOLATILITY = 0.06;

// Time controls (chess.com Bullet / Blitz / Rapid / Classical → our equivalents).
export const TIME_CONTROLS = [
  { id: "bullet",    label: "Bullet",    seconds: 5 * 60,  description: "Cold-open / hostile gatekeeper. Time pressure forces instinct." },
  { id: "rapid",     label: "Rapid",     seconds: 15 * 60, description: "Standard discovery + close window." },
  { id: "classical", label: "Classical", seconds: 45 * 60, description: "Complex multi-stakeholder enterprise sale." },
] as const;
export type TimeControlId = (typeof TIME_CONTROLS)[number]["id"];

// Layout pixel constants — read by JS where Tailwind/CSS arbitrary values are clunky.
export const LAYOUT = {
  TOPNAV_HEIGHT: 56,
  SIDEBAR_WIDTH: 60,
  EVAL_BAR_WIDTH: 28,
  RIGHT_RAIL_WIDTH: 320,
  PLAYER_CARD_HEIGHT: 48,
  OPENING_BANNER_HEIGHT: 32,
  CONTROL_TOOLBAR_HEIGHT: 40,
  MOVE_ROW_HEIGHT: 28,
};

// Move-quality thresholds (eval delta in our centipawn-equivalent units).
// Used by the detector → eval pipeline to assign blunder markers post-game.
export const MOVE_QUALITY_THRESHOLDS = {
  BRILLIANT:  +0.8,
  GOOD:       +0.3,
  NEUTRAL:    -0.15,
  INACCURACY: -0.5,
  MISTAKE:    -1.0,
  BLUNDER:    -1.5,
} as const;

export function classifyMove(deltaEval: number): {
  glyph: "" | "!!" | "!" | "?!" | "?" | "??";
  className: "" | "brilliant" | "good" | "inaccuracy" | "mistake" | "blunder";
  label: string;
} {
  if (deltaEval >= MOVE_QUALITY_THRESHOLDS.BRILLIANT)
    return { glyph: "!!", className: "brilliant", label: "Brilliant" };
  if (deltaEval >= MOVE_QUALITY_THRESHOLDS.GOOD)
    return { glyph: "!", className: "good", label: "Good" };
  if (deltaEval >= MOVE_QUALITY_THRESHOLDS.NEUTRAL)
    return { glyph: "", className: "", label: "Book" };
  if (deltaEval >= MOVE_QUALITY_THRESHOLDS.INACCURACY)
    return { glyph: "?!", className: "inaccuracy", label: "Inaccuracy" };
  if (deltaEval >= MOVE_QUALITY_THRESHOLDS.MISTAKE)
    return { glyph: "?", className: "mistake", label: "Mistake" };
  return { glyph: "??", className: "blunder", label: "Blunder" };
}

// Animation timings (ms). Used by Framer-less CSS transitions where consistency matters.
export const ANIM = {
  EVAL_BAR_FADE: 350,   // matches CSS evalbar-fill transition
  BUBBLE_IN: 180,
  TOAST_LIFE: 3000,
};
