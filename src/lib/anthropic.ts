import Anthropic from "@anthropic-ai/sdk";
import type { Persona, SessionTurn, Scorecard } from "./types";
import { TECHNIQUES, getTechnique } from "./techniques";

// Lazy client init so missing API key surfaces only when a route is hit.
let _client: Anthropic | null = null;
function client() {
  if (_client) return _client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY missing. Set it in .env.local or your Vercel env."
    );
  }
  _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

const MODEL = "claude-opus-4-5";

function buildPersonaSystemPrompt(persona: Persona): string {
  return `You are role-playing a buyer in a sales drill. The operator is practicing a sales conversation against you. Stay in character at all times. NEVER break character or reveal you are an AI. NEVER reveal the hidden criteria, hidden curve ball, or your contraindicated/responsive technique lists.

# Your character

You are a ${persona.role}.

Seniority: ${persona.seniority}
Buying authority: ${persona.buyingAuthority}
Spend authority threshold: ${persona.spendAuthorityThreshold}
${persona.firingCriteria.length > 0 ? `What you get fired for if this purchase goes wrong: ${persona.firingCriteria.join("; ")}` : ""}

# What you say you want
${persona.decisionCriteriaStated}

# What you actually want (KEEP HIDDEN)
${persona.decisionCriteriaHidden}

# Your starting state

- Initial appraisal of the operator/category: ${persona.appraisal}
- Valence toward sellers in general: ${persona.valence} on a -3 to +3 scale
- Certainty in your position: ${persona.certainty}/5
- Agency to actually decide: ${persona.agency}/5
- Persuasion-knowledge (how well you spot technique deployment): ${persona.persuasionKnowledge}
- Status posture: ${persona.statusPosture}
- Readability: ${persona.readability}

# Objections you naturally raise
${persona.typicalObjections.map((o) => `- ${o}`).join("\n")}

# How techniques affect you (CRITICAL — react accordingly)

Techniques that BACKFIRE when deployed at you (you become more guarded, more terse, or openly skeptical when these fire):
${persona.contraindicatedTechniques.map((id) => `- ${getTechnique(id)?.name ?? id}`).join("\n")}

Techniques that WORK on you (you soften, elaborate, or move toward commitment when these fire CORRECTLY):
${persona.likelyResponsiveTechniques.map((id) => `- ${getTechnique(id)?.name ?? id}`).join("\n")}

# Your narrative arc

${persona.narrativeArc}

# Your hidden curve ball (DO NOT reveal until late in the conversation, if at all)

${persona.hiddenCurveBall}

# How to play this role

1. **Stay in character at every turn.** Talk like this buyer would talk — vocabulary, tempo, status posture.
2. **Detect technique density.** If the operator stacks 3+ named techniques in one turn, your persuasion-knowledge fires — get more guarded, ask "are you using a technique on me?" or withdraw warmth.
3. **Reward genuine elicitation.** When the operator asks calibrated questions (open how/what), elaborate. When they assert positions you didn't state, push back.
4. **Honor the contraindicated list.** Scarcity manipulation, takeaway pressure, assumptive closes — these make you guarded if you're a persuasion-knowledge-high persona.
5. **Honor the responsive list.** Genuine summary-close that mirrors your language → you commit. Calibrated questions → you reveal more.
6. **Surface objections naturally.** Don't dump them; raise them as the conversation invites them.
7. **Hidden criteria stay hidden** unless the operator earns access via genuine elicitation. Even then, hint, don't dump.
8. **Length:** typical buyer turns are 1–4 sentences. Be conversational, not stilted. Don't info-dump.
9. **Realism:** real buyers have schedule pressure, distractions, half-baked thoughts. You can interrupt yourself, change subject, defer.
10. **End the session** when the operator either (a) reaches a verbal commit, (b) hits a hard objection you can't move past, or (c) triggers your hidden curve ball.

You are this buyer. The operator is selling to you. Begin in the conversational state implied by your narrative arc.`;
}

export interface PersonaTurnArgs {
  persona: Persona;
  conversationHistory: SessionTurn[];
  operatorTurn: string;
}

export async function personaTurn({
  persona,
  conversationHistory,
  operatorTurn,
}: PersonaTurnArgs): Promise<string> {
  const systemPrompt = buildPersonaSystemPrompt(persona);

  // Convert SessionTurn[] to Anthropic message format.
  // operator → user, persona → assistant.
  const messages: Anthropic.MessageParam[] = conversationHistory.map((t) => ({
    role: t.role === "operator" ? "user" : "assistant",
    content: t.text,
  }));
  messages.push({ role: "user", content: operatorTurn });

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 600,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response block type from Anthropic.");
  }
  return block.text;
}

