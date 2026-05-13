import Link from "next/link";
import { TECHNIQUES, ATLAS_VERDICT_LABEL, FOLKLORE_RISK_LABEL } from "@/lib/techniques";

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
  if (v === "well-studied")      return "var(--brand-green-600)";
  if (v === "partially-studied") return "var(--warning)";
  if (v === "replication-failed") return "var(--danger)";
  return "var(--text-muted)";
}

function riskColor(r: string): string {
  if (r === "high") return "var(--danger)";
  if (r === "medium-high") return "var(--warning)";
  return "var(--text-muted)";
}

export default function Lessons() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Lessons · Atlas</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          35 techniques, source-cited and verdict-tagged
        </p>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
        Browse the Atlas taxonomy. Each entry shows the technique&apos;s mechanism, evidence verdict, folklore risk, and every puzzle + transcript that demonstrates it. The verdict and risk flags are calibrated against the Atlas literature, not assigned by reputation.
      </p>

      {CLUSTER_ORDER.map((cluster) => {
        const inCluster = TECHNIQUES.filter((t) => t.cluster === cluster);
        if (inCluster.length === 0) return null;
        return (
          <section key={cluster} style={{ marginBottom: 32 }}>
            <div className="flex items-baseline justify-between mb-3" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                {CLUSTER_LABEL[cluster]}
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
                {inCluster.length}
              </p>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {inCluster.map((t) => (
                <Link key={t.id} href={`/lessons/${t.id}`} className="bot-card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                    {t.name}
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
              ))}
            </div>
          </section>
        );
      })}

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.55, maxWidth: 720 }}>
        Verdict is a meta-analytic call: <strong>well-studied</strong> means multiple replications across contexts; <strong>partially-studied</strong> means lab evidence with weak field replication; <strong>untested</strong> means folklore-only; <strong>replication-failed</strong> means published failures of the canonical study. Folklore-risk is the gap between practitioner reputation and empirical support.
      </p>
    </div>
  );
}
