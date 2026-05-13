// 20 hand-authored puzzle positions. Each one is a real common position
// extracted from the closer-curriculum + Atlas literature. Evals tuned against
// the same heuristic the live eval function uses.
//
// Voice: Persuasion-Max house style — mechanistic, decompositional, neutral.
// Buyer lines are presuppositional and operationally specific (no declared
// honesty markers). Candidate moves hide their technique surface — no
// "Help me understand" / "I hear you" curriculum openers. Rationales describe
// what the move does to the recipient's appraisal state + downstream
// operational consequences, never naming the technique chapter.
//
// Convention for candidates:
//   - bestIndex 0 is the canonical highest-delta move
//   - 1 is a plausible defer (accepts recipient frame as-is)
//   - 2 is a lateral / asymmetric-work move (operator absorbs cost without progress)
//   - 3 is a premature-concession / pre-position move (surfaces elasticity unasked)
// PuzzleSolver shuffles display order deterministically by puzzle.id.

import type { Puzzle } from "./puzzles";

export const PUZZLES: Puzzle[] = [
  // ─── Budget (4) ─────────────────────────────────────────────────────────
  {
    id: "p001", theme: "budget", difficulty: 1300,
    buyerRole: "VP Operations, mid-market SaaS",
    setup: "Eighteen minutes into discovery. You've established the onboarding-churn problem — three reps quit last quarter. Buyer just heard pricing.",
    buyerLine: "It's just not in the FY26 envelope. We'd have to pull from training or shift the hire freeze around, and neither one's going to fly with the board.",
    candidates: [
      {
        text: "Pull from training or shift the freeze — which one's the actual constraint? If it's the freeze, this conversation isn't useful for either of us right now.",
        eval: 0.7,
        rationale: "Branches the objection into two operational paths the recipient just surfaced themselves. Low technique-surface visibility — no labeling marker, no question-form opener. Recipient experiences agency, not interrogation.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "Got it. I'll drop a Q1 placeholder and we'll regroup when planning opens up.",
        eval: -0.5,
        rationale: "Accepts the recipient-supplied frame without modification. No new information surfaced. Downstream probability of repeat hold-pattern compounds across each accepted defer.",
        atlasTags: [],
      },
      {
        text: "Before we wrap — would a cost-of-current-state doc help your planning cycle? Costs me nothing on my end.",
        eval: -0.7,
        rationale: "Pairs reciprocity gift with implicit re-engagement frame. The 'costs me nothing' pre-positions a future ask. Operator absorbs asymmetric work; recipient absorbs artifact. Lateral move, not vertical.",
        atlasTags: ["reciprocity", "loss-framing"],
      },
      {
        text: "If budget's the only thing in the way, there's some flex I haven't tapped yet. What number would make this work on your end?",
        eval: -1.1,
        rationale: "Pairs urgency signal with concession in the same turn. Operator surfaces price elasticity before recipient requests it. Downstream: future budget conversations lengthen; procurement absorbs as calibration point.",
        atlasTags: ["scarcity", "sharp-angle"],
      },
    ],
    bestIndex: 0,
    themeHint: "Budget objection as policy versus budget objection as priority — different paths require different responses. Most reps treat both as price.",
  },

  {
    id: "p002", theme: "budget", difficulty: 1600,
    buyerRole: "CFO, $200M revenue SaaS",
    setup: "Fourth meeting. Champion VP-Eng on the call. Value mapped at $1.2M last week. CFO just joined.",
    buyerLine: "I need a payback number I can defend to the board. Anything past 14 months and I'm not pushing this up. What's your math?",
    candidates: [
      {
        text: "Cleanest peer math I have at your scale is seven months — Acme cut onboarding churn from 18% to 6% in two quarters, that's the headline number. Two ways to walk through it: their math, or yours. Yours takes longer but it survives a board challenge.",
        eval: 0.9,
        rationale: "Named-peer specificity pre-empts generic-stat dismissal. Branch offer routes the recipient toward the higher-effort path while making the lower-effort path available. Recipient's appraisal state shifts from 'evaluating cost' to 'evaluating method'.",
        atlasTags: ["social-proof", "calibrated-question"],
      },
      {
        text: "Industry average is around 15 months but we usually beat that. Happy to send the model after this call.",
        eval: -0.3,
        rationale: "Generic stat plus hedge plus deferred artifact. No defensible board number surfaced in the live moment. CFO appraisal stays in uncertainty range.",
        atlasTags: [],
      },
      {
        text: "Let me build you a custom ROI model. I can have something back by end of week with your inputs.",
        eval: -0.5,
        rationale: "Asymmetric work transferred to operator. Recipient deferred to artifact-pending state. Downstream: model arrives but the live moment's energy has dissipated; champion has to re-mobilize internal urgency.",
        atlasTags: [],
      },
      {
        text: "Tell me what payback period you'd find defensible and I'll work backwards from there.",
        eval: -1.1,
        rationale: "Operator hands the framing pen to the recipient. Whatever number the CFO names becomes the ceiling for the negotiation. Pre-positions a downstream concession the recipient has not yet asked for.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
    themeHint: "On prestige-driven C-level, named-peer specificity outperforms generic stats by a wide margin. The branch offer doubles as a recipient-agency move.",
  },

  {
    id: "p003", theme: "procurement", difficulty: 1800,
    buyerRole: "Procurement specialist, F500",
    setup: "First procurement call after business team agreed in principle. Procurement specialist has very high persuasion-knowledge.",
    buyerLine: "Our procurement guidelines flag anything above 12% premium versus the next bid. You're at 15. Either we close the delta or this goes to a re-bid process I can't accelerate.",
    candidates: [
      {
        text: "What's in the comparison package on their side? The 12% threshold makes sense if the SOW is matched — I want to make sure we're not closing the delta on different scopes.",
        eval: 0.6,
        rationale: "Re-frames the contest from list price to scope match. Procurement professionals respect comparison-rigor framing because it's their daily operating mode. Operator earns analytical posture without invoking technique surface.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "We can match — what would it take to close this today?",
        eval: -0.2,
        rationale: "Concession with conditional close. Signals price is flexible from move 1. Recipient stores the move as a calibration point for future rounds.",
        atlasTags: ["sharp-angle"],
      },
      {
        text: "Let me run the numbers internally and come back with a revised package by tomorrow.",
        eval: -0.6,
        rationale: "Operator absorbs asymmetric work without surfacing the scope question. Returns with a number that procurement will benchmark against the same 12% threshold. Downstream: same conversation, less leverage.",
        atlasTags: [],
      },
      {
        text: "I'll come back with our best and final by EOD.",
        eval: -1.2,
        rationale: "Pre-emptive 'best and final' before the recipient has counter-offered. Operator burns own anchor in the first turn. Procurement specialists are trained to push when this pattern fires.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p004", theme: "budget", difficulty: 1500,
    buyerRole: "Founder, Series A startup",
    setup: "Cash-conscious founder, real burn-rate constraints, also genuinely interested. Twenty-eight minutes in.",
    buyerLine: "Real talk — we're burning $310K a month and can't push the round. $30K is what I have. If your product isn't a $30K product, we'll find a workaround.",
    candidates: [
      {
        text: "$30K is interesting because it forces a starter-package design — fewer seats, no SLA, capped support, you scale the rest as you raise. Want me to sketch what that costs to operate on our side? If it doesn't pencil for us, we're not the right fit and you'll know in 24 hours.",
        eval: 0.7,
        rationale: "Re-frames from discount to scope. Recipient gets a yes-to-something path plus an explicit no-fit path. The 24-hour commitment shifts operator from chase-posture to fit-evaluation-posture.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "Let me check with my VP and come back with a number that works for $30K.",
        eval: 0.1,
        rationale: "Buys time but introduces no new information. Recipient holds in same appraisal state. Operator returns later to a colder conversation.",
        atlasTags: [],
      },
      {
        text: "We can do $30K for year one if you commit to a three-year ramp.",
        eval: -0.3,
        rationale: "Multi-year lock-in proposed to a founder explicitly stating burn-rate uncertainty. Recipient absorbs the offer as evidence that operator hasn't been listening.",
        atlasTags: [],
      },
      {
        text: "Early-stage teams that try to do this on the cheap usually end up paying more on the switch. Our $80K actually saves you money over 18 months.",
        eval: -1.0,
        rationale: "Defensive frame: operator argues against the recipient's stated constraint. The 'you'll pay more later' claim is structurally implausible to a founder who knows their own runway math. Reactance fires.",
        atlasTags: ["loss-framing", "authority"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Procurement (3 more) ───────────────────────────────────────────────
  {
    id: "p005", theme: "procurement", difficulty: 1900,
    buyerRole: "Senior procurement specialist",
    setup: "Late stage. Champion verbally committed. Procurement running 'standard process.'",
    buyerLine: "We've been burned twice in the last 18 months on year-one cancellations. Procurement now requires a 90-day evaluation period before any multi-year. That's policy, not preference.",
    candidates: [
      {
        text: "Then the 90 is non-negotiable on your side. Two questions: what does the eval need to show for you to recommend the multi-year, and what's the cost-of-delay on the business sponsor's side that I should know about before we structure this?",
        eval: 0.8,
        rationale: "Operator absorbs the policy without contest, then surfaces two operational paths: exit criteria (procurement's frame) and stakeholder cost (business sponsor's frame). Multi-thread move embedded in compliance.",
        atlasTags: ["calibrated-question", "multi-threading"],
      },
      {
        text: "We can compress to a 30-day eval — 90 puts us into a fiscal-year-end conversation that's harder for everyone.",
        eval: -0.2,
        rationale: "Negotiates against the timeline without addressing the policy frame. Procurement reads operator as needing the deal more than they need the eval.",
        atlasTags: [],
      },
      {
        text: "Other customers your size have skipped the eval after seeing our SOC2 + ISO27001 docs. Want me to send those over?",
        eval: -0.5,
        rationale: "Generic peer-skipping claim to a procurement specialist. The compliance-doc offer reads as a substitution attempt for a policy the recipient already framed as non-negotiable.",
        atlasTags: ["social-proof"],
      },
      {
        text: "If we structure the multi-year with a 90-day exit clause, does that bypass the eval process?",
        eval: -1.0,
        rationale: "Operator proposes a contractual workaround for a process the recipient framed as policy. Reads as either ignorance of procurement's authority or attempt to route around it. Both degrade trust.",
        atlasTags: ["sharp-angle"],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p006", theme: "procurement", difficulty: 2100,
    buyerRole: "Procurement counterparty in adversarial negotiation",
    setup: "You've named your number. They've named theirs. Gap is $40K.",
    buyerLine: "We're $40K apart. Before either of us makes a move — what's your last quarter's win-loss ratio at our deal size? I want to know what the next vendor in line costs us.",
    candidates: [
      {
        text: "I'd answer that if I had it in front of me; I don't. What I do know is the next vendor at your size is usually 30-45 days slower to deployment, and you've named two-week deployment as a constraint. Where does that sit in the $40K math for you?",
        eval: 0.7,
        rationale: "Operator does not fabricate the win-loss number; redirects to a different operational dimension the recipient has previously surfaced. Anchors the conversation to a number the operator can credibly defend.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "Last quarter we won about 70% at your tier — though some of those were existing-relationship renewals, so I'd want to caveat the number.",
        eval: 0.1,
        rationale: "Honest answer with appropriate caveat. Doesn't advance position. Recipient absorbs the data point without obligation; operator has revealed information without extracting any.",
        atlasTags: [],
      },
      {
        text: "Split the difference — $20K each side and we close this week?",
        eval: 0.2,
        rationale: "Standard meet-in-the-middle. Workable, but signals operator can move $20K. Procurement will return for a second pass at half that.",
        atlasTags: ["alternative-choice"],
      },
      {
        text: "I can do $40K off if you agree to a signed PO by Friday and a published case study by quarter end.",
        eval: -1.1,
        rationale: "Total capitulation paired with manufactured urgency and a deliverable the procurement specialist can't credibly enforce. Procurement registers the move as the operator hitting a quarter-end target, not as a real concession.",
        atlasTags: ["scarcity"],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p007", theme: "procurement", difficulty: 1700,
    buyerRole: "IT security architect, technical evaluator",
    setup: "Security review meeting. Architect finished walking through their concerns.",
    buyerLine: "SOC2's fine. FedRAMP's the issue. We're under a federal data-sharing agreement and audit's been getting more aggressive. Even a Moderate ATO would unblock us.",
    candidates: [
      {
        text: "Moderate ATO is in our 18-month roadmap, not a public commitment yet. Where does that sit relative to your audit cycle? If the audit closes before our ATO, even a sponsored sandbox deployment won't move the needle for you.",
        eval: 0.6,
        rationale: "Operator names the constraint without inflating the commitment. Surfaces a timing-mismatch the architect can confirm or deny. Recipient experiences operator as audit-literate rather than sales-literate.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "We're in the early stages of FedRAMP — I can come back with a target ATO date if that unblocks the procurement step.",
        eval: 0.3,
        rationale: "Conditional commitment to a future date. Works if operator can credibly hold the date; carries reputation risk if internal roadmap shifts.",
        atlasTags: [],
      },
      {
        text: "Most of our enterprise customers don't require FedRAMP — your SOC2 plus ISO27001 covers substantially similar controls.",
        eval: -0.5,
        rationale: "Argues with a security architect about the architect's stated requirement. Even if technically defensible, the move depletes credibility for everything the architect evaluates downstream.",
        atlasTags: ["social-proof"],
      },
      {
        text: "We can get a letter of intent from a FedRAMP-sponsored agency — that's effectively the same thing.",
        eval: -0.9,
        rationale: "Substitution claim that won't survive a five-minute check by the recipient. Architect is positioned to verify; misrepresentation surfaces immediately.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  // ─── Stall (3) ─────────────────────────────────────────────────────────
  {
    id: "p008", theme: "stall", difficulty: 1400,
    buyerRole: "VP Sales, mid-market",
    setup: "Second meeting. You sent the proposal three weeks ago. Follow-ups unanswered. You finally got them back on a call.",
    buyerLine: "Yeah. I should've gotten back to you. We're still in it but I'm not the priority right now — leadership has me on a sales-comp redesign that's eating my Q.",
    candidates: [
      {
        text: "Got it. Two paths: I can park this until your comp project closes, or I can come back to you with a 30-minute version that fits inside whatever cycle you have left. Which costs you less right now?",
        eval: 0.6,
        rationale: "Operator gives the recipient an explicit park-or-shrink choice. Both options respect the recipient's stated constraint. The choice itself reveals priority — accept-park signals real deprioritization, accept-shrink signals lingering interest.",
        atlasTags: ["calibrated-question", "alternative-choice"],
      },
      {
        text: "No problem. Should I check back in two weeks?",
        eval: -0.3,
        rationale: "Accepts the deprioritization without testing it. Schedules a future check-in that will likely produce the same response.",
        atlasTags: [],
      },
      {
        text: "Want me to put together a comp-redesign-friendly version of this — something your team can use without disrupting your bandwidth?",
        eval: -0.4,
        rationale: "Operator volunteers significant asymmetric work in exchange for the recipient's attention. The artifact arrives; the attention does not. Pattern repeats.",
        atlasTags: ["reciprocity"],
      },
      {
        text: "If we don't get this in motion by end of Q, our pricing window changes — wanted to flag that before you lose the option.",
        eval: -0.8,
        rationale: "Manufactured time-pressure pairs poorly with explicit recipient-stated deprioritization. Recipient registers operator as quota-driven, not customer-driven. Stall extends.",
        atlasTags: ["scarcity", "loss-framing"],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p009", theme: "stall", difficulty: 1700,
    buyerRole: "Founder, post-Series B",
    setup: "Founder said yes 30 days ago to a $200K contract. Legal review has been 'in progress' for three weeks.",
    buyerLine: "Still with legal — they bumped it for a vendor dispute that broke this week. I'll get them back on it Monday.",
    candidates: [
      {
        text: "Got it. Two questions to make sure I'm not chasing the wrong thing: is the dispute resolution going to inform your terms on our contract, and is anything in our paper still open from your side that I can close out before Monday?",
        eval: 0.7,
        rationale: "Operator does not press the legal-team availability — that's outside recipient's control. Instead surfaces two operational questions: spillover risk from the dispute and any remaining recipient-side blockers. Move converts a wait-state into actionable signal.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "Can you connect me with your legal counsel? Happy to walk them through the standard clauses directly.",
        eval: 0.3,
        rationale: "Operator offers to absorb legal coordination work. Useful if legal IS the blocker. If legal is being used as a proxy for founder cold-feet, the request will be deflected and the deprioritization will surface.",
        atlasTags: ["multi-threading"],
      },
      {
        text: "Totally understand. I'll wait to hear from you Monday.",
        eval: -0.2,
        rationale: "Operator accepts the recipient-supplied frame and surrenders information-gathering opportunity. Recipient resumes the lower-attention state.",
        atlasTags: [],
      },
      {
        text: "Quick flag — our pricing structure changes at quarter end. Wanted to make sure you weren't caught off guard if Monday slips.",
        eval: -0.7,
        rationale: "Pairs manufactured pricing pressure with an event outside the recipient's control. Recipient absorbs the move as operator-side quota anxiety. Trust degrades.",
        atlasTags: ["scarcity"],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p010", theme: "stall", difficulty: 2000,
    buyerRole: "Champion VP-Eng",
    setup: "You've pushed for close for two weeks. Champion unusually quiet after a month of high engagement.",
    buyerLine: "Have to push to Q3. CTO's been pulled into the Series B prep and the spend committee is on hold until that closes. Not a no — just a wrong-quarter.",
    candidates: [
      {
        text: "Understood. One thing that helps me plan: did anything in our proposal still need to land with the CTO before Series B prep pulled them, or is this purely a calendar problem? If it's calendar, I'll back off. If something's still open, I'd rather close it now while it's fresh.",
        eval: 0.8,
        rationale: "Operator releases the schedule pressure entirely while surfacing the calendar-versus-content distinction. Champion's answer reveals whether the deal is procedurally deferred or has lost internal air cover. Either way, operator gets actionable information.",
        atlasTags: ["calibrated-question", "labeling"],
      },
      {
        text: "Got it. I'll re-engage in Q3 when the Series B settles down.",
        eval: -0.2,
        rationale: "Polite acceptance, no information gained. Operator misses the opportunity to distinguish calendar-deferral from priority-deferral. Risk of returning to a colder deal.",
        atlasTags: [],
      },
      {
        text: "Is there someone else internally I should be working with while the CTO is heads-down on the raise?",
        eval: 0.3,
        rationale: "Multi-thread attempt. Routing around the champion while the champion is signaling temporary capacity-limited is high-variance — works if the champion welcomes coverage, backfires if it reads as bypass.",
        atlasTags: ["multi-threading"],
      },
      {
        text: "Just so you're not surprised — our pricing locks at end of Q2. Want me to send a memo your CTO can read after the raise closes?",
        eval: -0.9,
        rationale: "Pairs pricing pressure with a CTO who is explicitly unavailable. The 'memo your CTO can read' reads as routing-around. Champion absorbs the move as operator self-interest overriding listening.",
        atlasTags: ["scarcity", "authority"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Renewal (3) ───────────────────────────────────────────────────────
  {
    id: "p011", theme: "renewal", difficulty: 1500,
    buyerRole: "New VP Operations, renewal contact",
    setup: "Thirty days before renewal. Usage data shows heavy team adoption. New VP doesn't know you.",
    buyerLine: "I inherited this and three other contracts in a similar range. I'm running a baseline-vs-replace evaluation across all of them this quarter. Walk me through what your team's been getting.",
    candidates: [
      {
        text: "Two ways to do this — start with what your team's been using us for, or start with what you're being measured on this year. I'll back-fill the value story around whichever one's more useful for your evaluation framework.",
        eval: 0.7,
        rationale: "Operator pivots from defending past spend to mapping value into the recipient's stated evaluation framework. Branch offer doubles as a signal that operator understands the recipient's review is systematic, not personal.",
        atlasTags: ["calibrated-question", "alternative-choice"],
      },
      {
        text: "Sure — over the last 12 months your team has had 47 active users averaging 23 hours per week of platform time. Happy to send the full usage report after this call.",
        eval: 0.2,
        rationale: "Data without context. Numbers don't connect to the recipient's stated evaluation framework. Recipient absorbs the artifact and proceeds with the original review unchanged.",
        atlasTags: [],
      },
      {
        text: "I can put together a side-by-side comparing us to the other three contracts you're reviewing — would that be useful?",
        eval: -0.3,
        rationale: "Operator volunteers to do the recipient's evaluation work for them. The comparison will arrive but will not displace the recipient's own evaluation process. Lateral move with significant asymmetric cost.",
        atlasTags: ["reciprocity"],
      },
      {
        text: "If you don't renew, your team loses access in 30 days — that's going to be a brutal transition for the people using us daily.",
        eval: -1.2,
        rationale: "Threat-framed on a new stakeholder with no relationship equity. Recipient registers operator as escalating to consequence-pressure on first call.",
        atlasTags: ["loss-framing"],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p012", theme: "renewal", difficulty: 1900,
    buyerRole: "CFO at renewal, considering seat downgrade",
    setup: "Quarterly business review just ended. CFO questioning the seat count.",
    buyerLine: "We pay for 200, 130 are active by your dashboard. I have a board-asked-question on idle seats and I need an answer before close-of-quarter. Tell me why I shouldn't cut to 130.",
    candidates: [
      {
        text: "If the 70 inactive seats were all idle, you should cut. They aren't — they're cyclical: new-hire onboarding and PIP-recovery cohorts. If you cut to 130 you'll be re-buying seats inside Q2 at no-discount pricing. Want me to pull the cohort data so the board sees the cycle?",
        eval: 0.7,
        rationale: "Operator accepts the board-question framing and supplies information the recipient did not have, then routes back into the recipient's deadline. The cycle-data offer is concrete and audit-defensible.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "We can re-price at 150 seats with a 4% per-seat adjustment — keeps your buffer without locking 200.",
        eval: 0.1,
        rationale: "Reasonable counter; doesn't address the board narrative. CFO may accept and re-open the same question next quarter.",
        atlasTags: ["anchor-with-range"],
      },
      {
        text: "Most of our customers your size keep 20-25% buffer above active usage. Want me to share the benchmark data?",
        eval: -0.2,
        rationale: "Generic benchmark to a CFO holding a specific board-asked question. The peer-data offer cannot answer the recipient's actual constraint.",
        atlasTags: ["social-proof"],
      },
      {
        text: "If we go to 130 we'd need to renegotiate the volume discount — your effective price per seat goes up 22%.",
        eval: -0.6,
        rationale: "Pricing threat in response to a usage question. CFO marks operator as adversarial in a renewal where the relationship is otherwise positive. Risk of competitive exit increases.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p013", theme: "renewal", difficulty: 1700,
    buyerRole: "Champion being recruited elsewhere",
    setup: "Champion has hinted they may not be at the company at renewal time. Renewal in 60 days.",
    buyerLine: "Heads up — I've got an offer I'm probably taking. Renewal's in 60 days and the new person will want to look at things from scratch. Just so you can plan.",
    candidates: [
      {
        text: "Appreciate the heads-up. Two things: who's likely to inherit the seat, and would it help if we drafted a successor-friendly renewal now — usage-tied, the new person can extend or pause without re-negotiating the base? Reduces evaluation cost for them, reduces re-sell cost for me.",
        eval: 0.7,
        rationale: "Operator absorbs the courtesy signal without pressuring the champion. Surfaces successor identity (multi-thread). The 'successor-friendly' structure is a real concession that reduces the new person's switching cost — a credible value exchange.",
        atlasTags: ["multi-threading", "calibrated-question"],
      },
      {
        text: "Can we lock the renewal in your last two weeks? I'd rather close it under you than re-evaluate with someone who doesn't have the context.",
        eval: -0.3,
        rationale: "Reads as operator securing the contract against the successor. Champion absorbs the move as self-interest. Successor may rip up the locked contract on first review anyway.",
        atlasTags: ["assumptive"],
      },
      {
        text: "Who's the likely successor? I'd love to start building the relationship before you leave.",
        eval: 0.4,
        rationale: "Multi-thread question, no structural offer. Useful but transactional. Champion may share the name; the introduction is a separate step.",
        atlasTags: ["multi-threading"],
      },
      {
        text: "Most renewals like yours survive transitions — your usage data is strong. Should be fine on the new person's side.",
        eval: 0.0,
        rationale: "Reassurance without action. Champion absorbs the move as operator not registering the actual risk signal just provided.",
        atlasTags: ["social-proof"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Multi-stakeholder (2) ────────────────────────────────────────────
  {
    id: "p014", theme: "multistakeholder", difficulty: 1700,
    buyerRole: "Champion VP-Eng, with quiet CFO on the call",
    setup: "Joint call with champion + CFO. Champion enthusiastic for 35 minutes. CFO has said almost nothing.",
    buyerLine: "[CFO finally speaks] Deployment risk — what's the operational profile? I've been through three vendor rollouts where the technical part went fine and the operational part broke a process owner.",
    candidates: [
      {
        text: "The two we see most often are change-management velocity in the first 60 days and the data-warehouse refresh cycle around quarter close — both are process-owner failures, not technical ones. Of those, which is the higher concern for how your team operates today?",
        eval: 0.7,
        rationale: "Operator answers with concrete failure modes that match the recipient's framing (operational, not technical). Branch question reroutes the CFO into specifying which failure pattern applies — surfaces internal knowledge the champion may not have.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "Operational risk is minimal at your size — we've deployed at 47 similar companies without significant process disruption.",
        eval: -0.4,
        rationale: "Generic dismissal of a recipient-specific concern. CFO has named three prior incidents; aggregate statistic does not address them. Champion's credibility takes secondary damage.",
        atlasTags: ["social-proof"],
      },
      {
        text: "[To champion] Tom, you've been through the technical review — want to take this one?",
        eval: -0.2,
        rationale: "Operator routes back to champion in front of CFO. Champion may not have process-owner-failure framing. Risk that champion's answer surfaces the same concern more vaguely, deepening the CFO's hesitation.",
        atlasTags: [],
      },
      {
        text: "Operational risk depends a lot on your team's existing process maturity. Hard to say without more context.",
        eval: -0.5,
        rationale: "Vague answer that implicitly requests more recipient-side work. CFO absorbs the move as operator deflection.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p015", theme: "multistakeholder", difficulty: 2000,
    buyerRole: "Independent board director joining the eval call",
    setup: "Board director with audit-committee experience has joined a deal call. Status posture: prestige-driven, very high persuasion-knowledge.",
    buyerLine: "If this vendor blows up in eighteen months — what does the proxy paragraph look like? I've sat through two of those and I want to know what I'm signing up for.",
    candidates: [
      {
        text: "The two failure modes that produce a proxy paragraph in our category are single-vendor dependency without a credible exit and off-market contractual terms that surface in audit. Want to walk through how we structure both so neither one gives you a paragraph you'd have to defend?",
        eval: 0.8,
        rationale: "Operator names the specific governance failure modes the recipient is signaling for. Recipient experiences operator as audit-committee-literate. Structural offer routes the conversation into recipient's domain expertise.",
        atlasTags: ["calibrated-question", "authority", "labeling"],
      },
      {
        text: "We have many board-level customers and they've all been comfortable with our governance posture and contractual structure.",
        eval: -0.5,
        rationale: "Generic peer-claim to a board director. Recipient has heard this from every vendor; absorbs it as content-free.",
        atlasTags: ["social-proof"],
      },
      {
        text: "I'd want your audit committee to have full transparency on us — happy to send SOC2, ISO27001, and standard contractual templates ahead of any next step.",
        eval: 0.3,
        rationale: "Documentation offer. Necessary but insufficient — recipient is asking about narrative risk, not documentation risk. Lateral move; doesn't address the actual concern.",
        atlasTags: [],
      },
      {
        text: "The risk profile is low and the upside justifies the investment over the contract term.",
        eval: -1.0,
        rationale: "Generic risk-low framing to a recipient explicitly asking about catastrophic-failure narrative. Operator signals lack of comprehension of the board director's actual job.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  // ─── Endgame (2) ───────────────────────────────────────────────────────
  {
    id: "p016", theme: "endgame", difficulty: 1800,
    buyerRole: "Champion who has just verbally committed",
    setup: "Champion just said yes. You have 30 seconds before they pivot to another meeting.",
    buyerLine: "Yeah, this is making sense. I'm in. What do you need from me?",
    candidates: [
      {
        text: "Three things while you have me: the MSA goes to whoever, your standard procurement turnaround, and a 7-10 day signing call already on the calendar so neither of us drifts. Want me to send the calendar invite while we're still on this call?",
        eval: 0.8,
        rationale: "Operator stacks three procedural commitments in a single turn. The 'while we're still on this call' framing converts champion-momentum into calendar-state. Three simultaneous escalations reduce drift probability.",
        atlasTags: ["mutual-close-plan", "alternative-choice"],
      },
      {
        text: "Perfect — I'll send over the contract tomorrow with everything ready to go.",
        eval: 0.1,
        rationale: "Polite acknowledgment. By tomorrow, the champion is in three other meetings and the verbal yes has cooled. Operator burns the live-moment energy.",
        atlasTags: [],
      },
      {
        text: "Great. Quick — can we get something signed today?",
        eval: -0.4,
        rationale: "Skips the procurement frame the recipient hasn't mentioned but the champion knows is required. Champion absorbs the move as operator not understanding the recipient's organization.",
        atlasTags: ["assumptive"],
      },
      {
        text: "Excellent! Let me run through a few more reference customers before we move to paper — I think the [X] case study will be useful for your internal sell.",
        eval: -0.9,
        rationale: "More selling after a verbal commit. Recipient may register the move as operator hedging — 'why is he still pitching?' creates retroactive uncertainty about the just-stated yes.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
    themeHint: "Mate-in-1. The verbal yes is the move; procedural commitments in the next 30 seconds determine whether the yes survives the week.",
  },

  {
    id: "p017", theme: "endgame", difficulty: 2200,
    buyerRole: "Procurement, final call before signature",
    setup: "Final call. They've sent redlines. You're walking through.",
    buyerLine: "Last item — unilateral termination at 90 days, 50% refund. That's the clause language. Standard in our vendor contracts since the [redacted competitor] incident.",
    candidates: [
      {
        text: "I want to honor the post-[redacted] context. Two paths: the 50% refund clause as you wrote it, or a usage-tied ramp-down — if we're not at agreed adoption by day 90, you cut seat count by a third with no penalty. Same exit pressure on us, no refund accounting on your side. Which one's cleaner for your audit?",
        eval: 0.7,
        rationale: "Operator accepts the recipient's stated context and offers an alternative structure that produces equivalent operator-side accountability without the refund-accounting overhead. Recipient experiences operator as policy-aware.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "We can do 30 days termination with no refund — that's our standard.",
        eval: -0.3,
        rationale: "Counter-offer without acknowledging the recipient's stated context. Procurement registers operator as not having listened to the policy framing.",
        atlasTags: ["anchor-with-range"],
      },
      {
        text: "Help me understand the underlying concern — is the 50% refund actually capturing what your audit needs, or is there a different mechanism that would work?",
        eval: 0.4,
        rationale: "Calibrated question on a moment where the recipient has explicitly framed the clause as policy. The question is structurally valid but introduces friction late in the cycle — recipient may absorb it as last-minute renegotiation.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "If that's truly non-negotiable on your end, I'll need to take it back to my team — there's a real chance we can't sign at all.",
        eval: -0.5,
        rationale: "Takeaway frame on the final clause. Works only if operator BATNA is credible. In final-call context with sunk pipeline cost, the threat reads as bluff.",
        atlasTags: ["takeaway"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Cold open (3) ─────────────────────────────────────────────────────
  {
    id: "p018", theme: "cold-open", difficulty: 1300,
    buyerRole: "VP at a target account who just answered the cold call",
    setup: "Cold call to a senior VP who actually picked up. You have eight seconds before they say 'not interested.'",
    buyerLine: "Hello?",
    candidates: [
      {
        text: "Hi — cold call. You have 22 seconds to decide if it's worth your time. Want them?",
        eval: 0.7,
        rationale: "Pattern-interrupt move. Names the call type explicitly, hands time-control to the recipient, removes scripted opener cues. Recipient experiences agency rather than evasion.",
        atlasTags: ["accusation-audit"],
      },
      {
        text: "Hi there, hope I'm not catching you at a bad time! Is now a good moment to chat about a tool that might help your team?",
        eval: -0.6,
        rationale: "Triggers the 'not a good time' reflex within four seconds. Recipient's training kicks in faster than the operator's pitch can land.",
        atlasTags: [],
      },
      {
        text: "Hi — I saw you posted on LinkedIn about [topic] last week. Wanted to share something that connects to what you wrote.",
        eval: 0.1,
        rationale: "Personalization signal earns three additional seconds. Still reads as a sales-context wind-up; recipient's pattern recognition fires shortly after.",
        atlasTags: ["liking"],
      },
      {
        text: "Hi — quick question, are you the person who handles [thing] over there?",
        eval: -0.4,
        rationale: "Yes/no qualifier that gives the recipient an exit. If yes, operator hasn't earned the next sentence. If no, recipient hangs up.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p019", theme: "cold-open", difficulty: 1700,
    buyerRole: "Senior procurement lead, intro email reply",
    setup: "You sent a referral-led cold email. They replied with a two-word question.",
    buyerLine: "What do you do? Need under thirty seconds.",
    candidates: [
      {
        text: "We cut procurement cycle time on mid-market software deals — security review and vendor onboarding specifically — by about 40% based on the last twelve months at [peer-company-named-by-referrer]. Worth 15 minutes for you, or not relevant to what you're working on right now?",
        eval: 0.7,
        rationale: "Specific outcome, named peer, concrete mechanism, low-friction CTA, explicit permission-to-not-engage. Procurement lead absorbs the move as time-respectful.",
        atlasTags: ["social-proof", "concrete-construal"],
      },
      {
        text: "We're the leading procurement workflow platform — used by 200+ enterprises including 4 of the Fortune 50.",
        eval: -0.5,
        rationale: "Generic 'leading platform' claim plus vague enterprise count. Procurement specialists discount aggregate enterprise claims by default.",
        atlasTags: ["social-proof", "authority"],
      },
      {
        text: "Happy to send a one-pager — what's the best email?",
        eval: -0.3,
        rationale: "Defers the value question to a document. Recipient asked under thirty seconds; document handoff fails the implicit time constraint.",
        atlasTags: [],
      },
      {
        text: "[Referrer] thought you'd want to talk. 30 minutes next week?",
        eval: 0.0,
        rationale: "Referral hand-off with no substance. Recipient may grant a call out of professional courtesy; conversion to opportunity rate is low.",
        atlasTags: ["liking"],
      },
    ],
    bestIndex: 0,
  },

  {
    id: "p020", theme: "cold-open", difficulty: 1500,
    buyerRole: "Founder, intro Zoom — first 60 seconds",
    setup: "First Zoom. Founder opens before you can.",
    buyerLine: "Okay. Pitch me. I've got 18 minutes.",
    candidates: [
      {
        text: "I'd rather invert it. I read your last [post / fundraise / launch] — there are two specific places I think we can move the number you care about. Mind if I ask three questions first so I'm telling you the right one of the two? Saves you the other 15 minutes.",
        eval: 0.6,
        rationale: "Operator flips the demonstration frame into a qualification frame, then commits to compressing the rest if discovery confirms one of two specific paths. Founder absorbs the move as time-respecting and homework-done.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "Sure — we're a platform that helps founders like you scale go-to-market faster. Let me walk through the deck.",
        eval: -0.8,
        rationale: "Generic 'we help founders' opener plus deck-walkthrough. Founder checks their phone before slide three.",
        atlasTags: [],
      },
      {
        text: "Two-minute version: we do [X] for companies like [Y]. If it's not interesting in two minutes, you tell me to stop. If it is, I keep going.",
        eval: 0.4,
        rationale: "Disciplined but operator-led. Better than deck-walkthrough; worse than discovery-first because operator still owns the demonstration frame.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "Happy to pitch — first, on a scale of 1 to 10 how painful is [problem] for you right now?",
        eval: -0.4,
        rationale: "Scripted trial-close in the opening minute. Founder pattern-matches to sales-coach training; pitch credibility degrades before content lands.",
        atlasTags: ["trial-close"],
      },
    ],
    bestIndex: 0,
  },
];

export function getPuzzle(id: string) {
  return PUZZLES.find((p) => p.id === id);
}

export function puzzlesByTheme(theme: string) {
  return PUZZLES.filter((p) => p.theme === theme);
}

// Deterministic daily puzzle pick — keyed by YYYY-MM-DD.
export function dailyPuzzleId(date: Date = new Date()): string {
  const key = date.toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
  }
  const idx = Math.abs(hash) % PUZZLES.length;
  return PUZZLES[idx].id;
}
