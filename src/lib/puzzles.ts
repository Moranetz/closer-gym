// Puzzle schema — single-position drills.
// Each puzzle: buyer setup + buyer line + 4 candidate operator responses, each
// hand-scored with eval delta + rationale + atlas tags. Best candidate (highest eval)
// is the "solution".
//
// No LLM at any step — solving is 100% offline. Free.

export type PuzzleTheme =
  | "budget"
  | "procurement"
  | "stall"
  | "renewal"
  | "multistakeholder"
  | "endgame"
  | "cold-open";

export interface PuzzleCandidate {
  text: string;          // exact operator response
  eval: number;          // -2.0 to +2.0 — engine delta this move scores
  rationale: string;     // 1-2 sentences for the post-solve reveal
  atlasTags: string[];   // technique IDs this candidate deploys (informational)
}

export interface Puzzle {
  id: string;
  theme: PuzzleTheme;
  difficulty: number;    // ELO-equivalent
  buyerRole: string;     // who the prospect is, 1-line
  setup: string;         // 1-3 sentences of context for the position
  buyerLine: string;     // exact quote from buyer
  candidates: PuzzleCandidate[];   // exactly 4, shuffled at display time
  bestIndex: number;     // 0-3, the eval-maximizing candidate (canonical index pre-shuffle)
  themeHint?: string;    // optional hint shown post-solve, "this is a classic procurement-anchor"
}

// Helpers
export const THEME_LABELS: Record<PuzzleTheme, string> = {
  "budget":           "Budget objections",
  "procurement":      "Procurement gauntlet",
  "stall":            "Stall / silence",
  "renewal":          "Renewal saves",
  "multistakeholder": "Multi-stakeholder",
  "endgame":          "Endgame studies",
  "cold-open":        "Cold opens",
};

export const THEME_COLORS: Record<PuzzleTheme, string> = {
  "budget":           "#E5A50A",  // gold — budget
  "procurement":      "#A4262C",  // red — adversarial
  "stall":            "#3692E7",  // blue — patience
  "renewal":          "#81B64C",  // green — keep
  "multistakeholder": "#AB6B2E",  // bronze — multi
  "endgame":          "#1BAAA6",  // teal — close
  "cold-open":        "#9B6BA5",  // purple — open
};

export function difficultyTier(rating: number): "Beginner" | "Intermediate" | "Advanced" | "Expert" {
  if (rating < 1500) return "Beginner";
  if (rating < 1800) return "Intermediate";
  if (rating < 2100) return "Advanced";
  return "Expert";
}