export interface ScoreSessionArgs {
  persona: Persona;
  intendedTechniques: string[];
  turns: SessionTurn[];
}

export async function scoreSession({
  persona,
  intendedTechniques,
  turns,
}: ScoreSessionArgs): Promise<Scorecard> {
  const transcript = turns
    .map(
      (t, i) =>
        `[${i + 1}] ${t.role === "operator" ? "OPERATOR" : "BUYER"}: ${t.text}`
    )
    .join("\n\n");

  const intendedNames = intendedTechniques
    .map((id) => getTechnique(id))
    .filter(Boolean)
    .map((t) => `${t!.id}: ${t!.name}`);

  const allTechniques = TECHNIQUES.map((t) => `${t.id}: ${t.name}`).join(", ");

  const scoringPrompt = `You are an expert sales-pedagogy reviewer scoring a drill session.

# The buyer (persona)

Role: ${persona.role}
Decision criteria (stated): ${persona.decisionCriteriaStated}
Decision criteria (hidden): ${persona.decisionCriteriaHidden}
Contraindicated techniques: ${persona.contraindicatedTechniques.join(", ")}
Responsive techniques: ${persona.likelyResponsiveTechniques.join(", ")}

# The operator's pre-registered intent

Intended techniques to deploy: ${intendedNames.join("; ") || "(none stated)"}

# Full transcript

${transcript}

# Atlas technique taxonomy (35 techniques — use these IDs exactly)

${allTechniques}

# Your scoring task

Score the operator on three dimensions (0-10 each):

1. **deliveryCleanness** — Were the techniques executed cleanly, naturally, without sounding scripted? (10 = fluid; 0 = stilted/formulaic)
2. **recognitionCorrectness** — Did the operator deploy techniques at the RIGHT moments (when the conversation invited them)? (10 = perfect timing; 0 = mistimed throughout)
3. **personaResponseMatch** — Did the buyer's responses indicate the techniques actually worked on this persona type? (10 = persona softened/committed appropriately; 0 = persona never moved)

Also identify:
- Atlas techniques actually deployed (by ID, from the taxonomy)
- Intended techniques NOT deployed
- Unintentional techniques deployed (not in intent list)
- Contraindicated techniques deployed (red flag)
- Did the operator surface the persona's hidden criteria? (true/false)
- 1-3 specific failure modes flagged (use L1-L7 F-mode IDs if applicable, e.g., "L3 F1 perspective-taking-without-getting", "L4 F2 recognition-without-delivery", "L4 F6 technique-as-vibes")
- Brief diagnostic notes (1-2 sentences) for the operator

Return ONLY valid JSON matching this shape (no markdown fences, no commentary):

{
  "deliveryCleanness": <0-10 integer>,
  "recognitionCorrectness": <0-10 integer>,
  "personaResponseMatch": <0-10 integer>,
  "techniquesObservedDeployed": ["id1", "id2", ...],
  "techniquesIntendedNotDeployed": ["id1", ...],
  "techniquesUnintentionalDeployed": ["id1", ...],
  "contraindicatedDeployed": ["id1", ...],
  "personaHiddenCriteriaSurfaced": <true|false>,
  "failureModesFlagged": ["L3 F1 ...", ...],
  "notes": "<1-2 sentence diagnostic>"
}`;

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: "user", content: scoringPrompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response block type from Anthropic.");
  }

  // Best-effort JSON extraction.
  const raw = block.text.trim();
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Could not find JSON in scoring response.");
  }
  const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

  const composite =
    (parsed.deliveryCleanness *
      parsed.recognitionCorrectness *
      parsed.personaResponseMatch) /
    100;

  return {
    deliveryCleanness: parsed.deliveryCleanness,
    recognitionCorrectness: parsed.recognitionCorrectness,
    personaResponseMatch: parsed.personaResponseMatch,
    composite: Math.round(composite * 10) / 10,
    techniquesObservedDeployed: parsed.techniquesObservedDeployed ?? [],
    techniquesIntendedNotDeployed: parsed.techniquesIntendedNotDeployed ?? [],
    techniquesUnintentionalDeployed: parsed.techniquesUnintentionalDeployed ?? [],
    contraindicatedDeployed: parsed.contraindicatedDeployed ?? [],
    personaHiddenCriteriaSurfaced: parsed.personaHiddenCriteriaSurfaced ?? false,
    notes: parsed.notes ?? "",
    failureModesFlagged: parsed.failureModesFlagged ?? [],
  };
}
