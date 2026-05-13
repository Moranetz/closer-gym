// Detector — per-utterance Atlas technique tagger.
// Server-side only (Anthropic API). Called from the /api/detect route.
//
// Input: { operatorText: string, recentContext: SessionTurn[] }
// Output: { techniqueIds: string[], confidence: "high" | "medium" | "low", note?: string }

import Anthropic from "@anthropic-ai/sdk";
import { TECHNIQUES } from "./techniques";
import type { SessionTurn } from "./types";

let _client: Anthropic | null = null;
function client() {
  if (_client) return _client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY missing.");
  }
  _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

// Haiku-tier for speed/cost on per-turn detection.
// Falls back to opus if user explicitly wants the deeper read in /api/detect?model=opus.
const FAST_MODEL = "claude-haiku-4-5-20251001";
const DEEP_MODEL = "claude-opus-4-5";

const ATLAS_INVENTORY = TECHNIQUES.map(
  (t) => `- ${t.id}: ${t.name} — ${t.mechanism.split(";")[0]}`,
).join("\n");

const SYSTEM_PROMPT = `You are an expert sales-pedagogy reviewer. Your job is to identify which Atlas-taxonomy techniques (if any) a sales operator deployed in a single utterance.

# The Atlas inventory (35 techniques)

${ATLAS_INVENTORY}

# How to tag

1. Read the operator's utterance carefully in context of the recent conversation.
2. Identify zero, one, or more Atlas IDs that match what the operator actually did. Be conservative: only tag a technique if the verbal behavior matches the mechanism.
3. A "calibrated-question" is open-ended how/what/walk-me-through — not yes/no.
4. "Labeling" requires explicit naming of the buyer's emotion or state ("it seems like...", "it sounds like...").
5. "Mirroring" requires near-verbatim echo of the buyer's last 1-5 words.
6. "Summary-close" requires explicit summary of what was agreed; without that it's just a paraphrase, not a close.
7. "Loss-framing" requires naming what is lost (status quo cost, missed opportunity).
8. Multiple techniques can fire in one utterance. Stack 3+ → flag in the note.
9. Pure greetings / pleasantries / clarifying questions get NO tags. Don't over-tag.

# Confidence

- "high" — clear textbook match
- "medium" — plausible but the utterance could be read otherwise
- "low" — ambiguous, would not survive a peer review

# Output

Return ONLY valid JSON in this exact shape (no markdown fences, no prose):

{"techniqueIds": ["id1", "id2"], "confidence": "high" | "medium" | "low", "note": "<optional 1-sentence diagnostic>"}

If no technique fired, return {"techniqueIds": [], "confidence": "high", "note": "neutral utterance"}.`;

export interface DetectOptions {
  operatorText: string;
  recentContext?: SessionTurn[]; // last 3-5 turns for context
  deep?: boolean;
}

export interface DetectResult {
  techniqueIds: string[];
  confidence: "high" | "medium" | "low";
  note?: string;
}

export async function detectTechniques(opts: DetectOptions): Promise<DetectResult> {
  const { operatorText, recentContext = [], deep = false } = opts;

  const contextBlock = recentContext.length
    ? `# Recent conversation (most recent last)\n\n${recentContext
        .map((t) => `${t.role === "operator" ? "OPERATOR" : "BUYER"}: ${t.text}`)
        .join("\n\n")}\n\n`
    : "";

  const userMessage = `${contextBlock}# Operator's utterance to tag

${operatorText}

Return the JSON tag now.`;

  const response = await client().messages.create({
    model: deep ? DEEP_MODEL : FAST_MODEL,
    max_tokens: 250,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },  // taxonomy block stays cached across calls
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response block type from detector.");
  }
  const raw = block.text.trim();
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    return { techniqueIds: [], confidence: "low", note: "detector returned no JSON" };
  }
  try {
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    return {
      techniqueIds: Array.isArray(parsed.techniqueIds) ? parsed.techniqueIds : [],
      confidence: parsed.confidence ?? "medium",
      note: parsed.note,
    };
  } catch {
    return { techniqueIds: [], confidence: "low", note: "detector JSON parse error" };
  }
}

/**
 * Batch detector — used post-game for re-tagging an entire transcript with the deep model.
 * Replaces per-turn fast tags with deep tags, then the eval curve is recomputed.
 */
export async function detectTranscript(
  turns: SessionTurn[],
  windowSize = 4,
): Promise<DetectResult[]> {
  const results: DetectResult[] = [];
  for (let i = 0; i < turns.length; i++) {
    const t = turns[i];
    if (t.role !== "operator") {
      results.push({ techniqueIds: [], confidence: "high", note: "buyer turn" });
      continue;
    }
    const context = turns.slice(Math.max(0, i - windowSize), i);
    const r = await detectTechniques({
      operatorText: t.text,
      recentContext: context,
      deep: true,
    });
    results.push(r);
  }
  return results;
}
