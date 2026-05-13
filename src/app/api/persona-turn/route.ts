import { NextResponse } from "next/server";
import { personaTurn } from "@/lib/anthropic";
import { getPersona } from "@/lib/personas";
import type { SessionTurn } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const personaId: string | undefined = body.personaId;
    const conversationHistory: SessionTurn[] = body.conversationHistory ?? [];
    const operatorTurn: string | undefined = body.operatorTurn;

    if (!personaId || !operatorTurn) {
      return NextResponse.json(
        { error: "personaId and operatorTurn are required" },
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

    const text = await personaTurn({
      persona,
      conversationHistory,
      operatorTurn,
    });

    return NextResponse.json({ text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
