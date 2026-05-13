import Link from "next/link";
import { MASTER_GAMES, computeMasterCurve } from "@/lib/master-games";

export default function Watch() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Watch · Master Games</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Annotated transcripts · click any move for the master&apos;s commentary · free, no API key
        </p>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
        Hand-authored games in the style of Voss, Klaff, Belfort, Cardone, and Burg. Each game is a real position you can step through move-by-move. Eval values come from the same heuristic engine that scores your live games and puzzles. Annotations explain why each move worked — or, in the Cardone game, why it didn&apos;t.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {MASTER_GAMES.map((g) => {
          const curve = computeMasterCurve(g);
          const finalEval = curve.length ? curve[curve.length - 1].value : 0;
          const operatorCount = g.moves.filter((m) => m.role === "operator").length;
          const outcomeColor =
            g.outcome === "win" ? "var(--brand-green-600)" :
            g.outcome === "loss" ? "var(--danger)" :
            "var(--warning)";
          return (
            <Link key={g.id} href={`/watch/${g.id}`} className="bot-card">
              <div className="flex items-baseline justify-between mb-1">
                <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em", fontWeight: 700 }} className="tabular">
                  {g.id.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 2, background: outcomeColor, color: "var(--text-primary)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
                  {g.outcome}
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.25 }}>
                {g.speaker}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                vs {g.opponentRole}
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
                {g.speakerStyle}
              </p>
              <div className="flex items-center gap-2" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
                <span>{operatorCount} moves</span>
                <span>·</span>
                <span>{g.openingECO}</span>
                <span>·</span>
                <span className="tabular">final {finalEval >= 0 ? "+" : ""}{finalEval.toFixed(2)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <p style={{ marginTop: 40, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.55, maxWidth: 720 }}>
        These are inspired-by-style constructions, not verbatim quotes. Like chess.com&apos;s &ldquo;annotated games&rdquo; collections, the goal is to show what each style looks like at the move level. Real transcripts from{" "}
        <Link href="https://github.com/Moranetz/sales-instrument" style={{ color: "var(--brand-green-600)" }} target="_blank" rel="noopener noreferrer">
          sales-instrument
        </Link>{" "}
        roll out with v0.2.
      </p>
    </div>
  );
}
