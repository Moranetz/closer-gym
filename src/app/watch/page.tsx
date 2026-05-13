import Link from "next/link";

const MASTERS = [
  { name: "Chris Voss",       focus: "Hostage / negotiation",    games: 9,  signature: "Mirror + calibrated question + tactical empathy" },
  { name: "Oren Klaff",       focus: "Pitch / status framing",   games: 7,  signature: "Frame control, intrigue ping, the prize" },
  { name: "Jordan Belfort",   focus: "Transactional close",      games: 6,  signature: "Straight-line · loop close · tonality" },
  { name: "Grant Cardone",    focus: "Volume / direct close",    games: 8,  signature: "Assumption + isolate + assumptive" },
  { name: "Bob Burg",         focus: "Five-laws / value-first",  games: 5,  signature: "Reciprocity at scale, gift before ask" },
  { name: "Stu Heinecke",     focus: "Contact-marketing",        games: 4,  signature: "Pattern interrupt, calculated novelty" },
];

export default function Watch() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Watch · Master Games</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Annotated transcripts · click any move for engine eval</p>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
        Six speakers, 39 games. Each move is detector-tagged with Atlas techniques and engine-scored. Annotated by{" "}
        <Link href="https://github.com/Moranetz/sales-instrument" style={{ color: "var(--brand-green-600)" }} target="_blank" rel="noopener noreferrer">
          sales-instrument
        </Link>.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {MASTERS.map((m) => (
          <Link key={m.name} href="/watch" className="bot-card">
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{m.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">{m.focus}</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.5 }}>
              {m.signature}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 700 }} className="tabular">
              {m.games} games · v0.2
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.55, maxWidth: 720 }}>
        Master Games surface is scaffolded in v0.1; full game archive with click-through annotations rolls out with v0.2.
      </p>
    </div>
  );
}
