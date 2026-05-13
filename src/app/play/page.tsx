import Link from "next/link";
import { BOTS, isBotUnlocked } from "@/lib/persona-elo";
import { getPersona, TRACK_LABEL } from "@/lib/personas";
import { titleForRating, ELO_BANDS } from "@/lib/tokens";

// Initial player rating is the provisional 1200. Until auth + persistent storage is wired,
// the picker treats everyone as Patzer-tier. Bots within +200 ELO are unlocked.
const PROVISIONAL_RATING = 1200;

interface PlayPageProps {
  searchParams: Promise<{ tc?: string }>;
}

export default async function PlayPage({ searchParams }: PlayPageProps) {
  const params = await searchParams;
  const tc = params.tc ?? "rapid";

  // Bucket bots by tier for the chess.com "Beginner / Intermediate / Advanced" tabs.
  const tiers = [
    { name: "Beginner",     min: 1200, max: 1499 },
    { name: "Intermediate", min: 1500, max: 1799 },
    { name: "Advanced",     min: 1800, max: 2099 },
    { name: "Expert",       min: 2100, max: 2299 },
    { name: "Grandmaster",  min: 2300, max: 2999 },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" }}>
      <div className="flex items-baseline gap-4 mb-3">
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Play Computer</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          15 adversarial buyer bots · ELO {ELO_BANDS.D.min}–{ELO_BANDS.GM.min}
        </p>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, maxWidth: 720, lineHeight: 1.5 }}>
        Each bot is a schema-tagged buyer persona — known contraindicated and responsive Atlas techniques, hidden decision criteria, a narrative arc, a curve ball. Beat tier N to fully unlock tier N+1.
      </p>

      {/* Time control selector — chess.com pattern */}
      <div className="flex gap-2 mb-8">
        {[
          { id: "bullet",    label: "Bullet · 5 min" },
          { id: "rapid",     label: "Rapid · 15 min" },
          { id: "classical", label: "Classical · 45 min" },
        ].map((opt) => (
          <Link
            key={opt.id}
            href={`/play?tc=${opt.id}`}
            className={`btn ${tc === opt.id ? "btn-primary" : "btn-secondary"}`}
            style={{ height: 36 }}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {tiers.map((tier) => {
        const inTier = BOTS.filter((b) => b.rating >= tier.min && b.rating <= tier.max);
        if (inTier.length === 0) return null;
        return (
          <section key={tier.name} style={{ marginBottom: 36 }}>
            <div className="flex items-baseline justify-between mb-3" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
                {tier.name}
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }} className="tabular">
                ELO {tier.min}–{tier.max}
              </p>
            </div>

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {inTier.map((bot) => {
                const persona = getPersona(bot.personaId);
                if (!persona) return null;
                const unlocked = isBotUnlocked(bot, PROVISIONAL_RATING);
                const title = titleForRating(bot.rating);
                const cardClass = `bot-card ${unlocked ? "" : "locked"}`;
                const initials = persona.role.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

                const inner = (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="player-avatar" style={{ width: 40, height: 40 }}>{initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`title-badge ${title.tier}`} style={{ fontSize: 9 }}>{title.label.replace(" Closer", "")}</span>
                          <span className="tabular" style={{ fontSize: 14, fontWeight: 700 }}>{bot.rating}</span>
                          {!unlocked && (
                            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-faint)" }}>🔒</span>
                          )}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }} className="elide">
                          {persona.role.split(" at ")[0]}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }} className="elide">
                          Track {persona.track.slice(1)} · {TRACK_LABEL[persona.track]}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {bot.oneLineTagline}
                    </p>
                    <div className="flex items-center gap-2" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
                      <span>PK · {persona.persuasionKnowledge}</span>
                      <span>·</span>
                      <span>Valence {persona.valence >= 0 ? "+" : ""}{persona.valence}</span>
                      <span>·</span>
                      <span>{persona.readability} readability</span>
                    </div>
                  </>
                );

                return unlocked ? (
                  <Link key={bot.personaId} href={`/play/${bot.personaId}?tc=${tc}`} className={cardClass}>
                    {inner}
                  </Link>
                ) : (
                  <div key={bot.personaId} className={cardClass}>
                    {inner}
                    <p style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center", marginTop: 4 }}>
                      Reach {bot.rating - 200} to unlock
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
