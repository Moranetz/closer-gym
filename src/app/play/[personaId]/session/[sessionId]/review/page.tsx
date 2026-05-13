import { notFound } from "next/navigation";
import { getPersona, TRACK_LABEL } from "@/lib/personas";
import { TECHNIQUES } from "@/lib/techniques";
import { getBot } from "@/lib/persona-elo";
import ReviewClient from "./ReviewClient";

interface Params {
  params: Promise<{ personaId: string; sessionId: string }>;
}

export default async function ReviewPage({ params }: Params) {
  const { personaId, sessionId } = await params;
  const persona = getPersona(personaId);
  if (!persona) notFound();
  const bot = getBot(personaId);
  if (!bot) notFound();

  return (
    <ReviewClient
      sessionId={sessionId}
      personaId={personaId}
      personaRole={persona.role}
      personaTrack={persona.track}
      personaTrackLabel={TRACK_LABEL[persona.track]}
      personaSpec={persona}
      botRating={bot.rating}
      personaCriteriaHidden={persona.decisionCriteriaHidden}
      personaHiddenCurveBall={persona.hiddenCurveBall}
      contraindicated={persona.contraindicatedTechniques}
      responsive={persona.likelyResponsiveTechniques}
      techniqueIndex={Object.fromEntries(
        TECHNIQUES.map((t) => [t.id, t.name]),
      )}
    />
  );
}
