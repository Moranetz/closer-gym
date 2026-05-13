"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSession, getRatings, updateRating } from "@/lib/storage";
import { applyMatch, type GlickoState } from "@/lib/elo";
import { titleForRating } from "@/lib/tokens";
import { INITIAL_RD, INITIAL_VOLATILITY } from "@/lib/tokens";
import {
  initialEvalState,
  scoreOperatorMove,
  scorePersonaMove,
  moveLabelFromTechniques,
  detectOpening,
  recommendNextMove,
} from "@/lib/eval";
import { classifyMove } from "@/lib/tokens";
import type { Persona, Session } from "@/lib/types";

interface Props {
  sessionId: string;
  personaId: string;
  personaRole: string;
  personaTrack: string;
  personaTrackLabel: string;
  personaSpec: Persona;
  botRating: number;
  personaCriteriaHidden: string;
  personaHiddenCurveBall: string;
  contraindicated: string[];
  responsive: string[];
  techniqueIndex: Record<string, string>;
}

export default function ReviewClient({
  sessionId,
  personaId,
  personaRole,
  personaTrack,
  personaTrackLabel,
  personaSpec,
  botRating,
  personaCriteriaHidden,
  personaHiddenCurveBall,
  contraindicated,
  responsive,
  techniqueIndex,
}: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [ratingDelta, setRatingDelta] = useState<number | null>(null);
  const [newRating, setNewRating] = useState<number | null>(null);

  useEffect(() => {
    const s = getSession(sessionId);
    setSession(s ?? null);

    // Apply Glicko-2 rating change once on mount.
    if (s?.scorecard && ratingDelta === null) {
      const ratings = getRatings();
      const myState = ratings.game;
      // Score: composite > 6.0 = win (1), 4-6 = draw (0.5), < 4 = loss (0).
      const composite = s.scorecard.composite;
      const score: 0 | 0.5 | 1 = composite >= 6 ? 1 : composite >= 4 ? 0.5 : 0;
      const oppState: GlickoState = { rating: botRating, rd: INITIAL_RD * 0.4, volatility: INITIAL_VOLATILITY };
      const { state, delta } = applyMatch(myState, oppState, score);
      updateRating("game", state);
      setRatingDelta(delta);
      setNewRating(state.rating);
    }
  }, [sessionId, botRating, ratingDelta]);

  // ─── Compute eval curve from turns ────────────────────────────────────────
  const evalCurve = useMemo(() => {
    if (!session) return [];
    let state = initialEvalState(personaSpec);
    const curve: { turnIndex: number; value: number; delta: number; role: string; reason: string; techniques: string[]; label: string }[] = [];
    session.turns.forEach((t, i) => {
      if (t.role === "operator") {
        const { newState, delta, reason } = scoreOperatorMove({
          turnIndex: i,
          operatorText: t.text,
          techniqueIds: t.techniquesDeployed ?? [],
          persona: personaSpec,
          state,
        });
        state = newState;
        curve.push({
          turnIndex: i,
          value: state.value,
          delta,
          role: "operator",
          reason,
          techniques: t.techniquesDeployed ?? [],
          label: moveLabelFromTechniques(t.techniquesDeployed ?? []),
        });
      } else {
        const { newState, delta } = scorePersonaMove({
          turnIndex: i,
          personaText: t.text,
          state,
        });
        state = newState;
        curve.push({
          turnIndex: i,
          value: state.value,
          delta,
          role: "persona",
          reason: "buyer response",
          techniques: [],
          label: "(buyer)",
        });
      }
    });
    return curve;
  }, [session, personaSpec]);

  const operatorPoints = evalCurve.filter((p) => p.role === "operator");
  const opening = useMemo(
    () => detectOpening(operatorPoints.map((p) => p.techniques)),
    [operatorPoints],
  );

  // Top 3 blunders by worst delta on operator turns.
  const blunders = useMemo(() => {
    return [...operatorPoints]
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 3)
      .filter((p) => p.delta < -0.5);
  }, [operatorPoints]);

  if (!session) {
    return (
      <div style={{ padding: "64px 24px", color: "var(--text-muted)", textAlign: "center" }}>
        Loading game review…
      </div>
    );
  }
  if (!session.scorecard) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>No analysis on this game.</h1>
        <Link href={`/play/${personaId}/session/${sessionId}`} className="btn btn-secondary">
          ← Back to game
        </Link>
      </div>
    );
  }

  const sc = session.scorecard;
  const techName = (id: string) => techniqueIndex[id] ?? id;
  const finalEval = operatorPoints.length ? operatorPoints[operatorPoints.length - 1].value : 0;
  const outcomeLabel =
    sc.composite >= 6 ? "Win" :
    sc.composite >= 4 ? "Draw" :
    "Loss";
  const outcomeColor =
    outcomeLabel === "Win" ? "var(--brand-green-600)" :
    outcomeLabel === "Loss" ? "var(--danger)" :
    "var(--warning)";

  const opponentInitials = personaRole.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const opponentTitle = titleForRating(botRating);

  // Engine recommendations on the worst blunder.
  const worstBlunder = blunders[0];
  const alternatives = worstBlunder
    ? recommendNextMove(personaSpec, worstBlunder.techniques, 3)
    : [];

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 24px 64px" }}>
      <Link href="/play" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Bot ladder
      </Link>

      {/* ─── Outcome banner ──────────────────────────────────────────────── */}
      <div className="panel" style={{ padding: 24, marginBottom: 24 }}>
        <div className="flex items-start gap-4 mb-4">
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
              Game review · Track {personaTrack.slice(1)} {personaTrackLabel}
            </p>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>{outcomeLabel}</h1>
              <span style={{ fontSize: 18, color: outcomeColor, fontWeight: 700 }} className="tabular">
                {ratingDelta !== null && (
                  <>{ratingDelta >= 0 ? "+" : ""}{ratingDelta.toFixed(0)} ELO</>
                )}
              </span>
              {newRating !== null && (
                <span style={{ fontSize: 14, color: "var(--text-muted)" }} className="tabular">
                  · new rating {newRating.toFixed(0)}
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
              vs <span className={`title-badge ${opponentTitle.tier}`}>{opponentTitle.label.replace(" Closer", "")}</span> <span className="tabular">{botRating}</span> · {personaRole}
            </p>
          </div>
          <div className="player-avatar" style={{ width: 56, height: 56, fontSize: 18 }}>{opponentInitials}</div>
        </div>

        {opening && (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Opening played: <strong style={{ color: "var(--text-primary)" }}>{opening.name}</strong> <span className="tabular">({opening.eco})</span>
          </p>
        )}
      </div>

      {/* ─── Top metric row ────────────────────────────────────────────── */}
      <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <Metric label="Composite" value={sc.composite.toFixed(1)} max="10" accent="brand" />
        <Metric label="Delivery" value={sc.deliveryCleanness.toFixed(1)} max="10" />
        <Metric label="Recognition" value={sc.recognitionCorrectness.toFixed(1)} max="10" />
        <Metric label="Persona-match" value={sc.personaResponseMatch.toFixed(1)} max="10" />
      </div>

      {/* ─── Eval curve chart ─────────────────────────────────────────── */}
      <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
          Eval curve · final {finalEval >= 0 ? "+" : ""}{finalEval.toFixed(2)}
        </p>
        <EvalCurve points={evalCurve.map((p) => ({ x: p.turnIndex, y: p.value, role: p.role }))} />
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>
          Each tick = one turn. Green = your moves, neutral = buyer responses. Above 0 = you&apos;re winning the game; below 0 = the buyer is.
        </p>
      </div>

      {/* ─── Move list with blunders ──────────────────────────────────── */}
      <div className="panel" style={{ padding: 0, marginBottom: 24 }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
            Your moves · annotated
          </p>
        </div>
        <div>
          {operatorPoints.length === 0 && (
            <p style={{ padding: 16, color: "var(--text-faint)", fontSize: 13, fontStyle: "italic" }}>
              No operator moves to analyze.
            </p>
          )}
          {operatorPoints.map((p, idx) => {
            const q = classifyMove(p.delta);
            return (
              <div
                key={p.turnIndex}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr 120px 90px",
                  alignItems: "start",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  gap: 12,
                }}
              >
                <div style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 700 }} className="tabular">{idx + 1}.</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {p.reason}
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                  {q.glyph ? (
                    <>
                      <span className={`move-glyph ${q.className}`} style={{ fontSize: 16 }}>{q.glyph}</span>
                      <div style={{ color: "var(--text-muted)", marginTop: 2 }}>{q.label}</div>
                    </>
                  ) : (
                    <span style={{ color: "var(--text-faint)" }}>Book</span>
                  )}
                </div>
                <div className="tabular" style={{ textAlign: "right", fontWeight: 700, fontSize: 14, color: p.delta > 0.15 ? "var(--brand-green-600)" : p.delta < -0.15 ? "var(--danger)" : "var(--text-muted)" }}>
                  {p.delta > 0 ? "+" : ""}{p.delta.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Engine alternatives on worst blunder ─────────────────────── */}
      {worstBlunder && alternatives.length > 0 && (
        <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--danger)", fontWeight: 700, marginBottom: 8 }}>
            Engine recommends · move #{operatorPoints.findIndex((p) => p.turnIndex === worstBlunder.turnIndex) + 1}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
            Your move ({worstBlunder.label}) lost <strong style={{ color: "var(--danger)" }}>{worstBlunder.delta.toFixed(2)}</strong>. Engine considered these alternatives:
          </p>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {alternatives.map((alt) => (
              <div key={alt.id} className="tile" style={{ padding: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-green-600)", marginBottom: 4 }}>
                  {alt.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {alt.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Scorecard rails ──────────────────────────────────────────── */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <ScorePanel title="Observed deployed" items={sc.techniquesObservedDeployed.map(techName)} empty="No Atlas techniques tagged." />
        <ScorePanel title="Intended, not deployed" items={sc.techniquesIntendedNotDeployed.map(techName)} empty="Every intended technique fired." muted />
        <ScorePanel title="Unintentional drift" items={sc.techniquesUnintentionalDeployed.map(techName)} empty="No drift — what fired was intended." accent="warning" />
        <ScorePanel title="Contraindicated · red flag" items={sc.contraindicatedDeployed.map(techName)} empty="No contraindicated technique fired." accent="danger" />
      </div>

      {sc.failureModesFlagged.length > 0 && (
        <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
            Failure modes flagged
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
            {sc.failureModesFlagged.map((m, i) => <li key={i}>· {m}</li>)}
          </ul>
        </div>
      )}

      <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 8 }}>
          Reviewer notes
        </p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {sc.notes}
        </p>
      </div>

      {/* ─── The buyer's hidden cards ─────────────────────────────────── */}
      <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 16 }}>
          The buyer&apos;s hidden cards · revealed
        </p>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
            What actually decided their buy
          </p>
          <p style={{ fontSize: 14, color: "var(--text-primary)", fontStyle: "italic" }}>
            {personaCriteriaHidden}
          </p>
          <p style={{ fontSize: 12, marginTop: 6, color: sc.personaHiddenCriteriaSurfaced ? "var(--brand-green-600)" : "var(--text-faint)" }}>
            {sc.personaHiddenCriteriaSurfaced ? "✓ You surfaced this in the game." : "✗ Not surfaced. Earn it via elicitation next time."}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Curve ball</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{personaHiddenCurveBall}</p>
        </div>
      </div>

      {/* ─── Reference rail ────────────────────────────────────────────── */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="panel-rail" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--danger)", fontWeight: 700, marginBottom: 8 }}>
            Contraindicated against this opponent
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {contraindicated.map((id) => <li key={id}>· {techName(id)}</li>)}
          </ul>
        </div>
        <div className="panel-rail" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 8 }}>
            Responsive — when delivered well
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {responsive.map((id) => <li key={id}>· {techName(id)}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link href={`/play/${personaId}`} className="btn btn-primary">
          ↻ Rematch
        </Link>
        <Link href="/play" className="btn btn-secondary">
          Bot ladder
        </Link>
        <Link href="/puzzles" className="btn btn-secondary">
          Train weak spots →
        </Link>
      </div>
    </div>
  );
}

// ─── EvalCurve · small SVG line chart ─────────────────────────────────────
function EvalCurve({ points }: { points: { x: number; y: number; role: string }[] }) {
  if (points.length === 0) return <div style={{ height: 80, color: "var(--text-faint)", fontSize: 12, fontStyle: "italic" }}>No moves to chart.</div>;
  const W = 100;  // viewBox width — scales fluidly
  const H = 40;
  const yMin = -2.5;
  const yMax = 2.5;
  const xMax = Math.max(1, points.length - 1);
  const path = points
    .map((p, i) => {
      const x = (i / xMax) * W;
      const y = H - ((p.y - yMin) / (yMax - yMin)) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  // Baseline at y = 0.
  const baselineY = H - ((0 - yMin) / (yMax - yMin)) * H;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 100, display: "block" }}>
      {/* Fill above 0 (operator winning) */}
      <defs>
        <linearGradient id="evalUp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81B64C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#81B64C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="evalDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A4262C" stopOpacity="0" />
          <stop offset="100%" stopColor="#A4262C" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* Baseline */}
      <line x1="0" y1={baselineY} x2={W} y2={baselineY} stroke="#3D3A37" strokeWidth="0.3" strokeDasharray="0.5,0.5" />
      {/* Area above 0 */}
      <path d={`${path} L${W},${baselineY} L0,${baselineY} Z`} fill="url(#evalUp)" />
      {/* Curve */}
      <path d={path} fill="none" stroke="#81B64C" strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round" />
      {/* Move dots */}
      {points.map((p, i) => {
        if (p.role !== "operator") return null;
        const x = (i / xMax) * W;
        const y = H - ((p.y - yMin) / (yMax - yMin)) * H;
        return <circle key={i} cx={x} cy={y} r="0.6" fill="#81B64C" />;
      })}
    </svg>
  );
}

function Metric({ label, value, max, accent }: { label: string; value: string; max: string; accent?: "brand" }) {
  return (
    <div className="tile">
      <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
        {label}
      </p>
      <p className="tabular" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em", color: accent === "brand" ? "var(--brand-green-600)" : "var(--text-primary)" }}>
        {value}
        <span style={{ fontSize: 13, color: "var(--text-faint)", fontWeight: 500, marginLeft: 4 }}>/ {max}</span>
      </p>
    </div>
  );
}

function ScorePanel({
  title,
  items,
  empty,
  accent,
  muted,
}: {
  title: string;
  items: string[];
  empty: string;
  accent?: "danger" | "warning";
  muted?: boolean;
}) {
  const color = accent === "danger" ? "var(--danger)" : accent === "warning" ? "var(--warning)" : muted ? "var(--text-muted)" : "var(--brand-green-600)";
  return (
    <div className="panel-rail" style={{ padding: 16 }}>
      <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color, fontWeight: 700, marginBottom: 8 }}>
        {title}
      </p>
      {items.length === 0 ? (
        <p style={{ fontSize: 12, color: "var(--text-faint)", fontStyle: "italic" }}>{empty}</p>
      ) : (
        <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          {items.map((it, i) => <li key={i}>· {it}</li>)}
        </ul>
      )}
    </div>
  );
}
