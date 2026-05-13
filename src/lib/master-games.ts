// Master Games — 5 hand-authored annotated transcripts in the styles of public
// sales/negotiation figures. NOT verbatim quotes — inspired-by constructions
// that demonstrate each figure's signature technique stack.
//
// Voice: Persuasion-Max house style. Move dialogue uses character voice
// (Voss-flavored language inside a Voss game, etc.). Annotations + study
// takeaways are mechanistic and decompositional — describe what each move
// does to the recipient's appraisal state and downstream operational
// consequences. No curriculum references, no name leaks, no moral judgments.

export interface MasterMove {
  role: "operator" | "buyer";
  text: string;
  techniqueIds?: string[];
  annotation?: string;
  delta?: number;
}

export interface MasterGame {
  id: string;
  speaker: string;
  speakerStyle: string;
  opponentRole: string;
  scenario: string;
  outcome: "win" | "draw" | "loss";
  outcomeNote: string;
  openingName: string;
  openingECO: string;
  moves: MasterMove[];
  studyHint: string;
}

export const MASTER_GAMES: MasterGame[] = [
  // ─── Game 1 · Voss ────────────────────────────────────────────────
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
      { role: "buyer", text: "We need a unilateral termination right at 90 days with a 50% refund. Non-negotiable." },
      {
        role: "operator",
        text: "Unilateral termination right at 90 days with a 50% refund.",
        techniqueIds: ["mirroring"],
        annotation: "Repeats the recipient's last clause verbatim, no counter-offer, no pivot. The repetition signals nothing but attention — recipient experiences obligation to elaborate without operator imposing direction.",
        delta: 0.32,
      },
      { role: "buyer", text: "Right. We've been burned by vendors who oversell and underdeliver. We need a real out." },
      {
        role: "operator",
        text: "It sounds like you're worried about being locked into something that doesn't work.",
        techniqueIds: ["labeling"],
        annotation: "Names the underlying concern (vendor-burn risk) rather than the surface artifact (the refund clause). Recipient's appraisal state shifts from defending a position to confirming a problem.",
        delta: 0.55,
      },
      { role: "buyer", text: "Yeah. Exactly. We've had two vendors in the last 18 months where we signed long contracts and the product didn't deliver. Procurement got grilled." },
      {
        role: "operator",
        text: "How would you know in 90 days whether this is working?",
        techniqueIds: ["calibrated-question"],
        annotation: "Converts a demand into a problem the recipient must operationalize. Once exit criteria are stated, alternative structures become tractable. Recipient now has skin in the answer.",
        delta: 0.72,
      },
      { role: "buyer", text: "Honestly? Active usage above 60% across the contracted seats, and at least one named ROI win surfaced by the executive sponsor." },
      {
        role: "operator",
        text: "What if we structured it the other way — instead of a refund clause, a usage-tied ramp-down: if we're not at 60% by day 90, you cut seat count by a third with no penalty. Same protection, but procurement doesn't have to fight a refund battle.",
        techniqueIds: ["calibrated-question", "concrete-construal"],
        annotation: "Operator proposes a structural alternative that produces equivalent operator-side accountability without the refund-accounting overhead. Question form preserves recipient agency — recipient experiences the structure as their solution to evaluate, not as operator's terms.",
        delta: 0.85,
      },
      { role: "buyer", text: "Hmm. That's actually cleaner for us. Let me run it past legal but I think we can work with that." },
    ],
    studyHint: "Three moves stacked in a tight sequence: mirror → underlying-concern label → operational-criteria question. The structural reframe at move 7 is not a concession; it is a question-formed alternative that produces equivalent operator-side accountability. Recipient's appraisal moves from position-defending to problem-solving across the sequence.",
  },

  // ─── Game 2 · Klaff ────────────────────────────────────────────────
  {
    id: "klaff-001",
    speaker: "Oren Klaff (style)",
    speakerStyle: "Frame control. Intrigue ping. The prize. Break the chase dynamic.",
    opponentRole: "Senior partner at a $4B AUM family office",
    scenario: "Pitch meeting for a $25M raise. The partner runs a power-frame: drops a stack of pitch decks on the table, says 'You've got 12 minutes.'",
    outcome: "win",
    outcomeNote: "Pulled the partner across the table. Closed on a follow-up at the partner's office two days later.",
    openingName: "Challenger Open (Frame Reversal Variation)",
    openingECO: "CH2",
    moves: [
      { role: "buyer", text: "Alright, you've got 12 minutes. Walk me through it." },
      {
        role: "operator",
        text: "I'll do something better — I'll spend the first three minutes telling you the two reasons we'd be wrong for you. If at minute three you want me to keep going, I will. If not, we both save time.",
        techniqueIds: ["accusation-audit", "takeaway"],
        annotation: "Operator redefines who is qualifying whom. Recipient just imposed a time constraint to establish power posture; this move re-anchors the dynamic to fit-evaluation without contesting the time constraint itself.",
        delta: 0.68,
      },
      { role: "buyer", text: "Okay. That's a new one. Go." },
      {
        role: "operator",
        text: "Reason one: we're not the lowest-cost option in this category. If your filter is fee compression, stop me at minute four. Reason two: our holding period is 7-10 years. If you have a fund maturing in 18 months that needs deployable capital fast, I'm wasting your time.",
        techniqueIds: ["accusation-audit", "concrete-construal"],
        annotation: "Operator pre-states the two highest-probability disqualifying objections. Recipient's pattern-recognition for 'finding the catch' has nothing to do — the operator handed it over. Appraisal state shifts to evaluating fit rather than detecting concealment.",
        delta: 0.52,
      },
      { role: "buyer", text: "Fine. Our fees ARE under pressure, and we have a 2027 vehicle. But keep going." },
      {
        role: "operator",
        text: "Good — that means the next eight minutes are useful. Here's the prize: we close to new capital end of Q3. We're filling the last $40M with three LPs, two are already committed. The question isn't whether this is a good investment for you. The question is whether you make it into this vehicle or wait two years for the next.",
        techniqueIds: ["scarcity", "takeaway", "extreme-anchor"],
        annotation: "Scarcity claim becomes credible only because moves 2 and 4 established the operator is not in chase posture. Recipient absorbs the timeline as procedural fact rather than pressure tactic. Move re-anchors the decision from yes/no to now/later.",
        delta: 0.60,
      },
      { role: "buyer", text: "Who are the other two LPs?" },
      {
        role: "operator",
        text: "I can't say on a first meeting. If we go to a second, you'll be in the room with them.",
        techniqueIds: ["takeaway", "scarcity"],
        annotation: "Withholding the names preserves the curiosity gap while gating it to the next meeting. Recipient can verify the operator's claim only by progressing the relationship — naming would dissolve the asymmetry the operator just earned.",
        delta: 0.45,
      },
      { role: "buyer", text: "Okay. Send me the deck. I want my associates to look at it before we go further. Can you do a follow-up Thursday at our office?" },
    ],
    studyHint: "The scarcity move at turn 7 lands only because turns 2-5 established the operator is not in chase posture. Frame is earned across moves, not asserted in any single one. The 'prize' is structurally a non-credible move on minute one; it becomes credible on minute six because of accumulated frame-state.",
  },

  // ─── Game 3 · Belfort ──────────────────────────────────────────────
  {
    id: "belfort-001",
    speaker: "Jordan Belfort (style)",
    speakerStyle: "Straight Line · qualifying open · looping objections · tonality (not visible in text).",
    opponentRole: "Mid-market investor on a cold call",
    scenario: "Cold call into a qualified retail investor list. You have ~4 minutes before they hang up.",
    outcome: "draw",
    outcomeNote: "No close on the call but earned a follow-up appointment.",
    openingName: "Consultative Open (Qualifying Variation)",
    openingECO: "CO2",
    moves: [
      {
        role: "operator",
        text: "Hi, Robert? Jordan from [firm]. How are you today? Good. The reason for my call — I'm reaching out about a name we've been recommending to our top investors for the last few months. Now I know I'm catching you cold, so I want to ask you three quick questions to see if it makes sense to spend a few more minutes. Fair enough?",
        techniqueIds: ["accusation-audit", "calibrated-question"],
        annotation: "Operator identifies self, names the call type, and earns permission to qualify — three commitments compressed into one turn. The 'fair enough?' is a micro-commitment that converts hang-up-reflex into evaluation-reflex.",
        delta: 0.40,
      },
      { role: "buyer", text: "Look, what is this? I'm in the middle of something." },
      {
        role: "operator",
        text: "I get it, you're busy. I'll be respectful of your time. Just to ground the conversation — are you currently working with a broker, or do you make your own decisions?",
        techniqueIds: ["labeling", "calibrated-question"],
        annotation: "Operator accepts the busy-signal without contesting it and re-routes to the qualifying path. Recipient experiences acknowledgment rather than override — friction drops without operator giving up the conversation.",
        delta: 0.32,
      },
      { role: "buyer", text: "I have a broker but I also pick my own. What are you trying to sell me?" },
      {
        role: "operator",
        text: "Nothing today — I'm not asking you to buy anything on this call. What I AM doing is identifying serious investors for a name we'll be moving on in the next two to three weeks. If after our chat you tell me you're interested, I'll send you our research. If it's not for you, no problem. Sound fair?",
        techniqueIds: ["takeaway", "accusation-audit", "trial-close"],
        annotation: "Operator removes the immediate purchase frame entirely. Recipient's defensive posture has nothing to defend against — the qualification frame replaces it. Move shifts who-is-evaluating-whom asymmetry.",
        delta: 0.55,
      },
      { role: "buyer", text: "Okay. What's the name?" },
      {
        role: "operator",
        text: "Before I tell you the name, one more question — when you've made your best calls in the last few years, were those typically growth-stage names or established compounders?",
        techniqueIds: ["calibrated-question", "commitment-consistency"],
        annotation: "Operator gates the name reveal on one more qualification. The question primes the recipient's self-image as a successful investor and surfaces selection criteria the operator can connect to in the next turn.",
        delta: 0.48,
      },
      { role: "buyer", text: "I've done well in growth names. My broker has me in too many compounders for my taste." },
      {
        role: "operator",
        text: "Then this fits you. The name is [company X]. Without making you a recommendation on this call, I'd like to send you our 8-page research note. Read it over the weekend. I'll call you Monday at 10 AM, you tell me yes or no. Does that work?",
        techniqueIds: ["mutual-close-plan", "alternative-choice"],
        annotation: "Operator does not close on the security. Operator closes on the next conversation — research-note review plus a specific time-stamped follow-up. By Monday, recipient has invested time in reading, and the close is procedurally smaller.",
        delta: 0.62,
      },
      { role: "buyer", text: "Send it over. Monday's fine." },
    ],
    studyHint: "Operator never tries to close the security on this call. Every move converts a cold prospect into a scheduled prospect. The Monday-10-AM commitment is the actual close — by then, recipient has invested time in reading and the live-conversation close becomes procedurally smaller.",
  },

  // ─── Game 4 · Cardone (LOSS) ──────────────────────────────────────
  {
    id: "cardone-001",
    speaker: "Grant Cardone (style)",
    speakerStyle: "Assumption + isolation + obligation. Volume tempo. No room to stall.",
    opponentRole: "Couple on the auto floor (persuasion-knowledge high)",
    scenario: "Saturday afternoon on the lot. They've walked the lot twice. You've been with them 35 minutes. They're 'just looking.'",
    outcome: "loss",
    outcomeNote: "Couple walked. Annotated as a deliberate study of move-buyer mismatch.",
    openingName: "Anchored Open (Volume Variation)",
    openingECO: "AN2",
    moves: [
      { role: "buyer", text: "We really need to think about it. We'll come back next weekend." },
      {
        role: "operator",
        text: "What's there to think about? The car's right here, the price is fair, and you've test-driven it twice. Let's just write it up.",
        techniqueIds: ["assumptive"],
        annotation: "Move assumes deal-state that recipient has not consented to. Effective on low-persuasion-knowledge recipients in high-velocity environments. This recipient pair has explicitly named hesitation; the assumption registers as override rather than guidance.",
        delta: -0.45,
      },
      { role: "buyer", text: "We don't need anyone to write anything up. We're going to leave and think about it." },
      {
        role: "operator",
        text: "Look, I'll be honest with you — if you walk out today, the same vehicle won't be here Monday. We have three other couples interested. I'm trying to do you a favor.",
        techniqueIds: ["scarcity", "takeaway"],
        annotation: "Scarcity claim is verifiable only by counterfactual (couple would have to return Monday to test it). Recipient pattern-matches to lot-floor scripts and discounts the claim. Operator credibility takes a step down each subsequent turn.",
        delta: -0.85,
      },
      { role: "buyer", text: "If three other couples want it, sell it to them. We're leaving." },
      {
        role: "operator",
        text: "Hold on — what if I could get my manager to drop another $1,500 today only?",
        techniqueIds: ["sharp-angle", "scarcity"],
        annotation: "The same-turn price drop confirms the prior scarcity claim was bluff. Recipient now has two pieces of evidence that operator's previous statements were instrumental rather than informational. Trust is at its terminal value.",
        delta: -1.10,
      },
      { role: "buyer", text: "Now I really don't want it. Have a good weekend." },
    ],
    studyHint: "Volume-tempo close patterns are highly effective on a specific recipient profile: fast-decision, low-persuasion-knowledge, transactional. Deployed against persuasion-knowledge-high recipients, the same moves stack negative across turns — each move provides evidence that confirms recipient's existing pattern-match. Move-buyer fit determines whether the same sequence wins or loses.",
  },

  // ─── Game 5 · Burg ────────────────────────────────────────────────
  {
    id: "burg-001",
    speaker: "Bob Burg (style)",
    speakerStyle: "Five-laws value-first. Reciprocity at scale before any ask. Generous patience.",
    opponentRole: "VP at a target account, intro warm-call after a referral",
    scenario: "Warm intro from a mutual connection. The VP is open but skeptical. You have all the time in the world; the pitch isn't this conversation.",
    outcome: "win",
    outcomeNote: "No ask, no close. Earned a 30-minute follow-up two weeks out.",
    openingName: "Consultative Open (Cialdini Variation)",
    openingECO: "CI1",
    moves: [
      { role: "buyer", text: "Sarah said you wanted to chat. What's this about?" },
      {
        role: "operator",
        text: "Sarah mentioned you and your team have been thinking about [problem area] — and honestly I'm calling more to share than to sell. We've been studying it for three years and I think there are two specific patterns you'd find useful regardless of whether we ever work together.",
        techniqueIds: ["liking", "reciprocity"],
        annotation: "The 'regardless of whether we ever work together' line removes the immediate-sale frame. Recipient's defensive posture has nothing to engage. Move converts the call from pitch-evaluation to information-evaluation.",
        delta: 0.50,
      },
      { role: "buyer", text: "Okay, sure. What are the patterns?" },
      {
        role: "operator",
        text: "First — the teams that solve this fastest treat it as a sequencing problem, not a tool problem. Most teams skip the sequencing and go straight to tooling. They spend six months and end up worse off. The second pattern is who needs to be in the room when you set the sequence. I can email you a one-pager on both if you want.",
        techniqueIds: ["authority", "concrete-construal", "reciprocity"],
        annotation: "Specific falsifiable claim ('six months and worse off') paired with a no-cost artifact offer. Recipient evaluates the claim against own experience; the artifact offer is a low-friction acceptance path that converts evaluation into engagement.",
        delta: 0.65,
      },
      { role: "buyer", text: "Yeah, send it. The first one is interesting — we just bought a tool and the team is fighting over how to use it." },
      {
        role: "operator",
        text: "That's the most common failure mode. Don't worry, it's recoverable — the sequencing fix takes about two weeks if you do it right. I'll include a checklist with the one-pager. And if it'd be useful, I could spend 30 minutes with whoever owns this internally — no pitch, just helping them think through the sequence.",
        techniqueIds: ["labeling", "reciprocity", "multi-threading"],
        annotation: "Three moves compressed: validation of the recipient's just-stated problem, an additional artifact (checklist), and a no-pitch time offer that introduces a second stakeholder. Each is a small reciprocity event; cumulative effect is asymmetric obligation in operator's favor.",
        delta: 0.78,
      },
      { role: "buyer", text: "Honestly, that would be really helpful. Let me get Sandra on the line — she owns the rollout. Can we do 30 minutes next Wednesday?" },
      {
        role: "operator",
        text: "Wednesday works. I'll send you both the one-pager and the checklist before the call so we can use the 30 minutes well. Looking forward to it.",
        techniqueIds: ["mutual-close-plan", "concrete-construal"],
        annotation: "Operator locks the next interaction with specific deliverables landing before it. By Wednesday, Sandra has read the operator's material and the conversation starts inside the operator's frame rather than starting from scratch.",
        delta: 0.55,
      },
      { role: "buyer", text: "Great. Talk Wednesday." },
    ],
    studyHint: "No close attempted in eight turns. Each operator move makes a small no-strings deposit; cumulative effect is asymmetric obligation that converts into a multi-stakeholder follow-up. The conversation that asks for a commitment happens later — by then, the commitment is procedurally small relative to the reciprocity already accumulated.",
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
