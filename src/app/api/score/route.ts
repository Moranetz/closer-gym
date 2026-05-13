import { NextResponse } from "next/server";
import { scoreSession } from "@/lib/anthropic";
import { getPersona } from "@/lib/personas";
import type { SessionTurn } from "@/lib/types";

export const runtime = "nodejs";
// Scoring can take a few seconds.
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const personaId: string | undefined = body.personaId;
    const intendedTechniques: string[] = body.intendedTechniques ?? [];
    const turns: SessionTurn[] = body.turns ?? [];

    if (!personaId) {
      return NextResponse.json(
        { error: "personaId is required" },
        { status: 400 }
      );
    }
    const persona = getPersona(personaId);
    if (!persona) {
      return NextResponse.json(
        { error: `Unknown personaId: ${personaId}` },
        { status: 404 }
      );
    }

    const scorecard = await scoreSession({
      persona,
      intendedTechniques,
      turns,
    });

    return NextResponse.json({ scorecard });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
