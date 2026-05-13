// Real sourced transcript excerpts. Each is a brief quotation from published
// material (book, author blog, recognized interview) used here under fair-use
// educational reference with explicit source attribution.
//
// Mapping rule: every puzzle in puzzle-library.ts points to one transcript via
// transcriptId. The transcript shows how the tactical move type the user just
// picked plays out in a real conversation by a recognized practitioner.
//
// Where the source flags a transcript as paraphrased reconstruction (Belfort's
// Aerotyne is reconstructed from his Straight Line teaching plus the 2013 film
// script), the `paraphrased` flag is set and the UI surfaces a disclosure.

export interface TranscriptTurn {
  role: "operator" | "buyer" | "narrator";
  text: string;
}

export interface Transcript {
  id: string;
  title: string;
  speaker: string;
  source: string;        // book or article title
  sourceUrl: string;     // URL where the transcript was published
  scenario: string;      // 1-2 sentence context
  turns: TranscriptTurn[];
  techniqueNote: string; // 1-2 sentence decomposition of the move sequence
  techniqueIds: string[]; // Atlas IDs demonstrated in this transcript (drives Lessons cross-links)
  paraphrased?: boolean; // true if not verbatim
}

export const TRANSCRIPTS: Transcript[] = [
  {
    id: "voss-two-copies",
    title: "Mirror Chain (Two Copies)",
    speaker: "Chris Voss",
    source: "Never Split the Difference (HarperBusiness, 2016), recounted on Rise With Drew",
    sourceUrl: "https://risewithdrew.com/negotiating-lesson-4-be-a-mirror/",
    scenario: "A boss directs the student to make duplicate paperwork. Using nothing but mirrors (repeating the last 1 to 3 words) the student exposes that the request was never validated against the actual customer.",
    turns: [
      { role: "buyer", text: "Let's make two copies of all the paperwork." },
      { role: "operator", text: "I'm sorry, two copies?" },
      { role: "buyer", text: "Yes, one for us and one for the customer." },
      { role: "operator", text: "I'm sorry, so the client is asking for a copy and we need one for internal use?" },
      { role: "buyer", text: "Actually, I'll check with the client. They haven't asked for anything. But I want a copy. That's how I do business." },
      { role: "operator", text: "Absolutely. Thanks for checking with the customer. Where would you like to store the in-house copy?" },
      { role: "buyer", text: "It's fine. You can store it anywhere." },
      { role: "operator", text: "Anywhere?" },
    ],
    techniqueNote: "Mirror followed by mirror forces a re-examination of the original premise. The operator never argues. The mirror does the work.",
    techniqueIds: ["mirroring"],
  },

  {
    id: "voss-haiti-how",
    title: "How Am I Supposed to Do That? (Haiti Kidnapping)",
    speaker: "Chris Voss",
    source: "Never Split the Difference, Port-au-Prince case (2004), recounted on Rise With Drew",
    sourceUrl: "https://risewithdrew.com/negotiation-101-ask-open-ended-questions/",
    scenario: "A nephew's aunt is taken in Port-au-Prince. Initial ransom demand is $150,000. Voss coaches the nephew through calibrated open-ended questions instead of counter-offers. Final settlement: $4,751, aunt released within hours.",
    turns: [
      { role: "buyer", text: "Give us the money, or your aunt is going to die." },
      { role: "operator", text: "How am I supposed to do that?" },
      { role: "buyer", text: "[restates demand, no specifics]" },
      { role: "operator", text: "I'm sorry. How are we supposed to pay if you're going to hurt her?" },
      { role: "buyer", text: "[shifts toward terms]" },
      { role: "operator", text: "How can I come up with that kind of money?" },
    ],
    techniqueNote: "Calibrated 'how' questions function as a soft no. They hand the problem back without confrontation. The counterparty starts solving the asker's problem instead of defending the demand.",
    techniqueIds: ["calibrated-question"],
  },

  {
    id: "voss-live-label",
    title: "The Live Label (Interview Demo)",
    speaker: "Chris Voss",
    source: "Interview reproduced at Mindtools",
    sourceUrl: "https://www.mindtools.com/arg0sjv/never-split-the-difference/",
    scenario: "Mid-interview, Voss demonstrates labeling by catching the interviewer doing it to him in real time.",
    turns: [
      { role: "buyer", text: "It sounds like you think that labeling is an appropriate business tactic." },
      { role: "operator", text: "You just labeled it. Is that right?" },
      { role: "buyer", text: "[acknowledges, laughs]" },
      { role: "operator", text: "That's exactly what a label is. 'It sounds like,' 'it seems like,' 'it looks like.' You name the emotion or position out loud, then shut up." },
    ],
    techniqueNote: "Label followed by calibrated confirmation followed by silence. Labels work because they invite correction, which gives you the counterparty's real position for free.",
    techniqueIds: ["labeling", "calibrated-question"],
  },

  {
    id: "voss-accusation-audit",
    title: "Accusation Audit (Pre-emptive Negative Inventory)",
    speaker: "Chris Voss",
    source: "Black Swan Group blog",
    sourceUrl: "https://www.blackswanltd.com/the-edge/the-1-negotiation-strategy-for-everyone-backed-by-science",
    scenario: "Voss describes opening a hard conversation by listing, out loud and before the counterparty does, every negative they could plausibly be thinking about you. In one cited case, an executive used it to land a two-level promotion.",
    turns: [
      { role: "operator", text: "Before we start, I want to get something out of the way." },
      { role: "operator", text: "It probably seems like we don't care about you." },
      { role: "operator", text: "It probably seems like we're selfish." },
      { role: "operator", text: "It probably seems like I'm a loose cannon on this team." },
      { role: "buyer", text: "[posture softens; often denies one or more of the accusations]" },
      { role: "operator", text: "Good. So here's what I'd actually like to propose..." },
    ],
    techniqueNote: "Stack three to five 'it probably seems like' statements followed by deliberate silence. The counterparty involuntarily de-escalates because the worst-case interpretations have been named and survived.",
    techniqueIds: ["accusation-audit"],
  },

  {
    id: "klaff-time-reversal",
    title: "Time Frame Reversal (10-Minute Meeting)",
    speaker: "Oren Klaff",
    source: "Pitch Anything (McGraw-Hill, 2011), excerpted by Sheldon Nesdale",
    sourceUrl: "https://www.marketingfirst.co.nz/2013/10/pitch-anything-an-innovative-method-for-presenting-persuading-and-winning-the-deal-by-oren-klaff/",
    scenario: "Buyer opens by compressing your time. Klaff's prescription: refuse the compressed frame, defy it openly, and watch the buyer hand the time back.",
    turns: [
      { role: "buyer", text: "Hi, yes, um, well, I only have about 10 minutes to meet with you, but come on in." },
      { role: "operator", text: "No. I don't work like that. There's no sense in rescheduling unless we like each other and trust each other." },
      { role: "operator", text: "I need to know. Are you good to work with? Can you keep appointments and stick to a schedule?" },
      { role: "buyer", text: "Okay, you're right about that. Yeah, sure I can. Let's do this now. I have 30 minutes. That's no problem. Come on in." },
    ],
    techniqueNote: "Time-frame collision met with refusal and qualification. The buyer self-corrects upward from 10 to 30 minutes. The frame that reacts is the frame that loses.",
    techniqueIds: ["takeaway", "accusation-audit"],
  },

  {
    id: "klaff-prize-frame",
    title: "Prize Frame Under Investor Drill-Down",
    speaker: "Oren Klaff",
    source: "Pitch Anything, excerpted by Sheldon Nesdale",
    sourceUrl: "https://www.marketingfirst.co.nz/2013/10/pitch-anything-an-innovative-method-for-presenting-persuading-and-winning-the-deal-by-oren-klaff/",
    scenario: "A VC tries to bury the pitch in line-by-line diligence. Klaff redirects with an intrigue frame, then collapses neediness with a prize frame at close.",
    turns: [
      { role: "buyer", text: "Walk me through the revenue model line by line. What's gross margin on segment two?" },
      { role: "operator", text: "Revenue is $80 million, expenses are $62 million, net is $18 million. These you can verify later." },
      { role: "operator", text: "Right now what we need to focus on is this. Are we a good fit? Should we be doing business together?" },
      { role: "buyer", text: "[tries to pull back to numbers]" },
      { role: "operator", text: "There's a real possibility we're not right for each other. But if this did work out, our forces could combine into something great." },
      { role: "operator", text: "This deal will be fully subscribed in the next 14 days. We don't need VC money. We want a big name on our cap sheet." },
      { role: "operator", text: "I think you're interesting, but are you really the right investor for us?" },
    ],
    techniqueNote: "Intrigue frame (give headline numbers, defer the audit) plus push and pull tension plus prize frame at close. Buyer qualifies to operator, not the reverse.",
    techniqueIds: ["takeaway", "scarcity", "extreme-anchor", "accusation-audit"],
  },

  {
    id: "cardone-trial-close",
    title: "Trial-Close Stack (Transactional Close)",
    speaker: "Grant Cardone",
    source: "How To Close A Sale: The Ultimate Guide, grantcardone.com",
    sourceUrl: "https://grantcardone.com/close-sale/",
    scenario: "Showroom or product demo. Buyer has handled the product. Salesperson stacks low-friction trial closes to confirm fit before naming price.",
    turns: [
      { role: "operator", text: "Hey, it looks like you really like this, is that true?" },
      { role: "buyer", text: "[affirms interest]" },
      { role: "operator", text: "If you took this home would you be proud to own this?" },
      { role: "buyer", text: "[affirms]" },
      { role: "operator", text: "Do you prefer the larger or smaller version?" },
      { role: "buyer", text: "[picks one]" },
      { role: "operator", text: "How would this look in your home?" },
    ],
    techniqueNote: "Three-question affective ladder: interest, ownership, preference. Each is binary or preference-based, designed to extract micro-yeses. The 'larger or smaller' is an alternative-choice close disguised as a preference question.",
    techniqueIds: ["trial-close", "alternative-choice"],
  },

  {
    id: "cardone-yay-or-nay",
    title: "Yay or Nay (Endgame Verbal Lock)",
    speaker: "Grant Cardone",
    source: "How To Close A Sale: The Ultimate Guide, grantcardone.com",
    sourceUrl: "https://grantcardone.com/close-sale/",
    scenario: "Late-stage negotiation. Buyer hesitates over a small price gap on a large deal. Cardone reframes the gap as trivial relative to the total, then forces a binary commit.",
    turns: [
      { role: "operator", text: "You're talking about $100 in a $30,000 deal. $100 doesn't change it. Yay or nay?" },
      { role: "buyer", text: "That is true." },
      { role: "operator", text: "Yay or nay?" },
      { role: "buyer", text: "Let's do it." },
    ],
    techniqueNote: "Magnitude-anchoring (reduce price gap to its share of total) followed by forced-binary close. The repeat of 'Yay or nay?' after a qualifying acknowledgment is the lock. Refuses any third option.",
    techniqueIds: ["alternative-choice", "summary-close"],
  },

  {
    id: "cardone-snapbacks",
    title: "Four Objection Snap-Backs (Stall)",
    speaker: "Grant Cardone",
    source: "How To Close A Sale: The Ultimate Guide, grantcardone.com",
    sourceUrl: "https://grantcardone.com/close-sale/",
    scenario: "Standard objection volley. Each snap-back is a single-turn response to a common stall.",
    turns: [
      { role: "buyer", text: "I'm not buying today." },
      { role: "operator", text: "Sir, that would be my fault, not yours." },
      { role: "buyer", text: "We're not buying until..." },
      { role: "operator", text: "No problem, let me give you some idea of cost when you are ready." },
      { role: "buyer", text: "I need my wife or husband or CEO involved." },
      { role: "operator", text: "I appreciate that, and I would want that as well. I want that person involved. Follow me." },
      { role: "buyer", text: "I don't have time." },
      { role: "operator", text: "Sir, I understand you don't have time, and time is valuable to you. Let's get you figures you can live with." },
    ],
    techniqueNote: "Each response refuses the implied dismissal and converts the objection into a continuation. 'My fault not yours' is a credibility-reversal. 'Follow me' is a physical and verbal commit. 'Let me give you some idea of cost' pre-loads the next conversation without arguing the stall.",
    techniqueIds: ["trial-close", "labeling"],
  },

  {
    id: "tracy-money-reframe",
    title: "Money-Objection Hypothetical Removal",
    speaker: "Brian Tracy",
    source: "Effortlessly Diffuse The 'I Don't Have The Money' Objection, briantracy.com",
    sourceUrl: "https://www.briantracy.com/blog/sales-success/effortlessly-diffuse-the-i-dont-have-the-money-objection/",
    scenario: "Prospect raises the affordability objection. Tracy's move bypasses the logic war and tests for product-fit underneath the money concern.",
    turns: [
      { role: "buyer", text: "I don't have the money." },
      { role: "operator", text: "That's not a problem. Tell me, if you did have the money, would this be something that would work for you?" },
      { role: "buyer", text: "[If yes, fit is confirmed. If no, the real objection surfaces.]" },
    ],
    techniqueNote: "Hypothetical removal. Strip the money variable so the prospect has to answer whether the product itself is right. A yes means solve a financing problem. A no means money was a polite refusal masking something else.",
    techniqueIds: ["calibrated-question"],
  },

  {
    id: "tracy-feel-felt-found",
    title: "Feel-Felt-Found on Price",
    speaker: "Brian Tracy",
    source: "Sales Process: Handle Objections and Use Closing Techniques, briantracy.com",
    sourceUrl: "https://www.briantracy.com/blog/sales-success/sales-process-handle-objections-and-use-closing-techniques-sales-funnel/",
    scenario: "Prospect resists on price after presentation. The classic three-beat reframe.",
    turns: [
      { role: "buyer", text: "It costs too much." },
      { role: "operator", text: "I understand exactly how you feel." },
      { role: "operator", text: "Others felt the same way when they first heard the price." },
      { role: "operator", text: "But this is what they found when they began using our product or service..." },
      { role: "operator", text: "[Transition to a specific outcome story matched to the prospect's stated use case.]" },
    ],
    techniqueNote: "Acknowledge the emotion (feel), socially normalize it (felt), resolve it with concrete outcome data (found). Tracy delivers the three beats as a single uninterrupted turn.",
    techniqueIds: ["feel-felt-found"],
  },

  {
    id: "tracy-think-it-over",
    title: "Let Me Think About It (Stall Disarm)",
    speaker: "Brian Tracy",
    source: "Brian Tracy's published guidance on stall objections",
    sourceUrl: "https://www.briantracy.com/blog/sales-success/sales-process-handle-objections-and-use-closing-techniques-sales-funnel/",
    scenario: "End of presentation. Prospect deflects with the most common stall in sales. Tracy's move converts the stall back into a continuation by lowering the perceived commitment.",
    turns: [
      { role: "buyer", text: "Let me think about it." },
      { role: "operator", text: "Relax, I'm not trying to sell you anything right now. That's not the purpose of my visit." },
      { role: "operator", text: "All I ask is that you look at what I have to show you with an open mind, determine if it applies to your situation, and tell me at the end of our conversation if this product makes sense." },
      { role: "buyer", text: "[typically continues the conversation; the disarm has worked]" },
    ],
    techniqueNote: "Pressure-removal opener collapses the prospect's defensive frame. The conditional re-engagement ('tell me at the end if this makes sense') gives the prospect a graceful out, which paradoxically makes them more willing to stay engaged.",
    techniqueIds: ["takeaway", "labeling"],
  },

  {
    id: "belfort-aerotyne",
    title: "Cold-Open Qualifying Hook (Aerotyne)",
    speaker: "Jordan Belfort",
    source: "Reconstructed from Belfort's Straight Line teaching plus the 2013 film script (Wolf of Wall Street)",
    sourceUrl: "https://www.buzzlead.io/blogs/jordan-belfort-script-what-it-actually-says-and-how-to-use-it-in-cold-outreach",
    scenario: "Outbound cold call. Broker reaches a previously-interested prospect and opens with the Straight Line three-beat: name plus firm, peer-tone health check, immediate value-thesis with a small ask.",
    turns: [
      { role: "operator", text: "Hi, is this [Name]? My name is Jordan Belfort. I'm calling from Stratton Oakmont. How are you today?" },
      { role: "buyer", text: "Good." },
      { role: "operator", text: "The reason for my call is that a company just came across my desk. Aerotyne International. It's a cutting-edge tech firm out of the Midwest." },
      { role: "operator", text: "They're awaiting imminent patent approval on a new generation of radar detectors. Huge military and civilian applications." },
      { role: "operator", text: "The stock is trading at 10 cents a share. By the time the patent's approved, it's going to be trading at a dollar." },
      { role: "operator", text: "I'm not asking you to mortgage your house. I'm just asking you to make a small investment, three to four thousand, and let me prove myself to you." },
    ],
    techniqueNote: "Three-beat opener: enthusiasm (name plus firm), peer-equality ('how are you today' delivered as friend-tone), then urgency-with-scarcity. The small ask anchors a smaller commitment, making the eventual upsell feel low-risk.",
    techniqueIds: ["accusation-audit", "scarcity", "social-proof"],
    paraphrased: true,
  },
];

export function getTranscript(id: string): Transcript | undefined {
  return TRANSCRIPTS.find((t) => t.id === id);
}
