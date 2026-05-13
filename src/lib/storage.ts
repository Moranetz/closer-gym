"use client";

import type { Session } from "./types";
import type { GlickoState } from "./elo";
import { initialGlicko } from "./elo";

const SESSIONS_KEY = "closer-gym:sessions:v0.1";
const RATING_KEY = "closer-gym:rating:v0.1";

interface AllRatings {
  game: GlickoState;
  puzzle: GlickoState;
  analysis: GlickoState;
}

const initialRatings = (): AllRatings => ({
  game: initialGlicko(),
  puzzle: initialGlicko(),
  analysis: initialGlicko(),
});

function readAll(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

function writeAll(sessions: Session[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function listSessions(): Session[] {
  return readAll().sort((a, b) => b.startedAt - a.startedAt);
}

export function getSession(id: string): Session | undefined {
  return readAll().find((s) => s.id === id);
}

export function saveSession(session: Session) {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === session.id);
  if (idx === -1) all.push(session);
  else all[idx] = session;
  writeAll(all);
}

export function deleteSession(id: string) {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function newSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Ratings ─────────────────────────────────────────────────────────────────

export function getRatings(): AllRatings {
  if (typeof window === "undefined") return initialRatings();
  try {
    const raw = window.localStorage.getItem(RATING_KEY);
    if (!raw) return initialRatings();
    const parsed = JSON.parse(raw) as Partial<AllRatings>;
    return {
      game: parsed.game ?? initialGlicko(),
      puzzle: parsed.puzzle ?? initialGlicko(),
      analysis: parsed.analysis ?? initialGlicko(),
    };
  } catch {
    return initialRatings();
  }
}

export function saveRatings(r: AllRatings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RATING_KEY, JSON.stringify(r));
}

export function updateRating(bucket: keyof AllRatings, state: GlickoState) {
  const all = getRatings();
  all[bucket] = state;
  saveRatings(all);
}
