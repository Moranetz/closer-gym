// Master Games — 5 hand-authored annotated transcripts in the styles of
// public sales/negotiation figures. NOT verbatim quotes — these are inspired-by
// constructions that demonstrate each figure's signature technique stack, the
// same way chess.com hosts annotated games "in the style of" classical masters.
//
// Each game is a position you can re-play move-by-move. Click any move to see
// the technique tags + heuristic eval + the master's own commentary on why
// that move worked.
//
// Eval values are computed by the same delta-mechanics heuristic as live games
// (src/lib/eval.ts) — they're deterministic, no LLM required.

export interface MasterMove {
  role: "operator" | "buyer";
  text: string;
  /** Operator-only: atlas IDs the move deploys. */
  techniqueIds?: string[];
  /** Operator-only: master's commentary on this move. */
  annotation?: string;
  /** Operator-only: eval delta in centipawn-equivalent units. */
  delta?: number;
}

export interface MasterGame {
  id: string;
  speaker: string;
  speakerStyle: string;            // 1-line technique signature
  opponentRole: string;            // who they're playing against
  scenario: string;                // 1-2 sentence context for the game
  outcome: "win" | "draw" | "loss";
  outcomeNote: string;             // 1-line outcome description
  openingName: string;             // detected opening label (matches eval.ts detectOpening)
  openingECO: string;              // ECO code for the opening
  moves: MasterMove[];             // alternating operator/buyer
  studyHint: string;               // 2-3 sentence post-study takeaway
}

