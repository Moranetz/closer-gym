"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { MasterGame } from "@/lib/master-games";
import { computeMasterCurve, MASTER_GAMES } from "@/lib/master-games";
import { classifyMove } from "@/lib/tokens";
import { getTechnique } from "@/lib/techniques";

interface Props {
  game: MasterGame;
}

export default function MasterGameViewer({ game }: Props) {
  const [selectedTurn, setSelectedTurn] = useState<number | null>(null);
  const bubbleRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const curve = useMemo(() => computeMasterCurve(game), [game]);
  const finalEval = curve.length ? curve[curve.length - 1].value : 0;

  // Operator-only move list with running deltas.
  const operatorMoves = useMemo(() => {
    return game.moves
      .map((m, i) => ({ ...m, turnIndex: i }))
      .filter((m) => m.role === "operator");
  }, [game]);

  const nextGameId = useMemo(() => {
    const idx = MASTER_GAMES.findIndex((g) => g.id === game.id);
    return MASTER_GAMES[(idx + 1) % MASTER_GAMES.length].id;
  }, [game.id]);

  function scrollToTurn(turnIndex: number) {
    setSelectedTurn(turnIndex);
    const el = bubbleRefs.current[turnIndex];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const outcomeColor =
    game.outcome === "win" ? "var(--brand-green-600)" :
    game.outcome === "loss" ? "var(--danger)" :
    "var(--warning)";

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" }}>
      <Link href="/watch" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Master games
      </Link>

      {/* ─── Game header ────────────────────────────────────────── */}
      <div className="panel" style={{ padding: 24, marginBottom: 20 }}>
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: outcomeColor, fontWeight: 800 }}>
            {game.outcome}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
            Master Game · {operatorMoves.length} moves · final eval {finalEval >= 0 ? "+" : ""}{finalEval.toFixed(2)}
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 8 }}>
          {game.speaker}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 14, maxWidth: 720 }}>
          <strong style={{ color: "var(--text-primary)" }}>vs {game.opponentRole}</strong> · {game.scenario}
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.55, maxWidth: 720 }}>
          Style: {game.speakerStyle}
        </p>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 24, flexWrap: "wrap", fontSize: 12, color: "var(--text-muted)" }}>
          <span>
            <strong style={{ color: "var(--brand-green-600)" }}>Opening:</strong> {game.openingName}
            <span className="tabular" style={{ marginLeft: 6 }}>({game.openingECO})</span>
          </span>
          <span>
            <strong style={{ color: outcomeColor }}>Outcome:</strong> {game.outcomeNote}
          </span>
        </div>
      </div>

      {/* ─── Eval curve ─────────────────────────────────────────── */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
          Eval curve · {finalEval >= 0 ? "operator dominates" : "buyer dominates"}
        </p>
        <EvalCurve points={curve} />
      </div>

      {/* ─── Main 2-col layout: transcript + move list ─────────── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)" }}>
        {/* Transcript */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {game.moves.map((m, i) => {
            const isOperator = m.role === "operator";
            const isSelected = selectedTurn === i;
            const q = m.delta !== undefined ? classifyMove(m.delta) : null;
            return (
              <div
                key={i}
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isOperator ? "flex-end" : "flex-start",
                  outline: isSelected ? "2px solid var(--info)" : "none",
                  outlineOffset: 4,
                  borderRadius: 4,
                  transition: "outline-color 200ms",
                }}
              >
                <div className={`bubble ${isOperator ? "bubble-operator" : "bubble-persona"}`} style={{ maxWidth: "92%" }}>
                  <div className="bubble-meta">
                    {isOperator ? game.speaker.split(" ")[0] : "Buyer"} · turn {i + 1}
                  </div>
                  <div>{m.text}</div>
                  {isOperator && m.techniqueIds && m.techniqueIds.length > 0 && (
                    <div className="bubble-techtags">
                      {m.techniqueIds.map((id) => (
                        <span key={id} className="bubble-techtag">
                          {getTechnique(id)?.name ?? id}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Annotation pop-out for operator moves */}
                {isOperator && m.annotation && (
                  <div
                    style={{
                      marginTop: 8,
                      maxWidth: "82%",
                      padding: "10px 14px",
                      background: "var(--bg-rail)",
                      borderLeft: `3px solid ${q?.className === "blunder" || q?.className === "mistake" ? "var(--danger)" : "var(--brand-green-600)"}`,
                      borderRadius: "0 4px 4px 0",
                      fontSize: 12.5,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <div style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--brand-green-600)" }}>
                        Annotation
                      </span>
                      {q?.glyph && (
                        <span className={`move-glyph ${q.className}`}>{q.glyph} <span style={{ fontWeight: 600, color: "var(--text-muted)", marginLeft: 2 }}>{q.label}</span></span>
                      )}
                      {m.delta !== undefined && (
                        <span className={`eval-delta ${m.delta > 0.15 ? "pos" : m.delta < -0.15 ? "neg" : "neu"} tabular`}>
                          {m.delta > 0 ? "+" : ""}{m.delta.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {m.annotation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Move list rail */}
        <div className="panel-rail" style={{ position: "sticky", top: 76, alignSelf: "flex-start", maxHeight: "calc(100vh - 100px)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div className="opening-banner">
            <span style={{ flex: 1 }} className="elide">{game.openingName}</span>
            <span className="eco">({game.openingECO})</span>
          </div>
          <div style={{ padding: 10, borderBottom: "1px solid var(--border)", display: "flex", gap: 6, fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700 }}>
            <span style={{ flex: 1 }}>Operator moves</span>
            <span>Click to jump</span>
          </div>
          <div className="movelist scroll-slim" style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {operatorMoves.map((m, idx) => {
              const q = m.delta !== undefined ? classifyMove(m.delta) : null;
              const isSelected = selectedTurn === m.turnIndex;
              const label = (m.techniqueIds ?? [])
                .slice(0, 2)
                .map((id) => getTechnique(id)?.name ?? id)
                .join(" + ") || "—";
              return (
                <div
                  key={m.turnIndex}
                  className={`movelist-row ${isSelected ? "current" : ""}`}
                  onClick={() => scrollToTurn(m.turnIndex)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="movelist-num tabular">{idx + 1}</div>
                  <div className="movelist-cell" style={{ gridColumn: "2 / span 2" }}>
                    <span className="elide">{label}</span>
                    {q?.glyph && (
                      <span className={`move-glyph ${q.className}`}>{q.glyph}</span>
                    )}
                    {m.delta !== undefined && (
                      <span className={`eval-delta ${m.delta > 0.15 ? "pos" : m.delta < -0.15 ? "neg" : "neu"} tabular`}>
                        {m.delta > 0 ? "+" : ""}{m.delta.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: 10, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Eval values computed by the same heuristic engine as live games. Hand-tuned against Atlas literature.
          </div>
        </div>
      </div>

      {/* ─── Study hint ──────────────────────────────────────────── */}
      <div className="panel" style={{ padding: 20, marginTop: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 8 }}>
          Study takeaway
        </p>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
          {game.studyHint}
        </p>
      </div>

      {/* ─── Navigation ─────────────────────────────────────────── */}
      <div className="flex gap-2 mt-6 flex-wrap">
        <Link href={`/watch/${nextGameId}`} className="btn btn-primary">
          Next master game →
        </Link>
        <Link href="/watch" className="btn btn-secondary">
          All games
        </Link>
        <Link href="/puzzles" className="btn btn-secondary">
          Train on a puzzle →
        </Link>
      </div>
    </div>
  );
}

// ─── EvalCurve · SVG line chart ───────────────────────────────────────────
function EvalCurve({ points }: { points: { turnIndex: number; value: number; role: string }[] }) {
  if (points.length === 0) return null;
  const W = 100;
  const H = 40;
  const yMin = -2.5;
  const yMax = 2.5;
  const xMax = Math.max(1, points.length - 1);
  const path = points
    .map((p, i) => {
      const x = (i / xMax) * W;
      const y = H - ((p.value - yMin) / (yMax - yMin)) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const baselineY = H - ((0 - yMin) / (yMax - yMin)) * H;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 100, display: "block" }}>
      <defs>
        <linearGradient id="mgevalUp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81B64C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#81B64C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mgevalDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A4262C" stopOpacity="0" />
          <stop offset="100%" stopColor="#A4262C" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <line x1="0" y1={baselineY} x2={W} y2={baselineY} stroke="#3D3A37" strokeWidth="0.3" strokeDasharray="0.5,0.5" />
      <path d={`${path} L${W},${baselineY} L0,${baselineY} Z`} fill="url(#mgevalUp)" />
      <path d={path} fill="none" stroke="#81B64C" strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => {
        if (p.role !== "operator") return null;
        const x = (i / xMax) * W;
        const y = H - ((p.value - yMin) / (yMax - yMin)) * H;
        return <circle key={i} cx={x} cy={y} r="0.6" fill="#81B64C" />;
      })}
    </svg>
  );
}
