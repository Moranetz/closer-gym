"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Puzzle } from "@/lib/puzzles";
import { THEME_LABELS, THEME_COLORS, difficultyTier } from "@/lib/puzzles";
import { recordSolve, todayKey } from "@/lib/puzzle-storage";
import { PUZZLES } from "@/lib/puzzle-library";
import { classifyMove, titleForRating } from "@/lib/tokens";
import { getTechnique } from "@/lib/techniques";

interface Props {
  puzzle: Puzzle;
  isDaily: boolean;
}

const TIMER_SEC = 30;

export default function PuzzleSolver({ puzzle, isDaily }: Props) {
  // Shuffle the 4 candidates at mount so position doesn't leak.
  const shuffledCandidates = useMemo(() => {
    const idxs = puzzle.candidates.map((_, i) => i);
    // Seeded shuffle per puzzle.id for stable display while still hiding bestIndex.
    let seed = 0;
    for (let i = 0; i < puzzle.id.length; i++) seed = (seed * 31 + puzzle.id.charCodeAt(i)) & 0xffffffff;
    const rand = mulberry32(Math.abs(seed));
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return idxs;
  }, [puzzle.id]);

  const [pickedDisplayIdx, setPickedDisplayIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SEC);
  const [ratingChange, setRatingChange] = useState<{ delta: number; newRating: number; newStreak: number } | null>(null);
  const startedAt = useRef(Date.now());

  // Timer
  useEffect(() => {
    if (revealed) return;
    const tick = setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const remaining = Math.max(0, Math.ceil(TIMER_SEC - elapsed));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(tick);
        if (!revealed && pickedDisplayIdx === null) {
          // Auto-reveal as a missed solve at the worst-eval candidate.
          handlePick(shuffledCandidates.findIndex((origIdx) => origIdx === puzzle.bestIndex), /*timedOut*/ true);
        }
      }
    }, 250);
    return () => clearInterval(tick);
  }, [revealed, pickedDisplayIdx, shuffledCandidates, puzzle.bestIndex]);

  function handlePick(displayIdx: number, timedOut = false) {
    if (revealed) return;
    setPickedDisplayIdx(displayIdx);
    const originalIdx = timedOut ? -1 : shuffledCandidates[displayIdx];
    const picked = originalIdx === -1 ? puzzle.candidates[puzzle.bestIndex] : puzzle.candidates[originalIdx];
    const timeRemaining = Math.max(0, Math.ceil((startedAt.current + TIMER_SEC * 1000 - Date.now()) / 1000));
    const result = recordSolve({
      puzzleId: puzzle.id,
      pickedIndex: timedOut ? -1 : originalIdx,
      bestIndex: puzzle.bestIndex,
      pickedEval: picked.eval,
      puzzleDifficulty: puzzle.difficulty,
      timeRemainingSec: timeRemaining,
      isDaily,
      todayKey: isDaily ? todayKey() : undefined,
    });
    setRatingChange({
      delta: result.ratingDelta,
      newRating: result.newRating.rating,
      newStreak: result.newStreak,
    });
    setRevealed(true);
  }

  const tier = difficultyTier(puzzle.difficulty);
  const themeColor = THEME_COLORS[puzzle.theme];
  const theme = THEME_LABELS[puzzle.theme];
  const correct = pickedDisplayIdx !== null && shuffledCandidates[pickedDisplayIdx] === puzzle.bestIndex;
  const timedOut = pickedDisplayIdx !== null && shuffledCandidates[pickedDisplayIdx] === -1;
  const nextPuzzleId = useMemo(() => {
    const i = PUZZLES.findIndex((p) => p.id === puzzle.id);
    const next = PUZZLES[(i + 1) % PUZZLES.length];
    return next.id;
  }, [puzzle.id]);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 64px" }}>
      <Link href="/puzzles" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Puzzles
      </Link>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isDaily && (
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700 }}>
                Daily Drill · {todayKey()}
              </span>
            )}
            <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: themeColor, fontWeight: 700 }}>
              {theme}
            </span>
            <span style={{ fontSize: 11, letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600 }}>
              · {tier} · ELO {puzzle.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!revealed && (
            <div className="tabular" style={{
              padding: "6px 12px",
              borderRadius: 3,
              background: secondsLeft <= 10 ? "var(--danger)" : "var(--bg-rail)",
              border: "1px solid var(--border-strong)",
              fontSize: 18,
              fontWeight: 800,
              color: secondsLeft <= 10 ? "var(--text-primary)" : "var(--text-primary)",
              minWidth: 64,
              textAlign: "center",
            }}>
              {String(secondsLeft).padStart(2, "0")}s
            </div>
          )}
        </div>
      </div>

      {/* ─── Position card (the "board") ─────────────────────────── */}
      <div className="tile-hero" style={{ padding: 28, marginBottom: 20 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
          Position · {puzzle.buyerRole}
        </p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
          {puzzle.setup}
        </p>
        <div style={{ borderLeft: `3px solid ${themeColor}`, paddingLeft: 16 }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            Buyer says
          </p>
          <p style={{ fontSize: 18, color: "var(--text-primary)", lineHeight: 1.45, fontWeight: 600, fontStyle: "italic" }}>
            &ldquo;{puzzle.buyerLine}&rdquo;
          </p>
        </div>
      </div>

      {/* ─── Candidate moves ────────────────────────────────────── */}
      <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 10 }}>
        Choose your move {revealed ? "· results" : `(${TIMER_SEC}s)`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shuffledCandidates.map((origIdx, displayIdx) => {
          const c = puzzle.candidates[origIdx];
          const isBest = origIdx === puzzle.bestIndex;
          const isPicked = pickedDisplayIdx === displayIdx;
          const q = classifyMove(c.eval);

          let borderColor = "var(--border-strong)";
          let bg = "var(--bg-panel)";
          if (revealed) {
            if (isBest) { borderColor = "var(--brand-green-600)"; bg = "rgba(129,182,76,0.10)"; }
            else if (isPicked && !isBest) { borderColor = "var(--danger)"; bg = "rgba(164,38,44,0.08)"; }
          } else if (isPicked) {
            borderColor = "var(--info)";
          }

          return (
            <button
              key={origIdx}
              onClick={() => !revealed && handlePick(displayIdx)}
              disabled={revealed}
              style={{
                textAlign: "left",
                padding: 16,
                borderRadius: 4,
                background: bg,
                border: `1px solid ${borderColor}`,
                cursor: revealed ? "default" : "pointer",
                color: "var(--text-primary)",
                fontFamily: "inherit",
                fontSize: 14,
                lineHeight: 1.55,
                transition: "border-color 120ms, background 120ms",
              }}
              onMouseEnter={(e) => {
                if (!revealed) e.currentTarget.style.borderColor = "var(--brand-green-600)";
              }}
              onMouseLeave={(e) => {
                if (!revealed && !isPicked) e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
            >
              <div className="flex items-start gap-3">
                <div style={{
                  width: 28, height: 28, borderRadius: 4, flexShrink: 0,
                  background: revealed && isBest ? "var(--brand-green-600)" : "var(--bg-rail)",
                  color: revealed && isBest ? "var(--bg-page)" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13,
                }}>
                  {["A", "B", "C", "D"][displayIdx]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: revealed ? 8 : 0 }}>{c.text}</div>
                  {revealed && (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="tabular"
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 2,
                            background: c.eval > 0.15 ? "rgba(129,182,76,0.18)" : c.eval < -0.15 ? "rgba(164,38,44,0.18)" : "var(--bg-rail)",
                            color: c.eval > 0.15 ? "var(--brand-green-600)" : c.eval < -0.15 ? "var(--danger)" : "var(--text-muted)",
                          }}
                        >
                          {c.eval > 0 ? "+" : ""}{c.eval.toFixed(2)}
                        </span>
                        {q.glyph && (
                          <span className={`move-glyph ${q.className}`}>{q.glyph} <span style={{ fontWeight: 600, color: "var(--text-muted)", marginLeft: 4 }}>{q.label}</span></span>
                        )}
                        {isBest && (
                          <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--brand-green-600)" }}>
                            ★ best move
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>
                        {c.rationale}
                      </p>
                      {c.atlasTags.length > 0 && (
                        <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {c.atlasTags.map((tagId) => {
                            const t = getTechnique(tagId);
                            return (
                              <span key={tagId} className="bubble-techtag">
                                {t?.name ?? tagId}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Reveal panel ──────────────────────────────────────────── */}
      {revealed && ratingChange && (
        <div className="panel" style={{ padding: 20, marginTop: 24, borderColor: correct ? "rgba(129,182,76,0.35)" : "rgba(164,38,44,0.35)" }}>
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em", color: correct ? "var(--brand-green-600)" : timedOut ? "var(--warning)" : "var(--danger)" }}>
              {correct ? "✓ Solved" : timedOut ? "⏱ Time" : "✗ Missed"}
            </div>
            <div className="tabular" style={{ fontSize: 16, fontWeight: 700, color: ratingChange.delta >= 0 ? "var(--brand-green-600)" : "var(--danger)" }}>
              {ratingChange.delta >= 0 ? "+" : ""}{ratingChange.delta.toFixed(0)} ELO
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }} className="tabular">
              New puzzle rating: <strong style={{ color: "var(--text-primary)" }}>{ratingChange.newRating.toFixed(0)}</strong>{" "}
              <span className={`title-badge ${titleForRating(ratingChange.newRating).tier}`} style={{ marginLeft: 6 }}>{titleForRating(ratingChange.newRating).label.replace(" Closer", "")}</span>
            </div>
            {isDaily && (
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: "auto" }} className="tabular">
                🔥 {ratingChange.newStreak}-day streak
              </div>
            )}
          </div>
          {puzzle.themeHint && (
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.55, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <strong style={{ color: "var(--brand-green-600)", fontStyle: "normal", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 11 }}>Theme · </strong>
              {puzzle.themeHint}
            </p>
          )}
          <div className="flex gap-2 mt-4 flex-wrap">
            <Link href={`/puzzles/${nextPuzzleId}`} className="btn btn-primary">
              Next puzzle →
            </Link>
            <Link href="/puzzles" className="btn btn-secondary">
              All puzzles
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Mulberry32 — small deterministic PRNG for stable per-puzzle shuffles.
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