export const MASTER_GAMES: MasterGame[] = [
  // ─── Game 1 · Voss — Hostage / negotiation ────────────────────────────
  {
    id: "voss-001",
    speaker: "Chris Voss (style)",
    speakerStyle: "Mirror + label + calibrated-question chain. Tactical empathy. Black Swan curveballs.",
    opponentRole: "Adversarial counterparty in a contract negotiation",
    scenario: "Late-stage deal. Counterparty has just demanded an unreasonable termination clause. The deal is in the room or it dies in the next 10 minutes.",
    outcome: "win",
    outcomeNote: "Surfaced the underlying derisk concern, swapped a 50% refund clause for a usage-tied ramp-down — both sides closer.",
    openingName: "Voss Open (Mirror Variation)",
    openingECO: "VO2",
    moves: [
      {
        role: "buyer",
        text: "We need a unilateral termination right at 90 days with a 50% refund. Non-negotiable.",
      },
      {
        role: "operator",
        text: "Unilateral termination right at 90 days with a 50% refund.",
        techniqueIds: ["mirroring"],
        annotation: "Mirror the last 8 words verbatim. Don't argue, don't pivot, don't counter-offer. The mirror is an invitation to elaborate — silence does the rest.",
        delta: 0.32,
      },
      {
        role: "buyer",
        text: "Right. We've been burned by vendors who oversell and underdeliver. We need a real out.",
      },
      {
        role: "operator",
        text: "It sounds like you're worried about being locked into something that doesn't work.",
        techniqueIds: ["labeling"],
        annotation: "Affect-label the underlying concern, not the surface demand. The 50% refund clause was the WHAT; this is the WHY. Naming it disarms it.",
        delta: 0.55,
      },
      {
        role: "buyer",
        text: "Yeah. Exactly. We've had two vendors in the last 18 months where we signed long contracts and the product didn't deliver. Procurement got grilled.",
      },
      {
        role: "operator",
        text: "How would you know in 90 days whether this is working?",
        techniqueIds: ["calibrated-question"],
        annotation: "Calibrated question that converts the demand into a problem to solve together. They have to answer with criteria — and the moment they do, you can engineer around them.",
        delta: 0.72,
      },
      {
        role: "buyer",
        text: "Honestly? Active usage above 60% across the contracted seats, and at least one named ROI win surfaced by the executive sponsor.",
      },
      {
        role: "operator",
        text: "What if we structured it the other way — instead of a refund clause, a usage-tied ramp-down: if we're not at 60% by day 90, you cut seat count by a third with no penalty. Same protection, but procurement doesn't have to fight a refund battle.",
        techniqueIds: ["calibrated-question", "concrete-construal"],
        annotation: "Reframe — and notice the question form, NOT a statement. Voss-textbook: don't deliver concessions, get them to argue for your structure. Procurement always prefers structures that don't trigger refund accounting.",
        delta: 0.85,
      },
      {
        role: "buyer",
        text: "Hmm. That's actually cleaner for us. Let me run it past legal but I think we can work with that.",
      },
    ],
    studyHint: "Three Voss textbook moves stacked in order — mirror → label → calibrated question. The killer move isn't the offer, it's the reframe disguised as a question. Voss never asks 'will you accept X' — he asks 'what if it looked like X.'",
  },

  // ─── Game 2 · Klaff — Pitch / frame control ────────────────────────────
  {
    id: "klaff-001",
    speaker: "Oren Klaff (style)",
    speakerStyle: "Frame control. Intrigue ping. The prize. Break the chase dynamic.",
    opponentRole: "Senior partner at a $4B AUM family office (status-driven)",
    scenario: "Pitch meeting for a $25M raise. The partner runs a power-frame: drops a stack of pitch decks on the table, says 'You've got 12 minutes.'",
    outcome: "win",
    outcomeNote: "Pulled the partner across the table. Closed on a follow-up at the partner's office two days later.",
    openingName: "Challenger Open (Frame Reversal Variation)",
    openingECO: "CH2",
    moves: [
      {
        role: "buyer",
        text: "Alright, you've got 12 minutes. Walk me through it.",
      },
      {
        role: "operator",
        text: "I'll do something better — I'll spend the first three minutes telling you the two reasons we'd be wrong for you. If at minute three you want me to keep going, I will. If not, we both save time.",
        techniqueIds: ["accusation-audit", "takeaway"],
        annotation: "Klaff's prize-frame: redefine who's qualifying whom. The partner just said 'you have 12 minutes' to set the power dynamic; this move re-anchors it. Notice — no asking permission. You're not 'asking if it's okay' — you're declaring how this is going to go.",
        delta: 0.68,
      },
      {
        role: "buyer",
        text: "Okay. That's a new one. Go.",
      },
      {
        role: "operator",
        text: "Reason one: we're not the lowest-cost option in this category. If your filter is fee compression, stop me at minute four. Reason two: our holding period is 7-10 years. If you have a fund maturing in 18 months that needs deployable capital fast, I'm wasting your time.",
        techniqueIds: ["accusation-audit", "concrete-construal"],
        annotation: "Pre-empt the two objections that always come up. Klaff calls this the 'anti-pitch' — by naming what's wrong with you, you destroy the buyer's frame that they need to find the catch. They can't catch you if you handed it to them.",
        delta: 0.52,
      },
      {
        role: "buyer",
        text: "Fine. Our fees ARE under pressure, and we have a 2027 vehicle. But keep going.",
      },
      {
        role: "operator",
        text: "Good — that means the next eight minutes are useful. Here's the prize: we close to new capital end of Q3. We're filling the last $40M with three LPs, two are already committed. The question isn't whether this is a good investment for you. The question is whether you make it into this vehicle or wait two years for the next.",
        techniqueIds: ["scarcity", "takeaway", "extreme-anchor"],
        annotation: "The PRIZE: invert who's pursuing. Once you've established you don't need the meeting, scarcity actually works (you have a real timeline). This is high-skill — only works after you've earned the frame. If you led with this it would read as desperate.",
        delta: 0.60,
      },
      {
        role: "buyer",
        text: "Who are the other two LPs?",
      },
      {
        role: "operator",
        text: "I can't say on a first meeting. If we go to a second, you'll be in the room with them.",
        techniqueIds: ["takeaway", "scarcity"],
        annotation: "Withholding = social proof's most powerful form. Naming the LPs would let the partner triangulate; refusing to name them while implying their caliber maintains intrigue. Klaff's 'intrigue ping' — keep one curiosity gap open until the next meeting.",
        delta: 0.45,
      },
      {
        role: "buyer",
        text: "Okay. Send me the deck. I want my associates to look at it before we go further. Can you do a follow-up Thursday at our office?",
      },
    ],
    studyHint: "Klaff doesn't break the buyer's frame — he replaces it with his own before the buyer notices. Every move pulls the meeting closer to the operator's terms. The 'prize' move (move 7) only works because moves 3-5 already established that the operator isn't desperate. Frame is earned, not asserted.",
  },

  // ─── Game 3 · Belfort — Transactional close ────────────────────────────
  {
    id: "belfort-001",
    speaker: "Jordan Belfort (style)",
    speakerStyle: "Straight Line · qualifying open · looping objections · tonality (not visible in text).",
    opponentRole: "Mid-market investor on a cold call (skeptical, time-pressed)",
    scenario: "Cold call into a qualified retail investor list. You have ~4 minutes before they hang up. The product is a real opportunity at a credible firm.",
    outcome: "draw",
    outcomeNote: "No close on the call but earned a follow-up appointment. In Belfort terms: 'qualified the prospect.'",
    openingName: "Consultative Open (Qualifying Variation)",
    openingECO: "CO2",
    moves: [
      {
        role: "operator",
        text: "Hi, Robert? Jordan from [firm]. How are you today? Good. The reason for my call — I'm reaching out about a name we've been recommending to our top investors for the last few months. Now I know I'm catching you cold, so I want to ask you three quick questions to see if it makes sense to spend a few more minutes. Fair enough?",
        techniqueIds: ["accusation-audit", "calibrated-question"],
        annotation: "Belfort's open is engineered to do three things in one breath: identify yourself (specific firm), name what this is (a recommendation), and earn permission to qualify. Note the 'fair enough?' — micro-commitment to continue the call. Without that, the next sentence dies.",
        delta: 0.40,
      },
      {
        role: "buyer",
        text: "Look, what is this? I'm in the middle of something.",
      },
      {
        role: "operator",
        text: "I get it, you're busy. I'll be respectful of your time. Just to ground the conversation — are you currently working with a broker, or do you make your own decisions?",
        techniqueIds: ["labeling", "calibrated-question"],
        annotation: "Loop back to qualifying. Don't argue with 'I'm busy' — accept it AND ask the next question. The straight-line: every objection gets acknowledged, then re-routed back to the qualification path.",
        delta: 0.32,
      },
      {
        role: "buyer",
        text: "I have a broker but I also pick my own. What are you trying to sell me?",
      },
      {
        role: "operator",
        text: "Nothing today — I'm not asking you to buy anything on this call. What I AM doing is identifying serious investors for a name we'll be moving on in the next two to three weeks. If after our chat you tell me you're interested, I'll send you our research and you can review it on your own time. If it's not for you, no problem at all. Sound fair?",
        techniqueIds: ["takeaway", "accusation-audit", "trial-close"],
        annotation: "The Belfort 'permission-to-not-buy' move. The takeaway is real — qualifying out an investor saves both sides time. But the framing also resets the power dynamic. They now want to be qualified IN. This is core Straight Line.",
        delta: 0.55,
      },
      {
        role: "buyer",
        text: "Okay. What's the name?",
      },
      {
        role: "operator",
        text: "Before I tell you the name, one more question — when you've made your best calls in the last few years, were those typically growth-stage names or established compounders?",
        techniqueIds: ["calibrated-question", "commitment-consistency"],
        annotation: "Don't pitch yet. One more qualification — and notice it's a question that primes their self-image as a successful investor. Whatever they answer, you'll connect your pitch to it. The buyer just told you HOW to sell to them.",
        delta: 0.48,
      },
      {
        role: "buyer",
        text: "I've done well in growth names. My broker has me in too many compounders for my taste.",
      },
      {
        role: "operator",
        text: "Then this fits you. The name is [company X]. Without making you a recommendation on this call, I'd like to send you our 8-page research note. Read it over the weekend. I'll call you Monday at 10 AM, you tell me yes or no. Does that work?",
        techniqueIds: ["mutual-close-plan", "alternative-choice"],
        annotation: "The Monday-at-10-AM appointment is the actual close on this call. Belfort doesn't try to sell the security here — he sells the next conversation. By the time Monday comes, the buyer has read the note, the deck is loaded, and the close is much shorter.",
        delta: 0.62,
      },
      {
        role: "buyer",
        text: "Send it over. Monday's fine.",
      },
    ],
    studyHint: "Belfort's Straight Line isn't about closing on the first call. It's about converting a cold prospect into a scheduled prospect in 90 seconds. Every move is engineered to maintain forward motion without sounding like a script — and that's the part that doesn't translate to text. The tonality (not encoded here) is half the move.",
  },

  // ─── Game 4 · Cardone — Direct close on price ──────────────────────────
  {
    id: "cardone-001",
    speaker: "Grant Cardone (style)",
    speakerStyle: "Assumption + isolation + obligation. Volume tempo. No room to stall.",
    opponentRole: "Couple on the auto floor (hostile, persuasion-knowledge high)",
    scenario: "Saturday afternoon on the lot. They've walked the lot twice. You've been with them 35 minutes. They're 'just looking.'",
    outcome: "loss",
    outcomeNote: "Couple walked. Annotated for what NOT to do — Cardone's direct style has a real failure mode.",
    openingName: "Anchored Open (Volume Variation)",
    openingECO: "AN2",
    moves: [
      {
        role: "buyer",
        text: "We really need to think about it. We'll come back next weekend.",
      },
      {
        role: "operator",
        text: "What's there to think about? The car's right here, the price is fair, and you've test-driven it twice. Let's just write it up.",
        techniqueIds: ["assumptive"],
        annotation: "The assumption + write-it-up move is Cardone-textbook for a fast-decision buyer who NEEDS the push. But persuasion-knowledge-high buyers — and this couple has very high PK — read this as exactly what it is: a script. Wrong tool for this buyer.",
        delta: -0.45,
      },
      {
        role: "buyer",
        text: "We don't need anyone to write anything up. We're going to leave and think about it.",
      },
      {
        role: "operator",
        text: "Look, I'll be honest with you — if you walk out today, the same vehicle won't be here Monday. We have three other couples interested. I'm trying to do you a favor.",
        techniqueIds: ["scarcity", "takeaway"],
        annotation: "Manufactured scarcity on persuasion-knowledge-high buyers. They've heard 'three other couples' a hundred times. The scarcity isn't real and they can feel it. Cardone's volume style assumes a high-velocity environment with credible scarcity — without it, this move backfires immediately.",
        delta: -0.85,
      },
      {
        role: "buyer",
        text: "If three other couples want it, sell it to them. We're leaving.",
      },
      {
        role: "operator",
        text: "Hold on — what if I could get my manager to drop another $1,500 today only?",
        techniqueIds: ["sharp-angle", "scarcity"],
        annotation: "The price-drop-under-pressure move trains the buyer that you'll always give more if they push back. Worse: it confirms the prior scarcity was a bluff. This buyer pair is now certain you've been running a script. Trust is at zero.",
        delta: -1.10,
      },
      {
        role: "buyer",
        text: "Now I really don't want it. Have a good weekend.",
      },
    ],
    studyHint: "Annotated as a LOSS, not a win. Cardone's volume-tempo close is highly effective on a specific buyer type — fast-decision, low-PK, transactional. Deploy it on a persuasion-knowledge-high couple and every move that should compound stacks negative. The lesson: technique-buyer-fit is the single largest determinant of whether 'good moves' work. The same moves against the wrong buyer ARE the blunders.",
  },

  // ─── Game 5 · Burg — Value-first cold open ─────────────────────────────
  {
    id: "burg-001",
    speaker: "Bob Burg (style)",
    speakerStyle: "Five-laws value-first. Reciprocity at scale before any ask. Generous patience.",
    opponentRole: "VP at a target account, intro warm-call after a referral",
    scenario: "Warm intro from a mutual connection. The VP is open but skeptical. You have all the time in the world; the pitch isn't this conversation.",
    outcome: "win",
    outcomeNote: "No ask, no close. Earned a 30-minute follow-up two weeks out. Burg's whole game.",
    openingName: "Consultative Open (Cialdini Variation)",
    openingECO: "CI1",
    moves: [
      {
        role: "buyer",
        text: "Sarah said you wanted to chat. What's this about?",
      },
      {
        role: "operator",
        text: "Sarah mentioned you and your team have been thinking about [problem area] — and honestly I'm calling more to share than to sell. We've been studying it for three years and I think there are two specific patterns you'd find useful regardless of whether we ever work together.",
        techniqueIds: ["liking", "reciprocity"],
        annotation: "Burg's signature: lead with value, not need. Notice 'regardless of whether we ever work together' — the actual liberation move. It signals you're not in pursuit. Most people lower their guard the moment they're certain they're not being sold to.",
        delta: 0.50,
      },
      {
        role: "buyer",
        text: "Okay, sure. What are the patterns?",
      },
      {
        role: "operator",
        text: "First — the teams that solve this fastest treat it as a sequencing problem, not a tool problem. Most teams skip the sequencing and go straight to tooling. They spend six months and end up worse off. The second pattern is who needs to be in the room when you set the sequence. I can email you a one-pager on both if you want.",
        techniqueIds: ["authority", "concrete-construal", "reciprocity"],
        annotation: "Specific, falsifiable claim ('six months and end up worse off') + an offer of value with no strings ('email you a one-pager'). The one-pager is the reciprocity gift — the VP can either take it and feel mild obligation, or decline and feel mildly impolite. Both outcomes are good for you.",
        delta: 0.65,
      },
      {
        role: "buyer",
        text: "Yeah, send it. The first one is interesting — we just bought a tool and the team is fighting over how to use it.",
      },
      {
        role: "operator",
        text: "That's the most common failure mode. Don't worry, it's recoverable — the sequencing fix takes about two weeks if you do it right. I'll include a checklist with the one-pager. And if it'd be useful, I could spend 30 minutes with whoever owns this internally — no pitch, just helping them think through the sequence.",
        techniqueIds: ["labeling", "reciprocity", "multi-threading"],
        annotation: "Two reciprocity moves in one breath — the checklist AND the offer of free time. AND a multi-threading move (identify who owns this internally, ask for an intro). Burg's law of compensation: the more you give before asking, the more the ask itself feels like a relief, not an imposition.",
        delta: 0.78,
      },
      {
        role: "buyer",
        text: "Honestly, that would be really helpful. Let me get Sandra on the line — she owns the rollout. Can we do 30 minutes next Wednesday?",
      },
      {
        role: "operator",
        text: "Wednesday works. I'll send you both the one-pager and the checklist before the call so we can use the 30 minutes well. Looking forward to it.",
        techniqueIds: ["mutual-close-plan", "concrete-construal"],
        annotation: "Lock the plan with specific deliverables before the call. Burg never closes — he configures the next thing of value. By Wednesday, Sandra knows you, has read your material, and frames the conversation around your sequencing model. The 'sale' happens long before the conversation that asks for it.",
        delta: 0.55,
      },
      {
        role: "buyer",
        text: "Great. Talk Wednesday.",
      },
    ],
    studyHint: "Burg's style looks easy and isn't. Two reciprocity moves before any ask, two pieces of free value before any meeting, an explicit liberation ('regardless of whether we ever work together'). The hard part is the patience — most operators fold and ask within the first five turns. Burg never folds. The ask happens after the seventh or eighth piece of value, by which point it isn't really an ask.",
  },
];

export function getMasterGame(id: string): MasterGame | undefined {
  return MASTER_GAMES.find((g) => g.id === id);
}

/**
 * Running eval per move — useful for the curve chart.
 * Starts at 0, accumulates operator deltas. Buyer turns hold the prior value.
 */
export function computeMasterCurve(game: MasterGame): { turnIndex: number; value: number; role: string }[] {
  let v = 0;
  return game.moves.map((m, i) => {
    if (m.role === "operator" && typeof m.delta === "number") v += m.delta;
    return { turnIndex: i, value: v, role: m.role };
  });
}
