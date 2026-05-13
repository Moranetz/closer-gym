"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TECHNIQUES, ATLAS_VERDICT_LABEL, FOLKLORE_RISK_LABEL } from "@/lib/techniques";
import { PUZZLES } from "@/lib/puzzle-library";

const CLUSTER_LABEL: Record<string, string> = {
  "compliance":          "Compliance-gaining",
  "cialdini":            "Cialdini's six",
  "framing":             "Framing",
  "structural-close":    "Structural close",
  "question-form":       "Question form",
  "negotiation-anchor":  "Negotiation anchor",
  "post-objection":      "Post-objection",
  "closing-environment": "Closing environment",
};

const CLUSTER_DEFINITION: Record<string, string> = {
  "question-form":       "Open-ended question patterns that convert demands into shared problems.",
  "cialdini":            "Six classical influence principles cataloged by Robert Cialdini.",
  "framing":             "Cognitive framing moves that exploit asymmetric weighting of gains, losses, and reference points.",
  "compliance":          "Sequential request structures that exploit consistency norms and reciprocity.",
  "negotiation-anchor":  "First-move number tactics that bias the counterparty's adjustment.",
  "structural-close":    "Bookend moves that compress decision space and force commitment.",
  "post-objection":      "Response patterns once the buyer has stated a concern.",
  "closing-environment": "Procedural commitments and multi-stakeholder structures that reduce drift.",
};

const CLUSTER_ORDER = [
  "question-form",
  "cialdini",
  "framing",
  "compliance",
  "negotiation-anchor",
  "structural-close",
  "post-objection",
  "closing-environment",
];

function verdictColor(v: string): string {
  if (v === "well-studied")       return "var(--brand-green-600)";
  if (v === "partially-studied")  return "var(--warning)";
  if (v === "replication-failed") return "var(--danger)";
  return "var(--text-muted)";
}

function riskColor(r: string): string {
  if (r === "high") return "var(--danger)";
  if (r === "medium-high") return "var(--warning)";
  return "var(--text-muted)";
}

interface PuzzleSolve { puzzleId: string; pickedIndex: number; correct: boolean; }

export default function Lessons() {
  const [search, setSearch] = useState("");
  const [encountered, setEncountered] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("closer-gym:puzzles:v0.1");
      if (!raw) return;
      const state = JSON.parse(raw) as { solves?: PuzzleSolve[] };
      const ids = new Set<string>();
      for (const solve of state.solves ?? []) {
        if (!solve.correct) continue;
        const puzzle = PUZZLES.find((p) => p.id === solve.puzzleId);
        if (!puzzle) continue;
        const idx = solve.pickedIndex < 0 ? puzzle.bestIndex : Math.min(solve.pickedIndex, puzzle.candidates.length - 1);
        const chosen = puzzle.candidates[idx];
        for (const tag of chosen.atlasTags) ids.add(tag);
      }
      setEncountered(ids);
    } catch { /* ignore */ }
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TECHNIQUES;
    return TECHNIQUES.filter((t) =>
      t.name.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.mechanism.toLowerCase().includes(q) ||
      CLUSTER_LABEL[t.cluster].toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Lessons · Atlas</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          35 techniques, source-cited and verdict-tagged
        </p>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, maxWidth: 720, lineHeight: 1.55 }}>
        Browse the Atlas taxonomy. Each entry shows mechanism, evidence verdict, folklore risk, and every puzzle and transcript that demonstrates it.
      </p>

      {/* Search bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--bg-panel)", borderRadius: 8, border: "1px solid var(--border)", maxWidth: 480, marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search techniques"
          style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-primary)", outline: "none", fontSize: 14 }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ background: "transparent", border: "none", color: "var(--text-faint)", cursor: "pointer", fontSize: 13 }}
          >
            ×
          </button>
        )}
      </div>

      {/* Encountered count */}
      {encountered.size > 0 && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--brand-green-600)", fontSize: 13 }}>✓</span>
          {encountered.size} of 35 techniques encountered via puzzle solves
        </p>
      )}

      {CLUSTER_ORDER.map((cluster) => {
        const inCluster = filtered.filter((t) => t.cluster === cluster);
        if (inCluster.length === 0) return null;
        return (
          <section key={cluster} style={{ marginBottom: 32 }}>
            <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 10 }}>
              <div className="flex items-baseline justify-between mb-1">
                <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                  {CLUSTER_LABEL[cluster]}
                </h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
                  {inCluster.length}
                </p>
              </div>
              <p style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic", lineHeight: 1.5 }}>
                {CLUSTER_DEFINITION[cluster]}
              </p>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {inCluster.map((t) => {
                const isEncountered = encountered.has(t.id);
                return (
                  <Link
                    key={t.id}
                    href={`/lessons/${t.id}`}
                    className="bot-card"
                    style={{
                      padding: 14,
                      borderColor: isEncountered ? "rgba(129,182,76,0.35)" : "var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</span>
                      {isEncountered && (
                        <span style={{ color: "var(--brand-green-600)", fontSize: 12 }}>✓</span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {t.mechanism.split(";")[0]}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.06)", color: verdictColor(t.atlasVerdict), letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {ATLAS_VERDICT_LABEL[t.atlasVerdict]}
                      </span>
                      {(t.folkloreRisk === "high" || t.folkloreRisk === "medium-high") && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 2, background: "rgba(255,255,255,0.06)", color: riskColor(t.folkloreRisk), letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          Folklore: {FOLKLORE_RISK_LABEL[t.folkloreRisk]}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontStyle: "italic", padding: 20, textAlign: "center" }}>
          No techniques match &ldquo;{search}&rdquo;.
        </p>
      )}

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.55, maxWidth: 720 }}>
        Verdict is a meta-analytic call: <strong>well-studied</strong> means multiple replications across contexts; <strong>partial</strong> means lab evidence with weak field replication; <strong>untested</strong> means folklore-only; <strong>replication-failed</strong> means published failures of the canonical study. Folklore-risk is the gap between practitioner reputation and empirical support.
      </p>
    </div>
  );
}
