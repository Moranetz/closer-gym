import Link from "next/link";

export default function About() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 64px" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 16 }}>
        About
      </p>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 24 }}>
        The gym for closers.
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65 }}>
        <p>
          <strong style={{ color: "var(--text-primary)" }}>Cluely is the cheat code. We built the gym.</strong>
        </p>
        <p>
          closer.gym is a sparring app for sales conversations modeled after chess.com. Eval bar per move, blunder markers, opening repertoire, master games, Glicko-2 closing ELO.
        </p>
        <p>
          Built on three artifacts you can read on GitHub:{" "}
          <Link href="https://github.com/Moranetz/closer-curriculum" style={{ color: "var(--brand-green-600)" }} target="_blank" rel="noopener noreferrer">
            closer-curriculum
          </Link>{" "}
          (the pedagogy),{" "}
          <Link href="https://github.com/Moranetz/closer-sparring" style={{ color: "var(--brand-green-600)" }} target="_blank" rel="noopener noreferrer">
            closer-sparring
          </Link>{" "}
          (the persona engine), and{" "}
          <Link href="https://github.com/Moranetz/sales-instrument" style={{ color: "var(--brand-green-600)" }} target="_blank" rel="noopener noreferrer">
            sales-instrument
          </Link>{" "}
          (the master-game corpus). closer.gym assembles them.
        </p>
      </div>

      {/* ─── Free vs Pro ──────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 16 }}>
          Free vs Pro
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="panel-rail" style={{ padding: 16, borderColor: "rgba(129,182,76,0.4)" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 800, marginBottom: 10 }}>
              Free · no API key
            </p>
            <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, listStyle: "none" }}>
              <li>✓ Daily Drill puzzle</li>
              <li>✓ 20+ themed positions</li>
              <li>✓ Puzzle ELO + streak</li>
              <li>✓ Lessons (v0.2)</li>
              <li>✓ Master games (v0.2)</li>
              <li>✓ Local detector (regex-based)</li>
            </ul>
          </div>
          <div className="panel-rail" style={{ padding: 16, borderColor: "rgba(229,165,10,0.4)" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--warning)", fontWeight: 800, marginBottom: 10 }}>
              Pro · API key required
            </p>
            <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, listStyle: "none" }}>
              <li>★ Full bot ladder (15 adversarial buyers)</li>
              <li>★ Free-text play (open conversation)</li>
              <li>★ Live LLM detector (per-turn tagging)</li>
              <li>★ Upload your real calls to Analysis</li>
              <li>★ LLM-graded scorecard</li>
              <li>★ ~$0.50/game on your Anthropic key</li>
            </ul>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 12, lineHeight: 1.55 }}>
          v0.1 ships as bring-your-own-key for Pro. Hosted Pro tier arrives with v0.2.
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
          What this is
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
          <li>· A bot ladder. 15 schema-tagged buyer personas with known contraindicated and responsive Atlas techniques.</li>
          <li>· An eval engine. Every operator move is detector-tagged with Atlas techniques and scored against the persona&apos;s known reactivity.</li>
          <li>· A rating instrument. Glicko-2 across three buckets: Game, Puzzle, Analysis.</li>
          <li>· A vocabulary upgrade. Move list. Eval bar. Opening name. Blunder. Mate-in-3. Resignation. Rating change. The chess vocabulary makes the work legible.</li>
        </ul>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
          What this isn&apos;t
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
          <li>· An earpiece. Live-call assistance lives in a separate product (&ldquo;Simul mode&rdquo;) marketed to managers, not reps.</li>
          <li>· A substitute for real-deal exposure. Bot sparring is technique-recognition + delivery calibration.</li>
          <li>· A claim about ethical neutrality. The Atlas taxonomy marks high-folklore and replication-failed techniques explicitly.</li>
        </ul>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
          Honest limits · v0.1
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>
          LLM-driven personas are approximations. Eval function v1 is hand-tuned heuristic, calibrated against Atlas literature, not against a learned win/loss policy. Local detector hits ~70% accuracy vs the LLM detector&apos;s ~85% target. Single-grader scoring. Local-only persistence in this browser. Auth + cross-user leaderboard arrive with v0.2.
        </p>
      </div>

      <div style={{ marginTop: 40, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/puzzles/today?daily=1" className="btn btn-primary btn-lg">◇ Solve today&apos;s drill</Link>
        <Link href="/play" className="btn btn-secondary btn-lg">Bot ladder</Link>
      </div>
    </div>
  );
}
