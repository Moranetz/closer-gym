// 20 hand-authored puzzle positions. Each one is a real common position
// extracted from the closer-curriculum + Atlas literature. Evals are tuned
// against the same heuristic the live eval function uses.
//
// Convention for candidates:
//   - bestIndex 0 is the canonical "best move"
//   - 1 is a plausible-but-suboptimal move (+0.0 to +0.3)
//   - 2 is a contraindicated/scripted-cliche move (-0.6 to -1.2)
//   - 3 is a blunder (-1.0 to -1.8)
// The solver shuffles candidates at display time so position doesn't leak.

import type { Puzzle } from "./puzzles";

export const PUZZLES: Puzzle[] = [
  // ─── Budget (4) ────────────────────────────────────────────────────────
  {
    id: "p001",
    theme: "budget",
    difficulty: 1300,
    buyerRole: "VP Operations, mid-market SaaS",
    setup: "You're 18 minutes into a discovery call. You've established the problem — three reps quit last quarter because the manual onboarding process is brutal. The buyer just heard your pricing.",
    buyerLine: "Honestly, we don't have budget for this in FY26.",
    candidates: [
      {
        text: "Help me understand — when you say no budget, do you mean the line item doesn't exist yet, or it exists and it's allocated elsewhere?",
        eval: +0.7,
        rationale: "Calibrated question that surfaces whether 'no budget' means 'no awareness of cost' (solvable) or 'budget is locked' (real). Voss-textbook.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "I hear you — budget season is tough. Could we revisit this in Q1 when planning opens up?",
        eval: -0.4,
        rationale: "Accepts the objection without testing it. Buyer learns they can end any conversation by saying 'no budget.' Deal goes dormant.",
        atlasTags: [],
      },
      {
        text: "Most companies your size find the budget when they realize what onboarding churn is costing them — usually about 3x our license fee.",
        eval: -0.6,
        rationale: "Social-proof + implied-loss without earning permission. Reads as pressure. The buyer will get more guarded, not less.",
        atlasTags: ["social-proof", "loss-framing"],
      },
      {
        text: "I'll let you in on something — if you sign by Friday, we can offer 20% off.",
        eval: -1.4,
        rationale: "Manufactured scarcity + price drop in response to a budget objection. Trains the buyer that discounts come from pushing back. Procurement will smell this.",
        atlasTags: ["scarcity", "lowball"],
      },
    ],
    bestIndex: 0,
    themeHint: "Classic 'no budget' position. The right move is to test whether the objection is real before negotiating against it.",
  },
  {
    id: "p002",
    theme: "budget",
    difficulty: 1600,
    buyerRole: "CFO, $200M revenue SaaS",
    setup: "Late-stage call, fourth meeting. Champion VP-Eng is on the line. You've already mapped value at $1.2M. Now the CFO has just joined.",
    buyerLine: "Walk me through ROI. Specifically, how do I tell my board this paid back in under 12 months?",
    candidates: [
      {
        text: "The fastest pay-back I've seen in your peer set is 7 months — Acme cut their onboarding churn from 18% to 6% in two quarters. Want me to walk through their math, or yours?",
        eval: +0.9,
        rationale: "Named peer (specific social proof — high-weight on CFO), concrete number, and a calibrated branch back to the CFO's specific board narrative. This is the move.",
        atlasTags: ["social-proof", "calibrated-question"],
      },
      {
        text: "Industry average is around 15 months, but we usually beat that.",
        eval: -0.3,
        rationale: "Vague stat + 'usually' undercuts itself. Doesn't give the CFO a defensible number to take to the board.",
        atlasTags: [],
      },
      {
        text: "Honestly, the ROI math depends on your assumptions. Let me send you our calculator after this call.",
        eval: -0.5,
        rationale: "Punts the question to a tool. The CFO asked YOU. Deferring after they've already invested 4 meetings reads as unprepared.",
        atlasTags: [],
      },
      {
        text: "I can't promise 12 months, but we'll do everything we can.",
        eval: -1.1,
        rationale: "Pre-emptive hedge with no specifics. CFOs hear this as 'I don't know.' Deal probably won't survive the next internal review.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
    themeHint: "Specific named peer beats generic social proof every time on a prestige-driven CFO.",
  },
  {
    id: "p003",
    theme: "budget",
    difficulty: 1800,
    buyerRole: "Procurement specialist, F500",
    setup: "First procurement call after the business team agreed in principle. The procurement specialist has very high persuasion-knowledge.",
    buyerLine: "Your list price is 15% above the next vendor we're considering. What can you do on price?",
    candidates: [
      {
        text: "What does the next vendor's package include? I want to make sure we're comparing apples-to-apples before talking discount.",
        eval: +0.6,
        rationale: "Calibrated question that re-frames the conversation away from list price and toward scope. Procurement specialists respect this — it's their move.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "We can match — what would it take to close this today?",
        eval: -0.2,
        rationale: "Concession with conditional close. Better than capitulating but signals price is flexible from move 1. Procurement will grind from here.",
        atlasTags: ["sharp-angle"],
      },
      {
        text: "Honestly, we're already at floor pricing for your tier.",
        eval: -0.9,
        rationale: "Bluff that procurement will test. If you can't hold the line, your credibility collapses; if you can, the conversation ends.",
        atlasTags: [],
      },
      {
        text: "I'll come back with our best and final by EOD.",
        eval: -1.2,
        rationale: "Pre-emptively conceding before they've made an offer. You just gave up your anchor. Procurement specialists are trained to push when this happens.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p004",
    theme: "budget",
    difficulty: 1500,
    buyerRole: "Founder, Series A startup",
    setup: "Cash-conscious founder, real budget pressure, but also genuinely interested. You're at 28 minutes.",
    buyerLine: "I love the product but realistically we can only spend $30k this year. Your price is $80k.",
    candidates: [
      {
        text: "What if we structured a starter package at $30k that scales as you grow? I'd want to design it so you don't pay for capacity you can't use yet.",
        eval: +0.7,
        rationale: "Reframes from discount to scope. Founder gets a yes-to-something + signals you understand their stage. Lower ACV now, expansion later.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "Let me see what we can do — I'll talk to my VP and come back with a number.",
        eval: +0.1,
        rationale: "Buys time but doesn't progress. Acceptable; not great. Founder will start hearing from competitors.",
        atlasTags: [],
      },
      {
        text: "We can do $30k for year one if you commit to a three-year ramp.",
        eval: -0.3,
        rationale: "Multi-year lock-in early-stage founders hate. They might say yes today and resent it at renewal.",
        atlasTags: [],
      },
      {
        text: "Most early-stage companies who try to do this on the cheap end up paying more when they have to switch later. Our $80k actually saves you money.",
        eval: -1.0,
        rationale: "Lectures the founder. The 'you'll pay more later' frame is reactance bait. Persuasion-knowledge fires hard here.",
        atlasTags: ["loss-framing", "authority"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Procurement (3) ───────────────────────────────────────────────────
  {
    id: "p005",
    theme: "procurement",
    difficulty: 1900,
    buyerRole: "Senior procurement specialist",
    setup: "Late stage. Champion has already verbally committed. Procurement is doing 'standard process.'",
    buyerLine: "We need a 90-day pilot before any commitment.",
    candidates: [
      {
        text: "I want to honor your process. Help me understand — what would the pilot need to prove for you to recommend we move forward, and what's the timeline implication for the team that wants this live?",
        eval: +0.8,
        rationale: "Honors procurement's authority + extracts exit criteria + surfaces the cost of delay to the business sponsor. Procurement specialists respect this.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "We can do a 30-day pilot — 90 is too long.",
        eval: -0.2,
        rationale: "Negotiates against the timeline without establishing why. Procurement reads this as you needing the deal more than they need a pilot.",
        atlasTags: [],
      },
      {
        text: "Other customers your size skip the pilot — we have references that can speak to outcomes.",
        eval: -0.5,
        rationale: "Tries to social-proof procurement. They've heard it. Their job is to verify, not to take peer's word.",
        atlasTags: ["social-proof"],
      },
      {
        text: "If we agree to a pilot, can we lock the contract today?",
        eval: -1.0,
        rationale: "Sharp-angle close + assumptive. Procurement specialists are explicitly trained against these. Reads as manipulation.",
        atlasTags: ["sharp-angle", "assumptive"],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p006",
    theme: "procurement",
    difficulty: 2100,
    buyerRole: "Procurement counterparty in adversarial negotiation",
    setup: "You've named your number. They've named theirs. Gap is $40k.",
    buyerLine: "We're $40k apart. Where can you flex?",
    candidates: [
      {
        text: "Before I answer that — what's the deadline pressure on your end? Knowing your timeline helps me figure out what's actually workable.",
        eval: +0.5,
        rationale: "Voss-textbook: surface their constraints before revealing yours. Buys you a leverage point.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "Split the difference — $20k each side and we close this week?",
        eval: +0.2,
        rationale: "Standard 'meet in the middle.' Workable but you just told them you can move $20k. They'll come back for another $10k.",
        atlasTags: ["alternative-choice"],
      },
      {
        text: "We can do $40k off if you agree to be a reference and a case study.",
        eval: 0.0,
        rationale: "Trades concession for non-cash value. Defensible but the reference commitment is hard to enforce.",
        atlasTags: [],
      },
      {
        text: "I can do it. $40k off, but I need a signed PO by Friday.",
        eval: -1.1,
        rationale: "Total capitulation with manufactured urgency. Procurement now knows you'll cave and that your urgency was theater.",
        atlasTags: ["scarcity"],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p007",
    theme: "procurement",
    difficulty: 1700,
    buyerRole: "IT security architect (technical evaluator)",
    setup: "Security review meeting. Architect has just finished walking you through their concerns.",
    buyerLine: "Honestly, your SOC2 is fine but you don't have FedRAMP. That's a hard requirement for us.",
    candidates: [
      {
        text: "That's a fair call-out. Where is FedRAMP on your timeline — are you actively pursuing now, or is it a longer-term posture? I want to see if we can sequence around it.",
        eval: +0.6,
        rationale: "Accepts the constraint, then surfaces whether it's actually blocking THIS deal or a future one. Often the requirement is aspirational.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "We're in the early stages of FedRAMP — happy to commit to a date if it unblocks this.",
        eval: +0.3,
        rationale: "Honest answer + conditional offer. Works if the security architect has authority; risky if you can't actually commit.",
        atlasTags: [],
      },
      {
        text: "Most of our enterprise customers don't require FedRAMP — your SOC2 + ISO27001 covers the same controls.",
        eval: -0.5,
        rationale: "Argues with a security architect about their requirement. Even if technically right, you lose the room.",
        atlasTags: ["social-proof"],
      },
      {
        text: "We can get a letter of intent from a FedRAMP sponsor — that's effectively the same thing.",
        eval: -0.9,
        rationale: "Technical hand-waving that won't survive a five-minute search by the architect. Damages your credibility for everything else they review.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  // ─── Stall / silence (3) ───────────────────────────────────────────────
  {
    id: "p008",
    theme: "stall",
    difficulty: 1400,
    buyerRole: "VP Sales, mid-market",
    setup: "Second meeting. You sent a proposal three weeks ago. Followups go unanswered. You finally got them back on a call.",
    buyerLine: "Sorry — yeah, I've been swamped. We're still thinking about it.",
    candidates: [
      {
        text: "Totally get it. When you say 'still thinking' — what's the specific thing you're working through? Curious whether it's something I can help with or whether it's truly internal.",
        eval: +0.6,
        rationale: "Calibrated question without pressure. Surfaces real objection vs. polite stall.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "No worries. Should I check back in two weeks?",
        eval: -0.3,
        rationale: "Accepts the stall and schedules another stall. The deal is going dormant.",
        atlasTags: [],
      },
      {
        text: "Honestly, at this point I'm wondering if this is no longer a priority for you. If so, totally fine to tell me.",
        eval: +0.4,
        rationale: "Takeaway / accusation audit. Works to surface a real objection but only if delivered with genuine no-pressure tone.",
        atlasTags: ["takeaway", "accusation-audit"],
      },
      {
        text: "We have a Q-end deadline approaching that might make this much harder if you wait. Can we get on the calendar this week?",
        eval: -0.8,
        rationale: "Manufactured urgency on a stalled deal. Reads as desperation. Confirms to the buyer they were right to pull back.",
        atlasTags: ["scarcity"],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p009",
    theme: "stall",
    difficulty: 1700,
    buyerRole: "Founder, post-Series B",
    setup: "Founder said yes 30 days ago to a $200k contract. Legal review has been 'in progress' for three weeks. You suspect the founder has gone cold.",
    buyerLine: "Legal is still reviewing. I'll ping them tomorrow.",
    candidates: [
      {
        text: "What's actually holding things up on your end? Sometimes 'legal review' is a holding pattern when something else has changed — would rather know now than chase the wrong thing.",
        eval: +0.7,
        rationale: "Direct + non-judgmental. Founders respect this. Surfaces whether it's truly legal or whether the founder has cold feet.",
        atlasTags: ["calibrated-question", "labeling"],
      },
      {
        text: "Can you introduce me to your legal counsel? I'd love to address their concerns directly.",
        eval: +0.3,
        rationale: "Useful if legal IS the holdup. But often the founder hasn't actually sent it to legal. Plausible move.",
        atlasTags: ["multi-threading"],
      },
      {
        text: "I'm going to be transparent — if we don't close by quarter end my pricing model resets. I'd rather not see you pay more.",
        eval: -0.7,
        rationale: "Manufactured price-change urgency. Founder hears 'you have a quota,' not 'I'm helping you.' Trust drops.",
        atlasTags: ["scarcity", "loss-framing"],
      },
      {
        text: "Just checking in. Let me know if you need anything.",
        eval: -0.4,
        rationale: "Pure deferential check-in. Doesn't surface the real issue. Three more weeks of silence ahead.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p010",
    theme: "stall",
    difficulty: 2000,
    buyerRole: "Champion VP-Eng",
    setup: "You've been pushing for the close for two weeks. Champion has gone unusually quiet after being highly engaged for a month.",
    buyerLine: "Hey — I think we need to push this to Q3. Things changed internally.",
    candidates: [
      {
        text: "Got it. What changed? Don't want to push if it's the wrong moment, but if there's something I can help you carry internally I'd rather know than not.",
        eval: +0.8,
        rationale: "Releases pressure + opens the door for them to share the real internal reason. Champions often back off when they've lost air cover internally.",
        atlasTags: ["calibrated-question", "labeling"],
      },
      {
        text: "Understood. Should I follow up in Q3 then?",
        eval: -0.2,
        rationale: "Polite but doesn't earn information. The deal goes dormant; you don't know if it's recoverable.",
        atlasTags: [],
      },
      {
        text: "I get it, but our pricing locks at Q2 end. Want me to send you a memo for your CFO?",
        eval: -0.9,
        rationale: "Tries to use scarcity + authority on a champion who already trusts you. Trust drops sharply.",
        atlasTags: ["scarcity", "authority"],
      },
      {
        text: "Is there someone else internally I should be talking to?",
        eval: +0.3,
        rationale: "Multi-threading move, but going around your champion when they've just pushed you off is risky.",
        atlasTags: ["multi-threading"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Renewal (3) ────────────────────────────────────────────────────────
  {
    id: "p011",
    theme: "renewal",
    difficulty: 1500,
    buyerRole: "VP Operations (your renewal contact)",
    setup: "30 days before renewal. Usage data shows the team is using your product heavily. But the new VP doesn't know you.",
    buyerLine: "I inherited this contract. I want to understand the value before signing again.",
    candidates: [
      {
        text: "Fair — I'd want the same in your seat. Want to start with what the team's been using it for, or with what business outcome you're being measured on? I'll back-fill the value story around that.",
        eval: +0.7,
        rationale: "Reframes from defending past spend to mapping value to NEW VP's actual KPIs. Wins by being curious about them, not by selling.",
        atlasTags: ["calibrated-question", "alternative-choice"],
      },
      {
        text: "Let me send you the usage report — you've had 47 active users averaging 23 hours/week. The team is clearly getting value.",
        eval: +0.2,
        rationale: "Data without context. Numbers don't speak to the VP's specific concerns. Acceptable but doesn't connect.",
        atlasTags: [],
      },
      {
        text: "Other VPs in your spot have all renewed once they saw the impact data.",
        eval: -0.4,
        rationale: "Generic social proof on a person who's trying to evaluate independently. They'll resent the implication.",
        atlasTags: ["social-proof"],
      },
      {
        text: "If you don't renew, your team loses access in 30 days — that's going to be a brutal switch.",
        eval: -1.2,
        rationale: "Loss-framing on a new stakeholder you haven't earned trust with. Reads as hostage-taking.",
        atlasTags: ["loss-framing"],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p012",
    theme: "renewal",
    difficulty: 1900,
    buyerRole: "CFO at renewal time, considering downgrade",
    setup: "Quarterly business review just ended. CFO is questioning the seat count.",
    buyerLine: "We're paying for 200 seats. Usage shows 130 active. Why shouldn't I cut to 130 at renewal?",
    candidates: [
      {
        text: "That's a fair number to start from. The complication is the cyclical 70 seats — they're the new-hire and PIP-recovery cohort. Cutting them puts onboarding behind on day 1 of the new term. Want to walk through the cycle data before we set the floor?",
        eval: +0.7,
        rationale: "Acknowledges the math, then introduces information the CFO didn't have. Doesn't argue with the cut — frames the conversation around 'when' those seats fire.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "We can do 150 seats with a small price increase per seat — keeps your buffer.",
        eval: +0.1,
        rationale: "Reasonable counter but doesn't address the WHY. CFO may accept and still cut next quarter.",
        atlasTags: ["anchor-with-range"],
      },
      {
        text: "Most of our customers your size buy 25% above active usage as a buffer — peer benchmark suggests 165.",
        eval: -0.2,
        rationale: "Peer benchmark without specifics. Generic stat that a CFO will discount immediately.",
        atlasTags: ["social-proof"],
      },
      {
        text: "If we go to 130 we'd need to renegotiate the volume discount — your effective price per seat goes up 22%.",
        eval: -0.6,
        rationale: "Pricing threat in response to a usage question. CFO immediately marks you as adversarial. Often exits to compete.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p013",
    theme: "renewal",
    difficulty: 1700,
    buyerRole: "Champion at risk — being recruited elsewhere",
    setup: "Champion has hinted they may not be at the company at renewal time. Renewal is in 60 days.",
    buyerLine: "I'm going to be honest — I might not be here for the renewal. The new person may want to evaluate fresh.",
    candidates: [
      {
        text: "I appreciate you flagging that. Two questions: who'd be your successor, and would it help if we drafted something now that survives the transition — like a usage-tied renewal that the new person can extend or pause?",
        eval: +0.7,
        rationale: "Labels the situation + multi-threads to the successor + offers a structure that reduces successor risk. The champion will help.",
        atlasTags: ["multi-threading", "calibrated-question"],
      },
      {
        text: "Can we lock the renewal now, before you leave?",
        eval: -0.3,
        rationale: "Reads as 'I want to secure you against the new person.' Champion may help, but their successor may rip it up.",
        atlasTags: ["assumptive"],
      },
      {
        text: "Who will the new person be? Can you introduce me?",
        eval: +0.4,
        rationale: "Reasonable multi-threading move but skips the relationship-building. Better to ask via the champion's framing first.",
        atlasTags: ["multi-threading"],
      },
      {
        text: "Most renewals survive transitions when the usage data is strong — yours is.",
        eval: 0.0,
        rationale: "Reassurance without action. Doesn't change the underlying risk.",
        atlasTags: ["social-proof"],
      },
    ],
    bestIndex: 0,
  },

  // ─── Multi-stakeholder (2) ────────────────────────────────────────────
  {
    id: "p014",
    theme: "multistakeholder",
    difficulty: 1700,
    buyerRole: "Champion VP-Eng, with quiet CFO on the call",
    setup: "Joint call with champion + CFO. Champion has been enthusiastic. CFO has said almost nothing for 35 minutes.",
    buyerLine: "[CFO finally speaks] What's the deployment risk profile here? Specifically operational, not technical.",
    candidates: [
      {
        text: "Great question. The two operational risks we've seen in similar deployments are change-management velocity and integration with the data-warehouse refresh cycle. Of those, which is the higher concern for you given how your team operates?",
        eval: +0.7,
        rationale: "Concrete answer + flips back to the CFO with a calibrated branch. CFO now has space to surface the real concern. Champion sees CFO engaged.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "Risk is minimal — we've deployed this 47 times in your peer set with no significant operational issues.",
        eval: -0.4,
        rationale: "Dismisses the CFO's question. CFO marks you as glossing over real concerns. Champion's credibility takes a hit too.",
        atlasTags: ["social-proof"],
      },
      {
        text: "[to champion] Tom, you've been through the technical review — want to take this one?",
        eval: -0.2,
        rationale: "Hands the answer back to the champion in front of the CFO. Champion may not have the right framing for operational risk. Risky.",
        atlasTags: [],
      },
      {
        text: "Honestly, risk is going to depend a lot on your team's existing process maturity.",
        eval: -0.5,
        rationale: "Vague answer that implies the CFO's question can't be answered without more from them. Reads as dodging.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p015",
    theme: "multistakeholder",
    difficulty: 2000,
    buyerRole: "Board director joining the eval call",
    setup: "Board director with audit-committee role has joined a deal call. Status posture: prestige-driven, very high persuasion-knowledge.",
    buyerLine: "How does this decision read in the proxy if it goes wrong?",
    candidates: [
      {
        text: "That's the right question to ask. Two ways it could read poorly: dependency on a single vendor without a credible exit, or a contractual term that surfaces in audit as off-market. Want to walk through how we structure both so the proxy story is clean?",
        eval: +0.8,
        rationale: "Validates the director's question + names the SPECIFIC governance failure modes + offers to walk through mitigations. Director recognizes you understand their actual job.",
        atlasTags: ["calibrated-question", "authority", "labeling"],
      },
      {
        text: "We have many board-level customers — they've all been comfortable with our governance posture.",
        eval: -0.5,
        rationale: "Generic social proof on a board director. They've already discounted that. Doesn't address the proxy-narrative concern.",
        atlasTags: ["social-proof"],
      },
      {
        text: "I'd want to make sure your audit committee has full transparency — happy to send our SOC2, ISO, and contractual templates.",
        eval: +0.3,
        rationale: "Helpful but doesn't address the political/narrative concern. Board director cares about proxy STORY, not just documentation.",
        atlasTags: [],
      },
      {
        text: "Honestly, the risk profile is low and the upside justifies the investment.",
        eval: -1.0,
        rationale: "Generic 'risk low' answer that suggests you don't understand what the board director actually does.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  // ─── Endgame studies (2) ──────────────────────────────────────────────
  {
    id: "p016",
    theme: "endgame",
    difficulty: 1800,
    buyerRole: "Champion who has just verbally committed",
    setup: "Champion just said yes. You have 30 seconds to lock the next step before they pivot to another meeting.",
    buyerLine: "Yeah, this is making sense. I want to move forward.",
    candidates: [
      {
        text: "Great — quick: who should I send the MSA to, and what's your standard procurement turnaround? I'll mirror your process. Want to put a signing call on the calendar 7-10 days out so we both have a target?",
        eval: +0.8,
        rationale: "Immediate mutual-action-plan move. Lock the next step + name the stakeholder + put a date on calendar — three commitment escalations in one turn.",
        atlasTags: ["mutual-close-plan", "alternative-choice"],
      },
      {
        text: "Perfect. I'll send you the contract tomorrow.",
        eval: +0.1,
        rationale: "Polite acknowledgment but doesn't lock anything. By tomorrow they're in another meeting and the verbal yes may cool.",
        atlasTags: [],
      },
      {
        text: "Awesome — can we sign today?",
        eval: -0.4,
        rationale: "Assumptive close before procurement is on the radar. They'll backpedal to 'I have to check the process.'",
        atlasTags: ["assumptive"],
      },
      {
        text: "Excellent! Let me share a few more reference customers before we move to paper.",
        eval: -0.9,
        rationale: "Adds more selling AFTER a verbal commit. Buyers experience this as 'why is he still pitching?' and start to wonder if there's something they missed.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
    themeHint: "Mate-in-1 position. The verbal yes is move 1; you have one move to lock the procedural path before the prospect's attention pulls away.",
  },
  {
    id: "p017",
    theme: "endgame",
    difficulty: 2200,
    buyerRole: "Procurement, last call before signature",
    setup: "Final call. They've sent redlines. You're walking through.",
    buyerLine: "Last thing — we want a unilateral termination right at 90 days with 50% refund. Non-negotiable.",
    candidates: [
      {
        text: "Help me understand the concern this is solving — is it about implementation risk, or vendor performance over time? If implementation, we have a structure that addresses it differently and we'd prefer that path.",
        eval: +0.7,
        rationale: "Calibrated question to surface the underlying concern. Often '50% refund' is a way of asking for derisk, not a clean contractual desire. Once surfaced, you can offer a different structure.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "We can do 30 days termination with no refund — that's our standard.",
        eval: -0.3,
        rationale: "Counter-offer without diagnosing why. Procurement will ping-pong on this for another two weeks.",
        atlasTags: ["anchor-with-range"],
      },
      {
        text: "If that's truly non-negotiable, we may not be a fit.",
        eval: -0.2,
        rationale: "Takeaway that works only if you have credible BATNA. If you need this deal, procurement smells it and the takeaway collapses.",
        atlasTags: ["takeaway"],
      },
      {
        text: "Agreed. Let me update the redlines and send them back.",
        eval: -1.2,
        rationale: "Total capitulation on a major commercial term in the last call. Sets a precedent for the next contract — and your CFO will not be happy.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },

  // ─── Cold open (3) ─────────────────────────────────────────────────────
  {
    id: "p018",
    theme: "cold-open",
    difficulty: 1300,
    buyerRole: "VP at a target account, just answered the cold call",
    setup: "You've cold-called a senior VP who actually picked up. You have 8 seconds before they say 'not interested.'",
    buyerLine: "Hello?",
    candidates: [
      {
        text: "Hi — this is a cold call. You have 22 seconds to decide if it's worth your time. Want them?",
        eval: +0.7,
        rationale: "Pattern-interrupt cold open. Names that it's a cold call + invites them in + gives them control. Voss-style accusation audit + frame.",
        atlasTags: ["accusation-audit"],
      },
      {
        text: "Hi there, hope I'm not catching you at a bad time! Is now a good moment to chat about a tool that might help your team?",
        eval: -0.6,
        rationale: "Classic scripted cold-call opener. Triggers 'not a good time' reflex within 4 seconds. Worst open you can run.",
        atlasTags: [],
      },
      {
        text: "Hi! I noticed you recently posted about [topic] on LinkedIn — wanted to share something relevant.",
        eval: +0.1,
        rationale: "Personalization helps but still reads as a pitch wind-up. Better than scripted; worse than the takeaway open.",
        atlasTags: ["liking"],
      },
      {
        text: "Hi — quick question: are you the person who handles [thing]?",
        eval: -0.4,
        rationale: "Yes/no qualifier dressed up as a question. Buyer says 'no' and hangs up; or says 'why are you asking' and you've added zero context.",
        atlasTags: [],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p019",
    theme: "cold-open",
    difficulty: 1700,
    buyerRole: "Senior procurement lead, intro email reply",
    setup: "You sent a referral-led cold email. They replied: 'What do you do?'",
    buyerLine: "What do you do?",
    candidates: [
      {
        text: "We help [peer-company-named-by-referrer] cut procurement cycle time by ~40% on mid-market software deals — specifically the security-review and vendor-onboarding stages. Worth a 15-minute look, or not relevant to what you're working on?",
        eval: +0.7,
        rationale: "Named peer + specific outcome + concrete mechanism + low-friction CTA + permission to say no. Procurement respects the structure.",
        atlasTags: ["social-proof", "concrete-construal"],
      },
      {
        text: "We're the leading platform for procurement workflow automation, used by 200+ enterprises including 4 of the Fortune 50.",
        eval: -0.5,
        rationale: "Generic 'leading platform' + vague enterprise count. Procurement professionals discount this immediately.",
        atlasTags: ["social-proof", "authority"],
      },
      {
        text: "Happy to send you a 1-pager. What's the best email?",
        eval: -0.3,
        rationale: "Defers the value question to a document they may never read. Cold lead goes silent.",
        atlasTags: [],
      },
      {
        text: "[Referrer] thought you might be interested in what we're doing. Want to grab 30 minutes?",
        eval: 0.0,
        rationale: "Pure referral hand-off without substance. Some procurement leads will say yes out of politeness; most won't.",
        atlasTags: ["liking"],
      },
    ],
    bestIndex: 0,
  },
  {
    id: "p020",
    theme: "cold-open",
    difficulty: 1500,
    buyerRole: "Founder, intro Zoom — first 60 seconds",
    setup: "First Zoom. Founder asks the open before you can.",
    buyerLine: "So — tell me what you do.",
    candidates: [
      {
        text: "I'd rather start the other way: I read your latest [post / earnings note / pitch deck] and I think there are two specific places we can move the needle. Mind if I ask three questions first to make sure I'm right about which one matters more to you?",
        eval: +0.6,
        rationale: "Flips the discovery frame + earns the right to ask questions by signaling you've done homework + names a concrete next step.",
        atlasTags: ["calibrated-question", "concrete-construal"],
      },
      {
        text: "Sure — we're a platform that helps founders like you scale go-to-market faster. Let me walk you through the deck.",
        eval: -0.8,
        rationale: "Generic 'we help founders' + deck-walkthrough open. Founder will check their phone before slide 3.",
        atlasTags: [],
      },
      {
        text: "Two-minute version: we do X for companies like Y. Worth more than two minutes only if it lands. Want me to keep going?",
        eval: +0.4,
        rationale: "Disciplined and respectful but still leads with what you do. Better than a deck-open; worse than discovery-first.",
        atlasTags: ["calibrated-question"],
      },
      {
        text: "Happy to — but first, on a scale of 1 to 10 how painful is your current [problem]?",
        eval: -0.4,
        rationale: "Scripted trial-close in the first minute. Founder smells the script and disengages.",
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
