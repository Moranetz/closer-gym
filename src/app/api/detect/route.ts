import { NextResponse } from "next/server";
import { detectTechniques } from "@/lib/detector";
import type { SessionTurn } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const operatorText: string | undefined = body.operatorText;
    const recentContext: SessionTurn[] = body.recentContext ?? [];
    const deep: boolean = Boolean(body.deep);

    if (!operatorText) {
      return NextResponse.json(
        { error: "operatorText is required" },
        { status: 400 },
      );
    }

    const result = await detectTechniques({ operatorText, recentContext, deep });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
