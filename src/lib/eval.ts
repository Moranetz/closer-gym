// Delta-mechanics — v1 eval function.
//
// Input: per-utterance tagged moves + persona spec.
// Output: scalar deal-probability delta in [-2.0, +2.0] per move,
//          aggregated into running "eval" value that drives the eval bar.
//
// Method: hand-tuned heuristics keyed off Atlas technique IDs ×
//          persona.contraindicatedTechniques / .likelyResponsiveTechniques.
//
// This is calibrated against the Atlas literature (low folklore-risk +
// well-studied techniques weighted heavier; replication-failed weighted near zero).
// v2 will train on labeled win/loss data from sales-instrument.

import type { Persona, SessionTurn } from "./types";
import { TECHNIQUES, getTechnique } from "./techniques";

/** Eval state evolves across the game. Internal — not shown to the player during live play. */
export interface EvalState {
  /** Running eval, signed. + = closer to commit; - = closer to lost. */
  value: number;
  /** Persona internal psych state (HIDDEN from operator during play; revealed post-game). */
  trust: number;      // 0-100
  value_perceived: number; // 0-100
  urgency: number;    // 0-100
  /** Objections raised but not yet resolved. */
  openObjections: string[];
  /** Stacking detector — three named techniques in one turn triggers persuasion-knowledge. */
  recentTechniqueDensity: number;
  /** Move-by-move deltas (used to score blunders post-game). */
  history: { turnIndex: number; delta: number; reason: string; techniques: string[] }[];
}

export const initialEvalState = (persona: Persona): EvalState => ({
  value: persona.valence * 0.3,   // start slightly negative for guarded buyers
  trust: 35 + persona.valence * 5,
  value_perceived: 25,
  urgency: 15 + persona.certainty * 4,
  openObjections: [],
  recentTechniqueDensity: 0,
  history: [],
});

/**
 * Score a single operator move given the technique tags Claude attached to it.
 * Returns the eval delta + a one-line reason for the post-game review.
 */
export interface ScoreOptions {
  turnIndex: number;
  operatorText: string;
  techniqueIds: string[];   // from detector
  persona: Persona;
  state: EvalState;
}
export interface ScoreResult {
  delta: number;
  reason: string;
  newState: EvalState;
}

