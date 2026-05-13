// Assigns an ELO + Glicko state to each of the 15 personas.
// Tier derived from: persuasion-knowledge × initial valence × readability.
// Lower readability + higher persuasion-knowledge + more negative valence = harder bot.
//
// These are *seed* values. Tune after beta — the eval function + win/loss data
// from real players will retro-fit the ladder.

import { PERSONAS } from "./personas";
import type { Persona } from "./types";
import { ELO_BANDS, INITIAL_RD, INITIAL_VOLATILITY } from "./tokens";
import type { GlickoState } from "./elo";

function elotier(p: Persona): number {
  const pk = p.persuasionKnowledge;
  const v = p.valence; // -3..+3
  const r = p.readability;

  // Base from persuasion-knowledge.
  let base =
    pk === "low" ? 1250 :
    pk === "low-medium" ? 1400 :
    pk === "medium" ? 1600 :
    pk === "high" ? 1900 :
    /* very high */ 2200;

  // Adjust for hostility (negative valence makes a bot harder).
  base += -v * 60; // valence -2 → +120, valence +2 → -120

  // Adjust for readability (low readability = harder to read = harder).
  base +=
    r === "low" ? 100 :
    r === "medium" ? 0 :
    /* high */ -50;

  // Clamp to [1200, 2400] band.
  return Math.max(1200, Math.min(2400, Math.round(base / 25) * 25));
}

export interface BotMeta {
  personaId: string;
  rating: number;
  glicko: GlickoState;
  title: string;
  oneLineTagline: string;
}

const TAGLINES: Record<string, string> = {
  "t1-economic-buyer-cfo":             "Career-protective CFO. Reads technique density instantly.",
  "t1-champion-vp-eng":                "Champion-track VP Eng. Wants the win to make him look good.",
  "t1-technical-evaluator":            "Procurement-armored security architect. Patient, sceptical, will out-wait you.",
  "t2-founder-non-customer":           "Founder of a peer co. Not buying. Polite. Will end the call without telling you.",
  "t2-design-partner":                 "Warm design partner. Generous with feedback. Will say yes long before signing.",
  "t3-transactional-direct-buyer":     "Knows what she wants. Skip the dance. Anchors aggressively.",
  "t3-transactional-comparison":       "Comparison-shopper. You're one of three quotes. Win on signal density.",
  "t4-procurement-counterparty":       "Procurement specialist. Will read every technique. Reactance fires fast.",
  "t4-litigator-counterparty":         "Litigator across the table. Every word is a record. Pure adversary.",
  "t5-research-academic":              "Open, curious, runs his own research. Slow to commit; honest when he does.",
  "t5-research-operator":              "Operator-researcher. Knows the playbook. Sees through scripts but loves real signal.",
  // Add fallbacks for any persona IDs we haven't pre-tagged. Real persona list has 15 IDs from closer-curriculum.
};

export const BOTS: BotMeta[] = PERSONAS.map((p) => {
  const rating = elotier(p);
  const band = Object.values(ELO_BANDS).find((b) => rating >= b.min && rating <= b.max)!;
  return {
    personaId: p.id,
    rating,
    glicko: {
      rating,
      rd: INITIAL_RD * 0.4,        // bots are calibrated — lower RD
      volatility: INITIAL_VOLATILITY,
    },
    title: band.label,
    oneLineTagline: TAGLINES[p.id] ?? `${p.persuasionKnowledge} persuasion-knowledge · valence ${p.valence >= 0 ? "+" : ""}${p.valence} · ${p.readability} readability`,
  };
}).sort((a, b) => a.rating - b.rating);

export function getBot(personaId: string): BotMeta | undefined {
  return BOTS.find((b) => b.personaId === personaId);
}

/**
 * Unlock policy: the user can play any bot within `unlockWindow` ELO of their
 * current rating + 200 (gives an aspirational target without total walls).
 * Above that, the bot card shows locked.
 */
export function isBotUnlocked(bot: BotMeta, playerRating: number): boolean {
  return bot.rating <= playerRating + 200;
}
