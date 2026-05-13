import { notFound } from "next/navigation";
import { getPersona, TRACK_LABEL } from "@/lib/personas";
import { TECHNIQUES } from "@/lib/techniques";
import { getBot } from "@/lib/persona-elo";
import SessionClient from "./SessionClient";

interface Params {
  params: Promise<{ personaId: string; sessionId: string }>;
}

export default async function SessionPage({ params }: Params) {
  const { personaId, sessionId } = await params;
  const persona = getPersona(personaId);
  if (!persona) notFound();
  const bot = getBot(personaId);
  if (!bot) notFound();

  const techniqueIndex = Object.fromEntries(
    TECHNIQUES.map((t) => [t.id, { name: t.name, cluster: t.cluster }]),
  );

  return (
    <SessionClient
      sessionId={sessionId}
      personaId={personaId}
      personaRole={persona.role}
      personaTrack={persona.track}
      personaTrackLabel={TRACK_LABEL[persona.track]}
      personaSpec={persona}
      botRating={bot.rating}
      botTagline={bot.oneLineTagline}
      techniqueIndex={techniqueIndex}
    />
  );
}
