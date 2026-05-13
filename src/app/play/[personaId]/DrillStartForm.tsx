"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSession, newSessionId } from "@/lib/storage";

interface TechniqueLite {
  id: string;
  name: string;
  cluster: string;
  atlasVerdict: string;
  folkloreRisk: string;
  verdictLabel: string;
  riskLabel: string;
}

const CLUSTER_LABELS: Record<string, string> = {
  "compliance":          "Compliance-gaining",
  "cialdini":            "Cialdini's six",
  "framing":             "Framing",
  "structural-close":    "Structural close",
  "question-form":       "Question form",
  "negotiation-anchor":  "Negotiation anchor",
  "post-objection":      "Post-objection",
  "closing-environment": "Closing environment",
};

export default function DrillStartForm({
  personaId,
  techniques,
}: {
  personaId: string;
  techniques: TechniqueLite[];
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function start() {
    if (busy) return;
    setBusy(true);
    const sessionId = newSessionId();
    saveSession({
      id: sessionId,
      personaId,
      intendedTechniques: Array.from(picked),
      turns: [],
      startedAt: Date.now(),
    });
    router.push(`/play/${personaId}/session/${sessionId}`);
  }

  const clusters = Array.from(new Set(techniques.map((t) => t.cluster)));

  return (
    <div className="panel" style={{ padding: 24 }}>
      <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 8 }}>
        Pre-game · select your opening repertoire
      </p>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 6 }}>
        Which Atlas techniques are you bringing?
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5, maxWidth: 760 }}>
        Pick 1–4. The post-game review compares what you intended against what the detector actually tagged in your moves. Picking nothing is allowed — it&apos;s a calibration test against your unconscious habits.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
        {clusters.map((cluster) => (
          <div key={cluster}>
            <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
              {CLUSTER_LABELS[cluster] ?? cluster}
            </p>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {techniques
                .filter((t) => t.cluster === cluster)
                .map((t) => {
                  const on = picked.has(t.id);
                  const isFailed = t.atlasVerdict === "replication-failed";
                  const isFolkloreHigh = t.folkloreRisk === "high";
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggle(t.id)}
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        borderRadius: 3,
                        border: `1px solid ${on ? "var(--brand-green-600)" : "var(--border-strong)"}`,
                        background: on ? "rgba(129,182,76,0.10)" : "var(--bg-rail)",
                        cursor: "pointer",
                        transition: "border-color 120ms, background 120ms",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{t.name}</span>
                        {on && <span style={{ color: "var(--brand-green-600)", fontWeight: 800 }}>✓</span>}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: isFailed ? "var(--danger)" : t.atlasVerdict === "well-studied" ? "var(--brand-green-600)" : "var(--text-faint)" }}>
                        {t.verdictLabel}
                        {(isFolkloreHigh || isFailed) && (
                          <span style={{ color: "var(--danger)", marginLeft: 6 }}>· {t.riskLabel}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }} className="tabular">
          {picked.size} selected
        </p>
        <button onClick={start} disabled={busy} className="btn btn-primary btn-lg">
          {busy ? "Starting…" : "▶  Start game"}
        </button>
      </div>
    </div>
  );
}
