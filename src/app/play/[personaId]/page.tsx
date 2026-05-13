import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersona, TRACK_LABEL } from "@/lib/personas";
import { TECHNIQUES, FOLKLORE_RISK_LABEL, ATLAS_VERDICT_LABEL } from "@/lib/techniques";
import { getBot } from "@/lib/persona-elo";
import { titleForRating, TIME_CONTROLS } from "@/lib/tokens";
import DrillStartForm from "./DrillStartForm";

interface Params {
  params: Promise<{ personaId: string }>;
  searchParams: Promise<{ tc?: string }>;
}

export default async function PlaySetup({ params, searchParams }: Params) {
  const { personaId } = await params;
  const { tc } = await searchParams;
  const persona = getPersona(personaId);
  if (!persona) notFound();
  const bot = getBot(personaId);
  if (!bot) notFound();

  const tcMeta = TIME_CONTROLS.find((t) => t.id === tc) ?? TIME_CONTROLS[1];
  const title = titleForRating(bot.rating);
  const initials = persona.role.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const responsive = persona.likelyResponsiveTechniques
    .map((id) => TECHNIQUES.find((t) => t.id === id))
    .filter(Boolean);

  const contraindicated = persona.contraindicatedTechniques
    .map((id) => TECHNIQUES.find((t) => t.id === id))
    .filter(Boolean);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 64px" }}>
      <Link href="/play" style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Bot ladder
      </Link>

      {/* Bot card header */}
      <div className="panel" style={{ padding: 24, marginBottom: 24 }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="player-avatar" style={{ width: 64, height: 64, fontSize: 22 }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`title-badge ${title.tier}`}>{title.label.replace(" Closer", "")}</span>
              <span className="tabular" style={{ fontSize: 16, fontWeight: 700 }}>{bot.rating}</span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                · Track {persona.track.slice(1)} · {TRACK_LABEL[persona.track]}
              </span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
              {persona.role}
            </h1>
          </div>
        </div>

        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 16 }}>
          {bot.oneLineTagline}
        </p>

        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 4 }}>
          <Stat label="Persuasion-knowledge" value={persona.persuasionKnowledge} />
          <Stat label="Valence" value={`${persona.valence >= 0 ? "+" : ""}${persona.valence} / ±3`} />
          <Stat label="Readability" value={persona.readability} />
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 24 }}>
        <div className="tile" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
            Time control
          </p>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tcMeta.label} · {tcMeta.seconds / 60} min</div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            {tcMeta.description}
          </p>
        </div>
        <div className="tile" style={{ padding: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
            Stated criteria
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {persona.decisionCriteriaStated}
          </p>
        </div>
      </div>

      <div className="tile" style={{ padding: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8 }}>
          Objections you should expect
        </p>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {persona.typicalObjections.map((o, i) => (
            <li key={i} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "4px 10px", borderRadius: 2, background: "var(--bg-rail)", border: "1px solid var(--border)" }}>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 32 }}>
        <div className="tile" style={{ padding: 16, borderColor: "rgba(164,38,44,0.4)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--danger)", fontWeight: 700, marginBottom: 8 }}>
            Contraindicated · don&apos;t use
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {contraindicated.map((t) => <li key={t!.id}>· {t!.name}</li>)}
          </ul>
        </div>
        <div className="tile" style={{ padding: 16, borderColor: "rgba(129,182,76,0.4)" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-green-600)", fontWeight: 700, marginBottom: 8 }}>
            Responsive · works if delivered well
          </p>
          <ul style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {responsive.map((t) => <li key={t!.id}>· {t!.name}</li>)}
          </ul>
        </div>
      </div>

      <DrillStartForm
        personaId={persona.id}
        techniques={TECHNIQUES.map((t) => ({
          id: t.id,
          name: t.name,
          cluster: t.cluster,
          atlasVerdict: t.atlasVerdict,
          folkloreRisk: t.folkloreRisk,
          verdictLabel: ATLAS_VERDICT_LABEL[t.atlasVerdict],
          riskLabel: FOLKLORE_RISK_LABEL[t.folkloreRisk],
        }))}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg-rail)", borderRadius: 3, padding: "10px 12px", border: "1px solid var(--border)" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
    </div>
  );
}
