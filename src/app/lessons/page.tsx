import Link from "next/link";

const LESSON_TRACKS = [
  {
    name: "Beginner's Repertoire",
    description: "The five openings every closer needs. ECO codes CO1 through CH1.",
    lessons: 5,
  },
  {
    name: "Tactical Patterns",
    description: "All 40 Atlas techniques as one lesson each. Concept → 2 master-game examples → 3 puzzles → 1 sparring round.",
    lessons: 40,
  },
  {
    name: "Defense — objection handling",
    description: "How to play losing positions well. Resignation analytics. Stall detection. Recovery patterns.",
    lessons: 12,
  },
  {
    name: "Endgame Mastery",
    description: "Closes. Forced sequences. Multi-stakeholder MAP construction. Procurement gauntlet.",
    lessons: 14,
  },
  {
    name: "Strategy — long sales cycles",
    description: "Multi-threading. Champion installation. Mutual close plans. Stage-6 transfer.",
    lessons: 8,
  },
];

export default function Lessons() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Lessons</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Curriculum trees · concept → examples → puzzles → sparring → unlock
        </p>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 720, lineHeight: 1.55 }}>
        Built from the{" "}
        <Link href="https://github.com/Moranetz/closer-curriculum" style={{ color: "var(--brand-green-600)" }} target="_blank" rel="noopener noreferrer">
          closer-curriculum
        </Link>{" "}
        — 107 pedagogy files repackaged as interactive lesson trees. Each lesson takes 8–15 minutes and unlocks the next.
      </p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {LESSON_TRACKS.map((track) => (
          <div key={track.name} className="bot-card">
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{track.name}</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{track.description}</p>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
                {track.lessons} lessons
              </span>
              <Link href="/lessons" className="btn btn-secondary" style={{ height: 32, fontSize: 12 }}>
                Start · v0.2
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.55, maxWidth: 720 }}>
        Lessons surface is scaffolded in v0.1; full lesson tree with checkpoint puzzles rolls out with v0.2.
      </p>
    </div>
  );
}
