"use client";

import type { GlickoState } from "./elo";
import { initialGlicko, applyMatch } from "./elo";
import { INITIAL_RD, INITIAL_VOLATILITY } from "./tokens";

const KEY = "closer-gym:puzzles:v0.1";

interface PuzzleSolve {
  puzzleId: string;
  pickedIndex: number;   // candidate the user picked
  correct: boolean;       // matched bestIndex
  evalGained: number;     // the eval of the picked candidate
  solvedAt: number;       // timestamp
  timeRemainingSec: number; // 0-30
}

interface PuzzleState {
  rating: GlickoState;
  solves: PuzzleSolve[];      // append-only history
  solvedDailyDates: string[]; // YYYY-MM-DD per completed daily
  currentStreak: number;
  longestStreak: number;
  lastDailyDate?: string;     // for streak rollover
}

const initial = (): PuzzleState => ({
  rating: initialGlicko(),
  solves: [],
  solvedDailyDates: [],
  currentStreak: 0,
  longestStreak: 0,
});

export function getPuzzleState(): PuzzleState {
  if (typeof window === "undefined") return initial();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial();
    return { ...initial(), ...(JSON.parse(raw) as PuzzleState) };
  } catch {
    return initial();
  }
}

export function savePuzzleState(state: PuzzleState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function recordSolve(opts: {
  puzzleId: string;
  pickedIndex: number;
  bestIndex: number;
  pickedEval: number;
  puzzleDifficulty: number;
  timeRemainingSec: number;
  isDaily?: boolean;
  todayKey?: string;
}): {
  newRating: GlickoState;
  ratingDelta: number;
  newStreak: number;
} {
  const state = getPuzzleState();
  const correct = opts.pickedIndex === opts.bestIndex;
  const score: 0 | 0.5 | 1 = correct ? 1 : opts.pickedEval > 0 ? 0.5 : 0;
  const opponent: GlickoState = {
    rating: opts.puzzleDifficulty,
    rd: INITIAL_RD * 0.4,
    volatility: INITIAL_VOLATILITY,
  };
  const { state: newRating, delta } = applyMatch(state.rating, opponent, score);

  let currentStreak = state.currentStreak;
  let longestStreak = state.longestStreak;
  let solvedDailyDates = state.solvedDailyDates;
  let lastDailyDate = state.lastDailyDate;

  if (opts.isDaily && opts.todayKey) {
    if (correct) {
      // Streak continues if yesterday's daily was also solved.
      const yesterday = yesterdayKey(opts.todayKey);
      if (lastDailyDate === yesterday || lastDailyDate === opts.todayKey) {
        currentStreak = lastDailyDate === opts.todayKey ? currentStreak : currentStreak + 1;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      if (!solvedDailyDates.includes(opts.todayKey)) {
        solvedDailyDates = [...solvedDailyDates, opts.todayKey];
      }
      lastDailyDate = opts.todayKey;
    } else {
      currentStreak = 0;
    }
  }

  const next: PuzzleState = {
    ...state,
    rating: newRating,
    solves: [
      ...state.solves,
      {
        puzzleId: opts.puzzleId,
        pickedIndex: opts.pickedIndex,
        correct,
        evalGained: opts.pickedEval,
        solvedAt: Date.now(),
        timeRemainingSec: opts.timeRemainingSec,
      },
    ],
    solvedDailyDates,
    currentStreak,
    longestStreak,
    lastDailyDate,
  };
  savePuzzleState(next);
  return { newRating, ratingDelta: delta, newStreak: currentStreak };
}

function yesterdayKey(todayKey: string): string {
  const d = new Date(todayKey + "T00:00:00");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function isSolved(puzzleId: string): boolean {
  if (typeof window === "undefined") return false;
  return getPuzzleState().solves.some((s) => s.puzzleId === puzzleId && s.correct);
}

export function todayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
