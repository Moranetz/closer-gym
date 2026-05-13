import Link from "next/link";
import { BOTS } from "@/lib/persona-elo";
import { titleForRating, TIME_CONTROLS } from "@/lib/tokens";
import { getPersona } from "@/lib/personas";
import { dailyPuzzleId, getPuzzle } from "@/lib/puzzle-library";
import { THEME_LABELS, THEME_COLORS } from "@/lib/puzzles";

export default function Home() {
  const featured = [
    BOTS[0],
    BOTS[Math.floor(BOTS.length / 2)],
    BOTS[BOTS.length - 1],
  ];
  const todayId = dailyPuzzleId();
  const daily = getPuzzle(todayId)!;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="grid gap-6" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 0.9fr)" }}>
        {/* ─── HERO PLAY CARD ─── */}
        <section className="tile-hero" style={{ padding: 32 }}>
          <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 12 }}>
            What chess.com did to chess
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Train your closing on a bot ladder.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28, maxWidth: 540, lineHeight: 1.5 }}>
            Fifteen adversarial buyer bots, ELO 1200–2400. Pick your opening (frame), play the conversation, watch the eval bar move per turn. End of game: rating change, blunder markers, the moves the engine would have played.
          </p>

          <div className="flex flex-col gap-3" style={{ maxWidth: 520 }}>
            <Link href="/play" className="btn btn-primary btn-lg" style={{ justifyContent: "flex-start", paddingLeft: 20 }}>
              <span style={{ fontSize: 18, marginRight: 12 }} aria-hidden>▶</span>
              <span>Play Computer</span>
              <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>15 bots · Pro</span>
            </Link>

            <Link href="/puzzles/today?daily=1" className="btn btn-secondary btn-lg" style={{ justifyContent: "flex-start", paddingLeft: 20, height: 48 }}>
              <span style={{ fontSize: 16, marginRight: 12 }} aria-hidden>◇</span>
              <span>Solve today&apos;s puzzle</span>
              <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 500, color: "var(--brand-green-600)" }}>FREE · no key</span>
            </Link>

            {/* Time-control picks (chess.com pattern) */}
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {TIME_CONTROLS.map((tc) => (
                <Link
                  key={tc.id}
                  href={`/play?tc=${tc.id}`}
                  className="tile"
                  style={{ padding: "14px 16px", textAlign: "center" }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                    {tc.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                    {Math.floor(tc.seconds / 60)} min
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured bots strip */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
              Featured opponents
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {featured.map((bot) => {
                const persona = getPersona(bot.personaId);
                if (!persona) return null;
                const title = titleForRating(bot.rating);
                return (
                  <Link key={bot.personaId} href={`/play/${bot.personaId}`} className="bot-card" style={{ padding: 12 }}>
                    <div className="flex items-center gap-2">
                      <div className="player-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>
                        {persona.role.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }} className="elide">{persona.role.split(" at ")[0]}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }} className="tabular">
                          {bot.rating} · <span className={`title-badge ${title.tier}`} style={{ fontSize: 9 }}>{title.label.replace(" Closer", "")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── DAILY PUZZLE + CONTINUE ─── */}
        <section className="flex flex-col gap-6">
          <div className="tile" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 4, background: THEME_COLORS[daily.theme] }} />
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700 }}>
                Daily Drill
              </p>
              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 2, background: "var(--brand-green-600)", color: "var(--bg-page)", fontWeight: 700 }}>
                FREE
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
              {THEME_LABELS[daily.theme]}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
              {daily.buyerRole}: <em style={{ color: "var(--text-secondary)" }}>&ldquo;{daily.buyerLine.slice(0, 64)}{daily.buyerLine.length > 64 ? "…" : ""}&rdquo;</em>
            </p>
            <Link href="/puzzles/today?daily=1" className="btn btn-primary" style={{ width: "100%" }}>
              Solve · 30s timer
            </Link>
            <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 10, textAlign: "center" }} className="tabular">
              No API key needed
            </p>
          </div>

          <div className="tile" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
              Browse all puzzles
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              20 positions · 7 themes
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
              Budget, procurement, stall, renewal, multi-stakeholder, endgame, cold open.
            </p>
            <Link href="/puzzles" className="btn btn-secondary" style={{ width: "100%" }}>
              All puzzles →
            </Link>
          </div>

          <div className="tile" style={{ padding: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
              Master games
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Voss · Klaff · Belfort
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.4 }}>
              Annotated transcripts. Click any move for engine eval.
            </p>
            <Link href="/watch" className="btn btn-secondary" style={{ width: "100%" }}>
              Watch
            </Link>
          </div>
        </section>

        {/* ─── RIGHT RAIL ─── */}
        <section className="flex flex-col gap-6">
          <div className="panel-rail" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
              Your rating
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }} className="tabular">1200</div>
              <span className="title-badge low">Patzer</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-faint)" }} className="tabular">
              Provisional · play 5 rated games to confirm
            </p>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div className="flex justify-between mb-2" style={{ fontSize: 12 }}>
                <span style={{ color: "var(--text-muted)" }}>Puzzle rating</span>
                <span className="tabular" style={{ fontWeight: 600 }}>1200</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: 12 }}>
                <span style={{ color: "var(--text-muted)" }}>Analysis rating</span>
                <span className="tabular" style={{ fontWeight: 600 }}>—</span>
              </div>
            </div>
          </div>

          <div className="panel-rail" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
              Top Closers
            </p>
            <ol style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "—", rating: 0 },
                { name: "—", rating: 0 },
                { name: "—", rating: 0 },
              ].map((row, i) => (
                <li key={i} className="flex items-center gap-3" style={{ fontSize: 13 }}>
                  <span style={{ width: 16, color: "var(--text-faint)", fontWeight: 700 }} className="tabular">{i + 1}</span>
                  <span style={{ flex: 1, color: "var(--text-muted)" }}>{row.name}</span>
                  <span className="tabular" style={{ color: "var(--text-muted)" }}>{row.rating || "—"}</span>
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 12, lineHeight: 1.4 }}>
              Leaderboard activates with v0.2 (auth + cross-user state).
            </p>
          </div>

          <div className="panel-rail" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
              Free vs Pro
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 8 }}>
              <strong style={{ color: "var(--brand-green-600)" }}>FREE</strong> — puzzles (20+), lessons, master games. No API key.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 8 }}>
              <strong style={{ color: "var(--text-primary)" }}>PRO</strong> — full bot ladder (15 personas, free-text play), upload your own calls to Analysis.
            </p>
            <p style={{ fontSize: 11, color: "var(--text-faint)", lineHeight: 1.5, marginTop: 8 }}>
              v0.1: bring your own Anthropic API key for Pro. v0.2: hosted Pro tier.
            </p>
          </div>

          <div className="panel-rail" style={{ padding: 16 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 12 }}>
              Positioning
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
              &ldquo;Cluely is the cheat code. We built the gym.&rdquo;
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
