// Glicko-2 rating math. Reference: glicko.net/glicko/glicko2.pdf (Mark Glickman, 2013).
// Used for Game / Puzzle / Analysis rating buckets, each independently tracked.

import { INITIAL_RATING, INITIAL_RD, INITIAL_VOLATILITY } from "./tokens";

export interface GlickoState {
  rating: number;       // skill, in "Glicko" scale where 1500 is mean
  rd: number;           // rating deviation — uncertainty
  volatility: number;   // how erratic the player is
}

export const initialGlicko = (): GlickoState => ({
  rating: INITIAL_RATING,
  rd: INITIAL_RD,
  volatility: INITIAL_VOLATILITY,
});

const TAU = 0.5;   // system constant — chess.com uses ~0.5; lower = less volatile

interface MatchResult {
  opponentRating: number;
  opponentRd: number;
  score: number; // 1 = win, 0.5 = draw, 0 = loss
}

// Convert to Glicko-2 internal scale (mean 0, σ ~1).
function toG2(rating: number, rd: number) {
  return { mu: (rating - 1500) / 173.7178, phi: rd / 173.7178 };
}

function fromG2(mu: number, phi: number) {
  return { rating: mu * 173.7178 + 1500, rd: phi * 173.7178 };
}

function g(phi: number) {
  return 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
}

function E(mu: number, muJ: number, phiJ: number) {
  return 1 / (1 + Math.exp(-g(phiJ) * (mu - muJ)));
}

// Iterative solver for new volatility per Glickman 2013 §3.1.
function newVolatility(sigma: number, phi: number, v: number, delta: number): number {
  const a = Math.log(sigma * sigma);
  const epsilon = 1e-6;
  const f = (x: number) => {
    const ex = Math.exp(x);
    const num = ex * (delta * delta - phi * phi - v - ex);
    const den = 2 * Math.pow(phi * phi + v + ex, 2);
    return num / den - (x - a) / (TAU * TAU);
  };

  let A = a;
  let B: number;
  if (delta * delta > phi * phi + v) {
    B = Math.log(delta * delta - phi * phi - v);
  } else {
    let k = 1;
    while (f(a - k * TAU) < 0) k++;
    B = a - k * TAU;
  }
  let fA = f(A);
  let fB = f(B);
  let iter = 0;
  while (Math.abs(B - A) > epsilon && iter < 100) {
    const C = A + ((A - B) * fA) / (fB - fA);
    const fC = f(C);
    if (fC * fB <= 0) {
      A = B;
      fA = fB;
    } else {
      fA = fA / 2;
    }
    B = C;
    fB = fC;
    iter++;
  }
  return Math.exp(A / 2);
}

/**
 * Update a player's Glicko state given one or more match results in the same rating period.
 * In closer-gym we update after every single game for live feedback (rating period = 1 match).
 */
export function updateGlicko(state: GlickoState, results: MatchResult[]): GlickoState {
  if (results.length === 0) {
    // No games — only inflate RD by volatility.
    const { phi } = toG2(state.rating, state.rd);
    const newPhi = Math.sqrt(phi * phi + state.volatility * state.volatility);
    const { rd } = fromG2(0, newPhi);
    return { ...state, rd };
  }

  const { mu, phi } = toG2(state.rating, state.rd);
  const opp = results.map((r) => {
    const t = toG2(r.opponentRating, r.opponentRd);
    return { muJ: t.mu, phiJ: t.phi, score: r.score };
  });

  // Variance.
  let vInverse = 0;
  for (const o of opp) {
    const gPhi = g(o.phiJ);
    const eMu = E(mu, o.muJ, o.phiJ);
    vInverse += gPhi * gPhi * eMu * (1 - eMu);
  }
  const v = 1 / vInverse;

  // Delta.
  let deltaSum = 0;
  for (const o of opp) {
    const gPhi = g(o.phiJ);
    const eMu = E(mu, o.muJ, o.phiJ);
    deltaSum += gPhi * (o.score - eMu);
  }
  const delta = v * deltaSum;

  // New volatility.
  const newSigma = newVolatility(state.volatility, phi, v, delta);

  // New phi*.
  const phiStar = Math.sqrt(phi * phi + newSigma * newSigma);
  const newPhi = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);

  // New mu.
  const newMu = mu + newPhi * newPhi * deltaSum;

  const { rating, rd } = fromG2(newMu, newPhi);
  return { rating, rd, volatility: newSigma };
}

/**
 * Expected score (win probability) for a vs b. Used for ELO change previews
 * and for the bot-card "your win rate vs this bot" stat.
 */
export function expectedScore(a: GlickoState, b: GlickoState): number {
  const { mu: muA, phi: phiA } = toG2(a.rating, a.rd);
  const { mu: muB, phi: phiB } = toG2(b.rating, b.rd);
  const phiCombined = Math.sqrt(phiA * phiA + phiB * phiB);
  return 1 / (1 + Math.exp(-g(phiCombined) * (muA - muB)));
}

/**
 * Convenience: compute rating change for a single match, returned as (newState, delta).
 */
export function applyMatch(
  state: GlickoState,
  opponent: GlickoState,
  score: 0 | 0.5 | 1,
): { state: GlickoState; delta: number } {
  const next = updateGlicko(state, [
    { opponentRating: opponent.rating, opponentRd: opponent.rd, score },
  ]);
  return { state: next, delta: next.rating - state.rating };
}
