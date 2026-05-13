import Link from "next/link";
import { PUZZLES, dailyPuzzleId } from "@/lib/puzzle-library";
import { THEME_LABELS, THEME_COLORS, difficultyTier, type PuzzleTheme } from "@/lib/puzzles";
import PuzzlesClientHeader from "./PuzzlesClientHeader";

export default function PuzzlesIndex() {
  const todayId = dailyPuzzleId();
  const daily = PUZZLES.find((p) => p.id === todayId)!;
  const themes: PuzzleTheme[] = ["budget", "procurement", "stall", "renewal", "multistakeholder", "endgame", "cold-open"];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Puzzles</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>One position · one best move · 30s timer · free, no API key</p>
      </div>

      <PuzzlesClientHeader />

      {/* Daily Puzzle hero */}
      <div className="tile-hero" style={{ padding: 28, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 6, background: THEME_COLORS[daily.theme] }} />
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 800 }}>
            Daily Drill
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
            {new Date().toISOString().slice(0, 10)} · resets at 00:00 UTC
          </span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 4 }}>
          {THEME_LABELS[daily.theme]} · ELO {daily.difficulty}
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 16, maxWidth: 680 }}>
          <strong style={{ color: "var(--text-primary)" }}>{daily.buyerRole}</strong> · {daily.setup.split(".")[0]}…
        </p>
        <Link href="/puzzles/today?daily=1" className="btn btn-primary btn-lg">
          Solve · 30s
        </Link>
      </div>

      {/* Themed sets */}
      <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginTop: 32, marginBottom: 12 }}>
        Themed sets
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {themes.map((theme) => {
          const inTheme = PUZZLES.filter((p) => p.theme === theme);
          if (inTheme.length === 0) return null;
          return (
            <section key={theme}>
              <div className="flex items-baseline justify-between mb-3" style={{ borderBottom: `2px solid ${THEME_COLORS[theme]}40`, paddingBottom: 8 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: THEME_COLORS[theme] }}>
                  {THEME_LABELS[theme]}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
                  {inTheme.length} {inTheme.length === 1 ? "position" : "positions"}
                </p>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                {inTheme.map((p) => (
                  <Link key={p.id} href={`/puzzles/${p.id}`} className="bot-card" style={{ padding: 14 }}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.04em", fontWeight: 700 }} className="tabular">{p.id.toUpperCase()}</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }} className="tabular">{difficultyTier(p.difficulty)} · {p.difficulty}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.35 }} className="elide">
                      {p.buyerRole}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginTop: 6 }}>
                      &ldquo;{p.buyerLine.slice(0, 90)}{p.buyerLine.length > 90 ? "…" : ""}&rdquo;
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p style={{ marginTop: 40, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.55, maxWidth: 720 }}>
        20 seed positions hand-authored against the Atlas literature. Adaptive difficulty + Puzzle Rush + community submissions roll out with v0.2. Solving is fully offline — no API key required.
      </p>
    </div>
  );
}
