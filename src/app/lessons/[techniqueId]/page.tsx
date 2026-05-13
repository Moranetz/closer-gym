import { notFound } from "next/navigation";
import Link from "next/link";
import { getTechnique, TECHNIQUES, ATLAS_VERDICT_LABEL, FOLKLORE_RISK_LABEL } from "@/lib/techniques";
import { PUZZLES } from "@/lib/puzzle-library";
import { TRANSCRIPTS } from "@/lib/transcripts";
import { MASTER_GAMES } from "@/lib/master-games";
import { THEME_LABELS } from "@/lib/puzzles";

interface Params {
  params: Promise<{ techniqueId: string }>;
}

export async function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ techniqueId: t.id }));
}

export default async function LessonDetail({ params }: Params) {
  const { techniqueId } = await params;
  const technique = getTechnique(techniqueId);
  if (!technique) notFound();

  // Find related items via existing cross-references.
  const relatedPuzzles = PUZZLES.filter((p) =>
    p.candidates.some((c) => c.atlasTags.includes(technique.id)),
  );
  const relatedTranscripts = TRANSCRIPTS.filter((tr) => tr.techniqueIds.includes(technique.id));
  const relatedMasterMoves = MASTER_GAMES.flatMap((g) =>
    g.moves
      .map((m, i) => ({ game: g, move: m, idx: i }))
      .filter(({ move }) => move.techniqueIds?.includes(technique.id)),
  );

  const verdictTone =
    technique.atlasVerdict === "well-studied" ? "var(--brand-green-600)" :
    technique.atlasVerdict === "partially-studied" ? "var(--warning)" :
    technique.atlasVerdict === "replication-failed" ? "var(--danger)" :
    "var(--text-muted)";

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 24px 64px" }}>
      <Link href="/lessons" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Atlas
      </Link>

      {/* Header */}
      <div className="panel" style={{ padding: 24, marginBottom: 20 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
          {technique.cluster.replace(/-/g, " ")}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>{technique.name}</h1>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2, background: "rgba(255,255,255,0.06)", color: verdictTone, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Verdict: {ATLAS_VERDICT_LABEL[technique.atlasVerdict]}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2, background: "rgba(255,255,255,0.06)", color: technique.folkloreRisk === "high" ? "var(--danger)" : technique.folkloreRisk === "medium-high" ? "var(--warning)" : "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Folklore-risk: {FOLKLORE_RISK_LABEL[technique.folkloreRisk]}
          </span>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {technique.mechanism}
        </p>
      </div>

      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="tile" style={{ padding: 14 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 6 }}>
            Primary failure mode
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {technique.primaryFailureMode}
          </p>
        </div>
        <div className="tile" style={{ padding: 14 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 6 }}>
            Contraindication
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {technique.contraindication}
          </p>
        </div>
      </div>

      <div className="tile" style={{ padding: 14, marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 6 }}>
          Canonical source
        </p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {technique.canonicalSource}
        </p>
      </div>

      {/* Drill this technique CTA */}
      {relatedPuzzles.length > 0 && (
        <Link
          href={`/puzzles/${relatedPuzzles[0].id}`}
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "flex-start", gap: 12, padding: "14px 18px", marginBottom: 24, textDecoration: "none" }}
        >
          <span style={{ fontSize: 16 }}>▶</span>
          <span>
            <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>Drill this technique now</span>
            <span style={{ display: "block", fontSize: 11, fontWeight: 500, opacity: 0.8, marginTop: 2 }} className="tabular">
              {relatedPuzzles[0].id.toUpperCase()} · ELO {relatedPuzzles[0].difficulty}
            </span>
          </span>
        </Link>
      )}

      {/* Related puzzles */}
      {relatedPuzzles.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--brand-green-600)", marginBottom: 10 }}>
            Drill in puzzles ({relatedPuzzles.length})
          </h2>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {relatedPuzzles.map((p) => (
              <Link key={p.id} href={`/puzzles/${p.id}`} className="bot-card" style={{ padding: 12 }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.04em", fontWeight: 700 }} className="tabular">{p.id.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }} className="tabular">ELO {p.difficulty}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }} className="elide">
                  {p.buyerRole}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  {THEME_LABELS[p.theme]}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related transcripts */}
      {relatedTranscripts.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--brand-green-600)", marginBottom: 10 }}>
            Demonstrated in transcripts ({relatedTranscripts.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {relatedTranscripts.map((tr) => (
              <a key={tr.id} href={tr.sourceUrl} target="_blank" rel="noopener noreferrer" className="bot-card" style={{ padding: 14, textDecoration: "none" }}>
                <div className="flex items-baseline justify-between mb-1 flex-wrap">
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{tr.speaker}: {tr.title}</div>
                  {tr.paraphrased && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--warning)", letterSpacing: "0.05em", textTransform: "uppercase", padding: "1px 5px", border: "1px solid rgba(229,165,10,0.3)", borderRadius: 2 }}>
                      Paraphrased
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 6 }}>
                  {tr.scenario}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  {tr.source} →
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Related master moves */}
      {relatedMasterMoves.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--brand-green-600)", marginBottom: 10 }}>
            Master-game moves ({relatedMasterMoves.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {relatedMasterMoves.map(({ game, move, idx }) => (
              <Link key={`${game.id}-${idx}`} href={`/watch/${game.id}`} className="bot-card" style={{ padding: 14 }}>
                <div className="flex items-baseline justify-between mb-1">
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>{game.speaker} · turn {idx + 1}</div>
                  {move.delta !== undefined && (
                    <span className="tabular" style={{ fontSize: 12, fontWeight: 700, color: move.delta > 0 ? "var(--brand-green-600)" : "var(--danger)" }}>
                      {move.delta > 0 ? "+" : ""}{move.delta.toFixed(2)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.5, marginBottom: 4 }}>
                  &ldquo;{move.text}&rdquo;
                </p>
                {move.annotation && (
                  <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {move.annotation.slice(0, 140)}{move.annotation.length > 140 ? "…" : ""}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedPuzzles.length === 0 && relatedTranscripts.length === 0 && relatedMasterMoves.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", padding: 16, background: "var(--bg-rail)", borderRadius: 4 }}>
          No puzzles, transcripts, or master moves yet in the library tagged with this technique. Coming in v0.2 as the corpus expands.
        </p>
      )}
    </div>
  );
}