export function scoreOperatorMove(opts: ScoreOptions): ScoreResult {
  const { techniqueIds, persona, state, operatorText, turnIndex } = opts;
  const reasons: string[] = [];
  let delta = 0;

  const techs = techniqueIds
    .map((id) => getTechnique(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const techWeight = (verdict: string, folklore: string) => {
    let w = 1.0;
    if (verdict === "well-studied") w *= 1.15;
    else if (verdict === "partially-studied") w *= 0.85;
    else if (verdict === "untested-in-database") w *= 0.65;
    else if (verdict === "replication-failed") w *= 0.25;
    if (folklore === "low") w *= 1.05;
    else if (folklore === "medium-high") w *= 0.65;
    else if (folklore === "high") w *= 0.4;
    return w;
  };

  for (const t of techs) {
    const w = techWeight(t.atlasVerdict, t.folkloreRisk);
    if (persona.contraindicatedTechniques.includes(t.id)) {
      delta -= 0.55 * w;
      reasons.push(`${t.name} contraindicated vs this persona`);
    } else if (persona.likelyResponsiveTechniques.includes(t.id)) {
      delta += 0.45 * w;
      reasons.push(`${t.name} responsive on this persona`);
    } else {
      // Neutral technique: small positive if it's a well-studied core, near-zero otherwise.
      delta += 0.12 * w;
    }
  }

  // Stacking penalty — chess.com equivalent of "trying to deliver mate-in-1 every move".
  const densityThisTurn = techs.length;
  let newDensity = state.recentTechniqueDensity * 0.5 + densityThisTurn;
  if (densityThisTurn >= 3 && persona.persuasionKnowledge !== "low") {
    delta -= 0.4;
    reasons.push("technique-stacking detected by persuasion-knowledge");
  }
  if (newDensity > 6 && persona.persuasionKnowledge === "high") {
    delta -= 0.3;
    reasons.push("persistent density — persuasion-knowledge fully fired");
  }

  // Question-form bonus — calibrated open-ended questions consistently raise trust.
  const askedOpenQuestion = /(?:^|\s)(?:how|what|where|when|why|tell me|walk me through)\b/i.test(
    operatorText,
  );
  if (askedOpenQuestion && techs.length === 0) {
    delta += 0.12;
    reasons.push("calibrated question without technique stack");
  }

  // Length penalty — operator monologues longer than ~300 chars without a question lose buyer attention.
  if (operatorText.length > 300 && !operatorText.includes("?")) {
    delta -= 0.18;
    reasons.push("monologue without invitation to respond");
  }

  // Floor + ceiling so single moves can't swing the eval by more than 1.5.
  delta = Math.max(-1.5, Math.min(1.5, delta));

  // Update internal persona state.
  const trust = Math.max(0, Math.min(100, state.trust + delta * 8));
  const value_perceived = Math.max(0, Math.min(100, state.value_perceived + Math.max(0, delta) * 5));
  const urgency = state.urgency; // urgency moves mostly on time-control + content, handled elsewhere

  const reason = reasons.length > 0 ? reasons.join("; ") : "neutral / no signal";

  const newState: EvalState = {
    ...state,
    value: state.value + delta,
    trust,
    value_perceived,
    urgency,
    recentTechniqueDensity: newDensity,
    history: [
      ...state.history,
      { turnIndex, delta, reason, techniques: techniqueIds },
    ],
  };
  return { delta, reason, newState };
}

/**
 * Score a persona response. Doesn't shift eval much by itself — most signal
 * comes from operator moves. But strong commitment moves (e.g. "let's set up
 * the demo") OR strong objections / silences shift it.
 */
export function scorePersonaMove(opts: {
  turnIndex: number;
  personaText: string;
  state: EvalState;
}): { delta: number; newState: EvalState } {
  const { personaText, state, turnIndex } = opts;
  let delta = 0;
  const reasons: string[] = [];

  const lower = personaText.toLowerCase();

  // Commitment signals.
  if (/(let'?s|sounds good|send me|book the|set up|next step|move forward|move ahead)/.test(lower)) {
    delta += 0.4;
    reasons.push("buyer commitment signal");
  }
  // Hard objection / shutdown signals.
  if (/(not interested|not a fit|no thanks|don'?t see|won'?t work|too expensive|can'?t justify)/.test(lower)) {
    delta -= 0.5;
    reasons.push("buyer hard objection");
  }
  // Asking back signals — good, but caps eval (still earning).
  if (/^[^.!?]*\?[^?]*$/.test(personaText) && personaText.length < 200) {
    delta += 0.1;
    reasons.push("buyer engaging with question");
  }
  // Defensive shortness — terse no-elab responses.
  if (personaText.length < 40 && state.value > 0) {
    delta -= 0.15;
    reasons.push("buyer terse — guard back up");
  }

  delta = Math.max(-1.0, Math.min(0.8, delta));

  const reason = reasons.length ? reasons.join("; ") : "neutral persona response";

  return {
    delta,
    newState: {
      ...state,
      value: state.value + delta,
      trust: Math.max(0, Math.min(100, state.trust + delta * 5)),
      history: [
        ...state.history,
        { turnIndex, delta, reason, techniques: [] },
      ],
    },
  };
}

/**
 * Convert running eval value into the 0-1 fill ratio for the eval bar.
 * Eval -2 → 0 (buyer dominating), 0 → 0.5, +2 → 1 (closer dominating).
 */
export function evalToFillRatio(value: number): number {
  const clamped = Math.max(-2.5, Math.min(2.5, value));
  return 0.5 + clamped / 5;
}

/**
 * Compute a numeric label for the bar ("+0.8", "-1.2") given current eval value.
 */
export function evalLabel(value: number): string {
  const abs = Math.abs(value);
  if (abs < 0.05) return "0.0";
  return (value >= 0 ? "+" : "") + value.toFixed(1);
}

/**
 * Detect the opening name from the first 2-4 operator turns. Returns null until detectable.
 * Maps technique-cluster signatures to named frames.
 */
export function detectOpening(operatorTechniqueIdsPerTurn: string[][]): { name: string; eco: string } | null {
  if (operatorTechniqueIdsPerTurn.length < 2) return null;
  const flat = operatorTechniqueIdsPerTurn.flat();
  const has = (id: string) => flat.includes(id);

  if (has("calibrated-question") && has("labeling")) return { name: "Voss Open (Empathic Variation)", eco: "VO1" };
  if (has("calibrated-question") && has("spin-implication")) return { name: "SPIN Open", eco: "RA1" };
  if (has("calibrated-question") && has("mirroring")) return { name: "Voss Open (Mirror Variation)", eco: "VO2" };
  if (has("loss-framing") || has("spin-implication")) return { name: "Challenger Open", eco: "CH1" };
  if (has("liking") && has("reciprocity")) return { name: "Consultative Open (Cialdini Variation)", eco: "CI1" };
  if (has("calibrated-question")) return { name: "Consultative Open (Curiosity Variation)", eco: "CO1" };
  if (has("extreme-anchor") || has("precise-anchor")) return { name: "Anchored Open", eco: "AN1" };
  return { name: "Unnamed Opening", eco: "—" };
}

/**
 * Replay-style: given a full operator move list, compute the eval curve.
 * Used post-game by the review screen + blunder marker assignment.
 */
export function computeEvalCurve(
  persona: Persona,
  turns: { role: "operator" | "persona"; text: string; techniqueIds?: string[] }[],
): EvalState {
  let state = initialEvalState(persona);
  turns.forEach((t, i) => {
    if (t.role === "operator") {
      const { newState } = scoreOperatorMove({
        turnIndex: i,
        operatorText: t.text,
        techniqueIds: t.techniqueIds ?? [],
        persona,
        state,
      });
      state = newState;
    } else {
      const { newState } = scorePersonaMove({
        turnIndex: i,
        personaText: t.text,
        state,
      });
      state = newState;
    }
  });
  return state;
}

/**
 * From an utterance, label suggested for the move list (e.g. "Mirror", "Anchor").
 * Used in the right-rail move list and post-game review.
 */
export function moveLabelFromTechniques(techniqueIds: string[]): string {
  if (!techniqueIds || techniqueIds.length === 0) return "—";
  const names = techniqueIds.slice(0, 2).map((id) => {
    const t = getTechnique(id);
    return t?.name ?? id;
  });
  return names.join(" + ");
}

/**
 * Get top-K techniques the engine recommends in a position. Heuristic:
 * pick the persona's responsive list, weighted by Atlas verdict, exclude any
 * the operator has already over-used this game.
 */
export function recommendNextMove(
  persona: Persona,
  alreadyUsed: string[],
  topK = 3,
): { id: string; name: string; reason: string }[] {
  const candidates = persona.likelyResponsiveTechniques.map((id) => {
    const t = getTechnique(id);
    if (!t) return null;
    let score = 0;
    if (t.atlasVerdict === "well-studied") score += 2;
    if (t.atlasVerdict === "partially-studied") score += 1;
    if (t.folkloreRisk === "low") score += 1;
    if (alreadyUsed.includes(id)) score -= 1.5;
    return { id, name: t.name, score, reason: t.mechanism.split(";")[0] };
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, topK).map(({ id, name, reason }) => ({ id, name, reason }));
}

// Re-export so the eval module is the one-stop import for play-screen logic.
export { TECHNIQUES };
