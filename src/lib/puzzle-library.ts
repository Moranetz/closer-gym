// 20 hand-authored puzzle positions. Each is a real common position from the
// closer-curriculum + Atlas literature.
//
// Candidates are compressed tactical descriptions — chess-notation style. The
// puzzle question is "which move type fits this position", not "which exact
// English sentence sounds best." Authored dialogue introduces simulation tells;
// notation removes that surface entirely and tests the actual cognitive skill.
//
// Each puzzle points to a real sourced transcript (transcripts.ts) so the user
// can tap "Read Full Transcript" post-solve to see how the move type plays out
// in a recognized practitioner's actual conversation.
//
// Convention:
//   - bestIndex 0 is the canonical highest-delta move
//   - 1 is plausible defer (accepts recipient frame as-is)
//   - 2 is lateral / asymmetric-work move
//   - 3 is premature-concession / pre-position move
// PuzzleSolver shuffles display order deterministically by puzzle.id.

import type { Puzzle } from "./puzzles";

export const PUZZLES: Puzzle[] = [
  // ─── Budget (4) ────────────────────────────────────────────────────────
  {
    id: "p001", theme: "budget", difficulty: 1300,
    buyerRole: "VP Operations, mid-market SaaS",
    setup: "Eighteen minutes into discovery. You've established the onboarding-churn problem. Buyer just heard pricing.",
    buyerLine: "It's just not in the FY26 envelope. We'd have to pull from training or shift the hire freeze around, and neither one's going to fly with the board.",
    candidates: [
      { text: "Test the underlying constraint. Branch budget-as-policy from budget-as-priority based on which lever the recipient names.", eval: 0.7, rationale: "Operator routes the objection into two operational paths the recipient just surfaced. Recipient appraisal shifts from defending a position to identifying which lever is the real ceiling.", atlasTags: ["calibrated-question"] },
      { text: "Accept the defer. Schedule a Q1 placeholder.", eval: -0.5, rationale: "Accepts the recipient-supplied frame as-is. No new information surfaced. Probability of repeat hold-pattern compounds across each accepted defer.", atlasTags: [] },
      { text: "Offer an asymmetric-work artifact (cost-of-current-state doc). Embed implicit re-engagement frame.", eval: -0.7, rationale: "Pairs reciprocity gift with embedded re-engagement. Operator absorbs work; recipient absorbs artifact. Lateral move, not vertical.", atlasTags: ["reciprocity", "loss-framing"] },
      { text: "Pre-position price elasticity. Hand the recipient the framing pen on the number.", eval: -1.1, rationale: "Operator surfaces price flexibility before recipient asks. Downstream: future budget conversations lengthen; procurement absorbs as calibration point.", atlasTags: ["scarcity", "sharp-angle"] },
    ],
    bestIndex: 0,
    themeHint: "Budget-as-policy and budget-as-priority require different responses. Most reps treat both as price.",
    transcriptId: "voss-haiti-how",
  },

  {
    id: "p002", theme: "budget", difficulty: 1600,
    buyerRole: "CFO, $200M revenue SaaS",
    setup: "Fourth meeting. Champion VP-Eng on the call. Value mapped at $1.2M last week. CFO just joined.",
    buyerLine: "I need a payback number I can defend to the board. Anything past 14 months and I'm not pushing this up. What's your math?",
    candidates: [
      { text: "Anchor a named-peer payback number at high specificity. Branch buyer's math vs peer's math.", eval: 0.9, rationale: "Named-peer specificity pre-empts generic-stat dismissal. Branch offer routes toward the higher-effort path while making the lower-effort path available. Recipient shifts from evaluating cost to evaluating method.", atlasTags: ["social-proof", "calibrated-question"] },
      { text: "Defer to a generic stat plus an artifact promise after the call.", eval: -0.3, rationale: "No defensible board number surfaced in the live moment. CFO appraisal stays in uncertainty range.", atlasTags: [] },
      { text: "Absorb custom-model authoring work. Promise return by end of week.", eval: -0.5, rationale: "Asymmetric work transferred to operator. Recipient deferred to artifact-pending state. Live-moment energy dissipates; champion has to re-mobilize urgency.", atlasTags: [] },
      { text: "Ask the recipient to name the payback ceiling. Work backward from it.", eval: -1.1, rationale: "Operator hands the framing pen to the recipient. Whatever number the CFO names becomes the ceiling. Pre-positions a downstream concession unasked.", atlasTags: [] },
    ],
    bestIndex: 0,
    themeHint: "On prestige-driven C-level, named-peer specificity outperforms generic stats. The branch offer doubles as a recipient-agency move.",
    transcriptId: "tracy-money-reframe",
  },

  {
    id: "p003", theme: "procurement", difficulty: 1800,
    buyerRole: "Procurement specialist, F500",
    setup: "First procurement call after business team agreed in principle. Procurement specialist has very high persuasion-knowledge.",
    buyerLine: "Our procurement guidelines flag anything above 12% premium versus the next bid. You're at 15. Either we close the delta or this goes to a re-bid process I can't accelerate.",
    candidates: [
      { text: "Re-frame the contest to scope match. Question SOW alignment before discussing the delta.", eval: 0.6, rationale: "Re-frames from list price to scope match. Procurement professionals respect comparison-rigor framing because it's their daily operating mode.", atlasTags: ["calibrated-question"] },
      { text: "Match the price. Conditional close on signing today.", eval: -0.2, rationale: "Concession with conditional close. Signals price is flexible from move 1. Recipient stores the move as a calibration point.", atlasTags: ["sharp-angle"] },
      { text: "Absorb the re-pricing work internally. Return with a revised package tomorrow.", eval: -0.6, rationale: "Operator absorbs asymmetric work without surfacing the scope question. Returns to the same 12% benchmark with less leverage.", atlasTags: [] },
      { text: "Pre-emptive best-and-final. Burn own anchor in the first turn.", eval: -1.2, rationale: "Procurement specialists are trained to push when this pattern fires. Operator has surrendered the negotiation's starting position.", atlasTags: [] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "klaff-time-reversal",
  },

  {
    id: "p004", theme: "budget", difficulty: 1500,
    buyerRole: "Founder, Series A startup",
    setup: "Cash-conscious founder, real burn-rate constraints, also genuinely interested. Twenty-eight minutes in.",
    buyerLine: "Real talk, we're burning $310K a month and can't push the round. $30K is what I have. If your product isn't a $30K product, we'll find a workaround.",
    candidates: [
      { text: "Re-frame discount to scope. Offer a starter-package design with an explicit 24-hour no-fit path.", eval: 0.7, rationale: "Recipient gets a yes-to-something path plus an explicit no-fit path. 24-hour commitment shifts operator from chase-posture to fit-evaluation-posture.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Defer to an internal check. Promise a return with a number that works.", eval: 0.1, rationale: "Buys time but introduces no new information. Recipient holds in same appraisal state. Operator returns later to a colder conversation.", atlasTags: [] },
      { text: "Trade multi-year lock-in for the lower year-one number.", eval: -0.3, rationale: "Multi-year lock-in proposed to a founder explicitly stating burn-rate uncertainty. Recipient absorbs the offer as evidence operator hasn't been listening.", atlasTags: [] },
      { text: "Defensive frame. Argue against the recipient's stated runway constraint.", eval: -1.0, rationale: "'You'll pay more later' is structurally implausible to a founder who knows their own runway math. Reactance fires.", atlasTags: ["loss-framing", "authority"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "tracy-money-reframe",
  },

  // ─── Procurement (3 more) ──────────────────────────────────────────────
  {
    id: "p005", theme: "procurement", difficulty: 1900,
    buyerRole: "Senior procurement specialist",
    setup: "Late stage. Champion verbally committed. Procurement running 'standard process.'",
    buyerLine: "We've been burned twice in the last 18 months on year-one cancellations. Procurement now requires a 90-day evaluation period before any multi-year. That's policy, not preference.",
    candidates: [
      { text: "Comply with policy. Surface exit criteria + business-sponsor cost-of-delay in the same turn.", eval: 0.8, rationale: "Operator absorbs the policy without contest, then surfaces two operational paths: procurement's exit criteria and business-sponsor cost-of-delay. Multi-thread embedded in compliance.", atlasTags: ["calibrated-question", "multi-threading"] },
      { text: "Negotiate the timeline. Compress to 30 days.", eval: -0.2, rationale: "Negotiates against the timeline without addressing the policy frame. Procurement reads operator as needing the deal more than they need the eval.", atlasTags: [] },
      { text: "Substitute compliance documentation (SOC2 + ISO27001) for the policy step.", eval: -0.5, rationale: "Generic peer-skipping claim to a procurement specialist. The doc offer reads as substitution for a policy the recipient framed as non-negotiable.", atlasTags: ["social-proof"] },
      { text: "Propose a contractual workaround. Route around procurement's authority.", eval: -1.0, rationale: "Reads as either ignorance of procurement's authority or attempt to route around it. Both degrade trust.", atlasTags: ["sharp-angle"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-two-copies",
  },

  {
    id: "p006", theme: "procurement", difficulty: 2100,
    buyerRole: "Procurement counterparty in adversarial negotiation",
    setup: "You've named your number. They've named theirs. Gap is $40K.",
    buyerLine: "We're $40K apart. Before either of us makes a move, what's your last quarter's win-loss ratio at our deal size? I want to know what the next vendor in line costs us.",
    candidates: [
      { text: "Decline to fabricate the requested data. Redirect to deployment-time dimension recipient has previously surfaced.", eval: 0.7, rationale: "Operator does not invent the win-loss number. Redirects to an operational dimension the recipient has surfaced. Anchors the conversation to a number operator can credibly defend.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Answer honestly with appropriate caveat. No position advance.", eval: 0.1, rationale: "Recipient absorbs the data point without obligation; operator has revealed information without extracting any.", atlasTags: [] },
      { text: "Split the difference at the midpoint. Standard meet-in-the-middle.", eval: 0.2, rationale: "Workable, but signals operator can move $20K. Procurement will return for a second pass at half that.", atlasTags: ["alternative-choice"] },
      { text: "Total capitulation paired with manufactured urgency and an enforceable-style deliverable.", eval: -1.1, rationale: "Procurement registers the move as the operator hitting a quarter-end target, not as a real concession.", atlasTags: ["scarcity"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-accusation-audit",
  },

  {
    id: "p007", theme: "procurement", difficulty: 1700,
    buyerRole: "IT security architect, technical evaluator",
    setup: "Security review meeting. Architect finished walking through their concerns.",
    buyerLine: "SOC2's fine. FedRAMP's the issue. We're under a federal data-sharing agreement and audit's been getting more aggressive. Even a Moderate ATO would unblock us.",
    candidates: [
      { text: "Name the constraint without inflating the commitment. Surface the timing-mismatch between roadmap and audit cycle.", eval: 0.6, rationale: "Operator names the constraint accurately. Surfaces a timing question the architect can confirm or deny. Recipient experiences operator as audit-literate.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Conditional commitment to a future ATO date.", eval: 0.3, rationale: "Works if operator can credibly hold the date. Carries reputation risk if internal roadmap shifts.", atlasTags: [] },
      { text: "Argue against the recipient's stated regulatory requirement.", eval: -0.5, rationale: "Argues with a security architect about the architect's stated requirement. Even if technically defensible, depletes credibility downstream.", atlasTags: ["social-proof"] },
      { text: "Propose a substitution claim that won't survive a five-minute check.", eval: -0.9, rationale: "Architect is positioned to verify. Misrepresentation surfaces immediately.", atlasTags: [] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-live-label",
  },

  // ─── Stall (3) ────────────────────────────────────────────────────────
  {
    id: "p008", theme: "stall", difficulty: 1400,
    buyerRole: "VP Sales, mid-market",
    setup: "Second meeting. Proposal sent three weeks ago. Follow-ups unanswered. You finally got them back on a call.",
    buyerLine: "Yeah. I should've gotten back to you. We're still in it but I'm not the priority right now. Leadership has me on a sales-comp redesign that's eating my Q.",
    candidates: [
      { text: "Offer a park-or-shrink choice. The choice itself reveals real priority.", eval: 0.6, rationale: "Both options respect the recipient's stated constraint. The choice reveals priority: accept-park signals real deprioritization, accept-shrink signals lingering interest.", atlasTags: ["calibrated-question", "alternative-choice"] },
      { text: "Accept the deprioritization. Schedule a future check-in.", eval: -0.3, rationale: "Schedules a future check-in that will likely produce the same response.", atlasTags: [] },
      { text: "Volunteer significant asymmetric work in exchange for the recipient's attention.", eval: -0.4, rationale: "The artifact arrives; the attention does not. Pattern repeats.", atlasTags: ["reciprocity"] },
      { text: "Manufactured time-pressure paired with the recipient's stated capacity constraint.", eval: -0.8, rationale: "Recipient registers operator as quota-driven, not customer-driven. Stall extends.", atlasTags: ["scarcity", "loss-framing"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "tracy-think-it-over",
  },

  {
    id: "p009", theme: "stall", difficulty: 1700,
    buyerRole: "Founder, post-Series B",
    setup: "Founder said yes 30 days ago to a $200K contract. Legal review has been 'in progress' for three weeks.",
    buyerLine: "Still with legal. They bumped it for a vendor dispute that broke this week. I'll get them back on it Monday.",
    candidates: [
      { text: "Convert wait-state into actionable signal. Surface spillover risk + remaining recipient-side blockers.", eval: 0.7, rationale: "Operator does not press the legal-team availability. Instead surfaces operational questions inside recipient's control. Converts wait-state into actionable information.", atlasTags: ["calibrated-question"] },
      { text: "Offer to absorb legal coordination work directly.", eval: 0.3, rationale: "Useful if legal IS the blocker. If legal is a proxy for cold-feet, the request will be deflected and the deprioritization will surface.", atlasTags: ["multi-threading"] },
      { text: "Accept the recipient's frame. Wait until Monday.", eval: -0.2, rationale: "Recipient resumes the lower-attention state.", atlasTags: [] },
      { text: "Manufactured pricing pressure on an event outside the recipient's control.", eval: -0.7, rationale: "Recipient absorbs the move as operator-side quota anxiety. Trust degrades.", atlasTags: ["scarcity"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "cardone-snapbacks",
  },

  {
    id: "p010", theme: "stall", difficulty: 2000,
    buyerRole: "Champion VP-Eng",
    setup: "You've pushed for close for two weeks. Champion unusually quiet after a month of high engagement.",
    buyerLine: "Have to push to Q3. CTO's been pulled into the Series B prep and the spend committee is on hold until that closes. Not a no. Just a wrong-quarter.",
    candidates: [
      { text: "Release schedule pressure entirely. Surface calendar-vs-content distinction.", eval: 0.8, rationale: "Champion's answer reveals whether the deal is procedurally deferred or has lost internal air cover. Either way, operator gets actionable information.", atlasTags: ["calibrated-question", "labeling"] },
      { text: "Polite acceptance. Re-engage in Q3.", eval: -0.2, rationale: "No information gained. Operator misses the chance to distinguish calendar-deferral from priority-deferral.", atlasTags: [] },
      { text: "Multi-thread around the champion during their stated capacity constraint.", eval: 0.3, rationale: "Works if champion welcomes coverage, backfires if it reads as bypass. High-variance during capacity-limited window.", atlasTags: ["multi-threading"] },
      { text: "Manufactured pricing pressure plus a routing-around move to an unavailable stakeholder.", eval: -0.9, rationale: "Champion absorbs the move as operator self-interest overriding listening.", atlasTags: ["scarcity", "authority"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "tracy-think-it-over",
  },

  // ─── Renewal (3) ──────────────────────────────────────────────────────
  {
    id: "p011", theme: "renewal", difficulty: 1500,
    buyerRole: "New VP Operations, renewal contact",
    setup: "Thirty days before renewal. Usage data shows heavy team adoption. New VP doesn't know you.",
    buyerLine: "I inherited this and three other contracts in a similar range. I'm running a baseline-vs-replace evaluation across all of them this quarter. Walk me through what your team's been getting.",
    candidates: [
      { text: "Pivot from defending past spend to mapping value into the recipient's evaluation framework.", eval: 0.7, rationale: "Branch offer signals operator understands the recipient's review is systematic, not personal. Value story re-orients to the new VP's actual KPIs.", atlasTags: ["calibrated-question", "alternative-choice"] },
      { text: "Surface raw usage data. Defer the value report to after the call.", eval: 0.2, rationale: "Data without context. Numbers don't connect to the recipient's stated evaluation framework.", atlasTags: [] },
      { text: "Volunteer to do the recipient's evaluation work for them.", eval: -0.3, rationale: "The comparison will arrive but will not displace the recipient's own evaluation process. Lateral move with significant asymmetric cost.", atlasTags: ["reciprocity"] },
      { text: "Threat-framed consequence on a new stakeholder with no relationship equity.", eval: -1.2, rationale: "Recipient registers operator as escalating to consequence-pressure on first call.", atlasTags: ["loss-framing"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "klaff-prize-frame",
  },

  {
    id: "p012", theme: "renewal", difficulty: 1900,
    buyerRole: "CFO at renewal, considering seat downgrade",
    setup: "Quarterly business review just ended. CFO questioning the seat count.",
    buyerLine: "We pay for 200, 130 are active by your dashboard. I have a board-asked-question on idle seats and I need an answer before close-of-quarter. Tell me why I shouldn't cut to 130.",
    candidates: [
      { text: "Supply information recipient lacked. Surface cyclical pattern + cost of re-buying at no-discount pricing.", eval: 0.7, rationale: "Operator accepts the framing and supplies information the CFO did not have. Cycle-data offer is concrete and audit-defensible.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Mid-range counter-offer (150 seats with a small per-seat adjustment).", eval: 0.1, rationale: "Reasonable counter; doesn't address the board narrative. CFO may accept and re-open the question next quarter.", atlasTags: ["anchor-with-range"] },
      { text: "Generic peer benchmark. Recipient discounts aggregate stats.", eval: -0.2, rationale: "Generic benchmark to a CFO holding a specific board-asked question. Peer data cannot answer the actual constraint.", atlasTags: ["social-proof"] },
      { text: "Pricing threat in response to a usage question.", eval: -0.6, rationale: "CFO marks operator as adversarial in a renewal where the relationship is otherwise positive. Risk of competitive exit increases.", atlasTags: [] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-two-copies",
  },

  {
    id: "p013", theme: "renewal", difficulty: 1700,
    buyerRole: "Champion being recruited elsewhere",
    setup: "Champion has hinted they may not be at the company at renewal time. Renewal in 60 days.",
    buyerLine: "Heads up. I've got an offer I'm probably taking. Renewal's in 60 days and the new person will want to look at things from scratch. Just so you can plan.",
    candidates: [
      { text: "Multi-thread to the successor. Offer a structural concession that reduces switch cost.", eval: 0.7, rationale: "Operator absorbs the courtesy signal without pressuring the champion. Successor-friendly structure is a real concession reducing the new person's switching cost.", atlasTags: ["multi-threading", "calibrated-question"] },
      { text: "Lock the renewal before the champion exits. Read as self-interest.", eval: -0.3, rationale: "Champion absorbs the move as self-interest. Successor may rip up the locked contract on first review anyway.", atlasTags: ["assumptive"] },
      { text: "Multi-thread question only. No structural offer.", eval: 0.4, rationale: "Useful but transactional. Champion may share the name; the introduction is a separate step.", atlasTags: ["multi-threading"] },
      { text: "Reassurance without action.", eval: 0.0, rationale: "Champion absorbs the move as operator not registering the actual risk signal just provided.", atlasTags: ["social-proof"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-accusation-audit",
  },

  // ─── Multi-stakeholder (2) ────────────────────────────────────────────
  {
    id: "p014", theme: "multistakeholder", difficulty: 1700,
    buyerRole: "Champion VP-Eng, with quiet CFO on the call",
    setup: "Joint call with champion + CFO. Champion enthusiastic for 35 minutes. CFO has said almost nothing.",
    buyerLine: "[CFO finally speaks] Deployment risk. What's the operational profile? I've been through three vendor rollouts where the technical part went fine and the operational part broke a process owner.",
    candidates: [
      { text: "Name two concrete process-owner failure modes matching the recipient's framing. Branch back to recipient.", eval: 0.7, rationale: "Concrete failure modes matching the operational (not technical) framing. Branch question reroutes the CFO into specifying which failure pattern applies.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Generic dismissal of recipient-specific concern (aggregate deployment stat).", eval: -0.4, rationale: "Aggregate statistic does not address the three prior incidents the CFO has named.", atlasTags: ["social-proof"] },
      { text: "Route the question back to the champion in front of the CFO.", eval: -0.2, rationale: "Champion may not have process-owner-failure framing. Risk of deepening the CFO's hesitation.", atlasTags: [] },
      { text: "Vague answer implying recipient needs to do more discovery work.", eval: -0.5, rationale: "CFO absorbs the move as operator deflection.", atlasTags: [] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-live-label",
  },

  {
    id: "p015", theme: "multistakeholder", difficulty: 2000,
    buyerRole: "Independent board director joining the eval call",
    setup: "Board director with audit-committee experience has joined a deal call. Very high persuasion-knowledge.",
    buyerLine: "If this vendor blows up in eighteen months, what does the proxy paragraph look like? I've sat through two of those and I want to know what I'm signing up for.",
    candidates: [
      { text: "Name the specific governance failure modes the recipient is signaling for. Offer structural mitigation.", eval: 0.8, rationale: "Recipient experiences operator as audit-committee-literate. Structural offer routes the conversation into recipient's domain expertise.", atlasTags: ["calibrated-question", "authority", "labeling"] },
      { text: "Generic peer-claim (many board-level customers, comfortable governance).", eval: -0.5, rationale: "Board directors have heard this from every vendor; absorb it as content-free.", atlasTags: ["social-proof"] },
      { text: "Documentation offer (SOC2 + ISO + contractual templates).", eval: 0.3, rationale: "Necessary but insufficient. Recipient is asking about narrative risk, not documentation risk.", atlasTags: [] },
      { text: "Generic risk-low framing to a catastrophic-failure question.", eval: -1.0, rationale: "Operator signals lack of comprehension of the board director's actual job.", atlasTags: [] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "voss-accusation-audit",
  },

  // ─── Endgame (2) ──────────────────────────────────────────────────────
  {
    id: "p016", theme: "endgame", difficulty: 1800,
    buyerRole: "Champion who has just verbally committed",
    setup: "Champion just said yes. You have 30 seconds before they pivot to another meeting.",
    buyerLine: "Yeah, this is making sense. I'm in. What do you need from me?",
    candidates: [
      { text: "Stack three procedural commitments in the current turn (MSA recipient, turnaround, calendar-locked signing call).", eval: 0.8, rationale: "Three simultaneous escalations reduce drift probability. 'While we're still on this call' converts champion-momentum into calendar-state.", atlasTags: ["mutual-close-plan", "alternative-choice"] },
      { text: "Polite acknowledgment with a follow-up tomorrow.", eval: 0.1, rationale: "By tomorrow the champion is in three other meetings and the verbal yes has cooled.", atlasTags: [] },
      { text: "Skip the procurement frame. Push for signature today.", eval: -0.4, rationale: "Champion absorbs the move as operator not understanding the recipient's organization.", atlasTags: ["assumptive"] },
      { text: "Continue selling after the verbal commit (more references, more case studies).", eval: -0.9, rationale: "Recipient registers operator as hedging. Creates retroactive uncertainty about the just-stated yes.", atlasTags: [] },
    ],
    bestIndex: 0,
    themeHint: "Mate-in-1. The verbal yes is the move; procedural commitments in the next 30 seconds determine whether it survives the week.",
    transcriptId: "cardone-yay-or-nay",
  },

  {
    id: "p017", theme: "endgame", difficulty: 2200,
    buyerRole: "Procurement, final call before signature",
    setup: "Final call. They've sent redlines. You're walking through.",
    buyerLine: "Last item. Unilateral termination at 90 days, 50% refund. That's the clause language. Standard in our vendor contracts since the [redacted competitor] incident.",
    candidates: [
      { text: "Accept the policy context. Offer a structural alternative producing equivalent accountability without refund-accounting.", eval: 0.7, rationale: "Equivalent operator-side accountability without the refund-accounting overhead. Recipient experiences operator as policy-aware.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Counter-offer without acknowledging the policy framing (30 days, no refund).", eval: -0.3, rationale: "Procurement registers operator as not having listened to the policy framing.", atlasTags: ["anchor-with-range"] },
      { text: "Calibrated question on a stated-policy clause late in the cycle.", eval: 0.4, rationale: "Structurally valid but introduces friction late in the cycle. Recipient may absorb it as last-minute renegotiation.", atlasTags: ["calibrated-question"] },
      { text: "Takeaway frame on the final clause without credible BATNA.", eval: -0.5, rationale: "Works only if operator BATNA is credible. In final-call context with sunk pipeline cost, the threat reads as bluff.", atlasTags: ["takeaway"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "cardone-trial-close",
  },

  // ─── Cold open (3) ────────────────────────────────────────────────────
  {
    id: "p018", theme: "cold-open", difficulty: 1300,
    buyerRole: "VP at a target account who just answered the cold call",
    setup: "Cold call to a senior VP who actually picked up. You have eight seconds before they say 'not interested.'",
    buyerLine: "Hello?",
    candidates: [
      { text: "Pattern-interrupt. Name the call type, hand time-control to the recipient.", eval: 0.7, rationale: "Names the call type explicitly, hands time-control to the recipient, removes scripted opener cues.", atlasTags: ["accusation-audit"] },
      { text: "Scripted softening opener ('hope I'm not catching you at a bad time').", eval: -0.6, rationale: "Triggers the 'not a good time' reflex within four seconds.", atlasTags: [] },
      { text: "Personalization signal (LinkedIn post reference).", eval: 0.1, rationale: "Earns three additional seconds. Still reads as a sales-context wind-up; pattern recognition fires shortly after.", atlasTags: ["liking"] },
      { text: "Yes/no qualifier giving the recipient an exit.", eval: -0.4, rationale: "If yes, operator hasn't earned the next sentence. If no, recipient hangs up.", atlasTags: [] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "klaff-time-reversal",
  },

  {
    id: "p019", theme: "cold-open", difficulty: 1700,
    buyerRole: "Senior procurement lead, intro email reply",
    setup: "You sent a referral-led cold email. They replied with a two-word question.",
    buyerLine: "What do you do? Need under thirty seconds.",
    candidates: [
      { text: "Named peer + specific outcome + concrete mechanism + explicit permission-to-disengage.", eval: 0.7, rationale: "Procurement lead absorbs the move as time-respectful. Specific outcome under the implicit time constraint.", atlasTags: ["social-proof", "concrete-construal"] },
      { text: "Generic 'leading platform' claim with vague enterprise count.", eval: -0.5, rationale: "Procurement specialists discount aggregate enterprise claims by default.", atlasTags: ["social-proof", "authority"] },
      { text: "Defer the value question to a one-pager artifact.", eval: -0.3, rationale: "Document handoff fails the implicit time constraint the recipient surfaced.", atlasTags: [] },
      { text: "Referral hand-off without substance.", eval: 0.0, rationale: "Recipient may grant a call out of courtesy; conversion to opportunity rate is low.", atlasTags: ["liking"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "belfort-aerotyne",
  },

  {
    id: "p020", theme: "cold-open", difficulty: 1500,
    buyerRole: "Founder, intro Zoom — first 60 seconds",
    setup: "First Zoom. Founder opens before you can.",
    buyerLine: "Okay. Pitch me. I've got 18 minutes.",
    candidates: [
      { text: "Invert demonstration to qualification. Compress remaining time if discovery confirms a specific path.", eval: 0.6, rationale: "Founder absorbs the move as time-respecting and homework-done. Demonstration frame flips into qualification frame.", atlasTags: ["calibrated-question", "concrete-construal"] },
      { text: "Generic 'we help founders' opener plus deck walkthrough.", eval: -0.8, rationale: "Founder checks their phone before slide three.", atlasTags: [] },
      { text: "Disciplined two-minute version. Operator-led demonstration.", eval: 0.4, rationale: "Better than deck-walkthrough; worse than discovery-first because operator still owns the demonstration frame.", atlasTags: ["calibrated-question"] },
      { text: "Scripted trial-close in the opening minute (1 to 10 scale).", eval: -0.4, rationale: "Founder pattern-matches to sales-coach training; pitch credibility degrades before content lands.", atlasTags: ["trial-close"] },
    ],
    bestIndex: 0, themeHint: undefined,
    transcriptId: "klaff-time-reversal",
  },
];

export function getPuzzle(id: string) {
  return PUZZLES.find((p) => p.id === id);
}

export function puzzlesByTheme(theme: string) {
  return PUZZLES.filter((p) => p.theme === theme);
}

// Deterministic daily puzzle pick.
export function dailyPuzzleId(date: Date = new Date()): string {
  const key = date.toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  }
  const idx = Math.abs(hash) % PUZZLES.length;
  return PUZZLES[idx].id;
}
