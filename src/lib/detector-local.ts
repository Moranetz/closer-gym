// Local detector — pure regex/keyword pattern matching. NO API CALLS.
// Tags an operator utterance with Atlas technique IDs. Mirrors the shape of
// `detectTechniques()` in detector.ts so callers can swap implementations.
//
// Accuracy target: ~70% agreement with the LLM detector on representative input.
// That's lower than the LLM detector (~85% target) but it's free, instant, and
// runs offline — the chess.com equivalent of running Stockfish in WASM
// instead of paying for engine-as-a-service.

import type { SessionTurn } from "./types";

export interface LocalDetectResult {
  techniqueIds: string[];
  confidence: "high" | "medium" | "low";
  note?: string;
  matchedPatterns?: string[]; // for debug / training-data harvest
}

// Each rule: try to fire ID; if any pattern matches, technique is tagged.
// "weight" influences confidence — multiple matches → higher confidence.
interface DetectRule {
  id: string;
  patterns: RegExp[];
  // optional context check — fires only if the predicate over the last buyer turn holds
  contextCheck?: (recentBuyerTurn: string | null, operatorText: string) => boolean;
  weight?: number;
}

const RULES: DetectRule[] = [
  // ─── Question form ───────────────────────────────────────────────────────
  {
    id: "calibrated-question",
    patterns: [
      /^\s*(how|what|where|when|why|tell me|walk me through|help me understand|talk me through)\b[^?]+\?/i,
      /\b(how|what)\s+(does|do|did|might|would|could|are|is)\b[^?]*\?/i,
    ],
    weight: 2,
  },
  {
    id: "labeling",
    patterns: [
      /\b(it (?:seems|sounds|looks|feels) like|you'?re (?:feeling|worried|concerned|frustrated|excited|hesitant|cautious|under pressure)|sounds like you)\b/i,
      /\b(i (?:imagine|sense|hear|gather|notice) (?:that|you)|that (?:must (?:be|feel)|sounds (?:like|tough)))\b/i,
    ],
    weight: 2,
  },
  {
    id: "mirroring",
    contextCheck: (buyerTurn, operatorText) => {
      if (!buyerTurn) return false;
      // mirror = repeat 2-5 last meaningful words from buyer's previous turn at the start of operator turn
      const buyerTail = buyerTurn.trim().split(/\s+/).slice(-6).join(" ").replace(/[.,!?]/g, "").toLowerCase();
      const opStart = operatorText.trim().toLowerCase().slice(0, buyerTail.length + 4);
      if (buyerTail.length < 6) return false;
      // crude: shared 2+ word suffix from buyer is reflected at the start of operator turn
      const lastWords = buyerTurn.trim().split(/\s+/).slice(-3).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ""));
      return lastWords.length >= 2 && lastWords.every((w) => w.length > 1 && opStart.includes(w));
    },
    patterns: [],
    weight: 1,
  },
  {
    id: "accusation-audit",
    patterns: [
      /\b(i (?:know|imagine|expect) you'?re (?:probably )?(?:thinking|worried|wondering)|you (?:might|may|probably) (?:be )?(?:think|wonder)|i'?m sure you'?re (?:concerned|wondering|thinking))\b/i,
      /\b(before you (?:say|push back|object)|you'?re probably going to say)\b/i,
    ],
    weight: 2,
  },
  {
    id: "spin-implication",
    patterns: [
      /\b(what (?:does that (?:cost|mean)|happens if|are the implications|is the impact|is the downside))\b/i,
      /\b(how much (?:does|would|is|are) that (?:cost|costing|costing you|impacting))\b/i,
      /\b(if (?:that|this) (?:keeps|continues|doesn'?t change))\b/i,
    ],
    weight: 1,
  },
  {
    id: "spin-need-payoff",
    patterns: [
      /\b(how would (?:that|it) help|what would (?:that|fixing this) mean|what'?s the value)\b/i,
      /\b(if you (?:solved|fixed|had) that\b[^?]*\?)/i,
    ],
    weight: 1,
  },

  // ─── Structural close ────────────────────────────────────────────────────
  {
    id: "summary-close",
    patterns: [
      /\b(so (?:to summarize|let me make sure|what i'?m hearing)|let me play that back|to recap|here'?s what i'?m hearing)\b/i,
      /\b(based on (?:everything|what) you'?ve (?:said|told me))\b/i,
    ],
    weight: 2,
  },
  {
    id: "trial-close",
    patterns: [
      /\b(does that (?:make sense|sound right|sound like|feel like)|how (?:does|would) that sit|on a scale of)\b/i,
      /\b(if (?:we|i) (?:could|were to)\b[^?]*would you\b)/i,
    ],
    weight: 1,
  },
  {
    id: "assumptive",
    patterns: [
      /\b(when (?:we|you) (?:get started|kick off|onboard|sign|go live)|once (?:we|you) (?:start|begin|sign))\b/i,
      /\b(let'?s (?:get you|book the|set up)\b)/i,
    ],
    weight: 1,
  },
  {
    id: "alternative-choice",
    patterns: [
      /\b(would you (?:prefer|rather) (?:to )?[a-z\s,]+ or [a-z\s,]+\?)/i,
      /\b(option (?:a|1).*or option (?:b|2))/i,
    ],
    weight: 2,
  },
  {
    id: "takeaway",
    patterns: [
      /\b(maybe this isn'?t (?:the right|a fit)|i'?m not sure (?:this|we'?re) (?:is|are) (?:the right|a fit))\b/i,
      /\b(we (?:may not be|might not be) the right|honestly i don'?t think)\b/i,
    ],
    weight: 2,
  },
  {
    id: "sharp-angle",
    patterns: [
      /\b(if i (?:could|can|were to)\b[^,.?]*,?\s*(?:would|could) you\b)/i,
    ],
    weight: 1,
  },
  {
    id: "ben-franklin",
    patterns: [
      /\b(let'?s (?:list|weigh|write down)\b[^.]*(?:pros|cons|both sides))\b/i,
    ],
    weight: 1,
  },

  // ─── Framing ─────────────────────────────────────────────────────────────
  {
    id: "loss-framing",
    patterns: [
      /\b(cost of (?:doing nothing|inaction|not (?:moving|deciding))|what (?:you'?re|you'd be) losing|status quo (?:costs|is costing))\b/i,
      /\b(without (?:this|us)|if you don'?t|if nothing changes)\b/i,
      /\b(every (?:week|month|quarter) (?:you (?:wait|delay)|of (?:delay|inaction)))\b/i,
    ],
    weight: 2,
  },
  {
    id: "gain-framing",
    patterns: [
      /\b(imagine if|picture this|with (?:this|us) you (?:could|would|will))\b/i,
      /\b(you'?d (?:be able to|finally|gain))\b/i,
    ],
    weight: 1,
  },
  {
    id: "concrete-construal",
    patterns: [
      /\b(in (?:concrete|specific|practical) terms|to (?:make (?:it )?concrete|put numbers on))\b/i,
      /\b(here'?s exactly what|the specific number is|on day 1)\b/i,
    ],
    weight: 1,
  },

  // ─── Cialdini six ────────────────────────────────────────────────────────
  {
    id: "social-proof",
    patterns: [
      /\b((?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*) (?:uses|chose|signed|switched|deployed|implemented) (?:us|this|our))/, // "Stripe uses us"
      /\b((?:other|other companies|teams|peers|customers) (?:at|in|like) (?:your|that|the))\b/i,
      /\b(\d+ (?:of (?:your|the|our) peers|companies (?:like|in)|customers))\b/i,
      /\b(case stud(?:y|ies)|peer (?:reference|data))\b/i,
    ],
    weight: 1,
  },
  {
    id: "authority",
    patterns: [
      /\b(our (?:research|study|paper|peer-reviewed|published))\b/i,
      /\b(harvard|stanford|mit|the (?:wsj|economist|atlantic))\b/i,
      /\b((?:doctor|professor|former (?:CFO|CRO|VP))\s+[A-Z][a-z]+)\b/,
    ],
    weight: 1,
  },
  {
    id: "reciprocity",
    patterns: [
      /\b(i (?:put together|built|made) (?:for|just for) you|let me (?:send|share|give) you)\b/i,
      /\b(no strings attached|on (?:me|us)|complementary|complimentary)\b/i,
    ],
    weight: 1,
  },
  {
    id: "liking",
    patterns: [
      /\b(i (?:saw|noticed|read) (?:that you|your)|congrats? on (?:the|your))\b/i,
      /\b(we'?re both|i'?ve been there|i (?:totally )?(?:get|understand) (?:that|where you'?re))\b/i,
    ],
    weight: 1,
  },
  {
    id: "scarcity",
    patterns: [
      /\b(only (?:\d+|a few) (?:left|spots|slots|seats)|limited (?:to|number)|this quarter only|deadline (?:is|on))\b/i,
      /\b(if you don'?t (?:act|sign|commit) (?:by|before))\b/i,
    ],
    weight: 2,
  },
  {
    id: "commitment-consistency",
    patterns: [
      /\b(earlier you (?:said|mentioned|told me)|you (?:said|told me) (?:earlier|before) that)\b/i,
      /\b(consistent with what (?:we|you) (?:agreed|said))\b/i,
    ],
    weight: 1,
  },

  // ─── Negotiation-anchor ──────────────────────────────────────────────────
  {
    id: "extreme-anchor",
    patterns: [
      /\$\s?\d{1,3}(?:[,.]\d{3})+/,        // "$120,000"
      /\b\d{1,3}(?:[.,]\d{3})+\s?(?:dollars|usd)/i,
    ],
    weight: 1,
  },
  {
    id: "precise-anchor",
    patterns: [
      /\$\s?\d+[.,]\d{2,3}\b/,             // "$117,425" — high specificity
    ],
    weight: 1,
  },
  {
    id: "anchor-with-range",
    patterns: [
      /\$\s?\d[\d,.]*\s*[-–to]+\s*\$?\s?\d[\d,.]*/i,
      /\bbetween (?:\$|\d)/i,
    ],
    weight: 1,
  },
  {
    id: "bracketing",
    patterns: [
      /\b(would something between|somewhere in the range of)\b/i,
    ],
    weight: 1,
  },

  // ─── Post-objection ──────────────────────────────────────────────────────
  {
    id: "feel-felt-found",
    patterns: [
      /\b(i (?:understand|get) how you feel.*other.*felt.*what they found)\b/i,
      /\b(others (?:in your (?:position|role|seat)|like you) have felt)\b/i,
    ],
    weight: 2,
  },
  {
    id: "isolate-and-conquer",
    patterns: [
      /\b(is that the only (?:thing|reason|concern)|if (?:we|i) (?:resolved|fixed|handled) that, would)\b/i,
      /\b(besides (?:that|this|price|timing), is there)\b/i,
    ],
    weight: 1,
  },
  {
    id: "reverse-objection",
    patterns: [
      /\b(that'?s exactly why|that'?s precisely the reason)\b/i,
    ],
    weight: 1,
  },

  // ─── Closing environment ─────────────────────────────────────────────────
  {
    id: "mutual-close-plan",
    patterns: [
      /\b(next steps|mutual (?:close|action) plan|MAP|let'?s (?:agree on|sketch) (?:a|the) (?:timeline|plan))\b/i,
      /\b(by (?:next|this) (?:week|monday|tuesday|wednesday|thursday|friday|month|quarter))\b/i,
      /\b(i'?ll (?:send|share|put together) (?:you|the)\b)/i,
    ],
    weight: 1,
  },
  {
    id: "multi-threading",
    patterns: [
      /\b(loop in|bring (?:in|on) (?:your|the) (?:cfo|cto|cro|vp|head of))\b/i,
      /\b(who else (?:needs|should be|is) (?:involved|in the room|on the call))\b/i,
    ],
    weight: 1,
  },
];

/**
 * Run all rules against an utterance + optional context, return tagged technique IDs.
 */
export function detectLocal(
  operatorText: string,
  recentContext: SessionTurn[] = [],
): LocalDetectResult {
  const lastBuyer = [...recentContext]
    .reverse()
    .find((t) => t.role === "persona");
  const lastBuyerText = lastBuyer?.text ?? null;

  const matched: { id: string; weight: number; patternsMatched: string[] }[] = [];

  for (const rule of RULES) {
    const matchedPatterns: string[] = [];
    for (const p of rule.patterns) {
      if (p.test(operatorText)) matchedPatterns.push(p.source.slice(0, 40));
    }
    let contextMatched = false;
    if (rule.contextCheck) {
      contextMatched = rule.contextCheck(lastBuyerText, operatorText);
      if (contextMatched) matchedPatterns.push("__context__");
    }
    if (matchedPatterns.length > 0) {
      matched.push({ id: rule.id, weight: rule.weight ?? 1, patternsMatched: matchedPatterns });
    }
  }

  // Confidence heuristic: many high-weight matches → high; one weak match → low.
  const totalWeight = matched.reduce((a, m) => a + m.weight, 0);
  const confidence: "high" | "medium" | "low" =
    totalWeight >= 3 ? "high" :
    totalWeight >= 1 ? "medium" :
    "low";

  // Pure greetings / pleasantries get NO tags.
  const greeting = /^\s*(hi|hello|hey|thanks for|appreciate|good (?:morning|afternoon|evening))[\s,!.]*$/i.test(
    operatorText,
  );
  if (greeting && matched.length === 0) {
    return { techniqueIds: [], confidence: "high", note: "greeting / pleasantry" };
  }

  return {
    techniqueIds: matched.map((m) => m.id),
    confidence,
    note: matched.length === 0 ? "no patterns matched" : `${matched.length} pattern(s) matched`,
    matchedPatterns: matched.flatMap((m) => m.patternsMatched),
  };
}

/**
 * Batch detector — for retagging a transcript locally with no API cost.
 */
export function detectLocalBatch(turns: SessionTurn[]): LocalDetectResult[] {
  const results: LocalDetectResult[] = [];
  for (let i = 0; i < turns.length; i++) {
    const t = turns[i];
    if (t.role !== "operator") {
      results.push({ techniqueIds: [], confidence: "high", note: "buyer turn" });
      continue;
    }
    const context = turns.slice(Math.max(0, i - 4), i);
    results.push(detectLocal(t.text, context));
  }
  return results;
}
