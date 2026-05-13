"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, saveSession } from "@/lib/storage";
import type { Persona, Session, SessionTurn } from "@/lib/types";
import {
  initialEvalState,
  scoreOperatorMove,
  scorePersonaMove,
  evalToFillRatio,
  evalLabel,
  detectOpening,
  moveLabelFromTechniques,
} from "@/lib/eval";
import { classifyMove, titleForRating, LAYOUT } from "@/lib/tokens";

interface Props {
  sessionId: string;
  personaId: string;
  personaRole: string;
  personaTrack: string;
  personaTrackLabel: string;
  personaSpec: Persona;
  botRating: number;
  botTagline: string;
  techniqueIndex: Record<string, { name: string; cluster: string }>;
}

export default function SessionClient({
  sessionId,
  personaId,
  personaRole,
  personaSpec,
  botRating,
  techniqueIndex,
}: Props) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endingSession, setEndingSession] = useState(false);
  const [resignConfirm, setResignConfirm] = useState(false);
  const [selectedMoveIdx, setSelectedMoveIdx] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // ─── Load session ─────────────────────────────────────────────────────────
  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      setError("Session not found in local storage. Start a new game.");
      return;
    }
    setSession(s);
  }, [sessionId]);

  // ─── Auto-scroll transcript ──────────────────────────────────────────────
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [session?.turns.length, busy]);

  // ─── Live eval state from turns ──────────────────────────────────────────
  const evalState = useMemo(() => {
    if (!session) return null;
    let state = initialEvalState(personaSpec);
    session.turns.forEach((t, i) => {
      if (t.role === "operator") {
        const { newState } = scoreOperatorMove({
          turnIndex: i,
          operatorText: t.text,
          techniqueIds: t.techniquesDeployed ?? [],
          persona: personaSpec,
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
  }, [session, personaSpec]);

  // ─── Operator move list ──────────────────────────────────────────────────
  const operatorMoves = useMemo(() => {
    if (!session || !evalState) return [];
    const moves: {
      turnIndex: number;
      text: string;
      techniqueIds: string[];
      delta: number;
      label: string;
      quality: ReturnType<typeof classifyMove>;
    }[] = [];
    session.turns.forEach((t, i) => {
      if (t.role !== "operator") return;
      const histEntry = evalState.history.find((h) => h.turnIndex === i);
      const delta = histEntry?.delta ?? 0;
      moves.push({
        turnIndex: i,
        text: t.text,
        techniqueIds: t.techniquesDeployed ?? [],
        delta,
        label: moveLabelFromTechniques(t.techniquesDeployed ?? []),
        quality: classifyMove(delta),
      });
    });
    return moves;
  }, [session, evalState]);

  const opening = useMemo(() => {
    const perTurnTechniques = operatorMoves.map((m) => m.techniqueIds);
    return detectOpening(perTurnTechniques);
  }, [operatorMoves]);

  // ─── Send operator turn ──────────────────────────────────────────────────
  async function send() {
    if (!session || !input.trim() || busy) return;
    const operatorText = input.trim();
    setInput("");
    setBusy(true);
    setError(null);

    const operatorTurn: SessionTurn = {
      role: "operator",
      text: operatorText,
      timestamp: Date.now(),
    };
    const optimistic = {
      ...session,
      turns: [...session.turns, operatorTurn],
    };
    setSession(optimistic);
    saveSession(optimistic);

    try {
      const [personaRes, detectRes] = await Promise.all([
        fetch("/api/persona-turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personaId,
            conversationHistory: session.turns,
            operatorTurn: operatorText,
          }),
        }),
        fetch("/api/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operatorText,
            recentContext: session.turns.slice(-4),
            deep: false,
          }),
        }),
      ]);

      if (!personaRes.ok) {
        const data = await personaRes.json().catch(() => ({}));
        throw new Error(data.error || `Persona API failed (${personaRes.status})`);
      }

      const personaData = await personaRes.json();
      const detectData = detectRes.ok ? await detectRes.json() : { techniqueIds: [] };

      const finalOperatorTurn: SessionTurn = {
        ...operatorTurn,
        techniquesDeployed: detectData.techniqueIds ?? [],
      };
      const personaTurn: SessionTurn = {
        role: "persona",
        text: personaData.text,
        timestamp: Date.now(),
      };
      const afterPersona: Session = {
        ...session,
        turns: [...session.turns, finalOperatorTurn, personaTurn],
      };
      setSession(afterPersona);
      saveSession(afterPersona);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  // ─── End session ─────────────────────────────────────────────────────────
  async function endSession() {
    if (!session || endingSession) return;
    setEndingSession(true);
    setError(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId,
          intendedTechniques: session.intendedTechniques,
          turns: session.turns,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Scoring API failed (${res.status})`);
      }
      const data = await res.json();
      const ended: Session = {
        ...session,
        endedAt: Date.now(),
        scorecard: data.scorecard,
      };
      saveSession(ended);
      router.push(`/play/${personaId}/session/${sessionId}/review`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setEndingSession(false);
    }
  }

  if (error && !session) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>{error}</h1>
        <Link href="/play" className="btn btn-secondary">← Back to bot ladder</Link>
      </div>
    );
  }
  if (!session) {
    return (
      <div style={{ padding: "64px 24px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading game…
      </div>
    );
  }

  const evalValue = evalState?.value ?? 0;
  const fillRatio = evalToFillRatio(evalValue);
  const fillPct = (1 - fillRatio) * 100;
  const evalText = evalLabel(evalValue);
  const evalAdvantage: "white" | "black" = evalValue >= 0 ? "white" : "black";
  const opponentInitials = personaRole.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const opponentTitle = titleForRating(botRating);

  return (
    <div style={{ padding: "16px 16px 24px", maxWidth: 1380, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${LAYOUT.EVAL_BAR_WIDTH}px 1fr ${LAYOUT.RIGHT_RAIL_WIDTH}px`,
          gap: 12,
          height: "calc(100vh - 56px - 32px)",
        }}
      >
        {/* EVAL BAR */}
        <div className="evalbar" style={{ height: "100%" }}>
          <div className="evalbar-fill" style={{ height: `${fillPct}%` }} />
          <div className={`evalbar-label ${evalAdvantage}`}>{evalText}</div>
        </div>

        {/* BOARD COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          {/* Opponent card */}
          <div className="player-card">
            <div className="player-avatar">{opponentInitials}</div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div className="flex items-center gap-2">
                <span className={`title-badge ${opponentTitle.tier}`}>{opponentTitle.label.replace(" Closer", "")}</span>
                <span className="player-name elide" style={{ maxWidth: 280 }}>{personaRole}</span>
              </div>
              <div className="player-rating tabular">
                Buyer · {botRating} · PK {personaSpec.persuasionKnowledge}
              </div>
            </div>
            <div className="player-clock tabular">{"  —  "}</div>
          </div>

          {/* Conversation surface (the "board") */}
          <div
            ref={scrollerRef}
            className="panel scroll-slim"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 0,
            }}
          >
            {session.turns.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", maxWidth: 460, color: "var(--text-muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>♟</div>
                <p style={{ fontSize: 14, lineHeight: 1.55 }}>
                  Game open. Make your first move. The buyer reacts in character — narrative arc, contraindicated and responsive Atlas techniques, hidden curve ball.
                </p>
              </div>
            )}

            {session.turns.map((turn, i) => {
              const isOperator = turn.role === "operator";
              const tags = turn.techniquesDeployed ?? [];
              const isSelected = selectedMoveIdx === i;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isOperator ? "flex-end" : "flex-start",
                    outline: isSelected ? "2px solid var(--info)" : "none",
                    outlineOffset: 4,
                    borderRadius: 4,
                  }}
                >
                  <div className={`bubble ${isOperator ? "bubble-operator" : "bubble-persona"}`}>
                    <div className="bubble-meta">
                      {isOperator ? "You" : "Buyer"} · move {Math.floor(i / 2) + 1}
                    </div>
                    <div>{turn.text}</div>
                    {isOperator && tags.length > 0 && (
                      <div className="bubble-techtags">
                        {tags.map((id) => (
                          <span key={id} className="bubble-techtag">
                            {techniqueIndex[id]?.name ?? id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="bubble bubble-persona" style={{ alignSelf: "flex-start", opacity: 0.7, fontStyle: "italic" }}>
                <div className="bubble-meta">Buyer · thinking</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        background: "var(--text-muted)",
                        animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3 } 40% { opacity: 1 } }`}</style>
              </div>
            )}
          </div>

          {/* Self player card */}
          <div className="player-card">
            <div className="player-avatar" style={{ background: "var(--brand-green-600)", color: "var(--bg-page)" }}>
              YO
            </div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div className="flex items-center gap-2">
                <span className="title-badge low">Patzer</span>
                <span className="player-name">You</span>
              </div>
              <div className="player-rating tabular">Closer · 1200 (provisional)</div>
            </div>
            <div className="player-clock active tabular">{"  —  "}</div>
          </div>

          {/* Input bar */}
          <div className="panel" style={{ padding: 12 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Your move — open, ask, label, summarize, anchor, close…"
              rows={2}
              disabled={busy || endingSession}
              style={{ width: "100%", resize: "none", marginBottom: 8 }}
            />
            <div className="flex items-center justify-between">
              <p style={{ fontSize: 11, color: "var(--text-muted)" }} className="tabular">
                ⌘+Enter to send
              </p>
              <button
                onClick={send}
                disabled={busy || endingSession || !input.trim()}
                className="btn btn-primary"
              >
                {busy ? "Sending…" : "Send move →"}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "var(--danger)", padding: "8px 12px", background: "rgba(164,38,44,0.10)", borderRadius: 3, border: "1px solid rgba(164,38,44,0.30)" }}>
              {error}
            </div>
          )}
        </div>

        {/* RIGHT RAIL */}
        <div className="panel-rail" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          {opening && (
            <div className="opening-banner">
              <span style={{ flex: 1 }} className="elide">{opening.name}</span>
              <span className="eco">({opening.eco})</span>
            </div>
          )}

          <div style={{ height: LAYOUT.CONTROL_TOOLBAR_HEIGHT, display: "flex", alignItems: "center", padding: "0 4px", borderBottom: "1px solid var(--border)" }}>
            <button className="btn btn-ghost btn-icon" title="Flip board (post-v0)">↔</button>
            <button className="btn btn-ghost btn-icon" title="Settings (post-v0)">⚙</button>
            <button className="btn btn-ghost btn-icon" title="Hint — engine recommendation (post-v0)">💡</button>
            <div style={{ flex: 1 }} />
            <button
              className="btn btn-ghost btn-icon"
              title="Resign"
              onClick={() => setResignConfirm(true)}
              style={{ color: "var(--danger)" }}
            >
              🏳
            </button>
          </div>

          <div
            className="movelist scroll-slim"
            style={{ flex: 1, overflowY: "auto", minHeight: 0 }}
          >
            {operatorMoves.length === 0 ? (
              <div style={{ padding: 16, color: "var(--text-faint)", fontSize: 12, fontStyle: "italic" }}>
                No moves yet — make your first move below.
              </div>
            ) : (
              operatorMoves.map((m, idx) => (
                <div
                  key={m.turnIndex}
                  className={`movelist-row ${selectedMoveIdx === m.turnIndex ? "current" : ""}`}
                  onClick={() => setSelectedMoveIdx(m.turnIndex)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="movelist-num tabular">{idx + 1}</div>
                  <div className="movelist-cell" style={{ gridColumn: "2 / span 2" }}>
                    <span className="elide">{m.label}</span>
                    {m.quality.glyph && (
                      <span className={`move-glyph ${m.quality.className}`}>{m.quality.glyph}</span>
                    )}
                    <span className={`eval-delta ${m.delta > 0.15 ? "pos" : m.delta < -0.15 ? "neg" : "neu"} tabular`}>
                      {m.delta > 0 ? "+" : ""}{m.delta.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: 8, borderTop: "1px solid var(--border)" }}>
            <button
              onClick={endSession}
              disabled={busy || endingSession || session.turns.length < 2}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              {endingSession ? "Scoring…" : "End game + analyze"}
            </button>
          </div>
        </div>
      </div>

      {resignConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setResignConfirm(false)}
        >
          <div
            className="panel"
            style={{ width: 360, padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Resign this game?</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
              Resigning records a loss against this opponent. Your rating will drop.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={() => setResignConfirm(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setResignConfirm(false);
                  endSession();
                }}
                style={{ flex: 1 }}
              >
                Resign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
